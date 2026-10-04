import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', '.angular/**', '.next/**', 'node_modules/**'] },
  {
    files: ['src/main.ts', 'src/app/app.*.ts', 'src/app/core/**/*.ts', 'src/app/pages/**/*.ts', 'src/app/shared/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      // Existing ScrollTrigger code uses loosely typed targets. Tighten separately.
      '@typescript-eslint/no-explicit-any': 'off',
      'no-restricted-imports': ['error', {
        paths: ['three', 'three/examples/jsm/loaders/GLTFLoader.js'].map(name => ({
          name, allowTypeImports: true,
          message: 'Load the WebGL runtime with import() only after user activation.'
        }))
      }]
    }
  }
);
