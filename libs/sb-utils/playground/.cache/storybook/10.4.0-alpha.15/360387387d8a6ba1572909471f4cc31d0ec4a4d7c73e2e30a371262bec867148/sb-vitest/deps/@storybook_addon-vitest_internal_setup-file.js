import {
  PANEL_ID
} from "./chunk-CZRBA5FN.js";
import {
  Channel
} from "./chunk-ZFJR3KGO.js";
import "./chunk-L3QKJZM2.js";
import "./chunk-3WVPRW5N.js";
import "./chunk-EIGY3GD6.js";
import "./chunk-UABYYV7Q.js";
import "./chunk-ECAX4KZN.js";
import "./chunk-PR4QN5HX.js";

// node_modules/@storybook/addon-vitest/dist/vitest-plugin/setup-file.js
import { afterEach, beforeAll, vi } from "vitest";
var transport = { setHandler: vi.fn(), send: vi.fn() };
globalThis.__STORYBOOK_ADDONS_CHANNEL__ ??= new Channel({ transport });
var modifyErrorMessage = ({ task }) => {
  let meta = task.meta;
  if (task.type === "test" && task.result?.state === "fail" && meta.storyId && task.result.errors?.[0]) {
    let currentError = task.result.errors[0], storyUrl = `${import.meta.env.__STORYBOOK_URL__}/?path=/story/${meta.storyId}&addonPanel=${PANEL_ID}`;
    currentError.message = `
\x1B[34mClick to debug the error directly in Storybook: ${storyUrl}\x1B[39m

${currentError.message}`;
  }
};
beforeAll(() => {
  if (globalThis.globalProjectAnnotations)
    return globalThis.globalProjectAnnotations.beforeAll();
});
afterEach(modifyErrorMessage);
export {
  modifyErrorMessage
};
//# sourceMappingURL=@storybook_addon-vitest_internal_setup-file.js.map
