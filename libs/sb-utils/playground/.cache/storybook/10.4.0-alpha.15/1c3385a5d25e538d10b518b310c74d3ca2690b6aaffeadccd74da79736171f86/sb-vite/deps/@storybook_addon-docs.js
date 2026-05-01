import {
  DocsRenderer
} from "./chunk-AI6MECMB.js";
import "./chunk-MCOP56RH.js";
import {
  __export
} from "./chunk-PWQHHZBD.js";
import {
  definePreviewAddon10
} from "./chunk-SMXRLNUH.js";
import "./chunk-HRZJ2NQ5.js";
import "./chunk-JRKUMY2M.js";
import "./chunk-MYIQE3A3.js";
import "./chunk-A6JXCUVM.js";
import "./chunk-DFA5LEMD.js";
import "./chunk-DZGZJ7HU.js";
import "./chunk-XK7S74MB.js";
import "./chunk-BJQNVKVS.js";
import "./chunk-NI3TJRTF.js";
import "./chunk-E5E3DWOS.js";
import "./chunk-2BSE6OYG.js";
import "./chunk-MTI3AIJG.js";

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
      let { DocsRenderer: DocsRenderer2 } = await import("./DocsRenderer-LL677BLK-YVMISGNN.js");
      return new DocsRenderer2();
    },
    stories: {
      filter: (story) => {
        var _a;
        return (story.tags || []).filter((tag) => excludeTags[tag]).length === 0 && !((_a = story.parameters.docs) == null ? void 0 : _a.disable);
      }
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
