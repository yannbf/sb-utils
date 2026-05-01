import {
  composeStory,
  getCsfFactoryAnnotations,
  getStoryChildren,
  isStory
} from "./chunk-OFYILCE4.js";
import "./chunk-7B2XDDIB.js";
import "./chunk-Y3IRLQJO.js";
import {
  UnsupportedViewportDimensionError
} from "./chunk-E3LGVU6C.js";
import "./chunk-BFTAQZ6O.js";
import "./chunk-Y56MQJN7.js";
import {
  STORYBOOK_CORE_GHOST_STORIES_PROVIDE_KEY,
  STORYBOOK_CORE_RENDER_ANALYSIS_PROVIDE_KEY,
  STORYBOOK_TEST_PROVIDE_KEY
} from "./chunk-CZRBA5FN.js";
import "./chunk-ZFJR3KGO.js";
import "./chunk-L3QKJZM2.js";
import "./chunk-3WVPRW5N.js";
import "./chunk-EIGY3GD6.js";
import "./chunk-UABYYV7Q.js";
import "./chunk-ECAX4KZN.js";
import "./chunk-PR4QN5HX.js";

// node_modules/@storybook/addon-vitest/dist/vitest-plugin/test-utils.js
import { inject } from "vitest";

// node_modules/storybook/dist/_browser-chunks/chunk-ASKQZAOS.js
var MINIMAL_VIEWPORTS = {
  mobile1: {
    name: "Small mobile",
    styles: {
      height: "568px",
      width: "320px"
    },
    type: "mobile"
  },
  mobile2: {
    name: "Large mobile",
    styles: {
      height: "896px",
      width: "414px"
    },
    type: "mobile"
  },
  tablet: {
    name: "Tablet",
    styles: {
      height: "1112px",
      width: "834px"
    },
    type: "tablet"
  },
  desktop: {
    name: "Desktop",
    styles: {
      height: "1024px",
      width: "1280px"
    },
    type: "desktop"
  }
};

// node_modules/@storybook/addon-vitest/dist/vitest-plugin/test-utils.js
var DEFAULT_VIEWPORT_DIMENSIONS = {
  width: 1200,
  height: 900
};
var validPixelOrNumber = /^\d+(px)?$/;
var percentagePattern = /^(\d+(\.\d+)?%)$/;
var vwPattern = /^(\d+(\.\d+)?vw)$/;
var vhPattern = /^(\d+(\.\d+)?vh)$/;
var emRemPattern = /^(\d+)(em|rem)$/;
var parseDimension = (value, dimension) => {
  if (validPixelOrNumber.test(value))
    return Number.parseInt(value, 10);
  if (percentagePattern.test(value)) {
    let percentageValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS[dimension] * percentageValue);
  } else if (vwPattern.test(value)) {
    let vwValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS.width * vwValue);
  } else if (vhPattern.test(value)) {
    let vhValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS.height * vhValue);
  } else {
    if (emRemPattern.test(value))
      return Number.parseInt(value, 10) * 16;
    throw new UnsupportedViewportDimensionError({ dimension, value });
  }
};
var setViewport = async (parameters = {}, globals = {}) => {
  let defaultViewport, viewportsParam = parameters.viewport ?? {}, viewportsGlobal = globals.viewport ?? {}, isDisabled = viewportsParam.disable || viewportsParam.disabled;
  viewportsGlobal.value && !isDisabled ? defaultViewport = viewportsGlobal.value : isDisabled || (defaultViewport = viewportsParam.defaultViewport);
  let { page } = await import("@vitest/browser/context").catch(() => ({
    page: null
  }));
  if (!page || !globalThis.__vitest_browser__)
    return;
  let options = {
    ...MINIMAL_VIEWPORTS,
    ...viewportsParam.viewports,
    ...viewportsParam.options
  }, viewportWidth = DEFAULT_VIEWPORT_DIMENSIONS.width, viewportHeight = DEFAULT_VIEWPORT_DIMENSIONS.height;
  if (defaultViewport && defaultViewport in options) {
    let { styles } = options[defaultViewport];
    if (styles?.width && styles?.height) {
      let { width, height } = styles;
      viewportWidth = parseDimension(width, "width"), viewportHeight = parseDimension(height, "height");
    }
  }
  await page.viewport(viewportWidth, viewportHeight);
};
var convertToFilePath = (url) => url.replace(/^file:\/\//, "").replace(/^\/+([a-zA-Z]:)/, "$1").replace(/%20/g, " ");
var testStory = ({
  exportName,
  story,
  meta,
  skipTags,
  storyId,
  componentPath,
  testName,
  componentName
}) => async (context) => {
  let annotations = getCsfFactoryAnnotations(story, meta), test = isStory(story) && testName ? getStoryChildren(story).find((child) => child.input.name === testName) : void 0, storyAnnotations = test ? test.input : annotations.story, runConfig = { a11y: true };
  try {
    runConfig = inject(STORYBOOK_TEST_PROVIDE_KEY) ?? { a11y: true };
  } catch {
  }
  let ghostStoriesEnabled = false;
  try {
    ghostStoriesEnabled = inject(STORYBOOK_CORE_GHOST_STORIES_PROVIDE_KEY) ?? false;
  } catch {
  }
  let renderAnalysisEnabled = false;
  try {
    renderAnalysisEnabled = inject(STORYBOOK_CORE_RENDER_ANALYSIS_PROVIDE_KEY) ?? false;
  } catch {
  }
  let shouldRunA11yTests = !!runConfig.a11y, initialGlobals = {
    [STORYBOOK_TEST_PROVIDE_KEY]: runConfig,
    ...ghostStoriesEnabled ? {
      ghostStories: {
        enabled: true
      }
    } : {},
    ...renderAnalysisEnabled ? {
      renderAnalysis: {
        enabled: true
      }
    } : {},
    a11y: {
      manual: !shouldRunA11yTests
    }
  }, composedStory = composeStory(
    storyAnnotations,
    annotations.meta,
    { initialGlobals },
    annotations.preview ?? globalThis.globalProjectAnnotations,
    exportName
  );
  (composedStory === void 0 || skipTags?.some((tag) => composedStory.tags.includes(tag))) && context.skip(), context.story = composedStory;
  let _task = context.task;
  _task.meta.storyId = storyId, _task.meta.componentPath = componentPath, _task.meta.componentName = componentName, await setViewport(composedStory.parameters, composedStory.globals), await composedStory.run(void 0), _task.meta.reports = composedStory.reporting.reports;
};
export {
  convertToFilePath,
  testStory
};
//# sourceMappingURL=@storybook_addon-vitest_internal_test-utils.js.map
