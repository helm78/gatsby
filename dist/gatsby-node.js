"use strict";
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onPreInit = void 0;
var log_1 = require("./common/log");
var log = log_1.createLogger('gatsby-node');
exports.onPreInit = function (_) {
    log('Loaded @imgix/gatsby (onPreInit)');
};
// export const createResolvers = () => {};
__exportStar(require("./modules/gatsby-source-url/gatsby-node"), exports);
//# sourceMappingURL=gatsby-node.js.map