const path = require('path');

const rootPath = path.resolve(__dirname, '../..');

const srcPath = path.resolve(rootPath, 'src');
const srcMainPath = path.resolve(srcPath, 'main');
const srcRendererPath = path.resolve(srcPath, 'renderer');

const appPackagePath = path.resolve(rootPath, 'package.json');
const appNodeModulesPath = path.resolve(rootPath, 'node_modules');

const distPath = path.resolve(rootPath, 'dist');
const distMainPath = path.resolve(distPath, 'main');
const distRendererPath = path.resolve(distPath, 'renderer');

const buildPath = path.resolve(rootPath, 'build');

export default {
  rootPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  appPackagePath,
  appNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  buildPath,
};
