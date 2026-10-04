const fs = require('node:fs');
const path = require('node:path');

function checkBundles(stats) {
  const outputs = stats.outputs;
  if (!outputs) throw new Error('Expected Angular/esbuild outputs in stats.json');
  const names = Object.keys(outputs);
  const resolveImport = (from, imported) => {
    if (outputs[imported]) return imported;
    const relative = path.posix.join(path.posix.dirname(from), imported);
    return outputs[relative] ? relative : names.find(name => path.posix.basename(name) === imported);
  };
  const visitStatic = roots => {
    const visited = new Set();
    const visit = name => {
      if (!name || visited.has(name)) return;
      visited.add(name);
      for (const imported of outputs[name].imports ?? []) {
        if (!imported.external && imported.kind !== 'dynamic-import') visit(resolveImport(name, imported.path));
      }
    };
    roots.forEach(visit);
    return visited;
  };
  const roots = names.filter(name => /(?:^|\/)(?:main|polyfills|styles)[-.]/.test(name));
  const homes = names.filter(name => outputs[name].entryPoint?.replaceAll('\\', '/').endsWith('/home.component.ts'));
  if (!roots.length || homes.length !== 1) throw new Error('Could not identify initial and home bundles');
  const initial = visitStatic(roots);
  const home = visitStatic(homes);
  const bytes = set => [...set].reduce((sum, name) => sum + outputs[name].bytes, 0);
  const initialBytes = bytes(initial);
  const homeBytes = bytes(new Set([...home].filter(name => !initial.has(name))));
  if (initialBytes > 550_000) throw new Error(`Initial bundle grew to ${initialBytes} bytes (limit 550000)`);
  if (homeBytes > 250_000) throw new Error(`Home dependencies grew to ${homeBytes} bytes (limit 250000)`);
  for (const name of new Set([...initial, ...home])) {
    for (const input of Object.keys(outputs[name].inputs ?? {})) {
      if (/(?:^|\/)node_modules\/three\//.test(input.replaceAll('\\', '/'))) {
        throw new Error(`Three.js leaked into initial/home static graph: ${name}`);
      }
    }
  }
  return { initialBytes, homeBytes };
}

if (require.main === module) {
  const statsPath = ['dist/mmksoftworks/stats.json', 'dist/mmksoftworks/browser/stats.json'].find(file => fs.existsSync(file));
  if (!statsPath) throw new Error('Run ng build --stats-json first');
  console.log('Bundle checks passed:', checkBundles(JSON.parse(fs.readFileSync(statsPath, 'utf8'))));
}
module.exports = { checkBundles };
