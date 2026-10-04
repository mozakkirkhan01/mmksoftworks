# Scroll performance implementation

## 1. Desktop smooth scrolling

`SmoothScrollService` initializes Lenis only for `(hover: hover) and (pointer: fine)` with reduced motion disabled. Touch scrolling stays native (`syncTouch: false`), including touch on hybrid desktop devices. Media-query changes destroy or recreate the instance and ticker. Native anchor calls use instant scrolling and the existing -80px header offset.

```ts
this.ngZone.runOutsideAngular(() => {
  this.lenis = new Lenis({
    lerp: 0.1, smoothWheel: true, syncTouch: false,
    wheelMultiplier: 1, autoRaf: false
  });
  this.lenis.on('scroll', ScrollTrigger.update);
  this.tickerCallback = seconds => this.lenis?.raf(seconds * 1000);
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(this.tickerCallback);
});
```

GSAP's ticker uses requestAnimationFrame, so do not add another Lenis RAF loop. Cleanup removes the ticker, destroys Lenis, cancels pending refreshes, and removes media-query/router listeners. Angular Router owns navigation restoration and fragments; the service only schedules a coalesced ScrollTrigger refresh after navigation.

The root `AppComponent` already initializes/destroys the service. Keep native `scroll-behavior` at auto. One animation clock avoids drift, and running outside Angular avoids change detection on every tick. Lenis changes the feel of wheel input; it cannot make expensive application work fit the frame budget by itself.

## 2. Optional Three.js runtime

The hero uses erased type imports, with runtime imports inside the activation path:

```ts
import type * as THREE from 'three';

const [THREE, { GLTFLoader }] = await Promise.all([
  import('three'),
  import('three/examples/jsm/loaders/GLTFLoader.js')
]);
```

`toggleGLBMode()` awaits one cached initialization promise. The classic robot stays visible during loading; failure allows retry. No library import, model request, renderer creation, or WebGL RAF runs on the default homepage path. Navigating away during loading cannot restart a destroyed component.

RAF only runs for loaded, selected 3D mode while the hero intersects the viewport, the document is visible, and reduced motion is off. Rendering a selected 3D robot under reduced motion uses a still frame. Frame deltas are clamped after interruptions. Destroying the hero releases geometries, materials, textures, renderer, animation mixer, observers, timers, and listeners.

## 3. GSAP and CSS motion

Reveal animations use opacity and transform (`y`, scale, rotation) with `force3D: true`; no animated top/left/margin. Static left/top positions remain valid layout anchors. Eye flashes and repeating reactor/hint effects use opacity/scale with fixed shadows instead of animating box-shadow. Pointer tracking reuses `gsap.quickTo()` setters and runs at most once per RAF. Pointer geometry is cached and corrected for scroll position.

```ts
gsap.set('.hero-reveal', { opacity: 0, y: 35, force3D: true });
gsap.to('.hero-reveal', {
  opacity: 1, y: 0, duration: 0.9, stagger: 0.15, force3D: true
});
```

The hero owns a live reduced-motion listener that reverts its context and disables interactive motion. Shared section animations use `gsap.matchMedia()` through `AnimationService`, so their ScrollTriggers are reverted when the setting changes. Global reduced-motion CSS disables animations/transitions. Do not kill every GSAP tween globally: revert the component-owned context.

Transform/opacity avoid layout on every frame and can be composited efficiently. This does not guarantee that every layer or filter is GPU-only; inspect paint and raster costs in a browser trace. Avoid applying will-change to every element because excessive layers consume memory.

## 4. Repository cleanup strategy

Legacy source removal is deliberately separate from the functional performance changes. Legacy files excluded from Angular's import graph do not contribute to the JavaScript bundle. First create a clean checkpoint, then verify references from the active entry graph (`src/main.ts`, `src/app/app.*.ts`, core, shared, pages).

Candidates to remove after reference verification:

- `src/components`, `src/animations`, `src/hooks`, `src/data`, `src/lib`.
- Legacy `src/app/**/page.tsx`, `src/app/layout.tsx`, `src/app/global.ts`, `src/app/globals.css`.
- Legacy Next.js `src/app/api/contact/route.ts`: it is not an API endpoint in this Angular/Vercel configuration.

Keep Angular `src/app/pages`, `src/app/core`, `src/app/shared`, `src/styles`, and active assets. Audit `public` and `src/assets` separately: Angular currently copies both recursively, even when the source files are unused. Preserve `/public` URL conventions when changing asset globs. In particular, retain `src/assets/models/robot.glb` and the classic robot images.

`/dist/` is now ignored. To untrack existing generated files while keeping local build output, use:

```sh
git rm -r --cached -- dist
git diff --cached --stat
npm run build:check
```

Review the staged deletions and commit them together with `.gitignore`. This changes the Git index, not local build files. Vercel already runs `npm run build` and publishes `dist/mmksoftworks/browser`, so generated files need not be committed. The index command and legacy deletions have not been executed as part of this implementation.

## 5. Quality checks and bundle budgets

```sh
npm ci
npm run lint
npm test
npm run build:check
```

ESLint flat config targets the active Angular TypeScript source. It checks unused variables and recommended TypeScript rules and disallows static runtime imports of Three.js/GLTFLoader while allowing type imports. HTML template linting can be added later with angular-eslint; Angular's production build already validates templates/types.

Node regression tests exercise production methods through mocked browser/library boundaries: desktop ticker integration, touch/native anchors, live preferences, navigation, robot loading once, hidden/offscreen RAF shutdown, and navigation away during an in-flight load. These are unit tests, not a real GPU benchmark.

The GitHub Actions workflow runs lint, tests, and a production build on PRs and pushes to main. Angular enforces a 500KB initial warning and 550KB initial error budget. The graph checker also limits the additional home static dependency graph to 250KB and rejects Three.js anywhere in the initial/home static graph, including shared dependencies. Lazy import edges are excluded deliberately. Raw size limits are guardrails; transfer, parse, execution, and rendering costs need separate profiling.

## 6. Validate actual frame pacing

1. Profile a production build in Chrome DevTools Performance on representative desktop and mobile hardware.
2. Record 10–15 seconds of scrolling in classic mode. Check dropped frames, long tasks, layout/paint, and script execution; at 60Hz the whole frame budget is approximately 16.7ms.
3. Verify no Three.js chunks or GLB download before activation, then activate 3D and repeat the trace.
4. Navigate away and back repeatedly, toggle 3D/classic while loading, and verify no accumulation of RAF/listeners/resources.
5. Test reduced-motion enabled before loading and toggled during the session. Content must remain visible and anchors instant.
6. Test touch scrolling, desktop keyboard navigation, route restoration, and hash links. Check expensive blur/drop-shadow layers if paint still dominates.

The changes remove identified causes of jank; a sustained 60fps claim requires these measured traces.
