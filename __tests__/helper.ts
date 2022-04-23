import { ES6ClassUglify } from '../src';

export const run = function (code) {
  const es6ClassUglify = new ES6ClassUglify();
  return es6ClassUglify.minify(code).code;
};
