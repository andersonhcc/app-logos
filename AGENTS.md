# Repository Guidelines

## Project Structure & Module Organization

This repository is an Expo 54 React Native app written in strict TypeScript. Routes live in `app/`; route groups such as `app/(onboarding)` and `app/(tabs)` organize flows without changing URLs. Reusable views belong in `components/`, with primitives in `components/ui/`. Put application logic and integrations in `lib/`, shared hooks in `hooks/`, and design tokens in `theme/`. Static images, icons, and Bible data live under `assets/`. One-off data utilities belong in `scripts/`.

Use the `@/` alias for imports from the repository root. Keep platform-specific implementations beside their shared counterpart, as in `hooks/use-color-scheme.web.ts`.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies.
- `npm start` starts the Expo development server.
- `npm run ios` or `npm run android` creates and launches a native development build.
- `npm run web` runs the web target.
- `npm run lint` checks the project with Expo's ESLint configuration.
- `npm run fetch:bible` refreshes the local Bible dataset; review generated asset changes before committing.

## Coding Style & Naming Conventions

Use two-space indentation, single quotes, semicolons, and trailing commas where the existing TypeScript does. Name components and exported types in PascalCase, hooks with a `use-` filename and `useX` function, and other modules in lowercase kebab-case. Prefer named exports for reusable modules and default exports only where Expo Router requires them. Keep styling aligned with the existing NativeWind utilities and centralized tokens in `theme/`; avoid duplicating raw colors and spacing values.

## Testing Guidelines

No automated test runner or coverage threshold is currently configured. Before opening a pull request, run `npm run lint` and exercise changed flows on the relevant Expo target(s). For logic-heavy additions, introduce colocated `*.test.ts` or `*.test.tsx` files together with an appropriate test script and framework configuration.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit subjects such as `feat: add onboarding redirect` and `chore: update .gitignore`. Keep each commit focused and use an imperative summary. Pull requests should explain the behavior change, list verification steps and platforms, link related issues, and include screenshots or recordings for UI changes.

## Security & Configuration

Configure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in a local environment file. Never commit service-role keys, credentials, or `.env*.local` files; values prefixed with `EXPO_PUBLIC_` are bundled into the client and are not secrets.
