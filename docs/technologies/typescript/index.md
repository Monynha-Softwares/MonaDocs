---
title: TypeScript
---

## Description

TypeScript is a superset of JavaScript that adds optional static typing. It helps catch errors earlier and improves code readability and maintainability.

## Why we use it

- Better maintainability
- Compile-time error detection
- Improved IDE and editor support (autocompletion, refactorings)

## Projects that use TypeScript

- Monynha-com
- Several web projects in this repo

## Resources

- [TypeScript Official Docs](https://www.typescriptlang.org/docs/)

If you previously referenced `/docs/tecnologias/typescript`, the Portuguese content remains under that path — this English page is a compatibility stub to ensure internal links to `/docs/technologies/typescript` resolve correctly.

## Advanced configuration and commands

### Recommended `tsconfig.json` snippets

```json
{
	"compilerOptions": {
		"target": "ES2022",
		"module": "ESNext",
		"moduleResolution": "node",
		"strict": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"skipLibCheck": true,
		"incremental": true,
		"tsBuildInfoFile": "./.tsbuildinfo",
		"declaration": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist"]
}
```

### Useful `tsc` commands

- Type check without emitting: `npx tsc --noEmit`
- Build with project references: `npx tsc -b`
- Watch incremental changes: `npx tsc -w --preserveWatchOutput`

### Project references (monorepo)

- Split large codebases using `composite` projects and `references` to enable fast, incremental builds.

`tsconfig.build.json` in package A

```json
{
	"compilerOptions": { "composite": true, "outDir": "lib" },
	"references": []
}
```

Then in the root `tsconfig.json` use `references` to link packages.

### Path aliases and bundler coordination

- Use `baseUrl` and `paths` in `tsconfig.json` and wire the same aliases into your bundler (Vite, webpack) and test runner to avoid import resolution mismatches.

### Linting & formatting

- Use ESLint with `@typescript-eslint` parser and rules. Example minimal `.eslintrc.json`:

```json
{
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint"],
	"extends": ["eslint:recommended","plugin:@typescript-eslint/recommended"],
	"rules": { "@typescript-eslint/explicit-module-boundary-types": "off" }
}
```

### Migration tips (JS → TS)

- Start with `allowJs` + `checkJs` to progressively add type checking.
- Introduce `strict` mode incrementally by enabling `strict` once most code is typed.
- Use `unknown` instead of `any` for safer runtime validation points.

## Team & DX recommendations

- Standardize Node/TS versions using `.nvmrc` or `engines` in `package.json`.
- Add `tsc --noEmit` to pre-commit or CI gates to prevent type-unsafe merges.
- Provide a shared `types/` package in monorepos for cross-package types and interfaces.

## Resources

- TypeScript docs: https://www.typescriptlang.org/docs/

