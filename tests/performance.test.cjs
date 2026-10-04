const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { checkBundles } = require('../scripts/check-bundles.cjs');

// Exercise production class methods with browser/library boundaries stubbed.
// Angular template/type checks remain part of the real production build.
function fixture({ reduced = false, desktop = true } = {}) {
  const frames = new Map();
  const tickers = new Set();
  const queries = new Map();
  const events = new Map();
  const calls = { raf: [], scroll: [], animations: 0, threeImports: 0, disposed: 0 };
  let nextFrame = 0;
  let navigation;
  let resolveModel;
  let pendingModel = false;
  const model = { position: { set() {} }, getObjectByName() {}, traverse() {} };
  const media = matches => ({ matches, listeners: new Set(),
    addEventListener(_, fn) { this.listeners.add(fn); },
    removeEventListener(_, fn) { this.listeners.delete(fn); },
    change(value) { this.matches = value; [...this.listeners].forEach(fn => fn()); }
  });
  queries.set('(prefers-reduced-motion: reduce)', media(reduced));
  queries.set('(hover: hover) and (pointer: fine)', media(desktop));
  const window = {
    scrollY: 100, devicePixelRatio: 1,
    matchMedia: query => queries.get(query),
    scrollTo: options => calls.scroll.push(options),
    addEventListener: (name, fn) => events.set(fn, name),
    removeEventListener: (_, fn) => events.delete(fn)
  };
  const document = {
    hidden: false,
    querySelector: selector => selector === '#missing' ? null : { getBoundingClientRect: () => ({ top: 300 }) },
    addEventListener: window.addEventListener,
    removeEventListener: window.removeEventListener
  };
  class NgZone { runOutsideAngular(fn) { return fn(); } run(fn) { return fn(); } }
  class Router {}
  class NavigationEnd {}
  class Lenis {
    raf(ms) { calls.raf.push(ms); }
    on() {} off() {} resize() {}
    destroy() { this.destroyed = true; }
    scrollTo(target, options) { calls.scroll.push({ target, ...options }); }
  }
  class AnimationService {}
  class SmoothScrollService {}
  class ThemeService {}
  const chain = { to() { return this; }, paused() { return this; }, pause() {}, resume() {} };
  const context = { add: fn => fn(), revert() {}, getTweens: () => [] };
  const gsap = {
    utils: { selector: () => selector => selector },
    quickTo: () => () => {},
    registerPlugin() {}, set() { calls.animations++; },
    timeline() { calls.animations++; return chain; }, to() { calls.animations++; return chain; },
    ticker: { add: fn => tickers.add(fn), remove: fn => tickers.delete(fn), lagSmoothing() {} }
  };
  class Light { position = { set() {} }; }
  class Camera extends Light { lookAt() {} updateProjectionMatrix() {} }
  class Renderer {
    setSize() {} setPixelRatio() {} render() {}
    dispose() { calls.disposed++; }
  }
  const three = {
    Scene: class { add() {} }, PerspectiveCamera: Camera, WebGLRenderer: Renderer,
    AmbientLight: Light, DirectionalLight: Light, PointLight: Light,
    Clock: class { elapsedTime = 0; start() {} stop() {} getDelta() { return 0.016; } },
    AnimationMixer: class { stopAllAction() {} uncacheRoot() {} update() {} },
    MathUtils: { lerp: (from, to, amount) => from + (to - from) * amount }
  };
  const decorators = () => () => {};
  const deps = {
    '@angular/core': { Injectable: decorators, Component: decorators, ViewChild: decorators, NgZone,
      signal: value => { const read = () => value; read.set = next => { value = next; }; return read; },
      inject: token => token === NgZone ? new NgZone() : token === Router
        ? { events: { pipe: () => ({ subscribe: fn => { navigation = fn; return { unsubscribe() { navigation = undefined; } }; } }) } }
        : token === AnimationService ? { createContext: (_, fn) => { fn(context); return context; } }
          : { scrollTo() {} }
    },
    '@angular/common': {}, '@angular/router': { Router, NavigationEnd },
    'rxjs': {}, 'rxjs/operators': { filter() {} }, lenis: { default: Lenis },
    gsap: { gsap }, 'gsap/ScrollTrigger': { ScrollTrigger: { update() {}, refresh() {} } },
    '../../../../core/services/animation.service': { AnimationService },
    '../../../../core/services/smooth-scroll.service': { SmoothScrollService },
    '../../../core/services/smooth-scroll.service': { SmoothScrollService },
    '../../../core/services/theme.service': { ThemeService },
    '../../data/solutions.data': { SOLUTIONS_DATA: [] },
    '../../data/industries.data': { INDUSTRIES_DATA: [] },
    '../../data/services.data': { SERVICES_DATA: [] },
    three,
    'three/examples/jsm/loaders/GLTFLoader.js': { GLTFLoader: class {
      async loadAsync() {
        if (pendingModel) await new Promise(resolve => { resolveModel = resolve; });
        return { scene: model, animations: [] };
      }
    } }
  };
  const load = file => {
    const module = { exports: {} };
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true }
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports,
      require: name => { if (name.startsWith('three')) calls.threeImports++; if (!(name in deps)) throw new Error(name); return deps[name]; },
      window, document, console,
      requestAnimationFrame: fn => { frames.set(++nextFrame, fn); return nextFrame; },
      cancelAnimationFrame: id => frames.delete(id),
      setTimeout: () => 1, clearTimeout() {}
    });
    return module.exports;
  };
  const service = () => new (load('src/app/core/services/smooth-scroll.service.ts').SmoothScrollService)();
  const hero = () => {
    const instance = new (load('src/app/pages/home/components/hero/hero.component.ts').HomeHeroComponent)();
    instance.heroRef = { nativeElement: {
      getBoundingClientRect: () => ({ top: 0, left: 0, width: 400, height: 400 }),
      addEventListener: window.addEventListener, removeEventListener: window.removeEventListener
    } };
    instance.robotCanvasRef = { nativeElement: { clientWidth: 340, clientHeight: 460 } };
    return instance;
  };
  const navbar = () => new (load('src/app/shared/components/navbar/navbar.component.ts').NavbarComponent)();
  return { service, hero, navbar, queries, tickers, frames, calls, events, document,
    scroll: y => {
      window.scrollY = y;
      events.forEach((name, fn) => { if (name === 'scroll') fn(); });
    },
    navigate: () => navigation?.(new NavigationEnd()),
    deferModel: () => { pendingModel = true; }, finishModel: () => resolveModel?.()
  };
}

test('desktop uses one ticker and converts seconds to milliseconds', () => {
  const f = fixture(); const service = f.service(); service.initSmoothScroll();
  assert.equal(f.tickers.size, 1);
  [...f.tickers][0](1.25); assert.equal(f.calls.raf[0], 1250);
  service.initSmoothScroll(); assert.equal(f.tickers.size, 1);
  service.destroy(); assert.equal(f.tickers.size, 0); assert.equal(f.frames.size, 0);
});

for (const options of [{ desktop: false }, { reduced: true }]) {
  test(`native instant anchors retain header offsets: ${JSON.stringify(options)}`, () => {
    const f = fixture(options); const service = f.service(); service.initSmoothScroll();
    assert.equal(service.getLenis(), null); assert.equal(f.tickers.size, 0);
    service.scrollTo('#contact-section');
    assert.equal(f.calls.scroll[0].top, 320); assert.equal(f.calls.scroll[0].behavior, 'instant');
    service.scrollTo('#missing'); assert.equal(f.calls.scroll.length, 1);
  });
}

test('live reduced motion removes Lenis and restores it with one ticker', () => {
  const f = fixture(); const service = f.service(); service.initSmoothScroll();
  const previous = service.getLenis();
  f.queries.get('(prefers-reduced-motion: reduce)').change(true);
  assert.equal(previous.destroyed, true); assert.equal(f.tickers.size, 0);
  f.queries.get('(prefers-reduced-motion: reduce)').change(false);
  assert.equal(f.tickers.size, 1);
  service.destroy();
  f.queries.get('(prefers-reduced-motion: reduce)').change(false);
  assert.equal(f.tickers.size, 0);
});

test('navigation refresh does not override router scroll restoration', () => {
  const f = fixture(); const service = f.service(); service.initSmoothScroll(); f.navigate();
  assert.equal(f.calls.scroll.length, 0); assert.equal(f.frames.size, 1);
});

test('classic hero never imports Three.js or starts a WebGL frame loop', () => {
  const f = fixture(); const hero = f.hero(); hero.ngAfterViewInit();
  assert.equal(f.calls.threeImports, 0); assert.equal(f.frames.size, 0);
  hero.ngOnDestroy(); assert.equal(f.events.size, 0);
});

test('reduced-motion hero has no GSAP animations or animated interactions', () => {
  const f = fixture({ reduced: true }); const hero = f.hero(); hero.ngAfterViewInit();
  hero.onHandClick('left'); hero.onEyeClick(); hero.onStomachClick();
  assert.equal(f.calls.animations, 0); assert.equal(f.calls.threeImports, 0);
  hero.ngOnDestroy();
});

test('robot activation loads once; classic/offscreen/hidden/reduced modes stop RAF', async () => {
  const f = fixture(); const hero = f.hero(); hero.ngAfterViewInit();
  await hero.toggleGLBMode(); assert.equal(f.calls.threeImports, 2); assert.equal(f.frames.size, 1);
  await hero.toggleGLBMode(); assert.equal(f.frames.size, 0);
  await hero.toggleGLBMode(); assert.equal(f.calls.threeImports, 2); assert.equal(f.frames.size, 1);
  hero.isHeroVisible = false; hero.syncRenderLoop(); assert.equal(f.frames.size, 0);
  hero.isHeroVisible = true; hero.syncRenderLoop(); assert.equal(f.frames.size, 1);
  f.document.hidden = true; hero.visibilityHandler(); assert.equal(f.frames.size, 0);
  f.document.hidden = false; hero.visibilityHandler(); assert.equal(f.frames.size, 1);
  f.queries.get('(prefers-reduced-motion: reduce)').change(true); assert.equal(f.frames.size, 0);
  hero.ngOnDestroy(); assert.equal(f.events.size, 0); assert.equal(f.calls.disposed, 1);
});

test('navigation away during model loading cannot restart a destroyed hero', async () => {
  const f = fixture(); f.deferModel(); const hero = f.hero(); hero.ngAfterViewInit();
  const load = hero.toggleGLBMode();
  // Flush the dynamic imports and reach the deferred GLB boundary.
  await new Promise(resolve => setImmediate(resolve));
  hero.ngOnDestroy(); f.finishModel(); await load;
  assert.equal(f.frames.size, 0); assert.equal(f.events.size, 0); assert.equal(hero.isGLBViewActive(), false);
});

test('bundle guard rejects Three.js in static home dependencies, including shared chunks', () => {
  const stats = { outputs: {
    'main.js': { bytes: 100, imports: [], inputs: {} },
    'home.js': { bytes: 100, entryPoint: 'src/app/pages/home/home.component.ts', imports: [{ path: 'shared.js', kind: 'import-statement' }], inputs: {} },
    'shared.js': { bytes: 100, imports: [], inputs: { 'node_modules/three/build/three.module.js': {} } }
  } };
  assert.throws(() => checkBundles(stats), /Three.js leaked/);
  stats.outputs['home.js'].imports[0].kind = 'dynamic-import';
  assert.equal(checkBundles(stats).homeBytes, 100);
});

test('header remains collapsed across small scroll reversals and initializes restored scroll', () => {
  const f = fixture(); const navbar = f.navbar(); navbar.ngOnInit();
  assert.equal(navbar.isScrolled(), true, 'restored scroll is reflected immediately');
  f.scroll(0); assert.equal(navbar.isScrolled(), false);
  for (const y of [29, 31, 28, 32, 47]) {
    f.scroll(y); assert.equal(navbar.isScrolled(), false);
  }
  f.scroll(49); assert.equal(navbar.isScrolled(), true);
  for (const y of [31, 29, 32, 9]) {
    f.scroll(y); assert.equal(navbar.isScrolled(), true);
  }
  f.scroll(8); assert.equal(navbar.isScrolled(), false);
  navbar.ngOnDestroy(); assert.equal(f.events.size, 0);
});

test('hero visibility preserves completed reveals and idle pointer tweens', () => {
  // Use real GSAP to catch lifecycle bugs hidden by the lightweight unit mocks.
  const { gsap } = require('gsap');
  const f = fixture(); const hero = f.hero();
  const reveal = { opacity: 0 };
  let timeline, pointer, ambient;
  const context = gsap.context(() => {
    timeline = gsap.timeline({ paused: true }).to(reveal, { opacity: 1, duration: 1 }).progress(1);
    pointer = gsap.to({ x: 0 }, { x: 1, duration: 1, paused: true });
    ambient = gsap.to({ y: 0 }, { y: 12, duration: 3, repeat: -1, yoyo: true });
  });
  hero.ctx = context;
  hero.ambientAnimations = [ambient];
  try {
    for (let cycle = 0; cycle < 3; cycle++) {
      hero.isHeroVisible = false; hero.visibilityHandler();
      assert.equal(ambient.paused(), true);
      hero.isHeroVisible = true; hero.visibilityHandler();
      assert.equal(ambient.paused(), false);
      assert.equal(pointer.paused(), true, 'visibility must not start quickTo-style idle tweens');
      assert.equal(timeline.progress(), 1);
      assert.equal(reveal.opacity, 1);
    }
  } finally {
    context.revert(); gsap.ticker.sleep();
  }
});
