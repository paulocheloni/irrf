/* eslint-disable no-underscore-dangle -- Node's Module._load is the preload hook. */
/**
 * react-scripts 4 runs sass-loader in compressed mode for production.
 * Dart Sass then emits calc(var(--bs-gutter-y)*-1), and PostCSS 7 in
 * Create React App cannot parse the missing spaces. Expanded output keeps
 * the spaces; cssnano still minifies the finished CSS.
 *
 * quietDeps hides Bootstrap's Sass deprecation warnings. node-sass did not
 * emit them. Staying on react-scripts 4 is deliberate.
 */
const Module = require('module');
const path = require('path');

const originalLoad = Module._load;

function isSassLoaderUtils(request, parent) {
  if (!parent || !parent.filename || !parent.filename.includes(`${path.sep}sass-loader${path.sep}`)) {
    return false;
  }
  return request === './utils'
    || request.endsWith(`${path.sep}sass-loader${path.sep}dist${path.sep}utils.js`);
}

Module._load = function load(...args) {
  const exported = originalLoad.apply(this, args);
  const [request, parent] = args;
  if (!exported || typeof exported.getSassOptions !== 'function' || exported.getSassOptions.expandedOutput) {
    return exported;
  }
  if (!isSassLoaderUtils(request, parent)) {
    return exported;
  }

  const originalGetSassOptions = exported.getSassOptions;

  function getSassOptions(...sassArgs) {
    return Promise.resolve(originalGetSassOptions.apply(this, sassArgs)).then((options) => {
      const next = options;
      next.outputStyle = 'expanded';
      next.quietDeps = true;
      return next;
    });
  }

  getSassOptions.expandedOutput = true;
  exported.getSassOptions = getSassOptions;
  return exported;
};
