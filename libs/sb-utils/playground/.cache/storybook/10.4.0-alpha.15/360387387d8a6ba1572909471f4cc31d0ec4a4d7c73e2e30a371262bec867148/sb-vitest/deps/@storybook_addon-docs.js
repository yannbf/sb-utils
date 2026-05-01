import {
  DocsRenderer
} from "./chunk-CIFNWBFS.js";
import "./chunk-3U3FJ4VN.js";
import {
  __export
} from "./chunk-YQDVX263.js";
import "./chunk-K62HLWIU.js";
import "./chunk-PKRFG7Z6.js";
import "./chunk-JRKUMY2M.js";
import "./chunk-MWGMXRZ3.js";
import "./chunk-UUPXYN62.js";
import {
  definePreviewAddon10
} from "./chunk-OFYILCE4.js";
import "./chunk-7B2XDDIB.js";
import "./chunk-Y3IRLQJO.js";
import "./chunk-E3LGVU6C.js";
import "./chunk-BFTAQZ6O.js";
import "./chunk-Y56MQJN7.js";
import "./chunk-A2PLO5ED.js";
import "./chunk-4EMLBN6P.js";
import "./chunk-YUWKH2ZO.js";
import "./chunk-ZFJR3KGO.js";
import "./chunk-L3QKJZM2.js";
import "./chunk-3WVPRW5N.js";
import "./chunk-EIGY3GD6.js";
import "./chunk-UABYYV7Q.js";
import "./chunk-ECAX4KZN.js";
import "./chunk-DYY4VOUH.js";
import "./chunk-FXM2GH2C.js";
import "./chunk-XCJ6ZS5W.js";
import "./chunk-PR4QN5HX.js";

// node_modules/@storybook/addon-docs/dist/_browser-chunks/chunk-S4QKU6I5.js
var preview_exports = {};
__export(preview_exports, {
  parameters: () => parameters
});
var excludeTags = Object.entries(globalThis.TAGS_OPTIONS ?? {}).reduce(
  (acc, entry) => {
    let [tag, option] = entry;
    return option.excludeFromDocsStories && (acc[tag] = true), acc;
  },
  {}
);
var parameters = {
  docs: {
    renderer: async () => {
      let { DocsRenderer: DocsRenderer2 } = await import("./DocsRenderer-LL677BLK-XVV6QFAX.js");
      return new DocsRenderer2();
    },
    stories: {
      filter: (story) => (story.tags || []).filter((tag) => excludeTags[tag]).length === 0 && !story.parameters.docs?.disable
    }
  }
};

// node_modules/@storybook/addon-docs/dist/index.js
var index_default = () => definePreviewAddon10(preview_exports);
export {
  DocsRenderer,
  index_default as default
};
//# sourceMappingURL=@storybook_addon-docs.js.map
