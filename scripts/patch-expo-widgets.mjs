import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'widgets/ios/Module.swift');
const destination = join(root, 'node_modules/@bittingz/expo-widgets/ios/ExpoWidgetsModule.swift');
const podfilePlugin = join(root, 'node_modules/@bittingz/expo-widgets/plugin/build/ios/withPodfile.js');

if (existsSync(source) && existsSync(destination)) {
  copyFileSync(source, destination);
  console.log('[patch-expo-widgets] Applied custom iOS widget module.');
}

if (existsSync(podfilePlugin)) {
  writeFileSync(
    podfilePlugin,
    `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPodfile = void 0;
const withPodfile = (config) => config;
exports.withPodfile = withPodfile;
`
  );
  console.log('[patch-expo-widgets] Disabled incompatible Podfile mutation.');
}
