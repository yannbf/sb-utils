import {
  require_memoizerific
} from "./chunk-7B2XDDIB.js";
import {
  SNIPPET_RENDERED,
  combineParameters,
  isEqual,
  isPlainObject,
  mapValues,
  pickBy
} from "./chunk-Y3IRLQJO.js";
import {
  CalledExtractOnStoreError,
  CalledPreviewMethodBeforeInitializationError,
  EmptyIndexError,
  ImplicitActionsDuringRendering,
  MdxFileWithNoCsfReferencesError,
  MissingRenderToCanvasError,
  MissingStoryAfterHmrError,
  MissingStoryFromCsfFileError,
  MountMustBeDestructuredError,
  NoRenderFunctionError,
  NoStoryMatchError,
  NoStoryMountedError,
  StoryIndexFetchError,
  StoryStoreAccessedBeforeInitializationError
} from "./chunk-E3LGVU6C.js";
import {
  HIGHLIGHT,
  MAX_Z_INDEX,
  MIN_TOUCH_AREA_SIZE,
  REMOVE_HIGHLIGHT,
  RESET_HIGHLIGHT,
  SCROLL_INTO_VIEW
} from "./chunk-BFTAQZ6O.js";
import {
  clearAllMocks,
  fn2,
  instrument,
  isMockFunction2,
  onMockCall,
  resetAllMocks,
  restoreAllMocks,
  uninstrumentedUserEvent,
  within
} from "./chunk-Y56MQJN7.js";
import {
  Channel,
  invariant
} from "./chunk-ZFJR3KGO.js";
import {
  ARGTYPES_INFO_REQUEST,
  ARGTYPES_INFO_RESPONSE,
  CONFIG_ERROR,
  CURRENT_STORY_WAS_SET,
  DOCS_PREPARED,
  DOCS_RENDERED,
  FORCE_REMOUNT,
  FORCE_RE_RENDER,
  GLOBALS_UPDATED,
  PLAY_FUNCTION_THREW_EXCEPTION,
  PRELOAD_ENTRIES,
  PREVIEW_INITIALIZED,
  PREVIEW_KEYDOWN,
  RESET_STORY_ARGS,
  SET_CURRENT_STORY,
  SET_GLOBALS,
  STORY_ARGS_UPDATED,
  STORY_CHANGED,
  STORY_ERRORED,
  STORY_FINISHED,
  STORY_HOT_UPDATED,
  STORY_INDEX_INVALIDATED,
  STORY_MISSING,
  STORY_PREPARED,
  STORY_RENDERED,
  STORY_RENDER_PHASE_CHANGED,
  STORY_SPECIFIED,
  STORY_THREW_EXCEPTION,
  STORY_UNCHANGED,
  UNHANDLED_ERRORS_WHILE_PLAYING,
  UPDATE_GLOBALS,
  UPDATE_QUERY_PARAMS,
  UPDATE_STORY_ARGS
} from "./chunk-L3QKJZM2.js";
import {
  dedent
} from "./chunk-3WVPRW5N.js";
import {
  deprecate,
  logger,
  once
} from "./chunk-EIGY3GD6.js";
import {
  __commonJS,
  __export,
  __toESM
} from "./chunk-UABYYV7Q.js";
import {
  scope
} from "./chunk-ECAX4KZN.js";

// node_modules/storybook/dist/_browser-chunks/chunk-MEXTPDJG.js
function isTestEnvironment() {
  try {
    return (
      // @ts-expect-error This property exists in Vitest browser mode
      !!globalThis.__vitest_browser__ || !!globalThis.window?.navigator?.userAgent?.match(/StorybookTestRunner/)
    );
  } catch {
    return false;
  }
}
function pauseAnimations(atEnd = true) {
  if (!("document" in globalThis && "createElement" in globalThis.document))
    return () => {
    };
  let disableStyle = document.createElement("style");
  disableStyle.textContent = `*, *:before, *:after {
    animation: none !important;
  }`, document.head.appendChild(disableStyle);
  let pauseStyle = document.createElement("style");
  return pauseStyle.textContent = `*, *:before, *:after {
    animation-delay: 0s !important;
    animation-direction: ${atEnd ? "reverse" : "normal"} !important;
    animation-play-state: paused !important;
    transition: none !important;
  }`, document.head.appendChild(pauseStyle), document.body.clientHeight, document.head.removeChild(disableStyle), () => {
    pauseStyle.parentNode?.removeChild(pauseStyle);
  };
}
async function waitForAnimations(signal) {
  if (!("document" in globalThis && "getAnimations" in globalThis.document && "querySelectorAll" in globalThis.document))
    return;
  let timedOut = false;
  await Promise.race([
    // After 50ms, retrieve any running animations and wait for them to finish
    // If new animations are created while waiting, we'll wait for them too
    new Promise((resolve) => {
      setTimeout(() => {
        let animationRoots = [globalThis.document, ...getShadowRoots(globalThis.document)], checkAnimationsFinished = async () => {
          if (timedOut || signal?.aborted)
            return;
          let runningAnimations = animationRoots.flatMap((el) => el?.getAnimations?.() || []).filter((a) => a.playState === "running" && !isInfiniteAnimation(a));
          runningAnimations.length > 0 && (await Promise.allSettled(runningAnimations.map(async (a) => a.finished)), await checkAnimationsFinished());
        };
        checkAnimationsFinished().then(resolve);
      }, 100);
    }),
    // If animations don't finish within the timeout, continue without waiting
    new Promise(
      (resolve) => setTimeout(() => {
        timedOut = true, resolve(void 0);
      }, 5e3)
    )
  ]);
}
function getShadowRoots(doc) {
  return [doc, ...doc.querySelectorAll("*")].reduce((acc, el) => ("shadowRoot" in el && el.shadowRoot && acc.push(el.shadowRoot, ...getShadowRoots(el.shadowRoot)), acc), []);
}
function isInfiniteAnimation(anim) {
  if (anim instanceof CSSAnimation && anim.effect instanceof KeyframeEffect && anim.effect.target) {
    let style = getComputedStyle(anim.effect.target, anim.effect.pseudoElement), index = style.animationName?.split(", ").indexOf(anim.animationName);
    return style.animationIterationCount.split(", ")[index] === "infinite";
  }
  return false;
}

// node_modules/storybook/dist/_browser-chunks/chunk-2GLGVABT.js
var Tag = {
  /** Indicates that autodocs should be generated for this component */
  AUTODOCS: "autodocs",
  /** MDX documentation attached to a component's stories file */
  ATTACHED_MDX: "attached-mdx",
  /** Standalone MDX documentation not attached to stories */
  UNATTACHED_MDX: "unattached-mdx",
  /** Story has a play function */
  PLAY_FN: "play-fn",
  /** Story has a test function */
  TEST_FN: "test-fn",
  /** Development environment tag */
  DEV: "dev",
  /** Test environment tag */
  TEST: "test",
  /** Manifest generation tag */
  MANIFEST: "manifest"
};
var BUILT_IN_FILTERS = {
  _docs: (entry, excluded) => excluded ? entry.type !== "docs" : entry.type === "docs",
  _play: (entry, excluded) => excluded ? entry.type !== "story" || !entry.tags?.includes(Tag.PLAY_FN) : entry.type === "story" && !!entry.tags?.includes(Tag.PLAY_FN),
  _test: (entry, excluded) => excluded ? entry.type !== "story" || entry.subtype !== "test" : entry.type === "story" && entry.subtype === "test"
};
var USER_TAG_FILTER = (tag) => (entry, excluded) => excluded ? !entry.tags?.includes(tag) : !!entry.tags?.includes(tag);

// node_modules/storybook/dist/_browser-chunks/chunk-XLJZ7AOP.js
var require_string_util = __commonJS({
  "../../node_modules/picoquery/lib/string-util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeString = encodeString;
    var hexTable = Array.from({ length: 256 }, (_, i) => "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase()), noEscape = new Int8Array([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      0
    ]);
    function encodeString(str) {
      let len = str.length;
      if (len === 0)
        return "";
      let out = "", lastPos = 0, i = 0;
      outer: for (; i < len; i++) {
        let c = str.charCodeAt(i);
        for (; c < 128; ) {
          if (noEscape[c] !== 1 && (lastPos < i && (out += str.slice(lastPos, i)), lastPos = i + 1, out += hexTable[c]), ++i === len)
            break outer;
          c = str.charCodeAt(i);
        }
        if (lastPos < i && (out += str.slice(lastPos, i)), c < 2048) {
          lastPos = i + 1, out += hexTable[192 | c >> 6] + hexTable[128 | c & 63];
          continue;
        }
        if (c < 55296 || c >= 57344) {
          lastPos = i + 1, out += hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
          continue;
        }
        if (++i, i >= len)
          throw new Error("URI malformed");
        let c2 = str.charCodeAt(i) & 1023;
        lastPos = i + 1, c = 65536 + ((c & 1023) << 10 | c2), out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
      }
      return lastPos === 0 ? str : lastPos < len ? out + str.slice(lastPos) : out;
    }
  }
});
var require_shared = __commonJS({
  "../../node_modules/picoquery/lib/shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultOptions = exports.defaultShouldSerializeObject = exports.defaultValueSerializer = void 0;
    var string_util_js_1 = require_string_util(), defaultValueSerializer = (value) => {
      switch (typeof value) {
        case "string":
          return (0, string_util_js_1.encodeString)(value);
        case "bigint":
        case "boolean":
          return "" + value;
        case "number":
          if (Number.isFinite(value))
            return value < 1e21 ? "" + value : (0, string_util_js_1.encodeString)("" + value);
          break;
      }
      return value instanceof Date ? (0, string_util_js_1.encodeString)(value.toISOString()) : "";
    };
    exports.defaultValueSerializer = defaultValueSerializer;
    var defaultShouldSerializeObject = (val) => val instanceof Date;
    exports.defaultShouldSerializeObject = defaultShouldSerializeObject;
    var identityFunc = (v) => v;
    exports.defaultOptions = {
      nesting: true,
      nestingSyntax: "dot",
      arrayRepeat: false,
      arrayRepeatSyntax: "repeat",
      delimiter: 38,
      valueDeserializer: identityFunc,
      valueSerializer: exports.defaultValueSerializer,
      keyDeserializer: identityFunc,
      shouldSerializeObject: exports.defaultShouldSerializeObject
    };
  }
});
var require_object_util = __commonJS({
  "../../node_modules/picoquery/lib/object-util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDeepObject = getDeepObject;
    exports.stringifyObject = stringifyObject;
    var shared_js_1 = require_shared(), string_util_js_1 = require_string_util();
    function isPrototypeKey(value) {
      return value === "__proto__" || value === "constructor" || value === "prototype";
    }
    function getDeepObject(obj, key, nextKey, forceObject, forceArray) {
      if (isPrototypeKey(key))
        return obj;
      let currObj = obj[key];
      return typeof currObj == "object" && currObj !== null ? currObj : !forceObject && (forceArray || typeof nextKey == "number" || typeof nextKey == "string" && nextKey * 0 === 0 && nextKey.indexOf(".") === -1) ? obj[key] = [] : obj[key] = {};
    }
    var MAX_DEPTH = 20, strBracketPair = "[]", strBracketLeft = "[", strBracketRight = "]", strDot = ".";
    function stringifyObject(obj, options, depth = 0, parentKey, isProbableArray) {
      let { nestingSyntax = shared_js_1.defaultOptions.nestingSyntax, arrayRepeat = shared_js_1.defaultOptions.arrayRepeat, arrayRepeatSyntax = shared_js_1.defaultOptions.arrayRepeatSyntax, nesting = shared_js_1.defaultOptions.nesting, delimiter = shared_js_1.defaultOptions.delimiter, valueSerializer = shared_js_1.defaultOptions.valueSerializer, shouldSerializeObject = shared_js_1.defaultOptions.shouldSerializeObject } = options, strDelimiter = typeof delimiter == "number" ? String.fromCharCode(delimiter) : delimiter, useArrayRepeatKey = isProbableArray === true && arrayRepeat, shouldUseDot = nestingSyntax === "dot" || nestingSyntax === "js" && !isProbableArray;
      if (depth > MAX_DEPTH)
        return "";
      let result = "", firstKey = true, valueIsProbableArray = false;
      for (let key in obj) {
        let value = obj[key];
        if (value === void 0)
          continue;
        let path;
        parentKey ? (path = parentKey, useArrayRepeatKey ? arrayRepeatSyntax === "bracket" && (path += strBracketPair) : shouldUseDot ? (path += strDot, path += key) : (path += strBracketLeft, path += key, path += strBracketRight)) : path = key, firstKey || (result += strDelimiter), typeof value == "object" && value !== null && !shouldSerializeObject(value) ? (valueIsProbableArray = value.pop !== void 0, (nesting || arrayRepeat && valueIsProbableArray) && (result += stringifyObject(value, options, depth + 1, path, valueIsProbableArray))) : (result += (0, string_util_js_1.encodeString)(path), result += "=", result += valueSerializer(value, key)), firstKey && (firstKey = false);
      }
      return result;
    }
  }
});
var require_decode_uri_component = __commonJS({
  "../../node_modules/picoquery/lib/decode-uri-component.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeURIComponent = decodeURIComponent;
    var UTF8_ACCEPT = 12, UTF8_REJECT = 0, UTF8_DATA = [
      // The first part of the table maps bytes to character to a transition.
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      3,
      4,
      4,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      6,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      7,
      8,
      7,
      7,
      10,
      9,
      9,
      9,
      11,
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      4,
      // The second part of the table maps a state to a new state when adding a
      // transition.
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      12,
      0,
      0,
      0,
      0,
      24,
      36,
      48,
      60,
      72,
      84,
      96,
      0,
      12,
      12,
      12,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      24,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      24,
      24,
      24,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      24,
      24,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      48,
      48,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      48,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      48,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // The third part maps the current transition to a mask that needs to apply
      // to the byte.
      127,
      63,
      63,
      63,
      0,
      31,
      15,
      15,
      15,
      7,
      7,
      7
    ];
    function decodeURIComponent(uri) {
      let percentPosition = uri.indexOf("%");
      if (percentPosition === -1)
        return uri;
      let length = uri.length, decoded = "", last = 0, codepoint = 0, startOfOctets = percentPosition, state3 = UTF8_ACCEPT;
      for (; percentPosition > -1 && percentPosition < length; ) {
        let high = hexCodeToInt(uri[percentPosition + 1], 4), low = hexCodeToInt(uri[percentPosition + 2], 0), byte = high | low, type = UTF8_DATA[byte];
        if (state3 = UTF8_DATA[256 + state3 + type], codepoint = codepoint << 6 | byte & UTF8_DATA[364 + type], state3 === UTF8_ACCEPT)
          decoded += uri.slice(last, startOfOctets), decoded += codepoint <= 65535 ? String.fromCharCode(codepoint) : String.fromCharCode(55232 + (codepoint >> 10), 56320 + (codepoint & 1023)), codepoint = 0, last = percentPosition + 3, percentPosition = startOfOctets = uri.indexOf("%", last);
        else {
          if (state3 === UTF8_REJECT)
            return null;
          if (percentPosition += 3, percentPosition < length && uri.charCodeAt(percentPosition) === 37)
            continue;
          return null;
        }
      }
      return decoded + uri.slice(last);
    }
    var HEX = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    };
    function hexCodeToInt(c, shift) {
      let i = HEX[c];
      return i === void 0 ? 255 : i << shift;
    }
  }
});
var require_parse = __commonJS({
  "../../node_modules/picoquery/lib/parse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numberValueDeserializer = exports.numberKeyDeserializer = void 0;
    exports.parse = parse;
    var object_util_js_1 = require_object_util(), shared_js_1 = require_shared(), decode_uri_component_js_1 = require_decode_uri_component(), numberKeyDeserializer = (key) => {
      let asNumber = Number(key);
      return Number.isNaN(asNumber) ? key : asNumber;
    };
    exports.numberKeyDeserializer = numberKeyDeserializer;
    var numberValueDeserializer = (value) => {
      let asNumber = Number(value);
      return Number.isNaN(asNumber) ? value : asNumber;
    };
    exports.numberValueDeserializer = numberValueDeserializer;
    var regexPlus = /\+/g, Empty = function() {
    };
    Empty.prototype = /* @__PURE__ */ Object.create(null);
    function computeKeySlice(input, startIndex, endIndex, keyHasPlus, shouldDecodeKey) {
      let chunk = input.substring(startIndex, endIndex);
      return keyHasPlus && (chunk = chunk.replace(regexPlus, " ")), shouldDecodeKey && (chunk = (0, decode_uri_component_js_1.decodeURIComponent)(chunk) || chunk), chunk;
    }
    function parse(input, options) {
      let { valueDeserializer = shared_js_1.defaultOptions.valueDeserializer, keyDeserializer = shared_js_1.defaultOptions.keyDeserializer, arrayRepeatSyntax = shared_js_1.defaultOptions.arrayRepeatSyntax, nesting = shared_js_1.defaultOptions.nesting, arrayRepeat = shared_js_1.defaultOptions.arrayRepeat, nestingSyntax = shared_js_1.defaultOptions.nestingSyntax, delimiter = shared_js_1.defaultOptions.delimiter } = options ?? {}, charDelimiter = typeof delimiter == "string" ? delimiter.charCodeAt(0) : delimiter, isJsNestingSyntax = nestingSyntax === "js", result = new Empty();
      if (typeof input != "string")
        return result;
      let inputLength = input.length, value = "", startingIndex = -1, equalityIndex = -1, keySeparatorIndex = -1, currentObj = result, lastKey, currentKey = "", keyChunk = "", shouldDecodeKey = false, shouldDecodeValue = false, keyHasPlus = false, valueHasPlus = false, keyIsDot = false, hasBothKeyValuePair = false, c = 0, arrayRepeatBracketIndex = -1, prevIndex = -1, prevChar = -1;
      for (let i = 0; i < inputLength + 1; i++) {
        if (c = i !== inputLength ? input.charCodeAt(i) : charDelimiter, c === charDelimiter) {
          if (hasBothKeyValuePair = equalityIndex > startingIndex, hasBothKeyValuePair || (equalityIndex = i), keySeparatorIndex !== equalityIndex - 1 && (keyChunk = computeKeySlice(input, keySeparatorIndex + 1, arrayRepeatBracketIndex > -1 ? arrayRepeatBracketIndex : equalityIndex, keyHasPlus, shouldDecodeKey), currentKey = keyDeserializer(keyChunk), lastKey !== void 0 && (currentObj = (0, object_util_js_1.getDeepObject)(currentObj, lastKey, currentKey, isJsNestingSyntax && keyIsDot, void 0))), hasBothKeyValuePair || currentKey !== "") {
            hasBothKeyValuePair && (value = input.slice(equalityIndex + 1, i), valueHasPlus && (value = value.replace(regexPlus, " ")), shouldDecodeValue && (value = (0, decode_uri_component_js_1.decodeURIComponent)(value) || value));
            let newValue = valueDeserializer(value, currentKey);
            if (arrayRepeat) {
              let currentValue = currentObj[currentKey];
              currentValue === void 0 ? arrayRepeatBracketIndex > -1 ? currentObj[currentKey] = [newValue] : currentObj[currentKey] = newValue : currentValue.pop ? currentValue.push(newValue) : currentObj[currentKey] = [currentValue, newValue];
            } else
              currentObj[currentKey] = newValue;
          }
          value = "", startingIndex = i, equalityIndex = i, shouldDecodeKey = false, shouldDecodeValue = false, keyHasPlus = false, valueHasPlus = false, keyIsDot = false, arrayRepeatBracketIndex = -1, keySeparatorIndex = i, currentObj = result, lastKey = void 0, currentKey = "";
        } else c === 93 ? (arrayRepeat && arrayRepeatSyntax === "bracket" && prevChar === 91 && (arrayRepeatBracketIndex = prevIndex), nesting && (nestingSyntax === "index" || isJsNestingSyntax) && equalityIndex <= startingIndex && (keySeparatorIndex !== prevIndex && (keyChunk = computeKeySlice(input, keySeparatorIndex + 1, i, keyHasPlus, shouldDecodeKey), currentKey = keyDeserializer(keyChunk), lastKey !== void 0 && (currentObj = (0, object_util_js_1.getDeepObject)(currentObj, lastKey, currentKey, void 0, void 0)), lastKey = currentKey, keyHasPlus = false, shouldDecodeKey = false), keySeparatorIndex = i, keyIsDot = false)) : c === 46 ? nesting && (nestingSyntax === "dot" || isJsNestingSyntax) && equalityIndex <= startingIndex && (keySeparatorIndex !== prevIndex && (keyChunk = computeKeySlice(input, keySeparatorIndex + 1, i, keyHasPlus, shouldDecodeKey), currentKey = keyDeserializer(keyChunk), lastKey !== void 0 && (currentObj = (0, object_util_js_1.getDeepObject)(currentObj, lastKey, currentKey, isJsNestingSyntax)), lastKey = currentKey, keyHasPlus = false, shouldDecodeKey = false), keyIsDot = true, keySeparatorIndex = i) : c === 91 ? nesting && (nestingSyntax === "index" || isJsNestingSyntax) && equalityIndex <= startingIndex && (keySeparatorIndex !== prevIndex && (keyChunk = computeKeySlice(input, keySeparatorIndex + 1, i, keyHasPlus, shouldDecodeKey), currentKey = keyDeserializer(keyChunk), isJsNestingSyntax && lastKey !== void 0 && (currentObj = (0, object_util_js_1.getDeepObject)(currentObj, lastKey, currentKey, isJsNestingSyntax)), lastKey = currentKey, keyHasPlus = false, shouldDecodeKey = false, keyIsDot = false), keySeparatorIndex = i) : c === 61 ? equalityIndex <= startingIndex ? equalityIndex = i : shouldDecodeValue = true : c === 43 ? equalityIndex > startingIndex ? valueHasPlus = true : keyHasPlus = true : c === 37 && (equalityIndex > startingIndex ? shouldDecodeValue = true : shouldDecodeKey = true);
        prevIndex = i, prevChar = c;
      }
      return result;
    }
  }
});
var require_stringify = __commonJS({
  "../../node_modules/picoquery/lib/stringify.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringify = stringify;
    var object_util_js_1 = require_object_util();
    function stringify(input, options) {
      if (input === null || typeof input != "object")
        return "";
      let optionsObj = options ?? {};
      return (0, object_util_js_1.stringifyObject)(input, optionsObj);
    }
  }
});
var require_main = __commonJS({
  "../../node_modules/picoquery/lib/main.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      k2 === void 0 && (k2 = k);
      var desc = Object.getOwnPropertyDescriptor(m, k);
      (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) && (desc = { enumerable: true, get: function() {
        return m[k];
      } }), Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      k2 === void 0 && (k2 = k), o[k2] = m[k];
    }), __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p) && __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringify = exports.parse = void 0;
    var parse_js_1 = require_parse();
    Object.defineProperty(exports, "parse", { enumerable: true, get: function() {
      return parse_js_1.parse;
    } });
    var stringify_js_1 = require_stringify();
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return stringify_js_1.stringify;
    } });
    __exportStar(require_shared(), exports);
  }
});

// node_modules/storybook/dist/_browser-chunks/chunk-V2VKKSMQ.js
var require_entities = __commonJS({
  "../../node_modules/entities/lib/maps/entities.json"(exports, module) {
    module.exports = { Aacute: "Á", aacute: "á", Abreve: "Ă", abreve: "ă", ac: "∾", acd: "∿", acE: "∾̳", Acirc: "Â", acirc: "â", acute: "´", Acy: "А", acy: "а", AElig: "Æ", aelig: "æ", af: "⁡", Afr: "𝔄", afr: "𝔞", Agrave: "À", agrave: "à", alefsym: "ℵ", aleph: "ℵ", Alpha: "Α", alpha: "α", Amacr: "Ā", amacr: "ā", amalg: "⨿", amp: "&", AMP: "&", andand: "⩕", And: "⩓", and: "∧", andd: "⩜", andslope: "⩘", andv: "⩚", ang: "∠", ange: "⦤", angle: "∠", angmsdaa: "⦨", angmsdab: "⦩", angmsdac: "⦪", angmsdad: "⦫", angmsdae: "⦬", angmsdaf: "⦭", angmsdag: "⦮", angmsdah: "⦯", angmsd: "∡", angrt: "∟", angrtvb: "⊾", angrtvbd: "⦝", angsph: "∢", angst: "Å", angzarr: "⍼", Aogon: "Ą", aogon: "ą", Aopf: "𝔸", aopf: "𝕒", apacir: "⩯", ap: "≈", apE: "⩰", ape: "≊", apid: "≋", apos: "'", ApplyFunction: "⁡", approx: "≈", approxeq: "≊", Aring: "Å", aring: "å", Ascr: "𝒜", ascr: "𝒶", Assign: "≔", ast: "*", asymp: "≈", asympeq: "≍", Atilde: "Ã", atilde: "ã", Auml: "Ä", auml: "ä", awconint: "∳", awint: "⨑", backcong: "≌", backepsilon: "϶", backprime: "‵", backsim: "∽", backsimeq: "⋍", Backslash: "∖", Barv: "⫧", barvee: "⊽", barwed: "⌅", Barwed: "⌆", barwedge: "⌅", bbrk: "⎵", bbrktbrk: "⎶", bcong: "≌", Bcy: "Б", bcy: "б", bdquo: "„", becaus: "∵", because: "∵", Because: "∵", bemptyv: "⦰", bepsi: "϶", bernou: "ℬ", Bernoullis: "ℬ", Beta: "Β", beta: "β", beth: "ℶ", between: "≬", Bfr: "𝔅", bfr: "𝔟", bigcap: "⋂", bigcirc: "◯", bigcup: "⋃", bigodot: "⨀", bigoplus: "⨁", bigotimes: "⨂", bigsqcup: "⨆", bigstar: "★", bigtriangledown: "▽", bigtriangleup: "△", biguplus: "⨄", bigvee: "⋁", bigwedge: "⋀", bkarow: "⤍", blacklozenge: "⧫", blacksquare: "▪", blacktriangle: "▴", blacktriangledown: "▾", blacktriangleleft: "◂", blacktriangleright: "▸", blank: "␣", blk12: "▒", blk14: "░", blk34: "▓", block: "█", bne: "=⃥", bnequiv: "≡⃥", bNot: "⫭", bnot: "⌐", Bopf: "𝔹", bopf: "𝕓", bot: "⊥", bottom: "⊥", bowtie: "⋈", boxbox: "⧉", boxdl: "┐", boxdL: "╕", boxDl: "╖", boxDL: "╗", boxdr: "┌", boxdR: "╒", boxDr: "╓", boxDR: "╔", boxh: "─", boxH: "═", boxhd: "┬", boxHd: "╤", boxhD: "╥", boxHD: "╦", boxhu: "┴", boxHu: "╧", boxhU: "╨", boxHU: "╩", boxminus: "⊟", boxplus: "⊞", boxtimes: "⊠", boxul: "┘", boxuL: "╛", boxUl: "╜", boxUL: "╝", boxur: "└", boxuR: "╘", boxUr: "╙", boxUR: "╚", boxv: "│", boxV: "║", boxvh: "┼", boxvH: "╪", boxVh: "╫", boxVH: "╬", boxvl: "┤", boxvL: "╡", boxVl: "╢", boxVL: "╣", boxvr: "├", boxvR: "╞", boxVr: "╟", boxVR: "╠", bprime: "‵", breve: "˘", Breve: "˘", brvbar: "¦", bscr: "𝒷", Bscr: "ℬ", bsemi: "⁏", bsim: "∽", bsime: "⋍", bsolb: "⧅", bsol: "\\", bsolhsub: "⟈", bull: "•", bullet: "•", bump: "≎", bumpE: "⪮", bumpe: "≏", Bumpeq: "≎", bumpeq: "≏", Cacute: "Ć", cacute: "ć", capand: "⩄", capbrcup: "⩉", capcap: "⩋", cap: "∩", Cap: "⋒", capcup: "⩇", capdot: "⩀", CapitalDifferentialD: "ⅅ", caps: "∩︀", caret: "⁁", caron: "ˇ", Cayleys: "ℭ", ccaps: "⩍", Ccaron: "Č", ccaron: "č", Ccedil: "Ç", ccedil: "ç", Ccirc: "Ĉ", ccirc: "ĉ", Cconint: "∰", ccups: "⩌", ccupssm: "⩐", Cdot: "Ċ", cdot: "ċ", cedil: "¸", Cedilla: "¸", cemptyv: "⦲", cent: "¢", centerdot: "·", CenterDot: "·", cfr: "𝔠", Cfr: "ℭ", CHcy: "Ч", chcy: "ч", check: "✓", checkmark: "✓", Chi: "Χ", chi: "χ", circ: "ˆ", circeq: "≗", circlearrowleft: "↺", circlearrowright: "↻", circledast: "⊛", circledcirc: "⊚", circleddash: "⊝", CircleDot: "⊙", circledR: "®", circledS: "Ⓢ", CircleMinus: "⊖", CirclePlus: "⊕", CircleTimes: "⊗", cir: "○", cirE: "⧃", cire: "≗", cirfnint: "⨐", cirmid: "⫯", cirscir: "⧂", ClockwiseContourIntegral: "∲", CloseCurlyDoubleQuote: "”", CloseCurlyQuote: "’", clubs: "♣", clubsuit: "♣", colon: ":", Colon: "∷", Colone: "⩴", colone: "≔", coloneq: "≔", comma: ",", commat: "@", comp: "∁", compfn: "∘", complement: "∁", complexes: "ℂ", cong: "≅", congdot: "⩭", Congruent: "≡", conint: "∮", Conint: "∯", ContourIntegral: "∮", copf: "𝕔", Copf: "ℂ", coprod: "∐", Coproduct: "∐", copy: "©", COPY: "©", copysr: "℗", CounterClockwiseContourIntegral: "∳", crarr: "↵", cross: "✗", Cross: "⨯", Cscr: "𝒞", cscr: "𝒸", csub: "⫏", csube: "⫑", csup: "⫐", csupe: "⫒", ctdot: "⋯", cudarrl: "⤸", cudarrr: "⤵", cuepr: "⋞", cuesc: "⋟", cularr: "↶", cularrp: "⤽", cupbrcap: "⩈", cupcap: "⩆", CupCap: "≍", cup: "∪", Cup: "⋓", cupcup: "⩊", cupdot: "⊍", cupor: "⩅", cups: "∪︀", curarr: "↷", curarrm: "⤼", curlyeqprec: "⋞", curlyeqsucc: "⋟", curlyvee: "⋎", curlywedge: "⋏", curren: "¤", curvearrowleft: "↶", curvearrowright: "↷", cuvee: "⋎", cuwed: "⋏", cwconint: "∲", cwint: "∱", cylcty: "⌭", dagger: "†", Dagger: "‡", daleth: "ℸ", darr: "↓", Darr: "↡", dArr: "⇓", dash: "‐", Dashv: "⫤", dashv: "⊣", dbkarow: "⤏", dblac: "˝", Dcaron: "Ď", dcaron: "ď", Dcy: "Д", dcy: "д", ddagger: "‡", ddarr: "⇊", DD: "ⅅ", dd: "ⅆ", DDotrahd: "⤑", ddotseq: "⩷", deg: "°", Del: "∇", Delta: "Δ", delta: "δ", demptyv: "⦱", dfisht: "⥿", Dfr: "𝔇", dfr: "𝔡", dHar: "⥥", dharl: "⇃", dharr: "⇂", DiacriticalAcute: "´", DiacriticalDot: "˙", DiacriticalDoubleAcute: "˝", DiacriticalGrave: "`", DiacriticalTilde: "˜", diam: "⋄", diamond: "⋄", Diamond: "⋄", diamondsuit: "♦", diams: "♦", die: "¨", DifferentialD: "ⅆ", digamma: "ϝ", disin: "⋲", div: "÷", divide: "÷", divideontimes: "⋇", divonx: "⋇", DJcy: "Ђ", djcy: "ђ", dlcorn: "⌞", dlcrop: "⌍", dollar: "$", Dopf: "𝔻", dopf: "𝕕", Dot: "¨", dot: "˙", DotDot: "⃜", doteq: "≐", doteqdot: "≑", DotEqual: "≐", dotminus: "∸", dotplus: "∔", dotsquare: "⊡", doublebarwedge: "⌆", DoubleContourIntegral: "∯", DoubleDot: "¨", DoubleDownArrow: "⇓", DoubleLeftArrow: "⇐", DoubleLeftRightArrow: "⇔", DoubleLeftTee: "⫤", DoubleLongLeftArrow: "⟸", DoubleLongLeftRightArrow: "⟺", DoubleLongRightArrow: "⟹", DoubleRightArrow: "⇒", DoubleRightTee: "⊨", DoubleUpArrow: "⇑", DoubleUpDownArrow: "⇕", DoubleVerticalBar: "∥", DownArrowBar: "⤓", downarrow: "↓", DownArrow: "↓", Downarrow: "⇓", DownArrowUpArrow: "⇵", DownBreve: "̑", downdownarrows: "⇊", downharpoonleft: "⇃", downharpoonright: "⇂", DownLeftRightVector: "⥐", DownLeftTeeVector: "⥞", DownLeftVectorBar: "⥖", DownLeftVector: "↽", DownRightTeeVector: "⥟", DownRightVectorBar: "⥗", DownRightVector: "⇁", DownTeeArrow: "↧", DownTee: "⊤", drbkarow: "⤐", drcorn: "⌟", drcrop: "⌌", Dscr: "𝒟", dscr: "𝒹", DScy: "Ѕ", dscy: "ѕ", dsol: "⧶", Dstrok: "Đ", dstrok: "đ", dtdot: "⋱", dtri: "▿", dtrif: "▾", duarr: "⇵", duhar: "⥯", dwangle: "⦦", DZcy: "Џ", dzcy: "џ", dzigrarr: "⟿", Eacute: "É", eacute: "é", easter: "⩮", Ecaron: "Ě", ecaron: "ě", Ecirc: "Ê", ecirc: "ê", ecir: "≖", ecolon: "≕", Ecy: "Э", ecy: "э", eDDot: "⩷", Edot: "Ė", edot: "ė", eDot: "≑", ee: "ⅇ", efDot: "≒", Efr: "𝔈", efr: "𝔢", eg: "⪚", Egrave: "È", egrave: "è", egs: "⪖", egsdot: "⪘", el: "⪙", Element: "∈", elinters: "⏧", ell: "ℓ", els: "⪕", elsdot: "⪗", Emacr: "Ē", emacr: "ē", empty: "∅", emptyset: "∅", EmptySmallSquare: "◻", emptyv: "∅", EmptyVerySmallSquare: "▫", emsp13: " ", emsp14: " ", emsp: " ", ENG: "Ŋ", eng: "ŋ", ensp: " ", Eogon: "Ę", eogon: "ę", Eopf: "𝔼", eopf: "𝕖", epar: "⋕", eparsl: "⧣", eplus: "⩱", epsi: "ε", Epsilon: "Ε", epsilon: "ε", epsiv: "ϵ", eqcirc: "≖", eqcolon: "≕", eqsim: "≂", eqslantgtr: "⪖", eqslantless: "⪕", Equal: "⩵", equals: "=", EqualTilde: "≂", equest: "≟", Equilibrium: "⇌", equiv: "≡", equivDD: "⩸", eqvparsl: "⧥", erarr: "⥱", erDot: "≓", escr: "ℯ", Escr: "ℰ", esdot: "≐", Esim: "⩳", esim: "≂", Eta: "Η", eta: "η", ETH: "Ð", eth: "ð", Euml: "Ë", euml: "ë", euro: "€", excl: "!", exist: "∃", Exists: "∃", expectation: "ℰ", exponentiale: "ⅇ", ExponentialE: "ⅇ", fallingdotseq: "≒", Fcy: "Ф", fcy: "ф", female: "♀", ffilig: "ﬃ", fflig: "ﬀ", ffllig: "ﬄ", Ffr: "𝔉", ffr: "𝔣", filig: "ﬁ", FilledSmallSquare: "◼", FilledVerySmallSquare: "▪", fjlig: "fj", flat: "♭", fllig: "ﬂ", fltns: "▱", fnof: "ƒ", Fopf: "𝔽", fopf: "𝕗", forall: "∀", ForAll: "∀", fork: "⋔", forkv: "⫙", Fouriertrf: "ℱ", fpartint: "⨍", frac12: "½", frac13: "⅓", frac14: "¼", frac15: "⅕", frac16: "⅙", frac18: "⅛", frac23: "⅔", frac25: "⅖", frac34: "¾", frac35: "⅗", frac38: "⅜", frac45: "⅘", frac56: "⅚", frac58: "⅝", frac78: "⅞", frasl: "⁄", frown: "⌢", fscr: "𝒻", Fscr: "ℱ", gacute: "ǵ", Gamma: "Γ", gamma: "γ", Gammad: "Ϝ", gammad: "ϝ", gap: "⪆", Gbreve: "Ğ", gbreve: "ğ", Gcedil: "Ģ", Gcirc: "Ĝ", gcirc: "ĝ", Gcy: "Г", gcy: "г", Gdot: "Ġ", gdot: "ġ", ge: "≥", gE: "≧", gEl: "⪌", gel: "⋛", geq: "≥", geqq: "≧", geqslant: "⩾", gescc: "⪩", ges: "⩾", gesdot: "⪀", gesdoto: "⪂", gesdotol: "⪄", gesl: "⋛︀", gesles: "⪔", Gfr: "𝔊", gfr: "𝔤", gg: "≫", Gg: "⋙", ggg: "⋙", gimel: "ℷ", GJcy: "Ѓ", gjcy: "ѓ", gla: "⪥", gl: "≷", glE: "⪒", glj: "⪤", gnap: "⪊", gnapprox: "⪊", gne: "⪈", gnE: "≩", gneq: "⪈", gneqq: "≩", gnsim: "⋧", Gopf: "𝔾", gopf: "𝕘", grave: "`", GreaterEqual: "≥", GreaterEqualLess: "⋛", GreaterFullEqual: "≧", GreaterGreater: "⪢", GreaterLess: "≷", GreaterSlantEqual: "⩾", GreaterTilde: "≳", Gscr: "𝒢", gscr: "ℊ", gsim: "≳", gsime: "⪎", gsiml: "⪐", gtcc: "⪧", gtcir: "⩺", gt: ">", GT: ">", Gt: "≫", gtdot: "⋗", gtlPar: "⦕", gtquest: "⩼", gtrapprox: "⪆", gtrarr: "⥸", gtrdot: "⋗", gtreqless: "⋛", gtreqqless: "⪌", gtrless: "≷", gtrsim: "≳", gvertneqq: "≩︀", gvnE: "≩︀", Hacek: "ˇ", hairsp: " ", half: "½", hamilt: "ℋ", HARDcy: "Ъ", hardcy: "ъ", harrcir: "⥈", harr: "↔", hArr: "⇔", harrw: "↭", Hat: "^", hbar: "ℏ", Hcirc: "Ĥ", hcirc: "ĥ", hearts: "♥", heartsuit: "♥", hellip: "…", hercon: "⊹", hfr: "𝔥", Hfr: "ℌ", HilbertSpace: "ℋ", hksearow: "⤥", hkswarow: "⤦", hoarr: "⇿", homtht: "∻", hookleftarrow: "↩", hookrightarrow: "↪", hopf: "𝕙", Hopf: "ℍ", horbar: "―", HorizontalLine: "─", hscr: "𝒽", Hscr: "ℋ", hslash: "ℏ", Hstrok: "Ħ", hstrok: "ħ", HumpDownHump: "≎", HumpEqual: "≏", hybull: "⁃", hyphen: "‐", Iacute: "Í", iacute: "í", ic: "⁣", Icirc: "Î", icirc: "î", Icy: "И", icy: "и", Idot: "İ", IEcy: "Е", iecy: "е", iexcl: "¡", iff: "⇔", ifr: "𝔦", Ifr: "ℑ", Igrave: "Ì", igrave: "ì", ii: "ⅈ", iiiint: "⨌", iiint: "∭", iinfin: "⧜", iiota: "℩", IJlig: "Ĳ", ijlig: "ĳ", Imacr: "Ī", imacr: "ī", image: "ℑ", ImaginaryI: "ⅈ", imagline: "ℐ", imagpart: "ℑ", imath: "ı", Im: "ℑ", imof: "⊷", imped: "Ƶ", Implies: "⇒", incare: "℅", in: "∈", infin: "∞", infintie: "⧝", inodot: "ı", intcal: "⊺", int: "∫", Int: "∬", integers: "ℤ", Integral: "∫", intercal: "⊺", Intersection: "⋂", intlarhk: "⨗", intprod: "⨼", InvisibleComma: "⁣", InvisibleTimes: "⁢", IOcy: "Ё", iocy: "ё", Iogon: "Į", iogon: "į", Iopf: "𝕀", iopf: "𝕚", Iota: "Ι", iota: "ι", iprod: "⨼", iquest: "¿", iscr: "𝒾", Iscr: "ℐ", isin: "∈", isindot: "⋵", isinE: "⋹", isins: "⋴", isinsv: "⋳", isinv: "∈", it: "⁢", Itilde: "Ĩ", itilde: "ĩ", Iukcy: "І", iukcy: "і", Iuml: "Ï", iuml: "ï", Jcirc: "Ĵ", jcirc: "ĵ", Jcy: "Й", jcy: "й", Jfr: "𝔍", jfr: "𝔧", jmath: "ȷ", Jopf: "𝕁", jopf: "𝕛", Jscr: "𝒥", jscr: "𝒿", Jsercy: "Ј", jsercy: "ј", Jukcy: "Є", jukcy: "є", Kappa: "Κ", kappa: "κ", kappav: "ϰ", Kcedil: "Ķ", kcedil: "ķ", Kcy: "К", kcy: "к", Kfr: "𝔎", kfr: "𝔨", kgreen: "ĸ", KHcy: "Х", khcy: "х", KJcy: "Ќ", kjcy: "ќ", Kopf: "𝕂", kopf: "𝕜", Kscr: "𝒦", kscr: "𝓀", lAarr: "⇚", Lacute: "Ĺ", lacute: "ĺ", laemptyv: "⦴", lagran: "ℒ", Lambda: "Λ", lambda: "λ", lang: "⟨", Lang: "⟪", langd: "⦑", langle: "⟨", lap: "⪅", Laplacetrf: "ℒ", laquo: "«", larrb: "⇤", larrbfs: "⤟", larr: "←", Larr: "↞", lArr: "⇐", larrfs: "⤝", larrhk: "↩", larrlp: "↫", larrpl: "⤹", larrsim: "⥳", larrtl: "↢", latail: "⤙", lAtail: "⤛", lat: "⪫", late: "⪭", lates: "⪭︀", lbarr: "⤌", lBarr: "⤎", lbbrk: "❲", lbrace: "{", lbrack: "[", lbrke: "⦋", lbrksld: "⦏", lbrkslu: "⦍", Lcaron: "Ľ", lcaron: "ľ", Lcedil: "Ļ", lcedil: "ļ", lceil: "⌈", lcub: "{", Lcy: "Л", lcy: "л", ldca: "⤶", ldquo: "“", ldquor: "„", ldrdhar: "⥧", ldrushar: "⥋", ldsh: "↲", le: "≤", lE: "≦", LeftAngleBracket: "⟨", LeftArrowBar: "⇤", leftarrow: "←", LeftArrow: "←", Leftarrow: "⇐", LeftArrowRightArrow: "⇆", leftarrowtail: "↢", LeftCeiling: "⌈", LeftDoubleBracket: "⟦", LeftDownTeeVector: "⥡", LeftDownVectorBar: "⥙", LeftDownVector: "⇃", LeftFloor: "⌊", leftharpoondown: "↽", leftharpoonup: "↼", leftleftarrows: "⇇", leftrightarrow: "↔", LeftRightArrow: "↔", Leftrightarrow: "⇔", leftrightarrows: "⇆", leftrightharpoons: "⇋", leftrightsquigarrow: "↭", LeftRightVector: "⥎", LeftTeeArrow: "↤", LeftTee: "⊣", LeftTeeVector: "⥚", leftthreetimes: "⋋", LeftTriangleBar: "⧏", LeftTriangle: "⊲", LeftTriangleEqual: "⊴", LeftUpDownVector: "⥑", LeftUpTeeVector: "⥠", LeftUpVectorBar: "⥘", LeftUpVector: "↿", LeftVectorBar: "⥒", LeftVector: "↼", lEg: "⪋", leg: "⋚", leq: "≤", leqq: "≦", leqslant: "⩽", lescc: "⪨", les: "⩽", lesdot: "⩿", lesdoto: "⪁", lesdotor: "⪃", lesg: "⋚︀", lesges: "⪓", lessapprox: "⪅", lessdot: "⋖", lesseqgtr: "⋚", lesseqqgtr: "⪋", LessEqualGreater: "⋚", LessFullEqual: "≦", LessGreater: "≶", lessgtr: "≶", LessLess: "⪡", lesssim: "≲", LessSlantEqual: "⩽", LessTilde: "≲", lfisht: "⥼", lfloor: "⌊", Lfr: "𝔏", lfr: "𝔩", lg: "≶", lgE: "⪑", lHar: "⥢", lhard: "↽", lharu: "↼", lharul: "⥪", lhblk: "▄", LJcy: "Љ", ljcy: "љ", llarr: "⇇", ll: "≪", Ll: "⋘", llcorner: "⌞", Lleftarrow: "⇚", llhard: "⥫", lltri: "◺", Lmidot: "Ŀ", lmidot: "ŀ", lmoustache: "⎰", lmoust: "⎰", lnap: "⪉", lnapprox: "⪉", lne: "⪇", lnE: "≨", lneq: "⪇", lneqq: "≨", lnsim: "⋦", loang: "⟬", loarr: "⇽", lobrk: "⟦", longleftarrow: "⟵", LongLeftArrow: "⟵", Longleftarrow: "⟸", longleftrightarrow: "⟷", LongLeftRightArrow: "⟷", Longleftrightarrow: "⟺", longmapsto: "⟼", longrightarrow: "⟶", LongRightArrow: "⟶", Longrightarrow: "⟹", looparrowleft: "↫", looparrowright: "↬", lopar: "⦅", Lopf: "𝕃", lopf: "𝕝", loplus: "⨭", lotimes: "⨴", lowast: "∗", lowbar: "_", LowerLeftArrow: "↙", LowerRightArrow: "↘", loz: "◊", lozenge: "◊", lozf: "⧫", lpar: "(", lparlt: "⦓", lrarr: "⇆", lrcorner: "⌟", lrhar: "⇋", lrhard: "⥭", lrm: "‎", lrtri: "⊿", lsaquo: "‹", lscr: "𝓁", Lscr: "ℒ", lsh: "↰", Lsh: "↰", lsim: "≲", lsime: "⪍", lsimg: "⪏", lsqb: "[", lsquo: "‘", lsquor: "‚", Lstrok: "Ł", lstrok: "ł", ltcc: "⪦", ltcir: "⩹", lt: "<", LT: "<", Lt: "≪", ltdot: "⋖", lthree: "⋋", ltimes: "⋉", ltlarr: "⥶", ltquest: "⩻", ltri: "◃", ltrie: "⊴", ltrif: "◂", ltrPar: "⦖", lurdshar: "⥊", luruhar: "⥦", lvertneqq: "≨︀", lvnE: "≨︀", macr: "¯", male: "♂", malt: "✠", maltese: "✠", Map: "⤅", map: "↦", mapsto: "↦", mapstodown: "↧", mapstoleft: "↤", mapstoup: "↥", marker: "▮", mcomma: "⨩", Mcy: "М", mcy: "м", mdash: "—", mDDot: "∺", measuredangle: "∡", MediumSpace: " ", Mellintrf: "ℳ", Mfr: "𝔐", mfr: "𝔪", mho: "℧", micro: "µ", midast: "*", midcir: "⫰", mid: "∣", middot: "·", minusb: "⊟", minus: "−", minusd: "∸", minusdu: "⨪", MinusPlus: "∓", mlcp: "⫛", mldr: "…", mnplus: "∓", models: "⊧", Mopf: "𝕄", mopf: "𝕞", mp: "∓", mscr: "𝓂", Mscr: "ℳ", mstpos: "∾", Mu: "Μ", mu: "μ", multimap: "⊸", mumap: "⊸", nabla: "∇", Nacute: "Ń", nacute: "ń", nang: "∠⃒", nap: "≉", napE: "⩰̸", napid: "≋̸", napos: "ŉ", napprox: "≉", natural: "♮", naturals: "ℕ", natur: "♮", nbsp: " ", nbump: "≎̸", nbumpe: "≏̸", ncap: "⩃", Ncaron: "Ň", ncaron: "ň", Ncedil: "Ņ", ncedil: "ņ", ncong: "≇", ncongdot: "⩭̸", ncup: "⩂", Ncy: "Н", ncy: "н", ndash: "–", nearhk: "⤤", nearr: "↗", neArr: "⇗", nearrow: "↗", ne: "≠", nedot: "≐̸", NegativeMediumSpace: "​", NegativeThickSpace: "​", NegativeThinSpace: "​", NegativeVeryThinSpace: "​", nequiv: "≢", nesear: "⤨", nesim: "≂̸", NestedGreaterGreater: "≫", NestedLessLess: "≪", NewLine: `
`, nexist: "∄", nexists: "∄", Nfr: "𝔑", nfr: "𝔫", ngE: "≧̸", nge: "≱", ngeq: "≱", ngeqq: "≧̸", ngeqslant: "⩾̸", nges: "⩾̸", nGg: "⋙̸", ngsim: "≵", nGt: "≫⃒", ngt: "≯", ngtr: "≯", nGtv: "≫̸", nharr: "↮", nhArr: "⇎", nhpar: "⫲", ni: "∋", nis: "⋼", nisd: "⋺", niv: "∋", NJcy: "Њ", njcy: "њ", nlarr: "↚", nlArr: "⇍", nldr: "‥", nlE: "≦̸", nle: "≰", nleftarrow: "↚", nLeftarrow: "⇍", nleftrightarrow: "↮", nLeftrightarrow: "⇎", nleq: "≰", nleqq: "≦̸", nleqslant: "⩽̸", nles: "⩽̸", nless: "≮", nLl: "⋘̸", nlsim: "≴", nLt: "≪⃒", nlt: "≮", nltri: "⋪", nltrie: "⋬", nLtv: "≪̸", nmid: "∤", NoBreak: "⁠", NonBreakingSpace: " ", nopf: "𝕟", Nopf: "ℕ", Not: "⫬", not: "¬", NotCongruent: "≢", NotCupCap: "≭", NotDoubleVerticalBar: "∦", NotElement: "∉", NotEqual: "≠", NotEqualTilde: "≂̸", NotExists: "∄", NotGreater: "≯", NotGreaterEqual: "≱", NotGreaterFullEqual: "≧̸", NotGreaterGreater: "≫̸", NotGreaterLess: "≹", NotGreaterSlantEqual: "⩾̸", NotGreaterTilde: "≵", NotHumpDownHump: "≎̸", NotHumpEqual: "≏̸", notin: "∉", notindot: "⋵̸", notinE: "⋹̸", notinva: "∉", notinvb: "⋷", notinvc: "⋶", NotLeftTriangleBar: "⧏̸", NotLeftTriangle: "⋪", NotLeftTriangleEqual: "⋬", NotLess: "≮", NotLessEqual: "≰", NotLessGreater: "≸", NotLessLess: "≪̸", NotLessSlantEqual: "⩽̸", NotLessTilde: "≴", NotNestedGreaterGreater: "⪢̸", NotNestedLessLess: "⪡̸", notni: "∌", notniva: "∌", notnivb: "⋾", notnivc: "⋽", NotPrecedes: "⊀", NotPrecedesEqual: "⪯̸", NotPrecedesSlantEqual: "⋠", NotReverseElement: "∌", NotRightTriangleBar: "⧐̸", NotRightTriangle: "⋫", NotRightTriangleEqual: "⋭", NotSquareSubset: "⊏̸", NotSquareSubsetEqual: "⋢", NotSquareSuperset: "⊐̸", NotSquareSupersetEqual: "⋣", NotSubset: "⊂⃒", NotSubsetEqual: "⊈", NotSucceeds: "⊁", NotSucceedsEqual: "⪰̸", NotSucceedsSlantEqual: "⋡", NotSucceedsTilde: "≿̸", NotSuperset: "⊃⃒", NotSupersetEqual: "⊉", NotTilde: "≁", NotTildeEqual: "≄", NotTildeFullEqual: "≇", NotTildeTilde: "≉", NotVerticalBar: "∤", nparallel: "∦", npar: "∦", nparsl: "⫽⃥", npart: "∂̸", npolint: "⨔", npr: "⊀", nprcue: "⋠", nprec: "⊀", npreceq: "⪯̸", npre: "⪯̸", nrarrc: "⤳̸", nrarr: "↛", nrArr: "⇏", nrarrw: "↝̸", nrightarrow: "↛", nRightarrow: "⇏", nrtri: "⋫", nrtrie: "⋭", nsc: "⊁", nsccue: "⋡", nsce: "⪰̸", Nscr: "𝒩", nscr: "𝓃", nshortmid: "∤", nshortparallel: "∦", nsim: "≁", nsime: "≄", nsimeq: "≄", nsmid: "∤", nspar: "∦", nsqsube: "⋢", nsqsupe: "⋣", nsub: "⊄", nsubE: "⫅̸", nsube: "⊈", nsubset: "⊂⃒", nsubseteq: "⊈", nsubseteqq: "⫅̸", nsucc: "⊁", nsucceq: "⪰̸", nsup: "⊅", nsupE: "⫆̸", nsupe: "⊉", nsupset: "⊃⃒", nsupseteq: "⊉", nsupseteqq: "⫆̸", ntgl: "≹", Ntilde: "Ñ", ntilde: "ñ", ntlg: "≸", ntriangleleft: "⋪", ntrianglelefteq: "⋬", ntriangleright: "⋫", ntrianglerighteq: "⋭", Nu: "Ν", nu: "ν", num: "#", numero: "№", numsp: " ", nvap: "≍⃒", nvdash: "⊬", nvDash: "⊭", nVdash: "⊮", nVDash: "⊯", nvge: "≥⃒", nvgt: ">⃒", nvHarr: "⤄", nvinfin: "⧞", nvlArr: "⤂", nvle: "≤⃒", nvlt: "<⃒", nvltrie: "⊴⃒", nvrArr: "⤃", nvrtrie: "⊵⃒", nvsim: "∼⃒", nwarhk: "⤣", nwarr: "↖", nwArr: "⇖", nwarrow: "↖", nwnear: "⤧", Oacute: "Ó", oacute: "ó", oast: "⊛", Ocirc: "Ô", ocirc: "ô", ocir: "⊚", Ocy: "О", ocy: "о", odash: "⊝", Odblac: "Ő", odblac: "ő", odiv: "⨸", odot: "⊙", odsold: "⦼", OElig: "Œ", oelig: "œ", ofcir: "⦿", Ofr: "𝔒", ofr: "𝔬", ogon: "˛", Ograve: "Ò", ograve: "ò", ogt: "⧁", ohbar: "⦵", ohm: "Ω", oint: "∮", olarr: "↺", olcir: "⦾", olcross: "⦻", oline: "‾", olt: "⧀", Omacr: "Ō", omacr: "ō", Omega: "Ω", omega: "ω", Omicron: "Ο", omicron: "ο", omid: "⦶", ominus: "⊖", Oopf: "𝕆", oopf: "𝕠", opar: "⦷", OpenCurlyDoubleQuote: "“", OpenCurlyQuote: "‘", operp: "⦹", oplus: "⊕", orarr: "↻", Or: "⩔", or: "∨", ord: "⩝", order: "ℴ", orderof: "ℴ", ordf: "ª", ordm: "º", origof: "⊶", oror: "⩖", orslope: "⩗", orv: "⩛", oS: "Ⓢ", Oscr: "𝒪", oscr: "ℴ", Oslash: "Ø", oslash: "ø", osol: "⊘", Otilde: "Õ", otilde: "õ", otimesas: "⨶", Otimes: "⨷", otimes: "⊗", Ouml: "Ö", ouml: "ö", ovbar: "⌽", OverBar: "‾", OverBrace: "⏞", OverBracket: "⎴", OverParenthesis: "⏜", para: "¶", parallel: "∥", par: "∥", parsim: "⫳", parsl: "⫽", part: "∂", PartialD: "∂", Pcy: "П", pcy: "п", percnt: "%", period: ".", permil: "‰", perp: "⊥", pertenk: "‱", Pfr: "𝔓", pfr: "𝔭", Phi: "Φ", phi: "φ", phiv: "ϕ", phmmat: "ℳ", phone: "☎", Pi: "Π", pi: "π", pitchfork: "⋔", piv: "ϖ", planck: "ℏ", planckh: "ℎ", plankv: "ℏ", plusacir: "⨣", plusb: "⊞", pluscir: "⨢", plus: "+", plusdo: "∔", plusdu: "⨥", pluse: "⩲", PlusMinus: "±", plusmn: "±", plussim: "⨦", plustwo: "⨧", pm: "±", Poincareplane: "ℌ", pointint: "⨕", popf: "𝕡", Popf: "ℙ", pound: "£", prap: "⪷", Pr: "⪻", pr: "≺", prcue: "≼", precapprox: "⪷", prec: "≺", preccurlyeq: "≼", Precedes: "≺", PrecedesEqual: "⪯", PrecedesSlantEqual: "≼", PrecedesTilde: "≾", preceq: "⪯", precnapprox: "⪹", precneqq: "⪵", precnsim: "⋨", pre: "⪯", prE: "⪳", precsim: "≾", prime: "′", Prime: "″", primes: "ℙ", prnap: "⪹", prnE: "⪵", prnsim: "⋨", prod: "∏", Product: "∏", profalar: "⌮", profline: "⌒", profsurf: "⌓", prop: "∝", Proportional: "∝", Proportion: "∷", propto: "∝", prsim: "≾", prurel: "⊰", Pscr: "𝒫", pscr: "𝓅", Psi: "Ψ", psi: "ψ", puncsp: " ", Qfr: "𝔔", qfr: "𝔮", qint: "⨌", qopf: "𝕢", Qopf: "ℚ", qprime: "⁗", Qscr: "𝒬", qscr: "𝓆", quaternions: "ℍ", quatint: "⨖", quest: "?", questeq: "≟", quot: '"', QUOT: '"', rAarr: "⇛", race: "∽̱", Racute: "Ŕ", racute: "ŕ", radic: "√", raemptyv: "⦳", rang: "⟩", Rang: "⟫", rangd: "⦒", range: "⦥", rangle: "⟩", raquo: "»", rarrap: "⥵", rarrb: "⇥", rarrbfs: "⤠", rarrc: "⤳", rarr: "→", Rarr: "↠", rArr: "⇒", rarrfs: "⤞", rarrhk: "↪", rarrlp: "↬", rarrpl: "⥅", rarrsim: "⥴", Rarrtl: "⤖", rarrtl: "↣", rarrw: "↝", ratail: "⤚", rAtail: "⤜", ratio: "∶", rationals: "ℚ", rbarr: "⤍", rBarr: "⤏", RBarr: "⤐", rbbrk: "❳", rbrace: "}", rbrack: "]", rbrke: "⦌", rbrksld: "⦎", rbrkslu: "⦐", Rcaron: "Ř", rcaron: "ř", Rcedil: "Ŗ", rcedil: "ŗ", rceil: "⌉", rcub: "}", Rcy: "Р", rcy: "р", rdca: "⤷", rdldhar: "⥩", rdquo: "”", rdquor: "”", rdsh: "↳", real: "ℜ", realine: "ℛ", realpart: "ℜ", reals: "ℝ", Re: "ℜ", rect: "▭", reg: "®", REG: "®", ReverseElement: "∋", ReverseEquilibrium: "⇋", ReverseUpEquilibrium: "⥯", rfisht: "⥽", rfloor: "⌋", rfr: "𝔯", Rfr: "ℜ", rHar: "⥤", rhard: "⇁", rharu: "⇀", rharul: "⥬", Rho: "Ρ", rho: "ρ", rhov: "ϱ", RightAngleBracket: "⟩", RightArrowBar: "⇥", rightarrow: "→", RightArrow: "→", Rightarrow: "⇒", RightArrowLeftArrow: "⇄", rightarrowtail: "↣", RightCeiling: "⌉", RightDoubleBracket: "⟧", RightDownTeeVector: "⥝", RightDownVectorBar: "⥕", RightDownVector: "⇂", RightFloor: "⌋", rightharpoondown: "⇁", rightharpoonup: "⇀", rightleftarrows: "⇄", rightleftharpoons: "⇌", rightrightarrows: "⇉", rightsquigarrow: "↝", RightTeeArrow: "↦", RightTee: "⊢", RightTeeVector: "⥛", rightthreetimes: "⋌", RightTriangleBar: "⧐", RightTriangle: "⊳", RightTriangleEqual: "⊵", RightUpDownVector: "⥏", RightUpTeeVector: "⥜", RightUpVectorBar: "⥔", RightUpVector: "↾", RightVectorBar: "⥓", RightVector: "⇀", ring: "˚", risingdotseq: "≓", rlarr: "⇄", rlhar: "⇌", rlm: "‏", rmoustache: "⎱", rmoust: "⎱", rnmid: "⫮", roang: "⟭", roarr: "⇾", robrk: "⟧", ropar: "⦆", ropf: "𝕣", Ropf: "ℝ", roplus: "⨮", rotimes: "⨵", RoundImplies: "⥰", rpar: ")", rpargt: "⦔", rppolint: "⨒", rrarr: "⇉", Rrightarrow: "⇛", rsaquo: "›", rscr: "𝓇", Rscr: "ℛ", rsh: "↱", Rsh: "↱", rsqb: "]", rsquo: "’", rsquor: "’", rthree: "⋌", rtimes: "⋊", rtri: "▹", rtrie: "⊵", rtrif: "▸", rtriltri: "⧎", RuleDelayed: "⧴", ruluhar: "⥨", rx: "℞", Sacute: "Ś", sacute: "ś", sbquo: "‚", scap: "⪸", Scaron: "Š", scaron: "š", Sc: "⪼", sc: "≻", sccue: "≽", sce: "⪰", scE: "⪴", Scedil: "Ş", scedil: "ş", Scirc: "Ŝ", scirc: "ŝ", scnap: "⪺", scnE: "⪶", scnsim: "⋩", scpolint: "⨓", scsim: "≿", Scy: "С", scy: "с", sdotb: "⊡", sdot: "⋅", sdote: "⩦", searhk: "⤥", searr: "↘", seArr: "⇘", searrow: "↘", sect: "§", semi: ";", seswar: "⤩", setminus: "∖", setmn: "∖", sext: "✶", Sfr: "𝔖", sfr: "𝔰", sfrown: "⌢", sharp: "♯", SHCHcy: "Щ", shchcy: "щ", SHcy: "Ш", shcy: "ш", ShortDownArrow: "↓", ShortLeftArrow: "←", shortmid: "∣", shortparallel: "∥", ShortRightArrow: "→", ShortUpArrow: "↑", shy: "­", Sigma: "Σ", sigma: "σ", sigmaf: "ς", sigmav: "ς", sim: "∼", simdot: "⩪", sime: "≃", simeq: "≃", simg: "⪞", simgE: "⪠", siml: "⪝", simlE: "⪟", simne: "≆", simplus: "⨤", simrarr: "⥲", slarr: "←", SmallCircle: "∘", smallsetminus: "∖", smashp: "⨳", smeparsl: "⧤", smid: "∣", smile: "⌣", smt: "⪪", smte: "⪬", smtes: "⪬︀", SOFTcy: "Ь", softcy: "ь", solbar: "⌿", solb: "⧄", sol: "/", Sopf: "𝕊", sopf: "𝕤", spades: "♠", spadesuit: "♠", spar: "∥", sqcap: "⊓", sqcaps: "⊓︀", sqcup: "⊔", sqcups: "⊔︀", Sqrt: "√", sqsub: "⊏", sqsube: "⊑", sqsubset: "⊏", sqsubseteq: "⊑", sqsup: "⊐", sqsupe: "⊒", sqsupset: "⊐", sqsupseteq: "⊒", square: "□", Square: "□", SquareIntersection: "⊓", SquareSubset: "⊏", SquareSubsetEqual: "⊑", SquareSuperset: "⊐", SquareSupersetEqual: "⊒", SquareUnion: "⊔", squarf: "▪", squ: "□", squf: "▪", srarr: "→", Sscr: "𝒮", sscr: "𝓈", ssetmn: "∖", ssmile: "⌣", sstarf: "⋆", Star: "⋆", star: "☆", starf: "★", straightepsilon: "ϵ", straightphi: "ϕ", strns: "¯", sub: "⊂", Sub: "⋐", subdot: "⪽", subE: "⫅", sube: "⊆", subedot: "⫃", submult: "⫁", subnE: "⫋", subne: "⊊", subplus: "⪿", subrarr: "⥹", subset: "⊂", Subset: "⋐", subseteq: "⊆", subseteqq: "⫅", SubsetEqual: "⊆", subsetneq: "⊊", subsetneqq: "⫋", subsim: "⫇", subsub: "⫕", subsup: "⫓", succapprox: "⪸", succ: "≻", succcurlyeq: "≽", Succeeds: "≻", SucceedsEqual: "⪰", SucceedsSlantEqual: "≽", SucceedsTilde: "≿", succeq: "⪰", succnapprox: "⪺", succneqq: "⪶", succnsim: "⋩", succsim: "≿", SuchThat: "∋", sum: "∑", Sum: "∑", sung: "♪", sup1: "¹", sup2: "²", sup3: "³", sup: "⊃", Sup: "⋑", supdot: "⪾", supdsub: "⫘", supE: "⫆", supe: "⊇", supedot: "⫄", Superset: "⊃", SupersetEqual: "⊇", suphsol: "⟉", suphsub: "⫗", suplarr: "⥻", supmult: "⫂", supnE: "⫌", supne: "⊋", supplus: "⫀", supset: "⊃", Supset: "⋑", supseteq: "⊇", supseteqq: "⫆", supsetneq: "⊋", supsetneqq: "⫌", supsim: "⫈", supsub: "⫔", supsup: "⫖", swarhk: "⤦", swarr: "↙", swArr: "⇙", swarrow: "↙", swnwar: "⤪", szlig: "ß", Tab: "	", target: "⌖", Tau: "Τ", tau: "τ", tbrk: "⎴", Tcaron: "Ť", tcaron: "ť", Tcedil: "Ţ", tcedil: "ţ", Tcy: "Т", tcy: "т", tdot: "⃛", telrec: "⌕", Tfr: "𝔗", tfr: "𝔱", there4: "∴", therefore: "∴", Therefore: "∴", Theta: "Θ", theta: "θ", thetasym: "ϑ", thetav: "ϑ", thickapprox: "≈", thicksim: "∼", ThickSpace: "  ", ThinSpace: " ", thinsp: " ", thkap: "≈", thksim: "∼", THORN: "Þ", thorn: "þ", tilde: "˜", Tilde: "∼", TildeEqual: "≃", TildeFullEqual: "≅", TildeTilde: "≈", timesbar: "⨱", timesb: "⊠", times: "×", timesd: "⨰", tint: "∭", toea: "⤨", topbot: "⌶", topcir: "⫱", top: "⊤", Topf: "𝕋", topf: "𝕥", topfork: "⫚", tosa: "⤩", tprime: "‴", trade: "™", TRADE: "™", triangle: "▵", triangledown: "▿", triangleleft: "◃", trianglelefteq: "⊴", triangleq: "≜", triangleright: "▹", trianglerighteq: "⊵", tridot: "◬", trie: "≜", triminus: "⨺", TripleDot: "⃛", triplus: "⨹", trisb: "⧍", tritime: "⨻", trpezium: "⏢", Tscr: "𝒯", tscr: "𝓉", TScy: "Ц", tscy: "ц", TSHcy: "Ћ", tshcy: "ћ", Tstrok: "Ŧ", tstrok: "ŧ", twixt: "≬", twoheadleftarrow: "↞", twoheadrightarrow: "↠", Uacute: "Ú", uacute: "ú", uarr: "↑", Uarr: "↟", uArr: "⇑", Uarrocir: "⥉", Ubrcy: "Ў", ubrcy: "ў", Ubreve: "Ŭ", ubreve: "ŭ", Ucirc: "Û", ucirc: "û", Ucy: "У", ucy: "у", udarr: "⇅", Udblac: "Ű", udblac: "ű", udhar: "⥮", ufisht: "⥾", Ufr: "𝔘", ufr: "𝔲", Ugrave: "Ù", ugrave: "ù", uHar: "⥣", uharl: "↿", uharr: "↾", uhblk: "▀", ulcorn: "⌜", ulcorner: "⌜", ulcrop: "⌏", ultri: "◸", Umacr: "Ū", umacr: "ū", uml: "¨", UnderBar: "_", UnderBrace: "⏟", UnderBracket: "⎵", UnderParenthesis: "⏝", Union: "⋃", UnionPlus: "⊎", Uogon: "Ų", uogon: "ų", Uopf: "𝕌", uopf: "𝕦", UpArrowBar: "⤒", uparrow: "↑", UpArrow: "↑", Uparrow: "⇑", UpArrowDownArrow: "⇅", updownarrow: "↕", UpDownArrow: "↕", Updownarrow: "⇕", UpEquilibrium: "⥮", upharpoonleft: "↿", upharpoonright: "↾", uplus: "⊎", UpperLeftArrow: "↖", UpperRightArrow: "↗", upsi: "υ", Upsi: "ϒ", upsih: "ϒ", Upsilon: "Υ", upsilon: "υ", UpTeeArrow: "↥", UpTee: "⊥", upuparrows: "⇈", urcorn: "⌝", urcorner: "⌝", urcrop: "⌎", Uring: "Ů", uring: "ů", urtri: "◹", Uscr: "𝒰", uscr: "𝓊", utdot: "⋰", Utilde: "Ũ", utilde: "ũ", utri: "▵", utrif: "▴", uuarr: "⇈", Uuml: "Ü", uuml: "ü", uwangle: "⦧", vangrt: "⦜", varepsilon: "ϵ", varkappa: "ϰ", varnothing: "∅", varphi: "ϕ", varpi: "ϖ", varpropto: "∝", varr: "↕", vArr: "⇕", varrho: "ϱ", varsigma: "ς", varsubsetneq: "⊊︀", varsubsetneqq: "⫋︀", varsupsetneq: "⊋︀", varsupsetneqq: "⫌︀", vartheta: "ϑ", vartriangleleft: "⊲", vartriangleright: "⊳", vBar: "⫨", Vbar: "⫫", vBarv: "⫩", Vcy: "В", vcy: "в", vdash: "⊢", vDash: "⊨", Vdash: "⊩", VDash: "⊫", Vdashl: "⫦", veebar: "⊻", vee: "∨", Vee: "⋁", veeeq: "≚", vellip: "⋮", verbar: "|", Verbar: "‖", vert: "|", Vert: "‖", VerticalBar: "∣", VerticalLine: "|", VerticalSeparator: "❘", VerticalTilde: "≀", VeryThinSpace: " ", Vfr: "𝔙", vfr: "𝔳", vltri: "⊲", vnsub: "⊂⃒", vnsup: "⊃⃒", Vopf: "𝕍", vopf: "𝕧", vprop: "∝", vrtri: "⊳", Vscr: "𝒱", vscr: "𝓋", vsubnE: "⫋︀", vsubne: "⊊︀", vsupnE: "⫌︀", vsupne: "⊋︀", Vvdash: "⊪", vzigzag: "⦚", Wcirc: "Ŵ", wcirc: "ŵ", wedbar: "⩟", wedge: "∧", Wedge: "⋀", wedgeq: "≙", weierp: "℘", Wfr: "𝔚", wfr: "𝔴", Wopf: "𝕎", wopf: "𝕨", wp: "℘", wr: "≀", wreath: "≀", Wscr: "𝒲", wscr: "𝓌", xcap: "⋂", xcirc: "◯", xcup: "⋃", xdtri: "▽", Xfr: "𝔛", xfr: "𝔵", xharr: "⟷", xhArr: "⟺", Xi: "Ξ", xi: "ξ", xlarr: "⟵", xlArr: "⟸", xmap: "⟼", xnis: "⋻", xodot: "⨀", Xopf: "𝕏", xopf: "𝕩", xoplus: "⨁", xotime: "⨂", xrarr: "⟶", xrArr: "⟹", Xscr: "𝒳", xscr: "𝓍", xsqcup: "⨆", xuplus: "⨄", xutri: "△", xvee: "⋁", xwedge: "⋀", Yacute: "Ý", yacute: "ý", YAcy: "Я", yacy: "я", Ycirc: "Ŷ", ycirc: "ŷ", Ycy: "Ы", ycy: "ы", yen: "¥", Yfr: "𝔜", yfr: "𝔶", YIcy: "Ї", yicy: "ї", Yopf: "𝕐", yopf: "𝕪", Yscr: "𝒴", yscr: "𝓎", YUcy: "Ю", yucy: "ю", yuml: "ÿ", Yuml: "Ÿ", Zacute: "Ź", zacute: "ź", Zcaron: "Ž", zcaron: "ž", Zcy: "З", zcy: "з", Zdot: "Ż", zdot: "ż", zeetrf: "ℨ", ZeroWidthSpace: "​", Zeta: "Ζ", zeta: "ζ", zfr: "𝔷", Zfr: "ℨ", ZHcy: "Ж", zhcy: "ж", zigrarr: "⇝", zopf: "𝕫", Zopf: "ℤ", Zscr: "𝒵", zscr: "𝓏", zwj: "‍", zwnj: "‌" };
  }
});
var require_legacy = __commonJS({
  "../../node_modules/entities/lib/maps/legacy.json"(exports, module) {
    module.exports = { Aacute: "Á", aacute: "á", Acirc: "Â", acirc: "â", acute: "´", AElig: "Æ", aelig: "æ", Agrave: "À", agrave: "à", amp: "&", AMP: "&", Aring: "Å", aring: "å", Atilde: "Ã", atilde: "ã", Auml: "Ä", auml: "ä", brvbar: "¦", Ccedil: "Ç", ccedil: "ç", cedil: "¸", cent: "¢", copy: "©", COPY: "©", curren: "¤", deg: "°", divide: "÷", Eacute: "É", eacute: "é", Ecirc: "Ê", ecirc: "ê", Egrave: "È", egrave: "è", ETH: "Ð", eth: "ð", Euml: "Ë", euml: "ë", frac12: "½", frac14: "¼", frac34: "¾", gt: ">", GT: ">", Iacute: "Í", iacute: "í", Icirc: "Î", icirc: "î", iexcl: "¡", Igrave: "Ì", igrave: "ì", iquest: "¿", Iuml: "Ï", iuml: "ï", laquo: "«", lt: "<", LT: "<", macr: "¯", micro: "µ", middot: "·", nbsp: " ", not: "¬", Ntilde: "Ñ", ntilde: "ñ", Oacute: "Ó", oacute: "ó", Ocirc: "Ô", ocirc: "ô", Ograve: "Ò", ograve: "ò", ordf: "ª", ordm: "º", Oslash: "Ø", oslash: "ø", Otilde: "Õ", otilde: "õ", Ouml: "Ö", ouml: "ö", para: "¶", plusmn: "±", pound: "£", quot: '"', QUOT: '"', raquo: "»", reg: "®", REG: "®", sect: "§", shy: "­", sup1: "¹", sup2: "²", sup3: "³", szlig: "ß", THORN: "Þ", thorn: "þ", times: "×", Uacute: "Ú", uacute: "ú", Ucirc: "Û", ucirc: "û", Ugrave: "Ù", ugrave: "ù", uml: "¨", Uuml: "Ü", uuml: "ü", Yacute: "Ý", yacute: "ý", yen: "¥", yuml: "ÿ" };
  }
});
var require_xml = __commonJS({
  "../../node_modules/entities/lib/maps/xml.json"(exports, module) {
    module.exports = { amp: "&", apos: "'", gt: ">", lt: "<", quot: '"' };
  }
});
var require_decode = __commonJS({
  "../../node_modules/entities/lib/maps/decode.json"(exports, module) {
    module.exports = { "0": 65533, "128": 8364, "130": 8218, "131": 402, "132": 8222, "133": 8230, "134": 8224, "135": 8225, "136": 710, "137": 8240, "138": 352, "139": 8249, "140": 338, "142": 381, "145": 8216, "146": 8217, "147": 8220, "148": 8221, "149": 8226, "150": 8211, "151": 8212, "152": 732, "153": 8482, "154": 353, "155": 8250, "156": 339, "158": 382, "159": 376 };
  }
});
var require_decode_codepoint = __commonJS({
  "../../node_modules/entities/lib/decode_codepoint.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var decode_json_1 = __importDefault(require_decode()), fromCodePoint = (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      String.fromCodePoint || function(codePoint) {
        var output = "";
        return codePoint > 65535 && (codePoint -= 65536, output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296), codePoint = 56320 | codePoint & 1023), output += String.fromCharCode(codePoint), output;
      }
    );
    function decodeCodePoint(codePoint) {
      return codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111 ? "�" : (codePoint in decode_json_1.default && (codePoint = decode_json_1.default[codePoint]), fromCodePoint(codePoint));
    }
    exports.default = decodeCodePoint;
  }
});
var require_decode2 = __commonJS({
  "../../node_modules/entities/lib/decode.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
    var entities_json_1 = __importDefault(require_entities()), legacy_json_1 = __importDefault(require_legacy()), xml_json_1 = __importDefault(require_xml()), decode_codepoint_1 = __importDefault(require_decode_codepoint()), strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
    exports.decodeXML = getStrictDecoder(xml_json_1.default);
    exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
    function getStrictDecoder(map2) {
      var replace = getReplacer(map2);
      return function(str) {
        return String(str).replace(strictEntityRe, replace);
      };
    }
    var sorter = function(a, b) {
      return a < b ? 1 : -1;
    };
    exports.decodeHTML = function() {
      for (var legacy = Object.keys(legacy_json_1.default).sort(sorter), keys = Object.keys(entities_json_1.default).sort(sorter), i = 0, j = 0; i < keys.length; i++)
        legacy[j] === keys[i] ? (keys[i] += ";?", j++) : keys[i] += ";";
      var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"), replace = getReplacer(entities_json_1.default);
      function replacer(str) {
        return str.substr(-1) !== ";" && (str += ";"), replace(str);
      }
      return function(str) {
        return String(str).replace(re, replacer);
      };
    }();
    function getReplacer(map2) {
      return function(str) {
        if (str.charAt(1) === "#") {
          var secondChar = str.charAt(2);
          return secondChar === "X" || secondChar === "x" ? decode_codepoint_1.default(parseInt(str.substr(3), 16)) : decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        return map2[str.slice(1, -1)] || str;
      };
    }
  }
});
var require_encode = __commonJS({
  "../../node_modules/entities/lib/encode.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { default: mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
    var xml_json_1 = __importDefault(require_xml()), inverseXML = getInverseObj(xml_json_1.default), xmlReplacer = getInverseReplacer(inverseXML);
    exports.encodeXML = getASCIIEncoder(inverseXML);
    var entities_json_1 = __importDefault(require_entities()), inverseHTML = getInverseObj(entities_json_1.default), htmlReplacer = getInverseReplacer(inverseHTML);
    exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
    exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
    function getInverseObj(obj) {
      return Object.keys(obj).sort().reduce(function(inverse, name) {
        return inverse[obj[name]] = "&" + name + ";", inverse;
      }, {});
    }
    function getInverseReplacer(inverse) {
      for (var single = [], multiple = [], _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        k.length === 1 ? single.push("\\" + k) : multiple.push(k);
      }
      single.sort();
      for (var start = 0; start < single.length - 1; start++) {
        for (var end = start; end < single.length - 1 && single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1); )
          end += 1;
        var count2 = 1 + end - start;
        count2 < 3 || single.splice(start, count2, single[start] + "-" + single[end]);
      }
      return multiple.unshift("[" + single.join("") + "]"), new RegExp(multiple.join("|"), "g");
    }
    var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, getCodePoint = (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      String.prototype.codePointAt != null ? (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        function(str) {
          return str.codePointAt(0);
        }
      ) : (
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        function(c) {
          return (c.charCodeAt(0) - 55296) * 1024 + c.charCodeAt(1) - 56320 + 65536;
        }
      )
    );
    function singleCharReplacer(c) {
      return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0)).toString(16).toUpperCase() + ";";
    }
    function getInverse(inverse, re) {
      return function(data) {
        return data.replace(re, function(name) {
          return inverse[name];
        }).replace(reNonASCII, singleCharReplacer);
      };
    }
    var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
    function escape(data) {
      return data.replace(reEscapeChars, singleCharReplacer);
    }
    exports.escape = escape;
    function escapeUTF8(data) {
      return data.replace(xmlReplacer, singleCharReplacer);
    }
    exports.escapeUTF8 = escapeUTF8;
    function getASCIIEncoder(obj) {
      return function(data) {
        return data.replace(reEscapeChars, function(c) {
          return obj[c] || singleCharReplacer(c);
        });
      };
    }
  }
});
var require_lib = __commonJS({
  "../../node_modules/entities/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
    var decode_1 = require_decode2(), encode_1 = require_encode();
    function decode(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
    }
    exports.decode = decode;
    function decodeStrict(data, level) {
      return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
    }
    exports.decodeStrict = decodeStrict;
    function encode(data, level) {
      return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
    }
    exports.encode = encode;
    var encode_2 = require_encode();
    Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function() {
      return encode_2.encodeXML;
    } });
    Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function() {
      return encode_2.encodeNonAsciiHTML;
    } });
    Object.defineProperty(exports, "escape", { enumerable: true, get: function() {
      return encode_2.escape;
    } });
    Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function() {
      return encode_2.escapeUTF8;
    } });
    Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function() {
      return encode_2.encodeHTML;
    } });
    var decode_2 = require_decode2();
    Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
    Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function() {
      return decode_2.decodeHTML;
    } });
    Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function() {
      return decode_2.decodeHTMLStrict;
    } });
    Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function() {
      return decode_2.decodeXML;
    } });
  }
});
var require_ansi_to_html = __commonJS({
  "../../node_modules/ansi-to-html/lib/ansi_to_html.js"(exports, module) {
    "use strict";
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor))
        throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
    }
    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol < "u" && o[Symbol.iterator] || o["@@iterator"];
      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length == "number") {
          it && (o = it);
          var i = 0, F = function() {
          };
          return { s: F, n: function() {
            return i >= o.length ? { done: true } : { done: false, value: o[i++] };
          }, e: function(_e) {
            throw _e;
          }, f: F };
        }
        throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      var normalCompletion = true, didErr = false, err;
      return { s: function() {
        it = it.call(o);
      }, n: function() {
        var step2 = it.next();
        return normalCompletion = step2.done, step2;
      }, e: function(_e2) {
        didErr = true, err = _e2;
      }, f: function() {
        try {
          !normalCompletion && it.return != null && it.return();
        } finally {
          if (didErr) throw err;
        }
      } };
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (o) {
        if (typeof o == "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor && (n = o.constructor.name), n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }
    }
    function _arrayLikeToArray(arr, len) {
      (len == null || len > arr.length) && (len = arr.length);
      for (var i = 0, arr2 = new Array(len); i < len; i++)
        arr2[i] = arr[i];
      return arr2;
    }
    var entities = require_lib(), defaults = {
      fg: "#FFF",
      bg: "#000",
      newline: false,
      escapeXML: false,
      stream: false,
      colors: getDefaultColors()
    };
    function getDefaultColors() {
      var colors3 = {
        0: "#000",
        1: "#A00",
        2: "#0A0",
        3: "#A50",
        4: "#00A",
        5: "#A0A",
        6: "#0AA",
        7: "#AAA",
        8: "#555",
        9: "#F55",
        10: "#5F5",
        11: "#FF5",
        12: "#55F",
        13: "#F5F",
        14: "#5FF",
        15: "#FFF"
      };
      return range(0, 5).forEach(function(red) {
        range(0, 5).forEach(function(green) {
          range(0, 5).forEach(function(blue) {
            return setStyleColor(red, green, blue, colors3);
          });
        });
      }), range(0, 23).forEach(function(gray) {
        var c = gray + 232, l = toHexString(gray * 10 + 8);
        colors3[c] = "#" + l + l + l;
      }), colors3;
    }
    function setStyleColor(red, green, blue, colors3) {
      var c = 16 + red * 36 + green * 6 + blue, r = red > 0 ? red * 40 + 55 : 0, g = green > 0 ? green * 40 + 55 : 0, b = blue > 0 ? blue * 40 + 55 : 0;
      colors3[c] = toColorHexString([r, g, b]);
    }
    function toHexString(num) {
      for (var str = num.toString(16); str.length < 2; )
        str = "0" + str;
      return str;
    }
    function toColorHexString(ref) {
      var results = [], _iterator = _createForOfIteratorHelper(ref), _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done; ) {
          var r = _step.value;
          results.push(toHexString(r));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return "#" + results.join("");
    }
    function generateOutput(stack, token, data, options) {
      var result;
      return token === "text" ? result = pushText(data, options) : token === "display" ? result = handleDisplay(stack, data, options) : token === "xterm256Foreground" ? result = pushForegroundColor(stack, options.colors[data]) : token === "xterm256Background" ? result = pushBackgroundColor(stack, options.colors[data]) : token === "rgb" && (result = handleRgb(stack, data)), result;
    }
    function handleRgb(stack, data) {
      data = data.substring(2).slice(0, -1);
      var operation = +data.substr(0, 2), color = data.substring(5).split(";"), rgb = color.map(function(value) {
        return ("0" + Number(value).toString(16)).substr(-2);
      }).join("");
      return pushStyle(stack, (operation === 38 ? "color:#" : "background-color:#") + rgb);
    }
    function handleDisplay(stack, code, options) {
      code = parseInt(code, 10);
      var codeMap = {
        "-1": function() {
          return "<br/>";
        },
        0: function() {
          return stack.length && resetStyles(stack);
        },
        1: function() {
          return pushTag(stack, "b");
        },
        3: function() {
          return pushTag(stack, "i");
        },
        4: function() {
          return pushTag(stack, "u");
        },
        8: function() {
          return pushStyle(stack, "display:none");
        },
        9: function() {
          return pushTag(stack, "strike");
        },
        22: function() {
          return pushStyle(stack, "font-weight:normal;text-decoration:none;font-style:normal");
        },
        23: function() {
          return closeTag(stack, "i");
        },
        24: function() {
          return closeTag(stack, "u");
        },
        39: function() {
          return pushForegroundColor(stack, options.fg);
        },
        49: function() {
          return pushBackgroundColor(stack, options.bg);
        },
        53: function() {
          return pushStyle(stack, "text-decoration:overline");
        }
      }, result;
      return codeMap[code] ? result = codeMap[code]() : 4 < code && code < 7 ? result = pushTag(stack, "blink") : 29 < code && code < 38 ? result = pushForegroundColor(stack, options.colors[code - 30]) : 39 < code && code < 48 ? result = pushBackgroundColor(stack, options.colors[code - 40]) : 89 < code && code < 98 ? result = pushForegroundColor(stack, options.colors[8 + (code - 90)]) : 99 < code && code < 108 && (result = pushBackgroundColor(stack, options.colors[8 + (code - 100)])), result;
    }
    function resetStyles(stack) {
      var stackClone = stack.slice(0);
      return stack.length = 0, stackClone.reverse().map(function(tag) {
        return "</" + tag + ">";
      }).join("");
    }
    function range(low, high) {
      for (var results = [], j = low; j <= high; j++)
        results.push(j);
      return results;
    }
    function notCategory(category) {
      return function(e) {
        return (category === null || e.category !== category) && category !== "all";
      };
    }
    function categoryForCode(code) {
      code = parseInt(code, 10);
      var result = null;
      return code === 0 ? result = "all" : code === 1 ? result = "bold" : 2 < code && code < 5 ? result = "underline" : 4 < code && code < 7 ? result = "blink" : code === 8 ? result = "hide" : code === 9 ? result = "strike" : 29 < code && code < 38 || code === 39 || 89 < code && code < 98 ? result = "foreground-color" : (39 < code && code < 48 || code === 49 || 99 < code && code < 108) && (result = "background-color"), result;
    }
    function pushText(text, options) {
      return options.escapeXML ? entities.encodeXML(text) : text;
    }
    function pushTag(stack, tag, style) {
      return style || (style = ""), stack.push(tag), "<".concat(tag).concat(style ? ' style="'.concat(style, '"') : "", ">");
    }
    function pushStyle(stack, style) {
      return pushTag(stack, "span", style);
    }
    function pushForegroundColor(stack, color) {
      return pushTag(stack, "span", "color:" + color);
    }
    function pushBackgroundColor(stack, color) {
      return pushTag(stack, "span", "background-color:" + color);
    }
    function closeTag(stack, style) {
      var last;
      if (stack.slice(-1)[0] === style && (last = stack.pop()), last)
        return "</" + style + ">";
    }
    function tokenize(text, options, callback) {
      var ansiMatch = false, ansiHandler = 3;
      function remove() {
        return "";
      }
      function removeXterm256Foreground(m, g1) {
        return callback("xterm256Foreground", g1), "";
      }
      function removeXterm256Background(m, g1) {
        return callback("xterm256Background", g1), "";
      }
      function newline(m) {
        return options.newline ? callback("display", -1) : callback("text", m), "";
      }
      function ansiMess(m, g1) {
        ansiMatch = true, g1.trim().length === 0 && (g1 = "0"), g1 = g1.trimRight(";").split(";");
        var _iterator2 = _createForOfIteratorHelper(g1), _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            var g = _step2.value;
            callback("display", g);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        return "";
      }
      function realText(m) {
        return callback("text", m), "";
      }
      function rgb(m) {
        return callback("rgb", m), "";
      }
      var tokens = [{
        pattern: /^\x08+/,
        sub: remove
      }, {
        pattern: /^\x1b\[[012]?K/,
        sub: remove
      }, {
        pattern: /^\x1b\[\(B/,
        sub: remove
      }, {
        pattern: /^\x1b\[[34]8;2;\d+;\d+;\d+m/,
        sub: rgb
      }, {
        pattern: /^\x1b\[38;5;(\d+)m/,
        sub: removeXterm256Foreground
      }, {
        pattern: /^\x1b\[48;5;(\d+)m/,
        sub: removeXterm256Background
      }, {
        pattern: /^\n/,
        sub: newline
      }, {
        pattern: /^\r+\n/,
        sub: newline
      }, {
        pattern: /^\r/,
        sub: newline
      }, {
        pattern: /^\x1b\[((?:\d{1,3};?)+|)m/,
        sub: ansiMess
      }, {
        // CSI n J
        // ED - Erase in Display Clears part of the screen.
        // If n is 0 (or missing), clear from cursor to end of screen.
        // If n is 1, clear from cursor to beginning of the screen.
        // If n is 2, clear entire screen (and moves cursor to upper left on DOS ANSI.SYS).
        // If n is 3, clear entire screen and delete all lines saved in the scrollback buffer
        //   (this feature was added for xterm and is supported by other terminal applications).
        pattern: /^\x1b\[\d?J/,
        sub: remove
      }, {
        // CSI n ; m f
        // HVP - Horizontal Vertical Position Same as CUP
        pattern: /^\x1b\[\d{0,3};\d{0,3}f/,
        sub: remove
      }, {
        // catch-all for CSI sequences?
        pattern: /^\x1b\[?[\d;]{0,3}/,
        sub: remove
      }, {
        /**
         * extracts real text - not containing:
         * - `\x1b' - ESC - escape (Ascii 27)
         * - '\x08' - BS - backspace (Ascii 8)
         * - `\n` - Newline - linefeed (LF) (ascii 10)
         * - `\r` - Windows Carriage Return (CR)
         */
        pattern: /^(([^\x1b\x08\r\n])+)/,
        sub: realText
      }];
      function process(handler2, i2) {
        i2 > ansiHandler && ansiMatch || (ansiMatch = false, text = text.replace(handler2.pattern, handler2.sub));
      }
      var results1 = [], _text = text, length = _text.length;
      outer: for (; length > 0; ) {
        for (var i = 0, o = 0, len = tokens.length; o < len; i = ++o) {
          var handler = tokens[i];
          if (process(handler, i), text.length !== length) {
            length = text.length;
            continue outer;
          }
        }
        if (text.length === length)
          break;
        results1.push(0), length = text.length;
      }
      return results1;
    }
    function updateStickyStack(stickyStack, token, data) {
      return token !== "text" && (stickyStack = stickyStack.filter(notCategory(categoryForCode(data))), stickyStack.push({
        token,
        data,
        category: categoryForCode(data)
      })), stickyStack;
    }
    var Filter = function() {
      function Filter2(options) {
        _classCallCheck(this, Filter2), options = options || {}, options.colors && (options.colors = Object.assign({}, defaults.colors, options.colors)), this.options = Object.assign({}, defaults, options), this.stack = [], this.stickyStack = [];
      }
      return _createClass(Filter2, [{
        key: "toHtml",
        value: function(input) {
          var _this = this;
          input = typeof input == "string" ? [input] : input;
          var stack = this.stack, options = this.options, buf = [];
          return this.stickyStack.forEach(function(element) {
            var output = generateOutput(stack, element.token, element.data, options);
            output && buf.push(output);
          }), tokenize(input.join(""), options, function(token, data) {
            var output = generateOutput(stack, token, data, options);
            output && buf.push(output), options.stream && (_this.stickyStack = updateStickyStack(_this.stickyStack, token, data));
          }), stack.length && buf.push(resetStyles(stack)), buf.join("");
        }
      }]), Filter2;
    }();
    module.exports = Filter;
  }
});

// node_modules/storybook/dist/_browser-chunks/chunk-FNXWN6IK.js
var ADDON_ID = "storybook/background";
var PARAM_KEY = "backgrounds";
var EVENTS = {
  UPDATE: `${ADDON_ID}/update`
};
var ADDON_ID2 = "storybook/measure-addon";
var TOOL_ID = `${ADDON_ID2}/tool`;
var PARAM_KEY2 = "measureEnabled";
var EVENTS2 = {
  RESULT: `${ADDON_ID2}/result`,
  REQUEST: `${ADDON_ID2}/request`,
  CLEAR: `${ADDON_ID2}/clear`
};
var PARAM_KEY3 = "outline";
var DEFAULT_BACKGROUNDS = {
  light: { name: "light", value: "#F8F8F8" },
  dark: { name: "dark", value: "#333" }
};

// node_modules/storybook/dist/_browser-chunks/chunk-6XWLIJQL.js
var ADDON_ID3 = "storybook/actions";
var PANEL_ID = `${ADDON_ID3}/panel`;
var EVENT_ID = `${ADDON_ID3}/action-event`;
var CLEAR_ID = `${ADDON_ID3}/action-clear`;

// node_modules/storybook/dist/_browser-chunks/chunk-EUVGDK4H.js
var config = {
  depth: 10,
  clearOnStoryChange: true,
  limit: 50
};
var findProto = (obj, callback) => {
  let proto = Object.getPrototypeOf(obj);
  return !proto || callback(proto) ? proto : findProto(proto, callback);
};
var isReactSyntheticEvent = (e) => !!(typeof e == "object" && e && findProto(e, (proto) => /^Synthetic(?:Base)?Event$/.test(proto.constructor.name)) && typeof e.persist == "function");
var serializeArg = (a) => {
  if (isReactSyntheticEvent(a)) {
    let e = Object.create(
      a.constructor.prototype,
      Object.getOwnPropertyDescriptors(a)
    );
    e.persist();
    let viewDescriptor = Object.getOwnPropertyDescriptor(e, "view"), view = viewDescriptor?.value;
    return typeof view == "object" && view?.constructor.name === "Window" && Object.defineProperty(e, "view", {
      ...viewDescriptor,
      value: Object.create(view.constructor.prototype)
    }), e;
  }
  return a;
};
function action(name, options = {}) {
  let actionOptions = {
    ...config,
    ...options
  }, handler = function(...args) {
    if (options.implicit) {
      let storyRenderer = ("__STORYBOOK_PREVIEW__" in scope ? scope.__STORYBOOK_PREVIEW__ : void 0)?.storyRenders.find(
        (render) => render.phase === "playing" || render.phase === "rendering"
      );
      if (storyRenderer) {
        let deprecated = !globalThis?.FEATURES?.disallowImplicitActionsInRenderV8, error = new ImplicitActionsDuringRendering({
          phase: storyRenderer.phase,
          name,
          deprecated
        });
        if (deprecated)
          console.warn(error);
        else
          throw error;
      }
    }
    let channel = addons.getChannel(), id = Date.now().toString(36) + Math.random().toString(36).substring(2), minDepth = 5, serializedArgs = args.map(serializeArg), normalizedArgs = args.length > 1 ? serializedArgs : serializedArgs[0], actionDisplayToEmit = {
      id,
      count: 0,
      data: { name, args: normalizedArgs },
      options: {
        ...actionOptions,
        maxDepth: minDepth + (actionOptions.depth || 3)
      }
    };
    channel.emit(EVENT_ID, actionDisplayToEmit);
  };
  return handler.isAction = true, handler.implicit = options.implicit, handler;
}

// node_modules/storybook/dist/_browser-chunks/chunk-SL75JR6Y.js
var ADDON_ID4 = "storybook/viewport";
var PARAM_KEY4 = "viewport";
var PANEL_ID2 = `${ADDON_ID4}/panel`;
var TOOL_ID2 = `${ADDON_ID4}/tool`;

// node_modules/storybook/dist/csf/index.js
var require_tiny_isequal = __commonJS({
  "../../node_modules/@ngard/tiny-isequal/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true }), exports.isEqual = /* @__PURE__ */ function() {
      var e = Object.prototype.toString, r = Object.getPrototypeOf, t = Object.getOwnPropertySymbols ? function(e2) {
        return Object.keys(e2).concat(Object.getOwnPropertySymbols(e2));
      } : Object.keys;
      return function(n, a) {
        return function n2(a2, c, u) {
          var i, s, l, o = e.call(a2), f = e.call(c);
          if (a2 === c) return true;
          if (a2 == null || c == null) return false;
          if (u.indexOf(a2) > -1 && u.indexOf(c) > -1) return true;
          if (u.push(a2, c), o != f || (i = t(a2), s = t(c), i.length != s.length || i.some(function(e2) {
            return !n2(a2[e2], c[e2], u);
          }))) return false;
          switch (o.slice(8, -1)) {
            case "Symbol":
              return a2.valueOf() == c.valueOf();
            case "Date":
            case "Number":
              return +a2 == +c || +a2 != +a2 && +c != +c;
            case "RegExp":
            case "Function":
            case "String":
            case "Boolean":
              return "" + a2 == "" + c;
            case "Set":
            case "Map":
              i = a2.entries(), s = c.entries();
              do
                if (!n2((l = i.next()).value, s.next().value, u)) return false;
              while (!l.done);
              return true;
            case "ArrayBuffer":
              a2 = new Uint8Array(a2), c = new Uint8Array(c);
            case "DataView":
              a2 = new Uint8Array(a2.buffer), c = new Uint8Array(c.buffer);
            case "Float32Array":
            case "Float64Array":
            case "Int8Array":
            case "Int16Array":
            case "Int32Array":
            case "Uint8Array":
            case "Uint16Array":
            case "Uint32Array":
            case "Uint8ClampedArray":
            case "Arguments":
            case "Array":
              if (a2.length != c.length) return false;
              for (l = 0; l < a2.length; l++) if ((l in a2 || l in c) && (l in a2 != l in c || !n2(a2[l], c[l], u))) return false;
              return true;
            case "Object":
              return n2(r(a2), r(c), u);
            default:
              return false;
          }
        }(n, a, []);
      };
    }();
  }
});
function toStartCaseStr(str) {
  return str.replace(/_/g, " ").replace(/-/g, " ").replace(/\./g, " ").replace(/([^\n])([A-Z])([a-z])/g, (str2, $1, $2, $3) => `${$1} ${$2}${$3}`).replace(/([a-z])([A-Z])/g, (str2, $1, $2) => `${$1} ${$2}`).replace(/([a-z])([0-9])/gi, (str2, $1, $2) => `${$1} ${$2}`).replace(/([0-9])([a-z])/gi, (str2, $1, $2) => `${$1} ${$2}`).replace(/(\s|^)(\w)/g, (str2, $1, $2) => `${$1}${$2.toUpperCase()}`).replace(/ +/g, " ").trim();
}
var import_tiny_isequal = __toESM(require_tiny_isequal(), 1);
var count = (vals) => vals.map((v) => typeof v < "u").filter(Boolean).length;
var testValue = (cond, value) => {
  let { exists, eq, neq, truthy } = cond;
  if (count([exists, eq, neq, truthy]) > 1)
    throw new Error(`Invalid conditional test ${JSON.stringify({ exists, eq, neq })}`);
  if (typeof eq < "u")
    return (0, import_tiny_isequal.isEqual)(value, eq);
  if (typeof neq < "u")
    return !(0, import_tiny_isequal.isEqual)(value, neq);
  if (typeof exists < "u") {
    let valueExists = typeof value < "u";
    return exists ? valueExists : !valueExists;
  }
  return (typeof truthy > "u" ? true : truthy) ? !!value : !value;
};
var includeConditionalArg = (argType, args, globals) => {
  if (!argType.if)
    return true;
  let { arg, global: global5 } = argType.if;
  if (count([arg, global5]) !== 1)
    throw new Error(`Invalid conditional value ${JSON.stringify({ arg, global: global5 })}`);
  let value = arg ? args[arg] : globals[global5];
  return testValue(argType.if, value);
};
var addArgs_exports = {};
__export(addArgs_exports, {
  argsEnhancers: () => argsEnhancers
});
var isInInitialArgs = (name, initialArgs) => typeof initialArgs[name] > "u" && !(name in initialArgs);
var inferActionsFromArgTypesRegex = (context) => {
  let {
    initialArgs,
    argTypes,
    id,
    parameters: { actions }
  } = context;
  if (!actions || actions.disable || !actions.argTypesRegex || !argTypes)
    return {};
  let argTypesRegex = new RegExp(actions.argTypesRegex);
  return Object.entries(argTypes).filter(
    ([name]) => !!argTypesRegex.test(name)
  ).reduce((acc, [name, argType]) => (isInInitialArgs(name, initialArgs) && (acc[name] = action(name, { implicit: true, id })), acc), {});
};
var addActionsFromArgTypes = (context) => {
  let {
    initialArgs,
    argTypes,
    parameters: { actions }
  } = context;
  return actions?.disable || !argTypes ? {} : Object.entries(argTypes).filter(([name, argType]) => !!argType.action).reduce((acc, [name, argType]) => (isInInitialArgs(name, initialArgs) && (acc[name] = action(typeof argType.action == "string" ? argType.action : name)), acc), {});
};
var argsEnhancers = [
  addActionsFromArgTypes,
  inferActionsFromArgTypesRegex
];
var loaders_exports = {};
__export(loaders_exports, {
  loaders: () => loaders
});
var subscribed = false;
var logActionsWhenMockCalled = (context) => {
  let { parameters: parameters2 } = context;
  parameters2?.actions?.disable || subscribed || (onMockCall((mock, args) => {
    let name = mock.getMockName();
    name !== "spy" && name !== "vi.fn()" && (!/^next\/.*::/.test(name) || [
      "next/router::useRouter()",
      "next/navigation::useRouter()",
      "next/navigation::redirect",
      "next/cache::",
      "next/headers::cookies().set",
      "next/headers::cookies().delete",
      "next/headers::headers().set",
      "next/headers::headers().delete"
    ].some((prefix) => name.startsWith(prefix))) && action(name)(args);
  }), subscribed = true);
};
var loaders = [logActionsWhenMockCalled];
var preview_default = () => definePreviewAddon10({
  ...addArgs_exports,
  ...loaders_exports
});
var { document: document2 } = globalThis;
var isReduceMotionEnabled = () => globalThis?.matchMedia ? !!globalThis.matchMedia("(prefers-reduced-motion: reduce)")?.matches : false;
var clearStyles = (selector) => {
  (Array.isArray(selector) ? selector : [selector]).forEach(clearStyle);
};
var clearStyle = (selector) => {
  if (!document2)
    return;
  let element = document2.getElementById(selector);
  element && element.parentElement && element.parentElement.removeChild(element);
};
var addGridStyle = (selector, css) => {
  if (!document2)
    return;
  let existingStyle = document2.getElementById(selector);
  if (existingStyle)
    existingStyle.innerHTML !== css && (existingStyle.innerHTML = css);
  else {
    let style = document2.createElement("style");
    style.setAttribute("id", selector), style.innerHTML = css, document2.head.appendChild(style);
  }
};
var addBackgroundStyle = (selector, css, storyId) => {
  if (!document2)
    return;
  let existingStyle = document2.getElementById(selector);
  if (existingStyle)
    existingStyle.innerHTML !== css && (existingStyle.innerHTML = css);
  else {
    let style = document2.createElement("style");
    style.setAttribute("id", selector), style.innerHTML = css;
    let gridStyleSelector = `addon-backgrounds-grid${storyId ? `-docs-${storyId}` : ""}`, existingGridStyle = document2.getElementById(gridStyleSelector);
    existingGridStyle ? existingGridStyle.parentElement?.insertBefore(style, existingGridStyle) : document2.head.appendChild(style);
  }
};
var defaultGrid = {
  cellSize: 100,
  cellAmount: 10,
  opacity: 0.8
};
var BG_SELECTOR_BASE = "addon-backgrounds";
var GRID_SELECTOR_BASE = "addon-backgrounds-grid";
var transitionStyle = isReduceMotionEnabled() ? "" : "transition: background-color 0.3s;";
var withBackgroundAndGrid = (StoryFn, context) => {
  let { globals = {}, parameters: parameters2 = {}, viewMode, id } = context, {
    options = DEFAULT_BACKGROUNDS,
    disable,
    grid = defaultGrid
  } = parameters2[PARAM_KEY] || {}, data = globals[PARAM_KEY] || {}, backgroundName = typeof data == "string" ? data : data?.value, item = backgroundName ? options[backgroundName] : void 0, value = typeof item == "string" ? item : item?.value || "transparent", showGrid = typeof data == "string" ? false : data.grid || false, shownBackground = !!item && !disable, backgroundSelector = viewMode === "docs" ? `#anchor--${id} .docs-story, #anchor--primary--${id} .docs-story` : ".sb-show-main", gridSelector = viewMode === "docs" ? `#anchor--${id} .docs-story, #anchor--primary--${id} .docs-story` : ".sb-show-main", isLayoutPadded = parameters2.layout === void 0 || parameters2.layout === "padded", defaultOffset = viewMode === "docs" ? 20 : isLayoutPadded ? 16 : 0, { cellAmount, cellSize, opacity, offsetX = defaultOffset, offsetY = defaultOffset } = grid, backgroundSelectorId = viewMode === "docs" ? `${BG_SELECTOR_BASE}-docs-${id}` : `${BG_SELECTOR_BASE}-color`, backgroundTarget = viewMode === "docs" ? id : null;
  useEffect(() => {
    let backgroundStyles = `
    ${backgroundSelector} {
      background: ${value} !important;
      ${transitionStyle}
      }`;
    if (!shownBackground) {
      clearStyles(backgroundSelectorId);
      return;
    }
    addBackgroundStyle(backgroundSelectorId, backgroundStyles, backgroundTarget);
  }, [backgroundSelector, backgroundSelectorId, backgroundTarget, shownBackground, value]);
  let gridSelectorId = viewMode === "docs" ? `${GRID_SELECTOR_BASE}-docs-${id}` : `${GRID_SELECTOR_BASE}`;
  return useEffect(() => {
    if (!showGrid) {
      clearStyles(gridSelectorId);
      return;
    }
    let gridSize = [
      `${cellSize * cellAmount}px ${cellSize * cellAmount}px`,
      `${cellSize * cellAmount}px ${cellSize * cellAmount}px`,
      `${cellSize}px ${cellSize}px`,
      `${cellSize}px ${cellSize}px`
    ].join(", "), gridStyles = `
        ${gridSelector} {
          background-size: ${gridSize} !important;
          background-position: ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px, ${offsetX}px ${offsetY}px !important;
          background-blend-mode: difference !important;
          background-image: linear-gradient(rgba(130, 130, 130, ${opacity}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${opacity}) 1px, transparent 1px),
           linear-gradient(rgba(130, 130, 130, ${opacity / 2}) 1px, transparent 1px),
           linear-gradient(90deg, rgba(130, 130, 130, ${opacity / 2}) 1px, transparent 1px) !important;
        }
      `;
    addGridStyle(gridSelectorId, gridStyles);
  }, [cellAmount, cellSize, gridSelector, gridSelectorId, showGrid, offsetX, offsetY, opacity]), StoryFn();
};
var decorators = globalThis.FEATURES?.backgrounds ? [withBackgroundAndGrid] : [];
var parameters = {
  [PARAM_KEY]: {
    grid: {
      cellSize: 20,
      opacity: 0.5,
      cellAmount: 5
    },
    disable: false
  }
};
var initialGlobals = {
  [PARAM_KEY]: { value: void 0, grid: false }
};
var preview_default2 = () => definePreviewAddon10({
  decorators,
  parameters,
  initialGlobals
});
var { step } = instrument(
  {
    // It seems like the label is unused, but the instrumenter has access to it
    // The context will be bounded later in StoryRender, so that the user can write just:
    // await step("label", (context) => {
    //   // labeled step
    // });
    step: async (label, play, context) => play(context)
  },
  { intercept: true }
);
var preview_default3 = () => definePreviewAddon10({
  parameters: {
    throwPlayFunctionExceptions: false
  },
  runStep: step
});
var isEmptyRender = (element) => {
  let style = getComputedStyle(element), rect = element.getBoundingClientRect();
  return !(rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && Number(style.opacity) > 0 && style.display !== "none");
};
var afterEach = async ({ reporting, canvasElement, globals }) => {
  try {
    if (!globals.renderAnalysis?.enabled)
      return;
    let emptyRender = isEmptyRender(canvasElement.firstElementChild ?? canvasElement);
    emptyRender && reporting.addReport({
      type: "render-analysis",
      version: 1,
      result: {
        emptyRender
      },
      status: "warning"
    });
  } catch {
  }
};
var test_annotations_default = () => definePreviewAddon10({ afterEach });
var iconPaths = {
  chevronLeft: [
    "M9.10355 10.1464C9.29882 10.3417 9.29882 10.6583 9.10355 10.8536C8.90829 11.0488 8.59171 11.0488 8.39645 10.8536L4.89645 7.35355C4.70118 7.15829 4.70118 6.84171 4.89645 6.64645L8.39645 3.14645C8.59171 2.95118 8.90829 2.95118 9.10355 3.14645C9.29882 3.34171 9.29882 3.65829 9.10355 3.85355L5.95711 7L9.10355 10.1464Z"
  ],
  chevronRight: [
    "M4.89645 10.1464C4.70118 10.3417 4.70118 10.6583 4.89645 10.8536C5.09171 11.0488 5.40829 11.0488 5.60355 10.8536L9.10355 7.35355C9.29882 7.15829 9.29882 6.84171 9.10355 6.64645L5.60355 3.14645C5.40829 2.95118 5.09171 2.95118 4.89645 3.14645C4.70118 3.34171 4.70118 3.65829 4.89645 3.85355L8.04289 7L4.89645 10.1464Z"
  ],
  info: [
    "M7 5.5a.5.5 0 01.5.5v4a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zM7 4.5A.75.75 0 107 3a.75.75 0 000 1.5z",
    "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z"
  ],
  shareAlt: [
    "M2 1.004a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-4.5a.5.5 0 00-1 0v4.5H2v-10h4.5a.5.5 0 000-1H2z",
    "M7.354 7.357L12 2.711v1.793a.5.5 0 001 0v-3a.5.5 0 00-.5-.5h-3a.5.5 0 100 1h1.793L6.646 6.65a.5.5 0 10.708.707z"
  ]
};
var svgElements = "svg,path,rect,circle,line,polyline,polygon,ellipse,text".split(",");
var createElement = (type, props = {}, children) => {
  let element = svgElements.includes(type) ? document.createElementNS("http://www.w3.org/2000/svg", type) : document.createElement(type);
  return Object.entries(props).forEach(([key, val]) => {
    /[A-Z]/.test(key) ? (key === "onClick" && (element.addEventListener("click", val), element.addEventListener("keydown", (e) => {
      (e.key === "Enter" || e.key === " ") && (e.preventDefault(), val());
    })), key === "onMouseEnter" && element.addEventListener("mouseenter", val), key === "onMouseLeave" && element.addEventListener("mouseleave", val)) : element.setAttribute(key, val);
  }), children?.forEach((child) => {
    if (!(child == null || child === false))
      try {
        element.appendChild(child);
      } catch {
        element.appendChild(document.createTextNode(String(child)));
      }
  }), element;
};
var createIcon = (name) => iconPaths[name] && createElement(
  "svg",
  { width: "14", height: "14", viewBox: "0 0 14 14", xmlns: "http://www.w3.org/2000/svg" },
  iconPaths[name].map(
    (d) => createElement("path", {
      fill: "currentColor",
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d
    })
  )
);
var normalizeOptions = (options) => {
  if ("elements" in options) {
    let { elements, color, style } = options;
    return {
      id: void 0,
      priority: 0,
      selectors: elements,
      styles: {
        outline: `2px ${style} ${color}`,
        outlineOffset: "2px",
        boxShadow: "0 0 0 6px rgba(255,255,255,0.6)"
      },
      menu: void 0
    };
  }
  let { menu, ...rest } = options;
  return {
    id: void 0,
    priority: 0,
    styles: {
      outline: "2px dashed #029cfd"
    },
    ...rest,
    menu: Array.isArray(menu) ? menu.every(Array.isArray) ? menu : [menu] : void 0
  };
};
var isFunction = (obj) => obj instanceof Function;
var state = /* @__PURE__ */ new Map();
var listeners = /* @__PURE__ */ new Map();
var teardowns = /* @__PURE__ */ new Map();
var useStore = (initialValue) => {
  let key = Symbol();
  return listeners.set(key, []), state.set(key, initialValue), { get: () => state.get(key), set: (update) => {
    let current = state.get(key), next = isFunction(update) ? update(current) : update;
    next !== current && (state.set(key, next), listeners.get(key)?.forEach((listener) => {
      teardowns.get(listener)?.(), teardowns.set(listener, listener(next));
    }));
  }, subscribe: (listener) => (listeners.get(key)?.push(listener), () => {
    let list = listeners.get(key);
    list && listeners.set(
      key,
      list.filter((l) => l !== listener)
    );
  }), teardown: () => {
    listeners.get(key)?.forEach((listener) => {
      teardowns.get(listener)?.(), teardowns.delete(listener);
    }), listeners.delete(key), state.delete(key);
  } };
};
var mapElements = (highlights) => {
  let root = document.getElementById("storybook-root"), map2 = /* @__PURE__ */ new Map();
  for (let highlight of highlights) {
    let { priority = 0 } = highlight;
    for (let selector of highlight.selectors) {
      let elements = [
        ...document.querySelectorAll(
          // Elements matching the selector, excluding storybook elements and their descendants.
          // Necessary to find portaled elements (e.g. children of `body`).
          `:is(${selector}):not([id^="storybook-"], [id^="storybook-"] *, [class^="sb-"], [class^="sb-"] *)`
        ),
        // Elements matching the selector inside the storybook root, as these were excluded above.
        ...root?.querySelectorAll(selector) || []
      ];
      for (let element of elements) {
        let existing = map2.get(element);
        (!existing || existing.priority <= priority) && map2.set(element, {
          ...highlight,
          priority,
          selectors: Array.from(new Set((existing?.selectors || []).concat(selector)))
        });
      }
    }
  }
  return map2;
};
var mapBoxes = (elements) => Array.from(elements.entries()).map(([element, { selectors, styles, hoverStyles, focusStyles, menu }]) => {
  let { top, left, width, height } = element.getBoundingClientRect(), { position } = getComputedStyle(element);
  return {
    element,
    selectors,
    styles,
    hoverStyles,
    focusStyles,
    menu,
    top: position === "fixed" ? top : top + window.scrollY,
    left: position === "fixed" ? left : left + window.scrollX,
    width,
    height
  };
}).sort((a, b) => b.width * b.height - a.width * a.height);
var isOverMenu = (menuElement, coordinates) => {
  let menu = menuElement.getBoundingClientRect(), { x, y } = coordinates;
  return menu?.top && menu?.left && x >= menu.left && x <= menu.left + menu.width && y >= menu.top && y <= menu.top + menu.height;
};
var isTargeted = (box, boxElement, coordinates) => {
  if (!boxElement || !coordinates)
    return false;
  let { left, top, width, height } = box;
  height < MIN_TOUCH_AREA_SIZE && (top = top - Math.round((MIN_TOUCH_AREA_SIZE - height) / 2), height = MIN_TOUCH_AREA_SIZE), width < MIN_TOUCH_AREA_SIZE && (left = left - Math.round((MIN_TOUCH_AREA_SIZE - width) / 2), width = MIN_TOUCH_AREA_SIZE), boxElement.style.position === "fixed" && (left += window.scrollX, top += window.scrollY);
  let { x, y } = coordinates;
  return x >= left && x <= left + width && y >= top && y <= top + height;
};
var keepInViewport = (element, targetCoordinates, options = {}) => {
  let { x, y } = targetCoordinates, { margin = 5, topOffset = 0, centered = false } = options, { scrollX, scrollY, innerHeight: windowHeight, innerWidth: windowWidth } = window, top = Math.min(
    element.style.position === "fixed" ? y - scrollY : y,
    windowHeight - element.clientHeight - margin - topOffset + scrollY
  ), leftOffset = centered ? element.clientWidth / 2 : 0, left = element.style.position === "fixed" ? Math.max(Math.min(x - scrollX, windowWidth - leftOffset - margin), leftOffset + margin) : Math.max(
    Math.min(x, windowWidth - leftOffset - margin + scrollX),
    leftOffset + margin + scrollX
  );
  Object.assign(element.style, {
    ...left !== x && { left: `${left}px` },
    ...top !== y && { top: `${top}px` }
  });
};
var showPopover = (element) => {
  window.HTMLElement.prototype.hasOwnProperty("showPopover") && element.showPopover();
};
var hidePopover = (element) => {
  window.HTMLElement.prototype.hasOwnProperty("showPopover") && element.hidePopover();
};
var getEventDetails = (target) => ({
  top: target.top,
  left: target.left,
  width: target.width,
  height: target.height,
  selectors: target.selectors,
  element: {
    attributes: Object.fromEntries(
      Array.from(target.element.attributes).map((attr) => [attr.name, attr.value])
    ),
    localName: target.element.localName,
    tagName: target.element.tagName,
    outerHTML: target.element.outerHTML
  }
});
var menuId = "storybook-highlights-menu";
var rootId = "storybook-highlights-root";
var storybookRootId = "storybook-root";
var useHighlights = (channel) => {
  if (globalThis.__STORYBOOK_HIGHLIGHT_INITIALIZED)
    return;
  globalThis.__STORYBOOK_HIGHLIGHT_INITIALIZED = true;
  let { document: document32 } = globalThis, highlights = useStore([]), elements = useStore(/* @__PURE__ */ new Map()), boxes = useStore([]), clickCoords = useStore(), hoverCoords = useStore(), targets = useStore([]), hovered = useStore([]), focused = useStore(), selected = useStore(), root = document32.getElementById(rootId);
  highlights.subscribe(() => {
    root || (root = createElement("div", { id: rootId }), document32.body.appendChild(root));
  }), highlights.subscribe((value) => {
    let storybookRoot = document32.getElementById(storybookRootId);
    if (!storybookRoot)
      return;
    elements.set(mapElements(value));
    let observer = new MutationObserver(() => elements.set(mapElements(value)));
    return observer.observe(storybookRoot, { subtree: true, childList: true }), () => {
      observer.disconnect();
    };
  }), elements.subscribe((value) => {
    let updateBoxes = () => requestAnimationFrame(() => boxes.set(mapBoxes(value))), observer = new ResizeObserver(updateBoxes);
    observer.observe(document32.body), Array.from(value.keys()).forEach((element) => observer.observe(element));
    let scrollers = Array.from(document32.body.querySelectorAll("*")).filter((el) => {
      let { overflow, overflowX, overflowY } = window.getComputedStyle(el);
      return ["auto", "scroll"].some((o) => [overflow, overflowX, overflowY].includes(o));
    });
    return scrollers.forEach((element) => element.addEventListener("scroll", updateBoxes)), () => {
      observer.disconnect(), scrollers.forEach((element) => element.removeEventListener("scroll", updateBoxes));
    };
  }), elements.subscribe((value) => {
    let sticky = Array.from(value.keys()).filter(({ style }) => style.position === "sticky"), updateBoxes = () => requestAnimationFrame(() => {
      boxes.set(
        (current) => current.map((box) => {
          if (sticky.includes(box.element)) {
            let { top, left } = box.element.getBoundingClientRect();
            return { ...box, top: top + window.scrollY, left: left + window.scrollX };
          }
          return box;
        })
      );
    });
    return document32.addEventListener("scroll", updateBoxes), () => document32.removeEventListener("scroll", updateBoxes);
  }), elements.subscribe((value) => {
    targets.set((t) => t.filter(({ element }) => value.has(element)));
  }), targets.subscribe((value) => {
    value.length ? (selected.set((s) => value.some((t) => t.element === s?.element) ? s : void 0), focused.set((s) => value.some((t) => t.element === s?.element) ? s : void 0)) : (selected.set(void 0), focused.set(void 0), clickCoords.set(void 0));
  });
  let styleElementByHighlight = new Map(/* @__PURE__ */ new Map());
  highlights.subscribe((value) => {
    value.forEach(({ keyframes }) => {
      if (keyframes) {
        let style = styleElementByHighlight.get(keyframes);
        style || (style = document32.createElement("style"), style.setAttribute("data-highlight", "keyframes"), styleElementByHighlight.set(keyframes, style), document32.head.appendChild(style)), style.innerHTML = keyframes;
      }
    }), styleElementByHighlight.forEach((style, keyframes) => {
      value.some((v) => v.keyframes === keyframes) || (style.remove(), styleElementByHighlight.delete(keyframes));
    });
  });
  let boxElementByTargetElement = new Map(/* @__PURE__ */ new Map());
  boxes.subscribe((value) => {
    value.forEach((box) => {
      let boxElement = boxElementByTargetElement.get(box.element);
      if (root && !boxElement) {
        let props = {
          popover: "manual",
          "data-highlight-dimensions": `w${box.width.toFixed(0)}h${box.height.toFixed(0)}`,
          "data-highlight-coordinates": `x${box.left.toFixed(0)}y${box.top.toFixed(0)}`
        };
        boxElement = root.appendChild(
          createElement("div", props, [createElement("div")])
        ), boxElementByTargetElement.set(box.element, boxElement);
      }
    }), boxElementByTargetElement.forEach((box, element) => {
      value.some(({ element: e }) => e === element) || (box.remove(), boxElementByTargetElement.delete(element));
    });
  }), boxes.subscribe((value) => {
    let targetable = value.filter((box) => box.menu);
    if (!targetable.length)
      return;
    let onClick = (event) => {
      requestAnimationFrame(() => {
        let menu = document32.getElementById(menuId), coords = { x: event.pageX, y: event.pageY };
        if (menu && !isOverMenu(menu, coords)) {
          let results = targetable.filter((box) => {
            let boxElement = boxElementByTargetElement.get(box.element);
            return isTargeted(box, boxElement, coords);
          });
          clickCoords.set(results.length ? coords : void 0), targets.set(results);
        }
      });
    };
    return document32.addEventListener("click", onClick), () => document32.removeEventListener("click", onClick);
  });
  let updateHovered = () => {
    let menu = document32.getElementById(menuId), coords = hoverCoords.get();
    !coords || menu && isOverMenu(menu, coords) || hovered.set((current) => {
      let update = boxes.get().filter((box) => {
        let boxElement = boxElementByTargetElement.get(box.element);
        return isTargeted(box, boxElement, coords);
      }), existing = current.filter((box) => update.includes(box)), additions = update.filter((box) => !current.includes(box)), hasRemovals = current.length - existing.length;
      return additions.length || hasRemovals ? [...existing, ...additions] : current;
    });
  };
  hoverCoords.subscribe(updateHovered), boxes.subscribe(updateHovered);
  let updateBoxStyles = () => {
    let selectedElement = selected.get(), targetElements = selectedElement ? [selectedElement] : targets.get(), focusedElement = targetElements.length === 1 ? targetElements[0] : focused.get(), isMenuOpen = clickCoords.get() !== void 0;
    boxes.get().forEach((box) => {
      let boxElement = boxElementByTargetElement.get(box.element);
      if (boxElement) {
        let isFocused = focusedElement === box, isHovered = isMenuOpen ? focusedElement ? isFocused : targetElements.includes(box) : hovered.get()?.includes(box);
        Object.assign(boxElement.style, {
          animation: "none",
          background: "transparent",
          border: "none",
          boxSizing: "border-box",
          outline: "none",
          outlineOffset: "0px",
          ...box.styles,
          ...isHovered ? box.hoverStyles : {},
          ...isFocused ? box.focusStyles : {},
          position: getComputedStyle(box.element).position === "fixed" ? "fixed" : "absolute",
          zIndex: MAX_Z_INDEX - 10,
          top: `${box.top}px`,
          left: `${box.left}px`,
          width: `${box.width}px`,
          height: `${box.height}px`,
          margin: 0,
          padding: 0,
          cursor: box.menu && isHovered ? "pointer" : "default",
          pointerEvents: box.menu ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible"
        }), Object.assign(boxElement.children[0].style, {
          width: "100%",
          height: "100%",
          minHeight: `${MIN_TOUCH_AREA_SIZE}px`,
          minWidth: `${MIN_TOUCH_AREA_SIZE}px`,
          boxSizing: "content-box",
          padding: boxElement.style.outlineWidth || "0px"
        }), showPopover(boxElement);
      }
    });
  };
  boxes.subscribe(updateBoxStyles), targets.subscribe(updateBoxStyles), hovered.subscribe(updateBoxStyles), focused.subscribe(updateBoxStyles), selected.subscribe(updateBoxStyles);
  let renderMenu = () => {
    if (!root)
      return;
    let menu = document32.getElementById(menuId);
    if (menu)
      menu.innerHTML = "";
    else {
      let props = { id: menuId, popover: "manual" };
      menu = root.appendChild(createElement("div", props)), root.appendChild(
        createElement("style", {}, [
          `
            #${menuId} {
              position: absolute;
              z-index: ${MAX_Z_INDEX};
              width: 300px;
              padding: 0px;
              margin: 15px 0 0 0;
              transform: translateX(-50%);
              font-family: "Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-size: 12px;
              background: white;
              border: none;
              border-radius: 6px;
              box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.05), 0 5px 15px 0 rgba(0, 0, 0, 0.1);
              color: #2E3438;
            }
            #${menuId} ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            #${menuId} > ul {
              max-height: 300px;
              overflow-y: auto;
              padding: 4px 0;
            }
            #${menuId} li {
              padding: 0 4px;
              margin: 0;
            }
            #${menuId} li > :not(ul) {
              display: flex;
              padding: 8px;
              margin: 0;
              align-items: center;
              gap: 8px;
              border-radius: 4px;
            }
            #${menuId} button {
              width: 100%;
              border: 0;
              background: transparent;
              color: inherit;
              text-align: left;
              font-family: inherit;
              font-size: inherit;
            }
            #${menuId} button:focus-visible {
              outline-color: #029CFD;
            }
            #${menuId} button:hover {
              background: rgba(2, 156, 253, 0.07);
              color: #029CFD;
              cursor: pointer;
            }
            #${menuId} li code {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 16px;
              font-size: 11px;
            }
            #${menuId} li svg {
              flex-shrink: 0;
              margin: 1px;
              color: #73828C;
            }
            #${menuId} li > button:hover svg, #${menuId} li > button:focus-visible svg {
              color: #029CFD;
            }
            #${menuId} .element-list li svg {
              display: none;
            }
            #${menuId} li.selectable svg, #${menuId} li.selected svg {
              display: block;
            }
            #${menuId} .menu-list {
              border-top: 1px solid rgba(38, 85, 115, 0.15);
            }
            #${menuId} .menu-list > li:not(:last-child) {
              padding-bottom: 4px;
              margin-bottom: 4px;
              border-bottom: 1px solid rgba(38, 85, 115, 0.15);
            }
            #${menuId} .menu-items, #${menuId} .menu-items li {
              padding: 0;
            }
            #${menuId} .menu-item {
              display: flex;
            }
            #${menuId} .menu-item-content {
              display: flex;
              flex-direction: column;
              flex-grow: 1;
            }
          `
        ])
      );
    }
    let selectedElement = selected.get(), elementList = selectedElement ? [selectedElement] : targets.get();
    if (elementList.length && (menu.style.position = getComputedStyle(elementList[0].element).position === "fixed" ? "fixed" : "absolute", menu.appendChild(
      createElement(
        "ul",
        { class: "element-list" },
        elementList.map((target) => {
          let selectable = elementList.length > 1 && !!target.menu?.some(
            (group) => group.some(
              (item) => !item.selectors || item.selectors.some((s) => target.selectors.includes(s))
            )
          ), props = selectable ? {
            class: "selectable",
            onClick: () => selected.set(target),
            onMouseEnter: () => focused.set(target),
            onMouseLeave: () => focused.set(void 0)
          } : selectedElement ? { class: "selected", onClick: () => selected.set(void 0) } : {}, asButton = selectable || selectedElement;
          return createElement("li", props, [
            createElement(asButton ? "button" : "div", asButton ? { type: "button" } : {}, [
              selectedElement ? createIcon("chevronLeft") : null,
              createElement("code", {}, [target.element.outerHTML]),
              selectable ? createIcon("chevronRight") : null
            ])
          ]);
        })
      )
    )), selected.get() || targets.get().length === 1) {
      let target = selected.get() || targets.get()[0], menuGroups = target.menu?.filter(
        (group) => group.some(
          (item) => !item.selectors || item.selectors.some((s) => target.selectors.includes(s))
        )
      );
      menuGroups?.length && menu.appendChild(
        createElement(
          "ul",
          { class: "menu-list" },
          menuGroups.map(
            (menuItems) => createElement("li", {}, [
              createElement(
                "ul",
                { class: "menu-items" },
                menuItems.map(
                  ({ id, title, description, iconLeft, iconRight, clickEvent: event }) => {
                    let onClick = event && (() => channel.emit(event, id, getEventDetails(target)));
                    return createElement("li", {}, [
                      createElement(
                        onClick ? "button" : "div",
                        onClick ? { class: "menu-item", type: "button", onClick } : { class: "menu-item" },
                        [
                          iconLeft ? createIcon(iconLeft) : null,
                          createElement("div", { class: "menu-item-content" }, [
                            createElement(description ? "strong" : "span", {}, [title]),
                            description && createElement("span", {}, [description])
                          ]),
                          iconRight ? createIcon(iconRight) : null
                        ]
                      )
                    ]);
                  }
                )
              )
            ])
          )
        )
      );
    }
    let coords = clickCoords.get();
    coords ? (Object.assign(menu.style, {
      display: "block",
      left: `${menu.style.position === "fixed" ? coords.x - window.scrollX : coords.x}px`,
      top: `${menu.style.position === "fixed" ? coords.y - window.scrollY : coords.y}px`
    }), showPopover(menu), requestAnimationFrame(() => keepInViewport(menu, coords, { topOffset: 15, centered: true }))) : (hidePopover(menu), Object.assign(menu.style, { display: "none" }));
  };
  targets.subscribe(renderMenu), selected.subscribe(renderMenu);
  let addHighlight = (highlight) => {
    let info = normalizeOptions(highlight);
    highlights.set((value) => {
      let others = info.id ? value.filter((h) => h.id !== info.id) : value;
      return info.selectors?.length ? [...others, info] : others;
    });
  }, removeHighlight = (id) => {
    id && highlights.set((value) => value.filter((h) => h.id !== id));
  }, resetState = () => {
    highlights.set([]), elements.set(/* @__PURE__ */ new Map()), boxes.set([]), clickCoords.set(void 0), hoverCoords.set(void 0), targets.set([]), hovered.set([]), focused.set(void 0), selected.set(void 0);
  }, removeTimeout, scrollIntoView = (target, options) => {
    let id = "scrollIntoView-highlight";
    clearTimeout(removeTimeout), removeHighlight(id);
    let element = document32.querySelector(target);
    if (!element) {
      console.warn(`Cannot scroll into view: ${target} not found`);
      return;
    }
    element.scrollIntoView({ behavior: "smooth", block: "center", ...options });
    let keyframeName = `kf-${Math.random().toString(36).substring(2, 15)}`;
    highlights.set((value) => [
      ...value,
      {
        id,
        priority: 1e3,
        selectors: [target],
        styles: {
          outline: "2px solid #1EA7FD",
          outlineOffset: "-1px",
          animation: `${keyframeName} 3s linear forwards`
        },
        keyframes: `@keyframes ${keyframeName} {
          0% { outline: 2px solid #1EA7FD; }
          20% { outline: 2px solid #1EA7FD00; }
          40% { outline: 2px solid #1EA7FD; }
          60% { outline: 2px solid #1EA7FD00; }
          80% { outline: 2px solid #1EA7FD; }
          100% { outline: 2px solid #1EA7FD00; }
        }`
      }
    ]), removeTimeout = setTimeout(() => removeHighlight(id), 3500);
  }, onMouseMove = (event) => {
    requestAnimationFrame(() => hoverCoords.set({ x: event.pageX, y: event.pageY }));
  };
  document32.body.addEventListener("mousemove", onMouseMove), channel.on(HIGHLIGHT, addHighlight), channel.on(REMOVE_HIGHLIGHT, removeHighlight), channel.on(RESET_HIGHLIGHT, resetState), channel.on(SCROLL_INTO_VIEW, scrollIntoView), channel.on(STORY_RENDER_PHASE_CHANGED, ({ newPhase }) => {
    newPhase === "loading" && resetState();
  });
};
globalThis?.FEATURES?.highlight && addons?.ready && addons.ready().then(useHighlights);
var preview_default4 = () => definePreviewAddon10({});
function getDocumentWidthAndHeight() {
  let container = scope.document.documentElement, height = Math.max(container.scrollHeight, container.offsetHeight);
  return { width: Math.max(container.scrollWidth, container.offsetWidth), height };
}
function createCanvas() {
  let canvas = scope.document.createElement("canvas");
  canvas.id = "storybook-addon-measure";
  let context = canvas.getContext("2d");
  invariant(context != null);
  let { width, height } = getDocumentWidthAndHeight();
  return setCanvasWidthAndHeight(canvas, context, { width, height }), canvas.style.position = "absolute", canvas.style.left = "0", canvas.style.top = "0", canvas.style.zIndex = "2147483647", canvas.style.pointerEvents = "none", scope.document.body.appendChild(canvas), { canvas, context, width, height };
}
function setCanvasWidthAndHeight(canvas, context, { width, height }) {
  canvas.style.width = `${width}px`, canvas.style.height = `${height}px`;
  let scale = scope.window.devicePixelRatio;
  canvas.width = Math.floor(width * scale), canvas.height = Math.floor(height * scale), context.scale(scale, scale);
}
var state2 = {};
function init() {
  state2.canvas || (state2 = createCanvas());
}
function clear() {
  state2.context && state2.context.clearRect(0, 0, state2.width ?? 0, state2.height ?? 0);
}
function draw(callback) {
  clear(), callback(state2.context);
}
function rescale() {
  invariant(state2.canvas, "Canvas should exist in the state."), invariant(state2.context, "Context should exist in the state."), setCanvasWidthAndHeight(state2.canvas, state2.context, { width: 0, height: 0 });
  let { width, height } = getDocumentWidthAndHeight();
  setCanvasWidthAndHeight(state2.canvas, state2.context, { width, height }), state2.width = width, state2.height = height;
}
function destroy() {
  state2.canvas && (clear(), state2.canvas.parentNode?.removeChild(state2.canvas), state2 = {});
}
var colors = {
  margin: "#f6b26b",
  border: "#ffe599",
  padding: "#93c47d",
  content: "#6fa8dc",
  text: "#232020"
};
var labelPadding = 6;
function roundedRect(context, { x, y, w, h, r }) {
  x = x - w / 2, y = y - h / 2, w < 2 * r && (r = w / 2), h < 2 * r && (r = h / 2), context.beginPath(), context.moveTo(x + r, y), context.arcTo(x + w, y, x + w, y + h, r), context.arcTo(x + w, y + h, x, y + h, r), context.arcTo(x, y + h, x, y, r), context.arcTo(x, y, x + w, y, r), context.closePath();
}
function positionCoordinate(position, { padding, border, width, height, top, left }) {
  let contentWidth = width - border.left - border.right - padding.left - padding.right, contentHeight = height - padding.top - padding.bottom - border.top - border.bottom, x = left + border.left + padding.left, y = top + border.top + padding.top;
  return position === "top" ? x += contentWidth / 2 : position === "right" ? (x += contentWidth, y += contentHeight / 2) : position === "bottom" ? (x += contentWidth / 2, y += contentHeight) : position === "left" ? y += contentHeight / 2 : position === "center" && (x += contentWidth / 2, y += contentHeight / 2), { x, y };
}
function offset(type, position, { margin, border, padding }, labelPaddingSize, external) {
  let shift = (dir) => 0, offsetX = 0, offsetY = 0, locationMultiplier = external ? 1 : 0.5, labelPaddingShift = external ? labelPaddingSize * 2 : 0;
  return type === "padding" ? shift = (dir) => padding[dir] * locationMultiplier + labelPaddingShift : type === "border" ? shift = (dir) => padding[dir] + border[dir] * locationMultiplier + labelPaddingShift : type === "margin" && (shift = (dir) => padding[dir] + border[dir] + margin[dir] * locationMultiplier + labelPaddingShift), position === "top" ? offsetY = -shift("top") : position === "right" ? offsetX = shift("right") : position === "bottom" ? offsetY = shift("bottom") : position === "left" && (offsetX = -shift("left")), { offsetX, offsetY };
}
function collide(a, b) {
  return Math.abs(a.x - b.x) < Math.abs(a.w + b.w) / 2 && Math.abs(a.y - b.y) < Math.abs(a.h + b.h) / 2;
}
function overlapAdjustment(position, currentRect, prevRect) {
  return position === "top" ? currentRect.y = prevRect.y - prevRect.h - labelPadding : position === "right" ? currentRect.x = prevRect.x + prevRect.w / 2 + labelPadding + currentRect.w / 2 : position === "bottom" ? currentRect.y = prevRect.y + prevRect.h + labelPadding : position === "left" && (currentRect.x = prevRect.x - prevRect.w / 2 - labelPadding - currentRect.w / 2), { x: currentRect.x, y: currentRect.y };
}
function textWithRect(context, type, { x, y, w, h }, text) {
  return roundedRect(context, { x, y, w, h, r: 3 }), context.fillStyle = `${colors[type]}dd`, context.fill(), context.strokeStyle = colors[type], context.stroke(), context.fillStyle = colors.text, context.fillText(text, x, y), roundedRect(context, { x, y, w, h, r: 3 }), context.fillStyle = `${colors[type]}dd`, context.fill(), context.strokeStyle = colors[type], context.stroke(), context.fillStyle = colors.text, context.fillText(text, x, y), { x, y, w, h };
}
function configureText(context, text) {
  context.font = "600 12px monospace", context.textBaseline = "middle", context.textAlign = "center";
  let metrics = context.measureText(text), actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent, w = metrics.width + labelPadding * 2, h = actualHeight + labelPadding * 2;
  return { w, h };
}
function drawLabel(context, measurements, { type, position = "center", text }, prevRect, external = false) {
  let { x, y } = positionCoordinate(position, measurements), { offsetX, offsetY } = offset(type, position, measurements, labelPadding + 1, external);
  x += offsetX, y += offsetY;
  let { w, h } = configureText(context, text);
  if (prevRect && collide({ x, y, w, h }, prevRect)) {
    let adjusted = overlapAdjustment(position, { x, y, w, h }, prevRect);
    x = adjusted.x, y = adjusted.y;
  }
  return textWithRect(context, type, { x, y, w, h }, text);
}
function floatingOffset(alignment, { w, h }) {
  let deltaW = w * 0.5 + labelPadding, deltaH = h * 0.5 + labelPadding;
  return {
    offsetX: (alignment.x === "left" ? -1 : 1) * deltaW,
    offsetY: (alignment.y === "top" ? -1 : 1) * deltaH
  };
}
function drawFloatingLabel(context, measurements, { type, text }) {
  let { floatingAlignment: floatingAlignment2, extremities } = measurements, x = extremities[floatingAlignment2.x], y = extremities[floatingAlignment2.y], { w, h } = configureText(context, text), { offsetX, offsetY } = floatingOffset(floatingAlignment2, {
    w,
    h
  });
  return x += offsetX, y += offsetY, textWithRect(context, type, { x, y, w, h }, text);
}
function drawStack(context, measurements, stack, external) {
  let rects = [];
  stack.forEach((l, idx) => {
    let rect = external && l.position === "center" ? drawFloatingLabel(context, measurements, l) : drawLabel(context, measurements, l, rects[idx - 1], external);
    rects[idx] = rect;
  });
}
function labelStacks(context, measurements, labels, externalLabels) {
  let stacks = labels.reduce((acc, l) => (Object.prototype.hasOwnProperty.call(acc, l.position) || (acc[l.position] = []), acc[l.position]?.push(l), acc), {});
  stacks.top && drawStack(context, measurements, stacks.top, externalLabels), stacks.right && drawStack(context, measurements, stacks.right, externalLabels), stacks.bottom && drawStack(context, measurements, stacks.bottom, externalLabels), stacks.left && drawStack(context, measurements, stacks.left, externalLabels), stacks.center && drawStack(context, measurements, stacks.center, externalLabels);
}
var colors2 = {
  margin: "#f6b26ba8",
  border: "#ffe599a8",
  padding: "#93c47d8c",
  content: "#6fa8dca8"
};
var SMALL_NODE_SIZE = 30;
function pxToNumber(px) {
  return parseInt(px.replace("px", ""), 10);
}
function round(value) {
  return Number.isInteger(value) ? value : value.toFixed(2);
}
function filterZeroValues(labels) {
  return labels.filter((l) => l.text !== 0 && l.text !== "0");
}
function floatingAlignment(extremities) {
  let windowExtremities = {
    top: scope.window.scrollY,
    bottom: scope.window.scrollY + scope.window.innerHeight,
    left: scope.window.scrollX,
    right: scope.window.scrollX + scope.window.innerWidth
  }, distances = {
    top: Math.abs(windowExtremities.top - extremities.top),
    bottom: Math.abs(windowExtremities.bottom - extremities.bottom),
    left: Math.abs(windowExtremities.left - extremities.left),
    right: Math.abs(windowExtremities.right - extremities.right)
  };
  return {
    x: distances.left > distances.right ? "left" : "right",
    y: distances.top > distances.bottom ? "top" : "bottom"
  };
}
function measureElement(element) {
  let style = scope.getComputedStyle(element), { top, left, right, bottom, width, height } = element.getBoundingClientRect(), {
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    borderBottomWidth,
    borderTopWidth,
    borderLeftWidth,
    borderRightWidth
  } = style;
  top = top + scope.window.scrollY, left = left + scope.window.scrollX, bottom = bottom + scope.window.scrollY, right = right + scope.window.scrollX;
  let margin = {
    top: pxToNumber(marginTop),
    bottom: pxToNumber(marginBottom),
    left: pxToNumber(marginLeft),
    right: pxToNumber(marginRight)
  }, padding = {
    top: pxToNumber(paddingTop),
    bottom: pxToNumber(paddingBottom),
    left: pxToNumber(paddingLeft),
    right: pxToNumber(paddingRight)
  }, border = {
    top: pxToNumber(borderTopWidth),
    bottom: pxToNumber(borderBottomWidth),
    left: pxToNumber(borderLeftWidth),
    right: pxToNumber(borderRightWidth)
  }, extremities = {
    top: top - margin.top,
    bottom: bottom + margin.bottom,
    left: left - margin.left,
    right: right + margin.right
  };
  return {
    margin,
    padding,
    border,
    top,
    left,
    bottom,
    right,
    width,
    height,
    extremities,
    floatingAlignment: floatingAlignment(extremities)
  };
}
function drawMargin(context, { margin, width, height, top, left, bottom, right }) {
  let marginHeight = height + margin.bottom + margin.top;
  context.fillStyle = colors2.margin, context.fillRect(left, top - margin.top, width, margin.top), context.fillRect(right, top - margin.top, margin.right, marginHeight), context.fillRect(left, bottom, width, margin.bottom), context.fillRect(left - margin.left, top - margin.top, margin.left, marginHeight);
  let marginLabels = [
    {
      type: "margin",
      text: round(margin.top),
      position: "top"
    },
    {
      type: "margin",
      text: round(margin.right),
      position: "right"
    },
    {
      type: "margin",
      text: round(margin.bottom),
      position: "bottom"
    },
    {
      type: "margin",
      text: round(margin.left),
      position: "left"
    }
  ];
  return filterZeroValues(marginLabels);
}
function drawPadding(context, { padding, border, width, height, top, left, bottom, right }) {
  let paddingWidth = width - border.left - border.right, paddingHeight = height - padding.top - padding.bottom - border.top - border.bottom;
  context.fillStyle = colors2.padding, context.fillRect(left + border.left, top + border.top, paddingWidth, padding.top), context.fillRect(
    right - padding.right - border.right,
    top + padding.top + border.top,
    padding.right,
    paddingHeight
  ), context.fillRect(
    left + border.left,
    bottom - padding.bottom - border.bottom,
    paddingWidth,
    padding.bottom
  ), context.fillRect(left + border.left, top + padding.top + border.top, padding.left, paddingHeight);
  let paddingLabels = [
    {
      type: "padding",
      text: padding.top,
      position: "top"
    },
    {
      type: "padding",
      text: padding.right,
      position: "right"
    },
    {
      type: "padding",
      text: padding.bottom,
      position: "bottom"
    },
    {
      type: "padding",
      text: padding.left,
      position: "left"
    }
  ];
  return filterZeroValues(paddingLabels);
}
function drawBorder(context, { border, width, height, top, left, bottom, right }) {
  let borderHeight = height - border.top - border.bottom;
  context.fillStyle = colors2.border, context.fillRect(left, top, width, border.top), context.fillRect(left, bottom - border.bottom, width, border.bottom), context.fillRect(left, top + border.top, border.left, borderHeight), context.fillRect(right - border.right, top + border.top, border.right, borderHeight);
  let borderLabels = [
    {
      type: "border",
      text: border.top,
      position: "top"
    },
    {
      type: "border",
      text: border.right,
      position: "right"
    },
    {
      type: "border",
      text: border.bottom,
      position: "bottom"
    },
    {
      type: "border",
      text: border.left,
      position: "left"
    }
  ];
  return filterZeroValues(borderLabels);
}
function drawContent(context, { padding, border, width, height, top, left }) {
  let contentWidth = width - border.left - border.right - padding.left - padding.right, contentHeight = height - padding.top - padding.bottom - border.top - border.bottom;
  return context.fillStyle = colors2.content, context.fillRect(
    left + border.left + padding.left,
    top + border.top + padding.top,
    contentWidth,
    contentHeight
  ), [
    {
      type: "content",
      position: "center",
      text: `${round(contentWidth)} x ${round(contentHeight)}`
    }
  ];
}
function drawBoxModel(element) {
  return (context) => {
    if (element && context) {
      let measurements = measureElement(element), marginLabels = drawMargin(context, measurements), paddingLabels = drawPadding(context, measurements), borderLabels = drawBorder(context, measurements), contentLabels = drawContent(context, measurements), externalLabels = measurements.width <= SMALL_NODE_SIZE * 3 || measurements.height <= SMALL_NODE_SIZE;
      labelStacks(
        context,
        measurements,
        [...contentLabels, ...paddingLabels, ...borderLabels, ...marginLabels],
        externalLabels
      );
    }
  };
}
function drawSelectedElement(element) {
  draw(drawBoxModel(element));
}
var deepElementFromPoint = (x, y) => {
  let element = scope.document.elementFromPoint(x, y), crawlShadows = (node) => {
    if (node && node.shadowRoot) {
      let nestedElement = node.shadowRoot.elementFromPoint(x, y);
      return node.isEqualNode(nestedElement) ? node : nestedElement.shadowRoot ? crawlShadows(nestedElement) : nestedElement;
    }
    return node;
  };
  return crawlShadows(element) || element;
};
var nodeAtPointerRef;
var pointer = { x: 0, y: 0 };
function findAndDrawElement(x, y) {
  nodeAtPointerRef = deepElementFromPoint(x, y), drawSelectedElement(nodeAtPointerRef);
}
var withMeasure = (StoryFn, context) => {
  let { measureEnabled } = context.globals || {};
  return useEffect(() => {
    if (typeof globalThis.document > "u")
      return;
    let onPointerMove = (event) => {
      window.requestAnimationFrame(() => {
        event.stopPropagation(), pointer.x = event.clientX, pointer.y = event.clientY;
      });
    };
    return globalThis.document.addEventListener("pointermove", onPointerMove), () => {
      globalThis.document.removeEventListener("pointermove", onPointerMove);
    };
  }, []), useEffect(() => {
    let onPointerOver = (event) => {
      window.requestAnimationFrame(() => {
        event.stopPropagation(), findAndDrawElement(event.clientX, event.clientY);
      });
    }, onResize = () => {
      window.requestAnimationFrame(() => {
        rescale();
      });
    };
    return context.viewMode === "story" && measureEnabled && (globalThis.document.addEventListener("pointerover", onPointerOver), init(), globalThis.window.addEventListener("resize", onResize), findAndDrawElement(pointer.x, pointer.y)), () => {
      globalThis.window.removeEventListener("resize", onResize), destroy();
    };
  }, [measureEnabled, context.viewMode]), StoryFn();
};
var decorators2 = globalThis.FEATURES?.measure ? [withMeasure] : [];
var initialGlobals2 = {
  [PARAM_KEY2]: false
};
var preview_default5 = () => definePreviewAddon10({
  decorators: decorators2,
  initialGlobals: initialGlobals2
});
var clearStyles2 = (selector) => {
  (Array.isArray(selector) ? selector : [selector]).forEach(clearStyle2);
};
var clearStyle2 = (input) => {
  let selector = typeof input == "string" ? input : input.join(""), element = scope.document.getElementById(selector);
  element && element.parentElement && element.parentElement.removeChild(element);
};
var addOutlineStyles = (selector, css) => {
  let existingStyle = scope.document.getElementById(selector);
  if (existingStyle)
    existingStyle.innerHTML !== css && (existingStyle.innerHTML = css);
  else {
    let style = scope.document.createElement("style");
    style.setAttribute("id", selector), style.innerHTML = css, scope.document.head.appendChild(style);
  }
};
function outlineCSS(selector) {
  return dedent`
    ${selector} body {
      outline: 1px solid #2980b9 !important;
    }

    ${selector} article {
      outline: 1px solid #3498db !important;
    }

    ${selector} nav {
      outline: 1px solid #0088c3 !important;
    }

    ${selector} aside {
      outline: 1px solid #33a0ce !important;
    }

    ${selector} section {
      outline: 1px solid #66b8da !important;
    }

    ${selector} header {
      outline: 1px solid #99cfe7 !important;
    }

    ${selector} footer {
      outline: 1px solid #cce7f3 !important;
    }

    ${selector} h1 {
      outline: 1px solid #162544 !important;
    }

    ${selector} h2 {
      outline: 1px solid #314e6e !important;
    }

    ${selector} h3 {
      outline: 1px solid #3e5e85 !important;
    }

    ${selector} h4 {
      outline: 1px solid #449baf !important;
    }

    ${selector} h5 {
      outline: 1px solid #c7d1cb !important;
    }

    ${selector} h6 {
      outline: 1px solid #4371d0 !important;
    }

    ${selector} main {
      outline: 1px solid #2f4f90 !important;
    }

    ${selector} address {
      outline: 1px solid #1a2c51 !important;
    }

    ${selector} div {
      outline: 1px solid #036cdb !important;
    }

    ${selector} p {
      outline: 1px solid #ac050b !important;
    }

    ${selector} hr {
      outline: 1px solid #ff063f !important;
    }

    ${selector} pre {
      outline: 1px solid #850440 !important;
    }

    ${selector} blockquote {
      outline: 1px solid #f1b8e7 !important;
    }

    ${selector} ol {
      outline: 1px solid #ff050c !important;
    }

    ${selector} ul {
      outline: 1px solid #d90416 !important;
    }

    ${selector} li {
      outline: 1px solid #d90416 !important;
    }

    ${selector} dl {
      outline: 1px solid #fd3427 !important;
    }

    ${selector} dt {
      outline: 1px solid #ff0043 !important;
    }

    ${selector} dd {
      outline: 1px solid #e80174 !important;
    }

    ${selector} figure {
      outline: 1px solid #ff00bb !important;
    }

    ${selector} figcaption {
      outline: 1px solid #bf0032 !important;
    }

    ${selector} table {
      outline: 1px solid #00cc99 !important;
    }

    ${selector} caption {
      outline: 1px solid #37ffc4 !important;
    }

    ${selector} thead {
      outline: 1px solid #98daca !important;
    }

    ${selector} tbody {
      outline: 1px solid #64a7a0 !important;
    }

    ${selector} tfoot {
      outline: 1px solid #22746b !important;
    }

    ${selector} tr {
      outline: 1px solid #86c0b2 !important;
    }

    ${selector} th {
      outline: 1px solid #a1e7d6 !important;
    }

    ${selector} td {
      outline: 1px solid #3f5a54 !important;
    }

    ${selector} col {
      outline: 1px solid #6c9a8f !important;
    }

    ${selector} colgroup {
      outline: 1px solid #6c9a9d !important;
    }

    ${selector} button {
      outline: 1px solid #da8301 !important;
    }

    ${selector} datalist {
      outline: 1px solid #c06000 !important;
    }

    ${selector} fieldset {
      outline: 1px solid #d95100 !important;
    }

    ${selector} form {
      outline: 1px solid #d23600 !important;
    }

    ${selector} input {
      outline: 1px solid #fca600 !important;
    }

    ${selector} keygen {
      outline: 1px solid #b31e00 !important;
    }

    ${selector} label {
      outline: 1px solid #ee8900 !important;
    }

    ${selector} legend {
      outline: 1px solid #de6d00 !important;
    }

    ${selector} meter {
      outline: 1px solid #e8630c !important;
    }

    ${selector} optgroup {
      outline: 1px solid #b33600 !important;
    }

    ${selector} option {
      outline: 1px solid #ff8a00 !important;
    }

    ${selector} output {
      outline: 1px solid #ff9619 !important;
    }

    ${selector} progress {
      outline: 1px solid #e57c00 !important;
    }

    ${selector} select {
      outline: 1px solid #e26e0f !important;
    }

    ${selector} textarea {
      outline: 1px solid #cc5400 !important;
    }

    ${selector} details {
      outline: 1px solid #33848f !important;
    }

    ${selector} summary {
      outline: 1px solid #60a1a6 !important;
    }

    ${selector} command {
      outline: 1px solid #438da1 !important;
    }

    ${selector} menu {
      outline: 1px solid #449da6 !important;
    }

    ${selector} del {
      outline: 1px solid #bf0000 !important;
    }

    ${selector} ins {
      outline: 1px solid #400000 !important;
    }

    ${selector} img {
      outline: 1px solid #22746b !important;
    }

    ${selector} iframe {
      outline: 1px solid #64a7a0 !important;
    }

    ${selector} embed {
      outline: 1px solid #98daca !important;
    }

    ${selector} object {
      outline: 1px solid #00cc99 !important;
    }

    ${selector} param {
      outline: 1px solid #37ffc4 !important;
    }

    ${selector} video {
      outline: 1px solid #6ee866 !important;
    }

    ${selector} audio {
      outline: 1px solid #027353 !important;
    }

    ${selector} source {
      outline: 1px solid #012426 !important;
    }

    ${selector} canvas {
      outline: 1px solid #a2f570 !important;
    }

    ${selector} track {
      outline: 1px solid #59a600 !important;
    }

    ${selector} map {
      outline: 1px solid #7be500 !important;
    }

    ${selector} area {
      outline: 1px solid #305900 !important;
    }

    ${selector} a {
      outline: 1px solid #ff62ab !important;
    }

    ${selector} em {
      outline: 1px solid #800b41 !important;
    }

    ${selector} strong {
      outline: 1px solid #ff1583 !important;
    }

    ${selector} i {
      outline: 1px solid #803156 !important;
    }

    ${selector} b {
      outline: 1px solid #cc1169 !important;
    }

    ${selector} u {
      outline: 1px solid #ff0430 !important;
    }

    ${selector} s {
      outline: 1px solid #f805e3 !important;
    }

    ${selector} small {
      outline: 1px solid #d107b2 !important;
    }

    ${selector} abbr {
      outline: 1px solid #4a0263 !important;
    }

    ${selector} q {
      outline: 1px solid #240018 !important;
    }

    ${selector} cite {
      outline: 1px solid #64003c !important;
    }

    ${selector} dfn {
      outline: 1px solid #b4005a !important;
    }

    ${selector} sub {
      outline: 1px solid #dba0c8 !important;
    }

    ${selector} sup {
      outline: 1px solid #cc0256 !important;
    }

    ${selector} time {
      outline: 1px solid #d6606d !important;
    }

    ${selector} code {
      outline: 1px solid #e04251 !important;
    }

    ${selector} kbd {
      outline: 1px solid #5e001f !important;
    }

    ${selector} samp {
      outline: 1px solid #9c0033 !important;
    }

    ${selector} var {
      outline: 1px solid #d90047 !important;
    }

    ${selector} mark {
      outline: 1px solid #ff0053 !important;
    }

    ${selector} bdi {
      outline: 1px solid #bf3668 !important;
    }

    ${selector} bdo {
      outline: 1px solid #6f1400 !important;
    }

    ${selector} ruby {
      outline: 1px solid #ff7b93 !important;
    }

    ${selector} rt {
      outline: 1px solid #ff2f54 !important;
    }

    ${selector} rp {
      outline: 1px solid #803e49 !important;
    }

    ${selector} span {
      outline: 1px solid #cc2643 !important;
    }

    ${selector} br {
      outline: 1px solid #db687d !important;
    }

    ${selector} wbr {
      outline: 1px solid #db175b !important;
    }`;
}
var withOutline = (StoryFn, context) => {
  let globals = context.globals || {}, isActive = [true, "true"].includes(globals[PARAM_KEY3]), isInDocs = context.viewMode === "docs", outlineStyles = useMemo(() => outlineCSS(isInDocs ? '[data-story-block="true"]' : ".sb-show-main"), [context]);
  return useEffect(() => {
    let selectorId = isInDocs ? `addon-outline-docs-${context.id}` : "addon-outline";
    return isActive ? addOutlineStyles(selectorId, outlineStyles) : clearStyles2(selectorId), () => {
      clearStyles2(selectorId);
    };
  }, [isActive, outlineStyles, context]), StoryFn();
};
var decorators3 = globalThis.FEATURES?.outline ? [withOutline] : [];
var initialGlobals3 = {
  [PARAM_KEY3]: false
};
var preview_default6 = () => definePreviewAddon10({ decorators: decorators3, initialGlobals: initialGlobals3 });
var resetAllMocksLoader = ({ parameters: parameters2 }) => {
  parameters2?.test?.mockReset === true ? resetAllMocks() : parameters2?.test?.clearMocks === true ? clearAllMocks() : parameters2?.test?.restoreMocks !== false && restoreAllMocks();
};
var traverseArgs = (value, depth = 0, key) => {
  if (depth > 5 || value == null)
    return value;
  if (isMockFunction2(value))
    return key && value.mockName(key), value;
  if (typeof value == "function" && "isAction" in value && value.isAction && !("implicit" in value && value.implicit)) {
    let mock = fn2(value);
    return key && mock.mockName(key), mock;
  }
  if (Array.isArray(value)) {
    depth++;
    for (let i = 0; i < value.length; i++)
      Object.getOwnPropertyDescriptor(value, i)?.writable && (value[i] = traverseArgs(value[i], depth));
    return value;
  }
  if (typeof value == "object" && value.constructor === Object) {
    depth++;
    for (let [k, v] of Object.entries(value))
      Object.getOwnPropertyDescriptor(value, k)?.writable && (value[k] = traverseArgs(v, depth, k));
    return value;
  }
  return value;
};
var nameSpiesAndWrapActionsInSpies = ({ initialArgs }) => {
  traverseArgs(initialArgs);
};
var patchedFocus = false;
var enhanceContext = async (context) => {
  globalThis.HTMLElement && context.canvasElement instanceof globalThis.HTMLElement && (context.canvas = within(context.canvasElement));
  try {
    let clipboard = globalThis.window?.navigator?.clipboard;
    if (clipboard && (context.userEvent = instrument(
      { userEvent: uninstrumentedUserEvent.setup() },
      {
        intercept: true,
        getKeys: (obj) => Object.keys(obj).filter((key) => key !== "eventWrapper")
      }
    ).userEvent, Object.defineProperty(globalThis.window.navigator, "clipboard", {
      get: () => clipboard,
      configurable: true
    }), !patchedFocus)) {
      let originalFocus = HTMLElement.prototype.focus, currentFocus = HTMLElement.prototype.focus, focusingElements = /* @__PURE__ */ new Set();
      Object.defineProperties(HTMLElement.prototype, {
        focus: {
          configurable: true,
          set: (newFocus) => {
            currentFocus = newFocus;
          },
          get() {
            return focusingElements.has(this) ? originalFocus : (focusingElements.add(this), setTimeout(() => focusingElements.delete(this), 0), currentFocus);
          }
        }
      }), patchedFocus = true;
    }
  } catch {
  }
};
var preview_default7 = () => definePreviewAddon10({
  loaders: [resetAllMocksLoader, nameSpiesAndWrapActionsInSpies, enhanceContext]
});
var initialGlobals4 = {
  [PARAM_KEY4]: { value: void 0, isRotated: false }
};
var preview_default8 = () => definePreviewAddon10({
  initialGlobals: initialGlobals4
});
function getCoreAnnotations() {
  return [
    // @ts-expect-error CJS fallback
    (preview_default5.default ?? preview_default5)(),
    // @ts-expect-error CJS fallback
    (preview_default2.default ?? preview_default2)(),
    // @ts-expect-error CJS fallback
    (preview_default4.default ?? preview_default4)(),
    // @ts-expect-error CJS fallback
    (preview_default6.default ?? preview_default6)(),
    // @ts-expect-error CJS fallback
    (preview_default8.default ?? preview_default8)(),
    // @ts-expect-error CJS fallback
    (preview_default.default ?? preview_default)(),
    // @ts-expect-error CJS fallback
    (preview_default3.default ?? preview_default3)(),
    // @ts-expect-error CJS fallback
    (preview_default7.default ?? preview_default7)(),
    // @ts-expect-error CJS fallback
    (test_annotations_default.default ?? test_annotations_default)()
  ];
}
function definePreviewAddon10(preview) {
  return preview;
}
function isMeta(input) {
  return input != null && typeof input == "object" && "_tag" in input && input?._tag === "Meta";
}
function isStory(input) {
  return input != null && typeof input == "object" && "_tag" in input && input?._tag === "Story";
}
function getStoryChildren(story) {
  return "__children" in story ? story.__children : [];
}
var sanitize = (string) => string.toLowerCase().replace(/[ ’–—―′¿'`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "-").replace(/-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
var sanitizeSafe = (string, part) => {
  let sanitized = sanitize(string);
  if (sanitized === "")
    throw new Error(`Invalid ${part} '${string}', must include alphanumeric characters`);
  return sanitized;
};
var toId = (kind, name) => `${sanitizeSafe(kind, "kind")}${name ? `--${sanitizeSafe(name, "name")}` : ""}`;
var toTestId = (parentId, testName) => `${parentId}:${sanitizeSafe(testName, "test")}`;
var storyNameFromExport = (key) => toStartCaseStr(key);
function matches(storyKey, arrayOrRegex) {
  return Array.isArray(arrayOrRegex) ? arrayOrRegex.includes(storyKey) : storyKey.match(arrayOrRegex);
}
function isExportStory(key, { includeStories, excludeStories }) {
  return (
    // https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs
    key !== "__esModule" && (!includeStories || matches(key, includeStories)) && (!excludeStories || !matches(key, excludeStories))
  );
}
var combineTags2 = (...tags) => {
  let result = tags.reduce((acc, tag) => (tag.startsWith("!") ? acc.delete(tag.slice(1)) : acc.add(tag), acc), /* @__PURE__ */ new Set());
  return Array.from(result);
};

// node_modules/storybook/dist/_browser-chunks/chunk-SZQXB3JV.js
function mockChannel() {
  let transport = {
    setHandler: () => {
    },
    send: () => {
    }
  };
  return new Channel({ transport });
}
var AddonStore = class {
  constructor() {
    this.getChannel = () => {
      if (!this.channel) {
        let channel = mockChannel();
        return this.setChannel(channel), channel;
      }
      return this.channel;
    };
    this.ready = () => this.promise;
    this.hasChannel = () => !!this.channel;
    this.setChannel = (channel) => {
      this.channel = channel, this.resolve();
    };
    this.promise = new Promise((res) => {
      this.resolve = () => res(this.getChannel());
    });
  }
};
var KEY = "__STORYBOOK_ADDONS_PREVIEW";
function getAddonsStore() {
  return scope[KEY] || (scope[KEY] = new AddonStore()), scope[KEY];
}
var addons = getAddonsStore();
var HooksContext = class {
  constructor() {
    this.hookListsMap = void 0;
    this.mountedDecorators = void 0;
    this.prevMountedDecorators = void 0;
    this.currentHooks = void 0;
    this.nextHookIndex = void 0;
    this.currentPhase = void 0;
    this.currentEffects = void 0;
    this.prevEffects = void 0;
    this.currentDecoratorName = void 0;
    this.hasUpdates = void 0;
    this.currentContext = void 0;
    this.renderListener = (storyId) => {
      storyId === this.currentContext?.id && (this.triggerEffects(), this.currentContext = null, this.removeRenderListeners());
    };
    this.init();
  }
  init() {
    this.hookListsMap = /* @__PURE__ */ new WeakMap(), this.mountedDecorators = /* @__PURE__ */ new Set(), this.prevMountedDecorators = /* @__PURE__ */ new Set(), this.currentHooks = [], this.nextHookIndex = 0, this.currentPhase = "NONE", this.currentEffects = [], this.prevEffects = [], this.currentDecoratorName = null, this.hasUpdates = false, this.currentContext = null;
  }
  clean() {
    this.prevEffects.forEach((effect) => {
      effect.destroy && effect.destroy();
    }), this.init(), this.removeRenderListeners();
  }
  getNextHook() {
    let hook = this.currentHooks[this.nextHookIndex];
    return this.nextHookIndex += 1, hook;
  }
  triggerEffects() {
    this.prevEffects.forEach((effect) => {
      !this.currentEffects.includes(effect) && effect.destroy && effect.destroy();
    }), this.currentEffects.forEach((effect) => {
      this.prevEffects.includes(effect) || (effect.destroy = effect.create());
    }), this.prevEffects = this.currentEffects, this.currentEffects = [];
  }
  addRenderListeners() {
    this.removeRenderListeners(), addons.getChannel().on(STORY_RENDERED, this.renderListener);
  }
  removeRenderListeners() {
    addons.getChannel().removeListener(STORY_RENDERED, this.renderListener);
  }
};
function hookify(fn) {
  let hookified = (...args) => {
    let { hooks } = typeof args[0] == "function" ? args[1] : args[0], prevPhase = hooks.currentPhase, prevHooks = hooks.currentHooks, prevNextHookIndex = hooks.nextHookIndex, prevDecoratorName = hooks.currentDecoratorName;
    hooks.currentDecoratorName = fn.name, hooks.prevMountedDecorators.has(fn) ? (hooks.currentPhase = "UPDATE", hooks.currentHooks = hooks.hookListsMap.get(fn) || []) : (hooks.currentPhase = "MOUNT", hooks.currentHooks = [], hooks.hookListsMap.set(fn, hooks.currentHooks), hooks.prevMountedDecorators.add(fn)), hooks.nextHookIndex = 0;
    let prevContext = scope.STORYBOOK_HOOKS_CONTEXT;
    scope.STORYBOOK_HOOKS_CONTEXT = hooks;
    let result = fn(...args);
    if (scope.STORYBOOK_HOOKS_CONTEXT = prevContext, hooks.currentPhase === "UPDATE" && hooks.getNextHook() != null)
      throw new Error(
        "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."
      );
    return hooks.currentPhase = prevPhase, hooks.currentHooks = prevHooks, hooks.nextHookIndex = prevNextHookIndex, hooks.currentDecoratorName = prevDecoratorName, result;
  };
  return hookified.originalFn = fn, hookified;
}
var numberOfRenders = 0;
var RENDER_LIMIT = 25;
var applyHooks = (applyDecorators) => (storyFn, decorators4) => {
  let decorated = applyDecorators(
    hookify(storyFn),
    decorators4.map((decorator) => hookify(decorator))
  );
  return (context) => {
    let { hooks } = context;
    hooks.prevMountedDecorators ??= /* @__PURE__ */ new Set(), hooks.mountedDecorators = /* @__PURE__ */ new Set([storyFn, ...decorators4]), hooks.currentContext = context, hooks.hasUpdates = false;
    let result = decorated(context);
    for (numberOfRenders = 1; hooks.hasUpdates; )
      if (hooks.hasUpdates = false, hooks.currentEffects = [], result = decorated(context), numberOfRenders += 1, numberOfRenders > RENDER_LIMIT)
        throw new Error(
          "Too many re-renders. Storybook limits the number of renders to prevent an infinite loop."
        );
    return hooks.addRenderListeners(), result;
  };
};
var areDepsEqual = (deps, nextDeps) => deps.length === nextDeps.length && deps.every((dep, i) => dep === nextDeps[i]);
var invalidHooksError = () => new Error(
  `Storybook preview hooks can only be called inside decorators and story functions.

When combining Storybook hooks (e.g. useArgs) with framework hooks (e.g. React's useState, useEffect, useRef) in the same render function, use Storybook's equivalents from 'storybook/preview-api' instead: useState, useEffect, useRef, useMemo, useCallback, useReducer.`
);
function getHooksContextOrNull() {
  return scope.STORYBOOK_HOOKS_CONTEXT || null;
}
function getHooksContextOrThrow() {
  let hooks = getHooksContextOrNull();
  if (hooks == null)
    throw invalidHooksError();
  return hooks;
}
function useHook(name, callback, deps) {
  let hooks = getHooksContextOrThrow();
  if (hooks.currentPhase === "MOUNT") {
    deps != null && !Array.isArray(deps) && logger.warn(
      `${name} received a final argument that is not an array (instead, received ${deps}). When specified, the final argument must be an array.`
    );
    let hook = { name, deps };
    return hooks.currentHooks.push(hook), callback(hook), hook;
  }
  if (hooks.currentPhase === "UPDATE") {
    let hook = hooks.getNextHook();
    if (hook == null)
      throw new Error("Rendered more hooks than during the previous render.");
    return hook.name !== name && logger.warn(
      `Storybook has detected a change in the order of Hooks${hooks.currentDecoratorName ? ` called by ${hooks.currentDecoratorName}` : ""}. This will lead to bugs and errors if not fixed.`
    ), deps != null && hook.deps == null && logger.warn(
      `${name} received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.`
    ), deps != null && hook.deps != null && deps.length !== hook.deps.length && logger.warn(`The final argument passed to ${name} changed size between renders. The order and size of this array must remain constant.
Previous: ${hook.deps}
Incoming: ${deps}`), (deps == null || hook.deps == null || !areDepsEqual(deps, hook.deps)) && (callback(hook), hook.deps = deps), hook;
  }
  throw invalidHooksError();
}
function useMemoLike(name, nextCreate, deps) {
  let { memoizedState } = useHook(
    name,
    (hook) => {
      hook.memoizedState = nextCreate();
    },
    deps
  );
  return memoizedState;
}
function useMemo(nextCreate, deps) {
  return useMemoLike("useMemo", nextCreate, deps);
}
function useCallback(callback, deps) {
  return useMemoLike("useCallback", () => callback, deps);
}
function useRefLike(name, initialValue) {
  return useMemoLike(name, () => ({ current: initialValue }), []);
}
function useRef(initialValue) {
  return useRefLike("useRef", initialValue);
}
function triggerUpdate() {
  let hooks = getHooksContextOrNull();
  if (hooks != null && hooks.currentPhase !== "NONE")
    hooks.hasUpdates = true;
  else
    try {
      addons.getChannel().emit(FORCE_RE_RENDER);
    } catch {
      logger.warn("State updates of Storybook preview hooks work only in browser");
    }
}
function useStateLike(name, initialState) {
  let stateRef = useRefLike(
    name,
    // @ts-expect-error S type should never be function, but there's no way to tell that to TypeScript
    typeof initialState == "function" ? initialState() : initialState
  ), setState = (update) => {
    stateRef.current = typeof update == "function" ? update(stateRef.current) : update, triggerUpdate();
  };
  return [stateRef.current, setState];
}
function useState(initialState) {
  return useStateLike("useState", initialState);
}
function useReducer(reducer, initialArg, init2) {
  let initialState = init2 != null ? () => init2(initialArg) : initialArg, [state3, setState] = useStateLike("useReducer", initialState);
  return [state3, (action2) => setState((prevState) => reducer(prevState, action2))];
}
function useEffect(create, deps) {
  let hooks = getHooksContextOrThrow(), effect = useMemoLike("useEffect", () => ({ create }), deps);
  hooks.currentEffects.includes(effect) || hooks.currentEffects.push(effect);
}
function useChannel(eventMap, deps = []) {
  let channel = addons.getChannel();
  return useEffect(() => (Object.entries(eventMap).forEach(([type, listener]) => channel.on(type, listener)), () => {
    Object.entries(eventMap).forEach(
      ([type, listener]) => channel.removeListener(type, listener)
    );
  }), [...Object.keys(eventMap), ...deps]), useCallback(channel.emit.bind(channel), [channel]);
}
function useStoryContext() {
  let { currentContext } = getHooksContextOrThrow();
  if (currentContext == null)
    throw invalidHooksError();
  return currentContext;
}
function useParameter(parameterKey, defaultValue) {
  let { parameters: parameters2 } = useStoryContext();
  if (parameterKey)
    return parameters2[parameterKey] ?? defaultValue;
}
function useArgs() {
  let channel = addons.getChannel(), { id: storyId, args } = useStoryContext(), updateArgs = useCallback(
    (updatedArgs) => channel.emit(UPDATE_STORY_ARGS, { storyId, updatedArgs }),
    [channel, storyId]
  ), resetArgs = useCallback(
    (argNames) => channel.emit(RESET_STORY_ARGS, { storyId, argNames }),
    [channel, storyId]
  );
  return [args, updateArgs, resetArgs];
}
function useGlobals() {
  let channel = addons.getChannel(), { globals } = useStoryContext(), updateGlobals = useCallback(
    (newGlobals) => channel.emit(UPDATE_GLOBALS, { globals: newGlobals }),
    [channel]
  );
  return [globals, updateGlobals];
}
var makeDecorator = ({
  name,
  parameterName,
  wrapper,
  skipIfNoParametersOrOptions = false
}) => {
  let decorator = (options) => (storyFn, context) => {
    let parameters2 = context.parameters && context.parameters[parameterName];
    return parameters2 && parameters2.disable || skipIfNoParametersOrOptions && !options && !parameters2 ? storyFn(context) : wrapper(storyFn, context, {
      options,
      parameters: parameters2
    });
  };
  return (...args) => typeof args[0] == "function" ? decorator()(...args) : (...innerArgs) => {
    if (innerArgs.length > 1)
      return args.length > 1 ? decorator(args)(...innerArgs) : decorator(...args)(...innerArgs);
    throw new Error(
      `Passing stories directly into ${name}() is not allowed,
        instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`
    );
  };
};
var import_memoizerific2 = __toESM(require_memoizerific(), 1);
var INCOMPATIBLE = Symbol("incompatible");
var map = (arg, argType) => {
  let type = argType.type;
  if (arg == null || !type || argType.mapping)
    return arg;
  switch (type.name) {
    case "string":
      return String(arg);
    case "enum":
      return arg;
    case "number":
      return Number(arg);
    case "boolean":
      return String(arg) === "true";
    case "array":
      return !type.value || !Array.isArray(arg) ? INCOMPATIBLE : arg.reduce((acc, item, index) => {
        let mapped = map(item, { type: type.value });
        return mapped !== INCOMPATIBLE && (acc[index] = mapped), acc;
      }, new Array(arg.length));
    case "object":
      return typeof arg == "string" || typeof arg == "number" ? arg : !type.value || typeof arg != "object" ? INCOMPATIBLE : Object.entries(arg).reduce((acc, [key, val]) => {
        let mapped = map(val, { type: type.value[key] });
        return mapped === INCOMPATIBLE ? acc : Object.assign(acc, { [key]: mapped });
      }, {});
    case "other": {
      let isPrimitiveArg = typeof arg == "string" || typeof arg == "number" || typeof arg == "boolean";
      return type.value === "ReactNode" && isPrimitiveArg ? arg : INCOMPATIBLE;
    }
    default:
      return INCOMPATIBLE;
  }
};
var mapArgsToTypes = (args, argTypes) => Object.entries(args).reduce((acc, [key, value]) => {
  if (!argTypes[key])
    return acc;
  let mapped = map(value, argTypes[key]);
  return mapped === INCOMPATIBLE ? acc : Object.assign(acc, { [key]: mapped });
}, {});
var combineArgs = (value, update) => Array.isArray(value) && Array.isArray(update) ? update.reduce(
  (acc, upd, index) => (acc[index] = combineArgs(value[index], update[index]), acc),
  [...value]
).filter((v) => v !== void 0) : !isPlainObject(value) || !isPlainObject(update) ? update : Object.keys({ ...value, ...update }).reduce((acc, key) => {
  if (key in update) {
    let combined = combineArgs(value[key], update[key]);
    combined !== void 0 && (acc[key] = combined);
  } else
    acc[key] = value[key];
  return acc;
}, {});
var validateOptions = (args, argTypes) => Object.entries(argTypes).reduce((acc, [key, { options }]) => {
  function allowArg() {
    return key in args && (acc[key] = args[key]), acc;
  }
  if (!options)
    return allowArg();
  if (!Array.isArray(options))
    return once.error(dedent`
        Invalid argType: '${key}.options' should be an array.

        More info: https://storybook.js.org/docs/api/arg-types?ref=error
      `), allowArg();
  if (options.some((opt) => opt && ["object", "function"].includes(typeof opt)))
    return once.error(dedent`
        Invalid argType: '${key}.options' should only contain primitives. Use a 'mapping' for complex values.

        More info: https://storybook.js.org/docs/writing-stories/args?ref=error#mapping-to-complex-arg-values
      `), allowArg();
  let isArray = Array.isArray(args[key]), invalidIndex = isArray && args[key].findIndex((val) => !options.includes(val)), isValidArray = isArray && invalidIndex === -1;
  if (args[key] === void 0 || options.includes(args[key]) || isValidArray)
    return allowArg();
  let field = isArray ? `${key}[${invalidIndex}]` : key, supportedOptions = options.map((opt) => typeof opt == "string" ? `'${opt}'` : String(opt)).join(", ");
  return once.warn(`Received illegal value for '${field}'. Supported options: ${supportedOptions}`), acc;
}, {});
var DEEPLY_EQUAL = Symbol("Deeply equal");
var deepDiff = (value, update) => {
  if (typeof value != typeof update)
    return update;
  if (isEqual(value, update))
    return DEEPLY_EQUAL;
  if (Array.isArray(value) && Array.isArray(update)) {
    let res = update.reduce((acc, upd, index) => {
      let diff = deepDiff(value[index], upd);
      return diff !== DEEPLY_EQUAL && (acc[index] = diff), acc;
    }, new Array(update.length));
    return update.length >= value.length ? res : res.concat(new Array(value.length - update.length).fill(void 0));
  }
  return isPlainObject(value) && isPlainObject(update) ? Object.keys({ ...value, ...update }).reduce((acc, key) => {
    let diff = deepDiff(value?.[key], update?.[key]);
    return diff === DEEPLY_EQUAL ? acc : Object.assign(acc, { [key]: diff });
  }, {}) : update;
};
var UNTARGETED = "UNTARGETED";
function groupArgsByTarget({
  args,
  argTypes
}) {
  let groupedArgs = {};
  return Object.entries(args).forEach(([name, value]) => {
    let { target = UNTARGETED } = argTypes[name] || {};
    groupedArgs[target] = groupedArgs[target] || {}, groupedArgs[target][name] = value;
  }), groupedArgs;
}
function deleteUndefined(obj) {
  return Object.keys(obj).forEach((key) => obj[key] === void 0 && delete obj[key]), obj;
}
var ArgsStore = class {
  constructor() {
    this.initialArgsByStoryId = {};
    this.argsByStoryId = {};
  }
  get(storyId) {
    if (!(storyId in this.argsByStoryId))
      throw new Error(`No args known for ${storyId} -- has it been rendered yet?`);
    return this.argsByStoryId[storyId];
  }
  setInitial(story) {
    if (!this.initialArgsByStoryId[story.id])
      this.initialArgsByStoryId[story.id] = story.initialArgs, this.argsByStoryId[story.id] = story.initialArgs;
    else if (this.initialArgsByStoryId[story.id] !== story.initialArgs) {
      let delta = deepDiff(this.initialArgsByStoryId[story.id], this.argsByStoryId[story.id]);
      this.initialArgsByStoryId[story.id] = story.initialArgs, this.argsByStoryId[story.id] = story.initialArgs, delta !== DEEPLY_EQUAL && this.updateFromDelta(story, delta);
    }
  }
  updateFromDelta(story, delta) {
    let validatedDelta = validateOptions(delta, story.argTypes);
    this.argsByStoryId[story.id] = combineArgs(this.argsByStoryId[story.id], validatedDelta);
  }
  updateFromPersisted(story, persisted) {
    let mappedPersisted = mapArgsToTypes(persisted, story.argTypes);
    return this.updateFromDelta(story, mappedPersisted);
  }
  update(storyId, argsUpdate) {
    if (!(storyId in this.argsByStoryId))
      throw new Error(`No args known for ${storyId} -- has it been rendered yet?`);
    this.argsByStoryId[storyId] = deleteUndefined({
      ...this.argsByStoryId[storyId],
      ...argsUpdate
    });
  }
};
var getValuesFromGlobalTypes = (globalTypes = {}) => Object.entries(globalTypes).reduce((acc, [arg, { defaultValue }]) => (typeof defaultValue < "u" && (acc[arg] = defaultValue), acc), {});
var GlobalsStore = class {
  constructor({
    globals = {},
    globalTypes = {}
  }) {
    this.set({ globals, globalTypes });
  }
  set({ globals = {}, globalTypes = {} }) {
    let delta = this.initialGlobals && deepDiff(this.initialGlobals, this.globals);
    this.allowedGlobalNames = /* @__PURE__ */ new Set([...Object.keys(globals), ...Object.keys(globalTypes)]);
    let defaultGlobals = getValuesFromGlobalTypes(globalTypes);
    this.initialGlobals = { ...defaultGlobals, ...globals }, this.globals = this.initialGlobals, delta && delta !== DEEPLY_EQUAL && this.updateFromPersisted(delta);
  }
  filterAllowedGlobals(globals) {
    return Object.entries(globals).reduce((acc, [key, value]) => (this.allowedGlobalNames.has(key) ? acc[key] = value : logger.warn(
      `Attempted to set a global (${key}) that is not defined in initial globals or globalTypes`
    ), acc), {});
  }
  updateFromPersisted(persisted) {
    let allowedUrlGlobals = this.filterAllowedGlobals(persisted);
    this.globals = { ...this.globals, ...allowedUrlGlobals };
  }
  get() {
    return this.globals;
  }
  update(newGlobals) {
    this.globals = { ...this.globals, ...this.filterAllowedGlobals(newGlobals) };
    for (let key in newGlobals)
      newGlobals[key] === void 0 && (this.globals[key] = this.initialGlobals[key]);
  }
};
var import_memoizerific = __toESM(require_memoizerific(), 1);
var getImportPathMap = (0, import_memoizerific.default)(1)(
  (entries) => Object.values(entries).reduce(
    (acc, entry) => (acc[entry.importPath] = acc[entry.importPath] || entry, acc),
    {}
  )
);
var StoryIndexStore = class {
  constructor({ entries } = { v: 5, entries: {} }) {
    this.entries = entries;
  }
  entryFromSpecifier(specifier) {
    let entries = Object.values(this.entries);
    if (specifier === "*")
      return entries[0];
    if (typeof specifier == "string")
      return this.entries[specifier] ? this.entries[specifier] : entries.find((entry) => entry.id.startsWith(specifier));
    let { name, title } = specifier;
    return entries.find((entry) => entry.name === name && entry.title === title);
  }
  storyIdToEntry(storyId) {
    let storyEntry = this.entries[storyId];
    if (!storyEntry)
      throw new MissingStoryAfterHmrError({ storyId });
    return storyEntry;
  }
  importPathToEntry(importPath) {
    return getImportPathMap(this.entries)[importPath];
  }
};
var normalizeType = (type) => typeof type == "string" ? { name: type } : type;
var normalizeControl = (control) => typeof control == "string" ? { type: control, disable: false } : control && typeof control == "object" && "type" in control && !("disable" in control) ? { ...control, disable: false } : control;
var normalizeInputType = (inputType, key) => {
  let { type, control, ...rest } = inputType, normalized = {
    name: key,
    ...rest
  };
  return type && (normalized.type = normalizeType(type)), control ? normalized.control = normalizeControl(control) : control === false && (normalized.control = { disable: true }), normalized;
};
var normalizeInputTypes = (inputTypes) => mapValues(inputTypes, normalizeInputType);
var normalizeArrays = (array) => Array.isArray(array) ? array : array ? [array] : [];
var deprecatedStoryAnnotation = dedent`
CSF .story annotations deprecated; annotate story functions directly:
- StoryFn.story.name => StoryFn.storyName
- StoryFn.story.(parameters|decorators) => StoryFn.(parameters|decorators)
See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations for details and codemod.
`;
function normalizeStory(key, storyAnnotations, meta) {
  let storyObject = storyAnnotations, userStoryFn = typeof storyAnnotations == "function" ? storyAnnotations : null, { story } = storyObject;
  story && (logger.debug("deprecated story", story), deprecate(deprecatedStoryAnnotation));
  let exportName = storyNameFromExport(key), name = typeof storyObject != "function" && storyObject.name || storyObject.storyName || story?.name || exportName, decorators4 = [
    ...normalizeArrays(storyObject.decorators),
    ...normalizeArrays(story?.decorators)
  ], parameters2 = { ...story?.parameters, ...storyObject.parameters }, args = { ...story?.args, ...storyObject.args }, argTypes = { ...story?.argTypes, ...storyObject.argTypes }, loaders2 = [...normalizeArrays(storyObject.loaders), ...normalizeArrays(story?.loaders)], beforeEach = [
    ...normalizeArrays(storyObject.beforeEach),
    ...normalizeArrays(story?.beforeEach)
  ], afterEach2 = [
    ...normalizeArrays(storyObject.afterEach),
    ...normalizeArrays(story?.afterEach)
  ], { render, play, tags = [], globals = {} } = storyObject, id = parameters2.__id || toId(meta.id, exportName);
  return {
    moduleExport: storyAnnotations,
    id,
    name,
    tags,
    decorators: decorators4,
    parameters: parameters2,
    args,
    argTypes: normalizeInputTypes(argTypes),
    loaders: loaders2,
    beforeEach,
    afterEach: afterEach2,
    globals,
    ...render && { render },
    ...userStoryFn && { userStoryFn },
    ...play && { play }
  };
}
function normalizeComponentAnnotations(defaultExport, title = defaultExport.title, importPath) {
  let { id, argTypes } = defaultExport;
  return {
    id: sanitize(id || title),
    ...defaultExport,
    title,
    ...argTypes && { argTypes: normalizeInputTypes(argTypes) },
    parameters: {
      fileName: importPath,
      ...defaultExport.parameters
    }
  };
}
var checkGlobals = (parameters2) => {
  let { globals, globalTypes } = parameters2;
  (globals || globalTypes) && logger.error(
    "Global args/argTypes can only be set globally",
    JSON.stringify({
      globals,
      globalTypes
    })
  );
};
var checkStorySort = (parameters2) => {
  let { options } = parameters2;
  options?.storySort && logger.error("The storySort option parameter can only be set globally");
};
var checkDisallowedParameters = (parameters2) => {
  parameters2 && (checkGlobals(parameters2), checkStorySort(parameters2));
};
function processCSFFile(moduleExports, importPath, title) {
  let { default: defaultExport, __namedExportsOrder, ...namedExports } = moduleExports, factoryStory = Object.values(namedExports).find((it) => isStory(it));
  if (factoryStory) {
    let meta2 = normalizeComponentAnnotations(factoryStory.meta.input, title, importPath);
    checkDisallowedParameters(meta2.parameters);
    let csfFile2 = { meta: meta2, stories: {}, moduleExports };
    return Object.keys(namedExports).forEach((key) => {
      if (isExportStory(key, meta2) && isStory(namedExports[key])) {
        let story = namedExports[key], storyMeta = normalizeStory(key, story.input, meta2);
        checkDisallowedParameters(storyMeta.parameters), csfFile2.stories[storyMeta.id] = storyMeta, getStoryChildren(story).forEach((child) => {
          let name = child.input.name, childId = toTestId(storyMeta.id, name);
          child.input.parameters ??= {}, child.input.parameters.__id = childId, csfFile2.stories[childId] = normalizeStory(name, child.input, meta2);
        });
      }
    }), csfFile2.projectAnnotations = factoryStory.meta.preview.composed, csfFile2;
  }
  let meta = normalizeComponentAnnotations(
    defaultExport,
    title,
    importPath
  );
  checkDisallowedParameters(meta.parameters);
  let csfFile = { meta, stories: {}, moduleExports };
  return Object.keys(namedExports).forEach((key) => {
    if (isExportStory(key, meta)) {
      let storyMeta = normalizeStory(key, namedExports[key], meta);
      checkDisallowedParameters(storyMeta.parameters), csfFile.stories[storyMeta.id] = storyMeta;
    }
  }), csfFile;
}
function mountDestructured(playFunction) {
  return playFunction != null && getUsedProps(playFunction).includes("mount");
}
function getUsedProps(fn) {
  let [, args, body] = fn.toString().match(/[^(]*\(([^)]+)\)(?:.*{([^]+)})?/) || [];
  if (!args)
    return [];
  let [firstArg] = splitByComma(args);
  if (!firstArg)
    return [];
  let [, destructuredProps] = firstArg.match(/^{([^]+)}$/) || [];
  if (destructuredProps)
    return splitByComma(stripComments(destructuredProps)).map(
      (prop) => prop.replace(/:.*|=.*/g, "").trim()
    );
  if (!firstArg.match(/^[a-z_$][0-9a-z_$]*$/i))
    return [];
  let escapedArg = firstArg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), [, destructuredArg] = body?.trim()?.match(new RegExp(`^(?:const|let|var)\\s*{([^}]+)}\\s*=\\s*${escapedArg};`)) || [];
  return destructuredArg ? splitByComma(stripComments(destructuredArg)).map(
    (prop) => prop.replace(/:.*|=.*/g, "").trim()
  ) : [];
}
function stripComments(s) {
  return s = s.replace(/\/\/.*$/gm, ""), s = s.replace(/\/\*[\s\S]*?\*\//g, ""), s;
}
function splitByComma(s) {
  let result = [], stack = [], start = 0;
  for (let i = 0; i < s.length; i++)
    if (s[i] === "{" || s[i] === "[")
      stack.push(s[i] === "{" ? "}" : "]");
    else if (s[i] === stack[stack.length - 1])
      stack.pop();
    else if (!stack.length && s[i] === ",") {
      let token = s.substring(start, i).trim();
      token && result.push(token), start = i + 1;
    }
  let lastToken = s.substring(start).trim();
  return lastToken && result.push(lastToken), result;
}
function decorateStory(storyFn, decorator, bindWithContext) {
  let boundStoryFunction = bindWithContext(storyFn);
  return (context) => decorator(boundStoryFunction, context);
}
function sanitizeStoryContextUpdate({
  componentId,
  title,
  kind,
  id,
  name,
  story,
  parameters: parameters2,
  initialArgs,
  argTypes,
  ...update
} = {}) {
  return update;
}
function defaultDecorateStory(storyFn, decorators4) {
  let contextStore = {}, bindWithContext = (decoratedStoryFn) => (update) => {
    if (!contextStore.value)
      throw new Error("Decorated function called without init");
    return contextStore.value = {
      ...contextStore.value,
      ...sanitizeStoryContextUpdate(update)
    }, decoratedStoryFn(contextStore.value);
  }, decoratedWithContextStore = decorators4.reduce(
    (story, decorator) => decorateStory(story, decorator, bindWithContext),
    storyFn
  );
  return (context) => (contextStore.value = context, decoratedWithContextStore(context));
}
function prepareStory(storyAnnotations, componentAnnotations, projectAnnotations) {
  let { moduleExport, id, name } = storyAnnotations || {}, partialAnnotations = preparePartialAnnotations(
    storyAnnotations,
    componentAnnotations,
    projectAnnotations
  ), applyLoaders = async (context) => {
    let loaded = {};
    for (let loaders2 of [
      normalizeArrays(projectAnnotations.loaders),
      normalizeArrays(componentAnnotations.loaders),
      normalizeArrays(storyAnnotations.loaders)
    ]) {
      if (context.abortSignal.aborted)
        return loaded;
      let loadResults = await Promise.all(loaders2.map((loader) => loader(context)));
      Object.assign(loaded, ...loadResults);
    }
    return loaded;
  }, applyBeforeEach = async (context) => {
    let cleanupCallbacks = new Array();
    for (let beforeEach of [
      ...normalizeArrays(projectAnnotations.beforeEach),
      ...normalizeArrays(componentAnnotations.beforeEach),
      ...normalizeArrays(storyAnnotations.beforeEach)
    ]) {
      if (context.abortSignal.aborted)
        return cleanupCallbacks;
      let cleanup = await beforeEach(context);
      cleanup && cleanupCallbacks.push(cleanup);
    }
    return cleanupCallbacks;
  }, applyAfterEach = async (context) => {
    let reversedFinalizers = [
      ...normalizeArrays(projectAnnotations.afterEach),
      ...normalizeArrays(componentAnnotations.afterEach),
      ...normalizeArrays(storyAnnotations.afterEach)
    ].reverse();
    for (let finalizer of reversedFinalizers) {
      if (context.abortSignal.aborted)
        return;
      await finalizer(context);
    }
  }, undecoratedStoryFn = (context) => context.originalStoryFn(context.args, context), { applyDecorators = defaultDecorateStory, runStep } = projectAnnotations, decorators4 = [
    ...normalizeArrays(storyAnnotations?.decorators),
    ...normalizeArrays(componentAnnotations?.decorators),
    ...normalizeArrays(projectAnnotations?.decorators)
  ], render = storyAnnotations?.userStoryFn || storyAnnotations?.render || componentAnnotations.render || projectAnnotations.render, decoratedStoryFn = applyHooks(applyDecorators)(undecoratedStoryFn, decorators4), unboundStoryFn = (context) => decoratedStoryFn(context), playFunction = storyAnnotations?.play ?? componentAnnotations?.play, usesMount = mountDestructured(playFunction);
  if (!render && !usesMount)
    throw new NoRenderFunctionError({ id });
  let defaultMount = (context) => async () => (await context.renderToCanvas(), context.canvas), mount = storyAnnotations.mount ?? componentAnnotations.mount ?? projectAnnotations.mount ?? defaultMount, testingLibraryRender = projectAnnotations.testingLibraryRender;
  return {
    storyGlobals: {},
    ...partialAnnotations,
    moduleExport,
    id,
    name,
    story: name,
    originalStoryFn: render,
    undecoratedStoryFn,
    unboundStoryFn,
    applyLoaders,
    applyBeforeEach,
    applyAfterEach,
    playFunction,
    runStep,
    mount,
    testingLibraryRender,
    renderToCanvas: projectAnnotations.renderToCanvas,
    usesMount
  };
}
function prepareMeta(componentAnnotations, projectAnnotations, moduleExport) {
  return {
    ...preparePartialAnnotations(void 0, componentAnnotations, projectAnnotations),
    moduleExport
  };
}
function preparePartialAnnotations(storyAnnotations, componentAnnotations, projectAnnotations) {
  let defaultTags = [Tag.DEV, Tag.TEST], extraTags = scope.DOCS_OPTIONS?.autodocs === true ? [Tag.AUTODOCS] : [], overrideTags = storyAnnotations?.tags?.includes(Tag.TEST_FN) ? [`!${Tag.AUTODOCS}`] : [], tags = combineTags2(
    ...defaultTags,
    ...extraTags,
    ...projectAnnotations.tags ?? [],
    ...componentAnnotations.tags ?? [],
    ...overrideTags,
    ...storyAnnotations?.tags ?? []
  ), parameters2 = combineParameters(
    projectAnnotations.parameters,
    componentAnnotations.parameters,
    storyAnnotations?.parameters
  ), { argTypesEnhancers = [], argsEnhancers: argsEnhancers2 = [] } = projectAnnotations, passedArgTypes = combineParameters(
    projectAnnotations.argTypes,
    componentAnnotations.argTypes,
    storyAnnotations?.argTypes
  );
  if (storyAnnotations) {
    let render = storyAnnotations?.userStoryFn || storyAnnotations?.render || componentAnnotations.render || projectAnnotations.render;
    parameters2.__isArgsStory = render && render.length > 0;
  }
  let passedArgs = {
    ...projectAnnotations.args,
    ...componentAnnotations.args,
    ...storyAnnotations?.args
  }, storyGlobals = {
    ...componentAnnotations.globals,
    ...storyAnnotations?.globals
  }, contextForEnhancers = {
    componentId: componentAnnotations.id,
    title: componentAnnotations.title,
    kind: componentAnnotations.title,
    // Back compat
    id: storyAnnotations?.id || componentAnnotations.id,
    // if there's no story name, we create a fake one since enhancers expect a name
    name: storyAnnotations?.name || "__meta",
    story: storyAnnotations?.name || "__meta",
    // Back compat
    component: componentAnnotations.component,
    subcomponents: componentAnnotations.subcomponents,
    tags,
    parameters: parameters2,
    initialArgs: passedArgs,
    argTypes: passedArgTypes,
    storyGlobals
  };
  contextForEnhancers.argTypes = argTypesEnhancers.reduce(
    (accumulatedArgTypes, enhancer) => enhancer({ ...contextForEnhancers, argTypes: accumulatedArgTypes }),
    contextForEnhancers.argTypes
  );
  let initialArgsBeforeEnhancers = { ...passedArgs };
  contextForEnhancers.initialArgs = [...argsEnhancers2].reduce(
    (accumulatedArgs, enhancer) => ({
      ...accumulatedArgs,
      ...enhancer({
        ...contextForEnhancers,
        initialArgs: accumulatedArgs
      })
    }),
    initialArgsBeforeEnhancers
  );
  let { name, story, ...withoutStoryIdentifiers } = contextForEnhancers;
  return withoutStoryIdentifiers;
}
function prepareContext(context) {
  let { args: unmappedArgs } = context, targetedContext = {
    ...context,
    allArgs: void 0,
    argsByTarget: void 0
  };
  if (scope.FEATURES?.argTypeTargetsV7) {
    let argsByTarget = groupArgsByTarget(context);
    targetedContext = {
      ...context,
      allArgs: context.args,
      argsByTarget,
      args: argsByTarget[UNTARGETED] || {}
    };
  }
  let mappedArgs = Object.entries(targetedContext.args).reduce((acc, [key, val]) => {
    if (!targetedContext.argTypes[key]?.mapping)
      return acc[key] = val, acc;
    let mappingFn = (originalValue) => {
      let mapping = targetedContext.argTypes[key].mapping;
      return mapping && originalValue in mapping ? mapping[originalValue] : originalValue;
    };
    return acc[key] = Array.isArray(val) ? val.map(mappingFn) : mappingFn(val), acc;
  }, {}), includedArgs = Object.entries(mappedArgs).reduce((acc, [key, val]) => {
    let argType = targetedContext.argTypes[key] || {};
    return includeConditionalArg(argType, mappedArgs, targetedContext.globals) && (acc[key] = val), acc;
  }, {});
  return { ...targetedContext, unmappedArgs, args: includedArgs };
}
var inferType = (value, name, visited, cache) => {
  let type = typeof value;
  switch (type) {
    case "boolean":
    case "string":
    case "number":
    case "function":
    case "symbol":
      return { name: type };
    default:
      break;
  }
  if (value) {
    if (cache.has(value))
      return cache.get(value);
    if (visited.has(value))
      return logger.warn(dedent`
        We've detected a cycle in arg '${name}'. Args should be JSON-serializable.

        Consider using the mapping feature or fully custom args:
        - Mapping: https://storybook.js.org/docs/writing-stories/args#mapping-to-complex-arg-values
        - Custom args: https://storybook.js.org/docs/essentials/controls#fully-custom-args
      `), { name: "other", value: "cyclic object" };
    visited.add(value);
    let result;
    return Array.isArray(value) ? result = { name: "array", value: value.length > 0 ? inferType(value[0], name, visited, cache) : { name: "other", value: "unknown" } } : result = { name: "object", value: mapValues(value, (field) => inferType(field, name, visited, cache)) }, visited.delete(value), cache.set(value, result), result;
  }
  return { name: "object", value: {} };
};
var inferArgTypes = (context) => {
  let { id, argTypes: userArgTypes = {}, initialArgs = {} } = context, cache = /* @__PURE__ */ new Map(), argTypes = mapValues(initialArgs, (arg, key) => ({
    name: key,
    type: inferType(arg, `${id}.${key}`, /* @__PURE__ */ new Set(), cache)
  })), userArgTypesNames = mapValues(userArgTypes, (argType, key) => ({
    name: key
  }));
  return combineParameters(argTypes, userArgTypesNames, userArgTypes);
};
inferArgTypes.secondPass = true;
var matches2 = (name, descriptor) => Array.isArray(descriptor) ? descriptor.includes(name) : name.match(descriptor);
var filterArgTypes = (argTypes, include, exclude) => !include && !exclude ? argTypes : argTypes && pickBy(argTypes, (argType, key) => {
  let name = argType.name || key.toString();
  return !!(!include || matches2(name, include)) && (!exclude || !matches2(name, exclude));
});
var inferControl = (argType, name, matchers) => {
  let { type, options } = argType;
  if (type) {
    if (matchers.color && matchers.color.test(name)) {
      let controlType = type.name;
      if (controlType === "string")
        return { control: { type: "color" } };
      controlType !== "enum" && logger.warn(
        `Addon controls: Control of type color only supports string, received "${controlType}" instead`
      );
    }
    if (matchers.date && matchers.date.test(name))
      return { control: { type: "date" } };
    switch (type.name) {
      case "array":
        return { control: { type: "object" } };
      case "boolean":
        return { control: { type: "boolean" } };
      case "string":
        return { control: { type: "text" } };
      case "number":
        return { control: { type: "number" } };
      case "enum": {
        let { value } = type;
        return { control: { type: value?.length <= 5 ? "radio" : "select" }, options: value };
      }
      case "function":
      case "symbol":
        return null;
      default:
        return { control: { type: options ? "select" : "object" } };
    }
  }
};
var inferControls = (context) => {
  let {
    argTypes,
    parameters: { __isArgsStory, controls: { include = null, exclude = null, matchers = {} } = {} }
  } = context;
  if (!__isArgsStory)
    return argTypes;
  let filteredArgTypes = filterArgTypes(argTypes, include, exclude), withControls = mapValues(filteredArgTypes, (argType, name) => argType?.type && inferControl(argType, name.toString(), matchers));
  return combineParameters(withControls, filteredArgTypes);
};
inferControls.secondPass = true;
function normalizeProjectAnnotations({
  argTypes,
  argTypesEnhancers,
  decorators: decorators4,
  loaders: loaders2,
  beforeEach,
  afterEach: afterEach2,
  initialGlobals: initialGlobals5,
  ...annotations
}) {
  return {
    ...argTypes && { argTypes: normalizeInputTypes(argTypes) },
    decorators: normalizeArrays(decorators4),
    loaders: normalizeArrays(loaders2),
    beforeEach: normalizeArrays(beforeEach),
    afterEach: normalizeArrays(afterEach2),
    argTypesEnhancers: [
      ...argTypesEnhancers || [],
      inferArgTypes,
      // There's an architectural decision to be made regarding embedded addons in core:
      //
      // Option 1: Keep embedded addons but ensure consistency by moving addon-specific code
      // (like inferControls) to live alongside the addon code itself. This maintains the
      // concept of core addons while improving code organization.
      //
      // Option 2: Fully integrate these addons into core, potentially moving UI components
      // into the manager and treating them as core features rather than addons. This is a
      // bigger architectural change requiring careful consideration.
      //
      // For now, we're keeping inferControls here as we need time to properly evaluate
      // these options and their implications. Some features (like Angular's cleanArgsDecorator)
      // currently rely on this behavior.
      //
      // TODO: Make an architectural decision on the handling of core addons
      inferControls
    ],
    initialGlobals: initialGlobals5,
    ...annotations
  };
}
var composeBeforeAllHooks = (hooks) => async () => {
  let cleanups2 = [];
  for (let hook of hooks) {
    let cleanup = await hook();
    cleanup && cleanups2.unshift(cleanup);
  }
  return async () => {
    for (let cleanup of cleanups2)
      await cleanup();
  };
};
function composeStepRunners(stepRunners) {
  return async (label, play, playContext) => {
    await stepRunners.reduceRight(
      (innerPlay, stepRunner) => async () => stepRunner(label, innerPlay, playContext),
      async () => play(playContext)
    )();
  };
}
function getField(moduleExportList, field) {
  return moduleExportList.map((xs) => xs.default?.[field] ?? xs[field]).filter(Boolean);
}
function getArrayField(moduleExportList, field, options = {}) {
  return getField(moduleExportList, field).reduce((prev, cur) => {
    let normalized = normalizeArrays(cur);
    return options.reverseFileOrder ? [...normalized, ...prev] : [...prev, ...normalized];
  }, []);
}
function getObjectField(moduleExportList, field) {
  return Object.assign({}, ...getField(moduleExportList, field));
}
function getSingletonField(moduleExportList, field) {
  return getField(moduleExportList, field).pop();
}
function composeConfigs(moduleExportList) {
  let allArgTypeEnhancers = getArrayField(moduleExportList, "argTypesEnhancers"), stepRunners = getField(moduleExportList, "runStep"), beforeAllHooks = getArrayField(moduleExportList, "beforeAll");
  return {
    parameters: combineParameters(...getField(moduleExportList, "parameters")),
    decorators: getArrayField(moduleExportList, "decorators", {
      reverseFileOrder: !(scope.FEATURES?.legacyDecoratorFileOrder ?? false)
    }),
    args: getObjectField(moduleExportList, "args"),
    argsEnhancers: getArrayField(moduleExportList, "argsEnhancers"),
    argTypes: getObjectField(moduleExportList, "argTypes"),
    argTypesEnhancers: [
      ...allArgTypeEnhancers.filter((e) => !e.secondPass),
      ...allArgTypeEnhancers.filter((e) => e.secondPass)
    ],
    initialGlobals: getObjectField(moduleExportList, "initialGlobals"),
    globalTypes: getObjectField(moduleExportList, "globalTypes"),
    loaders: getArrayField(moduleExportList, "loaders"),
    beforeAll: composeBeforeAllHooks(beforeAllHooks),
    beforeEach: getArrayField(moduleExportList, "beforeEach"),
    afterEach: getArrayField(moduleExportList, "afterEach"),
    render: getSingletonField(moduleExportList, "render"),
    renderToCanvas: getSingletonField(moduleExportList, "renderToCanvas"),
    applyDecorators: getSingletonField(moduleExportList, "applyDecorators"),
    runStep: composeStepRunners(stepRunners),
    tags: getArrayField(moduleExportList, "tags"),
    mount: getSingletonField(moduleExportList, "mount"),
    testingLibraryRender: getSingletonField(moduleExportList, "testingLibraryRender")
  };
}
var ReporterAPI = class {
  constructor() {
    this.reports = [];
  }
  async addReport(report) {
    this.reports.push(report);
  }
};
function getCsfFactoryAnnotations(story, meta, projectAnnotations) {
  return isStory(story) ? {
    story: story.input,
    meta: story.meta.input,
    preview: story.meta.preview.composed
  } : { story, meta: isMeta(meta) ? meta.input : meta, preview: projectAnnotations };
}
function setDefaultProjectAnnotations(_defaultProjectAnnotations) {
  globalThis.defaultProjectAnnotations = _defaultProjectAnnotations;
}
var DEFAULT_STORY_TITLE = "ComposedStory";
var DEFAULT_STORY_NAME = "Unnamed Story";
function extractAnnotation(annotation) {
  return annotation ? composeConfigs([annotation]) : {};
}
function setProjectAnnotations(projectAnnotations) {
  let annotations = Array.isArray(projectAnnotations) ? projectAnnotations : [projectAnnotations];
  return globalThis.globalProjectAnnotations = composeConfigs([
    ...getCoreAnnotations(),
    globalThis.defaultProjectAnnotations ?? {},
    composeConfigs(annotations.map(extractAnnotation))
  ]), globalThis.globalProjectAnnotations ?? {};
}
var cleanups = [];
function composeStory(storyAnnotations, componentAnnotations, projectAnnotations, defaultConfig, exportsName) {
  if (storyAnnotations === void 0)
    throw new Error("Expected a story but received undefined.");
  componentAnnotations.title = componentAnnotations.title ?? DEFAULT_STORY_TITLE;
  let normalizedComponentAnnotations = normalizeComponentAnnotations(componentAnnotations), storyName = exportsName || storyAnnotations.storyName || storyAnnotations.story?.name || storyAnnotations.name || DEFAULT_STORY_NAME, normalizedStory = normalizeStory(
    storyName,
    storyAnnotations,
    normalizedComponentAnnotations
  ), normalizedProjectAnnotations = normalizeProjectAnnotations(
    composeConfigs([
      defaultConfig ?? globalThis.globalProjectAnnotations ?? {},
      projectAnnotations ?? {}
    ])
  ), story = prepareStory(
    normalizedStory,
    normalizedComponentAnnotations,
    normalizedProjectAnnotations
  ), globals = {
    ...getValuesFromGlobalTypes(normalizedProjectAnnotations.globalTypes),
    ...normalizedProjectAnnotations.initialGlobals,
    ...story.storyGlobals
  }, reporting = new ReporterAPI(), initializeContext = () => {
    let context = prepareContext({
      hooks: new HooksContext(),
      globals,
      args: { ...story.initialArgs },
      viewMode: "story",
      reporting,
      loaded: {},
      abortSignal: new AbortController().signal,
      step: (label, play2) => story.runStep(label, play2, context),
      canvasElement: null,
      canvas: {},
      userEvent: {},
      globalTypes: normalizedProjectAnnotations.globalTypes,
      ...story,
      context: null,
      mount: null
    });
    return context.parameters.__isPortableStory = true, context.context = context, story.renderToCanvas && (context.renderToCanvas = async () => {
      let unmount = await story.renderToCanvas?.(
        {
          componentId: story.componentId,
          title: story.title,
          id: story.id,
          name: story.name,
          tags: story.tags,
          showMain: () => {
          },
          showError: (error) => {
            throw new Error(`${error.title}
${error.description}`);
          },
          showException: (error) => {
            throw error;
          },
          forceRemount: true,
          storyContext: context,
          storyFn: () => story.unboundStoryFn(context),
          unboundStoryFn: story.unboundStoryFn
        },
        context.canvasElement
      );
      unmount && cleanups.push(unmount);
    }), context.mount = story.mount(context), context;
  }, loadedContext, play = async (extraContext) => {
    let context = initializeContext();
    return context.canvasElement ??= globalThis?.document?.body, loadedContext && (context.loaded = loadedContext.loaded), Object.assign(context, extraContext), story.playFunction(context);
  }, run = (extraContext) => {
    let context = initializeContext();
    return Object.assign(context, extraContext), runStory(story, context);
  }, playFunction = story.playFunction ? play : void 0;
  return Object.assign(
    function(extraArgs) {
      let context = initializeContext();
      return loadedContext && (context.loaded = loadedContext.loaded), context.args = {
        ...context.initialArgs,
        ...extraArgs
      }, story.unboundStoryFn(context);
    },
    {
      id: story.id,
      storyName,
      load: async () => {
        for (let callback of [...cleanups].reverse())
          await callback();
        cleanups.length = 0;
        let context = initializeContext();
        context.loaded = await story.applyLoaders(context), cleanups.push(...(await story.applyBeforeEach(context)).filter(Boolean)), loadedContext = context;
      },
      globals,
      args: story.initialArgs,
      parameters: story.parameters,
      argTypes: story.argTypes,
      play: playFunction,
      run,
      reporting,
      tags: story.tags
    }
  );
}
var defaultComposeStory = (story, component, project, exportsName) => composeStory(story, component, project, {}, exportsName);
function composeStories(storiesImport, globalConfig, composeStoryFn = defaultComposeStory) {
  let { default: metaExport, __esModule, __namedExportsOrder, ...stories } = storiesImport, meta = metaExport;
  return Object.entries(stories).reduce(
    (storiesMap, [exportsName, story]) => {
      let { story: storyAnnotations, meta: componentAnnotations } = getCsfFactoryAnnotations(story);
      return !meta && componentAnnotations && (meta = componentAnnotations), isExportStory(exportsName, meta) ? Object.assign(storiesMap, {
        [exportsName]: composeStoryFn(storyAnnotations, meta, globalConfig, exportsName)
      }) : storiesMap;
    },
    {}
  );
}
function createPlaywrightTest(baseTest) {
  return baseTest.extend({
    mount: async ({ mount, page }, use) => {
      await use(async (storyRef, ...restArgs) => {
        if (!("__pw_type" in storyRef) || "__pw_type" in storyRef && storyRef.__pw_type !== "jsx")
          throw new Error(dedent`
              Portable stories in Playwright CT only work when referencing JSX elements.
              Please use JSX format for your components such as:

              instead of:
              await mount(MyComponent, { props: { foo: 'bar' } })

              do:
              await mount(<MyComponent foo="bar"/>)

              More info: https://storybook.js.org/docs/api/portable-stories/portable-stories-playwright?ref=error
            `);
        let { props, ...storyRefWithoutProps } = storyRef;
        await page.evaluate(async (wrappedStoryRef) => {
          let unwrappedStoryRef = await globalThis.__pwUnwrapObject?.(wrappedStoryRef);
          return ("__pw_type" in unwrappedStoryRef ? unwrappedStoryRef.type : unwrappedStoryRef)?.load?.();
        }, storyRefWithoutProps);
        let mountResult = await mount(storyRef, ...restArgs);
        return await page.evaluate(async (wrappedStoryRef) => {
          let unwrappedStoryRef = await globalThis.__pwUnwrapObject?.(wrappedStoryRef), story = "__pw_type" in unwrappedStoryRef ? unwrappedStoryRef.type : unwrappedStoryRef, canvasElement = document.querySelector("#root");
          return story?.play?.({ canvasElement });
        }, storyRefWithoutProps), mountResult;
      });
    }
  });
}
async function runStory(story, context) {
  for (let callback of [...cleanups].reverse())
    await callback();
  if (cleanups.length = 0, !context.canvasElement) {
    let container = document.createElement("div");
    globalThis?.document?.body?.appendChild(container), context.canvasElement = container, cleanups.push(() => {
      globalThis?.document?.body?.contains(container) && globalThis?.document?.body?.removeChild(container);
    });
  }
  if (context.loaded = await story.applyLoaders(context), context.abortSignal.aborted)
    return;
  cleanups.push(...(await story.applyBeforeEach(context)).filter(Boolean));
  let playFunction = story.playFunction, isMountDestructured = story.usesMount;
  if (isMountDestructured || await context.mount(), context.abortSignal.aborted)
    return;
  playFunction && (isMountDestructured || (context.mount = async () => {
    throw new MountMustBeDestructuredError({ playFunction: playFunction.toString() });
  }), await playFunction(context));
  let cleanUp;
  isTestEnvironment() ? cleanUp = pauseAnimations() : await waitForAnimations(context.abortSignal), await story.applyAfterEach(context), await cleanUp?.();
}
var CSF_CACHE_SIZE = 1e3;
var STORY_CACHE_SIZE = 1e4;
var StoryStore = class {
  constructor(storyIndex, importFn, projectAnnotations) {
    this.importFn = importFn;
    this.storyIndex = new StoryIndexStore(storyIndex), this.projectAnnotations = normalizeProjectAnnotations(
      composeConfigs([...getCoreAnnotations(), projectAnnotations])
    );
    let { initialGlobals: initialGlobals5, globalTypes } = this.projectAnnotations;
    this.args = new ArgsStore(), this.userGlobals = new GlobalsStore({ globals: initialGlobals5, globalTypes }), this.hooks = {}, this.cleanupCallbacks = {}, this.processCSFFileWithCache = (0, import_memoizerific2.default)(CSF_CACHE_SIZE)(processCSFFile), this.prepareMetaWithCache = (0, import_memoizerific2.default)(CSF_CACHE_SIZE)(prepareMeta), this.prepareStoryWithCache = (0, import_memoizerific2.default)(STORY_CACHE_SIZE)(prepareStory);
  }
  setProjectAnnotations(projectAnnotations) {
    this.projectAnnotations = normalizeProjectAnnotations(projectAnnotations);
    let { initialGlobals: initialGlobals5, globalTypes } = projectAnnotations;
    this.userGlobals.set({ globals: initialGlobals5, globalTypes });
  }
  // This means that one of the CSF files has changed.
  // If the `importFn` has changed, we will invalidate both caches.
  // If the `storyIndex` data has changed, we may or may not invalidate the caches, depending
  // on whether we've loaded the relevant files yet.
  async onStoriesChanged({
    importFn,
    storyIndex
  }) {
    importFn && (this.importFn = importFn), storyIndex && (this.storyIndex.entries = storyIndex.entries), this.cachedCSFFiles && await this.cacheAllCSFFiles();
  }
  // Get an entry from the index, waiting on initialization if necessary
  async storyIdToEntry(storyId) {
    return this.storyIndex.storyIdToEntry(storyId);
  }
  // To load a single CSF file to service a story we need to look up the importPath in the index
  async loadCSFFileByStoryId(storyId) {
    let { importPath, title } = this.storyIndex.storyIdToEntry(storyId), moduleExports = await this.importFn(importPath);
    return this.processCSFFileWithCache(moduleExports, importPath, title);
  }
  async loadAllCSFFiles() {
    let importPaths = {};
    return Object.entries(this.storyIndex.entries).forEach(([storyId, { importPath }]) => {
      importPaths[importPath] = storyId;
    }), (await Promise.all(
      Object.entries(importPaths).map(async ([importPath, storyId]) => ({
        importPath,
        csfFile: await this.loadCSFFileByStoryId(storyId)
      }))
    )).reduce(
      (acc, { importPath, csfFile }) => (acc[importPath] = csfFile, acc),
      {}
    );
  }
  async cacheAllCSFFiles() {
    this.cachedCSFFiles = await this.loadAllCSFFiles();
  }
  preparedMetaFromCSFFile({ csfFile }) {
    let componentAnnotations = csfFile.meta;
    return this.prepareMetaWithCache(
      componentAnnotations,
      this.projectAnnotations,
      csfFile.moduleExports.default
    );
  }
  // Load the CSF file for a story and prepare the story from it and the project annotations.
  async loadStory({ storyId }) {
    let csfFile = await this.loadCSFFileByStoryId(storyId);
    return this.storyFromCSFFile({ storyId, csfFile });
  }
  // This function is synchronous for convenience -- often times if you have a CSF file already
  // it is easier not to have to await `loadStory`.
  storyFromCSFFile({
    storyId,
    csfFile
  }) {
    let storyAnnotations = csfFile.stories[storyId];
    if (!storyAnnotations)
      throw new MissingStoryFromCsfFileError({ storyId });
    let componentAnnotations = csfFile.meta, story = this.prepareStoryWithCache(
      storyAnnotations,
      componentAnnotations,
      csfFile.projectAnnotations ?? this.projectAnnotations
    );
    return this.args.setInitial(story), this.hooks[story.id] = this.hooks[story.id] || new HooksContext(), story;
  }
  // If we have a CSF file we can get all the stories from it synchronously
  componentStoriesFromCSFFile({
    csfFile
  }) {
    return Object.keys(this.storyIndex.entries).filter((storyId) => !!csfFile.stories[storyId]).map((storyId) => this.storyFromCSFFile({ storyId, csfFile }));
  }
  async loadEntry(id) {
    let entry = await this.storyIdToEntry(id), storyImports = entry.type === "docs" ? entry.storiesImports : [], [entryExports, ...csfFiles] = await Promise.all([
      this.importFn(entry.importPath),
      ...storyImports.map((storyImportPath) => {
        let firstStoryEntry = this.storyIndex.importPathToEntry(storyImportPath);
        return this.loadCSFFileByStoryId(firstStoryEntry.id);
      })
    ]);
    return { entryExports, csfFiles };
  }
  // A prepared story does not include args, globals or hooks. These are stored in the story store
  // and updated separately to the (immutable) story.
  getStoryContext(story, { forceInitialArgs = false } = {}) {
    let userGlobals = this.userGlobals.get(), { initialGlobals: initialGlobals5 } = this.userGlobals, reporting = new ReporterAPI();
    return prepareContext({
      ...story,
      args: forceInitialArgs ? story.initialArgs : this.args.get(story.id),
      initialGlobals: initialGlobals5,
      globalTypes: this.projectAnnotations.globalTypes,
      userGlobals,
      reporting,
      globals: {
        ...userGlobals,
        ...story.storyGlobals
      },
      hooks: this.hooks[story.id]
    });
  }
  addCleanupCallbacks(story, ...callbacks) {
    this.cleanupCallbacks[story.id] = (this.cleanupCallbacks[story.id] || []).concat(callbacks);
  }
  async cleanupStory(story) {
    this.hooks[story.id].clean();
    let callbacks = this.cleanupCallbacks[story.id];
    if (callbacks)
      for (let callback of [...callbacks].reverse())
        await callback();
    delete this.cleanupCallbacks[story.id];
  }
  extract(options = { includeDocsOnly: false }) {
    let { cachedCSFFiles } = this;
    if (console.log("extract: extracting stories", cachedCSFFiles), !cachedCSFFiles)
      throw new CalledExtractOnStoreError();
    let stories = Object.entries(this.storyIndex.entries).reduce(
      (acc, [storyId, entry]) => {
        if (entry.type === "docs")
          return acc;
        let csfFile = cachedCSFFiles[entry.importPath], story = this.storyFromCSFFile({ storyId, csfFile });
        return !options.includeDocsOnly && story.parameters.docsOnly || (acc[storyId] = Object.entries(story).reduce(
          (storyAcc, [key, value]) => key === "story" && entry.subtype === "test" ? { ...storyAcc, story: entry.parentName } : key === "moduleExport" || typeof value == "function" ? storyAcc : Array.isArray(value) ? Object.assign(storyAcc, { [key]: value.slice().sort() }) : Object.assign(storyAcc, { [key]: value }),
          {
            args: story.initialArgs,
            globals: {
              ...this.userGlobals.initialGlobals,
              ...this.userGlobals.globals,
              ...story.storyGlobals
            },
            storyId: entry.parent ? entry.parent : storyId
          }
        )), acc;
      },
      {}
    );
    return console.log("extract: stories", stories), stories;
  }
};
function slash(path) {
  return path.startsWith("\\\\?\\") ? path : path.replace(/\\/g, "/");
}
var sanitize2 = (parts) => {
  if (parts.length === 0)
    return parts;
  let last = parts[parts.length - 1], lastStripped = last?.replace(/(?:[.](?:story|stories))?([.][^.]+)$/i, "");
  if (parts.length === 1)
    return [lastStripped];
  let nextToLast = parts[parts.length - 2];
  return lastStripped && nextToLast && lastStripped.toLowerCase() === nextToLast.toLowerCase() ? [...parts.slice(0, -2), lastStripped] : lastStripped && (/^(story|stories)([.][^.]+)$/i.test(last) || /^index$/i.test(lastStripped)) ? parts.slice(0, -1) : [...parts.slice(0, -1), lastStripped];
};
function pathJoin(paths) {
  return paths.flatMap((p) => p.split("/")).filter(Boolean).join("/");
}
var userOrAutoTitleFromSpecifier = (fileName, entry, userTitle) => {
  let { directory, importPathMatcher, titlePrefix = "" } = entry || {};
  typeof fileName == "number" && once.warn(dedent`
      CSF Auto-title received a numeric fileName. This typically happens when
      webpack is mis-configured in production mode. To force webpack to produce
      filenames, set optimization.moduleIds = "named" in your webpack config.
    `);
  let normalizedFileName = slash(String(fileName));
  if (importPathMatcher.exec(normalizedFileName)) {
    if (!userTitle) {
      let suffix = normalizedFileName.replace(directory, ""), parts = pathJoin([titlePrefix, suffix]).split("/");
      return parts = sanitize2(parts), parts.join("/");
    }
    return titlePrefix ? pathJoin([titlePrefix, userTitle]) : userTitle;
  }
};
var userOrAutoTitle = (fileName, storiesEntries, userTitle) => {
  for (let i = 0; i < storiesEntries.length; i += 1) {
    let title = userOrAutoTitleFromSpecifier(fileName, storiesEntries[i], userTitle);
    if (title)
      return title;
  }
  return userTitle || void 0;
};
var STORY_KIND_PATH_SEPARATOR = /\s*\/\s*/;
var storySort = (options = {}) => (a, b) => {
  if (a.title === b.title && !options.includeNames)
    return 0;
  let method = options.method || "configure", order = options.order || [], storyTitleA = a.title.trim().split(STORY_KIND_PATH_SEPARATOR), storyTitleB = b.title.trim().split(STORY_KIND_PATH_SEPARATOR);
  options.includeNames && (storyTitleA.push(a.name), storyTitleB.push(b.name));
  let depth = 0;
  for (; storyTitleA[depth] || storyTitleB[depth]; ) {
    if (!storyTitleA[depth])
      return -1;
    if (!storyTitleB[depth])
      return 1;
    let nameA = storyTitleA[depth], nameB = storyTitleB[depth];
    if (nameA !== nameB) {
      let indexA = order.indexOf(nameA), indexB = order.indexOf(nameB), indexWildcard = order.indexOf("*");
      return indexA !== -1 || indexB !== -1 ? (indexA === -1 && (indexWildcard !== -1 ? indexA = indexWildcard : indexA = order.length), indexB === -1 && (indexWildcard !== -1 ? indexB = indexWildcard : indexB = order.length), indexA - indexB) : method === "configure" ? 0 : nameA.localeCompare(nameB, options.locales ? options.locales : void 0, {
        numeric: true,
        sensitivity: "accent"
      });
    }
    let index = order.indexOf(nameA);
    index === -1 && (index = order.indexOf("*")), order = index !== -1 && Array.isArray(order[index + 1]) ? order[index + 1] : [], depth += 1;
  }
  return 0;
};
var sortStoriesCommon = (stories, storySortParameter, fileNameOrder) => {
  if (storySortParameter) {
    let sortFn;
    typeof storySortParameter == "function" ? sortFn = storySortParameter : sortFn = storySort(storySortParameter), stories.sort(sortFn);
  } else
    stories.sort(
      (s1, s2) => fileNameOrder.indexOf(s1.importPath) - fileNameOrder.indexOf(s2.importPath)
    );
  return stories;
};
var sortStoriesV7 = (stories, storySortParameter, fileNameOrder) => {
  try {
    return sortStoriesCommon(stories, storySortParameter, fileNameOrder);
  } catch (err) {
    throw new Error(dedent`
    Error sorting stories with sort parameter ${storySortParameter}:

    > ${err.message}

    Are you using a V6-style sort function in V7 mode?

    More info: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#v7-style-story-sort
  `);
  }
};
var PREPARE_ABORTED = new Error("prepareAborted");
var { AbortController: AbortController2 } = globalThis;
function serializeError(error) {
  try {
    let { name = "Error", message = String(error), stack } = error;
    return { name, message, stack };
  } catch {
    return { name: "Error", message: String(error) };
  }
}
var StoryRender = class {
  constructor(channel, store, renderToScreen, callbacks, id, viewMode, renderOptions = { autoplay: true, forceInitialArgs: false }, story) {
    this.channel = channel;
    this.store = store;
    this.renderToScreen = renderToScreen;
    this.callbacks = callbacks;
    this.id = id;
    this.viewMode = viewMode;
    this.renderOptions = renderOptions;
    this.type = "story";
    this.notYetRendered = true;
    this.rerenderEnqueued = false;
    this.disableKeyListeners = false;
    this.teardownRender = () => {
    };
    this.torndown = false;
    this.abortController = new AbortController2(), this.renderId = Date.now(), story && (this.story = story, this.phase = "preparing");
  }
  async runPhase(signal, phase, phaseFn) {
    this.phase = phase, this.channel.emit(STORY_RENDER_PHASE_CHANGED, {
      newPhase: this.phase,
      renderId: this.renderId,
      storyId: this.id
    }), phaseFn && (await phaseFn(), this.checkIfAborted(signal));
  }
  checkIfAborted(signal) {
    return signal.aborted && !["finished", "aborted", "errored"].includes(this.phase) && (this.phase = "aborted", this.channel.emit(STORY_RENDER_PHASE_CHANGED, {
      newPhase: this.phase,
      renderId: this.renderId,
      storyId: this.id
    })), signal.aborted;
  }
  async prepare() {
    if (await this.runPhase(this.abortController.signal, "preparing", async () => {
      this.story = await this.store.loadStory({ storyId: this.id });
    }), this.abortController.signal.aborted)
      throw await this.store.cleanupStory(this.story), PREPARE_ABORTED;
  }
  // The two story "renders" are equal and have both loaded the same story
  isEqual(other) {
    return !!(this.id === other.id && this.story && this.story === other.story);
  }
  isPreparing() {
    return ["preparing"].includes(this.phase);
  }
  isPending() {
    return ["loading", "beforeEach", "rendering", "playing", "afterEach"].includes(
      this.phase
    );
  }
  async renderToElement(canvasElement) {
    return this.canvasElement = canvasElement, this.render({ initial: true, forceRemount: true });
  }
  storyContext() {
    if (!this.story)
      throw new Error("Cannot call storyContext before preparing");
    let { forceInitialArgs } = this.renderOptions;
    return this.store.getStoryContext(this.story, { forceInitialArgs });
  }
  async render({
    initial = false,
    forceRemount = false
  } = {}) {
    let { canvasElement } = this;
    if (!this.story)
      throw new Error("cannot render when not prepared");
    let story = this.story;
    if (!canvasElement)
      throw new Error("cannot render when canvasElement is unset");
    let {
      id,
      componentId,
      title,
      name,
      tags,
      applyLoaders,
      applyBeforeEach,
      applyAfterEach,
      unboundStoryFn,
      playFunction,
      runStep
    } = story;
    forceRemount && !initial && (this.cancelRender(), this.abortController = new AbortController2());
    let abortSignal = this.abortController.signal, mounted = false, isMountDestructured = story.usesMount;
    try {
      let context = {
        ...this.storyContext(),
        viewMode: this.viewMode,
        abortSignal,
        canvasElement,
        loaded: {},
        step: (label, play) => runStep(label, play, context),
        context: null,
        canvas: {},
        userEvent: {},
        renderToCanvas: async () => {
          let teardown = await this.renderToScreen(renderContext, canvasElement);
          this.teardownRender = teardown || (() => {
          }), mounted = true;
        },
        // The story provides (set in a renderer) a mount function that is a higher order function
        // (context) => (...args) => Canvas
        //
        // Before assigning it to the context, we resolve the context dependency,
        // so that a user can just call it as await mount(...args) in their play function.
        mount: async (...args) => {
          this.callbacks.showStoryDuringRender?.();
          let mountReturn = null;
          return await this.runPhase(abortSignal, "rendering", async () => {
            mountReturn = await story.mount(context)(...args);
          }), isMountDestructured && await this.runPhase(abortSignal, "playing"), mountReturn;
        }
      };
      context.context = context;
      let renderContext = {
        componentId,
        title,
        kind: title,
        id,
        name,
        story: name,
        tags,
        ...this.callbacks,
        showError: (error) => (this.phase = "errored", this.callbacks.showError(error)),
        showException: (error) => (this.phase = "errored", this.callbacks.showException(error)),
        forceRemount: forceRemount || this.notYetRendered,
        storyContext: context,
        storyFn: () => unboundStoryFn(context),
        unboundStoryFn
      };
      if (await this.runPhase(abortSignal, "loading", async () => {
        context.loaded = await applyLoaders(context);
      }), abortSignal.aborted)
        return;
      let cleanupCallbacks = await applyBeforeEach(context);
      if (this.store.addCleanupCallbacks(story, ...cleanupCallbacks), this.checkIfAborted(abortSignal) || (!mounted && !isMountDestructured && await context.mount(), this.notYetRendered = false, abortSignal.aborted))
        return;
      let ignoreUnhandledErrors = this.story.parameters?.test?.dangerouslyIgnoreUnhandledErrors === true, unhandledErrors = /* @__PURE__ */ new Set(), onError = (event) => {
        event.error && unhandledErrors.add(event.error);
      }, onUnhandledRejection = (event) => {
        event.reason && unhandledErrors.add(event.reason);
      };
      if (this.renderOptions.autoplay && forceRemount && playFunction && this.phase !== "errored") {
        window?.addEventListener?.("error", onError), window?.addEventListener?.("unhandledrejection", onUnhandledRejection), this.disableKeyListeners = true;
        try {
          if (isMountDestructured ? await playFunction(context) : (context.mount = async () => {
            throw new MountMustBeDestructuredError({ playFunction: playFunction.toString() });
          }, await this.runPhase(abortSignal, "playing", async () => playFunction(context))), !mounted)
            throw new NoStoryMountedError();
          this.checkIfAborted(abortSignal), !ignoreUnhandledErrors && unhandledErrors.size > 0 ? await this.runPhase(abortSignal, "errored") : await this.runPhase(abortSignal, "played");
        } catch (error) {
          if (this.callbacks.showStoryDuringRender?.(), await this.runPhase(abortSignal, "errored", async () => {
            this.channel.emit(PLAY_FUNCTION_THREW_EXCEPTION, serializeError(error));
          }), this.story.parameters.throwPlayFunctionExceptions !== false)
            throw error;
          console.error(error);
        }
        if (!ignoreUnhandledErrors && unhandledErrors.size > 0 && this.channel.emit(
          UNHANDLED_ERRORS_WHILE_PLAYING,
          Array.from(unhandledErrors).map(serializeError)
        ), this.disableKeyListeners = false, window?.removeEventListener?.("unhandledrejection", onUnhandledRejection), window?.removeEventListener?.("error", onError), abortSignal.aborted)
          return;
      }
      await this.runPhase(abortSignal, "completing", async () => {
        isTestEnvironment() ? this.store.addCleanupCallbacks(story, pauseAnimations()) : await waitForAnimations(abortSignal);
      }), await this.runPhase(abortSignal, "completed", async () => {
        this.channel.emit(STORY_RENDERED, id);
      }), this.phase !== "errored" && await this.runPhase(abortSignal, "afterEach", async () => {
        await applyAfterEach(context);
      });
      let hasUnhandledErrors = !ignoreUnhandledErrors && unhandledErrors.size > 0, hasSomeReportsFailed = context.reporting.reports.some(
        (report) => report.status === "failed"
      ), hasStoryErrored = hasUnhandledErrors || hasSomeReportsFailed;
      await this.runPhase(
        abortSignal,
        "finished",
        async () => this.channel.emit(STORY_FINISHED, {
          storyId: id,
          status: hasStoryErrored ? "error" : "success",
          reporters: context.reporting.reports
        })
      );
    } catch (err) {
      this.phase = "errored", this.callbacks.showException(err), await this.runPhase(
        abortSignal,
        "finished",
        async () => this.channel.emit(STORY_FINISHED, {
          storyId: id,
          status: "error",
          reporters: []
        })
      );
    }
    this.rerenderEnqueued && (this.rerenderEnqueued = false, this.render());
  }
  /**
   * Rerender the story. If the story is currently pending (loading/rendering), the rerender will be
   * enqueued, and will be executed after the current render is completed. Rerendering while playing
   * will not be enqueued, and will be executed immediately, to support rendering args changes while
   * playing.
   */
  async rerender() {
    if (this.isPending() && this.phase !== "playing")
      this.rerenderEnqueued = true;
    else
      return this.render();
  }
  async remount() {
    return await this.teardown(), this.render({ forceRemount: true });
  }
  // If the story is torn down (either a new story is rendered or the docs page removes it)
  // we need to consider the fact that the initial render may not be finished
  // (possibly the loaders or the play function are still running). We use the controller
  // as a method to abort them, ASAP, but this is not foolproof as we cannot control what
  // happens inside the user's code.
  cancelRender() {
    this.abortController.abort();
  }
  cancelPlayFunction() {
    this.phase === "playing" && (this.abortController.abort(), this.runPhase(this.abortController.signal, "aborted"));
  }
  async teardown() {
    this.torndown = true, this.cancelRender(), this.story && await this.store.cleanupStory(this.story);
    for (let i = 0; i < 3; i += 1) {
      if (!this.isPending()) {
        await this.teardownRender();
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    window?.location?.reload?.(), await new Promise(() => {
    });
  }
};
var { fetch } = scope;
var STORY_INDEX_PATH = "./index.json";
var Preview = class {
  constructor(importFn, getProjectAnnotations, channel = addons.getChannel(), shouldInitialize = true) {
    this.importFn = importFn;
    this.getProjectAnnotations = getProjectAnnotations;
    this.channel = channel;
    this.storyRenders = [];
    this.storeInitializationPromise = new Promise((resolve, reject) => {
      this.resolveStoreInitializationPromise = resolve, this.rejectStoreInitializationPromise = reject;
    }), shouldInitialize && this.initialize();
  }
  // Create a proxy object for `__STORYBOOK_STORY_STORE__` and `__STORYBOOK_PREVIEW__.storyStore`
  // That proxies through to the store once ready, and errors beforehand. This means we can set
  // `__STORYBOOK_STORY_STORE__ = __STORYBOOK_PREVIEW__.storyStore` without having to wait, and
  // similarly integrators can access the `storyStore` on the preview at any time, although
  // it is considered deprecated and we will no longer allow access in 9.0
  get storyStore() {
    return new Proxy(
      {},
      {
        get: (_, method) => {
          if (this.storyStoreValue)
            return deprecate("Accessing the Story Store is deprecated and will be removed in 9.0"), this.storyStoreValue[method];
          throw new StoryStoreAccessedBeforeInitializationError();
        }
      }
    );
  }
  // INITIALIZATION
  async initialize() {
    this.setupListeners();
    try {
      let projectAnnotations = await this.getProjectAnnotationsOrRenderError();
      await this.runBeforeAllHook(projectAnnotations), await this.initializeWithProjectAnnotations(projectAnnotations);
      let userAgent = globalThis?.navigator?.userAgent;
      await this.channel.emit(PREVIEW_INITIALIZED, { userAgent });
    } catch (err) {
      this.rejectStoreInitializationPromise(err);
    }
  }
  ready() {
    return this.storeInitializationPromise;
  }
  setupListeners() {
    this.channel.on(STORY_INDEX_INVALIDATED, this.onStoryIndexChanged.bind(this)), this.channel.on(UPDATE_GLOBALS, this.onUpdateGlobals.bind(this)), this.channel.on(UPDATE_STORY_ARGS, this.onUpdateArgs.bind(this)), this.channel.on(ARGTYPES_INFO_REQUEST, this.onRequestArgTypesInfo.bind(this)), this.channel.on(RESET_STORY_ARGS, this.onResetArgs.bind(this)), this.channel.on(FORCE_RE_RENDER, this.onForceReRender.bind(this)), this.channel.on(FORCE_REMOUNT, this.onForceRemount.bind(this)), this.channel.on(STORY_HOT_UPDATED, this.onStoryHotUpdated.bind(this));
  }
  async getProjectAnnotationsOrRenderError() {
    try {
      let projectAnnotations = await this.getProjectAnnotations();
      if (this.renderToCanvas = projectAnnotations.renderToCanvas, !this.renderToCanvas)
        throw new MissingRenderToCanvasError();
      return projectAnnotations;
    } catch (err) {
      throw this.renderPreviewEntryError("Error reading preview.js:", err), err;
    }
  }
  // If initialization gets as far as project annotations, this function runs.
  async initializeWithProjectAnnotations(projectAnnotations) {
    this.projectAnnotationsBeforeInitialization = projectAnnotations;
    try {
      let storyIndex = await this.getStoryIndexFromServer();
      return this.initializeWithStoryIndex(storyIndex);
    } catch (err) {
      throw this.renderPreviewEntryError("Error loading story index:", err), err;
    }
  }
  async runBeforeAllHook(projectAnnotations) {
    try {
      await this.beforeAllCleanup?.(), this.beforeAllCleanup = await projectAnnotations.beforeAll?.();
    } catch (err) {
      throw this.renderPreviewEntryError("Error in beforeAll hook:", err), err;
    }
  }
  async getStoryIndexFromServer() {
    let result = await fetch(STORY_INDEX_PATH);
    if (result.status === 200)
      return result.json();
    throw new StoryIndexFetchError({ text: await result.text() });
  }
  // If initialization gets as far as the story index, this function runs.
  initializeWithStoryIndex(storyIndex) {
    if (!this.projectAnnotationsBeforeInitialization)
      throw new Error("Cannot call initializeWithStoryIndex until project annotations resolve");
    this.storyStoreValue = new StoryStore(
      storyIndex,
      this.importFn,
      this.projectAnnotationsBeforeInitialization
    ), delete this.projectAnnotationsBeforeInitialization, this.setInitialGlobals(), this.resolveStoreInitializationPromise();
  }
  async setInitialGlobals() {
    this.emitGlobals();
  }
  emitGlobals() {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "emitGlobals" });
    let payload = {
      globals: this.storyStoreValue.userGlobals.get() || {},
      globalTypes: this.storyStoreValue.projectAnnotations.globalTypes || {}
    };
    this.channel.emit(SET_GLOBALS, payload);
  }
  // EVENT HANDLERS
  // This happens when a config file gets reloaded
  async onGetProjectAnnotationsChanged({
    getProjectAnnotations
  }) {
    delete this.previewEntryError, this.getProjectAnnotations = getProjectAnnotations;
    let projectAnnotations = await this.getProjectAnnotationsOrRenderError();
    if (await this.runBeforeAllHook(projectAnnotations), !this.storyStoreValue) {
      await this.initializeWithProjectAnnotations(projectAnnotations);
      return;
    }
    this.storyStoreValue.setProjectAnnotations(projectAnnotations), this.emitGlobals();
  }
  async onStoryIndexChanged() {
    if (delete this.previewEntryError, !(!this.storyStoreValue && !this.projectAnnotationsBeforeInitialization))
      try {
        let storyIndex = await this.getStoryIndexFromServer();
        if (this.projectAnnotationsBeforeInitialization) {
          this.initializeWithStoryIndex(storyIndex);
          return;
        }
        await this.onStoriesChanged({ storyIndex });
      } catch (err) {
        throw this.renderPreviewEntryError("Error loading story index:", err), err;
      }
  }
  // This happens when a glob gets HMR-ed
  async onStoriesChanged({
    importFn,
    storyIndex
  }) {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "onStoriesChanged" });
    await this.storyStoreValue.onStoriesChanged({ importFn, storyIndex });
  }
  async onUpdateGlobals({
    globals: updatedGlobals,
    currentStory
  }) {
    if (this.storyStoreValue || await this.storeInitializationPromise, !this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "onUpdateGlobals" });
    if (this.storyStoreValue.userGlobals.update(updatedGlobals), currentStory) {
      let { initialGlobals: initialGlobals5, storyGlobals, userGlobals, globals } = this.storyStoreValue.getStoryContext(currentStory);
      this.channel.emit(GLOBALS_UPDATED, {
        initialGlobals: initialGlobals5,
        userGlobals,
        storyGlobals,
        globals
      });
    } else {
      let { initialGlobals: initialGlobals5, globals } = this.storyStoreValue.userGlobals;
      this.channel.emit(GLOBALS_UPDATED, {
        initialGlobals: initialGlobals5,
        userGlobals: globals,
        storyGlobals: {},
        globals
      });
    }
    await Promise.all(this.storyRenders.map((r) => r.rerender()));
  }
  async onUpdateArgs({ storyId, updatedArgs }) {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "onUpdateArgs" });
    this.storyStoreValue.args.update(storyId, updatedArgs), await Promise.all(
      this.storyRenders.filter((r) => r.id === storyId && !r.renderOptions.forceInitialArgs).map(
        (r) => (
          // We only run the play function, with in a force remount.
          // But when mount is destructured, the rendering happens inside of the play function.
          r.story && r.story.usesMount ? r.remount() : r.rerender()
        )
      )
    ), this.channel.emit(STORY_ARGS_UPDATED, {
      storyId,
      args: this.storyStoreValue.args.get(storyId)
    });
  }
  async onRequestArgTypesInfo({ id, payload }) {
    try {
      await this.storeInitializationPromise;
      let story = await this.storyStoreValue?.loadStory(payload);
      this.channel.emit(ARGTYPES_INFO_RESPONSE, {
        id,
        success: true,
        payload: { argTypes: story?.argTypes || {} },
        error: null
      });
    } catch (e) {
      this.channel.emit(ARGTYPES_INFO_RESPONSE, {
        id,
        success: false,
        error: e?.message
      });
    }
  }
  async onResetArgs({ storyId, argNames }) {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "onResetArgs" });
    let story = this.storyRenders.find((r) => r.id === storyId)?.story || await this.storyStoreValue.loadStory({ storyId }), updatedArgs = (argNames || [
      .../* @__PURE__ */ new Set([
        ...Object.keys(story.initialArgs),
        ...Object.keys(this.storyStoreValue.args.get(storyId))
      ])
    ]).reduce((acc, argName) => (acc[argName] = story.initialArgs[argName], acc), {});
    await this.onUpdateArgs({ storyId, updatedArgs });
  }
  // ForceReRender does not include a story id, so we simply must
  // re-render all stories in case they are relevant
  async onForceReRender() {
    await Promise.all(this.storyRenders.map((r) => r.rerender()));
  }
  async onForceRemount({ storyId }) {
    await Promise.all(this.storyRenders.filter((r) => r.id === storyId).map((r) => r.remount()));
  }
  async onStoryHotUpdated() {
    await Promise.all(this.storyRenders.map((r) => r.cancelPlayFunction()));
  }
  // Used by docs to render a story to a given element
  // Note this short-circuits the `prepare()` phase of the StoryRender,
  // main to be consistent with the previous behaviour. In the future,
  // we will change it to go ahead and load the story, which will end up being
  // "instant", although async.
  renderStoryToElement(story, element, callbacks, options) {
    if (!this.renderToCanvas || !this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({
        methodName: "renderStoryToElement"
      });
    let render = new StoryRender(
      this.channel,
      this.storyStoreValue,
      this.renderToCanvas,
      callbacks,
      story.id,
      "docs",
      options,
      story
    );
    return render.renderToElement(element), this.storyRenders.push(render), async () => {
      await this.teardownRender(render);
    };
  }
  async teardownRender(render, { viewModeChanged } = {}) {
    this.storyRenders = this.storyRenders.filter((r) => r !== render), await render?.teardown?.({ viewModeChanged });
  }
  // API
  async loadStory({ storyId }) {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "loadStory" });
    return this.storyStoreValue.loadStory({ storyId });
  }
  getStoryContext(story, { forceInitialArgs = false } = {}) {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "getStoryContext" });
    return this.storyStoreValue.getStoryContext(story, { forceInitialArgs });
  }
  async extract(options) {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "extract" });
    if (this.previewEntryError)
      throw this.previewEntryError;
    return await this.storyStoreValue.cacheAllCSFFiles(), this.storyStoreValue.extract(options);
  }
  // UTILITIES
  renderPreviewEntryError(reason, err) {
    this.previewEntryError = err, logger.error(reason), logger.error(err), this.channel.emit(CONFIG_ERROR, err);
  }
};
var DocsContext = class {
  constructor(channel, store, renderStoryToElement, csfFiles) {
    this.channel = channel;
    this.store = store;
    this.renderStoryToElement = renderStoryToElement;
    this.storyIdByName = (storyName) => {
      let storyId = this.nameToStoryId.get(storyName);
      if (storyId)
        return storyId;
      throw new Error(`No story found with that name: ${storyName}`);
    };
    this.componentStories = () => this.componentStoriesValue;
    this.componentStoriesFromCSFFile = (csfFile) => this.store.componentStoriesFromCSFFile({ csfFile });
    this.storyById = (storyId) => {
      if (!storyId) {
        if (!this.primaryStory)
          throw new Error(
            "No primary story defined for docs entry. Did you forget to use `<Meta>`?"
          );
        return this.primaryStory;
      }
      let csfFile = this.storyIdToCSFFile.get(storyId);
      if (!csfFile)
        throw new Error(`Called \`storyById\` for story that was never loaded: ${storyId}`);
      return this.store.storyFromCSFFile({ storyId, csfFile });
    };
    this.getStoryContext = (story) => ({
      ...this.store.getStoryContext(story),
      loaded: {},
      viewMode: "docs"
    });
    this.loadStory = (id) => this.store.loadStory({ storyId: id });
    this.componentStoriesValue = [], this.storyIdToCSFFile = /* @__PURE__ */ new Map(), this.exportToStory = /* @__PURE__ */ new Map(), this.exportsToCSFFile = /* @__PURE__ */ new Map(), this.nameToStoryId = /* @__PURE__ */ new Map(), this.attachedCSFFiles = /* @__PURE__ */ new Set(), csfFiles.forEach((csfFile, index) => {
      this.referenceCSFFile(csfFile);
    });
  }
  // This docs entry references this CSF file and can synchronously load the stories, as well
  // as reference them by module export. If the CSF is part of the "component" stories, they
  // can also be referenced by name and are in the componentStories list.
  referenceCSFFile(csfFile) {
    this.exportsToCSFFile.set(csfFile.moduleExports, csfFile), this.exportsToCSFFile.set(csfFile.moduleExports.default, csfFile), this.store.componentStoriesFromCSFFile({ csfFile }).forEach((story) => {
      let annotation = csfFile.stories[story.id];
      this.storyIdToCSFFile.set(annotation.id, csfFile), this.exportToStory.set(annotation.moduleExport, story);
    });
  }
  attachCSFFile(csfFile) {
    if (!this.exportsToCSFFile.has(csfFile.moduleExports))
      throw new Error("Cannot attach a CSF file that has not been referenced");
    if (this.attachedCSFFiles.has(csfFile))
      return;
    this.attachedCSFFiles.add(csfFile), this.store.componentStoriesFromCSFFile({ csfFile }).forEach((story) => {
      this.nameToStoryId.set(story.name, story.id), this.componentStoriesValue.push(story), this.primaryStory || (this.primaryStory = story);
    });
  }
  referenceMeta(metaExports, attach) {
    let resolved = this.resolveModuleExport(metaExports);
    if (resolved.type !== "meta")
      throw new Error(
        "<Meta of={} /> must reference a CSF file module export or meta export. Did you mistakenly reference your component instead of your CSF file?"
      );
    attach && this.attachCSFFile(resolved.csfFile);
  }
  get projectAnnotations() {
    let { projectAnnotations } = this.store;
    if (!projectAnnotations)
      throw new Error("Can't get projectAnnotations from DocsContext before they are initialized");
    return projectAnnotations;
  }
  resolveAttachedModuleExportType(moduleExportType) {
    if (moduleExportType === "story") {
      if (!this.primaryStory)
        throw new Error(
          "No primary story attached to this docs file, did you forget to use <Meta of={} />?"
        );
      return { type: "story", story: this.primaryStory };
    }
    if (this.attachedCSFFiles.size === 0)
      throw new Error(
        "No CSF file attached to this docs file, did you forget to use <Meta of={} />?"
      );
    let firstAttachedCSFFile = Array.from(this.attachedCSFFiles)[0];
    if (moduleExportType === "meta")
      return { type: "meta", csfFile: firstAttachedCSFFile };
    let { component } = firstAttachedCSFFile.meta;
    if (!component)
      throw new Error(
        "Attached CSF file does not defined a component, did you forget to export one?"
      );
    return { type: "component", component };
  }
  resolveModuleExport(moduleExportOrType) {
    let csfFile = this.exportsToCSFFile.get(moduleExportOrType);
    if (!csfFile && moduleExportOrType && typeof moduleExportOrType == "object" && "default" in moduleExportOrType && (csfFile = this.exportsToCSFFile.get(moduleExportOrType.default)), csfFile)
      return { type: "meta", csfFile };
    let story = this.exportToStory.get(
      isStory(moduleExportOrType) ? moduleExportOrType.input : moduleExportOrType
    );
    return story ? { type: "story", story } : { type: "component", component: moduleExportOrType };
  }
  resolveOf(moduleExportOrType, validTypes = []) {
    let resolved;
    if (["component", "meta", "story"].includes(moduleExportOrType)) {
      let type = moduleExportOrType;
      resolved = this.resolveAttachedModuleExportType(type);
    } else
      resolved = this.resolveModuleExport(moduleExportOrType);
    if (validTypes.length && !validTypes.includes(resolved.type)) {
      let prettyType = resolved.type === "component" ? "component or unknown" : resolved.type;
      throw new Error(dedent`Invalid value passed to the 'of' prop. The value was resolved to a '${prettyType}' type but the only types for this block are: ${validTypes.join(
        ", "
      )}.
        - Did you pass a component to the 'of' prop when the block only supports a story or a meta?
        - ... or vice versa?
        - Did you pass a story, CSF file or meta to the 'of' prop that is not indexed, ie. is not targeted by the 'stories' globs in the main configuration?`);
    }
    switch (resolved.type) {
      case "component":
        return {
          ...resolved,
          projectAnnotations: this.projectAnnotations
        };
      case "meta":
        return {
          ...resolved,
          preparedMeta: this.store.preparedMetaFromCSFFile({ csfFile: resolved.csfFile })
        };
      case "story":
      default:
        return resolved;
    }
  }
};
var CsfDocsRender = class {
  constructor(channel, store, entry, callbacks) {
    this.channel = channel;
    this.store = store;
    this.entry = entry;
    this.callbacks = callbacks;
    this.type = "docs";
    this.subtype = "csf";
    this.torndown = false;
    this.disableKeyListeners = false;
    this.preparing = false;
    this.id = entry.id, this.renderId = Date.now();
  }
  isPreparing() {
    return this.preparing;
  }
  async prepare() {
    this.preparing = true;
    let { entryExports, csfFiles = [] } = await this.store.loadEntry(this.id);
    if (this.torndown)
      throw PREPARE_ABORTED;
    let { importPath, title } = this.entry, primaryCsfFile = this.store.processCSFFileWithCache(
      entryExports,
      importPath,
      title
    ), primaryStoryId = Object.keys(primaryCsfFile.stories)[0];
    this.story = this.store.storyFromCSFFile({ storyId: primaryStoryId, csfFile: primaryCsfFile }), this.csfFiles = [primaryCsfFile, ...csfFiles], this.preparing = false;
  }
  isEqual(other) {
    return !!(this.id === other.id && this.story && this.story === other.story);
  }
  docsContext(renderStoryToElement) {
    if (!this.csfFiles)
      throw new Error("Cannot render docs before preparing");
    let docsContext = new DocsContext(
      this.channel,
      this.store,
      renderStoryToElement,
      this.csfFiles
    );
    return this.csfFiles.forEach((csfFile) => docsContext.attachCSFFile(csfFile)), docsContext;
  }
  async renderToElement(canvasElement, renderStoryToElement) {
    if (!this.story || !this.csfFiles)
      throw new Error("Cannot render docs before preparing");
    let docsContext = this.docsContext(renderStoryToElement), { docs: docsParameter } = this.story.parameters || {};
    if (!docsParameter)
      throw new Error(
        "Cannot render a story in viewMode=docs if `@storybook/addon-docs` is not installed"
      );
    let renderer = await docsParameter.renderer(), { render } = renderer, renderDocs = async () => {
      try {
        await render(docsContext, docsParameter, canvasElement), this.channel.emit(DOCS_RENDERED, this.id);
      } catch (err) {
        this.callbacks.showException(err);
      }
    };
    return this.rerender = async () => renderDocs(), this.teardownRender = async ({ viewModeChanged }) => {
      !viewModeChanged || !canvasElement || renderer.unmount(canvasElement);
    }, renderDocs();
  }
  async teardown({ viewModeChanged } = {}) {
    this.teardownRender?.({ viewModeChanged }), this.torndown = true;
  }
};
var MdxDocsRender = class {
  constructor(channel, store, entry, callbacks) {
    this.channel = channel;
    this.store = store;
    this.entry = entry;
    this.callbacks = callbacks;
    this.type = "docs";
    this.subtype = "mdx";
    this.torndown = false;
    this.disableKeyListeners = false;
    this.preparing = false;
    this.id = entry.id, this.renderId = Date.now();
  }
  isPreparing() {
    return this.preparing;
  }
  async prepare() {
    this.preparing = true;
    let { entryExports, csfFiles = [] } = await this.store.loadEntry(this.id);
    if (this.torndown)
      throw PREPARE_ABORTED;
    if (this.csfFiles = csfFiles, this.exports = entryExports, this.attachedCsfFile = void 0, this.attachedStory = void 0, this.entry.tags?.includes(Tag.ATTACHED_MDX)) {
      this.attachedCsfFile = csfFiles[0];
      let primaryStoryId = this.attachedCsfFile && Object.keys(this.attachedCsfFile.stories)[0];
      this.attachedCsfFile && primaryStoryId && (this.attachedStory = this.store.storyFromCSFFile({
        storyId: primaryStoryId,
        csfFile: this.attachedCsfFile
      }));
    }
    this.preparing = false;
  }
  isEqual(other) {
    return !!(this.id === other.id && this.exports && this.exports === other.exports);
  }
  docsContext(renderStoryToElement) {
    if (!this.csfFiles)
      throw new Error("Cannot render docs before preparing");
    let docsContext = new DocsContext(
      this.channel,
      this.store,
      renderStoryToElement,
      this.csfFiles
    );
    return this.attachedCsfFile && docsContext.attachCSFFile(this.attachedCsfFile), docsContext;
  }
  async renderToElement(canvasElement, renderStoryToElement) {
    if (!this.exports || !this.csfFiles || !this.store.projectAnnotations)
      throw new Error("Cannot render docs before preparing");
    let docsContext = this.docsContext(renderStoryToElement), { docs } = this.store.projectAnnotations.parameters ?? {}, baseDocsParameter = this.attachedStory?.parameters?.docs ?? docs;
    if (!baseDocsParameter)
      throw new Error(
        "Cannot render a story in viewMode=docs if `@storybook/addon-docs` is not installed"
      );
    let docsParameter = { ...baseDocsParameter, page: this.exports.default }, renderer = await baseDocsParameter.renderer(), { render } = renderer, renderDocs = async () => {
      try {
        await render(docsContext, docsParameter, canvasElement), this.channel.emit(DOCS_RENDERED, this.id);
      } catch (err) {
        this.callbacks.showException(err);
      }
    };
    return this.rerender = async () => renderDocs(), this.teardownRender = async ({ viewModeChanged } = {}) => {
      !viewModeChanged || !canvasElement || (renderer.unmount(canvasElement), this.torndown = true);
    }, renderDocs();
  }
  async teardown({ viewModeChanged } = {}) {
    this.teardownRender?.({ viewModeChanged }), this.torndown = true;
  }
};
var globalWindow = globalThis;
function focusInInput(event) {
  let target = event.composedPath && event.composedPath()[0] || event.target;
  return /input|textarea/i.test(target.tagName) || target.getAttribute("contenteditable") !== null;
}
function isMdxEntry({ tags }) {
  return tags?.includes(Tag.UNATTACHED_MDX) || tags?.includes(Tag.ATTACHED_MDX);
}
function isStoryRender(r) {
  return r.type === "story";
}
function isDocsRender(r) {
  return r.type === "docs";
}
function isCsfDocsRender(r) {
  return isDocsRender(r) && r.subtype === "csf";
}
var PreviewWithSelection = class extends Preview {
  constructor(importFn, getProjectAnnotations, selectionStore, view) {
    super(importFn, getProjectAnnotations, void 0, false);
    this.importFn = importFn;
    this.getProjectAnnotations = getProjectAnnotations;
    this.selectionStore = selectionStore;
    this.view = view;
    this.initialize();
  }
  setupListeners() {
    super.setupListeners(), globalWindow.onkeydown = this.onKeydown.bind(this), this.channel.on(SET_CURRENT_STORY, this.onSetCurrentStory.bind(this)), this.channel.on(UPDATE_QUERY_PARAMS, this.onUpdateQueryParams.bind(this)), this.channel.on(PRELOAD_ENTRIES, this.onPreloadStories.bind(this));
  }
  async setInitialGlobals() {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "setInitialGlobals" });
    let { globals } = this.selectionStore.selectionSpecifier || {};
    globals && this.storyStoreValue.userGlobals.updateFromPersisted(globals), this.emitGlobals();
  }
  // If initialization gets as far as the story index, this function runs.
  async initializeWithStoryIndex(storyIndex) {
    return await super.initializeWithStoryIndex(storyIndex), this.selectSpecifiedStory();
  }
  // Use the selection specifier to choose a story, then render it
  async selectSpecifiedStory() {
    if (!this.storyStoreValue)
      throw new CalledPreviewMethodBeforeInitializationError({
        methodName: "selectSpecifiedStory"
      });
    if (this.selectionStore.selection) {
      await this.renderSelection();
      return;
    }
    if (!this.selectionStore.selectionSpecifier) {
      this.renderMissingStory();
      return;
    }
    let { storySpecifier, args } = this.selectionStore.selectionSpecifier, entry = this.storyStoreValue.storyIndex.entryFromSpecifier(storySpecifier);
    if (!entry) {
      storySpecifier === "*" ? this.renderStoryLoadingException(storySpecifier, new EmptyIndexError()) : this.renderStoryLoadingException(
        storySpecifier,
        new NoStoryMatchError({ storySpecifier: storySpecifier.toString() })
      );
      return;
    }
    let { id: storyId, type: viewMode } = entry;
    this.selectionStore.setSelection({ storyId, viewMode }), this.channel.emit(STORY_SPECIFIED, this.selectionStore.selection), this.channel.emit(CURRENT_STORY_WAS_SET, this.selectionStore.selection), await this.renderSelection({ persistedArgs: args });
  }
  // EVENT HANDLERS
  // This happens when a config file gets reloaded
  async onGetProjectAnnotationsChanged({
    getProjectAnnotations
  }) {
    await super.onGetProjectAnnotationsChanged({ getProjectAnnotations }), this.selectionStore.selection && this.renderSelection();
  }
  // This happens when a glob gets HMR-ed
  async onStoriesChanged({
    importFn,
    storyIndex
  }) {
    await super.onStoriesChanged({ importFn, storyIndex }), this.selectionStore.selection ? await this.renderSelection() : await this.selectSpecifiedStory();
  }
  onKeydown(event) {
    if (!this.storyRenders.find((r) => r.disableKeyListeners) && !focusInInput(event)) {
      let { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode } = event;
      this.channel.emit(PREVIEW_KEYDOWN, {
        event: { altKey, ctrlKey, metaKey, shiftKey, key, code, keyCode }
      });
    }
  }
  async onSetCurrentStory(selection) {
    this.selectionStore.setSelection({ viewMode: "story", ...selection }), await this.storeInitializationPromise, this.channel.emit(CURRENT_STORY_WAS_SET, this.selectionStore.selection), this.renderSelection();
  }
  onUpdateQueryParams(queryParams) {
    this.selectionStore.setQueryParams(queryParams);
  }
  async onUpdateGlobals({ globals }) {
    let currentStory = this.currentRender instanceof StoryRender && this.currentRender.story || void 0;
    super.onUpdateGlobals({ globals, currentStory }), (this.currentRender instanceof MdxDocsRender || this.currentRender instanceof CsfDocsRender) && await this.currentRender.rerender?.();
  }
  async onUpdateArgs({ storyId, updatedArgs }) {
    super.onUpdateArgs({ storyId, updatedArgs });
  }
  async onPreloadStories({ ids }) {
    await this.storeInitializationPromise, this.storyStoreValue && await Promise.allSettled(ids.map((id) => this.storyStoreValue?.loadEntry(id)));
  }
  // RENDERING
  // We can either have:
  // - a story selected in "story" viewMode,
  //     in which case we render it to the root element, OR
  // - a story selected in "docs" viewMode,
  //     in which case we render the docsPage for that story
  async renderSelection({ persistedArgs } = {}) {
    let { renderToCanvas } = this;
    if (!this.storyStoreValue || !renderToCanvas)
      throw new CalledPreviewMethodBeforeInitializationError({ methodName: "renderSelection" });
    let { selection } = this.selectionStore;
    if (!selection)
      throw new Error("Cannot call renderSelection as no selection was made");
    let { storyId } = selection, entry;
    try {
      entry = await this.storyStoreValue.storyIdToEntry(storyId);
    } catch (err) {
      this.currentRender && await this.teardownRender(this.currentRender), this.renderStoryLoadingException(storyId, err);
      return;
    }
    let storyIdChanged = this.currentSelection?.storyId !== storyId, viewModeChanged = this.currentRender?.type !== entry.type;
    entry.type === "story" ? this.view.showPreparingStory({ immediate: viewModeChanged }) : this.view.showPreparingDocs({ immediate: viewModeChanged }), this.currentRender?.isPreparing() && await this.teardownRender(this.currentRender);
    let render;
    entry.type === "story" ? render = new StoryRender(
      this.channel,
      this.storyStoreValue,
      renderToCanvas,
      this.mainStoryCallbacks(storyId),
      storyId,
      "story"
    ) : isMdxEntry(entry) ? render = new MdxDocsRender(
      this.channel,
      this.storyStoreValue,
      entry,
      this.mainStoryCallbacks(storyId)
    ) : render = new CsfDocsRender(
      this.channel,
      this.storyStoreValue,
      entry,
      this.mainStoryCallbacks(storyId)
    );
    let lastSelection = this.currentSelection;
    this.currentSelection = selection;
    let lastRender = this.currentRender;
    this.currentRender = render;
    try {
      await render.prepare();
    } catch (err) {
      lastRender && await this.teardownRender(lastRender), err !== PREPARE_ABORTED && this.renderStoryLoadingException(storyId, err);
      return;
    }
    let implementationChanged = !storyIdChanged && lastRender && !render.isEqual(lastRender);
    if (persistedArgs && isStoryRender(render) && (invariant(!!render.story), this.storyStoreValue.args.updateFromPersisted(render.story, persistedArgs)), lastRender && !lastRender.torndown && !storyIdChanged && !implementationChanged && !viewModeChanged) {
      this.currentRender = lastRender, this.channel.emit(STORY_UNCHANGED, storyId), this.view.showMain();
      return;
    }
    if (lastRender && await this.teardownRender(lastRender, { viewModeChanged }), lastSelection && (storyIdChanged || viewModeChanged) && this.channel.emit(STORY_CHANGED, storyId), isStoryRender(render)) {
      invariant(!!render.story);
      let {
        parameters: parameters2,
        initialArgs,
        argTypes,
        unmappedArgs,
        initialGlobals: initialGlobals5,
        userGlobals,
        storyGlobals,
        globals
      } = this.storyStoreValue.getStoryContext(render.story);
      this.channel.emit(STORY_PREPARED, {
        id: storyId,
        parameters: parameters2,
        initialArgs,
        argTypes,
        args: unmappedArgs
      }), this.channel.emit(GLOBALS_UPDATED, { userGlobals, storyGlobals, globals, initialGlobals: initialGlobals5 });
    } else {
      let { parameters: parameters2 } = this.storyStoreValue.projectAnnotations, { initialGlobals: initialGlobals5, globals } = this.storyStoreValue.userGlobals;
      if (this.channel.emit(GLOBALS_UPDATED, {
        globals,
        initialGlobals: initialGlobals5,
        storyGlobals: {},
        userGlobals: globals
      }), isCsfDocsRender(render) || render.entry.tags?.includes(Tag.ATTACHED_MDX)) {
        if (!render.csfFiles)
          throw new MdxFileWithNoCsfReferencesError({ storyId });
        ({ parameters: parameters2 } = this.storyStoreValue.preparedMetaFromCSFFile({
          csfFile: render.csfFiles[0]
        }));
      }
      this.channel.emit(DOCS_PREPARED, {
        id: storyId,
        parameters: parameters2
      });
    }
    isStoryRender(render) ? (invariant(!!render.story), this.storyRenders.push(render), this.currentRender.renderToElement(
      this.view.prepareForStory(render.story)
    )) : this.currentRender.renderToElement(
      this.view.prepareForDocs(),
      // This argument is used for docs, which is currently only compatible with HTMLElements
      this.renderStoryToElement.bind(this)
    );
  }
  async teardownRender(render, { viewModeChanged = false } = {}) {
    this.storyRenders = this.storyRenders.filter((r) => r !== render), await render?.teardown?.({ viewModeChanged });
  }
  // UTILITIES
  mainStoryCallbacks(storyId) {
    return {
      showStoryDuringRender: () => this.view.showStoryDuringRender(),
      showMain: () => this.view.showMain(),
      showError: (err) => this.renderError(storyId, err),
      showException: (err) => this.renderException(storyId, err)
    };
  }
  renderPreviewEntryError(reason, err) {
    super.renderPreviewEntryError(reason, err), this.view.showErrorDisplay(err);
  }
  renderMissingStory() {
    this.view.showNoPreview(), this.channel.emit(STORY_MISSING);
  }
  renderStoryLoadingException(storySpecifier, err) {
    logger.error(err), this.view.showErrorDisplay(err), this.channel.emit(STORY_MISSING, storySpecifier);
  }
  // renderException is used if we fail to render the story and it is uncaught by the app layer
  renderException(storyId, error) {
    let { name = "Error", message = String(error), stack } = error, renderId = this.currentRender?.renderId;
    this.channel.emit(STORY_THREW_EXCEPTION, { name, message, stack }), this.channel.emit(STORY_RENDER_PHASE_CHANGED, { newPhase: "errored", renderId, storyId }), this.view.showErrorDisplay(error), logger.error(`Error rendering story '${storyId}':`), logger.error(error);
  }
  // renderError is used by the various app layers to inform the user they have done something
  // wrong -- for instance returned the wrong thing from a story
  renderError(storyId, { title, description }) {
    let renderId = this.currentRender?.renderId;
    this.channel.emit(STORY_ERRORED, { title, description }), this.channel.emit(STORY_RENDER_PHASE_CHANGED, { newPhase: "errored", renderId, storyId }), this.view.showErrorDisplay({ message: title, stack: description }), logger.error(`Error rendering story ${title}: ${description}`);
  }
};
var import_picoquery2 = __toESM(require_main(), 1);
var import_picoquery = __toESM(require_main(), 1);
var VALIDATION_REGEXP = /^[a-zA-Z0-9 _-]*$/;
var NUMBER_REGEXP = /^-?[0-9]+(\.[0-9]+)?$/;
var HEX_REGEXP = /^#([a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i;
var COLOR_REGEXP = /^(rgba?|hsla?)\(([0-9]{1,3}),\s?([0-9]{1,3})%?,\s?([0-9]{1,3})%?,?\s?([0-9](\.[0-9]{1,2})?)?\)$/i;
var validateArgs = (key = "", value) => key === null || key === "" || !VALIDATION_REGEXP.test(key) ? false : value == null || value instanceof Date || typeof value == "number" || typeof value == "boolean" ? true : typeof value == "string" ? VALIDATION_REGEXP.test(value) || NUMBER_REGEXP.test(value) || HEX_REGEXP.test(value) || COLOR_REGEXP.test(value) : Array.isArray(value) ? value.every((v) => validateArgs(key, v)) : isPlainObject(value) ? Object.entries(value).every(([k, v]) => validateArgs(k, v)) : false;
var QUERY_OPTIONS = {
  delimiter: ";",
  // we're parsing a single query param
  nesting: true,
  arrayRepeat: true,
  arrayRepeatSyntax: "bracket",
  nestingSyntax: "js",
  // objects are encoded using dot notation
  valueDeserializer(str) {
    if (str.startsWith("!")) {
      if (str === "!undefined")
        return;
      if (str === "!null")
        return null;
      if (str === "!true")
        return true;
      if (str === "!false")
        return false;
      if (str.startsWith("!date(") && str.endsWith(")"))
        return new Date(str.replaceAll(" ", "+").slice(6, -1));
      if (str.startsWith("!hex(") && str.endsWith(")"))
        return `#${str.slice(5, -1)}`;
      let color = str.slice(1).match(COLOR_REGEXP);
      if (color)
        return str.startsWith("!rgba") || str.startsWith("!RGBA") ? `${color[1]}(${color[2]}, ${color[3]}, ${color[4]}, ${color[5]})` : str.startsWith("!hsla") || str.startsWith("!HSLA") ? `${color[1]}(${color[2]}, ${color[3]}%, ${color[4]}%, ${color[5]})` : str.startsWith("!rgb") || str.startsWith("!RGB") ? `${color[1]}(${color[2]}, ${color[3]}, ${color[4]})` : `${color[1]}(${color[2]}, ${color[3]}%, ${color[4]}%)`;
    }
    return NUMBER_REGEXP.test(str) ? Number(str) : str;
  }
};
var parseArgsParam = (argsString) => {
  let parts = argsString.split(";").map((part) => part.replace("=", "~").replace(":", "="));
  return Object.entries((0, import_picoquery.parse)(parts.join(";"), QUERY_OPTIONS)).reduce((acc, [key, value]) => validateArgs(key, value) ? Object.assign(acc, { [key]: value }) : (once.warn(dedent`
      Omitted potentially unsafe URL args.

      More info: https://storybook.js.org/docs/writing-stories/args?ref=error#setting-args-through-the-url
    `), acc), {});
};
var { history, document: document22 } = scope;
function pathToId(path) {
  let match = (path || "").match(/^\/story\/(.+)/);
  if (!match)
    throw new Error(`Invalid path '${path}',  must start with '/story/'`);
  return match[1];
}
var getQueryString = ({
  selection,
  extraParams
}) => {
  let search = document22?.location.search.slice(1), { path, selectedKind, selectedStory, ...rest } = (0, import_picoquery2.parse)(search);
  return `?${(0, import_picoquery2.stringify)({
    ...rest,
    ...extraParams,
    ...selection && { id: selection.storyId, viewMode: selection.viewMode }
  })}`;
};
var setPath = (selection) => {
  if (!selection)
    return;
  let query = getQueryString({ selection }), { hash = "" } = document22.location;
  document22.title = selection.storyId, history.replaceState({}, "", `${document22.location.pathname}${query}${hash}`);
};
var isObject = (val) => val != null && typeof val == "object" && Array.isArray(val) === false;
var getFirstString = (v) => {
  if (v !== void 0) {
    if (typeof v == "string")
      return v;
    if (Array.isArray(v))
      return getFirstString(v[0]);
    if (isObject(v))
      return getFirstString(
        Object.values(v).filter(Boolean)
      );
  }
};
var getSelectionSpecifierFromPath = () => {
  if (typeof document22 < "u") {
    let queryStr = document22.location.search.slice(1), query = (0, import_picoquery2.parse)(queryStr), args = typeof query.args == "string" ? parseArgsParam(query.args) : void 0, globals = typeof query.globals == "string" ? parseArgsParam(query.globals) : void 0, viewMode = getFirstString(query.viewMode);
    if (typeof viewMode != "string" || !viewMode)
      viewMode = "story";
    else if (!viewMode.match(/docs|story/))
      return null;
    let path = getFirstString(query.path), storyId = path ? pathToId(path) : getFirstString(query.id);
    if (storyId)
      return { storySpecifier: storyId, args, globals, viewMode };
  }
  return null;
};
var UrlStore = class {
  constructor() {
    this.selectionSpecifier = getSelectionSpecifierFromPath();
  }
  setSelection(selection) {
    this.selection = selection, setPath(this.selection);
  }
  setQueryParams(queryParams) {
    let query = getQueryString({ extraParams: queryParams }), { hash = "" } = document22.location;
    history.replaceState({}, "", `${document22.location.pathname}${query}${hash}`);
  }
};
var import_ansi_to_html = __toESM(require_ansi_to_html(), 1);
var import_picoquery3 = __toESM(require_main(), 1);
var { document: document3 } = scope;
var PREPARING_DELAY = 100;
var Mode = ((Mode2) => (Mode2.MAIN = "MAIN", Mode2.NOPREVIEW = "NOPREVIEW", Mode2.PREPARING_STORY = "PREPARING_STORY", Mode2.PREPARING_DOCS = "PREPARING_DOCS", Mode2.ERROR = "ERROR", Mode2))(Mode || {});
var classes = {
  PREPARING_STORY: "sb-show-preparing-story",
  PREPARING_DOCS: "sb-show-preparing-docs",
  MAIN: "sb-show-main",
  NOPREVIEW: "sb-show-nopreview",
  ERROR: "sb-show-errordisplay"
};
var layoutClassMap = {
  centered: "sb-main-centered",
  fullscreen: "sb-main-fullscreen",
  padded: "sb-main-padded"
};
var ansiConverter = new import_ansi_to_html.default({
  escapeXML: true
});
var WebView = class {
  constructor() {
    this.testing = false;
    if (typeof document3 < "u") {
      let { __SPECIAL_TEST_PARAMETER__ } = (0, import_picoquery3.parse)(document3.location.search.slice(1));
      switch (__SPECIAL_TEST_PARAMETER__) {
        case "preparing-story": {
          this.showPreparingStory(), this.testing = true;
          break;
        }
        case "preparing-docs": {
          this.showPreparingDocs(), this.testing = true;
          break;
        }
        default:
      }
    }
  }
  // Get ready to render a story, returning the element to render to
  prepareForStory(story) {
    return this.showStory(), this.applyLayout(story.parameters.layout), document3.documentElement.scrollTop = 0, document3.documentElement.scrollLeft = 0, this.storyRoot();
  }
  storyRoot() {
    return document3.getElementById("storybook-root");
  }
  prepareForDocs() {
    return this.showMain(), this.showDocs(), this.applyLayout("fullscreen"), document3.documentElement.scrollTop = 0, document3.documentElement.scrollLeft = 0, this.docsRoot();
  }
  docsRoot() {
    return document3.getElementById("storybook-docs");
  }
  applyLayout(layout = "padded") {
    if (layout === "none") {
      document3.body.classList.remove(this.currentLayoutClass), this.currentLayoutClass = null;
      return;
    }
    this.checkIfLayoutExists(layout);
    let layoutClass = layoutClassMap[layout];
    document3.body.classList.remove(this.currentLayoutClass), document3.body.classList.add(layoutClass), this.currentLayoutClass = layoutClass;
  }
  checkIfLayoutExists(layout) {
    layoutClassMap[layout] || logger.warn(
      dedent`
          The desired layout: ${layout} is not a valid option.
          The possible options are: ${Object.keys(layoutClassMap).join(", ")}, none.
        `
    );
  }
  showMode(mode) {
    clearTimeout(this.preparingTimeout), Object.keys(Mode).forEach((otherMode) => {
      otherMode === mode ? document3.body.classList.add(classes[otherMode]) : document3.body.classList.remove(classes[otherMode]);
    });
  }
  showErrorDisplay({ message = "", stack = "" }) {
    let header = message, detail = stack, parts = message.split(`
`);
    parts.length > 1 && ([header] = parts, detail = parts.slice(1).join(`
`).replace(/^\n/, "")), document3.getElementById("error-message").innerHTML = ansiConverter.toHtml(header), document3.getElementById("error-stack").innerHTML = ansiConverter.toHtml(detail), this.showMode(
      "ERROR"
      /* ERROR */
    );
  }
  showNoPreview() {
    this.testing || (this.showMode(
      "NOPREVIEW"
      /* NOPREVIEW */
    ), this.storyRoot()?.setAttribute("hidden", "true"), this.docsRoot()?.setAttribute("hidden", "true"));
  }
  showPreparingStory({ immediate = false } = {}) {
    clearTimeout(this.preparingTimeout), immediate ? this.showMode(
      "PREPARING_STORY"
      /* PREPARING_STORY */
    ) : this.preparingTimeout = setTimeout(
      () => this.showMode(
        "PREPARING_STORY"
        /* PREPARING_STORY */
      ),
      PREPARING_DELAY
    );
  }
  showPreparingDocs({ immediate = false } = {}) {
    clearTimeout(this.preparingTimeout), immediate ? this.showMode(
      "PREPARING_DOCS"
      /* PREPARING_DOCS */
    ) : this.preparingTimeout = setTimeout(() => this.showMode(
      "PREPARING_DOCS"
      /* PREPARING_DOCS */
    ), PREPARING_DELAY);
  }
  showMain() {
    this.showMode(
      "MAIN"
      /* MAIN */
    );
  }
  showDocs() {
    this.storyRoot().setAttribute("hidden", "true"), this.docsRoot().removeAttribute("hidden");
  }
  showStory() {
    this.docsRoot().setAttribute("hidden", "true"), this.storyRoot().removeAttribute("hidden");
  }
  showStoryDuringRender() {
    document3.body.classList.add(classes.MAIN);
  }
};
var PreviewWeb = class extends PreviewWithSelection {
  constructor(importFn, getProjectAnnotations) {
    super(importFn, getProjectAnnotations, new UrlStore(), new WebView());
    this.importFn = importFn;
    this.getProjectAnnotations = getProjectAnnotations;
    scope.__STORYBOOK_PREVIEW__ = this;
  }
};
var { document: document4 } = scope;
var runScriptTypes = [
  "application/javascript",
  "application/ecmascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript",
  // Support modern javascript
  "module"
];
var SCRIPT = "script";
var SCRIPTS_ROOT_ID = "scripts-root";
function simulateDOMContentLoaded() {
  let DOMContentLoadedEvent = document4.createEvent("Event");
  DOMContentLoadedEvent.initEvent("DOMContentLoaded", true, true), document4.dispatchEvent(DOMContentLoadedEvent);
}
function insertScript($script, callback, $scriptRoot) {
  let scriptEl = document4.createElement("script");
  scriptEl.type = $script.type === "module" ? "module" : "text/javascript", $script.src ? (scriptEl.onload = callback, scriptEl.onerror = callback, scriptEl.src = $script.src) : scriptEl.textContent = $script.innerText, $scriptRoot ? $scriptRoot.appendChild(scriptEl) : document4.head.appendChild(scriptEl), $script.parentNode.removeChild($script), $script.src || callback();
}
function insertScriptsSequentially(scriptsToExecute, callback, index = 0) {
  scriptsToExecute[index](() => {
    index++, index === scriptsToExecute.length ? callback() : insertScriptsSequentially(scriptsToExecute, callback, index);
  });
}
function simulatePageLoad($container) {
  let $scriptsRoot = document4.getElementById(SCRIPTS_ROOT_ID);
  $scriptsRoot ? $scriptsRoot.innerHTML = "" : ($scriptsRoot = document4.createElement("div"), $scriptsRoot.id = SCRIPTS_ROOT_ID, document4.body.appendChild($scriptsRoot));
  let $scripts = Array.from($container.querySelectorAll(SCRIPT));
  if ($scripts.length) {
    let scriptsToExecute = [];
    $scripts.forEach(($script) => {
      let typeAttr = $script.getAttribute("type");
      (!typeAttr || runScriptTypes.includes(typeAttr)) && scriptsToExecute.push((callback) => insertScript($script, callback, $scriptsRoot));
    }), scriptsToExecute.length && insertScriptsSequentially(scriptsToExecute, simulateDOMContentLoaded, void 0);
  } else
    simulateDOMContentLoaded();
}
async function emitTransformCode(source, context) {
  let transform = context.parameters?.docs?.source?.transform, { id, unmappedArgs } = context, transformed = transform && source ? transform?.(source, context) : source, result = transformed ? await transformed : void 0;
  addons.getChannel().emit(SNIPPET_RENDERED, {
    id,
    source: result,
    args: unmappedArgs
  });
}

export {
  isTestEnvironment,
  pauseAnimations,
  waitForAnimations,
  Tag,
  BUILT_IN_FILTERS,
  USER_TAG_FILTER,
  require_main,
  mockChannel,
  addons,
  HooksContext,
  applyHooks,
  useMemo,
  useCallback,
  useRef,
  useState,
  useReducer,
  useEffect,
  useChannel,
  useStoryContext,
  useParameter,
  useArgs,
  useGlobals,
  makeDecorator,
  combineArgs,
  normalizeArrays,
  normalizeStory,
  decorateStory,
  sanitizeStoryContextUpdate,
  defaultDecorateStory,
  prepareStory,
  prepareMeta,
  filterArgTypes,
  inferControls,
  normalizeProjectAnnotations,
  composeStepRunners,
  composeConfigs,
  ReporterAPI,
  getCsfFactoryAnnotations,
  setDefaultProjectAnnotations,
  setProjectAnnotations,
  composeStory,
  composeStories,
  createPlaywrightTest,
  StoryStore,
  userOrAutoTitleFromSpecifier,
  userOrAutoTitle,
  sortStoriesV7,
  Preview,
  DocsContext,
  PreviewWithSelection,
  UrlStore,
  WebView,
  PreviewWeb,
  simulateDOMContentLoaded,
  simulatePageLoad,
  emitTransformCode,
  includeConditionalArg,
  definePreviewAddon10,
  isStory,
  getStoryChildren,
  sanitize,
  toId
};
//# sourceMappingURL=chunk-OFYILCE4.js.map
