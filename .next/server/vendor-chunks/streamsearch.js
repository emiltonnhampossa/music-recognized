"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/streamsearch";
exports.ids = ["vendor-chunks/streamsearch"];
exports.modules = {

/***/ "(rsc)/./node_modules/streamsearch/lib/sbmh.js":
/*!***********************************************!*\
  !*** ./node_modules/streamsearch/lib/sbmh.js ***!
  \***********************************************/
/***/ ((module) => {

eval("\n/*\n  Based heavily on the Streaming Boyer-Moore-Horspool C++ implementation\n  by Hongli Lai at: https://github.com/FooBarWidget/boyer-moore-horspool\n*/\nfunction memcmp(buf1, pos1, buf2, pos2, num) {\n  for (let i = 0; i < num; ++i) {\n    if (buf1[pos1 + i] !== buf2[pos2 + i])\n      return false;\n  }\n  return true;\n}\n\nclass SBMH {\n  constructor(needle, cb) {\n    if (typeof cb !== 'function')\n      throw new Error('Missing match callback');\n\n    if (typeof needle === 'string')\n      needle = Buffer.from(needle);\n    else if (!Buffer.isBuffer(needle))\n      throw new Error(`Expected Buffer for needle, got ${typeof needle}`);\n\n    const needleLen = needle.length;\n\n    this.maxMatches = Infinity;\n    this.matches = 0;\n\n    this._cb = cb;\n    this._lookbehindSize = 0;\n    this._needle = needle;\n    this._bufPos = 0;\n\n    this._lookbehind = Buffer.allocUnsafe(needleLen);\n\n    // Initialize occurrence table.\n    this._occ = [\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,\n      needleLen, needleLen, needleLen, needleLen\n    ];\n\n    // Populate occurrence table with analysis of the needle, ignoring the last\n    // letter.\n    if (needleLen > 1) {\n      for (let i = 0; i < needleLen - 1; ++i)\n        this._occ[needle[i]] = needleLen - 1 - i;\n    }\n  }\n\n  reset() {\n    this.matches = 0;\n    this._lookbehindSize = 0;\n    this._bufPos = 0;\n  }\n\n  push(chunk, pos) {\n    let result;\n    if (!Buffer.isBuffer(chunk))\n      chunk = Buffer.from(chunk, 'latin1');\n    const chunkLen = chunk.length;\n    this._bufPos = pos || 0;\n    while (result !== chunkLen && this.matches < this.maxMatches)\n      result = feed(this, chunk);\n    return result;\n  }\n\n  destroy() {\n    const lbSize = this._lookbehindSize;\n    if (lbSize)\n      this._cb(false, this._lookbehind, 0, lbSize, false);\n    this.reset();\n  }\n}\n\nfunction feed(self, data) {\n  const len = data.length;\n  const needle = self._needle;\n  const needleLen = needle.length;\n\n  // Positive: points to a position in `data`\n  //           pos == 3 points to data[3]\n  // Negative: points to a position in the lookbehind buffer\n  //           pos == -2 points to lookbehind[lookbehindSize - 2]\n  let pos = -self._lookbehindSize;\n  const lastNeedleCharPos = needleLen - 1;\n  const lastNeedleChar = needle[lastNeedleCharPos];\n  const end = len - needleLen;\n  const occ = self._occ;\n  const lookbehind = self._lookbehind;\n\n  if (pos < 0) {\n    // Lookbehind buffer is not empty. Perform Boyer-Moore-Horspool\n    // search with character lookup code that considers both the\n    // lookbehind buffer and the current round's haystack data.\n    //\n    // Loop until\n    //   there is a match.\n    // or until\n    //   we've moved past the position that requires the\n    //   lookbehind buffer. In this case we switch to the\n    //   optimized loop.\n    // or until\n    //   the character to look at lies outside the haystack.\n    while (pos < 0 && pos <= end) {\n      const nextPos = pos + lastNeedleCharPos;\n      const ch = (nextPos < 0\n                  ? lookbehind[self._lookbehindSize + nextPos]\n                  : data[nextPos]);\n\n      if (ch === lastNeedleChar\n          && matchNeedle(self, data, pos, lastNeedleCharPos)) {\n        self._lookbehindSize = 0;\n        ++self.matches;\n        if (pos > -self._lookbehindSize)\n          self._cb(true, lookbehind, 0, self._lookbehindSize + pos, false);\n        else\n          self._cb(true, undefined, 0, 0, true);\n\n        return (self._bufPos = pos + needleLen);\n      }\n\n      pos += occ[ch];\n    }\n\n    // No match.\n\n    // There's too few data for Boyer-Moore-Horspool to run,\n    // so let's use a different algorithm to skip as much as\n    // we can.\n    // Forward pos until\n    //   the trailing part of lookbehind + data\n    //   looks like the beginning of the needle\n    // or until\n    //   pos == 0\n    while (pos < 0 && !matchNeedle(self, data, pos, len - pos))\n      ++pos;\n\n    if (pos < 0) {\n      // Cut off part of the lookbehind buffer that has\n      // been processed and append the entire haystack\n      // into it.\n      const bytesToCutOff = self._lookbehindSize + pos;\n\n      if (bytesToCutOff > 0) {\n        // The cut off data is guaranteed not to contain the needle.\n        self._cb(false, lookbehind, 0, bytesToCutOff, false);\n      }\n\n      self._lookbehindSize -= bytesToCutOff;\n      lookbehind.copy(lookbehind, 0, bytesToCutOff, self._lookbehindSize);\n      lookbehind.set(data, self._lookbehindSize);\n      self._lookbehindSize += len;\n\n      self._bufPos = len;\n      return len;\n    }\n\n    // Discard lookbehind buffer.\n    self._cb(false, lookbehind, 0, self._lookbehindSize, false);\n    self._lookbehindSize = 0;\n  }\n\n  pos += self._bufPos;\n\n  const firstNeedleChar = needle[0];\n\n  // Lookbehind buffer is now empty. Perform Boyer-Moore-Horspool\n  // search with optimized character lookup code that only considers\n  // the current round's haystack data.\n  while (pos <= end) {\n    const ch = data[pos + lastNeedleCharPos];\n\n    if (ch === lastNeedleChar\n        && data[pos] === firstNeedleChar\n        && memcmp(needle, 0, data, pos, lastNeedleCharPos)) {\n      ++self.matches;\n      if (pos > 0)\n        self._cb(true, data, self._bufPos, pos, true);\n      else\n        self._cb(true, undefined, 0, 0, true);\n\n      return (self._bufPos = pos + needleLen);\n    }\n\n    pos += occ[ch];\n  }\n\n  // There was no match. If there's trailing haystack data that we cannot\n  // match yet using the Boyer-Moore-Horspool algorithm (because the trailing\n  // data is less than the needle size) then match using a modified\n  // algorithm that starts matching from the beginning instead of the end.\n  // Whatever trailing data is left after running this algorithm is added to\n  // the lookbehind buffer.\n  while (pos < len) {\n    if (data[pos] !== firstNeedleChar\n        || !memcmp(data, pos, needle, 0, len - pos)) {\n      ++pos;\n      continue;\n    }\n    data.copy(lookbehind, 0, pos, len);\n    self._lookbehindSize = len - pos;\n    break;\n  }\n\n  // Everything until `pos` is guaranteed not to contain needle data.\n  if (pos > 0)\n    self._cb(false, data, self._bufPos, pos < len ? pos : len, true);\n\n  self._bufPos = len;\n  return len;\n}\n\nfunction matchNeedle(self, data, pos, len) {\n  const lb = self._lookbehind;\n  const lbSize = self._lookbehindSize;\n  const needle = self._needle;\n\n  for (let i = 0; i < len; ++i, ++pos) {\n    const ch = (pos < 0 ? lb[lbSize + pos] : data[pos]);\n    if (ch !== needle[i])\n      return false;\n  }\n  return true;\n}\n\nmodule.exports = SBMH;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc3RyZWFtc2VhcmNoL2xpYi9zYm1oLmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseURBQXlELGNBQWM7O0FBRXZFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL211c2ljLXBsYXllci8uL25vZGVfbW9kdWxlcy9zdHJlYW1zZWFyY2gvbGliL3NibWguanM/OGExYyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4vKlxuICBCYXNlZCBoZWF2aWx5IG9uIHRoZSBTdHJlYW1pbmcgQm95ZXItTW9vcmUtSG9yc3Bvb2wgQysrIGltcGxlbWVudGF0aW9uXG4gIGJ5IEhvbmdsaSBMYWkgYXQ6IGh0dHBzOi8vZ2l0aHViLmNvbS9Gb29CYXJXaWRnZXQvYm95ZXItbW9vcmUtaG9yc3Bvb2xcbiovXG5mdW5jdGlvbiBtZW1jbXAoYnVmMSwgcG9zMSwgYnVmMiwgcG9zMiwgbnVtKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtOyArK2kpIHtcbiAgICBpZiAoYnVmMVtwb3MxICsgaV0gIT09IGJ1ZjJbcG9zMiArIGldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5jbGFzcyBTQk1IIHtcbiAgY29uc3RydWN0b3IobmVlZGxlLCBjYikge1xuICAgIGlmICh0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgbWF0Y2ggY2FsbGJhY2snKTtcblxuICAgIGlmICh0eXBlb2YgbmVlZGxlID09PSAnc3RyaW5nJylcbiAgICAgIG5lZWRsZSA9IEJ1ZmZlci5mcm9tKG5lZWRsZSk7XG4gICAgZWxzZSBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihuZWVkbGUpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBCdWZmZXIgZm9yIG5lZWRsZSwgZ290ICR7dHlwZW9mIG5lZWRsZX1gKTtcblxuICAgIGNvbnN0IG5lZWRsZUxlbiA9IG5lZWRsZS5sZW5ndGg7XG5cbiAgICB0aGlzLm1heE1hdGNoZXMgPSBJbmZpbml0eTtcbiAgICB0aGlzLm1hdGNoZXMgPSAwO1xuXG4gICAgdGhpcy5fY2IgPSBjYjtcbiAgICB0aGlzLl9sb29rYmVoaW5kU2l6ZSA9IDA7XG4gICAgdGhpcy5fbmVlZGxlID0gbmVlZGxlO1xuICAgIHRoaXMuX2J1ZlBvcyA9IDA7XG5cbiAgICB0aGlzLl9sb29rYmVoaW5kID0gQnVmZmVyLmFsbG9jVW5zYWZlKG5lZWRsZUxlbik7XG5cbiAgICAvLyBJbml0aWFsaXplIG9jY3VycmVuY2UgdGFibGUuXG4gICAgdGhpcy5fb2NjID0gW1xuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbixcbiAgICAgIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sXG4gICAgICBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuLFxuICAgICAgbmVlZGxlTGVuLCBuZWVkbGVMZW4sIG5lZWRsZUxlbiwgbmVlZGxlTGVuXG4gICAgXTtcblxuICAgIC8vIFBvcHVsYXRlIG9jY3VycmVuY2UgdGFibGUgd2l0aCBhbmFseXNpcyBvZiB0aGUgbmVlZGxlLCBpZ25vcmluZyB0aGUgbGFzdFxuICAgIC8vIGxldHRlci5cbiAgICBpZiAobmVlZGxlTGVuID4gMSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWVkbGVMZW4gLSAxOyArK2kpXG4gICAgICAgIHRoaXMuX29jY1tuZWVkbGVbaV1dID0gbmVlZGxlTGVuIC0gMSAtIGk7XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5tYXRjaGVzID0gMDtcbiAgICB0aGlzLl9sb29rYmVoaW5kU2l6ZSA9IDA7XG4gICAgdGhpcy5fYnVmUG9zID0gMDtcbiAgfVxuXG4gIHB1c2goY2h1bmssIHBvcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoY2h1bmspKVxuICAgICAgY2h1bmsgPSBCdWZmZXIuZnJvbShjaHVuaywgJ2xhdGluMScpO1xuICAgIGNvbnN0IGNodW5rTGVuID0gY2h1bmsubGVuZ3RoO1xuICAgIHRoaXMuX2J1ZlBvcyA9IHBvcyB8fCAwO1xuICAgIHdoaWxlIChyZXN1bHQgIT09IGNodW5rTGVuICYmIHRoaXMubWF0Y2hlcyA8IHRoaXMubWF4TWF0Y2hlcylcbiAgICAgIHJlc3VsdCA9IGZlZWQodGhpcywgY2h1bmspO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGNvbnN0IGxiU2l6ZSA9IHRoaXMuX2xvb2tiZWhpbmRTaXplO1xuICAgIGlmIChsYlNpemUpXG4gICAgICB0aGlzLl9jYihmYWxzZSwgdGhpcy5fbG9va2JlaGluZCwgMCwgbGJTaXplLCBmYWxzZSk7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZlZWQoc2VsZiwgZGF0YSkge1xuICBjb25zdCBsZW4gPSBkYXRhLmxlbmd0aDtcbiAgY29uc3QgbmVlZGxlID0gc2VsZi5fbmVlZGxlO1xuICBjb25zdCBuZWVkbGVMZW4gPSBuZWVkbGUubGVuZ3RoO1xuXG4gIC8vIFBvc2l0aXZlOiBwb2ludHMgdG8gYSBwb3NpdGlvbiBpbiBgZGF0YWBcbiAgLy8gICAgICAgICAgIHBvcyA9PSAzIHBvaW50cyB0byBkYXRhWzNdXG4gIC8vIE5lZ2F0aXZlOiBwb2ludHMgdG8gYSBwb3NpdGlvbiBpbiB0aGUgbG9va2JlaGluZCBidWZmZXJcbiAgLy8gICAgICAgICAgIHBvcyA9PSAtMiBwb2ludHMgdG8gbG9va2JlaGluZFtsb29rYmVoaW5kU2l6ZSAtIDJdXG4gIGxldCBwb3MgPSAtc2VsZi5fbG9va2JlaGluZFNpemU7XG4gIGNvbnN0IGxhc3ROZWVkbGVDaGFyUG9zID0gbmVlZGxlTGVuIC0gMTtcbiAgY29uc3QgbGFzdE5lZWRsZUNoYXIgPSBuZWVkbGVbbGFzdE5lZWRsZUNoYXJQb3NdO1xuICBjb25zdCBlbmQgPSBsZW4gLSBuZWVkbGVMZW47XG4gIGNvbnN0IG9jYyA9IHNlbGYuX29jYztcbiAgY29uc3QgbG9va2JlaGluZCA9IHNlbGYuX2xvb2tiZWhpbmQ7XG5cbiAgaWYgKHBvcyA8IDApIHtcbiAgICAvLyBMb29rYmVoaW5kIGJ1ZmZlciBpcyBub3QgZW1wdHkuIFBlcmZvcm0gQm95ZXItTW9vcmUtSG9yc3Bvb2xcbiAgICAvLyBzZWFyY2ggd2l0aCBjaGFyYWN0ZXIgbG9va3VwIGNvZGUgdGhhdCBjb25zaWRlcnMgYm90aCB0aGVcbiAgICAvLyBsb29rYmVoaW5kIGJ1ZmZlciBhbmQgdGhlIGN1cnJlbnQgcm91bmQncyBoYXlzdGFjayBkYXRhLlxuICAgIC8vXG4gICAgLy8gTG9vcCB1bnRpbFxuICAgIC8vICAgdGhlcmUgaXMgYSBtYXRjaC5cbiAgICAvLyBvciB1bnRpbFxuICAgIC8vICAgd2UndmUgbW92ZWQgcGFzdCB0aGUgcG9zaXRpb24gdGhhdCByZXF1aXJlcyB0aGVcbiAgICAvLyAgIGxvb2tiZWhpbmQgYnVmZmVyLiBJbiB0aGlzIGNhc2Ugd2Ugc3dpdGNoIHRvIHRoZVxuICAgIC8vICAgb3B0aW1pemVkIGxvb3AuXG4gICAgLy8gb3IgdW50aWxcbiAgICAvLyAgIHRoZSBjaGFyYWN0ZXIgdG8gbG9vayBhdCBsaWVzIG91dHNpZGUgdGhlIGhheXN0YWNrLlxuICAgIHdoaWxlIChwb3MgPCAwICYmIHBvcyA8PSBlbmQpIHtcbiAgICAgIGNvbnN0IG5leHRQb3MgPSBwb3MgKyBsYXN0TmVlZGxlQ2hhclBvcztcbiAgICAgIGNvbnN0IGNoID0gKG5leHRQb3MgPCAwXG4gICAgICAgICAgICAgICAgICA/IGxvb2tiZWhpbmRbc2VsZi5fbG9va2JlaGluZFNpemUgKyBuZXh0UG9zXVxuICAgICAgICAgICAgICAgICAgOiBkYXRhW25leHRQb3NdKTtcblxuICAgICAgaWYgKGNoID09PSBsYXN0TmVlZGxlQ2hhclxuICAgICAgICAgICYmIG1hdGNoTmVlZGxlKHNlbGYsIGRhdGEsIHBvcywgbGFzdE5lZWRsZUNoYXJQb3MpKSB7XG4gICAgICAgIHNlbGYuX2xvb2tiZWhpbmRTaXplID0gMDtcbiAgICAgICAgKytzZWxmLm1hdGNoZXM7XG4gICAgICAgIGlmIChwb3MgPiAtc2VsZi5fbG9va2JlaGluZFNpemUpXG4gICAgICAgICAgc2VsZi5fY2IodHJ1ZSwgbG9va2JlaGluZCwgMCwgc2VsZi5fbG9va2JlaGluZFNpemUgKyBwb3MsIGZhbHNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNlbGYuX2NiKHRydWUsIHVuZGVmaW5lZCwgMCwgMCwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIChzZWxmLl9idWZQb3MgPSBwb3MgKyBuZWVkbGVMZW4pO1xuICAgICAgfVxuXG4gICAgICBwb3MgKz0gb2NjW2NoXTtcbiAgICB9XG5cbiAgICAvLyBObyBtYXRjaC5cblxuICAgIC8vIFRoZXJlJ3MgdG9vIGZldyBkYXRhIGZvciBCb3llci1Nb29yZS1Ib3JzcG9vbCB0byBydW4sXG4gICAgLy8gc28gbGV0J3MgdXNlIGEgZGlmZmVyZW50IGFsZ29yaXRobSB0byBza2lwIGFzIG11Y2ggYXNcbiAgICAvLyB3ZSBjYW4uXG4gICAgLy8gRm9yd2FyZCBwb3MgdW50aWxcbiAgICAvLyAgIHRoZSB0cmFpbGluZyBwYXJ0IG9mIGxvb2tiZWhpbmQgKyBkYXRhXG4gICAgLy8gICBsb29rcyBsaWtlIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG5lZWRsZVxuICAgIC8vIG9yIHVudGlsXG4gICAgLy8gICBwb3MgPT0gMFxuICAgIHdoaWxlIChwb3MgPCAwICYmICFtYXRjaE5lZWRsZShzZWxmLCBkYXRhLCBwb3MsIGxlbiAtIHBvcykpXG4gICAgICArK3BvcztcblxuICAgIGlmIChwb3MgPCAwKSB7XG4gICAgICAvLyBDdXQgb2ZmIHBhcnQgb2YgdGhlIGxvb2tiZWhpbmQgYnVmZmVyIHRoYXQgaGFzXG4gICAgICAvLyBiZWVuIHByb2Nlc3NlZCBhbmQgYXBwZW5kIHRoZSBlbnRpcmUgaGF5c3RhY2tcbiAgICAgIC8vIGludG8gaXQuXG4gICAgICBjb25zdCBieXRlc1RvQ3V0T2ZmID0gc2VsZi5fbG9va2JlaGluZFNpemUgKyBwb3M7XG5cbiAgICAgIGlmIChieXRlc1RvQ3V0T2ZmID4gMCkge1xuICAgICAgICAvLyBUaGUgY3V0IG9mZiBkYXRhIGlzIGd1YXJhbnRlZWQgbm90IHRvIGNvbnRhaW4gdGhlIG5lZWRsZS5cbiAgICAgICAgc2VsZi5fY2IoZmFsc2UsIGxvb2tiZWhpbmQsIDAsIGJ5dGVzVG9DdXRPZmYsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5fbG9va2JlaGluZFNpemUgLT0gYnl0ZXNUb0N1dE9mZjtcbiAgICAgIGxvb2tiZWhpbmQuY29weShsb29rYmVoaW5kLCAwLCBieXRlc1RvQ3V0T2ZmLCBzZWxmLl9sb29rYmVoaW5kU2l6ZSk7XG4gICAgICBsb29rYmVoaW5kLnNldChkYXRhLCBzZWxmLl9sb29rYmVoaW5kU2l6ZSk7XG4gICAgICBzZWxmLl9sb29rYmVoaW5kU2l6ZSArPSBsZW47XG5cbiAgICAgIHNlbGYuX2J1ZlBvcyA9IGxlbjtcbiAgICAgIHJldHVybiBsZW47XG4gICAgfVxuXG4gICAgLy8gRGlzY2FyZCBsb29rYmVoaW5kIGJ1ZmZlci5cbiAgICBzZWxmLl9jYihmYWxzZSwgbG9va2JlaGluZCwgMCwgc2VsZi5fbG9va2JlaGluZFNpemUsIGZhbHNlKTtcbiAgICBzZWxmLl9sb29rYmVoaW5kU2l6ZSA9IDA7XG4gIH1cblxuICBwb3MgKz0gc2VsZi5fYnVmUG9zO1xuXG4gIGNvbnN0IGZpcnN0TmVlZGxlQ2hhciA9IG5lZWRsZVswXTtcblxuICAvLyBMb29rYmVoaW5kIGJ1ZmZlciBpcyBub3cgZW1wdHkuIFBlcmZvcm0gQm95ZXItTW9vcmUtSG9yc3Bvb2xcbiAgLy8gc2VhcmNoIHdpdGggb3B0aW1pemVkIGNoYXJhY3RlciBsb29rdXAgY29kZSB0aGF0IG9ubHkgY29uc2lkZXJzXG4gIC8vIHRoZSBjdXJyZW50IHJvdW5kJ3MgaGF5c3RhY2sgZGF0YS5cbiAgd2hpbGUgKHBvcyA8PSBlbmQpIHtcbiAgICBjb25zdCBjaCA9IGRhdGFbcG9zICsgbGFzdE5lZWRsZUNoYXJQb3NdO1xuXG4gICAgaWYgKGNoID09PSBsYXN0TmVlZGxlQ2hhclxuICAgICAgICAmJiBkYXRhW3Bvc10gPT09IGZpcnN0TmVlZGxlQ2hhclxuICAgICAgICAmJiBtZW1jbXAobmVlZGxlLCAwLCBkYXRhLCBwb3MsIGxhc3ROZWVkbGVDaGFyUG9zKSkge1xuICAgICAgKytzZWxmLm1hdGNoZXM7XG4gICAgICBpZiAocG9zID4gMClcbiAgICAgICAgc2VsZi5fY2IodHJ1ZSwgZGF0YSwgc2VsZi5fYnVmUG9zLCBwb3MsIHRydWUpO1xuICAgICAgZWxzZVxuICAgICAgICBzZWxmLl9jYih0cnVlLCB1bmRlZmluZWQsIDAsIDAsIHRydWUpO1xuXG4gICAgICByZXR1cm4gKHNlbGYuX2J1ZlBvcyA9IHBvcyArIG5lZWRsZUxlbik7XG4gICAgfVxuXG4gICAgcG9zICs9IG9jY1tjaF07XG4gIH1cblxuICAvLyBUaGVyZSB3YXMgbm8gbWF0Y2guIElmIHRoZXJlJ3MgdHJhaWxpbmcgaGF5c3RhY2sgZGF0YSB0aGF0IHdlIGNhbm5vdFxuICAvLyBtYXRjaCB5ZXQgdXNpbmcgdGhlIEJveWVyLU1vb3JlLUhvcnNwb29sIGFsZ29yaXRobSAoYmVjYXVzZSB0aGUgdHJhaWxpbmdcbiAgLy8gZGF0YSBpcyBsZXNzIHRoYW4gdGhlIG5lZWRsZSBzaXplKSB0aGVuIG1hdGNoIHVzaW5nIGEgbW9kaWZpZWRcbiAgLy8gYWxnb3JpdGhtIHRoYXQgc3RhcnRzIG1hdGNoaW5nIGZyb20gdGhlIGJlZ2lubmluZyBpbnN0ZWFkIG9mIHRoZSBlbmQuXG4gIC8vIFdoYXRldmVyIHRyYWlsaW5nIGRhdGEgaXMgbGVmdCBhZnRlciBydW5uaW5nIHRoaXMgYWxnb3JpdGhtIGlzIGFkZGVkIHRvXG4gIC8vIHRoZSBsb29rYmVoaW5kIGJ1ZmZlci5cbiAgd2hpbGUgKHBvcyA8IGxlbikge1xuICAgIGlmIChkYXRhW3Bvc10gIT09IGZpcnN0TmVlZGxlQ2hhclxuICAgICAgICB8fCAhbWVtY21wKGRhdGEsIHBvcywgbmVlZGxlLCAwLCBsZW4gLSBwb3MpKSB7XG4gICAgICArK3BvcztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBkYXRhLmNvcHkobG9va2JlaGluZCwgMCwgcG9zLCBsZW4pO1xuICAgIHNlbGYuX2xvb2tiZWhpbmRTaXplID0gbGVuIC0gcG9zO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gRXZlcnl0aGluZyB1bnRpbCBgcG9zYCBpcyBndWFyYW50ZWVkIG5vdCB0byBjb250YWluIG5lZWRsZSBkYXRhLlxuICBpZiAocG9zID4gMClcbiAgICBzZWxmLl9jYihmYWxzZSwgZGF0YSwgc2VsZi5fYnVmUG9zLCBwb3MgPCBsZW4gPyBwb3MgOiBsZW4sIHRydWUpO1xuXG4gIHNlbGYuX2J1ZlBvcyA9IGxlbjtcbiAgcmV0dXJuIGxlbjtcbn1cblxuZnVuY3Rpb24gbWF0Y2hOZWVkbGUoc2VsZiwgZGF0YSwgcG9zLCBsZW4pIHtcbiAgY29uc3QgbGIgPSBzZWxmLl9sb29rYmVoaW5kO1xuICBjb25zdCBsYlNpemUgPSBzZWxmLl9sb29rYmVoaW5kU2l6ZTtcbiAgY29uc3QgbmVlZGxlID0gc2VsZi5fbmVlZGxlO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2ksICsrcG9zKSB7XG4gICAgY29uc3QgY2ggPSAocG9zIDwgMCA/IGxiW2xiU2l6ZSArIHBvc10gOiBkYXRhW3Bvc10pO1xuICAgIGlmIChjaCAhPT0gbmVlZGxlW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNCTUg7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/streamsearch/lib/sbmh.js\n");

/***/ })

};
;