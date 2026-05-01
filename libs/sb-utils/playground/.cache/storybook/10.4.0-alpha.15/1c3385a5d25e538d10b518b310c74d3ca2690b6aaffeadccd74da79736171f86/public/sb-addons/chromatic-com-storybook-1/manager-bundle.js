try{
(() => {
  var __require = /* @__PURE__ */ ((x2) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(x2, {
    get: (a2, b8) => (typeof require < "u" ? require : a2)[b8]
  }) : x2)(function(x2) {
    if (typeof require < "u") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x2 + '" is not supported');
  });

  // <define:process.env>
  var define_process_env_default = { NODE_ENV: "development", NODE_PATH: [], STORYBOOK: "true", PUBLIC_URL: ".", CHROMATIC_BASE_URL: "https://www.chromatic.com" };

  // global-externals:react
  var react_default = __REACT__, { Children, Component, Fragment, Profiler, PureComponent, StrictMode, Suspense, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, act, cloneElement, createContext, createElement, createFactory, createRef, forwardRef, isValidElement, lazy, memo, startTransition, unstable_act, useCallback, useContext, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore, useTransition, version } = __REACT__;

  // global-externals:storybook/internal/types
  var types_default = __STORYBOOK_TYPES__, { Addon_TypesEnum, CHANGE_DETECTION_STATUS_TYPE_ID, CoreWebpackCompiler, Feature, SupportedBuilder, SupportedLanguage, SupportedRenderer } = __STORYBOOK_TYPES__;

  // global-externals:storybook/manager-api
  var manager_api_default = __STORYBOOK_API__, { ActiveTabs, Consumer, ManagerContext, Provider, RequestResponseError, Tag, addons, combineParameters, controlOrMetaKey, controlOrMetaSymbol, eventMatchesShortcut, eventToShortcut, experimental_MockUniversalStore, experimental_UniversalStore, experimental_getStatusStore, experimental_getTestProviderStore, experimental_requestResponse, experimental_useStatusStore, experimental_useTestProviderStore, experimental_useUniversalStore, internal_checklistStore, internal_fullStatusStore, internal_fullTestProviderStore, internal_universalChecklistStore, internal_universalStatusStore, internal_universalTestProviderStore, isMacLike, isShortcutTaken, keyToSymbol, merge, mockChannel, optionOrAltSymbol, shortcutMatchesShortcut, shortcutToAriaKeyshortcuts, shortcutToHumanString, types, useAddonState, useArgTypes, useArgs, useChannel, useGlobalTypes, useGlobals, useParameter, useSharedState, useStoryPrepared, useStorybookApi, useStorybookState } = __STORYBOOK_API__;

  // global-externals:storybook/internal/components
  var components_default = __STORYBOOK_COMPONENTS__, { A, AbstractToolbar, ActionBar, ActionList, AddonPanel, Badge, Bar, Blockquote, Button, Card, ClipboardCode, Code, Collapsible, DL, Div, DocumentWrapper, EmptyTabContent, ErrorFormatter, FlexBar, Form, H1, H2, H3, H4, H5, H6, HR, IconButton, Img, LI, Link, ListItem, Loader, Modal, ModalDecorator, OL, P, Placeholder, Popover, PopoverProvider, Pre, ProgressSpinner, ResetWrapper, ScrollArea, Select, Separator, Spaced, Span, StatelessTab, StatelessTabList, StatelessTabPanel, StatelessTabsView, StorybookIcon, StorybookLogo, SyntaxHighlighter, TT, TabBar, TabButton, TabList, TabPanel, TabWrapper, Table, Tabs, TabsState, TabsView, ToggleButton, Toolbar, Tooltip, TooltipLinkList, TooltipMessage, TooltipNote, TooltipProvider, UL, WithTooltip, WithTooltipPure, Zoom, codeCommon, components, convertToReactAriaPlacement, createCopyToClipboardFunction, getStoryHref, interleaveSeparators, nameSpaceClassNames, resetComponents, useTabsState, withReset } = __STORYBOOK_COMPONENTS__;

  // global-externals:storybook/theming
  var theming_default = __STORYBOOK_THEMING__, { CacheProvider, ClassNames, Global, ThemeProvider, background, color, convert, create, createCache, createGlobal, createReset, css, darken, ensure, getPreferredColorScheme, ignoreSsrWarning, isPropValid, jsx, keyframes, lighten, srOnlyStyles, styled, themes, tokens, typography, useTheme, withTheme } = __STORYBOOK_THEMING__;

  // global-externals:react-dom
  var react_dom_default = __REACT_DOM__, { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED2, createPortal, createRoot, findDOMNode, flushSync, hydrate, hydrateRoot, render, unmountComponentAtNode, unstable_batchedUpdates, unstable_renderSubtreeIntoContainer, version: version2 } = __REACT_DOM__;

  // node_modules/@neoconfetti/react/dist/min/index.js
  var e = '@keyframes Bc2PgW_ya{to{translate:0 var(--sh)}}@keyframes Bc2PgW_xa{to{translate:var(--xlp)0}}@keyframes Bc2PgW_r{50%{rotate:var(--hr)180deg}to{rotate:var(--r)360deg}}.Bc2PgW_c{z-index:1200;width:0;height:0;position:relative;overflow:visible}.Bc2PgW_p{animation:xa var(--dc)forwards cubic-bezier(var(--x1),var(--x2),var(--x3),var(--x4));animation-name:Bc2PgW_xa}.Bc2PgW_p>div{animation:ya var(--dc)forwards cubic-bezier(var(--y1),var(--y2),var(--y3),var(--y4));width:var(--w);height:var(--h);animation-name:Bc2PgW_ya;position:absolute;top:0;left:0}.Bc2PgW_p>div:before{content:"";background-color:var(--bgc);animation:r var(--rd)infinite linear;border-radius:var(--br);width:100%;height:100%;animation-name:Bc2PgW_r;display:block}', t = "Bc2PgW_p", r = "Bc2PgW_c", a = ["#FFC700", "#FF0000", "#2E3191", "#41BBC7"], o = 3500, n = 0.5, i = 150, c = "mix", s = 12, l = "", d = !0, p = 800, u = 1600;
  function y(y10, z2 = {}) {
    let { colors: A8 = a, duration: H9 = o, force: F4 = n, particleCount: O = i, particleShape: j3 = c, particleSize: E3 = s, particleClass: $3 = l, destroyAfterDone: q3 = d, stageHeight: D = p, stageWidth: J3 = u } = z2;
    (function(e10) {
      if (document.querySelector("style[data-neoconfetti]")) return;
      let t5 = W("style");
      t5.dataset.neoconfetti = "", t5.textContent = e10, _(document.head, t5);
    })(e), y10.classList.add(r), y10.style.setProperty("--sh", D + "px");
    let I = [], G3 = [], K2 = () => P2(b() * (N - 1)), Q3 = (e10, t5) => j3 !== "rectangles" && (e10 === "circles" || k(t5));
    function R9(e10, t5) {
      let r5 = K2(), a2 = Q3(j3, r5), o10 = (t10, r10) => e10.style.setProperty(t10, r10 + "");
      o10("--xlp", C(x(L(t5, 90) - 180), 0, 180, -J3 / 2, J3 / 2) + "px"), o10("--dc", H9 - P2(1e3 * b()) + "ms");
      let n10 = b() < m ? w(b() * h, 2) : 0;
      o10("--x1", n10), o10("--x2", -1 * n10), o10("--x3", n10), o10("--x4", w(x(C(x(L(t5, 90) - 180), 0, 180, -1, 1)), 4)), o10("--y1", w(b() * v, 4)), o10("--y2", w(b() * F4 * (M() ? 1 : -1), 4)), o10("--y3", v), o10("--y4", w(B(C(x(t5 - 180), 0, 180, F4, -F4), 0), 4)), o10("--w", (a2 ? E3 : P2(4 * b()) + E3 / 2) + "px"), o10("--h", (a2 ? E3 : P2(2 * b()) + E3) + "px");
      let i10 = r5.toString(2).padStart(3, "0").split("");
      o10("--hr", i10.map(((e11) => +e11 / 2 + "")).join(" ")), o10("--r", i10.join(" ")), o10("--rd", w(b() * (g - f) + f) + "ms"), o10("--br", a2 ? "50%" : 0);
    }
    let U3;
    function V() {
      y10.innerHTML = "", clearTimeout(U3), I = S(O, A8), G3 = (function(e10, r5 = [], a2) {
        let o10 = [];
        for (let { color: n10 } of r5) {
          let r10 = W("div");
          r10.className = `${t} ${a2}`, r10.style.setProperty("--bgc", n10);
          let i10 = W("div");
          _(r10, i10), _(e10, r10), o10.push(r10);
        }
        return o10;
      })(y10, I, $3);
      for (let [e10, t5] of T(G3)) R9(t5, I[+e10].degree);
      U3 = setTimeout((() => {
        q3 && (y10.innerHTML = "");
      }), H9);
    }
    return V(), { update(e10) {
      let r5 = e10.particleCount ?? i, f4 = e10.particleShape ?? c, g3 = e10.particleSize ?? s, m8 = e10.particleClass ?? l, h2 = e10.colors ?? a, v5 = e10.stageHeight ?? p, x2 = e10.duration ?? o, b8 = e10.force ?? n, P9 = e10.stageWidth ?? u, B8 = e10.destroyAfterDone ?? d;
      I = S(r5, h2);
      let W3 = !1;
      if (r5 === O) {
        G3 = Array.from(y10.querySelectorAll(`.${t}`));
        for (let [e11, { color: t5 }] of T(I)) {
          let r10 = G3[+e11];
          JSON.stringify(A8) !== JSON.stringify(h2) && r10.style.setProperty("--bgc", t5), f4 !== j3 && r10.style.setProperty("--br", Q3(f4, K2()) ? "50%" : "0"), m8 !== $3 && ($3 && r10.classList.remove($3), m8 && r10.classList.add(m8));
        }
      } else W3 = !0;
      q3 && !B8 && clearTimeout(U3), y10.style.setProperty("--sh", v5 + "px"), H9 = x2, A8 = h2, F4 = b8, O = r5, j3 = f4, E3 = g3, $3 = m8, q3 = B8, D = v5, J3 = P9, W3 && V();
    }, destroy() {
      y10.innerHTML = "", clearTimeout(U3);
    } };
  }
  var f = 200, g = 800, m = 0.1, h = 0.3, v = 0.5, x = Math.abs, b = Math.random, P2 = Math.round, B = Math.max, W = (e10) => document.createElement(e10), _ = (e10, t5) => e10.appendChild(t5), S = (e10, t5) => Array.from({ length: e10 }, ((r5, a2) => ({ color: t5[a2 % t5.length], degree: 360 * a2 / e10 }))), w = (e10, t5 = 2) => P2((e10 + Number.EPSILON) * 10 ** t5) / 10 ** t5, C = (e10, t5, r5, a2, o10) => (e10 - t5) * (o10 - a2) / (r5 - t5) + a2, L = (e10, t5) => e10 + t5 > 360 ? e10 + t5 - 360 : e10 + t5, M = () => b() > 0.5, T = Object.entries, N = 6, k = (e10) => e10 !== 1 && M();
  function F({ class: e10, ...t5 }) {
    let r5 = useRef(null), a2 = useRef();
    return useEffect((() => {
      if (typeof window < "u" && r5.current) {
        if (a2.current) return a2.current.update(t5), a2.current.destroy;
        a2.current = y(r5.current, t5);
      }
    }), [t5]), createElement("div", { ref: r5, className: e10 });
  }

  // node_modules/strip-ansi/node_modules/ansi-regex/index.js
  function ansiRegex({ onlyFirst = !1 } = {}) {
    let pattern = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"
    ].join("|");
    return new RegExp(pattern, onlyFirst ? void 0 : "g");
  }

  // node_modules/strip-ansi/index.js
  var regex = ansiRegex();
  function stripAnsi(string) {
    if (typeof string != "string")
      throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
    return string.replace(regex, "");
  }

  // node_modules/filesize/dist/filesize.esm.js
  var ARRAY = "array";
  var BITS = "bits", BYTE = "byte", BYTES = "bytes";
  var EXPONENT = "exponent", FUNCTION = "function";
  var INVALID_NUMBER = "Invalid number", INVALID_ROUND = "Invalid rounding method", JEDEC = "jedec", OBJECT = "object";
  var ROUND = "round";
  var SI_KBIT = "kbit";
  var STRING = "string";
  var STRINGS = {
    symbol: {
      iec: {
        bits: ["bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
        bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
      },
      jedec: {
        bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
        bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      }
    },
    fullform: {
      iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
      jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
    }
  };
  function filesize(arg, {
    bits = !1,
    pad = !1,
    base = -1,
    round = 2,
    locale = "",
    localeOptions = {},
    separator = "",
    spacer = " ",
    symbols = {},
    standard = "",
    output = STRING,
    fullform = !1,
    fullforms = [],
    exponent = -1,
    roundingMethod = ROUND,
    precision = 0
  } = {}) {
    let e10 = exponent, num = Number(arg), result = [], val = 0, u3 = "";
    standard === "si" ? (base = 10, standard = JEDEC) : standard === "iec" || standard === JEDEC ? base = 2 : base === 2 ? standard = "iec" : (base = 10, standard = JEDEC);
    let ceil = base === 10 ? 1e3 : 1024, full = fullform === !0, neg = num < 0, roundingFunc = Math[roundingMethod];
    if (typeof arg != "bigint" && isNaN(arg))
      throw new TypeError(INVALID_NUMBER);
    if (typeof roundingFunc !== FUNCTION)
      throw new TypeError(INVALID_ROUND);
    if (neg && (num = -num), (e10 === -1 || isNaN(e10)) && (e10 = Math.floor(Math.log(num) / Math.log(ceil)), e10 < 0 && (e10 = 0)), e10 > 8 && (precision > 0 && (precision += 8 - e10), e10 = 8), output === EXPONENT)
      return e10;
    if (num === 0)
      result[0] = 0, u3 = result[1] = STRINGS.symbol[standard][bits ? BITS : BYTES][e10];
    else {
      val = num / (base === 2 ? Math.pow(2, e10 * 10) : Math.pow(1e3, e10)), bits && (val = val * 8, val >= ceil && e10 < 8 && (val = val / ceil, e10++));
      let p5 = Math.pow(10, e10 > 0 ? round : 0);
      result[0] = roundingFunc(val * p5) / p5, result[0] === ceil && e10 < 8 && exponent === -1 && (result[0] = 1, e10++), u3 = result[1] = base === 10 && e10 === 1 ? bits ? SI_KBIT : "kB" : STRINGS.symbol[standard][bits ? BITS : BYTES][e10];
    }
    if (neg && (result[0] = -result[0]), precision > 0 && (result[0] = result[0].toPrecision(precision)), result[1] = symbols[result[1]] || result[1], locale === !0 ? result[0] = result[0].toLocaleString() : locale.length > 0 ? result[0] = result[0].toLocaleString(locale, localeOptions) : separator.length > 0 && (result[0] = result[0].toString().replace(".", separator)), pad && round > 0) {
      let i10 = result[0].toString(), x2 = separator || (i10.match(/(\D)/g) || []).pop() || ".", tmp = i10.toString().split(x2), s10 = tmp[1] || "", l2 = s10.length, n10 = round - l2;
      result[0] = `${tmp[0]}${x2}${s10.padEnd(l2 + n10, "0")}`;
    }
    return full && (result[1] = fullforms[e10] ? fullforms[e10] : STRINGS.fullform[standard][e10] + (bits ? "bit" : BYTE) + (result[0] === 1 ? "" : "s")), output === ARRAY ? result : output === OBJECT ? {
      value: result[0],
      symbol: result[1],
      exponent: e10,
      unit: u3
    } : result.join(spacer);
  }

  // node_modules/@chromatic-com/storybook/dist/manager.mjs
  var mp = Object.create, k1 = Object.defineProperty, hp = Object.getOwnPropertyDescriptor, gp = Object.getOwnPropertyNames, vp = Object.getPrototypeOf, yp = Object.prototype.hasOwnProperty, fs = ((e10) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(e10, { get: (t5, r5) => (typeof __require < "u" ? __require : t5)[r5] }) : e10)(function(e10) {
    if (typeof __require < "u") return __require.apply(this, arguments);
    throw new Error('Dynamic require of "' + e10 + '" is not supported');
  }), kr = (e10, t5) => () => (t5 || e10((t5 = { exports: {} }).exports, t5), t5.exports), wp = (e10, t5) => {
    for (var r5 in t5) k1(e10, r5, { get: t5[r5], enumerable: !0 });
  }, bp = (e10, t5, r5, n10) => {
    if (t5 && typeof t5 == "object" || typeof t5 == "function") for (let a2 of gp(t5)) !yp.call(e10, a2) && a2 !== r5 && k1(e10, a2, { get: () => t5[a2], enumerable: !(n10 = hp(t5, a2)) || n10.enumerable });
    return e10;
  }, Jt = (e10, t5, r5) => (r5 = e10 != null ? mp(vp(e10)) : {}, bp(t5 || !e10 || !e10.__esModule ? k1(r5, "default", { value: e10, enumerable: !0 }) : r5, e10)), ti = kr((z1, Z1) => {
    (function(e10, t5) {
      typeof fs == "function" && typeof z1 == "object" && typeof Z1 == "object" ? Z1.exports = t5() : typeof define == "function" && define.amd ? define(function() {
        return t5();
      }) : e10.pluralize = t5();
    })(z1, function() {
      var e10 = [], t5 = [], r5 = {}, n10 = {}, a2 = {};
      function o10(m8) {
        return typeof m8 == "string" ? new RegExp("^" + m8 + "$", "i") : m8;
      }
      function i10(m8, h2) {
        return m8 === h2 ? h2 : m8 === m8.toLowerCase() ? h2.toLowerCase() : m8 === m8.toUpperCase() ? h2.toUpperCase() : m8[0] === m8[0].toUpperCase() ? h2.charAt(0).toUpperCase() + h2.substr(1).toLowerCase() : h2.toLowerCase();
      }
      function l2(m8, h2) {
        return m8.replace(/\$(\d{1,2})/g, function(g3, w2) {
          return h2[w2] || "";
        });
      }
      function d3(m8, h2) {
        return m8.replace(h2[0], function(g3, w2) {
          var y10 = l2(h2[1], arguments);
          return i10(g3 === "" ? m8[w2 - 1] : g3, y10);
        });
      }
      function u3(m8, h2, g3) {
        if (!m8.length || r5.hasOwnProperty(m8)) return h2;
        for (var w2 = g3.length; w2--; ) {
          var y10 = g3[w2];
          if (y10[0].test(h2)) return d3(h2, y10);
        }
        return h2;
      }
      function c10(m8, h2, g3) {
        return function(w2) {
          var y10 = w2.toLowerCase();
          return h2.hasOwnProperty(y10) ? i10(w2, y10) : m8.hasOwnProperty(y10) ? i10(w2, m8[y10]) : u3(y10, w2, g3);
        };
      }
      function p5(m8, h2, g3, w2) {
        return function(y10) {
          var v5 = y10.toLowerCase();
          return h2.hasOwnProperty(v5) ? !0 : m8.hasOwnProperty(v5) ? !1 : u3(v5, v5, g3) === v5;
        };
      }
      function f4(m8, h2, g3) {
        var w2 = h2 === 1 ? f4.singular(m8) : f4.plural(m8);
        return (g3 ? h2 + " " : "") + w2;
      }
      return f4.plural = c10(a2, n10, e10), f4.isPlural = p5(a2, n10, e10), f4.singular = c10(n10, a2, t5), f4.isSingular = p5(n10, a2, t5), f4.addPluralRule = function(m8, h2) {
        e10.push([o10(m8), h2]);
      }, f4.addSingularRule = function(m8, h2) {
        t5.push([o10(m8), h2]);
      }, f4.addUncountableRule = function(m8) {
        if (typeof m8 == "string") {
          r5[m8.toLowerCase()] = !0;
          return;
        }
        f4.addPluralRule(m8, "$0"), f4.addSingularRule(m8, "$0");
      }, f4.addIrregularRule = function(m8, h2) {
        h2 = h2.toLowerCase(), m8 = m8.toLowerCase(), a2[m8] = h2, n10[h2] = m8;
      }, [["I", "we"], ["me", "us"], ["he", "they"], ["she", "they"], ["them", "them"], ["myself", "ourselves"], ["yourself", "yourselves"], ["itself", "themselves"], ["herself", "themselves"], ["himself", "themselves"], ["themself", "themselves"], ["is", "are"], ["was", "were"], ["has", "have"], ["this", "these"], ["that", "those"], ["echo", "echoes"], ["dingo", "dingoes"], ["volcano", "volcanoes"], ["tornado", "tornadoes"], ["torpedo", "torpedoes"], ["genus", "genera"], ["viscus", "viscera"], ["stigma", "stigmata"], ["stoma", "stomata"], ["dogma", "dogmata"], ["lemma", "lemmata"], ["schema", "schemata"], ["anathema", "anathemata"], ["ox", "oxen"], ["axe", "axes"], ["die", "dice"], ["yes", "yeses"], ["foot", "feet"], ["eave", "eaves"], ["goose", "geese"], ["tooth", "teeth"], ["quiz", "quizzes"], ["human", "humans"], ["proof", "proofs"], ["carve", "carves"], ["valve", "valves"], ["looey", "looies"], ["thief", "thieves"], ["groove", "grooves"], ["pickaxe", "pickaxes"], ["passerby", "passersby"]].forEach(function(m8) {
        return f4.addIrregularRule(m8[0], m8[1]);
      }), [[/s?$/i, "s"], [/[^\u0000-\u007F]$/i, "$0"], [/([^aeiou]ese)$/i, "$1"], [/(ax|test)is$/i, "$1es"], [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, "$1es"], [/(e[mn]u)s?$/i, "$1s"], [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, "$1"], [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, "$1i"], [/(alumn|alg|vertebr)(?:a|ae)$/i, "$1ae"], [/(seraph|cherub)(?:im)?$/i, "$1im"], [/(her|at|gr)o$/i, "$1oes"], [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, "$1a"], [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, "$1a"], [/sis$/i, "ses"], [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, "$1$2ves"], [/([^aeiouy]|qu)y$/i, "$1ies"], [/([^ch][ieo][ln])ey$/i, "$1ies"], [/(x|ch|ss|sh|zz)$/i, "$1es"], [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, "$1ices"], [/\b((?:tit)?m|l)(?:ice|ouse)$/i, "$1ice"], [/(pe)(?:rson|ople)$/i, "$1ople"], [/(child)(?:ren)?$/i, "$1ren"], [/eaux$/i, "$0"], [/m[ae]n$/i, "men"], ["thou", "you"]].forEach(function(m8) {
        return f4.addPluralRule(m8[0], m8[1]);
      }), [[/s$/i, ""], [/(ss)$/i, "$1"], [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, "$1fe"], [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, "$1f"], [/ies$/i, "y"], [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, "$1ie"], [/\b(mon|smil)ies$/i, "$1ey"], [/\b((?:tit)?m|l)ice$/i, "$1ouse"], [/(seraph|cherub)im$/i, "$1"], [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, "$1"], [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, "$1sis"], [/(movie|twelve|abuse|e[mn]u)s$/i, "$1"], [/(test)(?:is|es)$/i, "$1is"], [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, "$1us"], [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, "$1um"], [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, "$1on"], [/(alumn|alg|vertebr)ae$/i, "$1a"], [/(cod|mur|sil|vert|ind)ices$/i, "$1ex"], [/(matr|append)ices$/i, "$1ix"], [/(pe)(rson|ople)$/i, "$1rson"], [/(child)ren$/i, "$1"], [/(eau)x?$/i, "$1"], [/men$/i, "man"]].forEach(function(m8) {
        return f4.addSingularRule(m8[0], m8[1]);
      }), ["adulthood", "advice", "agenda", "aid", "aircraft", "alcohol", "ammo", "analytics", "anime", "athletics", "audio", "bison", "blood", "bream", "buffalo", "butter", "carp", "cash", "chassis", "chess", "clothing", "cod", "commerce", "cooperation", "corps", "debris", "diabetes", "digestion", "elk", "energy", "equipment", "excretion", "expertise", "firmware", "flounder", "fun", "gallows", "garbage", "graffiti", "hardware", "headquarters", "health", "herpes", "highjinks", "homework", "housework", "information", "jeans", "justice", "kudos", "labour", "literature", "machinery", "mackerel", "mail", "media", "mews", "moose", "music", "mud", "manga", "news", "only", "personnel", "pike", "plankton", "pliers", "police", "pollution", "premises", "rain", "research", "rice", "salmon", "scissors", "series", "sewage", "shambles", "shrimp", "software", "species", "staff", "swine", "tennis", "traffic", "transportation", "trout", "tuna", "wealth", "welfare", "whiting", "wildebeest", "wildlife", "you", /pok[eé]mon$/i, /[^aeiou]ese$/i, /deer$/i, /fish$/i, /measles$/i, /o[iu]s$/i, /pox$/i, /sheep$/i].forEach(f4.addUncountableRule), f4;
    });
  }), iu = kr((vE, ou) => {
    var Z3 = new Error("Element already at target scroll position"), j3 = new Error("Scroll cancelled"), U3 = Math.min, nu = Date.now;
    ou.exports = { left: au("scrollLeft"), top: au("scrollTop") };
    function au(e10) {
      return function(r5, n10, a2, o10) {
        a2 = a2 || {}, typeof a2 == "function" && (o10 = a2, a2 = {}), typeof o10 != "function" && (o10 = W3);
        var i10 = nu(), l2 = r5[e10], d3 = a2.ease || $3, u3 = isNaN(a2.duration) ? 350 : +a2.duration, c10 = !1;
        return l2 === n10 ? o10(Z3, r5[e10]) : requestAnimationFrame(f4), p5;
        function p5() {
          c10 = !0;
        }
        function f4(m8) {
          if (c10) return o10(j3, r5[e10]);
          var h2 = nu(), g3 = U3(1, (h2 - i10) / u3), w2 = d3(g3);
          r5[e10] = w2 * (n10 - l2) + l2, g3 < 1 ? requestAnimationFrame(f4) : requestAnimationFrame(function() {
            o10(null, r5[e10]);
          });
        }
      };
    }
    function $3(e10) {
      return 0.5 * (1 - Math.cos(Math.PI * e10));
    }
    function W3() {
    }
  }), lu = kr((su, Ri) => {
    (function(e10, t5) {
      typeof define == "function" && define.amd ? define([], t5) : typeof Ri == "object" && Ri.exports ? Ri.exports = t5() : e10.Scrollparent = t5();
    })(su, function() {
      function e10(r5) {
        var n10 = getComputedStyle(r5, null).getPropertyValue("overflow");
        return n10.indexOf("scroll") > -1 || n10.indexOf("auto") > -1;
      }
      function t5(r5) {
        if (r5 instanceof HTMLElement || r5 instanceof SVGElement) {
          for (var n10 = r5.parentNode; n10.parentNode; ) {
            if (e10(n10)) return n10;
            n10 = n10.parentNode;
          }
          return document.scrollingElement || document.documentElement;
        }
      }
      return t5;
    });
  }), uu = kr((yE, du) => {
    var q3 = function(e10) {
      return Object.prototype.hasOwnProperty.call(e10, "props");
    }, G3 = function(e10, t5) {
      return e10 + ao(t5);
    }, ao = function(e10) {
      return e10 === null || typeof e10 == "boolean" || typeof e10 > "u" ? "" : typeof e10 == "number" ? e10.toString() : typeof e10 == "string" ? e10 : Array.isArray(e10) ? e10.reduce(G3, "") : q3(e10) && Object.prototype.hasOwnProperty.call(e10.props, "children") ? ao(e10.props.children) : "";
    };
    ao.default = ao, du.exports = ao;
  }), Hi = kr((wE, fu) => {
    var Q3 = function(t5) {
      return Y3(t5) && !J3(t5);
    };
    function Y3(e10) {
      return !!e10 && typeof e10 == "object";
    }
    function J3(e10) {
      var t5 = Object.prototype.toString.call(e10);
      return t5 === "[object RegExp]" || t5 === "[object Date]" || eh(e10);
    }
    var K3 = typeof Symbol == "function" && Symbol.for, X3 = K3 ? /* @__PURE__ */ Symbol.for("react.element") : 60103;
    function eh(e10) {
      return e10.$$typeof === X3;
    }
    function th(e10) {
      return Array.isArray(e10) ? [] : {};
    }
    function oo(e10, t5) {
      return t5.clone !== !1 && t5.isMergeableObject(e10) ? wa(th(e10), e10, t5) : e10;
    }
    function rh(e10, t5, r5) {
      return e10.concat(t5).map(function(n10) {
        return oo(n10, r5);
      });
    }
    function nh(e10, t5) {
      if (!t5.customMerge) return wa;
      var r5 = t5.customMerge(e10);
      return typeof r5 == "function" ? r5 : wa;
    }
    function ah(e10) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(e10).filter(function(t5) {
        return Object.propertyIsEnumerable.call(e10, t5);
      }) : [];
    }
    function cu(e10) {
      return Object.keys(e10).concat(ah(e10));
    }
    function pu(e10, t5) {
      try {
        return t5 in e10;
      } catch {
        return !1;
      }
    }
    function oh(e10, t5) {
      return pu(e10, t5) && !(Object.hasOwnProperty.call(e10, t5) && Object.propertyIsEnumerable.call(e10, t5));
    }
    function ih(e10, t5, r5) {
      var n10 = {};
      return r5.isMergeableObject(e10) && cu(e10).forEach(function(a2) {
        n10[a2] = oo(e10[a2], r5);
      }), cu(t5).forEach(function(a2) {
        oh(e10, a2) || (pu(e10, a2) && r5.isMergeableObject(t5[a2]) ? n10[a2] = nh(a2, r5)(e10[a2], t5[a2], r5) : n10[a2] = oo(t5[a2], r5));
      }), n10;
    }
    function wa(e10, t5, r5) {
      r5 = r5 || {}, r5.arrayMerge = r5.arrayMerge || rh, r5.isMergeableObject = r5.isMergeableObject || Q3, r5.cloneUnlessOtherwiseSpecified = oo;
      var n10 = Array.isArray(t5), a2 = Array.isArray(e10), o10 = n10 === a2;
      return o10 ? n10 ? r5.arrayMerge(e10, t5, r5) : ih(e10, t5, r5) : oo(t5, r5);
    }
    wa.all = function(t5, r5) {
      if (!Array.isArray(t5)) throw new Error("first argument should be an array");
      return t5.reduce(function(n10, a2) {
        return wa(n10, a2, r5);
      }, {});
    };
    var sh = wa;
    fu.exports = sh;
  }), hu = kr((bE, mu) => {
    var lh = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    mu.exports = lh;
  }), wu = kr((SE, yu) => {
    var dh = hu();
    function gu() {
    }
    function vu() {
    }
    vu.resetWarningCache = gu, yu.exports = function() {
      function e10(n10, a2, o10, i10, l2, d3) {
        if (d3 !== dh) {
          var u3 = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
          throw u3.name = "Invariant Violation", u3;
        }
      }
      e10.isRequired = e10;
      function t5() {
        return e10;
      }
      var r5 = { array: e10, bigint: e10, bool: e10, func: e10, number: e10, object: e10, string: e10, symbol: e10, any: e10, arrayOf: t5, element: e10, elementType: e10, instanceOf: t5, node: e10, objectOf: t5, oneOf: t5, oneOfType: t5, shape: t5, exact: t5, checkPropTypes: vu, resetWarningCache: gu };
      return r5.PropTypes = r5, r5;
    };
  }), Su = kr((kE, bu) => {
    bu.exports = wu()();
  }), ms = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.25 4.254a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm-.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M13 1.504v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5zM2 9.297V2.004h10v5.293L9.854 5.15a.5.5 0 00-.708 0L6.5 7.797 5.354 6.65a.5.5 0 00-.708 0L2 9.297zM9.5 6.21l2.5 2.5v3.293H2V10.71l3-3 3.146 3.146a.5.5 0 00.708-.707L7.207 8.504 9.5 6.21z", fill: e10 }))), Bo = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3 3.004H.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-2.5h2.5a.5.5 0 00.5-.5v-10a.5.5 0 00-.5-.5h-10a.5.5 0 00-.5.5v2.5zm1 1v2.293l2.293-2.293H4zm-1 0v6.5a.499.499 0 00.497.5H10v2H1v-9h2zm1-1h6.5a.499.499 0 01.5.5v6.5h2v-9H4v2zm6 7V7.71l-2.293 2.293H10zm0-3.707V4.71l-5.293 5.293h1.586L10 6.297zm-.707-2.293H7.707L4 7.71v1.586l5.293-5.293z", fill: e10 }))), hs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("g", { clipPath: "url(#prefix__clip0_2359_559)", fillRule: "evenodd", clipRule: "evenodd", fill: e10 }, createElement("path", { d: "M3 3.004H.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h7.176a4.526 4.526 0 01-.916-1H1v-9h2v6.5a.499.499 0 00.497.5h2.531a4.548 4.548 0 01-.001-1h-1.32l2.16-2.16c.274-.374.603-.703.977-.977L10 4.711v1.316a4.552 4.552 0 011 0V3.504a.48.48 0 00-.038-.191.5.5 0 00-.462-.31H4v-2h9v5.755c.378.253.715.561 1 .913V.504a.5.5 0 00-.5-.5h-10a.5.5 0 00-.5.5v2.5zm1 1v2.293l2.293-2.293H4zm5.293 0H7.707L4 7.71v1.586l5.293-5.293z" }), createElement("path", { d: "M14 10.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-5.5 0A.5.5 0 019 10h3a.5.5 0 010 1H9a.5.5 0 01-.5-.5z" })), createElement("defs", null, createElement("clipPath", { id: "prefix__clip0_2359_559" }, createElement("path", { fill: "#fff", d: "M0 0h14v14H0z" }))))), Ir = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M12.813 7.425l-9.05 5.603A.5.5 0 013 12.603V1.398a.5.5 0 01.763-.425l9.05 5.602a.5.5 0 010 .85z", fill: e10 }))), gs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11z", fill: e10 }))), vs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.2 10.88L10.668 7 4.2 3.12v7.76zM3 2.414v9.174a.8.8 0 001.212.686l7.645-4.587a.8.8 0 000-1.372L4.212 1.727A.8.8 0 003 2.413z", fill: e10 }))), ys = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M4.5 4a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-5z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z", fill: e10 }))), ws = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M4 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM4.5 7.5a.5.5 0 000 1h5a.5.5 0 000-1h-5zM4 10.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M1.5 0a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V3.207a.5.5 0 00-.146-.353L10.146.146A.5.5 0 009.793 0H1.5zM2 1h7.5v2a.5.5 0 00.5.5h2V13H2V1z", fill: e10 }))), bs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M6 7a3 3 0 110-6h5.5a.5.5 0 010 1H10v10.5a.5.5 0 01-1 0V2H7v10.5a.5.5 0 01-1 0V7z", fill: e10 }))), Ss = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0 7a7 7 0 1014 0A7 7 0 000 7zm5.215-3.869a1.967 1.967 0 013.747.834v1.283l-3.346-1.93a2.486 2.486 0 00-.401-.187zm3.484 2.58l-3.346-1.93a1.968 1.968 0 00-2.685.72 1.954 1.954 0 00.09 2.106 2.45 2.45 0 01.362-.254l1.514-.873a.27.27 0 01.268 0l2.1 1.21 1.697-.978zm-.323 4.972L6.86 9.81a.268.268 0 01-.134-.231V7.155l-1.698-.98v3.86a1.968 1.968 0 003.747.835 2.488 2.488 0 01-.4-.187zm.268-.464a1.967 1.967 0 002.685-.719 1.952 1.952 0 00-.09-2.106c-.112.094-.233.18-.361.253L7.53 9.577l1.113.642zm-4.106.257a1.974 1.974 0 01-1.87-.975A1.95 1.95 0 012.47 8.01c.136-.507.461-.93.916-1.193L4.5 6.175v3.86c0 .148.013.295.039.44zM11.329 4.5a1.973 1.973 0 00-1.87-.976c.025.145.039.292.039.44v1.747a.268.268 0 01-.135.232l-2.1 1.211v1.96l3.346-1.931a1.966 1.966 0 00.72-2.683z", fill: e10 }))), xs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M5.586 5.586A2 2 0 018.862 7.73a.5.5 0 10.931.365 3 3 0 10-1.697 1.697.5.5 0 10-.365-.93 2 2 0 01-2.145-3.277z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M.939 6.527c.127.128.19.297.185.464a.635.635 0 01-.185.465L0 8.395a7.099 7.099 0 001.067 2.572h1.32c.182 0 .345.076.46.197a.635.635 0 01.198.46v1.317A7.097 7.097 0 005.602 14l.94-.94a.634.634 0 01.45-.186H7.021c.163 0 .326.061.45.186l.939.938a7.098 7.098 0 002.547-1.057V11.61c0-.181.075-.344.197-.46a.634.634 0 01.46-.197h1.33c.507-.76.871-1.622 1.056-2.55l-.946-.946a.635.635 0 01-.186-.465.635.635 0 01.186-.464l.943-.944a7.099 7.099 0 00-1.044-2.522h-1.34a.635.635 0 01-.46-.197.635.635 0 01-.196-.46V1.057A7.096 7.096 0 008.413.002l-.942.942a.634.634 0 01-.45.186H6.992a.634.634 0 01-.45-.186L5.598 0a7.097 7.097 0 00-2.553 1.058v1.33c0 .182-.076.345-.197.46a.635.635 0 01-.46.198h-1.33A7.098 7.098 0 00.003 5.591l.936.936zm.707 1.636c.324-.324.482-.752.479-1.172a1.634 1.634 0 00-.48-1.171l-.538-.539c.126-.433.299-.847.513-1.235h.768c.459 0 .873-.19 1.167-.49.3-.295.49-.708.49-1.167v-.77c.39-.215.807-.388 1.243-.515l.547.547c.32.32.742.48 1.157.48l.015-.001h.014c.415 0 .836-.158 1.157-.479l.545-.544c.433.126.846.299 1.234.512v.784c0 .46.19.874.49 1.168.294.3.708.49 1.167.49h.776c.209.382.378.788.502 1.213l-.545.546a1.635 1.635 0 00-.48 1.17c-.003.421.155.849.48 1.173l.549.55c-.126.434-.3.85-.513 1.239h-.77c-.458 0-.872.19-1.166.49-.3.294-.49.708-.49 1.167v.77a6.09 6.09 0 01-1.238.514l-.54-.54a1.636 1.636 0 00-1.158-.48H6.992c-.415 0-.837.159-1.157.48l-.543.543a6.091 6.091 0 01-1.247-.516v-.756c0-.459-.19-.873-.49-1.167-.294-.3-.708-.49-1.167-.49h-.761a6.094 6.094 0 01-.523-1.262l.542-.542z", fill: e10 }))), Cs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M4 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM13 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM7 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z", fill: e10 }))), ks = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M5.903.112a.107.107 0 01.194 0l.233.505.552.066c.091.01.128.123.06.185l-.408.377.109.546a.107.107 0 01-.158.114L6 1.633l-.486.272a.107.107 0 01-.157-.114l.108-.546-.408-.377a.107.107 0 01.06-.185L5.67.617l.233-.505zM2.194.224a.214.214 0 00-.389 0l-.466 1.01-1.104.13a.214.214 0 00-.12.371l.816.755-.217 1.091a.214.214 0 00.315.23L2 3.266l.971.543c.16.09.35-.05.315-.229l-.217-1.09.817-.756a.214.214 0 00-.12-.37L2.66 1.234 2.194.224zM12.194 8.224a.214.214 0 00-.389 0l-.466 1.01-1.104.13a.214.214 0 00-.12.371l.816.755-.217 1.091a.214.214 0 00.315.23l.97-.544.971.543c.16.09.35-.05.315-.229l-.217-1.09.817-.756a.214.214 0 00-.12-.37l-1.105-.131-.466-1.01z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M.147 11.857a.5.5 0 010-.707l11-11a.5.5 0 01.706 0l2 2a.5.5 0 010 .708l-11 11a.5.5 0 01-.706 0l-2-2zm2.353.94l-1.293-1.293 6.758-6.758L9.258 6.04 2.5 12.797zm7.465-7.465l2.828-2.828L11.5 1.211 8.672 4.039l1.293 1.293z", fill: e10 }))), Rn = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M13.854 3.354a.5.5 0 00-.708-.708L5 10.793.854 6.646a.5.5 0 10-.708.708l4.5 4.5a.5.5 0 00.708 0l8.5-8.5z", fill: e10 }))), I1 = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M11.5 2a.5.5 0 000 1h2a.5.5 0 000-1h-2zM9.3 2.6a.5.5 0 01.1.7l-5.995 7.993a.505.505 0 01-.37.206.5.5 0 01-.395-.152L.146 8.854a.5.5 0 11.708-.708l2.092 2.093L8.6 2.7a.5.5 0 01.7-.1zM11 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2A.5.5 0 0111 7zM11.5 11a.5.5 0 000 1h2a.5.5 0 000-1h-2z", fill: e10 }))), Is = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M7 3a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 017 3z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z", fill: e10 }))), Hn = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M9.854 4.146a.5.5 0 010 .708L7.707 7l2.147 2.146a.5.5 0 01-.708.708L7 7.707 4.854 9.854a.5.5 0 01-.708-.708L6.293 7 4.146 4.854a.5.5 0 11.708-.708L7 6.293l2.146-2.147a.5.5 0 01.708 0z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z", fill: e10 }))), Es = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 14A7 7 0 107 0a7 7 0 000 14zm3.854-9.354a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708 0l-2.5-2.5a.5.5 0 11.708-.708L6 8.793l4.146-4.147a.5.5 0 01.708 0z", fill: e10 }))), Ts = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 14A7 7 0 107 0a7 7 0 000 14zM3.5 6.5a.5.5 0 000 1h7a.5.5 0 000-1h-7z", fill: e10 }))), Bt = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 14A7 7 0 107 0a7 7 0 000 14zm2.854-9.854a.5.5 0 010 .708L7.707 7l2.147 2.146a.5.5 0 01-.708.708L7 7.707 4.854 9.854a.5.5 0 01-.708-.708L6.293 7 4.146 4.854a.5.5 0 11.708-.708L7 6.293l2.146-2.147a.5.5 0 01.708 0z", fill: e10 }))), Ms = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 15", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M8 8.004a1 1 0 01-.5.866v1.634a.5.5 0 01-1 0V8.87A1 1 0 118 8.004z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3 4.004a4 4 0 118 0v1h1.5a.5.5 0 01.5.5v8a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-8a.5.5 0 01.5-.5H3v-1zm7 1v-1a3 3 0 10-6 0v1h6zm2 1H2v7h10v-7z", fill: e10 }))), Ls = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 13A6 6 0 107 1a6 6 0 000 12zm0 1A7 7 0 107 0a7 7 0 000 14z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 5.5a.5.5 0 01.5.5v4.5a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z", fill: e10 }), createElement("path", { d: "M7.75 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z", fill: e10 }))), _o = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M5.25 5.25A1.75 1.75 0 117 7a.5.5 0 00-.5.5V9a.5.5 0 001 0V7.955A2.75 2.75 0 104.25 5.25a.5.5 0 001 0zM7 11.5A.75.75 0 107 10a.75.75 0 000 1.5z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z", fill: e10 }))), As = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M7 4.5a.5.5 0 01.5.5v3.5a.5.5 0 11-1 0V5a.5.5 0 01.5-.5zM7.75 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.206 1.045a.498.498 0 01.23.209l6.494 10.992a.5.5 0 01-.438.754H.508a.497.497 0 01-.506-.452.498.498 0 01.072-.31l6.49-10.984a.497.497 0 01.642-.21zM7 2.483L1.376 12h11.248L7 2.483z", fill: e10 }))), Bs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M2 1.004a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-4.5a.5.5 0 00-1 0v4.5H2v-10h4.5a.5.5 0 000-1H2z", fill: e10 }), createElement("path", { d: "M7.354 7.357L12 2.711v1.793a.5.5 0 001 0v-3a.5.5 0 00-.5-.5h-3a.5.5 0 100 1h1.793L6.646 6.65a.5.5 0 10.708.707z", fill: e10 }))), _s = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("g", { clipPath: "url(#prefix__clip0_1449_588)" }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.414 1.586a2 2 0 00-2.828 0l-4 4a2 2 0 000 2.828l4 4a2 2 0 002.828 0l4-4a2 2 0 000-2.828l-4-4zm.707-.707a3 3 0 00-4.242 0l-4 4a3 3 0 000 4.242l4 4a3 3 0 004.242 0l4-4a3 3 0 000-4.242l-4-4z", fill: e10 })), createElement("defs", null, createElement("clipPath", { id: "prefix__clip0_1449_588" }, createElement("path", { fill: "#fff", d: "M0 0h14v14H0z" }))))), Fs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M1.146 4.604l5.5 5.5a.5.5 0 00.708 0l5.5-5.5a.5.5 0 00-.708-.708L7 9.043 1.854 3.896a.5.5 0 10-.708.708z", fill: e10 }))), Ps = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M2.76 7.096a.498.498 0 00.136.258l5.5 5.5a.5.5 0 00.707-.708L3.958 7l5.147-5.146a.5.5 0 10-.708-.708l-5.5 5.5a.5.5 0 00-.137.45z", fill: e10 }))), Os = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M11.104 7.354l-5.5 5.5a.5.5 0 01-.708-.708L10.043 7 4.896 1.854a.5.5 0 11.708-.708l5.5 5.5a.5.5 0 010 .708z", fill: e10 }))), Ns = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M3.854 4.896a.5.5 0 10-.708.708l3.5 3.5a.5.5 0 00.708 0l3.5-3.5a.5.5 0 00-.708-.708L7 8.043 3.854 4.896z", fill: e10 }))), Rs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M10.646 2.646a.5.5 0 01.708 0l1.5 1.5a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708-.708L11.293 5H1.5a.5.5 0 010-1h9.793l-.647-.646a.5.5 0 010-.708zM3.354 8.354L2.707 9H12.5a.5.5 0 010 1H2.707l.647.646a.5.5 0 01-.708.708l-1.5-1.5a.5.5 0 010-.708l1.5-1.5a.5.5 0 11.708.708z", fill: e10 }))), Hs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M1.146 3.854a.5.5 0 010-.708l2-2a.5.5 0 11.708.708L2.707 3h6.295A4 4 0 019 11H3a.5.5 0 010-1h6a3 3 0 100-6H2.707l1.147 1.146a.5.5 0 11-.708.708l-2-2z", fill: e10 }))), Fo = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M5.5 1A.5.5 0 005 .5H2a.5.5 0 000 1h1.535a6.502 6.502 0 002.383 11.91.5.5 0 10.165-.986A5.502 5.502 0 014.5 2.1V4a.5.5 0 001 0V1.353a.5.5 0 000-.023V1zM7.507 1a.5.5 0 01.576-.41 6.502 6.502 0 012.383 11.91H12a.5.5 0 010 1H9a.5.5 0 01-.5-.5v-3a.5.5 0 011 0v1.9A5.5 5.5 0 007.917 1.576.5.5 0 017.507 1z", fill: e10 }))), Ds = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M0 7a7 7 0 1114 0A7 7 0 010 7zm6.5 3.5v2.48A6.001 6.001 0 011.02 7.5H3.5a.5.5 0 000-1H1.02A6.001 6.001 0 016.5 1.02V3.5a.5.5 0 001 0V1.02a6.001 6.001 0 015.48 5.48H10.5a.5.5 0 000 1h2.48a6.002 6.002 0 01-5.48 5.48V10.5a.5.5 0 00-1 0z", fill: e10 }))), Vs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { d: "M7.5 4.5a.5.5 0 00-1 0v2.634a1 1 0 101 0V4.5z", fill: e10 }), createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M5.5.5A.5.5 0 016 0h2a.5.5 0 010 1h-.5v1.02a5.973 5.973 0 013.374 1.398l.772-.772a.5.5 0 01.708.708l-.772.772A6 6 0 116.5 2.02V1H6a.5.5 0 01-.5-.5zM7 3a5 5 0 100 10A5 5 0 007 3z", fill: e10 }))), zs = forwardRef(({ color: e10 = "currentColor", size: t5 = 14, ...r5 }, n10) => createElement("svg", { width: t5, height: t5, viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ref: n10, ...r5 }, createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M14 7A7 7 0 110 7a7 7 0 0114 0zM2.671 11.155c.696-1.006 2.602-1.816 3.194-1.91.226-.036.232-.658.232-.658s-.665-.658-.81-1.544c-.39 0-.63-.94-.241-1.272a2.578 2.578 0 00-.012-.13c-.066-.607-.28-2.606 1.965-2.606 2.246 0 2.031 2 1.966 2.606l-.012.13c.39.331.149 1.272-.24 1.272-.146.886-.81 1.544-.81 1.544s.004.622.23.658c.593.094 2.5.904 3.195 1.91a6 6 0 10-8.657 0z", fill: e10 }))), z = "chromaui/addon-visual-tests", _t = `${z}/panel`, Ha = `${z}/test-provider`, Dn = `${z}/configInfo`, E1 = `${z}/configInfoDismissed`, Zs = `${z}/gitInfo`, Po = `${z}/gitInfoError`, Oo = `${z}/projectInfo`, No = `${z}/isOffline`, Da = `${z}/isOutdated`, js = `${z}/startBuild`, Us = `${z}/stopBuild`, Ro = `${z}/localBuildProgress`, $s = `${z}/selectedModeName`, Ws = `${z}/selectedBrowserId`, qs = `${z}/telemetry`, T1 = `${z}/enableFilter`, Ho = `${z}/removeAddon`, Gs = "chromatic", Vn = "highlightIgnored", Qs = `${z}/highlightIgnored/count`, Ys = `${z}/highlightIgnored/select`, Js = ['[data-chromatic="ignore"]', '[class~="chromatic-ignore"]'], Ks = `${z}/ChannelFetch/aborted`, Xs = `${z}ChannelFetch/request`, el = `${z}ChannelFetch/response`, tl = { autoAcceptChanges: !1, exitOnceUploaded: !1, exitZeroOnChanges: !0, forceRebuild: !0, fromCI: !1, interactive: !1, isLocalBuild: !0, logPrefix: "\x1B[38;5;202mChromatic\x1B[0m:", skip: !1, skipUpdateCheck: !0, storybookBuildDir: void 0 }, Do = "https://www.chromatic.com/docs/visual-tests-addon", Ip = ({ enabled: e10, ignoreCount: t5, locked: r5, onToggle: n10 }) => t5 === 0 ? null : react_default.createElement(IconButton, { key: Vn, active: e10, ariaLabel: r5 ? `Highlights ${e10 ? "enabled" : "disabled"} by story globals` : `${e10 ? "Hide" : "Show"} ignored areas`, padding: "small", variant: "ghost", disabled: r5, onClick: n10 }, react_default.createElement(hs, null), t5), rl = () => {
    let [e10, t5, r5] = useGlobals(), [n10, a2] = useState(0), o10 = !!e10[Vn], i10 = Vn in r5;
    return useChannel({ [Qs]: a2 }, []), react_default.createElement(Ip, { enabled: o10, ignoreCount: n10, locked: i10, onToggle: () => t5({ [Vn]: !e10[Vn] }) });
  }, Ze = (e10, t5) => {
    let r5 = useContext(e10);
    if (r5 == null) throw new Error(`Missing context value for ${t5}`);
    return r5;
  }, nl = createContext(null), al = ({ children: e10, value: t5 }) => react_default.createElement(nl.Provider, { value: t5 }, e10), zn = () => Ze(nl, "AuthState"), ol = { user: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0ZM2.67 11.15c.7-1 2.6-1.81 3.2-1.9.22-.04.23-.66.23-.66s-.67-.66-.81-1.55c-.4 0-.63-.94-.24-1.27l-.02-.13c-.06-.6-.28-2.6 1.97-2.6s2.03 2 1.97 2.6l-.02.13c.4.33.15 1.27-.24 1.27-.14.89-.8 1.55-.8 1.55s0 .62.22.66c.6.09 2.5.9 3.2 1.9a6 6 0 1 0-8.66 0Z" })), useralt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.27 13.16a11.39 11.39 0 0 0 5.18-1.23v-.25c0-1.57-3.24-3-4.1-3.13-.27-.05-.28-.79-.28-.79s.8-.78.96-1.83c.47 0 .75-1.12.29-1.52.02-.41.6-3.25-2.32-3.25S4.65 4 4.67 4.41c-.46.4-.17 1.52.29 1.52.17 1.05.96 1.83.96 1.83s0 .74-.27.79c-.86.13-4.04 1.53-4.1 3.08a11.44 11.44 0 0 0 5.72 1.53Z" })), useradd: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.18 11.9c-.4-.17-.8-.36-1.18-.58.06-1.44 3.02-2.74 3.82-2.87.25-.04.26-.73.26-.73s-.74-.73-.9-1.7c-.43 0-.7-1.05-.27-1.42l-.01-.14c-.07-.67-.31-2.88 2.18-2.88 2.48 0 2.24 2.2 2.17 2.88l-.01.14c.43.37.16 1.41-.27 1.41-.16.98-.9 1.71-.9 1.71s.01.69.26.73c.8.13 3.82 1.46 3.82 2.91v.24a10.63 10.63 0 0 1-8.97.3ZM11.5 2.16c.28 0 .5.22.5.5v1.5h1.5a.5.5 0 0 1 0 1H12v1.5a.5.5 0 0 1-1 0v-1.5H9.5a.5.5 0 1 1 0-1H11v-1.5c0-.28.22-.5.5-.5Z" })), users: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M9.21 11.62A10.59 10.59 0 0 1 0 11.07c.06-1.35 2.93-2.58 3.7-2.7.25-.03.26-.68.26-.68s-.72-.69-.87-1.6c-.42 0-.68-.99-.26-1.33 0-.03 0-.08-.02-.14-.07-.63-.3-2.71 2.12-2.71 2.41 0 2.18 2.08 2.11 2.71l-.01.14c.42.34.16 1.32-.26 1.32-.16.92-.87 1.6-.87 1.6s0 .66.25.7c.78.11 3.7 1.36 3.7 2.73v.22l-.64.3Z" }), react_default.createElement("path", { d: "M8.81 8.42a9.64 9.64 0 0 0-.74-.4 5.2 5.2 0 0 1 1.7-.76c.17-.02.17-.47.17-.47s-.49-.47-.6-1.1c-.28 0-.46-.68-.17-.91l-.01-.1c-.05-.43-.2-1.86 1.45-1.86 1.66 0 1.5 1.43 1.45 1.86v.1c.28.23.1.9-.18.9-.11.64-.6 1.11-.6 1.11s0 .45.17.47c.54.08 2.55.94 2.55 1.89v.62a10.6 10.6 0 0 1-3.3.56 2.97 2.97 0 0 0-.58-.88c-.37-.41-.85-.76-1.31-1.03Z" })), profile: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M9.1 7.35a5.06 5.06 0 0 1-4.52-.28C4.6 6.4 6.02 5.77 6.4 5.7c.12-.02.12-.35.12-.35s-.35-.34-.43-.81c-.2 0-.33-.5-.12-.67l-.01-.07C5.93 3.48 5.81 2.42 7 2.42S8.07 3.48 8.04 3.8v.07c.2.17.07.67-.13.67-.08.47-.43.81-.43.81s0 .33.12.35c.38.06 1.82.7 1.82 1.4v.1c-.1.06-.2.1-.31.15Zm-5.35 3.9c0-.14.11-.25.25-.25h6a.25.25 0 1 1 0 .5H4a.25.25 0 0 1-.25-.25ZM4 9a.25.25 0 0 0 0 .5h6a.25.25 0 1 0 0-.5H4Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1 .5c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v13a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V.5ZM2 13V1h10v12H2Z" })), facehappy: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.97 8.75a.5.5 0 0 0-.87.5 4.5 4.5 0 0 0 7.8 0 .5.5 0 1 0-.87-.5 3.5 3.5 0 0 1-6.06 0ZM5.5 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9.5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), faceneutral: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5ZM5.5 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9.5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), facesad: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.97 10.25a.5.5 0 0 1-.87-.5 4.5 4.5 0 0 1 7.8 0 .5.5 0 1 1-.87.5 3.5 3.5 0 0 0-6.06 0ZM5.5 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9.5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), accessibility: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.53 4.84a.5.5 0 0 1 .63-.31l2.05.68a2.5 2.5 0 0 0 1.58 0l2.05-.68a.5.5 0 0 1 .32.94L7.7 6.3a.3.3 0 0 0-.21.29v.24c0 .7.16 1.39.48 2.01l.97 1.95a.5.5 0 1 1-.9.44L7 9.12l-1.05 2.1a.5.5 0 1 1-.9-.44l.97-1.95a4.5 4.5 0 0 0 .48-2.01v-.24a.3.3 0 0 0-.2-.29l-2.46-.82a.5.5 0 0 1-.31-.63Z" }), react_default.createElement("path", { d: "M7 4.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm0-1A6 6 0 1 0 7 1a6 6 0 0 0 0 12Z" })), accessibilityalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14ZM8 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM3.53 4.84a.5.5 0 0 1 .63-.31l2.05.68a2.5 2.5 0 0 0 1.58 0l2.05-.68a.5.5 0 0 1 .32.94L7.7 6.3a.3.3 0 0 0-.21.29v.24c0 .7.16 1.39.48 2.01l.97 1.95a.5.5 0 1 1-.9.44L7 9.12l-1.05 2.1a.5.5 0 1 1-.9-.44l.97-1.95a4.5 4.5 0 0 0 .48-2.01v-.24a.3.3 0 0 0-.2-.29l-2.46-.82a.5.5 0 0 1-.31-.63Z" })), arrowup: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m7.35 2.9 5.5 5.5a.5.5 0 0 1-.7.7L7 3.96 1.85 9.1a.5.5 0 1 1-.7-.7l5.5-5.5c.2-.2.5-.2.7 0Z" })), arrowdown: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m1.15 5.6 5.5 5.5c.2.2.5.2.7 0l5.5-5.5a.5.5 0 0 0-.7-.7L7 10.04 1.85 4.9a.5.5 0 1 0-.7.7Z" })), arrowleft: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.76 7.1c.02.09.06.18.14.25l5.5 5.5a.5.5 0 0 0 .7-.7L3.96 7 9.1 1.85a.5.5 0 1 0-.7-.7l-5.5 5.5a.5.5 0 0 0-.14.45Z" })), arrowright: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m11.1 7.35-5.5 5.5a.5.5 0 0 1-.7-.7L10.04 7 4.9 1.85a.5.5 0 1 1 .7-.7l5.5 5.5c.2.2.2.5 0 .7Z" })), arrowupalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.85 4.65 7.35.15a.5.5 0 0 0-.7 0l-4.5 4.5a.5.5 0 1 0 .7.7L6.5 1.71V13.5a.5.5 0 0 0 1 0V1.7l3.65 3.65a.5.5 0 0 0 .7-.7Z" })), arrowdownalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.5.5a.5.5 0 0 0-1 0v11.8L2.85 8.64a.5.5 0 1 0-.7.7l4.5 4.5A.5.5 0 0 0 7 14a.5.5 0 0 0 .35-.15l4.5-4.5a.5.5 0 0 0-.7-.7L7.5 12.29V.5Z" })), arrowleftalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.35 2.15c.2.2.2.5 0 .7L1.71 6.5H13.5a.5.5 0 0 1 0 1H1.7l3.65 3.65a.5.5 0 0 1-.7.7l-4.5-4.5a.5.5 0 0 1 0-.7l4.5-4.5c.2-.2.5-.2.7 0Z" })), arrowrightalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M8.65 2.15c.2-.2.5-.2.7 0l4.5 4.5c.2.2.2.5 0 .7l-4.5 4.5a.5.5 0 0 1-.7-.7l3.64-3.65H.5a.5.5 0 0 1 0-1h11.8L8.64 2.85a.5.5 0 0 1 0-.7Z" })), expandalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m7.35.15 4 4a.5.5 0 0 1-.7.7L7 1.21 3.35 4.85a.5.5 0 1 1-.7-.7l4-4c.2-.2.5-.2.7 0ZM11.35 9.15c.2.2.2.5 0 .7l-4 4a.5.5 0 0 1-.7 0l-4-4a.5.5 0 1 1 .7-.7L7 12.79l3.65-3.64c.2-.2.5-.2.7 0Z" })), collapse: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.354.146a.5.5 0 1 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0-.708-.708L7 3.793 3.354.146Zm3.292 9a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1-.708.708L7 10.207l-3.646 3.647a.5.5 0 0 1-.708-.708l4-4Z" })), expand: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.5 1h2a.5.5 0 0 1 0 1h-.8l3.15 3.15a.5.5 0 1 1-.7.7L2 2.71v.79a.5.5 0 0 1-1 0v-2c0-.28.22-.5.5-.5ZM10 1.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5v2a.5.5 0 0 1-1 0v-.8L8.85 5.86a.5.5 0 1 1-.7-.7L11.29 2h-.79a.5.5 0 0 1-.5-.5ZM12.5 10c.28 0 .5.22.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h.8L8.14 8.85a.5.5 0 1 1 .7-.7L12 11.29v-.79c0-.28.22-.5.5-.5ZM2 11.3v-.8a.5.5 0 0 0-1 0v2c0 .28.22.5.5.5h2a.5.5 0 0 0 0-1h-.8l3.15-3.15a.5.5 0 1 0-.7-.7L2 11.29Z" })), unfold: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m6.65.15-1.5 1.5a.5.5 0 1 0 .7.7l.65-.64V5a.5.5 0 0 0 1 0V1.7l.65.65a.5.5 0 1 0 .7-.7L7.35.15a.5.5 0 0 0-.7 0Z" }), react_default.createElement("path", { d: "M1.3 4.04a.5.5 0 0 0-.16.82L3.3 7 1.15 9.15a.5.5 0 0 0 .35.85h3a.5.5 0 0 0 0-1H2.7l1.5-1.5h5.6l2.35 2.35a.5.5 0 0 0 .7-.7L10.71 7l2.14-2.15.11-.54-.1.54A.5.5 0 0 0 13 4.5a.5.5 0 0 0-.14-.35.5.5 0 0 0-.36-.15h-3a.5.5 0 0 0 0 1h1.8L9.8 6.5H4.2L2.7 5h1.8a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.2.04Z" }), react_default.createElement("path", { d: "M7 8.5c.28 0 .5.22.5.5v3.3l.65-.65a.5.5 0 0 1 .7.7l-1.5 1.5a.5.5 0 0 1-.7 0l-1.5-1.5a.5.5 0 0 1 .7-.7l.65.64V9c0-.28.22-.5.5-.5ZM9 9.5c0-.28.22-.5.5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z" })), transfer: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.65 2.65c.2-.2.5-.2.7 0l1.5 1.5c.2.2.2.5 0 .7l-1.5 1.5a.5.5 0 0 1-.7-.7l.64-.65H1.5a.5.5 0 0 1 0-1h9.8l-.65-.65a.5.5 0 0 1 0-.7ZM3.35 8.35 2.71 9h9.79a.5.5 0 0 1 0 1H2.7l.65.65a.5.5 0 0 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5a.5.5 0 1 1 .7.7Z" })), redirect: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.5 1c.28 0 .5.22.5.5V10a2 2 0 0 0 4 0V4a3 3 0 0 1 6 0v7.8l1.15-1.15a.5.5 0 0 1 .7.7l-2 2a.5.5 0 0 1-.7 0l-2-2a.5.5 0 0 1 .7-.7L11 11.79V4a2 2 0 1 0-4 0v6a3 3 0 0 1-6 0V1.5c0-.28.22-.5.5-.5Z" })), undo: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.15 3.85a.5.5 0 0 1 0-.7l2-2a.5.5 0 1 1 .7.7L2.71 3H9a4 4 0 0 1 0 8H3a.5.5 0 0 1 0-1h6a3 3 0 1 0 0-6H2.7l1.15 1.15a.5.5 0 1 1-.7.7l-2-2Z" })), reply: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4.35 2.15c.2.2.2.5 0 .7L1.71 5.5H9.5A4.5 4.5 0 0 1 14 10v1.5a.5.5 0 0 1-1 0V10a3.5 3.5 0 0 0-3.5-3.5H1.7l2.65 2.65a.5.5 0 1 1-.7.7l-3.5-3.5a.5.5 0 0 1 0-.7l3.5-3.5c.2-.2.5-.2.7 0Z" })), sync: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.5 1A.5.5 0 0 0 5 .5H2a.5.5 0 0 0 0 1h1.53a6.5 6.5 0 0 0 2.39 11.91.5.5 0 1 0 .16-.99A5.5 5.5 0 0 1 4.5 2.1V4a.5.5 0 0 0 1 0V1ZM7.5 1a.5.5 0 0 1 .58-.41 6.5 6.5 0 0 1 2.39 11.91H12a.5.5 0 0 1 0 1H9a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v1.9A5.5 5.5 0 0 0 7.92 1.58.5.5 0 0 1 7.5 1Z" })), upload: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M8.65 5.85 7.5 4.71v5.79a.5.5 0 0 1-1 0V4.7L5.35 5.86a.5.5 0 1 1-.7-.7l2-2c.2-.2.5-.2.7 0l2 2a.5.5 0 1 1-.7.7Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), download: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.35 8.15 6.5 9.29V3.5a.5.5 0 0 1 1 0v5.8l1.15-1.15a.5.5 0 1 1 .7.7l-2 2a.5.5 0 0 1-.7 0l-2-2a.5.5 0 1 1 .7-.7Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7Zm1 0a6 6 0 1 1 12 0A6 6 0 0 1 1 7Z" })), back: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.85 5.35 4.71 6.5h5.79a.5.5 0 0 1 0 1H4.7l1.15 1.15a.5.5 0 1 1-.7.7l-2-2a.5.5 0 0 1 0-.7l2-2a.5.5 0 1 1 .7.7Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 0a7 7 0 1 1 0 14A7 7 0 0 1 7 0Zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 7 1Z" })), proceed: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.5 6.5h5.8L8.14 5.35a.5.5 0 1 1 .7-.7l2 2c.2.2.2.5 0 .7l-2 2a.5.5 0 1 1-.7-.7L9.29 7.5H3.5a.5.5 0 0 1 0-1Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14Zm0-1A6 6 0 1 1 7 1a6 6 0 0 1 0 12Z" })), refresh: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.1.5H7a6.5 6.5 0 1 0 6.41 7.58.5.5 0 1 0-.99-.16A5.47 5.47 0 0 1 7 12.5a5.5 5.5 0 0 1 0-11 5.5 5.5 0 0 1 4.9 3H10a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-1 0v1.53A6.5 6.5 0 0 0 7.1.5Z" })), globe: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 0 0 7a7 7 0 0 0 14 0Zm-6.53 5.74c-.24.23-.4.26-.47.26-.08 0-.23-.03-.47-.26-.23-.24-.5-.62-.73-1.18A11.57 11.57 0 0 1 5 7.5h4a11.57 11.57 0 0 1-.8 4.06c-.24.56-.5.94-.73 1.18ZM8.99 6.5H5.01c.05-1.62.35-3.04.79-4.06.24-.56.5-.94.73-1.18.24-.23.4-.26.47-.26.08 0 .23.03.47.26.23.24.5.62.73 1.18.44 1.02.74 2.44.8 4.06Zm1 1c-.06 2.18-.56 4.08-1.28 5.25a6 6 0 0 0 4.27-5.25H9.99Zm2.99-1H9.99c-.06-2.18-.56-4.08-1.28-5.25a6 6 0 0 1 4.27 5.25ZM4 6.5c.06-2.18.56-4.08 1.28-5.25A6 6 0 0 0 1.02 6.5h2.99Zm-2.99 1a6 6 0 0 0 4.27 5.25c-.72-1.17-1.22-3.07-1.28-5.25H1.02Z" })), compass: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M10.09 3.4 5.95 5.8a.37.37 0 0 0-.11.09.38.38 0 0 0-.04.05l-2.4 4.15a.37.37 0 0 0 0 .38c.1.18.33.24.5.14l4.15-2.4a.37.37 0 0 0 .15-.15l2.4-4.15a.37.37 0 0 0-.03-.44.37.37 0 0 0-.48-.07ZM4.75 9.25 7.6 7.6 6.4 6.4 4.75 9.25Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), location: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7Zm6.5 3.5v2.48A6 6 0 0 1 1.02 7.5H3.5a.5.5 0 0 0 0-1H1.02A6 6 0 0 1 6.5 1.02V3.5a.5.5 0 0 0 1 0V1.02a6 6 0 0 1 5.48 5.48H10.5a.5.5 0 0 0 0 1h2.48a6 6 0 0 1-5.48 5.48V10.5a.5.5 0 0 0-1 0Z" })), pin: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M9 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M12 5A5 5 0 0 0 2 5c0 2.63 2.27 6.15 4.65 8.64.2.2.5.2.7 0C9.73 11.15 12 7.64 12 5ZM7 1a4 4 0 0 1 4 4c0 1.06-.47 2.42-1.3 3.88A21.23 21.23 0 0 1 7 12.55c-1-1.1-1.97-2.39-2.7-3.67A8.46 8.46 0 0 1 3 5a4 4 0 0 1 4-4Z" })), time: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 2c.28 0 .5.22.5.5v4H10a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5V2.5c0-.28.22-.5.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm0-1A6 6 0 1 0 7 1a6 6 0 0 0 0 12Z" })), dashboard: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M9.8 4.1a.5.5 0 0 1 .1.7L7.92 7.58A1 1 0 1 1 7.1 7l2-2.8a.5.5 0 0 1 .7-.12Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M2.07 12.97a7 7 0 1 1 9.86 0 12.96 12.96 0 0 0-9.86 0Zm9.58-1.18a6 6 0 1 0-9.3 0 13.98 13.98 0 0 1 9.3 0Z" })), timer: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.5 4.5a.5.5 0 0 0-1 0v2.63a1 1 0 1 0 1 0V4.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M5.5.5c0-.28.22-.5.5-.5h2a.5.5 0 0 1 0 1h-.5v1.02c1.28.1 2.45.61 3.37 1.4l.78-.77a.5.5 0 0 1 .7.7l-.77.78a6 6 0 1 1-5.08-2.1V1H6a.5.5 0 0 1-.5-.5ZM7 3a5 5 0 1 0 0 10A5 5 0 0 0 7 3Z" })), home: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m7.35 1.15 5.5 5.5a.5.5 0 0 1-.7.7L12 7.21v5.29a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V9H6v3.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V7.2l-.15.15a.5.5 0 1 1-.7-.7l1-1 4.5-4.5c.2-.2.5-.2.7 0ZM3 6.2V12h2V8.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5V12h2V6.2l-4-4-4 4Z" })), admin: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M1.21 4.1a.5.5 0 0 1 .06-.04l5.48-3a.5.5 0 0 1 .5 0l5.48 3a.5.5 0 0 1 .27.39.5.5 0 0 1-.51.55H1.51a.5.5 0 0 1-.3-.9ZM3.46 4h7.08L7 2.07 3.46 4Z" }), react_default.createElement("path", { d: "M4 6a.5.5 0 1 0-1 0v5a.5.5 0 0 0 1 0V6ZM11 6a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0V6ZM5.75 5.5c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0V6c0-.28.22-.5.5-.5ZM8.75 6a.5.5 0 1 0-1 0v5a.5.5 0 0 0 1 0V6ZM1.5 12.5c0-.27.22-.5.5-.5h10a.5.5 0 0 1 0 1H2a.5.5 0 0 1-.5-.5Z" })), info: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 5.5c.28 0 .5.22.5.5v4a.5.5 0 0 1-1 0V6c0-.28.22-.5.5-.5ZM7 4.5A.75.75 0 1 0 7 3a.75.75 0 0 0 0 1.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm0-1A6 6 0 1 0 7 1a6 6 0 0 0 0 12Z" })), question: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.25 5.25A1.75 1.75 0 1 1 7 7a.5.5 0 0 0-.5.5V9a.5.5 0 0 0 1 0V7.95a2.75 2.75 0 1 0-3.25-2.7.5.5 0 0 0 1 0ZM7 11.5A.75.75 0 1 0 7 10a.75.75 0 0 0 0 1.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), support: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-3.52 4.9a5.97 5.97 0 0 1-6.96 0l1.45-1.45a3.98 3.98 0 0 0 4.06 0l1.45 1.44Zm-.03-2.87 1.44 1.45a5.97 5.97 0 0 0 0-6.96l-1.44 1.45a3.98 3.98 0 0 1 0 4.06ZM9.03 3.55l1.45-1.44a5.97 5.97 0 0 0-6.96 0l1.45 1.44a3.98 3.98 0 0 1 4.06 0ZM3.55 4.97 2.11 3.52a5.97 5.97 0 0 0 0 6.96l1.44-1.45a3.98 3.98 0 0 1 0-4.06ZM10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" })), alert: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 4.5c.28 0 .5.22.5.5v3.5a.5.5 0 0 1-1 0V5c0-.28.22-.5.5-.5ZM7.75 10.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7.2 1.04a.5.5 0 0 1 .24.21l6.49 11a.5.5 0 0 1-.44.75H.51a.5.5 0 0 1-.5-.45.5.5 0 0 1 .06-.31l6.5-10.99a.5.5 0 0 1 .64-.2ZM7 2.48 1.38 12h11.24L7 2.48Z" })), email: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M0 2.5c0-.27.22-.5.5-.5h13c.28 0 .5.23.5.5v9a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-9Zm1 1.02V11h12V3.52L7.31 7.89a.5.5 0 0 1-.52.07.5.5 0 0 1-.1-.07L1 3.52ZM12.03 3H1.97L7 6.87 12.03 3Z" })), phone: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "m7.76 8.13-.05.05a.2.2 0 0 1-.28.03A6.76 6.76 0 0 1 5.8 6.56a.21.21 0 0 1 .04-.27l.05-.05c.23-.2.54-.47.71-.96.17-.47-.02-1.04-.66-1.94-.26-.38-.72-.96-1.22-1.46-.68-.69-1.2-1-1.65-1a.98.98 0 0 0-.51.13A3.23 3.23 0 0 0 .9 3.42c-.13 1.1.26 2.37 1.17 3.78a16.68 16.68 0 0 0 4.55 4.6 6.57 6.57 0 0 0 3.53 1.32A3.2 3.2 0 0 0 13 11.46c.14-.24.24-.64-.07-1.18a7.8 7.8 0 0 0-1.73-1.8c-.64-.5-1.52-1.12-2.13-1.12a.97.97 0 0 0-.34.06c-.47.17-.74.46-.95.69l-.02.02Zm4.32 2.68a6.8 6.8 0 0 0-1.48-1.54h-.02c-.3-.25-.64-.49-.95-.67a2.7 2.7 0 0 0-.56-.24h-.01c-.23.09-.34.21-.56.45l-.02.02-.04.04a1.2 1.2 0 0 1-1.6.15 7.76 7.76 0 0 1-1.86-1.89l-.01-.01-.02-.02a1.21 1.21 0 0 1 .2-1.53l.06-.06.02-.02c.22-.2.35-.31.43-.53v-.02c0-.02 0-.06-.03-.14a3.7 3.7 0 0 0-.5-.88h-.01V3.9c-.23-.33-.65-.87-1.1-1.32H4c-.31-.32-.55-.5-.72-.6a.6.6 0 0 0-.22-.1h-.03a2.23 2.23 0 0 0-1.15 1.66c-.09.78.18 1.8 1.02 3.1a15.68 15.68 0 0 0 4.27 4.33l.02.01.02.02a5.57 5.57 0 0 0 2.97 1.11 2.2 2.2 0 0 0 1.93-1.14h.01v-.05a.57.57 0 0 0-.05-.12Z" })), link: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.84 2.16a2.25 2.25 0 0 0-3.18 0l-2.5 2.5c-.88.88-.88 2.3 0 3.18a.5.5 0 0 1-.7.7 3.25 3.25 0 0 1 0-4.59l2.5-2.5a3.25 3.25 0 0 1 4.59 4.6L10.48 8.1c.04-.44.01-.89-.09-1.32l1.45-1.45c.88-.88.88-2.3 0-3.18Z" }), react_default.createElement("path", { d: "M3.6 7.2c-.1-.42-.12-.87-.08-1.31L1.45 7.95a3.25 3.25 0 1 0 4.6 4.6l2.5-2.5a3.25 3.25 0 0 0 0-4.6.5.5 0 0 0-.7.7c.87.89.87 2.31 0 3.2l-2.5 2.5a2.25 2.25 0 1 1-3.2-3.2l1.46-1.44Z" })), unlink: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m1.45 7.95 1.3-1.3.71.7-1.3 1.3a2.25 2.25 0 1 0 3.18 3.2l1.3-1.31.71.7-1.3 1.3a3.25 3.25 0 0 1-4.6-4.59ZM12.55 6.05l-1.3 1.3-.71-.7 1.3-1.3a2.25 2.25 0 1 0-3.18-3.2l-1.3 1.31-.71-.7 1.3-1.3a3.25 3.25 0 0 1 4.6 4.59ZM1.85 1.15a.5.5 0 1 0-.7.7l11 11a.5.5 0 0 0 .7-.7l-11-11Z" })), bell: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M8 1.11a1 1 0 1 0-1.99 0A4.5 4.5 0 0 0 2.5 5.5v3.88l-.94 1.89a.5.5 0 0 0-.06.3.5.5 0 0 0 .51.43h3.58a1.5 1.5 0 1 0 2.82 0H12a.5.5 0 0 0 .45-.73l-.94-1.89V5.5A4.5 4.5 0 0 0 8 1.11ZM2.8 11h8.4l-.5-1H3.3l-.5 1Zm7.7-2V5.5a3.5 3.5 0 1 0-7 0V9h7Zm-4 3.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Z" })), rss: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.5.5c0-.28.22-.5.5-.5a12 12 0 0 1 12 12 .5.5 0 0 1-1 0A11 11 0 0 0 2 1a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { d: "M1.5 4.5c0-.28.22-.5.5-.5a8 8 0 0 1 8 8 .5.5 0 0 1-1 0 7 7 0 0 0-7-7 .5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M5 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-1 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" })), sharealt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7.5a.5.5 0 0 0-1 0V12H2V2h4.5a.5.5 0 0 0 0-1H2Z" }), react_default.createElement("path", { d: "M7.35 7.36 12 2.7v1.8a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 1 0 0 1h1.8L6.64 6.64a.5.5 0 1 0 .7.7Z" })), share: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6.65.15c.2-.2.5-.2.7 0l2 2a.5.5 0 1 1-.7.7L7.5 1.72v6.8a.5.5 0 0 1-1 0V1.7L5.35 2.86a.5.5 0 1 1-.7-.71l2-2Z" }), react_default.createElement("path", { d: "M2 4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H9.5a.5.5 0 1 0 0 1H12v7H2V5h2.5a.5.5 0 0 0 0-1H2Z" })), circlehollow: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12Zm0 1A7 7 0 1 0 7 0a7 7 0 0 0 0 14Z" })), circle: react_default.createElement("path", { d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Z" }), bookmarkhollow: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3.5 0h7c.28 0 .5.22.5.5v13a.5.5 0 0 1-.45.5.46.46 0 0 1-.38-.12L7 11.16l-3.17 2.72a.46.46 0 0 1-.38.12.5.5 0 0 1-.45-.5V.5c0-.28.22-.5.5-.5ZM4 12.41l2.66-2.28a.45.45 0 0 1 .38-.13c.1.01.2.05.29.12l2.67 2.3V1H4v11.41Z" })), bookmark: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3.5 0h7c.28 0 .5.22.5.5v13a.5.5 0 0 1-.45.5.46.46 0 0 1-.38-.12L7 11.16l-3.17 2.72a.46.46 0 0 1-.38.12.5.5 0 0 1-.45-.5V.5c0-.28.22-.5.5-.5Z" })), diamond: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M8.41 1.59a2 2 0 0 0-2.82 0l-4 4a2 2 0 0 0 0 2.82l4 4a2 2 0 0 0 2.82 0l4-4a2 2 0 0 0 0-2.82l-4-4Zm.71-.71a3 3 0 0 0-4.24 0l-4 4a3 3 0 0 0 0 4.24l4 4a3 3 0 0 0 4.24 0l4-4a3 3 0 0 0 0-4.24l-4-4Z" })), hearthollow: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M12.81 1.85 13 2a2.97 2.97 0 0 1 .75 1.17 4.39 4.39 0 0 1 .12 2.51 6.26 6.26 0 0 1-1.65 2.55l-4.78 4.6A.59.59 0 0 1 7 13a.67.67 0 0 1-.44-.17L1.78 8.22a7.84 7.84 0 0 1-1.25-1.6C.37 6.31.24 6 .14 5.67a4.32 4.32 0 0 1 .12-2.51 3.2 3.2 0 0 1 1.95-1.9c.47-.18 1-.27 1.57-.27.3 0 .61.04.91.14.3.09.59.21.86.36s.52.33.77.52c.24.19.47.38.68.58a7.56 7.56 0 0 1 1.46-1.1c.27-.15.55-.27.84-.36.3-.1.6-.14.9-.14.59 0 1.12.09 1.59.26.39.15.73.34 1.02.59ZM1.2 3.53A2.2 2.2 0 0 1 2.57 2.2M1.2 3.53c-.13.33-.2.72-.2 1.18 0 .22.03.45.1.68a3.97 3.97 0 0 0 .79 1.46c.19.23.38.45.59.65l4.51 4.36 4.52-4.35c.2-.2.4-.4.59-.65.18-.23.34-.47.49-.73.13-.23.23-.48.3-.73.08-.23.11-.46.11-.7 0-.45-.07-.84-.2-1.18-.12-.33-.3-.6-.51-.8v-.01c-.22-.2-.5-.38-.85-.51-.34-.13-.75-.2-1.24-.2-.2 0-.4.03-.6.09a4.95 4.95 0 0 0-1.9 1.22l-.68.67-.7-.65a9.97 9.97 0 0 0-.62-.53c-.2-.16-.42-.3-.63-.42h-.01c-.21-.12-.43-.22-.66-.29C4.2 2.03 4 2 3.77 2c-.48 0-.88.07-1.21.2" })), heart: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M12.81 1.85 13 2a2.97 2.97 0 0 1 .75 1.17 4.39 4.39 0 0 1 .12 2.51 6.26 6.26 0 0 1-1.65 2.55l-4.78 4.6A.59.59 0 0 1 7 13a.67.67 0 0 1-.44-.17L1.78 8.22a7.84 7.84 0 0 1-1.25-1.6C.37 6.31.24 6 .14 5.67a4.32 4.32 0 0 1 .12-2.51 3.2 3.2 0 0 1 1.95-1.9c.47-.18 1-.27 1.57-.27.3 0 .61.04.91.14.3.09.59.21.86.36s.52.33.77.52c.24.19.47.38.68.58a7.56 7.56 0 0 1 1.46-1.1c.27-.15.55-.27.84-.36.3-.1.6-.14.9-.14.59 0 1.12.09 1.59.26.39.15.73.34 1.02.59Z" })), starhollow: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6.32.78a.75.75 0 0 1 1.36 0l1.63 3.54 3.87.46c.63.07.89.86.42 1.3l-2.86 2.64.76 3.81a.75.75 0 0 1-1.1.8L7 11.43l-3.4 1.9a.75.75 0 0 1-1.1-.8l.76-3.81L.4 6.07a.75.75 0 0 1 .42-1.3l3.87-.45L6.32.78ZM7 1.7 5.54 4.86c-.11.24-.34.4-.6.43l-3.46.42 2.56 2.37c.2.17.28.44.23.7l-.68 3.42 3.04-1.7c.23-.14.5-.14.74 0l3.04 1.7-.68-3.43a.75.75 0 0 1 .23-.7l2.56-2.36-3.47-.42a.75.75 0 0 1-.59-.43L7 1.7Z" })), star: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.68.78a.75.75 0 0 0-1.36 0L4.69 4.32l-3.87.46a.75.75 0 0 0-.42 1.3l2.86 2.64-.76 3.81a.75.75 0 0 0 1.1.8l3.4-1.9 3.4 1.9a.75.75 0 0 0 1.1-.8l-.76-3.81 2.86-2.65a.75.75 0 0 0-.42-1.3L9.3 4.33 7.68.78Z" })), certificate: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M10 7.85A4.49 4.49 0 0 0 7 0a4.5 4.5 0 0 0-3 7.85V13a.5.5 0 0 0 .5.5.5.5 0 0 0 .35-.15L7 11.21l2.15 2.14A.5.5 0 0 0 10 13V7.85ZM7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.35 2.15c.2-.2.5-.2.7 0L9 11.79V8.53a4.48 4.48 0 0 1-4 0v3.26l1.65-1.64Z" })), verified: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6.56 13.12a1 1 0 0 1 .88 0l.98.49a1 1 0 0 0 1.31-.43l.52-.97a1 1 0 0 1 .7-.51l1.08-.2a1 1 0 0 0 .81-1.1l-.15-1.1a1 1 0 0 1 .27-.82l.76-.8a1 1 0 0 0 0-1.37l-.76-.79a1 1 0 0 1-.27-.83l.15-1.08a1 1 0 0 0-.8-1.12l-1.09-.19a1 1 0 0 1-.7-.5L9.73.81A1 1 0 0 0 8.43.4l-1 .49a1 1 0 0 1-.87 0L5.58.39a1 1 0 0 0-1.31.43l-.52.97a1 1 0 0 1-.7.51l-1.08.2a1 1 0 0 0-.81 1.1l.15 1.1a1 1 0 0 1-.27.82l-.76.8a1 1 0 0 0 0 1.37l.76.79a1 1 0 0 1 .27.83l-.15 1.08a1 1 0 0 0 .8 1.12l1.09.19a1 1 0 0 1 .7.5l.52.98a1 1 0 0 0 1.3.43l1-.49Zm4.3-8.47c.19.2.19.5 0 .7l-4.5 4.5a.5.5 0 0 1-.71 0l-2.5-2.5a.5.5 0 1 1 .7-.7L6 8.79l4.15-4.14c.2-.2.5-.2.7 0Z" })), thumbsup: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11 12.02c-.4.37-.91.56-1.56.56h-.88a5.5 5.5 0 0 1-1.3-.16c-.42-.1-.91-.25-1.47-.45-.3-.12-.63-.21-.95-.27H2.88a.84.84 0 0 1-.62-.26.84.84 0 0 1-.26-.61V6.45c0-.24.09-.45.26-.62a.84.84 0 0 1 .62-.25h1.87c.16-.11.47-.47.93-1.06.27-.35.51-.64.74-.88.1-.11.19-.3.24-.58.05-.28.12-.57.2-.87.1-.3.24-.55.43-.74a.87.87 0 0 1 .62-.25c.38 0 .72.07 1.03.22.3.15.54.38.7.7a2.94 2.94 0 0 1 .21 1.58 3 3 0 0 1-.3 1h1.2c.47 0 .88.17 1.23.52s.52.8.52 1.22c0 .29-.04.66-.34 1.12.05.15.07.3.07.47 0 .35-.09.68-.26.98.07.54-.07 1.08-.4 1.51a1.9 1.9 0 0 1-.57 1.5Zm.47-5.33a.96.96 0 0 0 .03-.25.74.74 0 0 0-.23-.51.68.68 0 0 0-.52-.23H7.93l.73-1.45a2 2 0 0 0 .21-.87c0-.44-.07-.7-.13-.82a.53.53 0 0 0-.24-.24 1.3 1.3 0 0 0-.54-.12.99.99 0 0 0-.14.28c-.08.27-.13.52-.18.76-.06.38-.2.77-.48 1.07v.01l-.02.01c-.2.2-.4.46-.67.8l-.61.76c-.15.17-.35.38-.54.51l-.26.18H5v4.13h.02c.38.08.76.18 1.12.32.53.2.98.33 1.35.42.36.09.71.13 1.07.13h.88c.43 0 .68-.11.87-.29a.9.9 0 0 0 .26-.7l-.02-.37.22-.3c.17-.23.25-.5.2-.78l-.04-.33.17-.3a.97.97 0 0 0 .13-.48c0-.09 0-.13-.02-.15l-.15-.46.26-.4c.1-.15.13-.25.15-.33ZM3.5 10.8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" })), shield: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M11.76 2.08a.5.5 0 0 1 .24.42v6a.5.5 0 0 1-.17.38l-4.5 3.99a.5.5 0 0 1-.67 0l-4.49-4A.5.5 0 0 1 2 8.5V2.5c0-.18.1-.34.24-.42l.01-.02a2.5 2.5 0 0 1 .3-.16c.22-.1.52-.24.92-.37C4.27 1.26 5.44 1 7 1c1.56 0 2.73.26 3.53.53a6.97 6.97 0 0 1 1.22.53l.01.02ZM3 2.79v5.49l1.07.94 6.59-6.58-.44-.17C9.52 2.24 8.44 2 7 2c-1.44 0-2.52.24-3.22.47-.35.12-.6.24-.78.32Zm4 9.04L4.82 9.9 11 3.71v4.57l-4 3.55Z" })), basket: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.35 2.85a.5.5 0 1 0-.7-.7l-3 3a.5.5 0 1 0 .7.7l3-3Z" }), react_default.createElement("path", { d: "M2.09 6H4.5a.5.5 0 0 0 0-1H1.8a.75.75 0 0 0-.74.87l.8 4.88A1.5 1.5 0 0 0 3.36 12h7.3a1.5 1.5 0 0 0 1.48-1.25l.81-4.88A.75.75 0 0 0 12.2 5H10a.5.5 0 0 0 0 1h1.91l-.76 4.58a.5.5 0 0 1-.5.42h-7.3a.5.5 0 0 1-.5-.42L2.1 6Z" }), react_default.createElement("path", { d: "M4.5 7c.28 0 .5.22.5.5v2a.5.5 0 0 1-1 0v-2c0-.28.22-.5.5-.5ZM10 7.5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2ZM6.5 9.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-1 0Z" })), beaker: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M4.5 2h.75v3.87l-3.03 5.26c-.48.83.12 1.87 1.08 1.87h7.4c.96 0 1.57-1.04 1.08-1.87L8.75 5.87V2h.75a.5.5 0 0 0 0-1h-5a.5.5 0 0 0 0 1Zm1.75 4V2h1.5v4.13l.07.12 1 1.75H5.18l1.01-1.75.07-.12V6ZM4.6 9l-1.52 2.63c-.1.16.03.37.22.37h7.4c.2 0 .31-.2.22-.37L9.4 9H4.6Z" })), hourglass: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.5 10.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M3.5 1a.5.5 0 0 0-.5.5c0 1.06.14 1.9.68 2.97.34.7.86 1.5 1.6 2.53a16.53 16.53 0 0 0-1.8 2.96A6 6 0 0 0 3 12.49v.01a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5 6 6 0 0 0-.48-2.54c-.34-.8-.9-1.71-1.8-2.96a19.78 19.78 0 0 0 1.6-2.53c.54-1.08.68-1.9.68-2.97a.5.5 0 0 0-.5-.5h-7Zm6.49 11a4.68 4.68 0 0 0-.39-1.65c-.27-.65-.73-1.4-1.5-2.5a133 133 0 0 1-.75 1 .5.5 0 0 1-.56.1.5.5 0 0 1-.2-.16l-.7-.94a14.36 14.36 0 0 0-1.5 2.5A4.68 4.68 0 0 0 4.02 12H10ZM6.3 6.72l.7.94a90.06 90.06 0 0 0 .7-.96c.49-.67.87-1.22 1.17-1.7H5.13A32.67 32.67 0 0 0 6.3 6.72ZM4.56 4h4.88c.36-.73.5-1.31.55-2H4c.04.69.19 1.27.55 2Z" })), flag: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M11.5 1h-9a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 1 0V8h8.5a.5.5 0 0 0 .35-.85L9.21 4.5l2.64-2.65A.5.5 0 0 0 11.5 1ZM8.15 4.15 10.29 2H3v5h7.3L8.14 4.85a.5.5 0 0 1 0-.7Z" })), cloudhollow: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M10 7V6a3 3 0 0 0-5.9-.74l-.18.68-.7.07A2.5 2.5 0 0 0 3.5 11h3.19l.07-.01h.08L7 11h4a2 2 0 1 0 0-4h-1ZM3.12 5.02A3.5 3.5 0 0 0 3.5 12H11a3 3 0 1 0 0-6 4 4 0 0 0-7.88-.98Z" })), cloud: react_default.createElement("path", { d: "M7 2a4 4 0 0 1 4 4 3 3 0 1 1 0 6H3.5a3.5 3.5 0 0 1-.38-6.98A4 4 0 0 1 7 2Z" }), edit: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "m13.85 2.15-2-2a.5.5 0 0 0-.7 0l-1.5 1.5-9 9a.5.5 0 0 0-.14.26L0 13.39a.5.5 0 0 0 .14.46.5.5 0 0 0 .46.14l2.48-.5a.5.5 0 0 0 .27-.14l9-9 1.5-1.5a.5.5 0 0 0 0-.7ZM12 3.29l.8-.79-1.3-1.3-.8.8L12 3.3Zm-2-.58L1.7 11 3 12.3 11.3 4 10 2.7ZM1.14 12.86l.17-.85.68.68-.85.17Z" })), cog: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.59 5.59a2 2 0 0 1 3.27 2.14.5.5 0 1 0 .93.37 3 3 0 1 0-1.7 1.7.5.5 0 1 0-.36-.94A2 2 0 0 1 5.6 5.6Z", fill: "#333" }), react_default.createElement("path", { fillRule: "evenodd", d: "M.94 6.53c.13.12.19.3.18.46 0 .17-.05.34-.18.47L0 8.39c.19.94.55 1.81 1.07 2.58h1.32c.18 0 .34.07.46.2.12.11.2.27.2.45v1.32c.76.51 1.62.88 2.55 1.06l.94-.94a.63.63 0 0 1 .45-.19h.03c.16 0 .33.07.45.19l.94.94a7.1 7.1 0 0 0 2.55-1.06v-1.33c0-.18.07-.35.2-.46.11-.12.27-.2.45-.2h1.33A7.1 7.1 0 0 0 14 8.4l-.95-.94a.64.64 0 0 1-.18-.47c0-.17.06-.34.18-.46l.95-.95a7.1 7.1 0 0 0-1.05-2.52h-1.34a.63.63 0 0 1-.46-.2.64.64 0 0 1-.2-.46V1.06A7.1 7.1 0 0 0 8.42 0l-.94.94a.63.63 0 0 1-.45.19H7a.63.63 0 0 1-.45-.19L5.6 0a7.1 7.1 0 0 0-2.56 1.06v1.33c0 .18-.07.34-.2.46a.63.63 0 0 1-.45.2H1.06A7.1 7.1 0 0 0 0 5.59l.94.94Zm.7 1.63c.33-.32.49-.75.48-1.17 0-.42-.15-.85-.47-1.17l-.54-.54c.12-.43.3-.85.51-1.23h.77c.46 0 .87-.2 1.17-.5.3-.29.48-.7.48-1.16v-.77c.4-.22.81-.39 1.25-.52l.54.55c.33.32.75.48 1.16.48h.03c.42 0 .84-.16 1.16-.48l.54-.54c.44.12.85.3 1.24.5v.8c0 .45.19.87.49 1.16.3.3.7.5 1.16.5h.78c.2.37.38.78.5 1.2l-.54.55c-.33.32-.49.75-.48 1.17 0 .42.15.85.48 1.17l.55.55c-.13.44-.3.85-.52 1.24h-.77c-.45 0-.87.2-1.16.5-.3.29-.5.7-.5 1.16v.77c-.38.21-.8.39-1.23.51l-.54-.54a1.64 1.64 0 0 0-1.16-.48H7c-.41 0-.83.16-1.16.48l-.54.55a6.1 6.1 0 0 1-1.25-.52v-.76c0-.45-.19-.87-.48-1.16-.3-.3-.71-.5-1.17-.5h-.76a6.1 6.1 0 0 1-.53-1.25l.55-.55Z" })), nut: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.59 8.41a2 2 0 1 1 3.27-.68.5.5 0 1 0 .93.37 3 3 0 1 0-1.7 1.7.5.5 0 0 0-.36-.94 2 2 0 0 1-2.14-.45Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M6.5.29a1 1 0 0 1 1 0l5.06 2.92c.31.18.5.51.5.87v5.84a1 1 0 0 1-.5.87L7.5 13.7a1 1 0 0 1-1 0L1.44 10.8a1 1 0 0 1-.5-.87V4.08a1 1 0 0 1 .5-.87L6.5.3Zm.5.86 5.06 2.93v5.84L7 12.85 1.94 9.92V4.08L7 1.15Z" })), wrench: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.5 1c.44 0 .56.52.25.83l-.8.81c-.2.2-.2.52 0 .72l.69.7c.2.2.52.2.72 0l.8-.81c.32-.31.84-.2.84.25a2.5 2.5 0 0 1-3.41 2.33L2.7 12.7a1 1 0 0 1-1.42-1.42l6.88-6.88A2.5 2.5 0 0 1 10.5 1ZM2 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" })), ellipsis: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM13 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM7 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" })), check: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M13.85 3.35a.5.5 0 0 0-.7-.7L5 10.79.85 6.65a.5.5 0 1 0-.7.7l4.5 4.5c.2.2.5.2.7 0l8.5-8.5Z" })), form: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6.4a.5.5 0 0 0-1 0V12H2V2h7.5a.5.5 0 0 0 0-1H2Z" }), react_default.createElement("path", { d: "m6.35 9.86 7.5-7.5a.5.5 0 0 0-.7-.71L6 8.8 3.85 6.65a.5.5 0 1 0-.7.7l2.5 2.5c.2.2.5.2.7 0Z" })), batchdeny: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.5 2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2Zm-2.646.646a.5.5 0 0 1 0 .708L5.207 7l3.647 3.646a.5.5 0 0 1-.708.708L4.5 7.707.854 11.354a.5.5 0 0 1-.708-.708L3.793 7 .146 3.354a.5.5 0 1 1 .708-.708L4.5 6.293l3.646-3.647a.5.5 0 0 1 .708 0ZM11 7a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 11 7Zm.5 4a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2Z" })), batchaccept: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.5 2a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2Zm-2.2.6a.5.5 0 0 1 .1.7l-5.995 7.993a.505.505 0 0 1-.37.206.5.5 0 0 1-.395-.152L.146 8.854a.5.5 0 1 1 .708-.708l2.092 2.093L8.6 2.7a.5.5 0 0 1 .7-.1ZM11 7a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 11 7Zm.5 4a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2Z" })), controls: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.5 1c.28 0 .5.22.5.5V2h1.5a.5.5 0 0 1 0 1H11v.5a.5.5 0 0 1-1 0V3H1.5a.5.5 0 0 1 0-1H10v-.5c0-.28.22-.5.5-.5ZM1.5 11a.5.5 0 0 0 0 1H10v.5a.5.5 0 0 0 1 0V12h1.5a.5.5 0 0 0 0-1H11v-.5a.5.5 0 0 0-1 0v.5H1.5ZM1 7c0-.28.22-.5.5-.5H3V6a.5.5 0 0 1 1 0v.5h8.5a.5.5 0 0 1 0 1H4V8a.5.5 0 0 1-1 0v-.5H1.5A.5.5 0 0 1 1 7Z" })), plus: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.5.5a.5.5 0 0 0-1 0v6h-6a.5.5 0 0 0 0 1h6v6a.5.5 0 0 0 1 0v-6h6a.5.5 0 0 0 0-1h-6v-6Z" })), closeAlt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.03.97A.75.75 0 0 0 .97 2.03L5.94 7 .97 11.97a.75.75 0 1 0 1.06 1.06L7 8.06l4.97 4.97a.75.75 0 1 0 1.06-1.06L8.06 7l4.97-4.97A.75.75 0 0 0 11.97.97L7 5.94 2.03.97Z" })), cross: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.85 1.15a.5.5 0 1 0-.7.7L6.29 7l-5.14 5.15a.5.5 0 0 0 .7.7L7 7.71l5.15 5.14a.5.5 0 0 0 .7-.7L7.71 7l5.14-5.15a.5.5 0 0 0-.7-.7L7 6.29 1.85 1.15Z" })), trash: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.5 4.5c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0V5c0-.28.22-.5.5-.5ZM9 5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0V5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M4.5.5c0-.28.22-.5.5-.5h4c.28 0 .5.22.5.5V2h3a.5.5 0 0 1 0 1H12v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3h-.5a.5.5 0 0 1 0-1h3V.5ZM3 3v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3H3Zm2.5-2h3v1h-3V1Z" })), pinalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M13.44 4.44 9.56.56a1.5 1.5 0 0 0-2.12 0L7 1a1.41 1.41 0 0 0 0 2L5 5H3.66A4 4 0 0 0 .83 6.17l-.48.48a.5.5 0 0 0 0 .7l2.8 2.8-3 3a.5.5 0 0 0 .7.7l3-3 2.8 2.8c.2.2.5.2.7 0l.48-.48A4 4 0 0 0 9 10.34V9l2-2c.55.55 1.45.55 2 0l.44-.44a1.5 1.5 0 0 0 0-2.12ZM11 5.59l-3 3v1.75a3 3 0 0 1-.88 2.12L7 12.6 1.41 7l.13-.12A3 3 0 0 1 3.66 6H5.4l3-3-.7-.7a.41.41 0 0 1 0-.6l.44-.43c.2-.2.5-.2.7 0l3.88 3.88c.2.2.2.5 0 .7l-.44.44a.41.41 0 0 1-.58 0L11 5.6Z" })), unpin: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M13.44 4.44 9.56.56a1.5 1.5 0 0 0-2.12 0L7 1a1.41 1.41 0 0 0 0 2L5.7 4.3l.71.7 2-2-.7-.7a.41.41 0 0 1 0-.6l.44-.43c.2-.2.5-.2.7 0l3.88 3.88c.2.2.2.5 0 .7l-.44.44a.41.41 0 0 1-.58 0L11 5.6l-2 2 .7.7L11 7c.55.55 1.45.55 2 0l.44-.44a1.5 1.5 0 0 0 0-2.12ZM.83 6.17A4 4 0 0 1 3.59 5l1 1h-.93a3 3 0 0 0-2.12.88L1.4 7 7 12.59l.12-.13A3 3 0 0 0 8 10.34v-.93l1 1a4 4 0 0 1-1.17 2.76l-.48.48a.5.5 0 0 1-.7 0l-2.8-2.8-3 3a.5.5 0 0 1-.7-.7l3-3-2.8-2.8a.5.5 0 0 1 0-.7l.48-.48Zm1.02-5.02a.5.5 0 1 0-.7.7l11 11a.5.5 0 0 0 .7-.7l-11-11Z" })), add: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 3c.28 0 .5.22.5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3c0-.28.22-.5.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm0-1A6 6 0 1 0 7 1a6 6 0 0 0 0 12Z" })), subtract: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.5 6.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), close: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M9.85 4.15c.2.2.2.5 0 .7L7.71 7l2.14 2.15a.5.5 0 0 1-.7.7L7 7.71 4.85 9.85a.5.5 0 0 1-.7-.7L6.29 7 4.15 4.85a.5.5 0 1 1 .7-.7L7 6.29l2.15-2.14c.2-.2.5-.2.7 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm0-1A6 6 0 1 0 7 1a6 6 0 0 0 0 12Z" })), delete: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0a6 6 0 0 1-9.87 4.58l8.45-8.45A5.98 5.98 0 0 1 13 7ZM2.42 10.87l8.45-8.45a6 6 0 0 0-8.46 8.46Z" })), passed: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm3.85-9.35c.2.2.2.5 0 .7l-4.5 4.5a.5.5 0 0 1-.7 0l-2.5-2.5a.5.5 0 1 1 .7-.7L6 8.79l4.15-4.14c.2-.2.5-.2.7 0Z" })), changed: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14ZM3.5 6.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Z" })), failed: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14Zm2.85-9.85c.2.2.2.5 0 .7L7.71 7l2.14 2.15a.5.5 0 0 1-.7.7L7 7.71 4.85 9.85a.5.5 0 0 1-.7-.7L6.29 7 4.15 4.85a.5.5 0 1 1 .7-.7L7 6.29l2.15-2.14c.2-.2.5-.2.7 0Z" })), clear: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M5 2h7a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-1.41-.59l-3-3a2 2 0 0 1 0-2.82l3-3A2 2 0 0 1 5 2Zm1.15 3.15c.2-.2.5-.2.7 0L8 6.29l1.15-1.14a.5.5 0 1 1 .7.7L8.71 7l1.14 1.15a.5.5 0 0 1-.7.7L8 7.71 6.85 8.85a.5.5 0 1 1-.7-.7L7.29 7 6.15 5.85a.5.5 0 0 1 0-.7Z" })), comment: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.5 5a.5.5 0 1 0 0 1h7a.5.5 0 0 0 0-1h-7ZM3 8.5c0-.27.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M12.5 12H5.7l-1.85 1.86a.5.5 0 0 1-.35.14.5.5 0 0 1-.5-.5V12H1.5a.5.5 0 0 1-.5-.5v-9c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v9a.5.5 0 0 1-.5.5ZM2 11V3h10v8H2Z" })), commentadd: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.5 5a.5.5 0 1 0-1 0v1.5H5a.5.5 0 1 0 0 1h1.5V9a.5.5 0 0 0 1 0V7.5H9a.5.5 0 0 0 0-1H7.5V5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M3.7 13.97a.5.5 0 0 1-.7-.46V12H1.5a.5.5 0 0 1-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9a.5.5 0 0 1-.5.5H5.7l-1.85 1.85a.5.5 0 0 1-.16.1ZM2 3v8h10V3H2Z" })), requestchange: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M9.85 6.65c.2.2.2.51 0 .7l-2 2a.5.5 0 1 1-.7-.7L8.3 7.5H4.5a.5.5 0 0 1 0-1h3.79L7.15 5.36a.5.5 0 1 1 .7-.71l2 2Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M3.7 13.97a.5.5 0 0 1-.7-.46V12H1.5a.5.5 0 0 1-.5-.5v-9c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v9a.5.5 0 0 1-.5.5H5.7l-1.85 1.85a.5.5 0 0 1-.16.1ZM2 3v8h10V3H2Z" })), comments: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M8.5 7a.5.5 0 0 0 0-1h-5a.5.5 0 1 0 0 1h5ZM9 8.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h5c.28 0 .5.23.5.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M12 11.5V10h1.5a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5V3H.5a.5.5 0 0 0-.5.5v8c0 .28.22.5.5.5H2v1.5a.5.5 0 0 0 .5.5.5.5 0 0 0 .35-.14L4.71 12h6.79a.5.5 0 0 0 .5-.5ZM3 3V2h10v7h-1V3.5a.5.5 0 0 0-.5-.5H3Zm-2 8V4h10v7H1Z" })), lock: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M8 8a1 1 0 0 1-.5.87v1.63a.5.5 0 0 1-1 0V8.87A1 1 0 1 1 8 8Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M3 4a4 4 0 1 1 8 0v1h1.5c.28 0 .5.23.5.5v8a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-8c0-.27.22-.5.5-.5H3V4Zm7 1V4a3 3 0 1 0-6 0v1h6Zm2 1H2v7h10V6Z" })), unlock: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6.5 8.87a1 1 0 1 1 1 0v1.63a.5.5 0 0 1-1 0V8.87Z" }), react_default.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7 1a3 3 0 0 0-3 3v1h8.5c.28 0 .5.23.5.5v8a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-8c0-.27.22-.5.5-.5H3V4a4 4 0 0 1 7.76-1.38.5.5 0 0 1-.94.34A3 3 0 0 0 7 1ZM2 6h10v7H2V6Z" })), key: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7.5 8.53v.97a.5.5 0 0 1-.5.5H5.5v1.5a.5.5 0 0 1-.5.5H3.5v1.5a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .15-.36l5.12-5.11a4.5 4.5 0 1 1 2.23 2.5ZM6 4.5a3.5 3.5 0 1 1 1.5 2.87c-.29-.2-1-.37-1 .48V9H5a.5.5 0 0 0-.5.5V11H3a.5.5 0 0 0-.5.5V13H1v-1.3l5.2-5.19c.15-.16.18-.4.1-.6A3.47 3.47 0 0 1 6 4.5Z" })), outbox: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.35.15a.5.5 0 0 0-.7 0l-2 2a.5.5 0 1 0 .7.7L6.5 1.72v6.8a.5.5 0 0 0 1 0V1.7l1.15 1.15a.5.5 0 1 0 .7-.71l-2-2Z" }), react_default.createElement("path", { d: "M2 7.5a.5.5 0 1 0-1 0v5c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-1 0V12H2V7.5Z" })), credit: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.5 8a.5.5 0 1 0 0 1h3a.5.5 0 0 0 0-1h-3Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M0 11.5c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H.5a.5.5 0 0 0-.5.5v9ZM1 3v1h12V3H1Zm0 8h12V6H1v5Z" })), button: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1 3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h3.5a.5.5 0 1 0 0-1H1V4h12v5h-1a.5.5 0 0 0 0 1h1a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Z" }), react_default.createElement("path", { d: "M6.45 7a.5.5 0 0 1 .3.08l3.48 2.02a.5.5 0 0 1 0 .87l-1.08.62.75 1.3a.75.75 0 0 1-1.3.75l-.75-1.3-1.07.62a.5.5 0 0 1-.67-.13.5.5 0 0 1-.1-.3L6 7.5a.5.5 0 0 1 .45-.5Z" })), type: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4 1.5c0-.27.22-.5.5-.5h5a.5.5 0 1 1 0 1h-2v10h2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h2V2h-2a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { d: "M0 4.5c0-.27.22-.5.5-.5h4a.5.5 0 1 1 0 1H1v4h3.5a.5.5 0 1 1 0 1h-4a.5.5 0 0 1-.5-.5v-5ZM9.5 4a.5.5 0 1 0 0 1H13v4H9.5a.5.5 0 1 0 0 1h4a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-4Z" })), pointerdefault: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.94 12.46c.11 0 .2-.06.25-.15l1.58-3.16 2.54 2.54c.04.05.1.07.19.07a.3.3 0 0 0 .2-.07l.8-.8a.27.27 0 0 0 0-.38L8.9 7.9l3.4-1.7c.06-.03.1-.07.12-.11a.22.22 0 0 0 .04-.14.33.33 0 0 0-.06-.16.17.17 0 0 0-.09-.07h-.02L1.91 1.55a.27.27 0 0 0-.35.36l4.15 10.37c.04.09.12.16.23.17Zm-.03 1h-.02a1.28 1.28 0 0 1-1.1-.8L.62 2.29A1.27 1.27 0 0 1 2.3.63l10.35 4.15c.52.18.79.65.81 1.11.04.53-.27.98-.7 1.2l-2.17 1.08L12.2 9.8c.5.5.5 1.3 0 1.8l-.8.8v.01c-.5.46-1.3.48-1.8-.01l-1.56-1.56-.95 1.92c-.23.45-.68.7-1.15.7h-.03Z" })), pointerhand: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.87 6v-.02c-.03-.27-.23-.48-.47-.5a.5.5 0 0 0-.53.5v1.41c0 .25-.22.47-.47.47a.48.48 0 0 1-.47-.47V5.17a.6.6 0 0 0 0-.05c-.02-.27-.23-.5-.47-.5a.5.5 0 0 0-.52.5v1.65l-.01.1a.49.49 0 0 1-.46.37.48.48 0 0 1-.47-.47V4.62a.6.6 0 0 0 0-.05c-.03-.27-.23-.48-.47-.5a.5.5 0 0 0-.53.5v2.2c0 .25-.22.47-.47.47a.49.49 0 0 1-.47-.47V1.75c-.02-.27-.22-.5-.47-.5a.5.5 0 0 0-.52.5v6.78c0 .25-.22.47-.47.47a.48.48 0 0 1-.47-.47v-.26a.78.78 0 0 0-.06-.31.65.65 0 0 0-.16-.22l-.2-.19A6.37 6.37 0 0 0 3.06 7h-.02c-.43-.34-.62-.25-.69-.2-.26.14-.29.5-.13.74l1.73 2.6v.01h-.01l-.04.02.05-.02s1.21 2.6 3.57 2.6c3.54 0 4.2-1.9 4.31-4.42.04-.6.04-1.19.03-1.78V6Zm.97 2.38c-.06 1.29-.26 2.67-1.08 3.72-.88 1.12-2.29 1.65-4.23 1.65a4.64 4.64 0 0 1-3.4-1.62 6.96 6.96 0 0 1-1.05-1.5v-.02L1.4 8.1A1.6 1.6 0 0 1 1.15 7c.05-.38.26-.8.69-1.04.2-.13.48-.23.85-.19.36.05.68.22.98.45.14.1.27.22.4.33v-4.8A1.5 1.5 0 0 1 5.63.25c.93.04 1.43.86 1.43 1.55v1.33c.17-.05.35-.07.53-.06h.02c.5.04.91.33 1.15.71a1.5 1.5 0 0 1 .74-.16c.66.03 1.12.46 1.32.97a1.5 1.5 0 0 1 .64-.1h.02c.85.06 1.39.8 1.39 1.55v.48c0 .6 0 1.24-.03 1.86Z" })), browser: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M.5 13a.5.5 0 0 1-.5-.5v-11c0-.27.22-.5.5-.5h13c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5H.5Zm.5-1V4h12v8H1Zm1-9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" })), tablet: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3.5 0C2.67 0 2 .68 2 1.5v11c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-11c0-.82-.67-1.5-1.5-1.5h-7Zm0 1h7c.28 0 .5.23.5.5V11H3V1.5c0-.27.22-.5.5-.5ZM6 12a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1H6Z" })), mobile: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3 1.5C3 .68 3.67 0 4.5 0h5c.83 0 1.5.68 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-5A1.5 1.5 0 0 1 3 12.5v-11ZM4 12V2h6v10H4Z" })), watch: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { key: "watch", fillRule: "evenodd", d: "M4 .5c0-.27.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 4 .5ZM9.5 3h-5a.5.5 0 0 0-.5.5v7c0 .28.22.5.5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5Zm-5-1C3.67 2 3 2.68 3 3.5v7c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-7c0-.82-.67-1.5-1.5-1.5h-5ZM7 4c.28 0 .5.23.5.5v2h1a.5.5 0 1 1 0 1H7a.5.5 0 0 1-.5-.5V4.5c0-.27.22-.5.5-.5Zm-2.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5Z" })), sidebar: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.5 4.5c0-.27.22-.5.5-.5h1a.5.5 0 1 1 0 1H3a.5.5 0 0 1-.5-.5ZM3 6a.5.5 0 1 0 0 1h1a.5.5 0 0 0 0-1H3Zm-.5 2.5c0-.27.22-.5.5-.5h1a.5.5 0 1 1 0 1H3a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 13a.5.5 0 0 1-.5-.5v-11c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11Zm.5-1V2h3v10H2ZM6 2h6v10H6V2Z" })), sidebaralt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M9.5 4.5c0-.27.22-.5.5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM10 6a.5.5 0 1 0 0 1h1a.5.5 0 0 0 0-1h-1Zm-.5 2.5c0-.27.22-.5.5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 13a.5.5 0 0 1-.5-.5v-11c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11Zm.5-1V2h6v10H2ZM9 2h3v10H9V2Z" })), sidebaralttoggle: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.5 4.5A.5.5 0 0 0 11 4h-1a.5.5 0 1 0 0 1h1a.5.5 0 0 0 .5-.5ZM11 6a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1h1Zm.5 2.5A.5.5 0 0 0 11 8h-1a.5.5 0 1 0 0 1h1a.5.5 0 0 0 .5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 13a.5.5 0 0 1-.5-.5v-11c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11ZM9 12h3V2H9v10Zm-1 0H2V2h6v4.5H5.2l.66-.65a.5.5 0 1 0-.71-.7l-1.5 1.5a.5.5 0 0 0 0 .7l1.5 1.5a.5.5 0 1 0 .7-.7l-.64-.65H8V12Z" })), sidebartoggle: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.5 4.5c0-.27.22-.5.5-.5h1a.5.5 0 1 1 0 1H3a.5.5 0 0 1-.5-.5ZM3 6a.5.5 0 1 0 0 1h1a.5.5 0 0 0 0-1H3Zm-.5 2.5c0-.27.22-.5.5-.5h1a.5.5 0 1 1 0 1H3a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 13a.5.5 0 0 1-.5-.5v-11c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11Zm.5-1V2h3v10H2Zm4 0V7.5h2.8l-.65.65a.5.5 0 1 0 .7.7l1.5-1.5a.5.5 0 0 0 0-.7l-1.5-1.5a.5.5 0 1 0-.7.7l.64.65H6V2h6v10H6Z" })), bottombar: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3 10.5c0-.27.22-.5.5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Zm3.5-.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1Zm2.5.5c0-.27.22-.5.5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1 1.5c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11ZM2 8V2h10v6H2Zm10 1v3H2V9h10Z" })), bottombartoggle: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.5 10a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1Zm2.5.5c0-.27.22-.5.5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Zm3.5-.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1 12.5v-11c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5Zm1-.5V9h10v3H2Zm4.5-4H2V2h10v6H7.5V5.21l.65.65a.5.5 0 1 0 .7-.71l-1.5-1.5a.5.5 0 0 0-.7 0l-1.5 1.5a.5.5 0 1 0 .7.7l.65-.64v2.8Z" })), cpu: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M5 5.5c0-.27.22-.5.5-.5h3c.28 0 .5.23.5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3ZM6 8V6h2v2H6Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M5.5 0c.28 0 .5.23.5.5V2h2V.5a.5.5 0 0 1 1 0V2h2.5c.28 0 .5.23.5.5V5h1.5a.5.5 0 0 1 0 1H12v2h1.5a.5.5 0 0 1 0 1H12v2.5a.5.5 0 0 1-.5.5H9v1.5a.5.5 0 0 1-1 0V12H6v1.5a.5.5 0 0 1-1 0V12H2.5a.5.5 0 0 1-.5-.5V9H.5a.5.5 0 0 1 0-1H2V6H.5a.5.5 0 0 1 0-1H2V2.5c0-.27.22-.5.5-.5H5V.5c0-.27.22-.5.5-.5ZM11 3H3v8h8V3Z" })), database: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M12 3c0-1.1-2.24-2-5-2s-5 .9-5 2v8c0 .43.26.75.54.98.3.23.68.41 1.12.55.88.3 2.06.47 3.34.47 1.28 0 2.46-.17 3.34-.46.44-.15.83-.33 1.12-.56.28-.23.54-.55.54-.98V3Zm-1.03 0a2.45 2.45 0 0 0-.8-.49A8.88 8.88 0 0 0 7 2c-1.29 0-2.4.21-3.16.51a2.45 2.45 0 0 0-.81.49l.05.05c.13.13.37.28.76.44C4.6 3.79 5.7 4 7 4s2.4-.21 3.16-.51a2.45 2.45 0 0 0 .81-.49ZM11 5.75V4.2A8.9 8.9 0 0 1 7 5a8.98 8.98 0 0 1-4-.8v1.55l.02.04c.02.04.06.09.14.15.17.13.44.27.82.4A10 10 0 0 0 7 6.75a10 10 0 0 0 3.02-.41c.38-.13.65-.27.82-.4a.62.62 0 0 0 .14-.15.15.15 0 0 0 .02-.03v-.01ZM3 7.01c.2.1.42.2.66.28.88.29 2.06.46 3.34.46 1.28 0 2.46-.17 3.34-.46.24-.08.46-.17.66-.28V8.5l-.02.04a.62.62 0 0 1-.14.15c-.17.13-.44.27-.82.4A10 10 0 0 1 7 9.5a10 10 0 0 1-3.02-.41 2.76 2.76 0 0 1-.82-.4.62.62 0 0 1-.14-.15.15.15 0 0 1-.02-.03V7Zm0 2.75V11l.02.04c.02.04.06.09.14.15.17.13.44.27.82.4A10 10 0 0 0 7 12a10 10 0 0 0 3.02-.41c.38-.13.65-.27.82-.4a.62.62 0 0 0 .14-.15.15.15 0 0 0 .02-.03V9.76c-.2.1-.42.2-.66.28-.88.29-2.06.46-3.34.46-1.28 0-2.46-.17-3.34-.46A4.77 4.77 0 0 1 3 9.76Z" })), memory: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5 3a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0V3Zm2-.5c.28 0 .5.22.5.5v3a.5.5 0 0 1-1 0V3c0-.28.22-.5.5-.5Zm3 2a.5.5 0 1 0-1 0V6a.5.5 0 0 0 1 0V4.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M12 3.54a.5.5 0 0 0-.15-.39l-3-3a.5.5 0 0 0-.38-.14H2.5a.5.5 0 0 0-.5.5v13c0 .27.22.5.5.5h9a.5.5 0 0 0 .5-.5V3.53ZM3 1h5.3L11 3.71v5.3H3V1Zm0 9v3h8v-3H3Z" })), structure: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M8.16 3.45a1.5 1.5 0 1 0-2.33 0l-4.02 6.58A1.5 1.5 0 1 0 2.91 12h8.18a1.5 1.5 0 1 0 1.1-1.97L8.16 3.45Zm-1.47.52a1.5 1.5 0 0 0 .62 0l4.03 6.58c-.11.14-.2.29-.25.45H2.9a1.5 1.5 0 0 0-.25-.45L6.7 3.97Z" })), box: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "m7.21.05 6.49 2.99a.5.5 0 0 1 .3.47v6.98a.5.5 0 0 1-.3.47l-6.47 2.98a.5.5 0 0 1-.46 0L.3 10.96a.5.5 0 0 1-.3-.47V3.5a.5.5 0 0 1 .3-.47L6.79.05a.5.5 0 0 1 .43 0ZM1 4.28v5.9l5.5 2.54v-5.9L1 4.28Zm6.5 8.44 5.5-2.54v-5.9L7.5 6.82v5.9Zm4.8-9.22L7 5.95 1.7 3.5 7 1.05l5.3 2.45Z" })), power: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0v-6Z" }), react_default.createElement("path", { d: "M4.27 2.8a.5.5 0 0 0-.54-.83 6 6 0 1 0 6.54 0 .5.5 0 0 0-.54.84 5 5 0 1 1-5.46 0Z" })), photo: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M6.25 4.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm-.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M13 1.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5ZM2 9.3V2h10v5.3L9.85 5.15a.5.5 0 0 0-.7 0L6.5 7.8 5.35 6.65a.5.5 0 0 0-.7 0L2 9.3Zm7.5-3.1L12 8.7V12H2v-1.3l3-3 3.15 3.15a.5.5 0 0 0 .7-.71L7.21 8.5 9.5 6.21Z" })), component: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3.5 1A2.5 2.5 0 0 0 1 3.5v7A2.5 2.5 0 0 0 3.5 13h7a2.5 2.5 0 0 0 2.5-2.5v-7A2.5 2.5 0 0 0 10.5 1h-7ZM12 6.5H7.5V2h3c.83 0 1.5.68 1.5 1.5v3Zm0 1v3c0 .83-.67 1.5-1.5 1.5h-3V7.5H12ZM6.5 12V7.5H2v3c0 .83.67 1.5 1.5 1.5h3ZM2 6.5h4.5V2h-3C2.67 2 2 2.68 2 3.5v3Z" })), grid: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M1 1.5c0-.27.22-.5.5-.5H6c.28 0 .5.23.5.5V6a.5.5 0 0 1-.5.5H1.5A.5.5 0 0 1 1 6V1.5Zm1 4V2h3.5v3.5H2Zm5.5-4c0-.27.22-.5.5-.5h4.5c.28 0 .5.23.5.5V6a.5.5 0 0 1-.5.5H8a.5.5 0 0 1-.5-.5V1.5Zm1 4V2H12v3.5H8.5Zm-7 2A.5.5 0 0 0 1 8v4.5c0 .28.22.5.5.5H6a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5H1.5Zm.5 1V12h3.5V8.5H2ZM7.5 8c0-.27.22-.5.5-.5h4.5c.28 0 .5.23.5.5v4.5a.5.5 0 0 1-.5.5H8a.5.5 0 0 1-.5-.5V8Zm1 4V8.5H12V12H8.5Z" })), outline: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2 2v2H1V1.5c0-.27.22-.5.5-.5H4v1H2ZM1 9V5h1v4H1Zm0 1v2.5c0 .28.22.5.5.5H4v-1H2v-2H1Zm9 3h2.5a.5.5 0 0 0 .5-.5V10h-1v2h-2v1Zm2-9h1V1.5a.5.5 0 0 0-.5-.5H10v1h2v2Zm-3 8v1H5v-1h4ZM9 1v1H5V1h4Zm4 8h-1V5h1v4ZM7 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" })), photodrag: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M8.25 3.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Zm-.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7V.5a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5V3H.5a.5.5 0 0 0-.5.5V6h1V4h2v6.5c0 .28.22.5.5.5H10v2H8v1h2.5a.5.5 0 0 0 .5-.5V11h2.5a.5.5 0 0 0 .5-.5V7ZM4 1v5.8l1.65-1.65c.2-.2.5-.2.7 0L7.5 6.3l2.65-2.65c.2-.2.5-.2.7 0L13 5.8V1H4Zm9 6.21-2.5-2.5-2.3 2.3 1.15 1.14a.5.5 0 1 1-.7.7L6 6.22l-2 2v1.8h9V7.2Z" }), react_default.createElement("path", { d: "M0 10V7h1v3H0Zm0 3.5V11h1v2h2v1H.5a.5.5 0 0 1-.5-.5Zm7 .5H4v-1h3v1Z" })), search: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M9.54 10.2a5.5 5.5 0 1 1 .66-.66c.06.03.11.06.15.1l3 3a.5.5 0 0 1-.7.71l-3-3a.5.5 0 0 1-.1-.14ZM10.5 6a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" })), zoom: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6 3.5c.28 0 .5.22.5.5v1.5H8a.5.5 0 0 1 0 1H6.5V8a.5.5 0 0 1-1 0V6.5H4a.5.5 0 0 1 0-1h1.5V4c0-.28.22-.5.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M9.54 10.2a5.5 5.5 0 1 1 .66-.66c.06.03.11.06.15.1l3 3a.5.5 0 0 1-.7.71l-3-3a.5.5 0 0 1-.1-.14ZM10.5 6a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" })), zoomout: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4 5.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H4Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M6 11.5c1.35 0 2.59-.49 3.54-1.3.03.06.06.11.1.15l3 3a.5.5 0 0 0 .71-.7l-3-3a.5.5 0 0 0-.14-.1A5.5 5.5 0 1 0 6 11.5Zm0-1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" })), zoomreset: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.5 2.84V1.5a.5.5 0 0 0-1 0V4c0 .28.22.5.5.5h2.5a.5.5 0 0 0 0-1H2.26a4.5 4.5 0 1 1-.5 4.02.5.5 0 1 0-.94.33 5.5 5.5 0 0 0 8.72 2.36l.1.14 3 3a.5.5 0 0 0 .71-.7l-3-3a.5.5 0 0 0-.14-.1 5.5 5.5 0 1 0-8.7-6.7Z" })), eye: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "m14 7-.2.3c-.13.16-3.06 4.2-6.8 4.2C3.26 11.5.33 7.46.2 7.3L0 7l.2-.3C.34 6.55 3.27 2.5 7 2.5c3.74 0 6.67 4.04 6.8 4.2l.2.3ZM2.9 5.3A13 13 0 0 0 1.24 7 13 13 0 0 0 2.9 8.7c1.14.97 2.58 1.8 4.1 1.8 1.52 0 2.96-.83 4.1-1.8A13 13 0 0 0 12.76 7a13 13 0 0 0-1.66-1.7C9.96 4.33 8.52 3.5 7 3.5c-1.52 0-2.96.83-4.1 1.8Z" })), eyeclose: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.85 1.15a.5.5 0 1 0-.7.7l11 11a.5.5 0 0 0 .7-.7l-11-11ZM11.1 8.7c-.17.15-.36.3-.55.44l.72.71a13.25 13.25 0 0 0 2.52-2.56L14 7l-.2-.3c-.13-.16-3.06-4.2-6.8-4.2-.89 0-1.73.23-2.5.58l.76.76A4.86 4.86 0 0 1 7 3.5c1.52 0 2.96.83 4.1 1.8A13 13 0 0 1 12.76 7a13 13 0 0 1-1.66 1.7ZM.2 6.7c.08-.09 1.04-1.41 2.53-2.55l.72.71c-.2.14-.38.3-.55.44A13 13 0 0 0 1.24 7 13 13 0 0 0 2.9 8.7c1.14.97 2.58 1.8 4.1 1.8.6 0 1.18-.13 1.74-.34l.77.76c-.78.35-1.62.58-2.51.58C3.26 11.5.33 7.46.2 7.3L0 7l.2-.3Z" }), react_default.createElement("path", { d: "M4.5 7c0-.32.06-.63.17-.91l3.24 3.24A2.5 2.5 0 0 1 4.5 7Zm4.83.91L6.09 4.67a2.5 2.5 0 0 1 3.24 3.24Z" })), lightning: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M2.52 6.6a.57.57 0 0 0-.17.54c.04.2.19.37.38.41l2.78.73-1.5 5c-.06.24.02.5.22.63a.5.5 0 0 0 .28.09.5.5 0 0 0 .35-.14L11.5 7.4c.14-.13.2-.34.15-.54a.53.53 0 0 0-.38-.4l-2.7-.7L10.79.78c.1-.23.04-.5-.15-.66a.5.5 0 0 0-.65 0L2.52 6.6Zm7.72.63-3.07-.8 1.85-4.14-5.2 4.51 2.94.77-1.27 4.28 4.75-4.62Zm-5.73 6.2.04.02Z" })), lightningoff: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.14 8.72 11.5 7.4c.14-.13.2-.34.15-.54a.53.53 0 0 0-.38-.4l-2.7-.7L10.79.78c.1-.23.04-.5-.15-.66a.5.5 0 0 0-.65 0L5.46 4.05l.71.7L9.02 2.3 7.38 5.97l.7.7 2.16.56-.8.79.7.7ZM2.52 6.6a.57.57 0 0 0-.17.54c.04.2.19.37.38.41l2.78.73-1.5 5c-.06.24.02.5.22.63a.5.5 0 0 0 .63-.05l3.84-3.74-.7-.7-2.51 2.43 1.13-3.81-.68-.69L3.8 6.8l.85-.73-.71-.7L2.52 6.6Zm-.67-5.45a.5.5 0 1 0-.7.7l11 11a.5.5 0 0 0 .7-.7l-11-11Z" })), contrast: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3 3H.5a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h10a.5.5 0 0 0 .5-.5V11h2.5a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5V3Zm1 1v2.3L6.3 4H4ZM3 4v6.5a.5.5 0 0 0 .5.5H10v2H1V4h2Zm1-1h6.5a.5.5 0 0 1 .5.5V10h2V1H4v2Zm6 7V7.71l-2.3 2.3H10Zm0-3.7V4.7L4.7 10h1.6L10 6.3ZM9.3 4H7.7L4 7.71V9.3L9.3 4Z" })), switchalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3 3V.5c0-.27.22-.5.5-.5h10c.28 0 .5.23.5.5v10a.5.5 0 0 1-.5.5H11v2.5a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-10c0-.27.22-.5.5-.5H3Zm1 0V1h9v9h-2V3.5a.5.5 0 0 0-.5-.5H4Zm6 8v2H1V4h2v6.5c0 .28.22.5.5.5H10Zm0-1H4V4h6v6Z" })), mirror: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1 1.5c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11ZM2 12h10V2L2 12Z" })), grow: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.5 1a.5.5 0 1 0 0 1H12v10.5a.5.5 0 0 0 1 0V2a1 1 0 0 0-1-1H1.5Z" }), react_default.createElement("path", { d: "M1 3.5c0-.27.22-.5.5-.5H10a1 1 0 0 1 1 1v8.5a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 5a.5.5 0 0 0-.5.5v7c0 .28.22.5.5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7ZM2 6v6h6V6H2Z" })), paintbrush: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M11.8535.1464a.5.5 0 0 0-.7071 0L2.9827 8.3102a2.2396 2.2396 0 0 0-1.0737.599C.6772 10.141.2402 11.903.0852 12.9978 0 13.5998 0 14.0002 0 14.0002s.4004 0 1.0023-.0853c1.095-.155 2.8569-.5919 4.0887-1.8237.307-.307.5067-.6806.5992-1.0743l8.1633-8.1633a.5.5 0 0 0 0-.7071l-2-2Zm-6.253 9.546L6.543 8.75l-1.293-1.2929-.9424.9424a2.242 2.242 0 0 1 .7835.5097c.23.2302.4.4977.5095.7831ZM7.25 8.0428 12.7929 2.5 11.5 1.2071 5.957 6.75 7.25 8.0429ZM4.3839 9.6163c.4881.4882.4881 1.2796 0 1.7678-.7665.7664-1.832 1.1845-2.7791 1.403a8.6972 8.6972 0 0 1-.49.0982 8.7151 8.7151 0 0 1 .0982-.4899c.2186-.9471.6367-2.0126 1.403-2.779.4882-.4882 1.2797-.4882 1.7679 0Z" })), ruler: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1.5 1c.28 0 .5.23.5.5V2h10v-.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-1 0V3H2v.5a.5.5 0 0 1-1 0v-2c0-.27.22-.5.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 6a.5.5 0 0 0-.5.5v6c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-11ZM2 7v5h10V7h-1v2.5a.5.5 0 0 1-1 0V7h-.75v1a.5.5 0 0 1-1 0V7H7.5v2.5a.5.5 0 0 1-1 0V7h-.75v1a.5.5 0 0 1-1 0V7H4v2.5a.5.5 0 0 1-1 0V7H2Z" })), stop: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4.5 4a.5.5 0 0 0-.5.5v5c0 .28.22.5.5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0Zm-1 0A6 6 0 1 1 1 7a6 6 0 0 1 12 0Z" })), camera: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M2.5 1a.5.5 0 0 0-.5.5V2H.5a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H6v-.5a.5.5 0 0 0-.5-.5h-3ZM1 3v8h12V3H1Z" })), video: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.5 10a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M0 4c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2v.5l3.19-2.4a.5.5 0 0 1 .81.4v9a.5.5 0 0 1-.8.4L10 9.5v.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm9 0v1.5a.5.5 0 0 0 .8.4L13 3.5v7L9.8 8.1a.5.5 0 0 0-.8.4V10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1Z" })), speaker: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M1 4.50004V9.50004C1 9.77618 1.22386 10 1.5 10H4L7.17075 12.7744C7.49404 13.0573 8 12.8277 8 12.3982V1.60192C8 1.17235 7.49404 0.942757 7.17075 1.22564L4 4.00004H1.5C1.22386 4.00004 1 4.2239 1 4.50004ZM4 9.00004V5.00004H2V9.00004H4ZM4.99804 9.54456C4.99934 9.52989 5 9.51505 5 9.50004V4.50004C5 4.48504 4.99934 4.47019 4.99804 4.45552L7 2.70381V11.2963L4.99804 9.54456Z" }), react_default.createElement("path", { d: "M10.1498 1.75202C9.88637 1.66927 9.60572 1.81577 9.52297 2.07922C9.44023 2.34267 9.58672 2.62332 9.85017 2.70607C11.6763 3.27963 13 4.98596 13 7.00014C13 9.01433 11.6763 10.7207 9.85017 11.2942C9.58672 11.377 9.44023 11.6576 9.52297 11.9211C9.60572 12.1845 9.88637 12.331 10.1498 12.2483C12.3808 11.5476 14 9.4636 14 7.00014C14 4.53669 12.3808 2.45272 10.1498 1.75202Z" }), react_default.createElement("path", { d: "M10.2504 3.96861C10.0113 3.83033 9.70547 3.91201 9.5672 4.15105C9.42893 4.39008 9.51061 4.69594 9.74964 4.83421C10.4982 5.26723 11 6.07534 11 7.00006C11 7.92479 10.4982 8.7329 9.74964 9.16591C9.51061 9.30418 9.42893 9.61005 9.5672 9.84908C9.70547 10.0881 10.0113 10.1698 10.2504 10.0315C11.2952 9.42711 12 8.29619 12 7.00006C12 5.70394 11.2952 4.57302 10.2504 3.96861Z" })), play: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m12.81 7.43-9.05 5.6A.5.5 0 0 1 3 12.6V1.4c0-.4.43-.63.76-.43l9.05 5.6a.5.5 0 0 1 0 .86Z" })), playback: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.24 12.04 3.7 7.42a.5.5 0 0 1-.2-.23v4.05a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 1.5 0V6.8a.5.5 0 0 1 .2-.23l7.54-4.6a.5.5 0 0 1 .76.42v9.22a.5.5 0 0 1-.76.43Z" })), playnext: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m2.76 12.04 7.54-4.61a.5.5 0 0 0 .2-.23v4.05a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0V6.8a.5.5 0 0 0-.2-.23l-7.54-4.6a.5.5 0 0 0-.76.42v9.22c0 .39.43.63.76.43Z" })), rewind: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M9 2.42v2.32L13.23 2a.5.5 0 0 1 .77.42v9.16a.5.5 0 0 1-.77.42L9 9.26v2.32a.5.5 0 0 1-.77.42L1.5 7.65v3.6a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 1.5 0v3.6L8.23 2a.5.5 0 0 1 .77.42Z" })), fastforward: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5 2.42v2.32L.77 2a.5.5 0 0 0-.77.42v9.16c0 .4.44.64.77.42L5 9.26v2.32c0 .4.44.64.77.42l6.73-4.35v3.6a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0v3.6L5.77 2a.5.5 0 0 0-.77.42Z" })), stopalt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1 1.5c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11Z" })), sidebyside: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M1 1.5c0-.27.22-.5.5-.5h11c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11ZM2 12V2h5v10H2Z" })), stacked: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M12.5 1c.28 0 .5.23.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11c0-.27.22-.5.5-.5h11ZM2 2h10v5H2V2Z" })), sun: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.5.5a.5.5 0 0 0-1 0V2a.5.5 0 0 0 1 0V.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" }), react_default.createElement("path", { d: "M7 11.5c.28 0 .5.22.5.5v1.5a.5.5 0 0 1-1 0V12c0-.28.22-.5.5-.5ZM11.5 7c0-.28.22-.5.5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5ZM.5 6.5a.5.5 0 0 0 0 1H2a.5.5 0 0 0 0-1H.5ZM3.82 10.18c.2.2.2.51 0 .7l-1.06 1.07a.5.5 0 1 1-.71-.7l1.06-1.07c.2-.2.51-.2.7 0ZM11.95 2.76a.5.5 0 1 0-.7-.71l-1.07 1.06a.5.5 0 1 0 .7.7l1.07-1.05ZM10.18 10.18c.2-.2.51-.2.7 0l1.07 1.06a.5.5 0 1 1-.7.71l-1.07-1.06a.5.5 0 0 1 0-.7ZM2.76 2.05a.5.5 0 1 0-.71.7l1.06 1.07a.5.5 0 0 0 .7-.7L2.77 2.04Z" })), moon: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M7.78.04a7.03 7.03 0 0 0-4.28.9 7 7 0 1 0 9.87 8.96c.1-.21-.14-.41-.36-.32a4.98 4.98 0 0 1-2 .42A5 5 0 0 1 8.53.65c.2-.12.19-.44-.04-.49a7.04 7.04 0 0 0-.72-.12Zm-1.27.98a6 6 0 0 0 4.98 9.96 6 6 0 1 1-4.98-9.96Z" })), book: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M13 2a2 2 0 0 0-2-2H1.5a.5.5 0 0 0-.5.5v13c0 .28.22.5.5.5H11a2 2 0 0 0 2-2V2ZM3 13h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H7v6a.5.5 0 0 1-.86.36L5.5 6.7l-.65.65A.5.5 0 0 1 4 7V1H3v12ZM5 1v4.8l.15-.15a.5.5 0 0 1 .74.04l.11.1V1H5Z" })), document: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4 5.5c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5ZM4.5 7.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5ZM4 10.5c0-.28.22-.5.5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 0a.5.5 0 0 0-.5.5v13c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5V3.2a.5.5 0 0 0-.15-.35l-2.7-2.7A.5.5 0 0 0 9.79 0H1.5ZM2 1h7.5v2c0 .28.22.5.5.5h2V13H2V1Z" })), copy: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M11.75.07A.5.5 0 0 0 11.5 0h-6a.5.5 0 0 0-.5.5V3H.5a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h8a.5.5 0 0 0 .5-.5V11h4.5a.5.5 0 0 0 .5-.5V2.51a.5.5 0 0 0-.15-.36l-2-2a.5.5 0 0 0-.1-.08ZM9 10h4V3h-1.5a.5.5 0 0 1-.5-.5V1H6v2h.5a.5.5 0 0 1 .36.15l1.99 2c.1.09.15.21.15.35v4.51ZM1 4v9h7V6H6.5a.5.5 0 0 1-.5-.5V4H1Z" })), category: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3 1.5c0-.28.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Zm-1 2c0-.27.22-.5.5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1 5.5c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7ZM2 12V6h10v6H2Z" })), folder: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M6.59 3.5 5.09 2H1v9h12V3.5H6.59Zm.41-1L5.8 1.3a1 1 0 0 0-.71-.3H.5a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H7Z" })), print: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4.5 8a.5.5 0 1 0 0 1h5a.5.5 0 0 0 0-1h-5Zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M2 1.5c0-.27.22-.5.5-.5h8a.5.5 0 0 1 .36.15l.99 1c.1.09.15.21.15.35v1.51h1.5c.28 0 .5.22.5.5v5a.5.5 0 0 1-.5.5H12v2.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10H.5a.5.5 0 0 1-.5-.5v-5c0-.28.22-.5.5-.5H2V1.5ZM13 9h-1V6.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V9H1V5h12v4Zm-2-6v1H3V2h7v.5c0 .28.22.5.5.5h.5Zm-8 9h8V7H3v5Z" })), graphline: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5.15 6.15c.2-.2.5-.2.7 0L7 7.3l2.15-2.15c.2-.2.5-.2.7 0l1 1a.5.5 0 0 1-.7.7l-.65-.64-2.15 2.15a.5.5 0 0 1-.7 0L5.5 7.2 3.85 8.86a.5.5 0 1 1-.7-.71l2-2Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1.5 1a.5.5 0 0 0-.5.5v11c0 .28.22.5.5.5h11a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-11ZM2 2v10h10V2H2Z" })), calendar: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3.5 0c.28 0 .5.22.5.5V1h6V.5a.5.5 0 0 1 1 0V1h1.5c.28 0 .5.22.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11c0-.28.22-.5.5-.5H3V.5c0-.28.22-.5.5-.5ZM2 4v2.3h3V4H2Zm0 5.2V6.8h3v2.4H2Zm0 .5V12h3V9.7H2Zm3.5 0V12h3V9.7h-3Zm3.5 0V12h3V9.7H9Zm3-.5H9V6.8h3v2.4Zm-3.5 0h-3V6.8h3v2.4ZM9 4v2.3h3V4H9ZM5.5 6.3h3V4h-3v2.3Z" })), graphbar: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M12 2.5a.5.5 0 0 0-1 0v10a.5.5 0 0 0 1 0v-10Zm-3 2a.5.5 0 0 0-1 0v8a.5.5 0 0 0 1 0v-8ZM5.5 7c.28 0 .5.22.5.5v5a.5.5 0 0 1-1 0v-5c0-.28.22-.5.5-.5ZM3 10.5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2Z" })), menu: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M13 2a.5.5 0 0 1 0 1H1a.5.5 0 0 1 0-1h12Zm-3 3a.5.5 0 0 1 0 1H1a.5.5 0 0 1 0-1h9Zm1.5 3.5A.5.5 0 0 0 11 8H1a.5.5 0 0 0 0 1h10a.5.5 0 0 0 .5-.5Zm-4 2.5a.5.5 0 0 1 0 1H1a.5.5 0 0 1 0-1h6.5Z" })), menualt: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1 2a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1H1Zm3 3a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1H4ZM2.5 8.5c0-.28.22-.5.5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5Zm4 2.5a.5.5 0 0 0 0 1H13a.5.5 0 0 0 0-1H6.5Z" })), filter: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1 2a.5.5 0 0 0 0 1h12a.5.5 0 0 0 0-1H1Zm2 3a.5.5 0 0 0 0 1h8a.5.5 0 0 0 0-1H3Zm1.5 3.5c0-.28.22-.5.5-.5h4a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5Zm2 2.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1Z" })), docchart: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M1 1.5C1 1.22386 1.22386 1 1.5 1H12.5C12.7761 1 13 1.22386 13 1.5V12.5C13 12.7761 12.7761 13 12.5 13H1.5C1.22386 13 1 12.7761 1 12.5V1.5ZM2 4V6.2998H5V4H2ZM2 9.2002V6.7998H5V9.2002H2ZM2 9.7002V12H5V9.7002H2ZM5.5 9.7002V12H8.5V9.7002H5.5ZM9 9.7002V12H12V9.7002H9ZM12 9.2002H9V6.7998H12V9.2002ZM8.5 9.2002H5.5V6.7998H8.5V9.2002ZM9 6.2998H12V4H9V6.2998ZM5.5 6.2998H8.5V4H5.5V6.2998Z" })), doclist: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M3.5 6.5c0-.28.22-.5.5-.5h6a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5ZM4 9a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H4Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M1 1.5c0-.28.22-.5.5-.5h11c.28 0 .5.22.5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11ZM2 4v8h10V4H2Z" })), markup: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M8.98 1.63a.5.5 0 0 0-.96-.26l-3 11a.5.5 0 1 0 .96.26l3-11ZM3.32 3.62a.5.5 0 0 1 .06.7L1.15 7l2.23 2.68a.5.5 0 1 1-.76.64l-2.5-3a.5.5 0 0 1 0-.64l2.5-3a.5.5 0 0 1 .7-.06Zm7.36 0a.5.5 0 0 0-.06.7L12.85 7l-2.23 2.68a.5.5 0 0 0 .76.64l2.5-3a.5.5 0 0 0 0-.64l-2.5-3a.5.5 0 0 0-.7-.06Z" })), bold: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3 2v1.5h1v7H3V12h5a3 3 0 0 0 1.8-5.4A2.74 2.74 0 0 0 8 2H3Zm5 5.5H5.5v3H8a1.5 1.5 0 1 0 0-3Zm-.25-4H5.5V6h2.25a1.25 1.25 0 1 0 0-2.5Z" })), italic: react_default.createElement("path", { d: "M5 2h6v1H8.5l-2 8H9v1H3v-1h2.5l2-8H5V2Z" }), paperclip: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.55 2.27a1.5 1.5 0 0 0-2.12 0L2.78 7.92a2.5 2.5 0 0 0 3.53 3.54l3.54-3.54a.5.5 0 1 1 .7.71l-3.53 3.54a3.5 3.5 0 0 1-4.96-4.94v-.01l5.66-5.66h.01a2.5 2.5 0 0 1 3.53 3.53L5.6 10.76a1.5 1.5 0 0 1-2.12-2.12L7.02 5.1a.5.5 0 1 1 .7.7L4.2 9.34a.5.5 0 0 0 .7.7l5.66-5.65a1.5 1.5 0 0 0 0-2.12Z" })), listordered: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5 2.5c0-.28.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5ZM5 7c0-.28.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 7Zm.5 4a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Zm-3-9H1v1h1v3h1V2.5a.5.5 0 0 0-.5-.5ZM3 8.5v1a.5.5 0 0 1-1 0V9h-.5a.5.5 0 0 1 0-1h1c.28 0 .5.22.5.5Zm-1 2a.5.5 0 0 0-1 0V12h2v-1H2v-.5Z" })), listunordered: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.75 2.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM5.5 2a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Zm0 9a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7ZM2 12.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 7c0-.28.22-.5.5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 7Zm-3 .75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" })), paragraph: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6 7a3 3 0 1 1 0-6h5.5a.5.5 0 0 1 0 1H10v10.5a.5.5 0 0 1-1 0V2H7v10.5a.5.5 0 0 1-1 0V7Z" })), markdown: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2 4.5h1.5L5 6.38 6.5 4.5H8v5H6.5V7L5 8.88 3.5 7v2.5H2v-5Zm7.75 0h1.5V7h1.25l-2 2.5-2-2.5h1.25V4.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M.5 2a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H.5ZM1 3v8h12V3H1Z" })), repository: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M5 2.5C5 2.77614 4.77614 3 4.5 3C4.22386 3 4 2.77614 4 2.5C4 2.22386 4.22386 2 4.5 2C4.77614 2 5 2.22386 5 2.5Z" }), react_default.createElement("path", { d: "M4.5 5C4.77614 5 5 4.77614 5 4.5C5 4.22386 4.77614 4 4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5Z" }), react_default.createElement("path", { d: "M5 6.5C5 6.77614 4.77614 7 4.5 7C4.22386 7 4 6.77614 4 6.5C4 6.22386 4.22386 6 4.5 6C4.77614 6 5 6.22386 5 6.5Z" }), react_default.createElement("path", { fillRule: "evenodd", d: "M11 0C12.1046 0 13 0.895431 13 2V12C13 13.1046 12.1046 14 11 14H1.5C1.22386 14 1 13.7761 1 13.5V0.5C1 0.223857 1.22386 0 1.5 0H11ZM11 1H3V13H11C11.5523 13 12 12.5523 12 12V2C12 1.44772 11.5523 1 11 1Z" })), commit: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M3.03 7.5a4 4 0 0 0 7.94 0h2.53a.5.5 0 0 0 0-1h-2.53a4 4 0 0 0-7.94 0H.5a.5.5 0 0 0 0 1h2.53ZM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" })), branch: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M6 2.5c0 .65-.42 1.2-1 1.41v4.06A3.36 3.36 0 0 1 7.5 7a2.7 2.7 0 0 0 1.81-.56c.22-.18.38-.4.48-.62a1.5 1.5 0 1 1 1.03.15c-.16.42-.43.87-.86 1.24-.57.47-1.37.79-2.46.79-1.04 0-1.64.42-2 .92-.26.37-.4.8-.47 1.18A1.5 1.5 0 1 1 4 10.09V3.9a1.5 1.5 0 1 1 2-1.4Zm-2 9a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0Zm1-9a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm6 2a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" })), pullrequest: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M8.35 1.35 7.71 2h.79A2.5 2.5 0 0 1 11 4.5v5.59a1.5 1.5 0 1 1-1 0V4.5C10 3.67 9.33 3 8.5 3h-.8l.65.65a.5.5 0 1 1-.7.7l-1.5-1.5a.5.5 0 0 1 0-.7l1.5-1.5a.5.5 0 1 1 .7.7ZM11 11.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM4 3.91a1.5 1.5 0 1 0-1 0v6.18a1.5 1.5 0 1 0 1 0V3.9ZM3.5 11a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Zm0-8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" })), merge: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M4.1 3.87a1.5 1.5 0 1 0-1.1.04v6.18a1.5 1.5 0 1 0 1 0V6.4c.26.4.57.77.93 1.08A6.57 6.57 0 0 0 9.08 9a1.5 1.5 0 1 0 0-1 5.57 5.57 0 0 1-3.5-1.25 4.74 4.74 0 0 1-1.47-2.87ZM3.5 11a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1ZM4 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm7 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" })), apple: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.03 8.1a3.05 3.05 0 0 1-.2-1.74 2.7 2.7 0 0 1 1.4-1.94 3.13 3.13 0 0 0-2.35-1.4c-.84-.08-2.01.56-2.65.57h-.02c-.63 0-1.81-.65-2.64-.57-.42.04-1.75.32-2.55 1.6-.28.44-.5 1.01-.58 1.74a6.36 6.36 0 0 0 .02 1.74 7.5 7.5 0 0 0 1.35 3.33c.7 1.01 1.51 1.6 1.97 1.6.93.02 1.74-.6 2.41-.6l.02.01h.04c.67-.02 1.48.61 2.42.6.45-.02 1.26-.6 1.97-1.6a7.95 7.95 0 0 0 .97-1.86 2.6 2.6 0 0 1-1.58-1.48ZM8.86 2.13c.72-.85.7-2.07.63-2.12-.07-.06-1.25.16-1.99.98a2.78 2.78 0 0 0-.62 2.13c.06.05 1.27-.14 1.98-.99Z" })), linux: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M7 0a3 3 0 0 1 3 3v1.24c.13.13.25.27.36.42l.52.43.2.15c.32.26.7.59 1.09.97A6.28 6.28 0 0 1 14 9.54a.5.5 0 0 1-.35.44c-.31.1-.8.18-1.34.13-.33-.03-.7-.12-1.05-.3-.04.17-.1.34-.17.51a2 2 0 1 1-2.89 2.56 5.5 5.5 0 0 1-2.4 0 2 2 0 1 1-2.9-2.56 5.56 5.56 0 0 1-.16-.51c-.35.18-.72.27-1.05.3a3.4 3.4 0 0 1-1.34-.13.5.5 0 0 1-.35-.44l.01-.14a6.28 6.28 0 0 1 1.82-3.2 13.42 13.42 0 0 1 1.3-1.11c.22-.19.4-.32.5-.43.12-.15.24-.29.37-.42V3a3 3 0 0 1 3-3Zm1 11.9a2 2 0 0 1 2.14-1.9 5.5 5.5 0 0 0 .36-2c0-.51-.1-1.07-.3-1.6l-.03-.02a4.4 4.4 0 0 0-.86-.42 6.71 6.71 0 0 0-1-.31l-.86.64c-.27.2-.63.2-.9 0l-.85-.64a6.72 6.72 0 0 0-1.87.73l-.03.02A4.6 4.6 0 0 0 3.5 8c0 .68.11 1.39.36 2H4a2 2 0 0 1 2 1.9 4.49 4.49 0 0 0 2 0ZM5 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.1 4.3a1.5 1.5 0 0 1 1.8 0l.27.2L7 5.38 5.83 4.5l.27-.2ZM8.5 2c.28 0 .5.22.5.5V3a.5.5 0 0 1-1 0v-.5c0-.28.22-.5.5-.5ZM6 2.5a.5.5 0 0 0-1 0V3a.5.5 0 0 0 1 0v-.5Z" })), ubuntu: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M12.26 2.07c0 1.14-.89 2.06-1.99 2.06s-1.99-.92-1.99-2.06c0-1.14.9-2.07 2-2.07s1.98.93 1.98 2.07ZM3.98 6.6c0 1.14-.9 2.07-2 2.07C.9 8.67 0 7.74 0 6.6c0-1.14.9-2.07 1.99-2.07 1.1 0 1.99.93 1.99 2.07ZM6.47 11.92a4.76 4.76 0 0 1-3.3-2.62c-.53.25-1.12.33-1.7.22a6.72 6.72 0 0 0 1.84 2.63 6.38 6.38 0 0 0 4.24 1.58c-.37-.5-.57-1.1-.59-1.73a4.77 4.77 0 0 1-.49-.08ZM11.81 11.93c0 1.14-.89 2.07-1.99 2.07s-1.98-.93-1.98-2.07c0-1.14.89-2.06 1.98-2.06 1.1 0 2 .92 2 2.06ZM12.6 11.17a6.93 6.93 0 0 0 .32-7.93A2.95 2.95 0 0 1 11.8 4.6a5.23 5.23 0 0 1-.16 5.03c.47.4.8.94.95 1.54ZM1.99 3.63h-.15A6.48 6.48 0 0 1 8 .24a3.07 3.07 0 0 0-.6 1.68 4.7 4.7 0 0 0-3.9 2.17c-.46-.3-.98-.45-1.51-.45Z" })), windows: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6.5 1H1v5.5h5.5V1ZM13 1H7.5v5.5H13V1ZM7.5 7.5H13V13H7.5V7.5ZM6.5 7.5H1V13h5.5V7.5Z" })), storybook: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M2.04.62a.7.7 0 0 0-.66.72l.44 11.56c.01.37.3.66.67.68l9.4.42h.02a.7.7 0 0 0 .7-.7V.66a.7.7 0 0 0-.74-.66l-.77.05.05 1.62a.1.1 0 0 1-.17.08l-.52-.4-.61.46a.1.1 0 0 1-.17-.09L9.75.13l-7.7.49Zm8 4.74c-.24.2-2.09.33-2.09.05.04-1.04-.43-1.09-.69-1.09-.24 0-.66.08-.66.64 0 .57.6.89 1.32 1.27 1.02.53 2.24 1.18 2.24 2.82 0 1.57-1.27 2.43-2.9 2.43-1.67 0-3.14-.68-2.97-3.03.06-.27 2.2-.2 2.2 0-.03.97.19 1.26.75 1.26.43 0 .62-.24.62-.64 0-.6-.63-.95-1.36-1.36-.99-.56-2.15-1.2-2.15-2.7 0-1.5 1.03-2.5 2.86-2.5 1.83 0 2.84.99 2.84 2.85Z" })), azuredevops: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "m0 5.18 1.31-1.73 4.9-2V.01l4.3 3.15-8.78 1.7v4.8L0 9.16V5.18Zm14-2.6v8.55l-3.36 2.86-5.42-1.79V14L1.73 9.66l8.78 1.05V3.16L14 2.58Z" })), bitbucket: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M1 1.52A.41.41 0 0 0 .59 2l1.74 10.6c.05.26.28.46.55.46h8.37c.2 0 .38-.14.42-.34l1.01-6.25H8.81l-.46 2.71H5.68L4.95 5.4h7.91L13.4 2a.41.41 0 0 0-.41-.48H1Z" })), chrome: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M13.02 3.43a.11.11 0 0 1-.1.17H7a3.4 3.4 0 0 0-3.3 2.55.11.11 0 0 1-.21.03L1.52 2.76a.11.11 0 0 1 0-.12 6.97 6.97 0 0 1 9-1.7c1.03.6 1.9 1.47 2.5 2.5ZM7 9.62a2.62 2.62 0 1 1 0-5.24 2.62 2.62 0 0 1 0 5.24Zm1.03.7a.11.11 0 0 0-.12-.04 3.4 3.4 0 0 1-4-1.84L1.1 3.57a.11.11 0 0 0-.2 0 7 7 0 0 0 5.07 10.35c.04 0 .08-.02.1-.05l1.97-3.42a.11.11 0 0 0 0-.13Zm1.43-5.95h3.95c.05 0 .1.03.1.07a6.97 6.97 0 0 1-1.53 7.48A6.96 6.96 0 0 1 7.08 14a.11.11 0 0 1-.1-.17l2.81-4.88h.01a3.38 3.38 0 0 0-.42-4.38.11.11 0 0 1 .08-.2Z" })), chromatic: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M0 7a7 7 0 1 0 14 0A7 7 0 0 0 0 7Zm5.22-3.87a1.97 1.97 0 0 1 3.75.83v1.29L5.61 3.32a2.49 2.49 0 0 0-.4-.19ZM8.7 5.71 5.35 3.78a1.97 1.97 0 0 0-2.6 2.83c.12-.1.24-.18.37-.26l1.51-.87a.27.27 0 0 1 .27 0L7 6.69l1.7-.98Zm-.32 4.97-1.52-.87a.27.27 0 0 1-.13-.23V7.15l-1.7-.97v3.86a1.97 1.97 0 0 0 3.75.83 2.5 2.5 0 0 1-.4-.19Zm.26-.46a1.97 1.97 0 0 0 2.6-2.83c-.11.1-.23.18-.36.26L7.53 9.58l1.11.64Zm-4.1.26h-.17a1.97 1.97 0 0 1-1.9-2.47 2 2 0 0 1 .92-1.2l1.11-.63v3.86c0 .14.01.29.04.44Zm6.79-5.98a1.97 1.97 0 0 0-1.87-.97c.03.14.04.29.04.43v1.75c0 .1-.05.19-.14.23l-2.1 1.22V9.1l3.35-1.93a1.97 1.97 0 0 0 .72-2.68Z" })), componentdriven: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.85 2.18 8.87.2a.69.69 0 0 0-.97 0L3.09 5.01a.69.69 0 0 0 0 .97l2.46 2.46-2.4 2.4a.69.69 0 0 0 0 .98l1.98 1.98c.27.27.7.27.97 0l4.8-4.81a.69.69 0 0 0 0-.97L8.45 5.56l2.4-2.4a.69.69 0 0 0 0-.98Z" })), discord: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M11.85 2.88C10.95 2.48 10 2.18 9 2a7.05 7.05 0 0 0-.4.75 10.66 10.66 0 0 0-3.2 0c-.1-.23-.24-.5-.36-.73A.04.04 0 0 0 4.99 2a11.51 11.51 0 0 0-2.86.9 11.82 11.82 0 0 0-2.05 8 11.6 11.6 0 0 0 3.5 1.77c.01 0 .03 0 .04-.02.27-.36.51-.75.72-1.16a.04.04 0 0 0-.03-.06 7.66 7.66 0 0 1-1.09-.52.04.04 0 0 1 0-.08 5.96 5.96 0 0 0 .26-.17 8.28 8.28 0 0 0 7.08 0l.22.17c.02.02.02.06 0 .08-.36.2-.72.37-1.1.52a.04.04 0 0 0-.02.06c.2.4.45.8.71 1.16.01.02.03.02.05.02a11.57 11.57 0 0 0 3.52-1.8 11.74 11.74 0 0 0-2.09-7.99Zm-7.17 6.4c-.7 0-1.26-.63-1.26-1.41 0-.78.56-1.41 1.26-1.41s1.27.64 1.26 1.4c0 .79-.56 1.42-1.26 1.42Zm4.65 0c-.69 0-1.26-.63-1.26-1.41 0-.78.56-1.41 1.26-1.41s1.27.64 1.26 1.4c0 .79-.55 1.42-1.26 1.42Z" })), facebook: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.4 14H5.06V7H3.5V4.59h1.56V3.17C5.06 1.2 5.53 0 7.6 0h1.72v2.41H8.25c-.8 0-.85.34-.85.97v1.2h1.93L9.11 7H7.4l-.01 7Z" })), figma: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { fillRule: "evenodd", d: "M9.2 0H4.8a2.6 2.6 0 0 0-1.4 4.8 2.6 2.6 0 0 0 0 4.4 2.6 2.6 0 1 0 4 2.2V8.89a2.6 2.6 0 1 0 3.2-4.09A2.6 2.6 0 0 0 9.2 0ZM7.4 7A1.8 1.8 0 1 0 11 7a1.8 1.8 0 0 0-3.6 0Zm-.8 2.6H4.8a1.8 1.8 0 1 0 1.8 1.8V9.6ZM4.8 4.4h1.8V.8H4.8a1.8 1.8 0 0 0 0 3.59Zm0 .8a1.8 1.8 0 0 0 0 3.6h1.8V5.2H4.8Zm4.4-.8H7.4V.8h1.8a1.8 1.8 0 1 1 0 3.59Z" })), gdrive: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M6.37 8.77 4.33 12.3h6.75l2.04-3.54H6.38Zm6.18-1-3.5-6.08h-4.1l3.51 6.08h4.09ZM4.38 2.7.88 8.77l2.04 3.54 3.5-6.07L4.38 2.7Z" })), github: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7 0a7 7 0 0 0-2.21 13.64c.35.06.48-.15.48-.33L5.26 12c-1.76.32-2.21-.43-2.35-.83-.08-.2-.43-.82-.72-.99-.25-.13-.6-.45-.01-.46.55 0 .94.5 1.07.72.63 1.06 1.64.76 2.04.58.07-.46.25-.77.45-.94-1.56-.18-3.19-.78-3.19-3.46 0-.76.28-1.39.72-1.88-.07-.17-.31-.9.07-1.85 0 0 .59-.19 1.93.71a6.5 6.5 0 0 1 3.5 0c1.34-.9 1.92-.71 1.92-.71.39.96.14 1.68.07 1.85.45.5.72 1.11.72 1.88 0 2.69-1.64 3.28-3.2 3.46.26.22.48.64.48 1.3l-.01 1.92c0 .18.13.4.48.33A7.01 7.01 0 0 0 7 0Z" })), gitlab: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4.53 5.58H1.07l1.49-4.55a.26.26 0 0 1 .48 0l1.49 4.55ZM7 13.15 1.07 5.58l-.75 2.3a.5.5 0 0 0 .18.57l6.5 4.7Zm0 0 6.5-4.7a.5.5 0 0 0 .18-.57l-.75-2.3L7 13.15l2.47-7.57H4.53L7 13.15Zm2.47-7.57h3.46l-1.49-4.55a.26.26 0 0 0-.48 0L9.47 5.58Z" })), google: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.92 1.1H7.26c-1.64 0-3.19 1.24-3.19 2.68 0 1.47 1.12 2.66 2.8 2.66l.33-.01c-.1.2-.18.44-.18.68 0 .41.22.75.5 1.02h-.64c-2.03 0-3.6 1.3-3.6 2.64 0 1.32 1.72 2.15 3.75 2.15 2.32 0 3.6-1.31 3.6-2.64 0-1.06-.31-1.7-1.28-2.38-.33-.23-.96-.8-.96-1.14 0-.39.1-.58.7-1.04a2.46 2.46 0 0 0 1.03-1.92c0-.92-.4-1.82-1.18-2.11h1.17l.81-.6ZM9.6 10.04c.03.13.05.25.05.38 0 1.07-.7 1.9-2.67 1.9-1.4 0-2.42-.88-2.42-1.95 0-1.05 1.26-1.92 2.66-1.9a3 3 0 0 1 .92.14c.76.53 1.3.83 1.46 1.43ZM7.34 6.07c-.94-.03-1.84-1.06-2-2.3-.17-1.24.47-2.19 1.41-2.16.94.03 1.84 1.03 2 2.26.17 1.24-.47 2.23-1.41 2.2Z" })), graphql: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M7.87 11.6a1.17 1.17 0 0 0-1.7-.02l-2.71-1.56.01-.04h7.07l.02.07-2.69 1.56Zm-1.7-9.18.03.03-3.54 6.12h-.04V5.43a1.17 1.17 0 0 0 .84-1.46l2.7-1.56Zm4.38 1.56a1.17 1.17 0 0 0 .84 1.46v3.12l-.04.01-3.54-6.12c.02 0 .03-.02.04-.03l2.7 1.56ZM3.47 9.42a1.17 1.17 0 0 0-.32-.57l3.53-6.12a1.17 1.17 0 0 0 .65 0l3.54 6.12a1.17 1.17 0 0 0-.33.57H3.47Zm8.8-.74c-.1-.05-.21-.1-.32-.12V5.44a1.17 1.17 0 1 0-1.12-1.94l-2.7-1.56a1.17 1.17 0 1 0-2.24 0L3.19 3.5a1.17 1.17 0 1 0-1.13 1.94v3.12a1.17 1.17 0 1 0 1.12 1.94l2.7 1.56a1.17 1.17 0 1 0 2.24-.03l2.69-1.55a1.17 1.17 0 1 0 1.45-1.8Z" })), medium: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M0 0v14h14V0H0Zm11.63 3.32-.75.72a.22.22 0 0 0-.08.2v5.33c0 .07.03.14.08.18l.73.72v.16H7.92v-.16l.76-.74c.08-.07.08-.1.08-.21V5.24l-2.11 5.37h-.29L3.9 5.24v3.67c0 .13.05.25.14.34l.99 1.2v.16h-2.8v-.16l.98-1.2a.48.48 0 0 0 .13-.41V4.65c0-.11-.04-.2-.12-.27l-.88-1.06v-.16h2.73l2.1 4.62 1.86-4.62h2.6v.16Z" })), redux: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M4.06 9.69c.02.49.42.88.91.88H5a.91.91 0 0 0-.03-1.83h-.03c-.03 0-.08 0-.11.02a5.97 5.97 0 0 1-.85-3.62c.06-.98.39-1.82.96-2.52.47-.6 1.39-.9 2-.92 1.73-.03 2.47 2.12 2.51 2.99.22.04.57.16.82.24-.2-2.64-1.83-4-3.4-4-1.46 0-2.81 1.05-3.35 2.61a6.67 6.67 0 0 0 .65 5.68.74.74 0 0 0-.11.47Zm8.28-2.3a6.62 6.62 0 0 0-5.15-2.25h-.26a.9.9 0 0 0-.8-.49H6.1a.91.91 0 0 0 .03 1.83h.03a.92.92 0 0 0 .8-.56h.3c1.23 0 2.4.36 3.47 1.06.81.54 1.4 1.24 1.72 2.09.28.68.26 1.35-.03 1.92a2.4 2.4 0 0 1-2.23 1.34c-.65 0-1.27-.2-1.6-.34-.18.16-.5.42-.73.58.7.33 1.41.5 2.1.5 1.56 0 2.72-.85 3.16-1.72.47-.94.44-2.57-.78-3.96ZM4.9 12.9a4 4 0 0 1-.98.11c-1.2 0-2.3-.5-2.84-1.32C.38 10.6.13 8.3 2.5 6.58c.05.26.15.62.22.83-.31.23-.8.68-1.11 1.3a2.4 2.4 0 0 0 .13 2.53c.36.54.93.86 1.66.96.9.11 1.8-.05 2.66-.5a5.83 5.83 0 0 0 2.67-2.56.91.91 0 0 1 .62-1.55h.03a.92.92 0 0 1 .1 1.82 6.26 6.26 0 0 1-4.56 3.49Z" })), twitter: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M14 2.55c-.51.23-1.07.39-1.65.46.6-.36 1.05-.94 1.26-1.63-.55.34-1.17.58-1.82.72a2.84 2.84 0 0 0-2.1-.93 2.9 2.9 0 0 0-2.8 3.61 8.09 8.09 0 0 1-5.9-3.07 2.99 2.99 0 0 0 .88 3.93 2.8 2.8 0 0 1-1.3-.37v.04c0 1.42 1 2.61 2.3 2.89a2.82 2.82 0 0 1-1.3.05 2.89 2.89 0 0 0 2.7 2.04A5.67 5.67 0 0 1 0 11.51a7.98 7.98 0 0 0 4.4 1.32c5.29 0 8.17-4.48 8.17-8.38v-.38A5.93 5.93 0 0 0 14 2.55Z" })), youtube: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M13.99 8.17V5.83a14.95 14.95 0 0 0-.23-2.22c-.09-.38-.27-.7-.55-.96s-.6-.41-.97-.45A51.3 51.3 0 0 0 7 2c-2.34 0-4.09.07-5.24.2A1.78 1.78 0 0 0 .25 3.61 15.26 15.26 0 0 0 0 7v1.16a15.24 15.24 0 0 0 .24 2.22c.09.38.27.7.55.96.27.26.6.41.97.45 1.15.13 2.9.2 5.24.2 2.34 0 4.08-.06 5.24-.2.37-.04.7-.19.97-.45s.45-.58.54-.96a15.26 15.26 0 0 0 .24-2.22Zm-4.23-1.6c.16.1.24.24.24.43 0 .2-.08.33-.24.42l-4 2.5a.44.44 0 0 1-.26.08.54.54 0 0 1-.24-.06A.46.46 0 0 1 5 9.5v-5c0-.2.08-.34.26-.44.17-.1.34-.09.5.02l4 2.5Z" })), linkedin: react_default.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.6667 13H2.33333C1.59695 13 1 12.403 1 11.6667V2.33333C1 1.59695 1.59695 1 2.33333 1H11.6667C12.403 1 13 1.59695 13 2.33333V11.6667C13 12.403 12.403 13 11.6667 13ZM9.55293 11.3333H11.3337V7.67516C11.3337 6.12737 10.4563 5.379 9.23075 5.379C8.00467 5.379 7.48867 6.33378 7.48867 6.33378V5.55552H5.77255V11.3333H7.48867V8.30031C7.48867 7.48764 7.86276 7.00405 8.57878 7.00405C9.23696 7.00405 9.55293 7.46875 9.55293 8.30031V11.3333ZM2.66699 3.73279C2.66699 4.32157 3.14067 4.79896 3.72522 4.79896C4.30977 4.79896 4.78316 4.32157 4.78316 3.73279C4.78316 3.14402 4.30977 2.66663 3.72522 2.66663C3.14067 2.66663 2.66699 3.14402 2.66699 3.73279ZM4.62856 11.3333H2.83908V5.55552H4.62856V11.3333Z", fill: "#1EA7FD" }), vscode: react_default.createElement(react_default.Fragment, null, react_default.createElement("path", { d: "M10.24.04c.13 0 .26.03.38.09L13.5 1.5a.87.87 0 0 1 .5.8v.03-.01 9.39c0 .33-.2.63-.5.78l-2.88 1.38a.87.87 0 0 1-1-.17l-5.5-5.03-2.4 1.83a.58.58 0 0 1-.75-.04l-.77-.7a.58.58 0 0 1 0-.86L2.27 7 .2 5.1a.58.58 0 0 1 0-.86l.77-.7c.21-.2.52-.2.75-.04l2.4 1.83L9.63.3a.87.87 0 0 1 .61-.26Zm.26 3.78L6.32 7l4.18 3.18V3.82Z" })) }, Ap = styled.svg({ display: "inline-block", shapeRendering: "inherit", transform: "translate3d(0, 0, 0)", verticalAlign: "middle", path: { fill: "currentColor" } }), Zn = ({ icon: e10, ...t5 }) => react_default.createElement(Ap, { viewBox: "0 0 14 14", width: "14px", height: "14px", ...t5 }, react_default.createElement(react_default.Fragment, null, ol[e10]));
  function nt() {
    return nt = Object.assign ? Object.assign.bind() : function(e10) {
      for (var t5 = 1; t5 < arguments.length; t5++) {
        var r5 = arguments[t5];
        for (var n10 in r5) ({}).hasOwnProperty.call(r5, n10) && (e10[n10] = r5[n10]);
      }
      return e10;
    }, nt.apply(null, arguments);
  }
  function il(e10) {
    if (e10 === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e10;
  }
  function Er(e10, t5) {
    return Er = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r5, n10) {
      return r5.__proto__ = n10, r5;
    }, Er(e10, t5);
  }
  function sl(e10, t5) {
    e10.prototype = Object.create(t5.prototype), e10.prototype.constructor = e10, Er(e10, t5);
  }
  function Vo(e10) {
    return Vo = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t5) {
      return t5.__proto__ || Object.getPrototypeOf(t5);
    }, Vo(e10);
  }
  function ll(e10) {
    try {
      return Function.toString.call(e10).indexOf("[native code]") !== -1;
    } catch {
      return typeof e10 == "function";
    }
  }
  function A1() {
    try {
      var e10 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch {
    }
    return (A1 = function() {
      return !!e10;
    })();
  }
  function dl(e10, t5, r5) {
    if (A1()) return Reflect.construct.apply(null, arguments);
    var n10 = [null];
    n10.push.apply(n10, t5);
    var a2 = new (e10.bind.apply(e10, n10))();
    return r5 && Er(a2, r5.prototype), a2;
  }
  function zo(e10) {
    var t5 = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return zo = function(n10) {
      if (n10 === null || !ll(n10)) return n10;
      if (typeof n10 != "function") throw new TypeError("Super expression must either be null or a function");
      if (t5 !== void 0) {
        if (t5.has(n10)) return t5.get(n10);
        t5.set(n10, a2);
      }
      function a2() {
        return dl(n10, arguments, Vo(this).constructor);
      }
      return a2.prototype = Object.create(n10.prototype, { constructor: { value: a2, enumerable: !1, writable: !0, configurable: !0 } }), Er(a2, n10);
    }, zo(e10);
  }
  var dt = (function(e10) {
    sl(t5, e10);
    function t5(r5) {
      var n10;
      return n10 = e10.call(this, "An error occurred. See https://github.com/styled-components/polished/blob/main/src/internalHelpers/errors.md#" + r5 + " for more information.") || this, il(n10);
    }
    return t5;
  })(zo(Error));
  function B1(e10) {
    return Math.round(e10 * 255);
  }
  function Fp(e10, t5, r5) {
    return B1(e10) + "," + B1(t5) + "," + B1(r5);
  }
  function Va(e10, t5, r5, n10) {
    if (n10 === void 0 && (n10 = Fp), t5 === 0) return n10(r5, r5, r5);
    var a2 = (e10 % 360 + 360) % 360 / 60, o10 = (1 - Math.abs(2 * r5 - 1)) * t5, i10 = o10 * (1 - Math.abs(a2 % 2 - 1)), l2 = 0, d3 = 0, u3 = 0;
    a2 >= 0 && a2 < 1 ? (l2 = o10, d3 = i10) : a2 >= 1 && a2 < 2 ? (l2 = i10, d3 = o10) : a2 >= 2 && a2 < 3 ? (d3 = o10, u3 = i10) : a2 >= 3 && a2 < 4 ? (d3 = i10, u3 = o10) : a2 >= 4 && a2 < 5 ? (l2 = i10, u3 = o10) : a2 >= 5 && a2 < 6 && (l2 = o10, u3 = i10);
    var c10 = r5 - o10 / 2, p5 = l2 + c10, f4 = d3 + c10, m8 = u3 + c10;
    return n10(p5, f4, m8);
  }
  var pl = { aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "00ffff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000", blanchedalmond: "ffebcd", blue: "0000ff", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "00ffff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkgrey: "a9a9a9", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkslategrey: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dimgrey: "696969", dodgerblue: "1e90ff", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "ff00ff", gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", grey: "808080", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgray: "d3d3d3", lightgreen: "90ee90", lightgrey: "d3d3d3", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslategray: "789", lightslategrey: "789", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "0f0", limegreen: "32cd32", linen: "faf0e6", magenta: "f0f", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370db", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "db7093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", rebeccapurple: "639", red: "f00", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", slategrey: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", wheat: "f5deb3", white: "fff", whitesmoke: "f5f5f5", yellow: "ff0", yellowgreen: "9acd32" };
  function Pp(e10) {
    if (typeof e10 != "string") return e10;
    var t5 = e10.toLowerCase();
    return pl[t5] ? "#" + pl[t5] : e10;
  }
  var Op = /^#[a-fA-F0-9]{6}$/, Np = /^#[a-fA-F0-9]{8}$/, Rp = /^#[a-fA-F0-9]{3}$/, Hp = /^#[a-fA-F0-9]{4}$/, _1 = /^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i, Dp = /^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i, Vp = /^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i, zp = /^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;
  function jn(e10) {
    if (typeof e10 != "string") throw new dt(3);
    var t5 = Pp(e10);
    if (t5.match(Op)) return { red: parseInt("" + t5[1] + t5[2], 16), green: parseInt("" + t5[3] + t5[4], 16), blue: parseInt("" + t5[5] + t5[6], 16) };
    if (t5.match(Np)) {
      var r5 = parseFloat((parseInt("" + t5[7] + t5[8], 16) / 255).toFixed(2));
      return { red: parseInt("" + t5[1] + t5[2], 16), green: parseInt("" + t5[3] + t5[4], 16), blue: parseInt("" + t5[5] + t5[6], 16), alpha: r5 };
    }
    if (t5.match(Rp)) return { red: parseInt("" + t5[1] + t5[1], 16), green: parseInt("" + t5[2] + t5[2], 16), blue: parseInt("" + t5[3] + t5[3], 16) };
    if (t5.match(Hp)) {
      var n10 = parseFloat((parseInt("" + t5[4] + t5[4], 16) / 255).toFixed(2));
      return { red: parseInt("" + t5[1] + t5[1], 16), green: parseInt("" + t5[2] + t5[2], 16), blue: parseInt("" + t5[3] + t5[3], 16), alpha: n10 };
    }
    var a2 = _1.exec(t5);
    if (a2) return { red: parseInt("" + a2[1], 10), green: parseInt("" + a2[2], 10), blue: parseInt("" + a2[3], 10) };
    var o10 = Dp.exec(t5.substring(0, 50));
    if (o10) return { red: parseInt("" + o10[1], 10), green: parseInt("" + o10[2], 10), blue: parseInt("" + o10[3], 10), alpha: parseFloat("" + o10[4]) > 1 ? parseFloat("" + o10[4]) / 100 : parseFloat("" + o10[4]) };
    var i10 = Vp.exec(t5);
    if (i10) {
      var l2 = parseInt("" + i10[1], 10), d3 = parseInt("" + i10[2], 10) / 100, u3 = parseInt("" + i10[3], 10) / 100, c10 = "rgb(" + Va(l2, d3, u3) + ")", p5 = _1.exec(c10);
      if (!p5) throw new dt(4, t5, c10);
      return { red: parseInt("" + p5[1], 10), green: parseInt("" + p5[2], 10), blue: parseInt("" + p5[3], 10) };
    }
    var f4 = zp.exec(t5.substring(0, 50));
    if (f4) {
      var m8 = parseInt("" + f4[1], 10), h2 = parseInt("" + f4[2], 10) / 100, g3 = parseInt("" + f4[3], 10) / 100, w2 = "rgb(" + Va(m8, h2, g3) + ")", y10 = _1.exec(w2);
      if (!y10) throw new dt(4, t5, w2);
      return { red: parseInt("" + y10[1], 10), green: parseInt("" + y10[2], 10), blue: parseInt("" + y10[3], 10), alpha: parseFloat("" + f4[4]) > 1 ? parseFloat("" + f4[4]) / 100 : parseFloat("" + f4[4]) };
    }
    throw new dt(5);
  }
  function Zp(e10) {
    var t5 = e10.red / 255, r5 = e10.green / 255, n10 = e10.blue / 255, a2 = Math.max(t5, r5, n10), o10 = Math.min(t5, r5, n10), i10 = (a2 + o10) / 2;
    if (a2 === o10) return e10.alpha !== void 0 ? { hue: 0, saturation: 0, lightness: i10, alpha: e10.alpha } : { hue: 0, saturation: 0, lightness: i10 };
    var l2, d3 = a2 - o10, u3 = i10 > 0.5 ? d3 / (2 - a2 - o10) : d3 / (a2 + o10);
    switch (a2) {
      case t5:
        l2 = (r5 - n10) / d3 + (r5 < n10 ? 6 : 0);
        break;
      case r5:
        l2 = (n10 - t5) / d3 + 2;
        break;
      default:
        l2 = (t5 - r5) / d3 + 4;
        break;
    }
    return l2 *= 60, e10.alpha !== void 0 ? { hue: l2, saturation: u3, lightness: i10, alpha: e10.alpha } : { hue: l2, saturation: u3, lightness: i10 };
  }
  function Tr(e10) {
    return Zp(jn(e10));
  }
  var jp = function(t5) {
    return t5.length === 7 && t5[1] === t5[2] && t5[3] === t5[4] && t5[5] === t5[6] ? "#" + t5[1] + t5[3] + t5[5] : t5;
  }, P1 = jp;
  function Qr(e10) {
    var t5 = e10.toString(16);
    return t5.length === 1 ? "0" + t5 : t5;
  }
  function F1(e10) {
    return Qr(Math.round(e10 * 255));
  }
  function Up(e10, t5, r5) {
    return P1("#" + F1(e10) + F1(t5) + F1(r5));
  }
  function Zo(e10, t5, r5) {
    return Va(e10, t5, r5, Up);
  }
  function $p(e10, t5, r5) {
    if (typeof e10 == "number" && typeof t5 == "number" && typeof r5 == "number") return Zo(e10, t5, r5);
    if (typeof e10 == "object" && t5 === void 0 && r5 === void 0) return Zo(e10.hue, e10.saturation, e10.lightness);
    throw new dt(1);
  }
  function Wp(e10, t5, r5, n10) {
    if (typeof e10 == "number" && typeof t5 == "number" && typeof r5 == "number" && typeof n10 == "number") return n10 >= 1 ? Zo(e10, t5, r5) : "rgba(" + Va(e10, t5, r5) + "," + n10 + ")";
    if (typeof e10 == "object" && t5 === void 0 && r5 === void 0 && n10 === void 0) return e10.alpha >= 1 ? Zo(e10.hue, e10.saturation, e10.lightness) : "rgba(" + Va(e10.hue, e10.saturation, e10.lightness) + "," + e10.alpha + ")";
    throw new dt(2);
  }
  function O1(e10, t5, r5) {
    if (typeof e10 == "number" && typeof t5 == "number" && typeof r5 == "number") return P1("#" + Qr(e10) + Qr(t5) + Qr(r5));
    if (typeof e10 == "object" && t5 === void 0 && r5 === void 0) return P1("#" + Qr(e10.red) + Qr(e10.green) + Qr(e10.blue));
    throw new dt(6);
  }
  function Yr(e10, t5, r5, n10) {
    if (typeof e10 == "string" && typeof t5 == "number") {
      var a2 = jn(e10);
      return "rgba(" + a2.red + "," + a2.green + "," + a2.blue + "," + t5 + ")";
    } else {
      if (typeof e10 == "number" && typeof t5 == "number" && typeof r5 == "number" && typeof n10 == "number") return n10 >= 1 ? O1(e10, t5, r5) : "rgba(" + e10 + "," + t5 + "," + r5 + "," + n10 + ")";
      if (typeof e10 == "object" && t5 === void 0 && r5 === void 0 && n10 === void 0) return e10.alpha >= 1 ? O1(e10.red, e10.green, e10.blue) : "rgba(" + e10.red + "," + e10.green + "," + e10.blue + "," + e10.alpha + ")";
    }
    throw new dt(7);
  }
  var qp = function(t5) {
    return typeof t5.red == "number" && typeof t5.green == "number" && typeof t5.blue == "number" && (typeof t5.alpha != "number" || typeof t5.alpha > "u");
  }, Gp = function(t5) {
    return typeof t5.red == "number" && typeof t5.green == "number" && typeof t5.blue == "number" && typeof t5.alpha == "number";
  }, Qp = function(t5) {
    return typeof t5.hue == "number" && typeof t5.saturation == "number" && typeof t5.lightness == "number" && (typeof t5.alpha != "number" || typeof t5.alpha > "u");
  }, Yp = function(t5) {
    return typeof t5.hue == "number" && typeof t5.saturation == "number" && typeof t5.lightness == "number" && typeof t5.alpha == "number";
  };
  function Mr(e10) {
    if (typeof e10 != "object") throw new dt(8);
    if (Gp(e10)) return Yr(e10);
    if (qp(e10)) return O1(e10);
    if (Yp(e10)) return Wp(e10);
    if (Qp(e10)) return $p(e10);
    throw new dt(8);
  }
  function ml(e10, t5, r5) {
    return function() {
      var a2 = r5.concat(Array.prototype.slice.call(arguments));
      return a2.length >= t5 ? e10.apply(this, a2) : ml(e10, t5, a2);
    };
  }
  function ht(e10) {
    return ml(e10, e10.length, []);
  }
  function Jp(e10, t5) {
    if (t5 === "transparent") return t5;
    var r5 = Tr(t5);
    return Mr(nt({}, r5, { hue: r5.hue + parseFloat(e10) }));
  }
  ht(Jp);
  function Un(e10, t5, r5) {
    return Math.max(e10, Math.min(t5, r5));
  }
  function Kp(e10, t5) {
    if (t5 === "transparent") return t5;
    var r5 = Tr(t5);
    return Mr(nt({}, r5, { lightness: Un(0, 1, r5.lightness - parseFloat(e10)) }));
  }
  var Xp = ht(Kp), za = Xp;
  function e4(e10, t5) {
    if (t5 === "transparent") return t5;
    var r5 = Tr(t5);
    return Mr(nt({}, r5, { saturation: Un(0, 1, r5.saturation - parseFloat(e10)) }));
  }
  ht(e4);
  function t4(e10, t5) {
    if (t5 === "transparent") return t5;
    var r5 = Tr(t5);
    return Mr(nt({}, r5, { lightness: Un(0, 1, r5.lightness + parseFloat(e10)) }));
  }
  var r4 = ht(t4), jo = r4;
  function n4(e10, t5, r5) {
    if (t5 === "transparent") return r5;
    if (r5 === "transparent") return t5;
    if (e10 === 0) return r5;
    var n10 = jn(t5), a2 = nt({}, n10, { alpha: typeof n10.alpha == "number" ? n10.alpha : 1 }), o10 = jn(r5), i10 = nt({}, o10, { alpha: typeof o10.alpha == "number" ? o10.alpha : 1 }), l2 = a2.alpha - i10.alpha, d3 = parseFloat(e10) * 2 - 1, u3 = d3 * l2 === -1 ? d3 : d3 + l2, c10 = 1 + d3 * l2, p5 = (u3 / c10 + 1) / 2, f4 = 1 - p5, m8 = { red: Math.floor(a2.red * p5 + i10.red * f4), green: Math.floor(a2.green * p5 + i10.green * f4), blue: Math.floor(a2.blue * p5 + i10.blue * f4), alpha: a2.alpha * parseFloat(e10) + i10.alpha * (1 - parseFloat(e10)) };
    return Yr(m8);
  }
  var a4 = ht(n4), hl = a4;
  function o4(e10, t5) {
    if (t5 === "transparent") return t5;
    var r5 = jn(t5), n10 = typeof r5.alpha == "number" ? r5.alpha : 1, a2 = nt({}, r5, { alpha: Un(0, 1, (n10 * 100 + parseFloat(e10) * 100) / 100) });
    return Yr(a2);
  }
  ht(o4);
  function i4(e10, t5) {
    if (t5 === "transparent") return t5;
    var r5 = Tr(t5);
    return Mr(nt({}, r5, { saturation: Un(0, 1, r5.saturation + parseFloat(e10)) }));
  }
  ht(i4);
  function s4(e10, t5) {
    return t5 === "transparent" ? t5 : Mr(nt({}, Tr(t5), { hue: parseFloat(e10) }));
  }
  ht(s4);
  function l4(e10, t5) {
    return t5 === "transparent" ? t5 : Mr(nt({}, Tr(t5), { lightness: parseFloat(e10) }));
  }
  ht(l4);
  function d4(e10, t5) {
    return t5 === "transparent" ? t5 : Mr(nt({}, Tr(t5), { saturation: parseFloat(e10) }));
  }
  ht(d4);
  function u4(e10, t5) {
    return t5 === "transparent" ? t5 : hl(parseFloat(e10), "rgb(0, 0, 0)", t5);
  }
  ht(u4);
  function c4(e10, t5) {
    return t5 === "transparent" ? t5 : hl(parseFloat(e10), "rgb(255, 255, 255)", t5);
  }
  ht(c4);
  function p4(e10, t5) {
    if (t5 === "transparent") return t5;
    var r5 = jn(t5), n10 = typeof r5.alpha == "number" ? r5.alpha : 1, a2 = nt({}, r5, { alpha: Un(0, 1, +(n10 * 100 - parseFloat(e10) * 100).toFixed(2) / 100) });
    return Yr(a2);
  }
  ht(p4);
  var Z = { primary: "#FF4785", secondary: "#029CFD", tertiary: "#E3E6E8", orange: "#FC521F", gold: "#FFAE00", green: "#66BF3C", seafoam: "#37D5D3", purple: "#6F2CAC", ultraviolet: "#2A0481", red: "#ff4400", bluelight: "#E3F3FF", bluelighter: "#F5FBFF", lightest: "#FFFFFF", lighter: "#F7FAFC", light: "#EEF3F6", mediumlight: "#ECF4F9", medium: "#D9E8F2", mediumdark: "#73828C", dark: "#5C6870", darker: "#454E54", darkest: "#2E3438", tr10: "rgba(0, 0, 0, 0.1)", tr5: "rgba(0, 0, 0, 0.05)", border: "hsla(203, 50%, 30%, 0.15)", positive: "#448028", negative: "#D43900", warning: "#A15C20", selected: "#0271B6" }, Wo = { padding: { small: 10, medium: 20, large: 30 }, borderRadius: { small: 5, default: 10 } }, j = { type: { primary: 'var(--nunito-sans, "Nunito Sans"), "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif', code: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace' }, weight: { regular: "400", bold: "700", extrabold: "800" }, size: { s1: 12, s2: 14, s3: 16, m1: 20, m2: 24, m3: 28, l1: 32, l2: 40, l3: 48, code: 90 } }, Uo = 600, $o = 5.55555;
  css({ padding: `0 ${Wo.padding.medium}px`, [`@media (min-width: ${Uo * 1}px)`]: { margin: `0 ${$o * 1}%` }, [`@media (min-width: ${Uo * 2}px)`]: { margin: `0 ${$o * 2}%` }, [`@media (min-width: ${Uo * 3}px)`]: { margin: `0 ${$o * 3}%` }, [`@media (min-width: ${Uo * 4}px)`]: { margin: `0 ${$o * 4}%` } });
  css({ border: `1px solid ${Z.border}`, borderRadius: `${Wo.borderRadius.small}px`, transition: "background 150ms ease-out, border 150ms ease-out, transform 150ms ease-out", "&:hover, &.__hover": { borderColor: `${Yr(Z.secondary, 0.5)}`, transform: "translate3d(0, -3px, 0)", boxShadow: "rgba(0, 0, 0, 0.08) 0 3px 10px 0" }, "&:active, &.__active": { borderColor: `${Yr(Z.secondary, 1)}`, transform: "translate3d(0, 0, 0)" } });
  css({ fontSize: j.size.l3, fontWeight: j.weight.bold }), css({ fontSize: j.size.l2, fontWeight: j.weight.bold }), css({ fontSize: j.size.l1, fontWeight: j.weight.bold }), css({ fontSize: j.size.m3, fontWeight: j.weight.bold }), css({ fontSize: j.size.m2, fontWeight: j.weight.bold }), css({ fontSize: j.size.m1, fontWeight: j.weight.bold }), css({ fontSize: j.size.s3, fontWeight: j.weight.bold }), css({ fontSize: j.size.s2, fontWeight: j.weight.bold });
  css({ fontSize: 14, fontWeight: j.weight.extrabold, lineHeight: "18px", letterSpacing: "0.38em" }), css({ fontSize: 11, fontWeight: j.weight.extrabold, lineHeight: "16px", letterSpacing: "0.38em" });
  css({ fontSize: 14, fontWeight: j.weight.bold, lineHeight: "18px" }), css({ fontSize: 14, fontWeight: j.weight.regular, lineHeight: "18px" }), css({ fontSize: j.size.s3, fontWeight: j.weight.bold, lineHeight: "24px" }), css({ fontSize: j.size.s1, fontWeight: j.weight.regular, lineHeight: "18px" }), css({ fontSize: j.size.s2, fontWeight: j.weight.bold, lineHeight: "20px" }), css({ fontSize: j.size.s1, fontWeight: j.weight.bold, lineHeight: "18px" }), css({ fontSize: j.size.s3, fontWeight: j.weight.regular, lineHeight: "24px" }), css({ fontSize: j.size.s2, fontWeight: j.weight.regular, lineHeight: "20px" });
  css({ fontFamily: j.type.code, fontSize: j.size.s2, fontWeight: j.weight.regular, lineHeight: "17px" }), css({ fontFamily: j.type.code, fontSize: j.size.s1, fontWeight: j.weight.regular, lineHeight: "14px" });
  var qo = keyframes({ from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } }), N1 = keyframes({ "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.4 } });
  keyframes({ "0%": { transform: "translateY(1px)" }, "25%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-3px)" }, "100%": { transform: "translateY(1px)" } });
  var gl = keyframes({ "0%, 100%": { transform: "translate3d(0,0,0)" }, "12.5%, 62.5%": { transform: "translate3d(-4px,0,0)" }, "37.5%, 87.5%": { transform: "translate3d(4px,0,0)" } });
  keyframes({ "0%": { transform: "rotate(-3deg)" }, "1.68421%": { transform: "rotate(3deg)" }, "2.10526%": { transform: "rotate(6deg)" }, "3.78947%": { transform: "rotate(-6deg)" }, "4.21053%": { transform: "rotate(-6deg)" }, "5.89474%": { transform: "rotate(6deg)" }, "6.31579%": { transform: "rotate(6deg)" }, "8%": { transform: "rotate(-6deg)" }, "8.42105%": { transform: "rotate(-6deg)" }, "10.10526%": { transform: "rotate(6deg)" }, "10.52632%": { transform: "rotate(6deg)" }, "12.21053%": { transform: "rotate(-6deg)" }, "12.63158%": { transform: "rotate(-6deg)" }, "14.31579%": { transform: "rotate(6deg)" }, "15.78947%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(0deg)" } });
  var vl = css({ animation: `${N1} 1.5s ease-in-out infinite`, background: Z.tr5, color: "transparent", cursor: "progress" }), Jr = { large: 40, medium: 28, small: 20, tiny: 16 }, m4 = styled.div({ background: "transparent", display: "inline-block", verticalAlign: "top", overflow: "hidden", textTransform: "uppercase", img: { width: "100%", height: "auto", display: "block" } }, (e10) => ({ borderRadius: e10.type === "user" ? "50%" : 5, height: `${Jr[e10.size || "medium"]}px`, width: `${Jr[e10.size || "medium"]}px`, lineHeight: `${Jr[e10.size || "medium"]}px`, ...e10.isLoading && { background: Z.light, filter: "grayscale(1)" }, ...!e10.src && !e10.isLoading && { background: "#37D5D3" } })), h4 = styled(Zn)({ position: "relative", margin: "0 auto", display: "block", verticalAlign: "top", path: { fill: Z.medium, animation: `${N1} 1.5s ease-in-out infinite` } }, (e10) => ({ bottom: `${e10.type === "user" ? -2 : -4}px`, height: `${e10.type === "user" ? 100 : 70}%`, width: `${e10.type === "user" ? 100 : 70}%` })), g4 = styled.div({ color: Z.lightest, textAlign: "center" }, (e10) => ({ tiny: { fontSize: `${j.size.s1 - 2}px`, lineHeight: `${Jr.tiny}px` }, small: { fontSize: `${j.size.s1}px`, lineHeight: `${Jr.small}px` }, medium: { fontSize: `${j.size.s2}px`, lineHeight: `${Jr.medium}px` }, large: { fontSize: `${j.size.s3}px`, lineHeight: `${Jr.large}px` } })[e10.size || "medium"]), yl = ({ isLoading: e10 = !1, username: t5 = "loading", src: r5 = void 0, size: n10 = "medium", type: a2 = "user", ...o10 }) => {
    let i10 = react_default.createElement(h4, { icon: a2 === "user" ? "useralt" : "repository", type: a2 }), l2 = {};
    return e10 ? (l2["aria-busy"] = !0, l2["aria-label"] = "Loading avatar ...") : r5 ? i10 = react_default.createElement("img", { src: r5, alt: t5 }) : (l2["aria-label"] = t5, i10 = react_default.createElement(g4, { size: n10, "aria-hidden": "true" }, t5.substring(0, 1))), react_default.createElement(m4, { size: n10, isLoading: e10, src: r5, type: a2, ...l2, ...o10 }, i10);
  }, v4 = styled.span((e10) => e10.withArrow && { "> svg:last-of-type": { height: "0.65em", width: "0.65em", marginRight: 0, marginLeft: "0.25em", bottom: "auto", verticalAlign: "inherit" } }), y4 = styled.a({ display: "inline-block", transition: "transform 150ms ease-out, color 150ms ease-out", textDecoration: "none", color: Z.secondary, "&:hover, &:focus-visible": { cursor: "pointer", transform: "translateY(-1px)", color: za(0.07, Z.secondary) }, "&:active": { transform: "translateY(0)", color: za(0.1, Z.secondary) }, svg: { display: "inline-block", height: "1em", width: "1em", verticalAlign: "text-top", position: "relative", bottom: "-0.125em", marginRight: "0.4em" } }, (e10) => ({ ...e10.secondary && { color: e10.theme.base === "light" ? Z.mediumdark : Z.medium, "&:hover": { color: e10.theme.base === "light" ? Z.dark : Z.light }, "&:active": { color: e10.theme.base === "light" ? Z.darker : Z.lighter } }, ...e10.tertiary && { color: Z.dark, "&:hover": { color: Z.darkest }, "&:active": { color: Z.mediumdark } }, ...e10.nochrome && { color: "inherit", "&:hover, &:active": { color: "inherit", textDecoration: "underline" } }, ...e10.inverse && { color: Z.lightest, "&:hover": { color: Z.lighter }, "&:active": { color: Z.light } } })), w4 = styled.a({}), b4 = styled.button({ background: "none", border: "none", padding: "0", font: "inherit", cursor: "pointer" }), bl = forwardRef(({ inverse: e10, isButton: t5, LinkWrapper: r5, nochrome: n10, secondary: a2, tertiary: o10, ...i10 }, l2) => t5 ? react_default.createElement(b4, { ...i10, ref: l2 }) : r5 ? react_default.createElement(r5, { ...i10, ref: l2 }) : react_default.createElement(w4, { ...i10, ref: l2 }));
  bl.displayName = "LinkComponentPicker";
  var ye = forwardRef(({ children: e10, withArrow: t5, ...r5 }, n10) => {
    let a2 = react_default.createElement(react_default.Fragment, null, react_default.createElement(v4, { withArrow: !!t5 }, e10, t5 && react_default.createElement(Zn, { icon: "arrowright" })));
    return react_default.createElement(y4, { as: bl, ref: n10, ...r5 }, a2);
  });
  ye.displayName = "Link";
  ye.defaultProps = { withArrow: !1, isButton: !1, secondary: !1, tertiary: !1, nochrome: !1, inverse: !1 };
  var k4 = styled.label((e10) => ({ ...e10.appearance !== "code" && { fontWeight: j.weight.bold }, ...e10.appearance === "code" ? { fontFamily: j.type.code, fontSize: `${j.size.s1 - 1}px`, lineHeight: "16px" } : { fontSize: `${j.size.s2}px`, lineHeight: "20px" } })), I4 = styled.div([{ marginBottom: 8 }, (e10) => e10.hideLabel && { border: "0px !important", clip: "rect(0 0 0 0) !important", WebkitClipPath: "inset(100%) !important", clipPath: "inset(100%) !important", height: "1px !important", overflow: "hidden !important", padding: "0px !important", position: "absolute !important", whiteSpace: "nowrap !important", width: "1px !important" }]), E4 = styled.input({ "&::placeholder": { color: Z.mediumdark }, appearance: "none", border: "none", boxSizing: "border-box", display: "block", outline: "none", width: "100%", margin: "0", "&[disabled]": { cursor: "not-allowed", opacity: 0.5 }, "&:-webkit-autofill": { WebkitBoxShadow: `0 0 0 3em ${Z.lightest} inset` } }), T4 = (e10) => {
    let r5 = { position: "relative", ...e10.error && { zIndex: 1 }, "&:focus": { zIndex: 2 } };
    switch (e10.stackLevel) {
      case "top":
        return { borderTopLeftRadius: "4px", borderTopRightRadius: "4px", borderBottomLeftRadius: 0, borderBottomRightRadius: 0, ...r5 };
      case "middle":
        return { borderRadius: 0, marginTop: -1, ...r5 };
      case "bottom":
        return { borderBottomLeftRadius: "4px", borderBottomRightRadius: "4px", borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: -1, ...r5 };
      default:
        return { borderRadius: "4px" };
    }
  }, M4 = styled.div((e10) => ({ display: "inline-block", position: "relative", verticalAlign: "top", width: "100%", ".sbds-input-el": { position: "relative", ...T4(e10), background: Z.lightest, color: Z.darkest, fontSize: `${j.size.s2}px`, lineHeight: "20px", padding: "10px 15px", boxShadow: `${Z.border} 0 0 0 1px inset`, "&:focus": { boxShadow: `${Z.secondary} 0 0 0 1px inset` }, ...e10.appearance === "pill" && { fontSize: `${j.size.s1}px`, lineHeight: "16px", padding: "6px 12px", borderRadius: "3em", background: "transparent" }, ...e10.appearance === "code" && { fontSize: `${j.size.s1 - 1}px`, lineHeight: "16px", fontFamily: j.type.code, borderRadius: `${Wo.borderRadius.small}px`, background: Z.lightest, padding: "8px 10px" }, ...e10.startingType === "password" && { paddingRight: 52 }, ...e10.icon && { paddingLeft: 40, ...(e10.appearance === "pill" || e10.appearance === "code") && { paddingLeft: 30 }, "&:focus + svg path": { fill: Z.darker } }, ...e10.error && { boxShadow: `${Z.red} 0 0 0 1px inset`, "&:focus": { boxShadow: `${Z.red} 0 0 0 1px inset !important` } } }, "> svg": { ...e10.icon && { transition: "all 150ms ease-out", position: "absolute", top: "50%", zIndex: 3, background: "transparent", ...e10.appearance === "pill" || e10.appearance === "code" ? { fontSize: `${j.size.s1}px`, height: 12, marginTop: -6, width: 12, left: 10 } : { fontSize: `${j.size.s2}px`, height: 14, marginTop: -7, width: 14, left: e10.appearance === "tertiary" ? 0 : 15 }, path: { transition: "all 150ms ease-out", fill: Z.mediumdark } }, ...e10.error && { animation: `${gl} 700ms ease-out`, path: { fill: Z.red } } } })), L4 = styled.div((e10) => e10.orientation === "horizontal" && { display: "table-row", ".sbds-input-label-wrapper, .sbds-input-input-wrapper": { display: "table-cell" }, ".sbds-input-label-wrapper": { width: 1, paddingRight: 20, verticalAlign: "middle" }, ".sbds-input-input-wrapper": { width: "auto" } }), A4 = styled(WithTooltip)({ width: "100%" }), B4 = styled(TooltipMessage)({ width: 170 }), _4 = styled.div({ position: "absolute", right: "0", minWidth: 45, top: "50%", transform: "translateY(-50%)", fontWeight: "bold", fontSize: 11, zIndex: 2 }), xl = ({ error: e10, value: t5, lastErrorValue: r5 }) => {
    let n10 = typeof e10 == "function" ? e10(t5) : e10;
    return r5 && t5 !== r5 && (n10 = null), n10;
  }, El = forwardRef(({ id: e10, appearance: t5 = "default", className: r5 = void 0, error: n10 = null, errorTooltipPlacement: a2 = "right", hideLabel: o10 = !1, icon: i10 = void 0, label: l2, lastErrorValue: d3 = void 0, onActionClick: u3 = void 0, orientation: c10 = "vertical", stackLevel: p5 = void 0, startingType: f4 = "text", suppressErrorMessage: m8 = !1, type: h2 = "text", value: g3 = "", ...w2 }, y10) => {
    let [v5, C3] = useState(xl({ error: n10, value: g3, lastErrorValue: d3 })), b8 = `${e10}-error`;
    useEffect(() => {
      C3(xl({ error: n10, value: g3, lastErrorValue: d3 }));
    }, [g3, n10, d3]);
    let I = react_default.createElement(E4, { className: "sbds-input-el", id: e10, ref: y10, value: g3, type: h2, "aria-describedby": b8, "aria-invalid": !!n10, ...w2 });
    return react_default.createElement(L4, { orientation: c10, className: r5 }, react_default.createElement(I4, { className: "sbds-input-label-wrapper", hideLabel: o10 }, react_default.createElement(k4, { htmlFor: e10, appearance: t5 }, l2)), react_default.createElement(M4, { className: "sbds-input-input-wrapper", error: v5, "data-error": v5, icon: i10, appearance: t5, stackLevel: p5, startingType: f4 }, i10 && react_default.createElement(Zn, { icon: i10, "aria-hidden": !0 }), react_default.createElement(A4, { tabIndex: -1, placement: a2, startOpen: !0, hasChrome: !!v5 && !m8, tooltip: v5 && !m8 && react_default.createElement(B4, { desc: v5 }), role: "none" }, I), f4 === "password" && react_default.createElement(_4, null, react_default.createElement(ye, { isButton: !0, tertiary: !0, onClick: u3, type: "button" }, h2 === "password" ? "Show" : "Hide"))));
  });
  El.displayName = "PureInput";
  var H12 = forwardRef(({ type: e10, startFocused: t5, ...r5 }, n10) => {
    let [a2, o10] = useState(e10), i10 = useCallback((c10) => {
      if (c10.preventDefault(), c10.stopPropagation(), a2 === "password") {
        o10("text");
        return;
      }
      o10("password");
    }, [a2, o10]), l2 = useRef(), d3 = n10 || l2, u3 = useRef(!1);
    return useEffect(() => {
      d3.current && t5 && !u3.current && (d3.current.focus(), u3.current = !0);
    }, [d3, t5, u3]), react_default.createElement(El, { ref: d3, startingType: e10, type: a2, onActionClick: i10, ...r5 });
  });
  H12.displayName = "Input";
  var O4 = styled.div({ borderRadius: "3em", cursor: "progress", display: "inline-block", overflow: "hidden", position: ["relative", "absolute"], transition: "all 200ms ease-out", verticalAlign: "top", top: "50%", left: "50%", marginTop: -16, marginLeft: -16, height: 32, width: 32, animation: `${qo} 0.7s linear infinite`, borderWidth: 2, borderStyle: "solid", borderColor: "rgba(0, 0, 0, 0.03)", borderTopColor: "rgba(0, 0, 0, 0.15)" }, (e10) => ({ ...e10.inverse && { borderColor: "rgba(255, 255, 255, 0.2)", borderTopColor: "rgba(255, 255, 255, 0.4)" }, ...e10.inForm && { marginTop: -6, marginLeft: -6, height: 12, width: 12, border: `1px solid ${Z.secondary}`, borderBottomColor: "transparent" }, ...e10.inline && { position: "relative", top: "initial", left: "initial", marginTop: "initial", marginLeft: "initial", verticalAlign: "middle", height: 8, width: 8, border: "1px solid", borderTopColor: Z.secondary, borderLeftColor: Z.secondary, borderRightColor: Z.secondary, borderBottomColor: "transparent", ...e10.positive && { borderTopColor: Z.positive, borderLeftColor: Z.positive, borderRightColor: Z.positive }, ...e10.negative && { borderTopColor: Z.red, borderLeftColor: Z.red, borderRightColor: Z.red }, ...e10.neutral && { borderTopColor: Z.dark, borderLeftColor: Z.dark, borderRightColor: Z.dark }, ...e10.inverse && { borderTopColor: Z.lightest, borderLeftColor: Z.lightest, borderRightColor: Z.lightest } } })), ja = (e10) => react_default.createElement(O4, { "aria-label": "Content is loading ...", "aria-live": "polite", role: "status", ...e10 }), Tl = function(t5) {
    var r5 = /* @__PURE__ */ new WeakMap();
    return function(n10) {
      if (r5.has(n10)) return r5.get(n10);
      var a2 = t5(n10);
      return r5.set(n10, a2), a2;
    };
  }, R4 = styled.span({}), H42 = styled.span(({ theme: e10 }) => ({ fontWeight: e10.typography.weight.bold, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })), D4 = styled.span({}), V4 = styled.span({}), Ml = styled.li(({ theme: e10 }) => ({ listStyle: "none", "&:not(:first-of-type)": { borderTop: `1px solid ${e10.appBorderColor}` } })), z4 = styled.span({ lineHeight: "18px", padding: "7px 15px", display: "flex", alignItems: "center", justifyContent: "space-between", ".sbds-list-item-title": { display: "block", flex: "0 1 auto", marginRight: "auto" }, ".sbds-list-item-left, .sbds-list-item-center, .sbds-list-item-right": { display: "inline-flex" }, ".sbds-list-item-center": { flex: "0 1 auto", marginLeft: "auto", marginRight: "auto" }, ".sbds-list-item-left, .sbds-list-item-right": { flex: "0 1 auto" }, ".sbds-list-item-right": { flex: "none", textAlign: "right", marginLeft: 10 } }), D1 = ({ active: e10, activeColor: t5, disabled: r5, isLoading: n10, theme: a2 }) => ({ fontSize: `${a2.typography.size.s1}px`, transition: "all 150ms ease-out", color: a2.color.mediumdark, textDecoration: "none", display: "block", ".sbds-list-item-title": { color: a2.base === "light" ? a2.color.darker : a2.color.lighter }, ".sbds-list-item-right svg": { transition: "all 200ms ease-out", opacity: 0, height: 12, width: 12, margin: "3px 0", verticalAlign: "top", path: { fill: a2.color.mediumdark } }, "&:hover": { background: a2.background.hoverable, cursor: "pointer", ".sbds-list-item-right svg": { opacity: 1 } }, ...e10 && { ".sbds-list-item-title": { fontWeight: a2.typography.weight.bold }, ".sbds-list-item-title, .sbds-list-item-center": { color: t5 }, ".sbds-list-item-right svg": { opacity: 1, path: { fill: t5 } } }, ...n10 && { ".sbds-list-item-title": { ...vl, flex: "0 1 auto", display: "inline-block" } }, ...r5 && { cursor: "not-allowed !important", ".sbds-list-item-title, .sbds-list-item-center": { color: a2.color.mediumdark } } }), Z4 = styled(({ active: e10, activeColor: t5, isLoading: r5, ...n10 }) => react_default.createElement("a", { ...n10 }))(D1), j4 = styled.span(D1), U4 = Tl((e10) => styled(({ active: t5, isLoading: r5, activeColor: n10, ...a2 }) => react_default.createElement(e10, { ...a2 }))(D1)), Ct = ({ appearance: e10 = "primary", left: t5, title: r5 = react_default.createElement("span", null, "Loading"), center: n10, right: a2, onClick: o10, LinkWrapper: i10, isLink: l2 = !0, ...d3 }) => {
    let c10 = useTheme().color[e10], p5 = react_default.createElement(z4, { onClick: o10, role: "presentation" }, t5 && react_default.createElement(R4, { className: "sbds-list-item-left" }, t5), r5 && react_default.createElement(H42, { className: "sbds-list-item-title" }, r5), n10 && react_default.createElement(D4, { className: "sbds-list-item-center" }, n10), a2 && react_default.createElement(V4, { className: "sbds-list-item-right" }, a2));
    if (i10) {
      let m8 = U4(i10);
      return react_default.createElement(Ml, null, react_default.createElement(m8, { activeColor: c10, ...d3 }, p5));
    }
    return react_default.createElement(Ml, null, react_default.createElement(l2 ? Z4 : j4, { activeColor: c10, ...d3 }, p5));
  }, { CHROMATIC_INDEX_URL: $4, CHROMATIC_BASE_URL: Ua = $4 || "https://www.chromatic.com", CHROMATIC_API_URL: Ll = `${Ua}/api` } = define_process_env_default, Yo = `${z}/access-token/${Ua}`;
  function $n(e10) {
    function t5(x2, D) {
      return x2 >>> D | x2 << 32 - D;
    }
    for (var r5, n10, a2 = Math.pow, o10 = a2(2, 32), i10 = "", l2 = [], d3 = 8 * e10.length, u3 = $n.h = $n.h || [], c10 = $n.k = $n.k || [], p5 = c10.length, f4 = {}, m8 = 2; p5 < 64; m8++) if (!f4[m8]) {
      for (r5 = 0; r5 < 313; r5 += m8) f4[r5] = m8;
      u3[p5] = a2(m8, 0.5) * o10 | 0, c10[p5++] = a2(m8, 1 / 3) * o10 | 0;
    }
    for (e10 += "\x80"; e10.length % 64 - 56; ) e10 += "\0";
    for (r5 = 0; r5 < e10.length; r5++) {
      if ((n10 = e10.charCodeAt(r5)) >> 8) return;
      l2[r5 >> 2] |= n10 << (3 - r5) % 4 * 8;
    }
    for (l2[l2.length] = d3 / o10 | 0, l2[l2.length] = d3, n10 = 0; n10 < l2.length; ) {
      var h2 = l2.slice(n10, n10 += 16), g3 = u3;
      for (u3 = u3.slice(0, 8), r5 = 0; r5 < 64; r5++) {
        var w2 = h2[r5 - 15], y10 = h2[r5 - 2], v5 = u3[0], C3 = u3[4], b8 = u3[7] + (t5(C3, 6) ^ t5(C3, 11) ^ t5(C3, 25)) + (C3 & u3[5] ^ ~C3 & u3[6]) + c10[r5] + (h2[r5] = r5 < 16 ? h2[r5] : h2[r5 - 16] + (t5(w2, 7) ^ t5(w2, 18) ^ w2 >>> 3) + h2[r5 - 7] + (t5(y10, 17) ^ t5(y10, 19) ^ y10 >>> 10) | 0);
        (u3 = [b8 + ((t5(v5, 2) ^ t5(v5, 13) ^ t5(v5, 22)) + (v5 & u3[1] ^ v5 & u3[2] ^ u3[1] & u3[2])) | 0].concat(u3))[4] = u3[4] + b8 | 0;
      }
      for (r5 = 0; r5 < 8; r5++) u3[r5] = u3[r5] + g3[r5] | 0;
    }
    for (r5 = 0; r5 < 8; r5++) for (n10 = 3; n10 + 1; n10--) {
      var I = u3[r5] >> 8 * n10 & 255;
      i10 += (I < 16 ? 0 : "") + I.toString(16);
    }
    return i10;
  }
  var W4 = (e10) => new Uint8Array(e10).reduce((t5, r5) => t5 + String.fromCharCode(r5), ""), q4 = (e10) => window.btoa(Array.isArray(e10) ? W4(e10) : e10), Al = (e10) => q4(e10).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ""), G4 = (e10) => Array.from(e10.match(/.{1,2}/g) ?? [], (t5) => parseInt(t5, 16)), Q4 = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10), Bl = (e10) => Object.entries(e10).map(([t5, r5]) => `${encodeURIComponent(t5)}=${encodeURIComponent(r5)}`).join("&"), Y4 = ({ error: e10 }) => e10 === "authorization_pending", J4 = ({ error_description: e10 }) => e10 === "Not OAuth beta user", _l = async (e10) => {
    let t5 = Al(Q4()), r5 = Al(G4($n(t5))), n10 = await fetch(`${Ua}/authorize`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }, body: Bl({ client_id: "chromaui:addon-visual-tests", code_challenge: r5 }) }), { device_code: a2, user_code: o10, verification_uri_complete: i10, expires_in: l2, interval: d3 } = await n10.json(), u3 = e10 ? i10.replace("https://www", `https://${e10}`) : i10;
    return { expires: Date.now() + l2 * 1e3, interval: d3 * 1e3, user_code: o10, device_code: a2, verifier: t5, verificationUrl: u3 };
  }, Fl = async ({ expires: e10, device_code: t5, verifier: r5 }) => {
    if (Date.now() >= e10) throw new Error("Token exchange expired, please restart sign in.");
    try {
      let a2 = await (await fetch(`${Ua}/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }, body: Bl({ client_id: "chromaui:addon-visual-tests", grant_type: "urn:ietf:params:oauth:grant-type:device_code", device_code: t5, code_verifier: r5, scope: "user:read account:read project:read project:write" }) })).json();
      if (Y4(a2)) throw new Error("You have not authorized the Visual Tests addon for Chromatic, please try again");
      if (a2.access_token) return a2.access_token;
      if (J4(a2)) return alert("You must be a beta user to use this addon at this time."), null;
      throw new Error();
    } catch (n10) {
      throw console.warn(n10), n10;
    }
  }, Wn = createContext(null), Pl = ({ children: e10, value: t5 }) => react_default.createElement(Wn.Provider, { value: t5 }, e10), be = (e10, t5) => {
    let r5 = Ze(Wn, "Telemetry");
    useEffect(() => r5({ location: e10, screen: t5 }), [e10, t5, r5]);
  };
  function Jo() {
    let e10 = useStorybookApi(), { addNotification: t5, setOptions: r5, togglePanel: n10 } = e10, a2 = useCallback(({ onDismiss: o10 }) => {
      o10(), r5({ selectedPanel: _t }), n10(!0);
    }, [r5, n10]);
    return useCallback((o10, i10) => {
      t5({ id: `${z}/error/${Date.now()}`, content: { headline: o10, subHeadline: i10.toString() }, icon: react_default.createElement(Bt, { color: color.negative }), onClick: a2 });
    }, [t5, a2]);
  }
  var $a = /* @__PURE__ */ new Map(), Wa = (e10, t5, r5, n10 = !0) => {
    let a2 = () => {
      window.clearTimeout($a.get(e10)), $a.delete(e10);
    }, o10 = (...i10) => {
      $a.has(e10) ? a2() : n10 && t5(...i10), $a.set(e10, window.setTimeout(() => $a.delete(e10) && t5(...i10), r5));
    };
    return o10.cancel = a2, o10;
  };
  function Oe(e10, t5) {
    let r5 = useCallback(() => {
      try {
        let l2 = sessionStorage.getItem(`${z}/state/${e10}`);
        if (l2 != null) return JSON.parse(l2);
      } catch {
      }
      return typeof t5 == "function" ? t5() : t5;
    }, [e10, t5]), [n10, a2] = useState(r5), o10 = useMemo(() => Wa(e10, (l2) => {
      let d3 = new Set(sessionStorage.getItem(`${z}/state`)?.split(";"));
      l2 == null ? (sessionStorage.removeItem(`${z}/state/${e10}`), d3.delete(e10)) : (sessionStorage.setItem(`${z}/state/${e10}`, JSON.stringify(l2)), d3.add(e10)), sessionStorage.setItem(`${z}/state`, Array.from(d3).join(";")), window.dispatchEvent(new StorageEvent("session-storage", { key: e10 }));
    }, 1e3), [e10]);
    useEffect(() => o10.cancel, [o10]);
    let i10 = useCallback((l2) => {
      let d3 = l2;
      (!d3.key || d3.key === e10) && a2(r5());
    }, [e10, r5]);
    return useEffect(() => (window.addEventListener("storage", i10), window.addEventListener("session-storage", i10), () => {
      window.removeEventListener("storage", i10), window.removeEventListener("session-storage", i10);
    }), [i10]), [n10, useCallback((l2) => a2((d3) => {
      let u3 = typeof l2 == "function" ? l2(d3) : l2;
      return o10(u3), u3;
    }), [o10])];
  }
  function Rl(...e10) {
    let t5 = sessionStorage.getItem(`${z}/state`)?.split(";") || [];
    e10.length ? (e10.forEach((r5) => sessionStorage.removeItem(`${z}/state/${r5}`)), sessionStorage.setItem(`${z}/state`, t5.filter((r5) => !e10.includes(r5)).join(";"))) : (t5.forEach((r5) => sessionStorage.removeItem(`${z}/state/${r5}`)), sessionStorage.removeItem(`${z}/state`));
  }
  var Hl = createContext(void 0), Dl = ({ children: e10, addonUninstalled: t5, setAddonUninstalled: r5 }) => {
    let n10 = useStorybookApi().getChannel();
    if (!n10) throw new Error("Channel not available");
    let a2 = () => {
      n10.emit(Ho), r5(!0);
    };
    return react_default.createElement(Hl.Provider, { value: { addonUninstalled: t5, uninstallAddon: a2 } }, e10);
  }, Ko = () => Ze(Hl, "Uninstall Addon"), Q = styled.div({ display: "flex", flexDirection: "column", flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 10 }), W2 = styled.h1(({ theme: e10 }) => ({ marginTop: 0, marginBottom: 4, fontSize: "1em", fontWeight: "bold", color: e10.base === "light" ? e10.color.defaultText : e10.color.lightest })), ei = (e10) => react_default.createElement("svg", { width: "250", height: "250", viewBox: "0 0 250 250", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e10 }, react_default.createElement("circle", { fill: "#FC521F", cx: "125", cy: "125", r: "125" }), react_default.createElement("g", { transform: "translate(41.666667, 35.714286)", fill: "#FFFFFF" }, react_default.createElement("path", { d: "M112.708657,146.772329 L92.8458667,135.31254 L152.602092,100.844023 C154.891568,99.5203449 157.049482,98.0062747 159.0592,96.3139009 C166.825876,107.373262 167.589539,121.939765 160.66516,133.92842 C154.409175,144.750546 142.73799,151.473199 130.221483,151.473199 C124.09706,151.473199 118.045223,149.847312 112.708657,146.772329 L112.708657,146.772329 Z M107.923895,155.053476 C110.216395,156.378666 112.605676,157.490797 115.07964,158.385337 C109.377122,170.633893 97.1373485,178.571429 83.2734687,178.571429 C63.9218033,178.571429 48.1691815,162.835374 48.1691815,143.496981 L48.1691815,74.5554134 L78.4888574,92.0503277 L78.4888574,135.313145 C78.4888574,137.020629 79.4022283,138.599674 80.8796509,139.453416 L107.923895,155.053476 Z M36.4190595,151.46776 C23.8995283,151.46776 12.2480021,144.751151 5.98899256,133.933558 C1.30721131,125.820741 0.0551068452,116.370646 2.48672976,107.316446 C4.91684048,98.2622464 10.7176524,90.6979399 18.8427205,86.0152018 L38.6994619,74.5584354 L38.7024863,143.484893 C38.7024863,146.129227 38.929317,148.752406 39.390539,151.346876 C38.401558,151.429983 37.4080405,151.46776 36.4190595,151.46776 L36.4190595,151.46776 Z M113.68917,66.2735101 L83.3815914,83.7593583 L45.8819741,62.1302164 C45.1440188,61.7056119 44.3183557,61.4895318 43.486644,61.4895318 C42.6655176,61.4895318 41.8398545,61.7056119 41.0973628,62.1302164 L14.0576557,77.7302765 C11.7666676,79.0463994 9.60270476,80.5574473 7.59298661,82.2573765 C-0.170665179,71.1995268 -0.928278869,56.6345345 5.98853899,44.6413461 C12.2475482,33.820731 23.9066357,27.0920339 36.4307033,27.0920339 C42.5475658,27.0920339 48.6024277,28.7239658 53.9435298,31.8004598 L113.68917,66.2735101 L113.68917,66.2735101 Z M83.2737711,0 C102.63451,0 118.376546,15.7360545 118.376546,35.0820027 L118.376546,57.9985577 L58.6384673,23.5360845 C56.3459673,22.2078732 53.9551738,21.0927199 51.4736482,20.1951574 C57.1761667,7.94206845 69.4189646,0 83.2737711,0 Z M160.664858,44.652528 C170.33691,61.4040065 164.575415,82.8986652 147.809618,92.5663506 L88.0639777,127.036379 L88.0639777,92.0586387 L125.559058,70.4264747 C127.041018,69.5727324 127.954388,67.9936872 127.954388,66.284692 L127.954388,35.0845714 C127.957412,32.4493039 127.718485,29.8231021 127.266336,27.2376991 C128.247756,27.1515693 129.236737,27.1107708 130.228742,27.1107708 C142.749785,27.1107708 154.411897,33.8334238 160.664858,44.652528 L160.664858,44.652528 Z" }))), c5 = Jt(ti());
  styled.div({ display: "flex", flexDirection: "column" });
  styled.div(({ theme: e10 }) => ({ padding: 15, lineHeight: "18px", borderBottom: `1px solid ${e10.appBorderColor}`, p: { margin: "10px 0", "&:last-of-type": { marginBottom: 0 } }, dl: { display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, margin: "10px 0 0 0" }, dt: { color: e10.color.mediumdark, fontWeight: 700 }, dd: { marginLeft: 0 }, "button + button": { marginLeft: 10 } }));
  var Vl = styled.div({ display: "flex", fontWeight: "bold", marginBottom: 15 });
  styled(Ls)(({ theme: e10 }) => ({ width: 12, height: 12, margin: "3px 6px", verticalAlign: "top", color: e10.color.mediumdark }));
  var ri = { width: 14, height: 14, margin: "2px 6px 2px 0", verticalAlign: "top" };
  styled(Vs)(ri);
  styled(ys)(ri);
  styled(Bo)(ri);
  styled(bs)(ri);
  var zl = styled(Hn)({ marginLeft: "auto" }), Zl = styled(ActionList.Button)({ margin: -5, marginLeft: "auto" }), J = styled(Button)({ "&&": { display: "inline-flex", borderRadius: 4, fontSize: 13, lineHeight: "14px", padding: "9px 12px", alignItems: "center", "@container (min-width: 800px)": { padding: "8px 10px" } } }, ({ link: e10, theme: t5 }) => e10 && css({ "&&": { background: "none", boxShadow: "none", padding: 2, fontWeight: "normal", color: t5.base === "light" ? t5.color.dark : "#C9CDCF", opacity: 0.8, transition: "opacity 150ms ease-out", "&:hover, &:focus": { opacity: 1 }, "&:focus:not(:active)": { outline: `1px solid ${t5.color.secondary}` } } }), ({ tertiary: e10 }) => e10 && css({ "&&:hover": { boxShadow: "none" } }), ({ belowText: e10 }) => e10 && { marginTop: 7 }), Fe = styled(Code)(({ theme: e10 }) => ({ color: e10.base === "light" ? e10.color.darker : e10.color.lighter, border: `1px solid ${e10.appBorderColor}`, fontSize: "12px", padding: "2px 3px" })), Ul = "experimental_useSharedState_getValue", ni = "experimental_useSharedState_setValue", j1 = /* @__PURE__ */ new Map(), qn = class {
    constructor(t5) {
      this.channel = t5, this.listeners = [], this.state = {}, this.channel.on(ni, (r5, n10, a2) => {
        this.state?.[r5]?.index >= a2 || (this.state[r5] = { index: a2, value: n10 });
      }), this.channel.on(Ul, (r5) => {
        let n10 = this.state[r5]?.index ?? 0, a2 = this.state[r5]?.value;
        this.channel.emit(ni, r5, a2, n10);
      });
    }
    get(t5) {
      return this.state[t5] || this.channel.emit(Ul, t5), this.state[t5]?.value;
    }
    set(t5, r5) {
      let n10 = (this.state[t5]?.index ?? 0) + 1;
      this.state[t5] = { index: n10, value: r5 }, this.channel.emit(ni, t5, r5, n10);
    }
    static subscribe(t5, r5) {
      let n10 = j1.get(t5) || new qn(r5);
      return j1.has(t5) || (j1.set(t5, n10), n10.channel.on(ni, (a2, o10) => {
        a2 === t5 && n10.listeners.forEach((i10) => i10(o10));
      })), { get value() {
        return n10.get(t5);
      }, set value(a2) {
        n10.set(t5, a2);
      }, on(a2, o10) {
        if (a2 !== "change") throw new Error("unsupported event");
        n10.listeners.push(o10);
      }, off(a2, o10) {
        if (a2 !== "change") throw new Error("unsupported event");
        let i10 = n10.listeners.indexOf(o10);
        i10 >= 0 && n10.listeners.splice(i10, 1);
      } };
    }
  };
  function Ce(e10) {
    let t5 = useStorybookApi().getChannel();
    if (!t5) throw new Error("Channel not available");
    let r5 = useRef(qn.subscribe(e10, t5)), [n10, a2] = useState(r5.current.value);
    return useEffect(() => {
      let o10 = r5.current;
      return o10.on("change", a2), () => o10.off("change", a2);
    }, [r5]), [n10, useCallback((o10) => {
      a2(o10), r5.current.value = o10;
    }, [])];
  }
  var xf = { autoAcceptChanges: { description: "Automatically accept visual changes - usually for a specific branch name.", type: "true or branch name" }, buildScriptName: { description: "The package.json script that builds your Storybook.", type: "string" }, cypress: { description: "Run build against `@chromatic-com/cypress` test archives.", type: "boolean" }, debug: { description: "Output verbose logs and debug information.", type: "boolean" }, diagnosticsFile: { description: "Write process information to a JSON file.", type: "string or boolean" }, exitOnceUploaded: { description: "Exit the process as soon as your Storybook is published.", type: "string or boolean" }, exitZeroOnChanges: { description: "Exit the process succesfully even when visual changes are found.", type: "string or boolean" }, externals: { description: "Disable TurboSnap when any of these files have changed since the baseline build.", type: "string: ['public/**']" }, fileHashing: { description: "Apply file hashing to skip uploading unchanged files - default: true", type: "boolean" }, ignoreLastBuildOnBranch: { description: "Do not use the last build on this branch as a baseline if it is no longer in history (i.e. branch was rebased).", type: "string" }, junitReport: { description: "Write build results to a JUnit XML file.", type: "string or boolean" }, logFile: { description: "Write Chromatic CLI logs to a file.", type: "string or boolean" }, onlyChanged: { description: "Enables TurboSnap to only run stories affected by files changed since the baseline build.", type: "true or string (branch name)", glob: !0 }, onlyStoryFiles: { description: "Only run a single story or a subset of stories by their filename(s).", type: "string[]" }, onlyStoryNames: { description: "Only run a single story or a subset of stories by their name(s).", type: "string[]" }, outputDir: { description: "Relative path to target directory for building your Storybook, in case you want to preserve it.", type: "string" }, playwright: { description: "Run build against `@chromatic-com/playwright` test archives.", type: "boolean" }, projectId: { description: "Unique identifier for your project. ", type: "string" }, projectToken: { description: "Secret token for your project. Preferably configured through CHROMATIC_PROJECT_TOKEN.", type: "string" }, skip: { description: "Skip Chromatic tests, but mark the commit as passing. Avoids blocking PRs due to required merge checks.", type: "string or boolean" }, storybookBaseDir: { description: "Relative path from repository root to Storybook project root.", type: "string" }, storybookBuildDir: { description: "Path to the directory of an already built Storybook.", type: "string" }, storybookConfigDir: { description: "Relative path from where you run Chromatic to your Storybook config directory.", type: "string" }, storybookLogFile: { description: "Write Storybook build logs to a file.", type: "string or boolean" }, untraced: { description: "Disregard these files and their dependencies when tracing dependent stories for TurboSnap.", type: "string[]" }, uploadMetadata: { description: "Upload Chromatic metadata files as part of the published Storybook.", type: "boolean" }, zip: { description: "Publish your Storybook to Chromatic as a single zip file instead of individual content files.", type: "boolean" } }, Cf = styled(Zl)({ position: "absolute", right: 16, top: 10 }), kf = styled.div(({ theme: e10 }) => ({ backgroundColor: e10.background.content, display: "flex", flexDirection: "column", minHeight: "100%", overflowY: "auto", padding: 20, position: "relative", fontSize: e10.typography.size.s2 })), If = styled.div({ margin: "0 auto", maxWidth: 600, width: "100%" }), Wl = styled.div(({ theme: e10 }) => ({ borderBottom: `1px solid ${e10.appBorderColor}`, marginBottom: 20, paddingBottom: 20, code: { fontSize: "90%" } })), Ef = styled(Vl)({ marginBottom: 10 }), Tf = styled.div({ display: "flex", flexDirection: "column", gap: 20 }), ql = styled.div(({ theme: e10 }) => ({ alignItems: "center", borderRadius: e10.appBorderRadius, display: "flex", flexWrap: "wrap", "> div": { width: "100%" } })), Gl = styled.div({ display: "flex", flexGrow: 1, flexWrap: "wrap", gap: "5px 10px" }), Ql = styled.div(({ theme: e10 }) => ({ fontWeight: e10.typography.weight.bold, div: { marginLeft: 5, position: "relative", top: 2 } })), Yl = styled.div({ marginTop: 10 }), Mf = styled.div(({ hideBorderRadius: e10, theme: t5 }) => ({ background: t5.base === "dark" ? t5.color.darkest : t5.color.lighter, border: `1px solid ${t5.appBorderColor}`, borderRadius: t5.appBorderRadius, borderBottomLeftRadius: e10 ? 0 : t5.appBorderRadius, borderBottomRightRadius: e10 ? 0 : t5.appBorderRadius, color: t5.base === "dark" ? t5.color.medium : t5.color.dark, fontFamily: t5.typography.fonts.mono, fontSize: 13, lineHeight: "20px", padding: "5px 10px", wordWrap: "break-word" })), Lf = styled.div(({ theme: e10 }) => ({ color: e10.color.warningText })), Jl = styled.div(({ theme: e10 }) => ({ color: e10.base === "dark" ? e10.color.medium : e10.color.dark, marginTop: 2 })), Kl = styled.div(({ warning: e10, theme: t5 }) => ({ alignItems: "center", display: "flex", backgroundColor: e10 ? t5.base === "dark" ? "#342E1A" : t5.background.warning : t5.background.hoverable, border: `1px solid ${t5.appBorderColor}`, borderRadius: 3, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 0, fontSize: t5.typography.size.s1, gap: 5, lineHeight: "20px", padding: 5, svg: { color: e10 ? t5.base === "dark" ? t5.color.warning : t5.color.warningText : t5.color.secondary, flexShrink: 0 }, code: { fontSize: "85%" } })), Af = styled.div(({ theme: e10 }) => ({ "&:nth-last-of-type(2)": { borderBottom: `1px solid ${e10.appBorderColor}`, paddingBottom: 30 } })), Xl = { height: 12, margin: 2, verticalAlign: "top", width: 12 }, Bf = styled(As)(Xl), _f = styled(ks)(Xl), e5 = ({ onClose: e10 }) => {
    let { uninstallAddon: t5 } = Ko(), [r5] = Ce(Dn), { configuration: n10 = {}, problems: a2 = {}, suggestions: o10 = {} } = r5 || {}, { configFile: i10, ...l2 } = n10, d3 = Object.keys({ ...l2, ...a2, ...o10 }).sort().map((u3) => ({ key: u3, value: u3 in l2 ? l2[u3] : void 0, problem: a2[u3], suggestion: o10[u3] }));
    return react_default.createElement(kf, null, react_default.createElement(Cf, { ariaLabel: "Close", onClick: e10, style: { marginRight: -8 } }, react_default.createElement(zl, null)), react_default.createElement(If, null, react_default.createElement(Ef, null, "Configuration"), i10 ? react_default.createElement(Wl, null, "This is a read-only representation of the Chromatic configuration options found in", " ", react_default.createElement(Fe, null, i10), ". Changes to the config file will be reflected here.", " ", react_default.createElement(Link, { href: "https://www.chromatic.com/docs/configure/", target: "_blank", withArrow: !0 }, "Learn more")) : react_default.createElement(Wl, null, "To configure this addon, create ", react_default.createElement(Fe, null, "chromatic.config.json"), " in your project's root directory.", " ", react_default.createElement(Link, { href: "https://www.chromatic.com/docs/cli#chromatic-config-file", target: "_blank", withArrow: !0 }, "Learn more")), d3 && react_default.createElement(Tf, null, d3.map(({ key: u3, value: c10, problem: p5, suggestion: f4 }) => react_default.createElement(Af, { key: u3, id: `${u3}-option` }, react_default.createElement(ql, null, react_default.createElement(Gl, null, react_default.createElement(Ql, null, u3, " "), u3 in tl && react_default.createElement(Lf, null, "*Disabled for local builds")), react_default.createElement(Jl, null, xf[u3]?.description), react_default.createElement(Yl, null, react_default.createElement(Mf, { hideBorderRadius: !!(p5 || f4) }, c10 === void 0 ? "undefined" : JSON.stringify(c10)))), p5 !== void 0 && react_default.createElement(Kl, { warning: !0 }, react_default.createElement(Bf, null), p5 === null ? react_default.createElement("span", null, react_default.createElement("strong", null, "Warning: "), "This should be removed.") : react_default.createElement("span", null, react_default.createElement("strong", null, "Warning: "), "This should be: ", react_default.createElement(Fe, null, JSON.stringify(p5)))), f4 !== void 0 && react_default.createElement(Kl, null, react_default.createElement(_f, null), react_default.createElement("span", null, react_default.createElement("strong", null, "Hint: "), "Try setting as ", react_default.createElement(Fe, null, JSON.stringify(f4)))))), react_default.createElement("div", null, react_default.createElement(ql, null, react_default.createElement(Gl, null, react_default.createElement(Ql, null, "Uninstall addon")), react_default.createElement(Jl, null, "Removing the addon updates your Storybook configuration and uninstalls the dependency."), react_default.createElement(Yl, null, react_default.createElement(J, { ariaLabel: !1, onClick: t5 }, "Uninstall")))))));
  }, n5 = { configVisible: !1, baselineImageVisible: !1, focusVisible: !1, diffVisible: !1 }, ai = (e10) => (t5, r5) => ({ ...t5, [e10]: typeof r5 == "boolean" ? r5 : !t5[e10] }), Of = { toggleDiff: ai("diffVisible"), toggleFocus: ai("focusVisible"), toggleConfig: ai("configVisible"), toggleBaselineImage: ai("baselineImageVisible") }, Nf = (e10, t5) => Of[t5.type](e10, t5.payload), a5 = createContext(n5), o5 = createContext(() => {
  }), Gn = () => Ze(a5, "Controls"), Xt = () => {
    let e10 = Ze(o5, "ControlsDispatch");
    return useMemo(() => ({ toggleDiff: (t5) => e10({ type: "toggleDiff", payload: t5 }), toggleFocus: (t5) => e10({ type: "toggleFocus", payload: t5 }), toggleConfig: (t5) => e10({ type: "toggleConfig", payload: t5 }), toggleBaselineImage: (t5) => e10({ type: "toggleBaselineImage", payload: t5 }) }), [e10]);
  }, i5 = ({ children: e10, initialState: t5 = n5 }) => {
    let [r5, n10] = useReducer(Nf, t5);
    return react_default.createElement(a5.Provider, { value: r5 }, react_default.createElement(o5.Provider, { value: n10 }, e10));
  }, Br = () => {
    let { accessToken: e10, setAccessToken: t5, subdomain: r5 } = zn(), { toggleConfig: n10 } = Xt(), [a2] = Ce(Oo), o10 = experimental_getStatusStore(z), { projectId: i10 } = a2 || {};
    return react_default.createElement(PopoverProvider, { padding: 0, popover: ({ onHide: l2 }) => react_default.createElement(ActionList, null, react_default.createElement(ActionList.Item, null, react_default.createElement(ActionList.Link, { ariaLabel: !1, href: "https://www.chromatic.com/docs/visual-tests-addon/", target: "_blank", onClick: l2 }, react_default.createElement(ActionList.Icon, null, react_default.createElement(_o, null)), react_default.createElement(ActionList.Text, null, "About this addon"))), react_default.createElement(ActionList.Item, null, react_default.createElement(ActionList.Action, { ariaLabel: !1, onClick: () => {
      n10(), l2();
    } }, react_default.createElement(ActionList.Icon, null, react_default.createElement(xs, null)), react_default.createElement(ActionList.Text, null, "Configuration"))), i10 && react_default.createElement(ActionList.Item, null, react_default.createElement(ActionList.Link, { ariaLabel: !1, href: `https://${r5}.chromatic.com/builds?appId=${i10?.split(":")[1]}`, target: "_blank", onClick: l2 }, react_default.createElement(ActionList.Icon, null, react_default.createElement(Ss, null)), react_default.createElement(ActionList.Text, null, "View project on Chromatic"))), e10 && react_default.createElement(ActionList.Item, null, react_default.createElement(ActionList.Action, { ariaLabel: !1, onClick: () => {
      o10.unset(), t5(null), l2();
    } }, react_default.createElement(ActionList.Icon, null, react_default.createElement(zs, null)), react_default.createElement(ActionList.Text, null, "Log out")))) }, react_default.createElement(ActionList.Button, { size: "small", ariaLabel: "Open menu" }, react_default.createElement(Cs, null)));
  };
  styled.div(({ hidden: e10, theme: t5 }) => ({ background: t5.background.app, containerType: "size", display: e10 ? "none" : "flex", flexDirection: "column", height: "100%" }));
  var s5 = styled.div({ display: "flex", flexDirection: "column", flexGrow: 1 }, ({ hidden: e10 }) => e10 && { display: "none" }), qa = styled.div(({ grow: e10 }) => e10 && { flexGrow: e10 ? 1 : "auto" }), Yn = styled.div({ display: "flex", flexDirection: "row", margin: 15 }, ({ header: e10, theme: t5 }) => e10 && { margin: 0, padding: 15, borderBottom: `1px solid ${t5.appBorderColor}`, "@container (min-width: 800px)": { height: 40, alignItems: "center", justifyContent: "space-between", padding: "5px 15px" } }), l5 = styled(Yn)({ alignItems: "center", height: 40, margin: "0 10px" }), Ue = styled.div({ display: "flex", flexDirection: "column", alignItems: "center" }, ({ push: e10 }) => e10 && { marginLeft: "auto" }), d5 = styled.div(({ theme: e10 }) => ({ borderBottom: `1px solid ${e10.appBorderColor}`, display: "flex", alignItems: "center", minHeight: 40, lineHeight: "20px", padding: "5px 15px" })), zf = styled(qa)(({ theme: e10 }) => ({ background: e10.background.warning, color: e10.color.warningText })), Zf = styled(qa)(({ theme: e10 }) => ({ background: e10.background.hoverable, color: e10.color.defaultText })), jf = ({ hidden: e10, ignoreConfig: t5, ignoreSuggestions: r5, onOpen: n10 }) => {
    let [a2] = Ce(Dn), o10 = Object.keys(a2?.problems || {}), i10 = Object.keys(a2?.suggestions || {}), [l2, d3] = useState(() => !!localStorage.getItem(E1)), u3 = useCallback(() => {
      d3(!0), localStorage.setItem(E1, "true");
    }, []), c10 = react_default.createElement(ye, { isButton: !0, onClick: () => n10(o10[0] || i10[0]), withArrow: !0 }, "Show details");
    return o10.length > 0 && !t5 ? react_default.createElement(zf, { hidden: e10 }, react_default.createElement(d5, null, react_default.createElement(Ue, null, react_default.createElement("span", null, "Visual tests locked due to configuration ", (0, c5.default)("problem", o10.length), ".", " ", c10)))) : i10.length > 0 && !l2 && !t5 && !r5 ? react_default.createElement(Zf, { hidden: e10 }, react_default.createElement(d5, null, react_default.createElement(Ue, null, react_default.createElement("span", null, "Configuration could be improved. ", c10)), react_default.createElement(Ue, { push: !0 }, react_default.createElement(ActionList.Button, { onClick: u3, size: "small", ariaLabel: "Dismiss" }, react_default.createElement(Hn, null))))) : null;
  }, Uf = styled.div({ display: "flex", flexDirection: "column", height: "100%" }), u5 = styled.div(({ hidden: e10, interstitial: t5, theme: r5 }) => ({ background: t5 ? r5.background.content : r5.background.app, display: e10 ? "none" : "flex", flexDirection: "column", flexGrow: 1, height: "100%", overflowY: "auto" })), Kr = styled.div(({ theme: e10 }) => ({ background: e10.background.bar, borderTop: `1px solid ${e10.appBorderColor}`, display: "flex", flexDirection: "row", alignItems: "center", height: 40, flexShrink: 0, padding: "0 10px", gap: 6 })), K = ({ children: e10, footer: t5 = react_default.createElement(Kr, null, react_default.createElement(Ue, { push: !0 }), react_default.createElement(Ue, null, react_default.createElement(Br, null))), ignoreConfig: r5 = !1, ignoreSuggestions: n10 = !t5, interstitial: a2 = !1 }) => {
    let { configVisible: o10 } = Gn(), { toggleConfig: i10 } = Xt(), l2 = useCallback((d3) => {
      i10(!0), d3 && setTimeout(() => {
        document.getElementById(`${d3}-option`)?.scrollIntoView({ behavior: "smooth", inline: "nearest" });
      }, 200);
    }, [i10]);
    return react_default.createElement(Uf, null, react_default.createElement(jf, { onOpen: l2, hidden: o10, ignoreConfig: r5, ignoreSuggestions: n10 }), react_default.createElement(u5, { hidden: o10, interstitial: a2 }, e10), react_default.createElement(u5, { hidden: !o10 }, react_default.createElement(e5, { onClose: () => i10(!1) })), t5);
  }, U = styled.div((e10) => ({ display: "flex", flexDirection: "column", gap: 15, alignItems: e10.alignItems ?? "center", textAlign: e10.textAlign ?? "center" })), Wf = styled.div(({ theme: e10 }) => ({ position: "relative", "&& input": { color: e10.input.color || "inherit", background: e10.input.background, boxShadow: `${e10.input.border} 0 0 0 1px inset`, fontSize: e10.typography.size.s2, lineHeight: "20px" } })), qf = styled.div(({ theme: e10 }) => ({ pointerEvents: "none", position: "absolute", top: 0, left: 40, right: 0, zIndex: 2, overflow: "hidden", height: 40, display: "flex", alignItems: "center", lineHeight: "20px", color: e10.input.color || "inherit", fontSize: e10.typography.size.s2, span: { opacity: 0 } })), Gf = ({ value: e10, placeholder: t5, suffix: r5 }) => react_default.createElement(qf, null, react_default.createElement("span", null, e10 || t5), react_default.createElement("b", null, r5)), m5 = ({ id: e10, value: t5, placeholder: r5, suffix: n10, ...a2 }) => react_default.createElement(Wf, null, react_default.createElement(H12, { id: e10, hideLabel: !0, label: "", value: t5, placeholder: r5, crossOrigin: void 0, enterKeyHint: void 0, ...a2 }), react_default.createElement(Gf, { value: t5, placeholder: r5, suffix: n10 })), L2 = styled.div(({ center: e10, small: t5, block: r5, theme: n10 }) => ({ display: r5 ? "block" : "inline-block", color: n10.color.defaultText, fontSize: t5 ? n10.typography.size.s1 : n10.typography.size.s2, lineHeight: t5 ? "18px" : "20px", textAlign: e10 ? "center" : "left", textWrap: "balance" }), ({ muted: e10, theme: t5 }) => e10 && { color: t5.base === "light" ? t5.color.dark : "#C9CDCF" }, ({ theme: e10 }) => ({ b: { color: e10.color.defaultText }, code: { fontSize: e10.typography.size.s1, border: `1px solid ${e10.appBorderColor}`, borderRadius: 3, padding: 2 }, small: { fontSize: e10.typography.size.s1 }, span: { whiteSpace: "nowrap" }, svg: { verticalAlign: "top" } })), Xn = ({ onBack: e10 }) => react_default.createElement(l5, null, e10 && react_default.createElement(Ue, null, react_default.createElement(ActionList.Button, { ariaLabel: "Go back", onClick: e10 }, react_default.createElement(Ps, null), "Back")), react_default.createElement(Ue, { push: !0 }, react_default.createElement(ActionList.Button, { asChild: !0, ariaLabel: "Learn about visual tests" }, react_default.createElement("a", { href: "https://www.chromatic.com/storybook", target: "_blank" }, react_default.createElement(_o, null))))), Jf = styled(U)({ alignSelf: "stretch" }), Kf = styled(ei)({ width: 40, height: 40, filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1))", marginBottom: 10 }), Xf = styled.form({ position: "relative", display: "flex", flexDirection: "column", width: "100%", maxWidth: 300, margin: 10 }), em = styled(Button)({ "&&": { fontSize: 13, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 } }), y5 = ({ onBack: e10, onSignIn: t5 }) => {
    let [r5, n10] = useState(""), [a2, o10] = useState(null), i10 = useCallback((d3) => {
      let u3 = d3.target.value.replace(/[^a-z0-9-]/g, "");
      n10(u3), o10(null);
    }, []), l2 = useCallback((d3) => {
      d3.preventDefault(), r5 ? t5(r5) : o10("Please enter a subdomain");
    }, [r5, t5]);
    return react_default.createElement(K, { footer: null, ignoreConfig: !0 }, react_default.createElement(Xn, { onBack: e10 }), react_default.createElement(Q, null, react_default.createElement(Jf, null, react_default.createElement("div", null, react_default.createElement(Kf, null), react_default.createElement(W2, null, "Sign in with SSO"), react_default.createElement(L2, { muted: !0 }, "Enter your team's Chromatic URL.")), react_default.createElement(Xf, { onSubmit: l2 }, react_default.createElement(m5, { autoFocus: !0, icon: "users", value: r5, placeholder: "yourteam", suffix: ".chromatic.com", onChange: i10, id: "subdomain-input", stackLevel: "top", error: a2, errorTooltipPlacement: "top" }), react_default.createElement(em, { ariaLabel: !1, type: "submit", variant: "solid", size: "medium" }, "Continue")))));
  }, $e = styled.div({ display: "flex", flexDirection: "column", gap: 5, alignItems: "center", textAlign: "center" }), nm = styled(ei)({ width: 40, height: 40, filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1))", marginBottom: 10 }), w5 = ({ onBack: e10, onSignIn: t5, onSignInWithSSO: r5 }) => react_default.createElement(K, { footer: null, ignoreConfig: !0 }, react_default.createElement(Xn, { onBack: e10 }), react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(nm, null), react_default.createElement(W2, null, "Sign in to begin visual testing"), react_default.createElement(L2, { center: !0, muted: !0 }, "Pinpoint bugs instantly by connecting with cloud browsers that run visual tests in parallel.")), react_default.createElement($e, null, react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", onClick: () => t5() }, "Sign in with Chromatic"), react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: () => r5() }, "Sign in with SSO"))))), x5 = { NAME: "Name", DOCUMENT: "Document", OPERATION_DEFINITION: "OperationDefinition", VARIABLE_DEFINITION: "VariableDefinition", SELECTION_SET: "SelectionSet", FIELD: "Field", ARGUMENT: "Argument", FRAGMENT_SPREAD: "FragmentSpread", INLINE_FRAGMENT: "InlineFragment", FRAGMENT_DEFINITION: "FragmentDefinition", VARIABLE: "Variable", INT: "IntValue", FLOAT: "FloatValue", STRING: "StringValue", BOOLEAN: "BooleanValue", NULL: "NullValue", ENUM: "EnumValue", LIST: "ListValue", OBJECT: "ObjectValue", OBJECT_FIELD: "ObjectField", DIRECTIVE: "Directive", NAMED_TYPE: "NamedType", LIST_TYPE: "ListType", NON_NULL_TYPE: "NonNullType" }, ea = class extends Error {
    constructor(t5, r5, n10, a2, o10, i10, l2) {
      super(t5), this.name = "GraphQLError", this.message = t5, o10 && (this.path = o10), r5 && (this.nodes = Array.isArray(r5) ? r5 : [r5]), n10 && (this.source = n10), a2 && (this.positions = a2), i10 && (this.originalError = i10);
      var d3 = l2;
      if (!d3 && i10) {
        var u3 = i10.extensions;
        u3 && typeof u3 == "object" && (d3 = u3);
      }
      this.extensions = d3 || {};
    }
    toJSON() {
      return { ...this, message: this.message };
    }
    toString() {
      return this.message;
    }
    get [Symbol.toStringTag]() {
      return "GraphQLError";
    }
  }, R, E;
  function at(e10) {
    return new ea(`Syntax Error: Unexpected token at ${E} in ${e10}`);
  }
  function b5(e10) {
    if (e10.lastIndex = E, e10.test(R)) return R.slice(E, E = e10.lastIndex);
  }
  var ii = / +(?=[^\s])/y;
  function am(e10) {
    for (var t5 = e10.split(`
`), r5 = "", n10 = 0, a2 = 0, o10 = t5.length - 1, i10 = 0; i10 < t5.length; i10++) ii.lastIndex = 0, ii.test(t5[i10]) && (i10 && (!n10 || ii.lastIndex < n10) && (n10 = ii.lastIndex), a2 = a2 || i10, o10 = i10);
    for (var l2 = a2; l2 <= o10; l2++) l2 !== a2 && (r5 += `
`), r5 += t5[l2].slice(n10).replace(/\\"""/g, '"""');
    return r5;
  }
  function ue() {
    for (var e10 = 0 | R.charCodeAt(E++); e10 === 9 || e10 === 10 || e10 === 13 || e10 === 32 || e10 === 35 || e10 === 44 || e10 === 65279; e10 = 0 | R.charCodeAt(E++)) if (e10 === 35) for (; (e10 = 0 | R.charCodeAt(E++)) && e10 !== 10 && e10 !== 13; ) ;
    E--;
  }
  function U1() {
    for (var e10 = E, t5 = 0 | R.charCodeAt(E++); t5 >= 48 && t5 <= 57 || t5 >= 65 && t5 <= 90 || t5 === 95 || t5 >= 97 && t5 <= 122; t5 = 0 | R.charCodeAt(E++)) ;
    if (e10 === E - 1) throw at("Name");
    var r5 = R.slice(e10, --E);
    return ue(), r5;
  }
  function ct() {
    return { kind: "Name", value: U1() };
  }
  var om = /(?:"""|(?:[\s\S]*?[^\\])""")/y, im = /(?:(?:\.\d+)?[eE][+-]?\d+|\.\d+)/y;
  function ta(e10) {
    var t5;
    switch (R.charCodeAt(E)) {
      case 91:
        E++, ue();
        for (var r5 = []; R.charCodeAt(E) !== 93; ) r5.push(ta(e10));
        return E++, ue(), { kind: "ListValue", values: r5 };
      case 123:
        E++, ue();
        for (var n10 = []; R.charCodeAt(E) !== 125; ) {
          var a2 = ct();
          if (R.charCodeAt(E++) !== 58) throw at("ObjectField");
          ue(), n10.push({ kind: "ObjectField", name: a2, value: ta(e10) });
        }
        return E++, ue(), { kind: "ObjectValue", fields: n10 };
      case 36:
        if (e10) throw at("Variable");
        return E++, { kind: "Variable", name: ct() };
      case 34:
        if (R.charCodeAt(E + 1) === 34 && R.charCodeAt(E + 2) === 34) {
          if (E += 3, (t5 = b5(om)) == null) throw at("StringValue");
          return ue(), { kind: "StringValue", value: am(t5.slice(0, -3)), block: !0 };
        } else {
          var o10 = E, i10;
          E++;
          var l2 = !1;
          for (i10 = 0 | R.charCodeAt(E++); i10 === 92 && (E++, l2 = !0) || i10 !== 10 && i10 !== 13 && i10 !== 34 && i10; i10 = 0 | R.charCodeAt(E++)) ;
          if (i10 !== 34) throw at("StringValue");
          return t5 = R.slice(o10, E), ue(), { kind: "StringValue", value: l2 ? JSON.parse(t5) : t5.slice(1, -1), block: !1 };
        }
      case 45:
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        for (var d3 = E++, u3; (u3 = 0 | R.charCodeAt(E++)) >= 48 && u3 <= 57; ) ;
        var c10 = R.slice(d3, --E);
        if ((u3 = R.charCodeAt(E)) === 46 || u3 === 69 || u3 === 101) {
          if ((t5 = b5(im)) == null) throw at("FloatValue");
          return ue(), { kind: "FloatValue", value: c10 + t5 };
        } else return ue(), { kind: "IntValue", value: c10 };
      case 110:
        if (R.charCodeAt(E + 1) === 117 && R.charCodeAt(E + 2) === 108 && R.charCodeAt(E + 3) === 108) return E += 4, ue(), { kind: "NullValue" };
        break;
      case 116:
        if (R.charCodeAt(E + 1) === 114 && R.charCodeAt(E + 2) === 117 && R.charCodeAt(E + 3) === 101) return E += 4, ue(), { kind: "BooleanValue", value: !0 };
        break;
      case 102:
        if (R.charCodeAt(E + 1) === 97 && R.charCodeAt(E + 2) === 108 && R.charCodeAt(E + 3) === 115 && R.charCodeAt(E + 4) === 101) return E += 5, ue(), { kind: "BooleanValue", value: !1 };
        break;
    }
    return { kind: "EnumValue", value: U1() };
  }
  function C5(e10) {
    if (R.charCodeAt(E) === 40) {
      var t5 = [];
      E++, ue();
      do {
        var r5 = ct();
        if (R.charCodeAt(E++) !== 58) throw at("Argument");
        ue(), t5.push({ kind: "Argument", name: r5, value: ta(e10) });
      } while (R.charCodeAt(E) !== 41);
      return E++, ue(), t5;
    }
  }
  function Fr(e10) {
    if (R.charCodeAt(E) === 64) {
      var t5 = [];
      do
        E++, t5.push({ kind: "Directive", name: ct(), arguments: C5(e10) });
      while (R.charCodeAt(E) === 64);
      return t5;
    }
  }
  function sm() {
    for (var e10 = 0; R.charCodeAt(E) === 91; ) e10++, E++, ue();
    var t5 = { kind: "NamedType", name: ct() };
    do
      if (R.charCodeAt(E) === 33 && (E++, ue(), t5 = { kind: "NonNullType", type: t5 }), e10) {
        if (R.charCodeAt(E++) !== 93) throw at("NamedType");
        ue(), t5 = { kind: "ListType", type: t5 };
      }
    while (e10--);
    return t5;
  }
  function si() {
    if (R.charCodeAt(E++) !== 123) throw at("SelectionSet");
    return ue(), li();
  }
  function li() {
    var e10 = [];
    do
      if (R.charCodeAt(E) === 46) {
        if (R.charCodeAt(++E) !== 46 || R.charCodeAt(++E) !== 46) throw at("SelectionSet");
        switch (E++, ue(), R.charCodeAt(E)) {
          case 64:
            e10.push({ kind: "InlineFragment", typeCondition: void 0, directives: Fr(!1), selectionSet: si() });
            break;
          case 111:
            R.charCodeAt(E + 1) === 110 ? (E += 2, ue(), e10.push({ kind: "InlineFragment", typeCondition: { kind: "NamedType", name: ct() }, directives: Fr(!1), selectionSet: si() })) : e10.push({ kind: "FragmentSpread", name: ct(), directives: Fr(!1) });
            break;
          case 123:
            E++, ue(), e10.push({ kind: "InlineFragment", typeCondition: void 0, directives: void 0, selectionSet: li() });
            break;
          default:
            e10.push({ kind: "FragmentSpread", name: ct(), directives: Fr(!1) });
        }
      } else {
        var t5 = ct(), r5 = void 0;
        R.charCodeAt(E) === 58 && (E++, ue(), r5 = t5, t5 = ct());
        var n10 = C5(!1), a2 = Fr(!1), o10 = void 0;
        R.charCodeAt(E) === 123 && (E++, ue(), o10 = li()), e10.push({ kind: "Field", alias: r5, name: t5, arguments: n10, directives: a2, selectionSet: o10 });
      }
    while (R.charCodeAt(E) !== 125);
    return E++, ue(), { kind: "SelectionSet", selections: e10 };
  }
  function lm() {
    if (ue(), R.charCodeAt(E) === 40) {
      var e10 = [];
      E++, ue();
      do {
        var t5 = void 0;
        if (R.charCodeAt(E) === 34 && (t5 = ta(!0)), R.charCodeAt(E++) !== 36) throw at("Variable");
        var r5 = ct();
        if (R.charCodeAt(E++) !== 58) throw at("VariableDefinition");
        ue();
        var n10 = sm(), a2 = void 0;
        R.charCodeAt(E) === 61 && (E++, ue(), a2 = ta(!0)), ue();
        var o10 = { kind: "VariableDefinition", variable: { kind: "Variable", name: r5 }, type: n10, defaultValue: a2, directives: Fr(!0) };
        t5 && (o10.description = t5), e10.push(o10);
      } while (R.charCodeAt(E) !== 41);
      return E++, ue(), e10;
    }
  }
  function dm(e10) {
    var t5 = ct();
    if (R.charCodeAt(E++) !== 111 || R.charCodeAt(E++) !== 110) throw at("FragmentDefinition");
    ue();
    var r5 = { kind: "FragmentDefinition", name: t5, typeCondition: { kind: "NamedType", name: ct() }, directives: Fr(!1), selectionSet: si() };
    return e10 && (r5.description = e10), r5;
  }
  function S5() {
    var e10 = [];
    do {
      var t5 = void 0;
      if (R.charCodeAt(E) === 34 && (t5 = ta(!0)), R.charCodeAt(E) === 123) {
        if (t5) throw at("Document");
        E++, ue(), e10.push({ kind: "OperationDefinition", operation: "query", name: void 0, variableDefinitions: void 0, directives: void 0, selectionSet: li() });
      } else {
        var r5 = U1();
        switch (r5) {
          case "fragment":
            e10.push(dm(t5));
            break;
          case "query":
          case "mutation":
          case "subscription":
            var n10, a2 = void 0;
            (n10 = R.charCodeAt(E)) !== 40 && n10 !== 64 && n10 !== 123 && (a2 = ct());
            var o10 = { kind: "OperationDefinition", operation: r5, name: a2, variableDefinitions: lm(), directives: Fr(!1), selectionSet: si() };
            t5 && (o10.description = t5), e10.push(o10);
            break;
          default:
            throw at("Document");
        }
      }
    } while (E < R.length);
    return e10;
  }
  function k5(e10, t5) {
    return R = e10.body ? e10.body : e10, E = 0, ue(), t5 && t5.noLocation ? { kind: "Document", definitions: S5() } : { kind: "Document", definitions: S5(), loc: { start: 0, end: R.length, startToken: void 0, endToken: void 0, source: { body: R, name: "graphql.web", locationOffset: { line: 1, column: 1 } } } };
  }
  function ut(e10, t5, r5) {
    for (var n10 = "", a2 = 0; a2 < e10.length; a2++) a2 && (n10 += t5), n10 += r5(e10[a2]);
    return n10;
  }
  function um(e10) {
    return JSON.stringify(e10);
  }
  function cm(e10) {
    return `"""
` + e10.replace(/"""/g, '\\"""') + `
"""`;
  }
  var er = `
`, Le = { OperationDefinition(e10) {
    var t5 = "";
    e10.description && (t5 += Le.StringValue(e10.description) + `
`), t5 += e10.operation, e10.name && (t5 += " " + e10.name.value), e10.variableDefinitions && e10.variableDefinitions.length && (e10.name || (t5 += " "), t5 += "(" + ut(e10.variableDefinitions, ", ", Le.VariableDefinition) + ")"), e10.directives && e10.directives.length && (t5 += " " + ut(e10.directives, " ", Le.Directive));
    var r5 = Le.SelectionSet(e10.selectionSet);
    return t5 !== "query" ? t5 + " " + r5 : r5;
  }, VariableDefinition(e10) {
    var t5 = "";
    return e10.description && (t5 += Le.StringValue(e10.description) + " "), t5 += Le.Variable(e10.variable) + ": " + fr(e10.type), e10.defaultValue && (t5 += " = " + fr(e10.defaultValue)), e10.directives && e10.directives.length && (t5 += " " + ut(e10.directives, " ", Le.Directive)), t5;
  }, Field(e10) {
    var t5 = e10.alias ? e10.alias.value + ": " + e10.name.value : e10.name.value;
    if (e10.arguments && e10.arguments.length) {
      var r5 = ut(e10.arguments, ", ", Le.Argument);
      t5.length + r5.length + 2 > 80 ? t5 += "(" + (er += "  ") + ut(e10.arguments, er, Le.Argument) + (er = er.slice(0, -2)) + ")" : t5 += "(" + r5 + ")";
    }
    return e10.directives && e10.directives.length && (t5 += " " + ut(e10.directives, " ", Le.Directive)), e10.selectionSet && e10.selectionSet.selections.length && (t5 += " " + Le.SelectionSet(e10.selectionSet)), t5;
  }, StringValue(e10) {
    return e10.block ? cm(e10.value).replace(/\n/g, er) : um(e10.value);
  }, BooleanValue: (e10) => "" + e10.value, NullValue: (e10) => "null", IntValue: (e10) => e10.value, FloatValue: (e10) => e10.value, EnumValue: (e10) => e10.value, Name: (e10) => e10.value, Variable: (e10) => "$" + e10.name.value, ListValue: (e10) => "[" + ut(e10.values, ", ", fr) + "]", ObjectValue: (e10) => "{" + ut(e10.fields, ", ", Le.ObjectField) + "}", ObjectField: (e10) => e10.name.value + ": " + fr(e10.value), Document(e10) {
    return !e10.definitions || !e10.definitions.length ? "" : ut(e10.definitions, `

`, fr);
  }, SelectionSet: (e10) => "{" + (er += "  ") + ut(e10.selections, er, fr) + (er = er.slice(0, -2)) + "}", Argument: (e10) => e10.name.value + ": " + fr(e10.value), FragmentSpread(e10) {
    var t5 = "..." + e10.name.value;
    return e10.directives && e10.directives.length && (t5 += " " + ut(e10.directives, " ", Le.Directive)), t5;
  }, InlineFragment(e10) {
    var t5 = "...";
    return e10.typeCondition && (t5 += " on " + e10.typeCondition.name.value), e10.directives && e10.directives.length && (t5 += " " + ut(e10.directives, " ", Le.Directive)), t5 += " " + Le.SelectionSet(e10.selectionSet);
  }, FragmentDefinition(e10) {
    var t5 = "";
    return e10.description && (t5 += Le.StringValue(e10.description) + `
`), t5 += "fragment " + e10.name.value, t5 += " on " + e10.typeCondition.name.value, e10.directives && e10.directives.length && (t5 += " " + ut(e10.directives, " ", Le.Directive)), t5 + " " + Le.SelectionSet(e10.selectionSet);
  }, Directive(e10) {
    var t5 = "@" + e10.name.value;
    return e10.arguments && e10.arguments.length && (t5 += "(" + ut(e10.arguments, ", ", Le.Argument) + ")"), t5;
  }, NamedType: (e10) => e10.name.value, ListType: (e10) => "[" + fr(e10.type) + "]", NonNullType: (e10) => fr(e10.type) + "!" }, fr = (e10) => Le[e10.kind](e10);
  function I5(e10) {
    return er = `
`, Le[e10.kind] ? Le[e10.kind](e10) : "";
  }
  var $1 = () => {
  }, gt = $1;
  function Nt(e10) {
    return { tag: 0, 0: e10 };
  }
  function Ga(e10) {
    return { tag: 1, 0: e10 };
  }
  var E5 = () => typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator", pm = (e10) => e10;
  function Ve(e10) {
    return (t5) => (r5) => {
      var n10 = gt;
      t5((a2) => {
        a2 === 0 ? r5(0) : a2.tag === 0 ? (n10 = a2[0], r5(a2)) : e10(a2[0]) ? r5(a2) : n10(0);
      });
    };
  }
  function di(e10) {
    return (t5) => (r5) => t5((n10) => {
      n10 === 0 || n10.tag === 0 ? r5(n10) : r5(Ga(e10(n10[0])));
    });
  }
  function Qa(e10) {
    return (t5) => (r5) => {
      var n10 = [], a2 = gt, o10 = !1, i10 = !1;
      t5((l2) => {
        i10 || (l2 === 0 ? (i10 = !0, n10.length || r5(0)) : l2.tag === 0 ? a2 = l2[0] : (o10 = !1, (function(u3) {
          var c10 = gt;
          u3((p5) => {
            if (p5 === 0) {
              if (n10.length) {
                var f4 = n10.indexOf(c10);
                f4 > -1 && (n10 = n10.slice()).splice(f4, 1), n10.length || (i10 ? r5(0) : o10 || (o10 = !0, a2(0)));
              }
            } else p5.tag === 0 ? (n10.push(c10 = p5[0]), c10(0)) : n10.length && (r5(p5), c10(0));
          });
        })(e10(l2[0])), o10 || (o10 = !0, a2(0))));
      }), r5(Nt((l2) => {
        if (l2 === 1) {
          i10 || (i10 = !0, a2(1));
          for (var d3 = 0, u3 = n10, c10 = n10.length; d3 < c10; d3++) u3[d3](1);
          n10.length = 0;
        } else {
          !i10 && !o10 ? (o10 = !0, a2(0)) : o10 = !1;
          for (var p5 = 0, f4 = n10, m8 = n10.length; p5 < m8; p5++) f4[p5](0);
        }
      }));
    };
  }
  function fm(e10) {
    return Qa(pm)(e10);
  }
  function Xr(e10) {
    return fm(hm(e10));
  }
  function ra(e10) {
    return (t5) => (r5) => {
      var n10 = !1;
      t5((a2) => {
        if (!n10) if (a2 === 0) n10 = !0, r5(0), e10();
        else if (a2.tag === 0) {
          var o10 = a2[0];
          r5(Nt((i10) => {
            i10 === 1 ? (n10 = !0, o10(1), e10()) : o10(i10);
          }));
        } else r5(a2);
      });
    };
  }
  function en(e10) {
    return (t5) => (r5) => {
      var n10 = !1;
      t5((a2) => {
        if (!n10) if (a2 === 0) n10 = !0, r5(0);
        else if (a2.tag === 0) {
          var o10 = a2[0];
          r5(Nt((i10) => {
            i10 === 1 && (n10 = !0), o10(i10);
          }));
        } else e10(a2[0]), r5(a2);
      });
    };
  }
  function Ya(e10) {
    return (t5) => (r5) => t5((n10) => {
      n10 === 0 ? r5(0) : n10.tag === 0 ? (r5(n10), e10()) : r5(n10);
    });
  }
  function na(e10) {
    var t5 = [], r5 = gt, n10 = !1;
    return (a2) => {
      t5.push(a2), t5.length === 1 && e10((o10) => {
        if (o10 === 0) {
          for (var i10 = 0, l2 = t5, d3 = t5.length; i10 < d3; i10++) l2[i10](0);
          t5.length = 0;
        } else if (o10.tag === 0) r5 = o10[0];
        else {
          n10 = !1;
          for (var u3 = 0, c10 = t5, p5 = t5.length; u3 < p5; u3++) c10[u3](o10);
        }
      }), a2(Nt((o10) => {
        if (o10 === 1) {
          var i10 = t5.indexOf(a2);
          i10 > -1 && (t5 = t5.slice()).splice(i10, 1), t5.length || r5(1);
        } else n10 || (n10 = !0, r5(0));
      }));
    };
  }
  function W1(e10) {
    return (t5) => (r5) => {
      var n10 = gt, a2 = gt, o10 = !1, i10 = !1, l2 = !1, d3 = !1;
      t5((u3) => {
        d3 || (u3 === 0 ? (d3 = !0, l2 || r5(0)) : u3.tag === 0 ? n10 = u3[0] : (l2 && (a2(1), a2 = gt), o10 ? o10 = !1 : (o10 = !0, n10(0)), (function(p5) {
          l2 = !0, p5((f4) => {
            l2 && (f4 === 0 ? (l2 = !1, d3 ? r5(0) : o10 || (o10 = !0, n10(0))) : f4.tag === 0 ? (i10 = !1, (a2 = f4[0])(0)) : (r5(f4), i10 ? i10 = !1 : a2(0)));
          });
        })(e10(u3[0]))));
      }), r5(Nt((u3) => {
        u3 === 1 ? (d3 || (d3 = !0, n10(1)), l2 && (l2 = !1, a2(1))) : (!d3 && !o10 && (o10 = !0, n10(0)), l2 && !i10 && (i10 = !0, a2(0)));
      }));
    };
  }
  function tn(e10) {
    return (t5) => (r5) => {
      var n10 = gt, a2 = !1, o10 = 0;
      t5((i10) => {
        a2 || (i10 === 0 ? (a2 = !0, r5(0)) : i10.tag === 0 ? e10 <= 0 ? (a2 = !0, r5(0), i10[0](1)) : n10 = i10[0] : o10++ < e10 ? (r5(i10), !a2 && o10 >= e10 && (a2 = !0, r5(0), n10(1))) : r5(i10));
      }), r5(Nt((i10) => {
        i10 === 1 && !a2 ? (a2 = !0, n10(1)) : i10 === 0 && !a2 && o10 < e10 && n10(0);
      }));
    };
  }
  function q1(e10) {
    return (t5) => (r5) => {
      var n10 = gt, a2 = gt, o10 = !1;
      t5((i10) => {
        o10 || (i10 === 0 ? (o10 = !0, a2(1), r5(0)) : i10.tag === 0 ? (n10 = i10[0], e10((l2) => {
          l2 === 0 || (l2.tag === 0 ? (a2 = l2[0])(0) : (o10 = !0, a2(1), n10(1), r5(0)));
        })) : r5(i10));
      }), r5(Nt((i10) => {
        i10 === 1 && !o10 ? (o10 = !0, n10(1), a2(1)) : o10 || n10(0);
      }));
    };
  }
  function ui(e10, t5) {
    return (r5) => (n10) => {
      var a2 = gt, o10 = !1;
      r5((i10) => {
        o10 || (i10 === 0 ? (o10 = !0, n10(0)) : i10.tag === 0 ? (a2 = i10[0], n10(i10)) : e10(i10[0]) ? n10(i10) : (o10 = !0, t5 && n10(i10), n10(0), a2(1)));
      });
    };
  }
  function T5(e10) {
    return (t5) => e10()(t5);
  }
  function G1(e10) {
    return (t5) => {
      var r5 = e10[E5()] && e10[E5()]() || e10, n10 = !1, a2 = !1, o10 = !1, i10;
      t5(Nt(async (l2) => {
        if (l2 === 1) n10 = !0, r5.return && r5.return();
        else if (a2) o10 = !0;
        else {
          for (o10 = a2 = !0; o10 && !n10; ) if ((i10 = await r5.next()).done) n10 = !0, r5.return && await r5.return(), t5(0);
          else try {
            o10 = !1, t5(Ga(i10.value));
          } catch (d3) {
            if (r5.throw) (n10 = !!(await r5.throw(d3)).done) && t5(0);
            else throw d3;
          }
          a2 = !1;
        }
      }));
    };
  }
  function mm(e10) {
    return e10[Symbol.asyncIterator] ? G1(e10) : (t5) => {
      var r5 = e10[Symbol.iterator](), n10 = !1, a2 = !1, o10 = !1, i10;
      t5(Nt((l2) => {
        if (l2 === 1) n10 = !0, r5.return && r5.return();
        else if (a2) o10 = !0;
        else {
          for (o10 = a2 = !0; o10 && !n10; ) if ((i10 = r5.next()).done) n10 = !0, r5.return && r5.return(), t5(0);
          else try {
            o10 = !1, t5(Ga(i10.value));
          } catch (d3) {
            if (r5.throw) (n10 = !!r5.throw(d3).done) && t5(0);
            else throw d3;
          }
          a2 = !1;
        }
      }));
    };
  }
  var hm = mm;
  function aa(e10) {
    return (t5) => {
      var r5 = !1;
      t5(Nt((n10) => {
        n10 === 1 ? r5 = !0 : r5 || (r5 = !0, t5(Ga(e10)), t5(0));
      }));
    };
  }
  function Q1(e10) {
    return (t5) => {
      var r5 = !1, n10 = e10({ next(a2) {
        r5 || t5(Ga(a2));
      }, complete() {
        r5 || (r5 = !0, t5(0));
      } });
      t5(Nt((a2) => {
        a2 === 1 && !r5 && (r5 = !0, n10());
      }));
    };
  }
  function Ja() {
    var e10, t5;
    return { source: na(Q1((r5) => (e10 = r5.next, t5 = r5.complete, $1))), next(r5) {
      e10 && e10(r5);
    }, complete() {
      t5 && t5();
    } };
  }
  function Y1(e10) {
    return Q1((t5) => (e10.then((r5) => {
      Promise.resolve(r5).then(() => {
        t5.next(r5), t5.complete();
      });
    }), $1));
  }
  function Pr(e10) {
    return (t5) => {
      var r5 = gt, n10 = !1;
      return t5((a2) => {
        a2 === 0 ? n10 = !0 : a2.tag === 0 ? (r5 = a2[0])(0) : n10 || (e10(a2[0]), r5(0));
      }), { unsubscribe() {
        n10 || (n10 = !0, r5(1));
      } };
    };
  }
  function M5(e10) {
    Pr((t5) => {
    })(e10);
  }
  function oa(e10) {
    return new Promise((t5) => {
      var r5 = gt, n10;
      e10((a2) => {
        a2 === 0 ? Promise.resolve(n10).then(t5) : a2.tag === 0 ? (r5 = a2[0])(0) : (n10 = a2[0], r5(0));
      });
    });
  }
  var gm = (e10) => e10 && typeof e10.message == "string" && (e10.extensions || e10.name === "GraphQLError") ? e10 : typeof e10 == "object" && typeof e10.message == "string" ? new ea(e10.message, e10.nodes, e10.source, e10.positions, e10.path, e10, e10.extensions || {}) : new ea(e10), sa = class extends Error {
    constructor(t5) {
      var r5 = (t5.graphQLErrors || []).map(gm), n10 = ((a2, o10) => {
        var i10 = "";
        if (a2) return `[Network] ${a2.message}`;
        if (o10) for (var l2 = 0, d3 = o10.length; l2 < d3; l2++) i10 && (i10 += `
`), i10 += `[GraphQL] ${o10[l2].message}`;
        return i10;
      })(t5.networkError, r5);
      super(n10), this.name = "CombinedError", this.message = n10, this.graphQLErrors = r5, this.networkError = t5.networkError, this.response = t5.response;
    }
    toString() {
      return this.message;
    }
  }, ci = (e10, t5) => {
    for (var r5 = 0 | (t5 || 5381), n10 = 0, a2 = 0 | e10.length; n10 < a2; n10++) r5 = (r5 << 5) + r5 + e10.charCodeAt(n10);
    return r5;
  }, rn = /* @__PURE__ */ new Set(), L5 = /* @__PURE__ */ new WeakMap(), ia = (e10, t5) => {
    if (e10 === null || rn.has(e10)) return "null";
    if (typeof e10 != "object") return JSON.stringify(e10) || "";
    if (e10.toJSON) return ia(e10.toJSON(), t5);
    if (Array.isArray(e10)) {
      for (var r5 = "[", n10 = 0, a2 = e10.length; n10 < a2; n10++) r5.length > 1 && (r5 += ","), r5 += ia(e10[n10], t5) || "null";
      return r5 += "]";
    } else if (!t5 && (mi !== Or && e10 instanceof mi || hi !== Or && e10 instanceof hi)) return "null";
    var o10 = Object.keys(e10).sort();
    if (!o10.length && e10.constructor && Object.getPrototypeOf(e10).constructor !== Object.prototype.constructor) {
      var i10 = L5.get(e10) || Math.random().toString(36).slice(2);
      return L5.set(e10, i10), ia({ __key: i10 }, t5);
    }
    rn.add(e10);
    for (var l2 = "{", d3 = 0, u3 = o10.length; d3 < u3; d3++) {
      var c10 = ia(e10[o10[d3]], t5);
      c10 && (l2.length > 1 && (l2 += ","), l2 += ia(o10[d3], t5) + ":" + c10);
    }
    return rn.delete(e10), l2 += "}";
  }, J1 = (e10, t5, r5) => {
    if (!(r5 == null || typeof r5 != "object" || r5.toJSON || rn.has(r5))) if (Array.isArray(r5)) for (var n10 = 0, a2 = r5.length; n10 < a2; n10++) J1(e10, `${t5}.${n10}`, r5[n10]);
    else if (r5 instanceof mi || r5 instanceof hi) e10.set(t5, r5);
    else {
      rn.add(r5);
      for (var o10 in r5) J1(e10, `${t5}.${o10}`, r5[o10]);
    }
  }, fi = (e10, t5) => (rn.clear(), ia(e10, t5 || !1)), Or = class {
  }, mi = typeof File < "u" ? File : Or, hi = typeof Blob < "u" ? Blob : Or, vm = /("{3}[\s\S]*"{3}|"(?:\\.|[^"])*")/g, ym = /(?:#[^\n\r]+)?(?:[\r\n]+|$)/g, wm = (e10, t5) => t5 % 2 == 0 ? e10.replace(ym, `
`) : e10, A5 = (e10) => e10.split(vm).map(wm).join("").trim(), B5 = /* @__PURE__ */ new Map(), pi = /* @__PURE__ */ new Map(), vi = (e10) => {
    var t5;
    return typeof e10 == "string" ? t5 = A5(e10) : e10.loc && pi.get(e10.__key) === e10 ? t5 = e10.loc.source.body : (t5 = B5.get(e10) || A5(I5(e10)), B5.set(e10, t5)), typeof e10 != "string" && !e10.loc && (e10.loc = { start: 0, end: t5.length, source: { body: t5, name: "gql", locationOffset: { line: 1, column: 1 } } }), t5;
  }, _5 = (e10) => {
    var t5;
    if (e10.documentId) t5 = ci(e10.documentId);
    else if (t5 = ci(vi(e10)), e10.definitions) {
      var r5 = N5(e10);
      r5 && (t5 = ci(`
# ${r5}`, t5));
    }
    return t5;
  }, O5 = (e10) => {
    var t5, r5;
    return typeof e10 == "string" ? (t5 = _5(e10), r5 = pi.get(t5) || k5(e10, { noLocation: !0 })) : (t5 = e10.__key || _5(e10), r5 = pi.get(t5) || e10), r5.loc || vi(r5), r5.__key = t5, pi.set(t5, r5), r5;
  }, mr = (e10, t5, r5) => {
    var n10 = t5 || {}, a2 = O5(e10), o10 = fi(n10, !0), i10 = a2.__key;
    return o10 !== "{}" && (i10 = ci(o10, i10)), { key: i10, query: a2, variables: n10, extensions: r5 };
  }, N5 = (e10) => {
    for (var t5 = 0, r5 = e10.definitions.length; t5 < r5; t5++) {
      var n10 = e10.definitions[t5];
      if (n10.kind === x5.OPERATION_DEFINITION) return n10.name ? n10.name.value : void 0;
    }
  }, K1 = (e10, t5, r5) => {
    if (!("data" in t5 || "errors" in t5 && Array.isArray(t5.errors))) throw new Error("No Content");
    var n10 = e10.kind === "subscription";
    return { operation: e10, data: t5.data, error: Array.isArray(t5.errors) ? new sa({ graphQLErrors: t5.errors, response: r5 }) : void 0, extensions: t5.extensions ? { ...t5.extensions } : void 0, hasNext: t5.hasNext == null ? n10 : t5.hasNext, stale: !1 };
  }, gi = (e10, t5) => {
    if (typeof e10 == "object" && e10 != null) {
      if (Array.isArray(e10)) {
        e10 = [...e10];
        for (var r5 = 0, n10 = t5.length; r5 < n10; r5++) e10[r5] = gi(e10[r5], t5[r5]);
        return e10;
      }
      if (!e10.constructor || e10.constructor === Object) {
        e10 = { ...e10 };
        for (var a2 in t5) e10[a2] = gi(e10[a2], t5[a2]);
        return e10;
      }
    }
    return t5;
  }, R5 = (e10, t5, r5, n10) => {
    var a2 = e10.error ? e10.error.graphQLErrors : [], o10 = !!e10.extensions || !!(t5.payload || t5).extensions, i10 = { ...e10.extensions, ...(t5.payload || t5).extensions }, l2 = t5.incremental;
    "path" in t5 && (l2 = [t5]);
    var d3 = { data: e10.data };
    if (l2) for (var u3 = function() {
      var f4 = l2[c10];
      Array.isArray(f4.errors) && a2.push(...f4.errors), f4.extensions && (Object.assign(i10, f4.extensions), o10 = !0);
      var m8 = "data", h2 = d3, g3 = [];
      if (f4.path) g3 = f4.path;
      else if (n10) {
        var w2 = n10.find((x2) => x2.id === f4.id);
        f4.subPath ? g3 = [...w2.path, ...f4.subPath] : g3 = w2.path;
      }
      for (var y10 = 0, v5 = g3.length; y10 < v5; m8 = g3[y10++]) h2 = h2[m8] = Array.isArray(h2[m8]) ? [...h2[m8]] : { ...h2[m8] };
      if (f4.items) for (var C3 = +m8 >= 0 ? m8 : 0, b8 = 0, I = f4.items.length; b8 < I; b8++) h2[C3 + b8] = gi(h2[C3 + b8], f4.items[b8]);
      else f4.data !== void 0 && (h2[m8] = gi(h2[m8], f4.data));
    }, c10 = 0, p5 = l2.length; c10 < p5; c10++) u3();
    else d3.data = (t5.payload || t5).data || e10.data, a2 = t5.errors || t5.payload && t5.payload.errors || a2;
    return { operation: e10.operation, data: d3.data, error: a2.length ? new sa({ graphQLErrors: a2, response: r5 }) : void 0, extensions: o10 ? i10 : void 0, hasNext: t5.hasNext != null ? t5.hasNext : e10.hasNext, stale: !1 };
  }, yi = (e10, t5, r5) => ({ operation: e10, data: void 0, error: new sa({ networkError: t5, response: r5 }), extensions: void 0, hasNext: !1, stale: !1 });
  function H52(e10) {
    var t5 = { query: void 0, documentId: void 0, operationName: N5(e10.query), variables: e10.variables || void 0, extensions: e10.extensions };
    return "documentId" in e10.query && e10.query.documentId && (!e10.query.definitions || !e10.query.definitions.length) ? t5.documentId = e10.query.documentId : (!e10.extensions || !e10.extensions.persistedQuery || e10.extensions.persistedQuery.miss) && (t5.query = vi(e10.query)), t5;
  }
  var D5 = (e10, t5) => {
    var r5 = e10.kind === "query" && e10.context.preferGetMethod;
    if (!r5 || !t5) return e10.context.url;
    var n10 = bm(e10.context.url);
    for (var a2 in t5) {
      var o10 = t5[a2];
      o10 && n10[1].set(a2, typeof o10 == "object" ? fi(o10) : o10);
    }
    var i10 = n10.join("?");
    return i10.length > 2047 && r5 !== "force" ? (e10.context.preferGetMethod = !1, e10.context.url) : i10;
  }, bm = (e10) => {
    var t5 = e10.indexOf("?");
    return t5 > -1 ? [e10.slice(0, t5), new URLSearchParams(e10.slice(t5 + 1))] : [e10, new URLSearchParams()];
  }, Sm = (e10, t5) => {
    if (t5 && !(e10.kind === "query" && e10.context.preferGetMethod)) {
      var r5 = fi(t5), n10 = ((l2) => {
        var d3 = /* @__PURE__ */ new Map();
        return (mi !== Or || hi !== Or) && (rn.clear(), J1(d3, "variables", l2)), d3;
      })(t5.variables);
      if (n10.size) {
        var a2 = new FormData();
        a2.append("operations", r5), a2.append("map", fi({ ...[...n10.keys()].map((l2) => [l2]) }));
        var o10 = 0;
        for (var i10 of n10.values()) a2.append("" + o10++, i10);
        return a2;
      }
      return r5;
    }
  }, V5 = (e10, t5) => {
    var r5 = { accept: e10.kind === "subscription" ? "text/event-stream, multipart/mixed" : "application/graphql-response+json, application/graphql+json, application/json, text/event-stream, multipart/mixed" }, n10 = (typeof e10.context.fetchOptions == "function" ? e10.context.fetchOptions() : e10.context.fetchOptions) || {};
    if (n10.headers) if (((i10) => "has" in i10 && !Object.keys(i10).length)(n10.headers)) n10.headers.forEach((i10, l2) => {
      r5[l2] = i10;
    });
    else if (Array.isArray(n10.headers)) n10.headers.forEach((i10, l2) => {
      Array.isArray(i10) ? r5[i10[0]] ? r5[i10[0]] = `${r5[i10[0]]},${i10[1]}` : r5[i10[0]] = i10[1] : r5[l2] = i10;
    });
    else for (var a2 in n10.headers) r5[a2.toLowerCase()] = n10.headers[a2];
    var o10 = Sm(e10, t5);
    return typeof o10 == "string" && !r5["content-type"] && (r5["content-type"] = "application/json"), { ...n10, method: o10 ? "POST" : "GET", body: o10, headers: r5 };
  }, xm = /boundary="?([^=";]+)"?/i, Cm = /data: ?([^\n]+)/;
  async function* F5(e10) {
    if (e10.body[Symbol.asyncIterator]) for await (var t5 of e10.body) yield t5;
    else {
      var r5 = e10.body.getReader(), n10;
      try {
        for (; !(n10 = await r5.read()).done; ) yield n10.value;
      } finally {
        r5.cancel();
      }
    }
  }
  async function* P5(e10, t5) {
    var r5 = typeof TextDecoder < "u" ? new TextDecoder() : null, n10 = "", a2;
    for await (var o10 of e10) for (n10 += o10.constructor.name === "Buffer" ? o10.toString() : r5.decode(o10, { stream: !0 }); (a2 = n10.indexOf(t5)) > -1; ) yield n10.slice(0, a2), n10 = n10.slice(a2 + t5.length);
  }
  async function* km(e10, t5, r5) {
    var n10 = !0, a2 = null, o10;
    try {
      yield await Promise.resolve();
      var i10 = (o10 = await (e10.context.fetch || fetch)(t5, r5)).headers.get("Content-Type") || "", l2;
      /multipart\/mixed/i.test(i10) ? l2 = (async function* (p5, f4) {
        var m8 = p5.match(xm), h2 = "--" + (m8 ? m8[1] : "-"), g3 = !0, w2;
        for await (var y10 of P5(F5(f4), `\r
` + h2)) {
          if (g3) {
            g3 = !1;
            var v5 = y10.indexOf(h2);
            if (v5 > -1) y10 = y10.slice(v5 + h2.length);
            else continue;
          }
          try {
            yield w2 = JSON.parse(y10.slice(y10.indexOf(`\r
\r
`) + 4));
          } catch (C3) {
            if (!w2) throw C3;
          }
          if (w2 && w2.hasNext === !1) break;
        }
        w2 && w2.hasNext !== !1 && (yield { hasNext: !1 });
      })(i10, o10) : /text\/event-stream/i.test(i10) ? l2 = (async function* (p5) {
        var f4;
        for await (var m8 of P5(F5(p5), `

`)) {
          var h2 = m8.match(Cm);
          if (h2) {
            var g3 = h2[1];
            try {
              yield f4 = JSON.parse(g3);
            } catch (w2) {
              if (!f4) throw w2;
            }
            if (f4 && f4.hasNext === !1) break;
          }
        }
        f4 && f4.hasNext !== !1 && (yield { hasNext: !1 });
      })(o10) : /text\//i.test(i10) ? l2 = (async function* (p5) {
        var f4 = await p5.text();
        try {
          var m8 = JSON.parse(f4);
          yield m8;
        } catch {
          throw new Error(f4);
        }
      })(o10) : l2 = (async function* (p5) {
        yield JSON.parse(await p5.text());
      })(o10);
      var d3;
      for await (var u3 of l2) u3.pending && !a2 ? d3 = u3.pending : u3.pending && (d3 = [...d3, ...u3.pending]), a2 = a2 ? R5(a2, u3, o10, d3) : K1(e10, u3, o10), n10 = !1, yield a2, n10 = !0;
      a2 || (yield a2 = K1(e10, {}, o10));
    } catch (c10) {
      if (!n10) throw c10;
      yield yi(e10, o10 && (o10.status < 200 || o10.status >= 300) && o10.statusText ? new Error(o10.statusText) : c10, o10);
    }
  }
  function z5(e10, t5, r5) {
    var n10;
    return typeof AbortController < "u" && (r5.signal = (n10 = new AbortController()).signal), ra(() => {
      n10 && n10.abort();
    })(Ve((a2) => !!a2)(G1(km(e10, t5, r5))));
  }
  function Z5(e10) {
    var t5 = (r5) => e10(r5);
    return t5.toPromise = () => oa(tn(1)(Ve((r5) => !r5.stale && !r5.hasNext)(t5))), t5.then = (r5, n10) => t5.toPromise().then(r5, n10), t5.subscribe = (r5) => Pr(r5)(t5), t5;
  }
  function Ka(e10, t5, r5) {
    return { ...t5, kind: e10, context: t5.context ? { ...t5.context, ...r5 } : r5 || t5.context };
  }
  var Im = () => {
  }, j5 = ({ forward: e10, dispatchDebug: t5 }) => (r5) => {
    var n10 = Qa((o10) => {
      var i10 = H52(o10), l2 = D5(o10, i10), d3 = V5(o10, i10), u3 = q1(Ve((c10) => c10.kind === "teardown" && c10.key === o10.key)(r5))(z5(o10, l2, d3));
      return u3;
    })(Ve((o10) => o10.kind !== "teardown" && (o10.kind !== "subscription" || !!o10.context.fetchSubscriptions))(r5)), a2 = e10(Ve((o10) => o10.kind === "teardown" || o10.kind === "subscription" && !o10.context.fetchSubscriptions)(r5));
    return Xr([n10, a2]);
  }, Em = (e10) => ({ client: t5, forward: r5, dispatchDebug: n10 }) => e10.reduceRight((a2, o10) => o10({ client: t5, forward(l2) {
    return na(a2(na(l2)));
  }, dispatchDebug(l2) {
  } }), r5), U5 = ({ onOperation: e10, onResult: t5, onError: r5 }) => ({ forward: n10 }) => (a2) => Qa((o10) => {
    r5 && o10.error && r5(o10.error, o10.operation);
    var i10 = t5 && t5(o10) || o10;
    return "then" in i10 ? Y1(i10) : aa(i10);
  })(n10(Qa((o10) => {
    var i10 = e10 && e10(o10) || o10;
    return "then" in i10 ? Y1(i10) : aa(i10);
  })(a2))), Tm = ({ dispatchDebug: e10 }) => (t5) => Ve((r5) => !1)(t5), $5 = function e2(t5) {
    var r5 = 0, n10 = /* @__PURE__ */ new Map(), a2 = /* @__PURE__ */ new Map(), o10 = /* @__PURE__ */ new Set(), i10 = [], l2 = { url: t5.url, fetchSubscriptions: t5.fetchSubscriptions, fetchOptions: t5.fetchOptions, fetch: t5.fetch, preferGetMethod: t5.preferGetMethod, requestPolicy: t5.requestPolicy || "cache-first" }, d3 = Ja();
    function u3(b8) {
      (b8.kind === "mutation" || b8.kind === "teardown" || !o10.has(b8.key)) && (b8.kind === "teardown" ? o10.delete(b8.key) : b8.kind !== "mutation" && o10.add(b8.key), d3.next(b8));
    }
    var c10 = !1;
    function p5(b8) {
      if (b8 && u3(b8), !c10) {
        for (c10 = !0; c10 && (b8 = i10.shift()); ) u3(b8);
        c10 = !1;
      }
    }
    var f4 = (b8) => {
      var I = q1(Ve((x2) => x2.kind === "teardown" && x2.key === b8.key)(d3.source))(Ve((x2) => x2.operation.kind === b8.kind && x2.operation.key === b8.key && (!x2.operation.context._instance || x2.operation.context._instance === b8.context._instance))(C3));
      return b8.kind !== "query" ? I = ui((x2) => !!x2.hasNext, !0)(I) : I = W1((x2) => {
        var D = aa(x2);
        return x2.stale || x2.hasNext ? D : Xr([D, di(() => (x2.stale = !0, x2))(tn(1)(Ve((le) => le.key === b8.key)(d3.source)))]);
      })(I), b8.kind !== "mutation" ? I = ra(() => {
        o10.delete(b8.key), n10.delete(b8.key), a2.delete(b8.key), c10 = !1;
        for (var x2 = i10.length - 1; x2 >= 0; x2--) i10[x2].key === b8.key && i10.splice(x2, 1);
        u3(Ka("teardown", b8, b8.context));
      })(en((x2) => {
        if (x2.stale) if (!x2.hasNext) o10.delete(b8.key);
        else for (var D = 0; D < i10.length; D++) {
          var le = i10[D];
          if (le.key === x2.operation.key) {
            o10.delete(le.key);
            break;
          }
        }
        else x2.hasNext || o10.delete(b8.key);
        n10.set(b8.key, x2);
      })(I)) : I = Ya(() => {
        u3(b8);
      })(I), na(I);
    }, m8 = this instanceof e2 ? this : Object.create(e2.prototype), h2 = Object.assign(m8, { suspense: !!t5.suspense, operations$: d3.source, reexecuteOperation(b8) {
      if (b8.kind === "teardown") p5(b8);
      else if (b8.kind === "mutation") i10.push(b8), Promise.resolve().then(p5);
      else if (a2.has(b8.key)) {
        for (var I = !1, x2 = 0; x2 < i10.length; x2++) i10[x2].key === b8.key && (i10[x2] = b8, I = !0);
        I || o10.has(b8.key) && b8.context.requestPolicy !== "network-only" ? (o10.delete(b8.key), Promise.resolve().then(p5)) : (i10.push(b8), Promise.resolve().then(p5));
      }
    }, createRequestOperation(b8, I, x2) {
      return x2 || (x2 = {}), Ka(b8, I, { _instance: b8 === "mutation" ? r5 = r5 + 1 | 0 : void 0, ...l2, ...x2, requestPolicy: x2.requestPolicy || l2.requestPolicy, suspense: x2.suspense || x2.suspense !== !1 && h2.suspense });
    }, executeRequestOperation(b8) {
      return b8.kind === "mutation" ? Z5(f4(b8)) : Z5(T5(() => {
        var I = a2.get(b8.key);
        I || a2.set(b8.key, I = f4(b8)), I = Ya(() => {
          p5(b8);
        })(I);
        var x2 = n10.get(b8.key);
        return b8.kind === "query" && x2 && (x2.stale || x2.hasNext) ? W1(aa)(Xr([I, Ve((D) => D === n10.get(b8.key))(aa(x2))])) : I;
      }));
    }, executeQuery(b8, I) {
      var x2 = h2.createRequestOperation("query", b8, I);
      return h2.executeRequestOperation(x2);
    }, executeSubscription(b8, I) {
      var x2 = h2.createRequestOperation("subscription", b8, I);
      return h2.executeRequestOperation(x2);
    }, executeMutation(b8, I) {
      var x2 = h2.createRequestOperation("mutation", b8, I);
      return h2.executeRequestOperation(x2);
    }, readQuery(b8, I, x2) {
      var D = null;
      return Pr((le) => {
        D = le;
      })(h2.query(b8, I, x2)).unsubscribe(), D;
    }, query: (b8, I, x2) => h2.executeQuery(mr(b8, I), x2), subscription: (b8, I, x2) => h2.executeSubscription(mr(b8, I), x2), mutation: (b8, I, x2) => h2.executeMutation(mr(b8, I), x2) }), g3 = Im, v5 = Em(t5.exchanges), C3 = na(v5({ client: h2, dispatchDebug: g3, forward: Tm({ dispatchDebug: g3 }) })(d3.source));
    return M5(C3), h2;
  }, W5 = {}, bi = createContext(W5), q5 = bi.Provider;
  bi.Consumer;
  bi.displayName = "UrqlContext";
  var Si = () => {
    var e10 = useContext(bi);
    return e10;
  }, e0 = { fetching: !1, stale: !1, hasNext: !1, error: void 0, data: void 0, extensions: void 0, operation: void 0 }, Mm = (e10, t5) => e10 === t5 || !(!e10 || !t5 || e10.key !== t5.key), X1 = (e10, t5) => {
    var r5 = { ...e10, ...t5, data: t5.data !== void 0 || t5.error ? t5.data : e10.data, fetching: !!t5.fetching, stale: !!t5.stale };
    return ((n10, a2) => {
      for (var o10 in n10) if (!(o10 in a2)) return !0;
      for (var i10 in a2) if (i10 === "operation" ? !Mm(n10[i10], a2[i10]) : n10[i10] !== a2[i10]) return !0;
      return !1;
    })(e10, r5) ? r5 : e10;
  }, Lm = (e10, t5) => {
    for (var r5 = 0, n10 = t5.length; r5 < n10; r5++) if (e10[r5] !== t5[r5]) return !0;
    return !1;
  };
  function wi(e10, t5) {
    e10(t5);
  }
  function t0(e10) {
    var t5 = useRef(!0), r5 = Si(), [n10, a2] = useState(e0), o10 = useCallback((i10, l2) => (wi(a2, { ...e0, fetching: !0 }), oa(tn(1)(Ve((d3) => !d3.hasNext)(en((d3) => {
      t5.current && wi(a2, { fetching: !1, stale: d3.stale, data: d3.data, error: d3.error, extensions: d3.extensions, operation: d3.operation, hasNext: d3.hasNext });
    })(r5.executeMutation(mr(e10, i10), l2 || {})))))), [r5, e10, a2]);
    return useEffect(() => (t5.current = !0, () => {
      t5.current = !1;
    }), []), [n10, o10];
  }
  function Am(e10, t5) {
    var r5 = useRef(void 0);
    return useMemo(() => {
      var n10 = mr(e10, t5);
      return r5.current !== void 0 && r5.current.key === n10.key ? r5.current : (r5.current = n10, n10);
    }, [e10, t5]);
  }
  var Bm = (e10) => {
    if (!e10._react) {
      var t5 = /* @__PURE__ */ new Set(), r5 = /* @__PURE__ */ new Map();
      e10.operations$ && Pr((n10) => {
        n10.kind === "teardown" && t5.has(n10.key) && (t5.delete(n10.key), r5.delete(n10.key));
      })(e10.operations$), e10._react = { get: (n10) => r5.get(n10), set(n10, a2) {
        t5.delete(n10), r5.set(n10, a2);
      }, dispose(n10) {
        t5.add(n10);
      } };
    }
    return e10._react;
  }, _m = (e10, t5) => t5 && t5.suspense !== void 0 ? !!t5.suspense : e10.suspense;
  function la(e10) {
    var t5 = Si(), r5 = Bm(t5), n10 = _m(t5, e10.context), a2 = Am(e10.query, e10.variables), o10 = useMemo(() => {
      if (e10.pause) return null;
      var f4 = t5.executeQuery(a2, { requestPolicy: e10.requestPolicy, ...e10.context });
      return n10 ? en((m8) => {
        r5.set(a2.key, m8);
      })(f4) : f4;
    }, [r5, t5, a2, n10, e10.pause, e10.requestPolicy, e10.context]), i10 = useCallback((f4, m8) => {
      if (!f4) return { fetching: !1 };
      var h2 = r5.get(a2.key);
      if (h2) {
        if (m8 && h2 != null && "then" in h2) throw h2;
      } else {
        var g3, w2 = Pr((v5) => {
          h2 = v5, g3 && g3(h2);
        })(ui(() => m8 && !g3 || !h2 || "hasNext" in h2 && h2.hasNext)(f4));
        if (h2 == null && m8) {
          var y10 = new Promise((v5) => {
            g3 = v5;
          });
          throw r5.set(a2.key, y10), y10;
        } else w2.unsubscribe();
      }
      return h2 || { fetching: !0 };
    }, [r5, a2]), l2 = [t5, a2, e10.requestPolicy, e10.context, e10.pause], [d3, u3] = useState(() => [o10, X1(e0, i10(o10, n10)), l2]), c10 = d3[1];
    o10 !== d3[0] && Lm(d3[2], l2) && u3([o10, c10 = X1(d3[1], i10(o10, n10)), l2]), useEffect(() => {
      var f4 = d3[0], m8 = d3[2][1], h2 = !1, g3 = (y10) => {
        h2 = !0, wi(u3, (v5) => {
          var C3 = X1(v5[1], y10);
          return v5[1] !== C3 ? [v5[0], C3, v5[2]] : v5;
        });
      };
      if (f4) {
        var w2 = Pr(g3)(ra(() => {
          g3({ fetching: !1 });
        })(f4));
        return h2 || g3({ fetching: !0 }), () => {
          r5.dispose(m8.key), w2.unsubscribe();
        };
      } else g3({ fetching: !1 });
    }, [r5, d3[0], d3[2][1]]);
    var p5 = useCallback((f4) => {
      var m8 = { requestPolicy: e10.requestPolicy, ...e10.context, ...f4 };
      wi(u3, (h2) => [n10 ? en((g3) => {
        r5.set(a2.key, g3);
      })(t5.executeQuery(a2, m8)) : t5.executeQuery(a2, m8), h2[1], l2]);
    }, [t5, r5, a2, n10, e10.requestPolicy, e10.context, e10.pause]);
    return [c10, p5];
  }
  function Nr(e10, t5) {
    return t5;
  }
  var G5 = { kind: "Document", definitions: [{ kind: "FragmentDefinition", name: { kind: "Name", value: "StatusTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "story" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "storyId" } }] } }] } }] }, Q5 = { kind: "Document", definitions: [{ kind: "FragmentDefinition", name: { kind: "Name", value: "LastBuildOnBranchTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }] } }] }, Y5 = { kind: "Document", definitions: [{ kind: "FragmentDefinition", name: { kind: "Name", value: "LastBuildOnBranchBuildFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Build" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }, { kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "committedAt" } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StartedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", alias: { kind: "Name", value: "testsForStatus" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "IntValue", value: "1000" } }, { kind: "Argument", name: { kind: "Name", value: "statuses" }, value: { kind: "Variable", name: { kind: "Name", value: "testStatuses" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StatusTestFields" } }] } }] } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "LastBuildOnBranchTestFields" } }] } }] } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CompletedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", alias: { kind: "Name", value: "testsForStatus" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "IntValue", value: "1000" } }, { kind: "Argument", name: { kind: "Name", value: "statuses" }, value: { kind: "Variable", name: { kind: "Name", value: "testStatuses" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StatusTestFields" } }] } }] } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "LastBuildOnBranchTestFields" } }] } }] } }] } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "StatusTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "story" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "storyId" } }] } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "LastBuildOnBranchTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }] } }] }, J5 = { kind: "Document", definitions: [{ kind: "FragmentDefinition", name: { kind: "Name", value: "StoryTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "webUrl" } }, { kind: "Field", name: { kind: "Name", value: "comparisons" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "browser" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "key" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "version" } }] } }, { kind: "Field", name: { kind: "Name", value: "captureDiff" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "diffImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }] } }, { kind: "Field", name: { kind: "Name", value: "focusImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "headCapture" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "captureImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "backgroundColor" } }, { kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }, { kind: "Field", name: { kind: "Name", value: "imageHeight" } }, { kind: "Field", name: { kind: "Name", value: "thumbnailUrl" } }] } }, { kind: "Field", name: { kind: "Name", value: "captureError" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "kind" } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorInteractionFailure" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorJSError" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorFailedJS" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "baseCapture" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "captureImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }, { kind: "Field", name: { kind: "Name", value: "imageHeight" } }] } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "mode" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "globals" } }] } }, { kind: "Field", name: { kind: "Name", value: "story" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "storyId" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "component" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }] } }] } }] } }] }, K5 = { kind: "Document", definitions: [{ kind: "FragmentDefinition", name: { kind: "Name", value: "SelectedBuildFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Build" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }, { kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "number" } }, { kind: "Field", name: { kind: "Name", value: "branch" } }, { kind: "Field", name: { kind: "Name", value: "commit" } }, { kind: "Field", name: { kind: "Name", value: "committedAt" } }, { kind: "Field", name: { kind: "Name", value: "uncommittedHash" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StartedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "startedAt" } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StoryTestFields" } }] } }] } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CompletedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "startedAt" } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StoryTestFields" } }] } }] } }] } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "StoryTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "webUrl" } }, { kind: "Field", name: { kind: "Name", value: "comparisons" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "browser" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "key" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "version" } }] } }, { kind: "Field", name: { kind: "Name", value: "captureDiff" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "diffImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }] } }, { kind: "Field", name: { kind: "Name", value: "focusImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "headCapture" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "captureImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "backgroundColor" } }, { kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }, { kind: "Field", name: { kind: "Name", value: "imageHeight" } }, { kind: "Field", name: { kind: "Name", value: "thumbnailUrl" } }] } }, { kind: "Field", name: { kind: "Name", value: "captureError" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "kind" } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorInteractionFailure" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorJSError" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorFailedJS" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "baseCapture" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "captureImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }, { kind: "Field", name: { kind: "Name", value: "imageHeight" } }] } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "mode" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "globals" } }] } }, { kind: "Field", name: { kind: "Name", value: "story" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "storyId" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "component" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }] } }] } }] } }] }, X5 = { kind: "Document", definitions: [{ kind: "OperationDefinition", operation: "query", name: { kind: "Name", value: "VisualTestsProjectCountQuery" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "viewer" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "projectCount" } }, { kind: "Field", name: { kind: "Name", value: "accounts" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "newProjectUrl" } }] } }] } }] } }] }, ed = { kind: "Document", definitions: [{ kind: "OperationDefinition", operation: "query", name: { kind: "Name", value: "SelectProjectsQuery" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "viewer" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "accounts" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "avatarUrl" } }, { kind: "Field", name: { kind: "Name", value: "newProjectUrl" } }, { kind: "Field", name: { kind: "Name", value: "projects" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "webUrl" } }, { kind: "Field", name: { kind: "Name", value: "lastBuild" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "branch" } }, { kind: "Field", name: { kind: "Name", value: "number" } }] } }] } }] } }] } }] } }] }, td = { kind: "Document", definitions: [{ kind: "OperationDefinition", operation: "query", name: { kind: "Name", value: "ProjectQuery" }, variableDefinitions: [{ kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "projectId" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "project" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "id" }, value: { kind: "Variable", name: { kind: "Name", value: "projectId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "webUrl" } }, { kind: "Field", name: { kind: "Name", value: "lastBuild" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "branch" } }, { kind: "Field", name: { kind: "Name", value: "number" } }] } }] } }] } }] }, rd = { kind: "Document", definitions: [{ kind: "OperationDefinition", operation: "mutation", name: { kind: "Name", value: "UpdateUserPreferences" }, variableDefinitions: [{ kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "input" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "UserPreferencesInput" } } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "updateUserPreferences" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "input" }, value: { kind: "Variable", name: { kind: "Name", value: "input" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "updatedPreferences" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "vtaOnboarding" } }] } }] } }] } }] }, nd = { kind: "Document", definitions: [{ kind: "OperationDefinition", operation: "query", name: { kind: "Name", value: "AddonVisualTestsBuild" }, variableDefinitions: [{ kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "projectId" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } } }, { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "branch" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } } }, { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "gitUserEmailHash" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } } }, { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "repositoryOwnerName" } }, type: { kind: "NamedType", name: { kind: "Name", value: "String" } } }, { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "storyId" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } } }, { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "testStatuses" } }, type: { kind: "NonNullType", type: { kind: "ListType", type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "TestStatus" } } } } } }, { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "selectedBuildId" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } } }, { kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "hasSelectedBuildId" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "project" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "id" }, value: { kind: "Variable", name: { kind: "Name", value: "projectId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "manageUrl" } }, { kind: "Field", name: { kind: "Name", value: "account" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "billingUrl" } }, { kind: "Field", name: { kind: "Name", value: "suspensionReason" } }] } }, { kind: "Field", name: { kind: "Name", value: "features" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "uiTests" } }] } }, { kind: "Field", alias: { kind: "Name", value: "lastBuildOnBranch" }, name: { kind: "Name", value: "lastBuild" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "branches" }, value: { kind: "ListValue", values: [{ kind: "Variable", name: { kind: "Name", value: "branch" } }] } }, { kind: "Argument", name: { kind: "Name", value: "repositoryOwnerName" }, value: { kind: "Variable", name: { kind: "Name", value: "repositoryOwnerName" } } }, { kind: "Argument", name: { kind: "Name", value: "localBuilds" }, value: { kind: "ObjectValue", fields: [{ kind: "ObjectField", name: { kind: "Name", value: "localBuildEmailHash" }, value: { kind: "Variable", name: { kind: "Name", value: "gitUserEmailHash" } } }] } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "LastBuildOnBranchBuildFields" } }, { kind: "FragmentSpread", name: { kind: "Name", value: "SelectedBuildFields" }, directives: [{ kind: "Directive", name: { kind: "Name", value: "skip" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "if" }, value: { kind: "Variable", name: { kind: "Name", value: "hasSelectedBuildId" } } }] }] }] } }, { kind: "Field", name: { kind: "Name", value: "lastBuild" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "slug" } }, { kind: "Field", name: { kind: "Name", value: "branch" } }] } }] } }, { kind: "Field", alias: { kind: "Name", value: "selectedBuild" }, name: { kind: "Name", value: "build" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "id" }, value: { kind: "Variable", name: { kind: "Name", value: "selectedBuildId" } } }], directives: [{ kind: "Directive", name: { kind: "Name", value: "include" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "if" }, value: { kind: "Variable", name: { kind: "Name", value: "hasSelectedBuildId" } } }] }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SelectedBuildFields" } }] } }, { kind: "Field", name: { kind: "Name", value: "viewer" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "preferences" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "vtaOnboarding" } }] } }, { kind: "Field", name: { kind: "Name", value: "projectMembership" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "projectId" }, value: { kind: "Variable", name: { kind: "Name", value: "projectId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", alias: { kind: "Name", value: "userCanReview" }, name: { kind: "Name", value: "meetsAccessLevel" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "minimumAccessLevel" }, value: { kind: "EnumValue", value: "REVIEWER" } }] }] } }] } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "StatusTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "story" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "storyId" } }] } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "LastBuildOnBranchTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "StoryTestFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Test" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "webUrl" } }, { kind: "Field", name: { kind: "Name", value: "comparisons" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", name: { kind: "Name", value: "browser" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "key" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "version" } }] } }, { kind: "Field", name: { kind: "Name", value: "captureDiff" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "diffImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }] } }, { kind: "Field", name: { kind: "Name", value: "focusImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "headCapture" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "captureImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "backgroundColor" } }, { kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }, { kind: "Field", name: { kind: "Name", value: "imageHeight" } }, { kind: "Field", name: { kind: "Name", value: "thumbnailUrl" } }] } }, { kind: "Field", name: { kind: "Name", value: "captureError" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "kind" } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorInteractionFailure" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorJSError" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CaptureErrorFailedJS" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "error" } }] } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "baseCapture" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "captureImage" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "signed" }, value: { kind: "BooleanValue", value: !0 } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "imageUrl" } }, { kind: "Field", name: { kind: "Name", value: "imageWidth" } }, { kind: "Field", name: { kind: "Name", value: "imageHeight" } }] } }] } }] } }, { kind: "Field", name: { kind: "Name", value: "mode" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "globals" } }] } }, { kind: "Field", name: { kind: "Name", value: "story" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "storyId" } }, { kind: "Field", name: { kind: "Name", value: "name" } }, { kind: "Field", name: { kind: "Name", value: "component" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }] } }] } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "LastBuildOnBranchBuildFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Build" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }, { kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "Field", name: { kind: "Name", value: "committedAt" } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StartedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", alias: { kind: "Name", value: "testsForStatus" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "IntValue", value: "1000" } }, { kind: "Argument", name: { kind: "Name", value: "statuses" }, value: { kind: "Variable", name: { kind: "Name", value: "testStatuses" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StatusTestFields" } }] } }] } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "LastBuildOnBranchTestFields" } }] } }] } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CompletedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "result" } }, { kind: "Field", alias: { kind: "Name", value: "testsForStatus" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "IntValue", value: "1000" } }, { kind: "Argument", name: { kind: "Name", value: "statuses" }, value: { kind: "Variable", name: { kind: "Name", value: "testStatuses" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StatusTestFields" } }] } }] } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "LastBuildOnBranchTestFields" } }] } }] } }] } }] } }, { kind: "FragmentDefinition", name: { kind: "Name", value: "SelectedBuildFields" }, typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Build" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }, { kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "number" } }, { kind: "Field", name: { kind: "Name", value: "branch" } }, { kind: "Field", name: { kind: "Name", value: "commit" } }, { kind: "Field", name: { kind: "Name", value: "committedAt" } }, { kind: "Field", name: { kind: "Name", value: "uncommittedHash" } }, { kind: "Field", name: { kind: "Name", value: "status" } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "StartedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "startedAt" } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StoryTestFields" } }] } }] } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "CompletedBuild" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "startedAt" } }, { kind: "Field", alias: { kind: "Name", value: "testsForStory" }, name: { kind: "Name", value: "tests" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "storyId" }, value: { kind: "Variable", name: { kind: "Name", value: "storyId" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "nodes" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "StoryTestFields" } }] } }] } }] } }] } }] }, ad = { kind: "Document", definitions: [{ kind: "OperationDefinition", operation: "mutation", name: { kind: "Name", value: "ReviewTest" }, variableDefinitions: [{ kind: "VariableDefinition", variable: { kind: "Variable", name: { kind: "Name", value: "input" } }, type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ReviewTestInput" } } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "reviewTest" }, arguments: [{ kind: "Argument", name: { kind: "Name", value: "input" }, value: { kind: "Variable", name: { kind: "Name", value: "input" } } }], selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "updatedTests" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }, { kind: "Field", name: { kind: "Name", value: "status" } }] } }, { kind: "Field", name: { kind: "Name", value: "userErrors" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserError" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "__typename" } }, { kind: "Field", name: { kind: "Name", value: "message" } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "BuildSupersededError" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "build" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }] } }] } }, { kind: "InlineFragment", typeCondition: { kind: "NamedType", name: { kind: "Name", value: "TestUnreviewableError" } }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "test" }, selectionSet: { kind: "SelectionSet", selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }] } }] } }] } }] } }] } }] }, Pm = { "\n  query VisualTestsProjectCountQuery {\n    viewer {\n      projectCount\n      accounts {\n        newProjectUrl\n      }\n    }\n  }\n": X5, "\n  query SelectProjectsQuery {\n    viewer {\n      accounts {\n        id\n        name\n        avatarUrl\n        newProjectUrl\n        projects {\n          id\n          name\n          webUrl\n          lastBuild {\n            branch\n            number\n          }\n        }\n      }\n    }\n  }\n": ed, "\n  query ProjectQuery($projectId: ID!) {\n    project(id: $projectId) {\n      id\n      name\n      webUrl\n      lastBuild {\n        branch\n        number\n      }\n    }\n  }\n": td, "\n  mutation UpdateUserPreferences($input: UserPreferencesInput!) {\n    updateUserPreferences(input: $input) {\n      updatedPreferences {\n        vtaOnboarding\n      }\n    }\n  }\n": rd, "\n  query AddonVisualTestsBuild(\n    $projectId: ID!\n    $branch: String!\n    $gitUserEmailHash: String!\n    $repositoryOwnerName: String\n    $storyId: String!\n    $testStatuses: [TestStatus!]!\n    $selectedBuildId: ID!\n    $hasSelectedBuildId: Boolean!\n  ) {\n    project(id: $projectId) {\n      name\n      manageUrl\n      account {\n        billingUrl\n        suspensionReason\n      }\n      features {\n        uiTests\n      }\n      lastBuildOnBranch: lastBuild(\n        branches: [$branch]\n        repositoryOwnerName: $repositoryOwnerName\n        localBuilds: { localBuildEmailHash: $gitUserEmailHash }\n      ) {\n        ...LastBuildOnBranchBuildFields\n        ...SelectedBuildFields @skip(if: $hasSelectedBuildId)\n      }\n      lastBuild {\n        id\n        slug\n        branch\n      }\n    }\n    selectedBuild: build(id: $selectedBuildId) @include(if: $hasSelectedBuildId) {\n      ...SelectedBuildFields\n    }\n    viewer {\n      preferences {\n        vtaOnboarding\n      }\n      projectMembership(projectId: $projectId) {\n        userCanReview: meetsAccessLevel(minimumAccessLevel: REVIEWER)\n      }\n    }\n  }\n": nd, "\n  fragment LastBuildOnBranchBuildFields on Build {\n    __typename\n    id\n    status\n    committedAt\n    ... on StartedBuild {\n      testsForStatus: tests(first: 1000, statuses: $testStatuses) {\n        nodes {\n          ...StatusTestFields\n        }\n      }\n      testsForStory: tests(storyId: $storyId) {\n        nodes {\n          ...LastBuildOnBranchTestFields\n        }\n      }\n    }\n    ... on CompletedBuild {\n      result\n      testsForStatus: tests(first: 1000, statuses: $testStatuses) {\n        nodes {\n          ...StatusTestFields\n        }\n      }\n      testsForStory: tests(storyId: $storyId) {\n        nodes {\n          ...LastBuildOnBranchTestFields\n        }\n      }\n    }\n  }\n": Y5, "\n  fragment SelectedBuildFields on Build {\n    __typename\n    id\n    number\n    branch\n    commit\n    committedAt\n    uncommittedHash\n    status\n    ... on StartedBuild {\n      startedAt\n      testsForStory: tests(storyId: $storyId) {\n        nodes {\n          ...StoryTestFields\n        }\n      }\n    }\n    ... on CompletedBuild {\n      startedAt\n      testsForStory: tests(storyId: $storyId) {\n        nodes {\n          ...StoryTestFields\n        }\n      }\n    }\n  }\n": K5, "\n  fragment StatusTestFields on Test {\n    id\n    status\n    result\n    story {\n      storyId\n    }\n  }\n": G5, "\n  fragment LastBuildOnBranchTestFields on Test {\n    status\n    result\n  }\n": Q5, "\n  fragment StoryTestFields on Test {\n    id\n    status\n    result\n    webUrl\n    comparisons {\n      id\n      result\n      browser {\n        id\n        key\n        name\n        version\n      }\n      captureDiff {\n        diffImage(signed: true) {\n          imageUrl\n          imageWidth\n        }\n        focusImage(signed: true) {\n          imageUrl\n          imageWidth\n        }\n      }\n      headCapture {\n        captureImage(signed: true) {\n          backgroundColor\n          imageUrl\n          imageWidth\n          imageHeight\n          thumbnailUrl\n        }\n        captureError {\n          kind\n          ... on CaptureErrorInteractionFailure {\n            error\n          }\n          ... on CaptureErrorJSError {\n            error\n          }\n          ... on CaptureErrorFailedJS {\n            error\n          }\n        }\n      }\n      baseCapture {\n        captureImage(signed: true) {\n          imageUrl\n          imageWidth\n          imageHeight\n        }\n      }\n    }\n    mode {\n      name\n      globals\n    }\n    story {\n      storyId\n      name\n      component {\n        name\n      }\n    }\n  }\n": J5, "\n  mutation ReviewTest($input: ReviewTestInput!) {\n    reviewTest(input: $input) {\n      updatedTests {\n        id\n        status\n      }\n      userErrors {\n        ... on UserError {\n          __typename\n          message\n        }\n        ... on BuildSupersededError {\n          build {\n            id\n          }\n        }\n        ... on TestUnreviewableError {\n          test {\n            id\n          }\n        }\n      }\n    }\n  }\n": ad };
  function Je(e10) {
    return Pm[e10] ?? {};
  }
  var r0 = (e10, t5) => Ka(e10.kind, e10, { ...e10.context, authAttempt: t5 });
  function od(e10) {
    return ({ client: t5, forward: r5 }) => {
      var n10 = /* @__PURE__ */ new Set(), a2 = Ja(), o10 = Ja(), i10 = /* @__PURE__ */ new Map();
      function l2() {
        u3 = void 0;
        var p5 = i10;
        i10 = /* @__PURE__ */ new Map(), p5.forEach(a2.next);
      }
      function d3(p5) {
        u3 = void 0;
        var f4 = i10;
        i10 = /* @__PURE__ */ new Map(), f4.forEach((m8) => {
          o10.next(yi(m8, p5));
        });
      }
      var u3, c10 = null;
      return (p5) => {
        function f4() {
          u3 = Promise.resolve().then(() => e10({ mutate(y10, v5, C3) {
            var b8 = t5.createRequestOperation("mutation", mr(y10, v5), C3);
            return oa(tn(1)(Ve((I) => I.operation.key === b8.key && b8.context._instance === I.operation.context._instance)(Ya(() => {
              var I = h2(b8);
              n10.add(I.context._instance), a2.next(I);
            })(w2))));
          }, appendHeaders(y10, v5) {
            var C3 = typeof y10.context.fetchOptions == "function" ? y10.context.fetchOptions() : y10.context.fetchOptions || {};
            return Ka(y10.kind, y10, { ...y10.context, fetchOptions: { ...C3, headers: { ...C3.headers, ...v5 } } });
          } })).then((y10) => {
            y10 && (c10 = y10), l2();
          }).catch((y10) => {
            d3(y10);
          });
        }
        f4();
        function m8(y10) {
          i10.set(y10.key, r0(y10, !0)), c10 && !u3 && (u3 = c10.refreshAuth().then(l2).catch(d3));
        }
        function h2(y10) {
          return c10 ? c10.addAuthToOperation(y10) : y10;
        }
        var g3 = Ve(Boolean)(di((y10) => y10.kind === "teardown" ? (i10.delete(y10.key), y10) : y10.context._instance && n10.has(y10.context._instance) ? y10 : y10.context.authAttempt ? h2(y10) : u3 || !c10 ? (u3 || f4(), i10.has(y10.key) || i10.set(y10.key, r0(y10, !1)), null) : (function(C3) {
          return !C3.context.authAttempt && c10 && c10.willAuthError && c10.willAuthError(C3);
        })(y10) ? (m8(y10), null) : h2(r0(y10, !1)))(Xr([a2.source, p5]))), w2 = r5(g3);
        return Xr([o10.source, Ve((y10) => !n10.has(y10.operation.context._instance) && y10.error && (function(C3) {
          return c10 && c10.didAuthError && c10.didAuthError(C3.error, C3.operation);
        })(y10) && !y10.operation.context.authAttempt ? (m8(y10.operation), !1) : (n10.has(y10.operation.context._instance) && n10.delete(y10.operation.context._instance), !0))(w2)]);
      };
    };
  }
  var We = [];
  for (let e10 = 0; e10 < 256; ++e10) We.push((e10 + 256).toString(16).slice(1));
  function id(e10, t5 = 0) {
    return (We[e10[t5 + 0]] + We[e10[t5 + 1]] + We[e10[t5 + 2]] + We[e10[t5 + 3]] + "-" + We[e10[t5 + 4]] + We[e10[t5 + 5]] + "-" + We[e10[t5 + 6]] + We[e10[t5 + 7]] + "-" + We[e10[t5 + 8]] + We[e10[t5 + 9]] + "-" + We[e10[t5 + 10]] + We[e10[t5 + 11]] + We[e10[t5 + 12]] + We[e10[t5 + 13]] + We[e10[t5 + 14]] + We[e10[t5 + 15]]).toLowerCase();
  }
  var n0, Om = new Uint8Array(16);
  function a0() {
    if (!n0) {
      if (typeof crypto > "u" || !crypto.getRandomValues) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      n0 = crypto.getRandomValues.bind(crypto);
    }
    return n0(Om);
  }
  var Nm = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), o0 = { randomUUID: Nm };
  function Rm(e10, t5, r5) {
    if (o0.randomUUID && !t5 && !e10) return o0.randomUUID();
    e10 = e10 || {};
    let n10 = e10.random ?? e10.rng?.() ?? a0();
    if (n10.length < 16) throw new Error("Random bytes length must be >= 16");
    if (n10[6] = n10[6] & 15 | 64, n10[8] = n10[8] & 63 | 128, t5) {
      if (r5 = r5 || 0, r5 < 0 || r5 + 16 > t5.length) throw new RangeError(`UUID byte range ${r5}:${r5 + 15} is out of buffer bounds`);
      for (let a2 = 0; a2 < 16; ++a2) t5[r5 + a2] = n10[a2];
      return t5;
    }
    return id(n10);
  }
  var i0 = Rm, tr, Xa, xi = (e10) => {
    try {
      let { exp: t5 } = e10 ? JSON.parse(atob(e10.split(".")[1])) : { exp: null };
      tr = e10, Xa = t5;
    } catch {
      tr = null, Xa = null;
    }
    tr ? localStorage.setItem(Yo, tr) : localStorage.removeItem(Yo);
  };
  xi(localStorage.getItem(Yo));
  var Ci = () => {
    let [{ token: e10 }, t5] = useAddonState(`${z}/accessToken`, { token: tr }), r5 = react_default.useCallback((n10) => {
      xi(n10), t5({ token: tr });
    }, [t5]);
    return [e10, r5];
  }, Dm = i0(), s0 = (e10) => ({ headers: { Accept: "*/*", ...e10 && { Authorization: `Bearer ${e10}` }, "X-Chromatic-Session-ID": Dm } }), l0 = (e10) => new $5({ url: Ll, exchanges: [U5({ onResult(t5) {
    t5.data?.viewer === null && xi(null);
  } }), od(async (t5) => ({ addAuthToOperation(r5) {
    return tr ? t5.appendHeaders(r5, { Authorization: `Bearer ${tr}` }) : r5;
  }, didAuthError: (r5) => r5.response?.status === 401 || r5.graphQLErrors.some((n10) => n10.message.includes("Must login")), async refreshAuth() {
    xi(null);
  }, willAuthError() {
    if (!tr) return !0;
    try {
      if (!Xa) {
        let { exp: r5 } = JSON.parse(atob(tr.split(".")[1]));
        Xa = r5;
      }
      return Date.now() / 1e3 > (Xa || 0);
    } catch {
      return !0;
    }
  } })), j5], fetchOptions: s0(), ...e10 }), ld = ({ children: e10, value: t5 = l0() }) => react_default.createElement(q5, { value: t5 }, e10), Mt = {};
  wp(Mt, { BRAND: () => c7, DIRTY: () => nn, EMPTY_PATH: () => jm, INVALID: () => $, NEVER: () => Q7, OK: () => Xe, ParseStatus: () => Ne, Schema: () => te, ZodAny: () => Dr, ZodArray: () => yt, ZodBigInt: () => ar, ZodBoolean: () => an, ZodBranded: () => to, ZodCatch: () => hn, ZodDate: () => yr, ZodDefault: () => mn, ZodDiscriminatedUnion: () => ma, ZodEffects: () => Tt, ZodEnum: () => or, ZodError: () => Ke, ZodFirstPartyTypeKind: () => q, ZodFunction: () => Hr, ZodIntersection: () => dn, ZodIssueCode: () => k2, ZodLazy: () => cn, ZodLiteral: () => pn, ZodMap: () => ha, ZodNaN: () => ga, ZodNativeEnum: () => fn, ZodNever: () => Rt, ZodNull: () => sn, ZodNullable: () => ir, ZodNumber: () => nr, ZodObject: () => ke, ZodOptional: () => kt, ZodParsedType: () => B2, ZodPipeline: () => gn, ZodPromise: () => Vr, ZodReadonly: () => vn, ZodRecord: () => un, ZodSchema: () => te, ZodSet: () => wr, ZodString: () => vt, ZodSymbol: () => pa, ZodTransformer: () => Tt, ZodTuple: () => Et, ZodType: () => te, ZodUndefined: () => on, ZodUnion: () => ln, ZodUnknown: () => vr, ZodVoid: () => fa, addIssueToContext: () => M2, any: () => b7, array: () => k7, bigint: () => h7, boolean: () => wd, coerce: () => G7, custom: () => gd, date: () => g7, datetimeRegex: () => md, defaultErrorMap: () => hr, discriminatedUnion: () => M7, effect: () => V7, enum: () => R7, function: () => P7, getErrorMap: () => da, getParsedType: () => rr, instanceof: () => f7, intersection: () => L7, isAborted: () => ki, isAsync: () => ua, isDirty: () => Ii, isValid: () => Rr, late: () => p7, lazy: () => O7, literal: () => N7, makeIssue: () => eo, map: () => _7, nan: () => m7, nativeEnum: () => H7, never: () => x7, null: () => w7, nullable: () => Z7, number: () => yd, object: () => I7, objectUtil: () => d0, oboolean: () => q7, onumber: () => W7, optional: () => z7, ostring: () => $7, pipeline: () => U7, preprocess: () => j7, promise: () => D7, quotelessJson: () => Vm, record: () => B7, set: () => F7, setErrorMap: () => Zm, strictObject: () => E7, string: () => vd, symbol: () => v7, transformer: () => V7, tuple: () => A7, undefined: () => y7, union: () => T7, unknown: () => S7, util: () => oe, void: () => C7 });
  var oe;
  (function(e10) {
    e10.assertEqual = (a2) => {
    };
    function t5(a2) {
    }
    e10.assertIs = t5;
    function r5(a2) {
      throw new Error();
    }
    e10.assertNever = r5, e10.arrayToEnum = (a2) => {
      let o10 = {};
      for (let i10 of a2) o10[i10] = i10;
      return o10;
    }, e10.getValidEnumValues = (a2) => {
      let o10 = e10.objectKeys(a2).filter((l2) => typeof a2[a2[l2]] != "number"), i10 = {};
      for (let l2 of o10) i10[l2] = a2[l2];
      return e10.objectValues(i10);
    }, e10.objectValues = (a2) => e10.objectKeys(a2).map(function(o10) {
      return a2[o10];
    }), e10.objectKeys = typeof Object.keys == "function" ? (a2) => Object.keys(a2) : (a2) => {
      let o10 = [];
      for (let i10 in a2) Object.prototype.hasOwnProperty.call(a2, i10) && o10.push(i10);
      return o10;
    }, e10.find = (a2, o10) => {
      for (let i10 of a2) if (o10(i10)) return i10;
    }, e10.isInteger = typeof Number.isInteger == "function" ? (a2) => Number.isInteger(a2) : (a2) => typeof a2 == "number" && Number.isFinite(a2) && Math.floor(a2) === a2;
    function n10(a2, o10 = " | ") {
      return a2.map((i10) => typeof i10 == "string" ? `'${i10}'` : i10).join(o10);
    }
    e10.joinValues = n10, e10.jsonStringifyReplacer = (a2, o10) => typeof o10 == "bigint" ? o10.toString() : o10;
  })(oe || (oe = {}));
  var d0;
  (function(e10) {
    e10.mergeShapes = (t5, r5) => ({ ...t5, ...r5 });
  })(d0 || (d0 = {}));
  var B2 = oe.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]), rr = (e10) => {
    switch (typeof e10) {
      case "undefined":
        return B2.undefined;
      case "string":
        return B2.string;
      case "number":
        return Number.isNaN(e10) ? B2.nan : B2.number;
      case "boolean":
        return B2.boolean;
      case "function":
        return B2.function;
      case "bigint":
        return B2.bigint;
      case "symbol":
        return B2.symbol;
      case "object":
        return Array.isArray(e10) ? B2.array : e10 === null ? B2.null : e10.then && typeof e10.then == "function" && e10.catch && typeof e10.catch == "function" ? B2.promise : typeof Map < "u" && e10 instanceof Map ? B2.map : typeof Set < "u" && e10 instanceof Set ? B2.set : typeof Date < "u" && e10 instanceof Date ? B2.date : B2.object;
      default:
        return B2.unknown;
    }
  }, k2 = oe.arrayToEnum(["invalid_type", "invalid_literal", "custom", "invalid_union", "invalid_union_discriminator", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of", "not_finite"]), Vm = (e10) => JSON.stringify(e10, null, 2).replace(/"([^"]+)":/g, "$1:"), Ke = class extends Error {
    get errors() {
      return this.issues;
    }
    constructor(t5) {
      super(), this.issues = [], this.addIssue = (n10) => {
        this.issues = [...this.issues, n10];
      }, this.addIssues = (n10 = []) => {
        this.issues = [...this.issues, ...n10];
      };
      let r5 = new.target.prototype;
      Object.setPrototypeOf ? Object.setPrototypeOf(this, r5) : this.__proto__ = r5, this.name = "ZodError", this.issues = t5;
    }
    format(t5) {
      let r5 = t5 || function(o10) {
        return o10.message;
      }, n10 = { _errors: [] }, a2 = (o10) => {
        for (let i10 of o10.issues) if (i10.code === "invalid_union") i10.unionErrors.map(a2);
        else if (i10.code === "invalid_return_type") a2(i10.returnTypeError);
        else if (i10.code === "invalid_arguments") a2(i10.argumentsError);
        else if (i10.path.length === 0) n10._errors.push(r5(i10));
        else {
          let l2 = n10, d3 = 0;
          for (; d3 < i10.path.length; ) {
            let u3 = i10.path[d3];
            d3 === i10.path.length - 1 ? (l2[u3] = l2[u3] || { _errors: [] }, l2[u3]._errors.push(r5(i10))) : l2[u3] = l2[u3] || { _errors: [] }, l2 = l2[u3], d3++;
          }
        }
      };
      return a2(this), n10;
    }
    static assert(t5) {
      if (!(t5 instanceof Ke)) throw new Error(`Not a ZodError: ${t5}`);
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, oe.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(t5 = (r5) => r5.message) {
      let r5 = {}, n10 = [];
      for (let a2 of this.issues) if (a2.path.length > 0) {
        let o10 = a2.path[0];
        r5[o10] = r5[o10] || [], r5[o10].push(t5(a2));
      } else n10.push(t5(a2));
      return { formErrors: n10, fieldErrors: r5 };
    }
    get formErrors() {
      return this.flatten();
    }
  };
  Ke.create = (e10) => new Ke(e10);
  var zm = (e10, t5) => {
    let r5;
    switch (e10.code) {
      case k2.invalid_type:
        e10.received === B2.undefined ? r5 = "Required" : r5 = `Expected ${e10.expected}, received ${e10.received}`;
        break;
      case k2.invalid_literal:
        r5 = `Invalid literal value, expected ${JSON.stringify(e10.expected, oe.jsonStringifyReplacer)}`;
        break;
      case k2.unrecognized_keys:
        r5 = `Unrecognized key(s) in object: ${oe.joinValues(e10.keys, ", ")}`;
        break;
      case k2.invalid_union:
        r5 = "Invalid input";
        break;
      case k2.invalid_union_discriminator:
        r5 = `Invalid discriminator value. Expected ${oe.joinValues(e10.options)}`;
        break;
      case k2.invalid_enum_value:
        r5 = `Invalid enum value. Expected ${oe.joinValues(e10.options)}, received '${e10.received}'`;
        break;
      case k2.invalid_arguments:
        r5 = "Invalid function arguments";
        break;
      case k2.invalid_return_type:
        r5 = "Invalid function return type";
        break;
      case k2.invalid_date:
        r5 = "Invalid date";
        break;
      case k2.invalid_string:
        typeof e10.validation == "object" ? "includes" in e10.validation ? (r5 = `Invalid input: must include "${e10.validation.includes}"`, typeof e10.validation.position == "number" && (r5 = `${r5} at one or more positions greater than or equal to ${e10.validation.position}`)) : "startsWith" in e10.validation ? r5 = `Invalid input: must start with "${e10.validation.startsWith}"` : "endsWith" in e10.validation ? r5 = `Invalid input: must end with "${e10.validation.endsWith}"` : oe.assertNever(e10.validation) : e10.validation !== "regex" ? r5 = `Invalid ${e10.validation}` : r5 = "Invalid";
        break;
      case k2.too_small:
        e10.type === "array" ? r5 = `Array must contain ${e10.exact ? "exactly" : e10.inclusive ? "at least" : "more than"} ${e10.minimum} element(s)` : e10.type === "string" ? r5 = `String must contain ${e10.exact ? "exactly" : e10.inclusive ? "at least" : "over"} ${e10.minimum} character(s)` : e10.type === "number" ? r5 = `Number must be ${e10.exact ? "exactly equal to " : e10.inclusive ? "greater than or equal to " : "greater than "}${e10.minimum}` : e10.type === "bigint" ? r5 = `Number must be ${e10.exact ? "exactly equal to " : e10.inclusive ? "greater than or equal to " : "greater than "}${e10.minimum}` : e10.type === "date" ? r5 = `Date must be ${e10.exact ? "exactly equal to " : e10.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e10.minimum))}` : r5 = "Invalid input";
        break;
      case k2.too_big:
        e10.type === "array" ? r5 = `Array must contain ${e10.exact ? "exactly" : e10.inclusive ? "at most" : "less than"} ${e10.maximum} element(s)` : e10.type === "string" ? r5 = `String must contain ${e10.exact ? "exactly" : e10.inclusive ? "at most" : "under"} ${e10.maximum} character(s)` : e10.type === "number" ? r5 = `Number must be ${e10.exact ? "exactly" : e10.inclusive ? "less than or equal to" : "less than"} ${e10.maximum}` : e10.type === "bigint" ? r5 = `BigInt must be ${e10.exact ? "exactly" : e10.inclusive ? "less than or equal to" : "less than"} ${e10.maximum}` : e10.type === "date" ? r5 = `Date must be ${e10.exact ? "exactly" : e10.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e10.maximum))}` : r5 = "Invalid input";
        break;
      case k2.custom:
        r5 = "Invalid input";
        break;
      case k2.invalid_intersection_types:
        r5 = "Intersection results could not be merged";
        break;
      case k2.not_multiple_of:
        r5 = `Number must be a multiple of ${e10.multipleOf}`;
        break;
      case k2.not_finite:
        r5 = "Number must be finite";
        break;
      default:
        r5 = t5.defaultError, oe.assertNever(e10);
    }
    return { message: r5 };
  }, hr = zm, dd = hr;
  function Zm(e10) {
    dd = e10;
  }
  function da() {
    return dd;
  }
  var eo = (e10) => {
    let { data: t5, path: r5, errorMaps: n10, issueData: a2 } = e10, o10 = [...r5, ...a2.path || []], i10 = { ...a2, path: o10 };
    if (a2.message !== void 0) return { ...a2, path: o10, message: a2.message };
    let l2 = "", d3 = n10.filter((u3) => !!u3).slice().reverse();
    for (let u3 of d3) l2 = u3(i10, { data: t5, defaultError: l2 }).message;
    return { ...a2, path: o10, message: l2 };
  }, jm = [];
  function M2(e10, t5) {
    let r5 = da(), n10 = eo({ issueData: t5, data: e10.data, path: e10.path, errorMaps: [e10.common.contextualErrorMap, e10.schemaErrorMap, r5, r5 === hr ? void 0 : hr].filter((a2) => !!a2) });
    e10.common.issues.push(n10);
  }
  var Ne = class {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      this.value === "valid" && (this.value = "dirty");
    }
    abort() {
      this.value !== "aborted" && (this.value = "aborted");
    }
    static mergeArray(t5, r5) {
      let n10 = [];
      for (let a2 of r5) {
        if (a2.status === "aborted") return $;
        a2.status === "dirty" && t5.dirty(), n10.push(a2.value);
      }
      return { status: t5.value, value: n10 };
    }
    static async mergeObjectAsync(t5, r5) {
      let n10 = [];
      for (let a2 of r5) {
        let o10 = await a2.key, i10 = await a2.value;
        n10.push({ key: o10, value: i10 });
      }
      return Ne.mergeObjectSync(t5, n10);
    }
    static mergeObjectSync(t5, r5) {
      let n10 = {};
      for (let a2 of r5) {
        let { key: o10, value: i10 } = a2;
        if (o10.status === "aborted" || i10.status === "aborted") return $;
        o10.status === "dirty" && t5.dirty(), i10.status === "dirty" && t5.dirty(), o10.value !== "__proto__" && (typeof i10.value < "u" || a2.alwaysSet) && (n10[o10.value] = i10.value);
      }
      return { status: t5.value, value: n10 };
    }
  }, $ = Object.freeze({ status: "aborted" }), nn = (e10) => ({ status: "dirty", value: e10 }), Xe = (e10) => ({ status: "valid", value: e10 }), ki = (e10) => e10.status === "aborted", Ii = (e10) => e10.status === "dirty", Rr = (e10) => e10.status === "valid", ua = (e10) => typeof Promise < "u" && e10 instanceof Promise, H;
  (function(e10) {
    e10.errToObj = (t5) => typeof t5 == "string" ? { message: t5 } : t5 || {}, e10.toString = (t5) => typeof t5 == "string" ? t5 : t5?.message;
  })(H || (H = {}));
  var It = class {
    constructor(t5, r5, n10, a2) {
      this._cachedPath = [], this.parent = t5, this.data = r5, this._path = n10, this._key = a2;
    }
    get path() {
      return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
    }
  }, ud = (e10, t5) => {
    if (Rr(t5)) return { success: !0, data: t5.value };
    if (!e10.common.issues.length) throw new Error("Validation failed but no issues detected.");
    return { success: !1, get error() {
      if (this._error) return this._error;
      let r5 = new Ke(e10.common.issues);
      return this._error = r5, this._error;
    } };
  };
  function ee(e10) {
    if (!e10) return {};
    let { errorMap: t5, invalid_type_error: r5, required_error: n10, description: a2 } = e10;
    if (t5 && (r5 || n10)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    return t5 ? { errorMap: t5, description: a2 } : { errorMap: (i10, l2) => {
      let { message: d3 } = e10;
      return i10.code === "invalid_enum_value" ? { message: d3 ?? l2.defaultError } : typeof l2.data > "u" ? { message: d3 ?? n10 ?? l2.defaultError } : i10.code !== "invalid_type" ? { message: l2.defaultError } : { message: d3 ?? r5 ?? l2.defaultError };
    }, description: a2 };
  }
  var te = class {
    get description() {
      return this._def.description;
    }
    _getType(t5) {
      return rr(t5.data);
    }
    _getOrReturnCtx(t5, r5) {
      return r5 || { common: t5.parent.common, data: t5.data, parsedType: rr(t5.data), schemaErrorMap: this._def.errorMap, path: t5.path, parent: t5.parent };
    }
    _processInputParams(t5) {
      return { status: new Ne(), ctx: { common: t5.parent.common, data: t5.data, parsedType: rr(t5.data), schemaErrorMap: this._def.errorMap, path: t5.path, parent: t5.parent } };
    }
    _parseSync(t5) {
      let r5 = this._parse(t5);
      if (ua(r5)) throw new Error("Synchronous parse encountered promise.");
      return r5;
    }
    _parseAsync(t5) {
      let r5 = this._parse(t5);
      return Promise.resolve(r5);
    }
    parse(t5, r5) {
      let n10 = this.safeParse(t5, r5);
      if (n10.success) return n10.data;
      throw n10.error;
    }
    safeParse(t5, r5) {
      let n10 = { common: { issues: [], async: r5?.async ?? !1, contextualErrorMap: r5?.errorMap }, path: r5?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: t5, parsedType: rr(t5) }, a2 = this._parseSync({ data: t5, path: n10.path, parent: n10 });
      return ud(n10, a2);
    }
    "~validate"(t5) {
      let r5 = { common: { issues: [], async: !!this["~standard"].async }, path: [], schemaErrorMap: this._def.errorMap, parent: null, data: t5, parsedType: rr(t5) };
      if (!this["~standard"].async) try {
        let n10 = this._parseSync({ data: t5, path: [], parent: r5 });
        return Rr(n10) ? { value: n10.value } : { issues: r5.common.issues };
      } catch (n10) {
        n10?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), r5.common = { issues: [], async: !0 };
      }
      return this._parseAsync({ data: t5, path: [], parent: r5 }).then((n10) => Rr(n10) ? { value: n10.value } : { issues: r5.common.issues });
    }
    async parseAsync(t5, r5) {
      let n10 = await this.safeParseAsync(t5, r5);
      if (n10.success) return n10.data;
      throw n10.error;
    }
    async safeParseAsync(t5, r5) {
      let n10 = { common: { issues: [], contextualErrorMap: r5?.errorMap, async: !0 }, path: r5?.path || [], schemaErrorMap: this._def.errorMap, parent: null, data: t5, parsedType: rr(t5) }, a2 = this._parse({ data: t5, path: n10.path, parent: n10 }), o10 = await (ua(a2) ? a2 : Promise.resolve(a2));
      return ud(n10, o10);
    }
    refine(t5, r5) {
      let n10 = (a2) => typeof r5 == "string" || typeof r5 > "u" ? { message: r5 } : typeof r5 == "function" ? r5(a2) : r5;
      return this._refinement((a2, o10) => {
        let i10 = t5(a2), l2 = () => o10.addIssue({ code: k2.custom, ...n10(a2) });
        return typeof Promise < "u" && i10 instanceof Promise ? i10.then((d3) => d3 ? !0 : (l2(), !1)) : i10 ? !0 : (l2(), !1);
      });
    }
    refinement(t5, r5) {
      return this._refinement((n10, a2) => t5(n10) ? !0 : (a2.addIssue(typeof r5 == "function" ? r5(n10, a2) : r5), !1));
    }
    _refinement(t5) {
      return new Tt({ schema: this, typeName: q.ZodEffects, effect: { type: "refinement", refinement: t5 } });
    }
    superRefine(t5) {
      return this._refinement(t5);
    }
    constructor(t5) {
      this.spa = this.safeParseAsync, this._def = t5, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = { version: 1, vendor: "zod", validate: (r5) => this["~validate"](r5) };
    }
    optional() {
      return kt.create(this, this._def);
    }
    nullable() {
      return ir.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return yt.create(this);
    }
    promise() {
      return Vr.create(this, this._def);
    }
    or(t5) {
      return ln.create([this, t5], this._def);
    }
    and(t5) {
      return dn.create(this, t5, this._def);
    }
    transform(t5) {
      return new Tt({ ...ee(this._def), schema: this, typeName: q.ZodEffects, effect: { type: "transform", transform: t5 } });
    }
    default(t5) {
      let r5 = typeof t5 == "function" ? t5 : () => t5;
      return new mn({ ...ee(this._def), innerType: this, defaultValue: r5, typeName: q.ZodDefault });
    }
    brand() {
      return new to({ typeName: q.ZodBranded, type: this, ...ee(this._def) });
    }
    catch(t5) {
      let r5 = typeof t5 == "function" ? t5 : () => t5;
      return new hn({ ...ee(this._def), innerType: this, catchValue: r5, typeName: q.ZodCatch });
    }
    describe(t5) {
      let r5 = this.constructor;
      return new r5({ ...this._def, description: t5 });
    }
    pipe(t5) {
      return gn.create(this, t5);
    }
    readonly() {
      return vn.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  }, Um = /^c[^\s-]{8,}$/i, $m = /^[0-9a-z]+$/, Wm = /^[0-9A-HJKMNP-TV-Z]{26}$/i, qm = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Gm = /^[a-z0-9_-]{21}$/i, Qm = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ym = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Jm = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Km = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", u0, Xm = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, e7 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, t7 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, r7 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, n7 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, a7 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, pd = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", o7 = new RegExp(`^${pd}$`);
  function fd(e10) {
    let t5 = "[0-5]\\d";
    e10.precision ? t5 = `${t5}\\.\\d{${e10.precision}}` : e10.precision == null && (t5 = `${t5}(\\.\\d+)?`);
    let r5 = e10.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${t5})${r5}`;
  }
  function i7(e10) {
    return new RegExp(`^${fd(e10)}$`);
  }
  function md(e10) {
    let t5 = `${pd}T${fd(e10)}`, r5 = [];
    return r5.push(e10.local ? "Z?" : "Z"), e10.offset && r5.push("([+-]\\d{2}:?\\d{2})"), t5 = `${t5}(${r5.join("|")})`, new RegExp(`^${t5}$`);
  }
  function s7(e10, t5) {
    return !!((t5 === "v4" || !t5) && Xm.test(e10) || (t5 === "v6" || !t5) && t7.test(e10));
  }
  function l7(e10, t5) {
    if (!Qm.test(e10)) return !1;
    try {
      let [r5] = e10.split(".");
      if (!r5) return !1;
      let n10 = r5.replace(/-/g, "+").replace(/_/g, "/").padEnd(r5.length + (4 - r5.length % 4) % 4, "="), a2 = JSON.parse(atob(n10));
      return !(typeof a2 != "object" || a2 === null || "typ" in a2 && a2?.typ !== "JWT" || !a2.alg || t5 && a2.alg !== t5);
    } catch {
      return !1;
    }
  }
  function d7(e10, t5) {
    return !!((t5 === "v4" || !t5) && e7.test(e10) || (t5 === "v6" || !t5) && r7.test(e10));
  }
  var vt = class extends te {
    _parse(t5) {
      if (this._def.coerce && (t5.data = String(t5.data)), this._getType(t5) !== B2.string) {
        let o10 = this._getOrReturnCtx(t5);
        return M2(o10, { code: k2.invalid_type, expected: B2.string, received: o10.parsedType }), $;
      }
      let n10 = new Ne(), a2;
      for (let o10 of this._def.checks) if (o10.kind === "min") t5.data.length < o10.value && (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.too_small, minimum: o10.value, type: "string", inclusive: !0, exact: !1, message: o10.message }), n10.dirty());
      else if (o10.kind === "max") t5.data.length > o10.value && (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.too_big, maximum: o10.value, type: "string", inclusive: !0, exact: !1, message: o10.message }), n10.dirty());
      else if (o10.kind === "length") {
        let i10 = t5.data.length > o10.value, l2 = t5.data.length < o10.value;
        (i10 || l2) && (a2 = this._getOrReturnCtx(t5, a2), i10 ? M2(a2, { code: k2.too_big, maximum: o10.value, type: "string", inclusive: !0, exact: !0, message: o10.message }) : l2 && M2(a2, { code: k2.too_small, minimum: o10.value, type: "string", inclusive: !0, exact: !0, message: o10.message }), n10.dirty());
      } else if (o10.kind === "email") Jm.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "email", code: k2.invalid_string, message: o10.message }), n10.dirty());
      else if (o10.kind === "emoji") u0 || (u0 = new RegExp(Km, "u")), u0.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "emoji", code: k2.invalid_string, message: o10.message }), n10.dirty());
      else if (o10.kind === "uuid") qm.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "uuid", code: k2.invalid_string, message: o10.message }), n10.dirty());
      else if (o10.kind === "nanoid") Gm.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "nanoid", code: k2.invalid_string, message: o10.message }), n10.dirty());
      else if (o10.kind === "cuid") Um.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "cuid", code: k2.invalid_string, message: o10.message }), n10.dirty());
      else if (o10.kind === "cuid2") $m.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "cuid2", code: k2.invalid_string, message: o10.message }), n10.dirty());
      else if (o10.kind === "ulid") Wm.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "ulid", code: k2.invalid_string, message: o10.message }), n10.dirty());
      else if (o10.kind === "url") try {
        new URL(t5.data);
      } catch {
        a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "url", code: k2.invalid_string, message: o10.message }), n10.dirty();
      }
      else o10.kind === "regex" ? (o10.regex.lastIndex = 0, o10.regex.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "regex", code: k2.invalid_string, message: o10.message }), n10.dirty())) : o10.kind === "trim" ? t5.data = t5.data.trim() : o10.kind === "includes" ? t5.data.includes(o10.value, o10.position) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.invalid_string, validation: { includes: o10.value, position: o10.position }, message: o10.message }), n10.dirty()) : o10.kind === "toLowerCase" ? t5.data = t5.data.toLowerCase() : o10.kind === "toUpperCase" ? t5.data = t5.data.toUpperCase() : o10.kind === "startsWith" ? t5.data.startsWith(o10.value) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.invalid_string, validation: { startsWith: o10.value }, message: o10.message }), n10.dirty()) : o10.kind === "endsWith" ? t5.data.endsWith(o10.value) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.invalid_string, validation: { endsWith: o10.value }, message: o10.message }), n10.dirty()) : o10.kind === "datetime" ? md(o10).test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.invalid_string, validation: "datetime", message: o10.message }), n10.dirty()) : o10.kind === "date" ? o7.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.invalid_string, validation: "date", message: o10.message }), n10.dirty()) : o10.kind === "time" ? i7(o10).test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.invalid_string, validation: "time", message: o10.message }), n10.dirty()) : o10.kind === "duration" ? Ym.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "duration", code: k2.invalid_string, message: o10.message }), n10.dirty()) : o10.kind === "ip" ? s7(t5.data, o10.version) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "ip", code: k2.invalid_string, message: o10.message }), n10.dirty()) : o10.kind === "jwt" ? l7(t5.data, o10.alg) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "jwt", code: k2.invalid_string, message: o10.message }), n10.dirty()) : o10.kind === "cidr" ? d7(t5.data, o10.version) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "cidr", code: k2.invalid_string, message: o10.message }), n10.dirty()) : o10.kind === "base64" ? n7.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "base64", code: k2.invalid_string, message: o10.message }), n10.dirty()) : o10.kind === "base64url" ? a7.test(t5.data) || (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { validation: "base64url", code: k2.invalid_string, message: o10.message }), n10.dirty()) : oe.assertNever(o10);
      return { status: n10.value, value: t5.data };
    }
    _regex(t5, r5, n10) {
      return this.refinement((a2) => t5.test(a2), { validation: r5, code: k2.invalid_string, ...H.errToObj(n10) });
    }
    _addCheck(t5) {
      return new vt({ ...this._def, checks: [...this._def.checks, t5] });
    }
    email(t5) {
      return this._addCheck({ kind: "email", ...H.errToObj(t5) });
    }
    url(t5) {
      return this._addCheck({ kind: "url", ...H.errToObj(t5) });
    }
    emoji(t5) {
      return this._addCheck({ kind: "emoji", ...H.errToObj(t5) });
    }
    uuid(t5) {
      return this._addCheck({ kind: "uuid", ...H.errToObj(t5) });
    }
    nanoid(t5) {
      return this._addCheck({ kind: "nanoid", ...H.errToObj(t5) });
    }
    cuid(t5) {
      return this._addCheck({ kind: "cuid", ...H.errToObj(t5) });
    }
    cuid2(t5) {
      return this._addCheck({ kind: "cuid2", ...H.errToObj(t5) });
    }
    ulid(t5) {
      return this._addCheck({ kind: "ulid", ...H.errToObj(t5) });
    }
    base64(t5) {
      return this._addCheck({ kind: "base64", ...H.errToObj(t5) });
    }
    base64url(t5) {
      return this._addCheck({ kind: "base64url", ...H.errToObj(t5) });
    }
    jwt(t5) {
      return this._addCheck({ kind: "jwt", ...H.errToObj(t5) });
    }
    ip(t5) {
      return this._addCheck({ kind: "ip", ...H.errToObj(t5) });
    }
    cidr(t5) {
      return this._addCheck({ kind: "cidr", ...H.errToObj(t5) });
    }
    datetime(t5) {
      return typeof t5 == "string" ? this._addCheck({ kind: "datetime", precision: null, offset: !1, local: !1, message: t5 }) : this._addCheck({ kind: "datetime", precision: typeof t5?.precision > "u" ? null : t5?.precision, offset: t5?.offset ?? !1, local: t5?.local ?? !1, ...H.errToObj(t5?.message) });
    }
    date(t5) {
      return this._addCheck({ kind: "date", message: t5 });
    }
    time(t5) {
      return typeof t5 == "string" ? this._addCheck({ kind: "time", precision: null, message: t5 }) : this._addCheck({ kind: "time", precision: typeof t5?.precision > "u" ? null : t5?.precision, ...H.errToObj(t5?.message) });
    }
    duration(t5) {
      return this._addCheck({ kind: "duration", ...H.errToObj(t5) });
    }
    regex(t5, r5) {
      return this._addCheck({ kind: "regex", regex: t5, ...H.errToObj(r5) });
    }
    includes(t5, r5) {
      return this._addCheck({ kind: "includes", value: t5, position: r5?.position, ...H.errToObj(r5?.message) });
    }
    startsWith(t5, r5) {
      return this._addCheck({ kind: "startsWith", value: t5, ...H.errToObj(r5) });
    }
    endsWith(t5, r5) {
      return this._addCheck({ kind: "endsWith", value: t5, ...H.errToObj(r5) });
    }
    min(t5, r5) {
      return this._addCheck({ kind: "min", value: t5, ...H.errToObj(r5) });
    }
    max(t5, r5) {
      return this._addCheck({ kind: "max", value: t5, ...H.errToObj(r5) });
    }
    length(t5, r5) {
      return this._addCheck({ kind: "length", value: t5, ...H.errToObj(r5) });
    }
    nonempty(t5) {
      return this.min(1, H.errToObj(t5));
    }
    trim() {
      return new vt({ ...this._def, checks: [...this._def.checks, { kind: "trim" }] });
    }
    toLowerCase() {
      return new vt({ ...this._def, checks: [...this._def.checks, { kind: "toLowerCase" }] });
    }
    toUpperCase() {
      return new vt({ ...this._def, checks: [...this._def.checks, { kind: "toUpperCase" }] });
    }
    get isDatetime() {
      return !!this._def.checks.find((t5) => t5.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((t5) => t5.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((t5) => t5.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((t5) => t5.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((t5) => t5.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((t5) => t5.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((t5) => t5.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((t5) => t5.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((t5) => t5.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((t5) => t5.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((t5) => t5.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((t5) => t5.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((t5) => t5.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((t5) => t5.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((t5) => t5.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((t5) => t5.kind === "base64url");
    }
    get minLength() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "min" && (t5 === null || r5.value > t5) && (t5 = r5.value);
      return t5;
    }
    get maxLength() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "max" && (t5 === null || r5.value < t5) && (t5 = r5.value);
      return t5;
    }
  };
  vt.create = (e10) => new vt({ checks: [], typeName: q.ZodString, coerce: e10?.coerce ?? !1, ...ee(e10) });
  function u7(e10, t5) {
    let r5 = (e10.toString().split(".")[1] || "").length, n10 = (t5.toString().split(".")[1] || "").length, a2 = r5 > n10 ? r5 : n10, o10 = Number.parseInt(e10.toFixed(a2).replace(".", "")), i10 = Number.parseInt(t5.toFixed(a2).replace(".", ""));
    return o10 % i10 / 10 ** a2;
  }
  var nr = class extends te {
    constructor() {
      super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
    }
    _parse(t5) {
      if (this._def.coerce && (t5.data = Number(t5.data)), this._getType(t5) !== B2.number) {
        let o10 = this._getOrReturnCtx(t5);
        return M2(o10, { code: k2.invalid_type, expected: B2.number, received: o10.parsedType }), $;
      }
      let n10, a2 = new Ne();
      for (let o10 of this._def.checks) o10.kind === "int" ? oe.isInteger(t5.data) || (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.invalid_type, expected: "integer", received: "float", message: o10.message }), a2.dirty()) : o10.kind === "min" ? (o10.inclusive ? t5.data < o10.value : t5.data <= o10.value) && (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.too_small, minimum: o10.value, type: "number", inclusive: o10.inclusive, exact: !1, message: o10.message }), a2.dirty()) : o10.kind === "max" ? (o10.inclusive ? t5.data > o10.value : t5.data >= o10.value) && (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.too_big, maximum: o10.value, type: "number", inclusive: o10.inclusive, exact: !1, message: o10.message }), a2.dirty()) : o10.kind === "multipleOf" ? u7(t5.data, o10.value) !== 0 && (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.not_multiple_of, multipleOf: o10.value, message: o10.message }), a2.dirty()) : o10.kind === "finite" ? Number.isFinite(t5.data) || (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.not_finite, message: o10.message }), a2.dirty()) : oe.assertNever(o10);
      return { status: a2.value, value: t5.data };
    }
    gte(t5, r5) {
      return this.setLimit("min", t5, !0, H.toString(r5));
    }
    gt(t5, r5) {
      return this.setLimit("min", t5, !1, H.toString(r5));
    }
    lte(t5, r5) {
      return this.setLimit("max", t5, !0, H.toString(r5));
    }
    lt(t5, r5) {
      return this.setLimit("max", t5, !1, H.toString(r5));
    }
    setLimit(t5, r5, n10, a2) {
      return new nr({ ...this._def, checks: [...this._def.checks, { kind: t5, value: r5, inclusive: n10, message: H.toString(a2) }] });
    }
    _addCheck(t5) {
      return new nr({ ...this._def, checks: [...this._def.checks, t5] });
    }
    int(t5) {
      return this._addCheck({ kind: "int", message: H.toString(t5) });
    }
    positive(t5) {
      return this._addCheck({ kind: "min", value: 0, inclusive: !1, message: H.toString(t5) });
    }
    negative(t5) {
      return this._addCheck({ kind: "max", value: 0, inclusive: !1, message: H.toString(t5) });
    }
    nonpositive(t5) {
      return this._addCheck({ kind: "max", value: 0, inclusive: !0, message: H.toString(t5) });
    }
    nonnegative(t5) {
      return this._addCheck({ kind: "min", value: 0, inclusive: !0, message: H.toString(t5) });
    }
    multipleOf(t5, r5) {
      return this._addCheck({ kind: "multipleOf", value: t5, message: H.toString(r5) });
    }
    finite(t5) {
      return this._addCheck({ kind: "finite", message: H.toString(t5) });
    }
    safe(t5) {
      return this._addCheck({ kind: "min", inclusive: !0, value: Number.MIN_SAFE_INTEGER, message: H.toString(t5) })._addCheck({ kind: "max", inclusive: !0, value: Number.MAX_SAFE_INTEGER, message: H.toString(t5) });
    }
    get minValue() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "min" && (t5 === null || r5.value > t5) && (t5 = r5.value);
      return t5;
    }
    get maxValue() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "max" && (t5 === null || r5.value < t5) && (t5 = r5.value);
      return t5;
    }
    get isInt() {
      return !!this._def.checks.find((t5) => t5.kind === "int" || t5.kind === "multipleOf" && oe.isInteger(t5.value));
    }
    get isFinite() {
      let t5 = null, r5 = null;
      for (let n10 of this._def.checks) {
        if (n10.kind === "finite" || n10.kind === "int" || n10.kind === "multipleOf") return !0;
        n10.kind === "min" ? (r5 === null || n10.value > r5) && (r5 = n10.value) : n10.kind === "max" && (t5 === null || n10.value < t5) && (t5 = n10.value);
      }
      return Number.isFinite(r5) && Number.isFinite(t5);
    }
  };
  nr.create = (e10) => new nr({ checks: [], typeName: q.ZodNumber, coerce: e10?.coerce || !1, ...ee(e10) });
  var ar = class extends te {
    constructor() {
      super(...arguments), this.min = this.gte, this.max = this.lte;
    }
    _parse(t5) {
      if (this._def.coerce) try {
        t5.data = BigInt(t5.data);
      } catch {
        return this._getInvalidInput(t5);
      }
      if (this._getType(t5) !== B2.bigint) return this._getInvalidInput(t5);
      let n10, a2 = new Ne();
      for (let o10 of this._def.checks) o10.kind === "min" ? (o10.inclusive ? t5.data < o10.value : t5.data <= o10.value) && (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.too_small, type: "bigint", minimum: o10.value, inclusive: o10.inclusive, message: o10.message }), a2.dirty()) : o10.kind === "max" ? (o10.inclusive ? t5.data > o10.value : t5.data >= o10.value) && (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.too_big, type: "bigint", maximum: o10.value, inclusive: o10.inclusive, message: o10.message }), a2.dirty()) : o10.kind === "multipleOf" ? t5.data % o10.value !== BigInt(0) && (n10 = this._getOrReturnCtx(t5, n10), M2(n10, { code: k2.not_multiple_of, multipleOf: o10.value, message: o10.message }), a2.dirty()) : oe.assertNever(o10);
      return { status: a2.value, value: t5.data };
    }
    _getInvalidInput(t5) {
      let r5 = this._getOrReturnCtx(t5);
      return M2(r5, { code: k2.invalid_type, expected: B2.bigint, received: r5.parsedType }), $;
    }
    gte(t5, r5) {
      return this.setLimit("min", t5, !0, H.toString(r5));
    }
    gt(t5, r5) {
      return this.setLimit("min", t5, !1, H.toString(r5));
    }
    lte(t5, r5) {
      return this.setLimit("max", t5, !0, H.toString(r5));
    }
    lt(t5, r5) {
      return this.setLimit("max", t5, !1, H.toString(r5));
    }
    setLimit(t5, r5, n10, a2) {
      return new ar({ ...this._def, checks: [...this._def.checks, { kind: t5, value: r5, inclusive: n10, message: H.toString(a2) }] });
    }
    _addCheck(t5) {
      return new ar({ ...this._def, checks: [...this._def.checks, t5] });
    }
    positive(t5) {
      return this._addCheck({ kind: "min", value: BigInt(0), inclusive: !1, message: H.toString(t5) });
    }
    negative(t5) {
      return this._addCheck({ kind: "max", value: BigInt(0), inclusive: !1, message: H.toString(t5) });
    }
    nonpositive(t5) {
      return this._addCheck({ kind: "max", value: BigInt(0), inclusive: !0, message: H.toString(t5) });
    }
    nonnegative(t5) {
      return this._addCheck({ kind: "min", value: BigInt(0), inclusive: !0, message: H.toString(t5) });
    }
    multipleOf(t5, r5) {
      return this._addCheck({ kind: "multipleOf", value: t5, message: H.toString(r5) });
    }
    get minValue() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "min" && (t5 === null || r5.value > t5) && (t5 = r5.value);
      return t5;
    }
    get maxValue() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "max" && (t5 === null || r5.value < t5) && (t5 = r5.value);
      return t5;
    }
  };
  ar.create = (e10) => new ar({ checks: [], typeName: q.ZodBigInt, coerce: e10?.coerce ?? !1, ...ee(e10) });
  var an = class extends te {
    _parse(t5) {
      if (this._def.coerce && (t5.data = !!t5.data), this._getType(t5) !== B2.boolean) {
        let n10 = this._getOrReturnCtx(t5);
        return M2(n10, { code: k2.invalid_type, expected: B2.boolean, received: n10.parsedType }), $;
      }
      return Xe(t5.data);
    }
  };
  an.create = (e10) => new an({ typeName: q.ZodBoolean, coerce: e10?.coerce || !1, ...ee(e10) });
  var yr = class extends te {
    _parse(t5) {
      if (this._def.coerce && (t5.data = new Date(t5.data)), this._getType(t5) !== B2.date) {
        let o10 = this._getOrReturnCtx(t5);
        return M2(o10, { code: k2.invalid_type, expected: B2.date, received: o10.parsedType }), $;
      }
      if (Number.isNaN(t5.data.getTime())) {
        let o10 = this._getOrReturnCtx(t5);
        return M2(o10, { code: k2.invalid_date }), $;
      }
      let n10 = new Ne(), a2;
      for (let o10 of this._def.checks) o10.kind === "min" ? t5.data.getTime() < o10.value && (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.too_small, message: o10.message, inclusive: !0, exact: !1, minimum: o10.value, type: "date" }), n10.dirty()) : o10.kind === "max" ? t5.data.getTime() > o10.value && (a2 = this._getOrReturnCtx(t5, a2), M2(a2, { code: k2.too_big, message: o10.message, inclusive: !0, exact: !1, maximum: o10.value, type: "date" }), n10.dirty()) : oe.assertNever(o10);
      return { status: n10.value, value: new Date(t5.data.getTime()) };
    }
    _addCheck(t5) {
      return new yr({ ...this._def, checks: [...this._def.checks, t5] });
    }
    min(t5, r5) {
      return this._addCheck({ kind: "min", value: t5.getTime(), message: H.toString(r5) });
    }
    max(t5, r5) {
      return this._addCheck({ kind: "max", value: t5.getTime(), message: H.toString(r5) });
    }
    get minDate() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "min" && (t5 === null || r5.value > t5) && (t5 = r5.value);
      return t5 != null ? new Date(t5) : null;
    }
    get maxDate() {
      let t5 = null;
      for (let r5 of this._def.checks) r5.kind === "max" && (t5 === null || r5.value < t5) && (t5 = r5.value);
      return t5 != null ? new Date(t5) : null;
    }
  };
  yr.create = (e10) => new yr({ checks: [], coerce: e10?.coerce || !1, typeName: q.ZodDate, ...ee(e10) });
  var pa = class extends te {
    _parse(t5) {
      if (this._getType(t5) !== B2.symbol) {
        let n10 = this._getOrReturnCtx(t5);
        return M2(n10, { code: k2.invalid_type, expected: B2.symbol, received: n10.parsedType }), $;
      }
      return Xe(t5.data);
    }
  };
  pa.create = (e10) => new pa({ typeName: q.ZodSymbol, ...ee(e10) });
  var on = class extends te {
    _parse(t5) {
      if (this._getType(t5) !== B2.undefined) {
        let n10 = this._getOrReturnCtx(t5);
        return M2(n10, { code: k2.invalid_type, expected: B2.undefined, received: n10.parsedType }), $;
      }
      return Xe(t5.data);
    }
  };
  on.create = (e10) => new on({ typeName: q.ZodUndefined, ...ee(e10) });
  var sn = class extends te {
    _parse(t5) {
      if (this._getType(t5) !== B2.null) {
        let n10 = this._getOrReturnCtx(t5);
        return M2(n10, { code: k2.invalid_type, expected: B2.null, received: n10.parsedType }), $;
      }
      return Xe(t5.data);
    }
  };
  sn.create = (e10) => new sn({ typeName: q.ZodNull, ...ee(e10) });
  var Dr = class extends te {
    constructor() {
      super(...arguments), this._any = !0;
    }
    _parse(t5) {
      return Xe(t5.data);
    }
  };
  Dr.create = (e10) => new Dr({ typeName: q.ZodAny, ...ee(e10) });
  var vr = class extends te {
    constructor() {
      super(...arguments), this._unknown = !0;
    }
    _parse(t5) {
      return Xe(t5.data);
    }
  };
  vr.create = (e10) => new vr({ typeName: q.ZodUnknown, ...ee(e10) });
  var Rt = class extends te {
    _parse(t5) {
      let r5 = this._getOrReturnCtx(t5);
      return M2(r5, { code: k2.invalid_type, expected: B2.never, received: r5.parsedType }), $;
    }
  };
  Rt.create = (e10) => new Rt({ typeName: q.ZodNever, ...ee(e10) });
  var fa = class extends te {
    _parse(t5) {
      if (this._getType(t5) !== B2.undefined) {
        let n10 = this._getOrReturnCtx(t5);
        return M2(n10, { code: k2.invalid_type, expected: B2.void, received: n10.parsedType }), $;
      }
      return Xe(t5.data);
    }
  };
  fa.create = (e10) => new fa({ typeName: q.ZodVoid, ...ee(e10) });
  var yt = class extends te {
    _parse(t5) {
      let { ctx: r5, status: n10 } = this._processInputParams(t5), a2 = this._def;
      if (r5.parsedType !== B2.array) return M2(r5, { code: k2.invalid_type, expected: B2.array, received: r5.parsedType }), $;
      if (a2.exactLength !== null) {
        let i10 = r5.data.length > a2.exactLength.value, l2 = r5.data.length < a2.exactLength.value;
        (i10 || l2) && (M2(r5, { code: i10 ? k2.too_big : k2.too_small, minimum: l2 ? a2.exactLength.value : void 0, maximum: i10 ? a2.exactLength.value : void 0, type: "array", inclusive: !0, exact: !0, message: a2.exactLength.message }), n10.dirty());
      }
      if (a2.minLength !== null && r5.data.length < a2.minLength.value && (M2(r5, { code: k2.too_small, minimum: a2.minLength.value, type: "array", inclusive: !0, exact: !1, message: a2.minLength.message }), n10.dirty()), a2.maxLength !== null && r5.data.length > a2.maxLength.value && (M2(r5, { code: k2.too_big, maximum: a2.maxLength.value, type: "array", inclusive: !0, exact: !1, message: a2.maxLength.message }), n10.dirty()), r5.common.async) return Promise.all([...r5.data].map((i10, l2) => a2.type._parseAsync(new It(r5, i10, r5.path, l2)))).then((i10) => Ne.mergeArray(n10, i10));
      let o10 = [...r5.data].map((i10, l2) => a2.type._parseSync(new It(r5, i10, r5.path, l2)));
      return Ne.mergeArray(n10, o10);
    }
    get element() {
      return this._def.type;
    }
    min(t5, r5) {
      return new yt({ ...this._def, minLength: { value: t5, message: H.toString(r5) } });
    }
    max(t5, r5) {
      return new yt({ ...this._def, maxLength: { value: t5, message: H.toString(r5) } });
    }
    length(t5, r5) {
      return new yt({ ...this._def, exactLength: { value: t5, message: H.toString(r5) } });
    }
    nonempty(t5) {
      return this.min(1, t5);
    }
  };
  yt.create = (e10, t5) => new yt({ type: e10, minLength: null, maxLength: null, exactLength: null, typeName: q.ZodArray, ...ee(t5) });
  function ca(e10) {
    if (e10 instanceof ke) {
      let t5 = {};
      for (let r5 in e10.shape) {
        let n10 = e10.shape[r5];
        t5[r5] = kt.create(ca(n10));
      }
      return new ke({ ...e10._def, shape: () => t5 });
    } else return e10 instanceof yt ? new yt({ ...e10._def, type: ca(e10.element) }) : e10 instanceof kt ? kt.create(ca(e10.unwrap())) : e10 instanceof ir ? ir.create(ca(e10.unwrap())) : e10 instanceof Et ? Et.create(e10.items.map((t5) => ca(t5))) : e10;
  }
  var ke = class extends te {
    constructor() {
      super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null) return this._cached;
      let t5 = this._def.shape(), r5 = oe.objectKeys(t5);
      return this._cached = { shape: t5, keys: r5 }, this._cached;
    }
    _parse(t5) {
      if (this._getType(t5) !== B2.object) {
        let u3 = this._getOrReturnCtx(t5);
        return M2(u3, { code: k2.invalid_type, expected: B2.object, received: u3.parsedType }), $;
      }
      let { status: n10, ctx: a2 } = this._processInputParams(t5), { shape: o10, keys: i10 } = this._getCached(), l2 = [];
      if (!(this._def.catchall instanceof Rt && this._def.unknownKeys === "strip")) for (let u3 in a2.data) i10.includes(u3) || l2.push(u3);
      let d3 = [];
      for (let u3 of i10) {
        let c10 = o10[u3], p5 = a2.data[u3];
        d3.push({ key: { status: "valid", value: u3 }, value: c10._parse(new It(a2, p5, a2.path, u3)), alwaysSet: u3 in a2.data });
      }
      if (this._def.catchall instanceof Rt) {
        let u3 = this._def.unknownKeys;
        if (u3 === "passthrough") for (let c10 of l2) d3.push({ key: { status: "valid", value: c10 }, value: { status: "valid", value: a2.data[c10] } });
        else if (u3 === "strict") l2.length > 0 && (M2(a2, { code: k2.unrecognized_keys, keys: l2 }), n10.dirty());
        else if (u3 !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
      } else {
        let u3 = this._def.catchall;
        for (let c10 of l2) {
          let p5 = a2.data[c10];
          d3.push({ key: { status: "valid", value: c10 }, value: u3._parse(new It(a2, p5, a2.path, c10)), alwaysSet: c10 in a2.data });
        }
      }
      return a2.common.async ? Promise.resolve().then(async () => {
        let u3 = [];
        for (let c10 of d3) {
          let p5 = await c10.key, f4 = await c10.value;
          u3.push({ key: p5, value: f4, alwaysSet: c10.alwaysSet });
        }
        return u3;
      }).then((u3) => Ne.mergeObjectSync(n10, u3)) : Ne.mergeObjectSync(n10, d3);
    }
    get shape() {
      return this._def.shape();
    }
    strict(t5) {
      return H.errToObj, new ke({ ...this._def, unknownKeys: "strict", ...t5 !== void 0 ? { errorMap: (r5, n10) => {
        let a2 = this._def.errorMap?.(r5, n10).message ?? n10.defaultError;
        return r5.code === "unrecognized_keys" ? { message: H.errToObj(t5).message ?? a2 } : { message: a2 };
      } } : {} });
    }
    strip() {
      return new ke({ ...this._def, unknownKeys: "strip" });
    }
    passthrough() {
      return new ke({ ...this._def, unknownKeys: "passthrough" });
    }
    extend(t5) {
      return new ke({ ...this._def, shape: () => ({ ...this._def.shape(), ...t5 }) });
    }
    merge(t5) {
      return new ke({ unknownKeys: t5._def.unknownKeys, catchall: t5._def.catchall, shape: () => ({ ...this._def.shape(), ...t5._def.shape() }), typeName: q.ZodObject });
    }
    setKey(t5, r5) {
      return this.augment({ [t5]: r5 });
    }
    catchall(t5) {
      return new ke({ ...this._def, catchall: t5 });
    }
    pick(t5) {
      let r5 = {};
      for (let n10 of oe.objectKeys(t5)) t5[n10] && this.shape[n10] && (r5[n10] = this.shape[n10]);
      return new ke({ ...this._def, shape: () => r5 });
    }
    omit(t5) {
      let r5 = {};
      for (let n10 of oe.objectKeys(this.shape)) t5[n10] || (r5[n10] = this.shape[n10]);
      return new ke({ ...this._def, shape: () => r5 });
    }
    deepPartial() {
      return ca(this);
    }
    partial(t5) {
      let r5 = {};
      for (let n10 of oe.objectKeys(this.shape)) {
        let a2 = this.shape[n10];
        t5 && !t5[n10] ? r5[n10] = a2 : r5[n10] = a2.optional();
      }
      return new ke({ ...this._def, shape: () => r5 });
    }
    required(t5) {
      let r5 = {};
      for (let n10 of oe.objectKeys(this.shape)) if (t5 && !t5[n10]) r5[n10] = this.shape[n10];
      else {
        let o10 = this.shape[n10];
        for (; o10 instanceof kt; ) o10 = o10._def.innerType;
        r5[n10] = o10;
      }
      return new ke({ ...this._def, shape: () => r5 });
    }
    keyof() {
      return hd(oe.objectKeys(this.shape));
    }
  };
  ke.create = (e10, t5) => new ke({ shape: () => e10, unknownKeys: "strip", catchall: Rt.create(), typeName: q.ZodObject, ...ee(t5) });
  ke.strictCreate = (e10, t5) => new ke({ shape: () => e10, unknownKeys: "strict", catchall: Rt.create(), typeName: q.ZodObject, ...ee(t5) });
  ke.lazycreate = (e10, t5) => new ke({ shape: e10, unknownKeys: "strip", catchall: Rt.create(), typeName: q.ZodObject, ...ee(t5) });
  var ln = class extends te {
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5), n10 = this._def.options;
      function a2(o10) {
        for (let l2 of o10) if (l2.result.status === "valid") return l2.result;
        for (let l2 of o10) if (l2.result.status === "dirty") return r5.common.issues.push(...l2.ctx.common.issues), l2.result;
        let i10 = o10.map((l2) => new Ke(l2.ctx.common.issues));
        return M2(r5, { code: k2.invalid_union, unionErrors: i10 }), $;
      }
      if (r5.common.async) return Promise.all(n10.map(async (o10) => {
        let i10 = { ...r5, common: { ...r5.common, issues: [] }, parent: null };
        return { result: await o10._parseAsync({ data: r5.data, path: r5.path, parent: i10 }), ctx: i10 };
      })).then(a2);
      {
        let o10, i10 = [];
        for (let d3 of n10) {
          let u3 = { ...r5, common: { ...r5.common, issues: [] }, parent: null }, c10 = d3._parseSync({ data: r5.data, path: r5.path, parent: u3 });
          if (c10.status === "valid") return c10;
          c10.status === "dirty" && !o10 && (o10 = { result: c10, ctx: u3 }), u3.common.issues.length && i10.push(u3.common.issues);
        }
        if (o10) return r5.common.issues.push(...o10.ctx.common.issues), o10.result;
        let l2 = i10.map((d3) => new Ke(d3));
        return M2(r5, { code: k2.invalid_union, unionErrors: l2 }), $;
      }
    }
    get options() {
      return this._def.options;
    }
  };
  ln.create = (e10, t5) => new ln({ options: e10, typeName: q.ZodUnion, ...ee(t5) });
  var gr = (e10) => e10 instanceof cn ? gr(e10.schema) : e10 instanceof Tt ? gr(e10.innerType()) : e10 instanceof pn ? [e10.value] : e10 instanceof or ? e10.options : e10 instanceof fn ? oe.objectValues(e10.enum) : e10 instanceof mn ? gr(e10._def.innerType) : e10 instanceof on ? [void 0] : e10 instanceof sn ? [null] : e10 instanceof kt ? [void 0, ...gr(e10.unwrap())] : e10 instanceof ir ? [null, ...gr(e10.unwrap())] : e10 instanceof to || e10 instanceof vn ? gr(e10.unwrap()) : e10 instanceof hn ? gr(e10._def.innerType) : [], ma = class extends te {
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5);
      if (r5.parsedType !== B2.object) return M2(r5, { code: k2.invalid_type, expected: B2.object, received: r5.parsedType }), $;
      let n10 = this.discriminator, a2 = r5.data[n10], o10 = this.optionsMap.get(a2);
      return o10 ? r5.common.async ? o10._parseAsync({ data: r5.data, path: r5.path, parent: r5 }) : o10._parseSync({ data: r5.data, path: r5.path, parent: r5 }) : (M2(r5, { code: k2.invalid_union_discriminator, options: Array.from(this.optionsMap.keys()), path: [n10] }), $);
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    static create(t5, r5, n10) {
      let a2 = /* @__PURE__ */ new Map();
      for (let o10 of r5) {
        let i10 = gr(o10.shape[t5]);
        if (!i10.length) throw new Error(`A discriminator value for key \`${t5}\` could not be extracted from all schema options`);
        for (let l2 of i10) {
          if (a2.has(l2)) throw new Error(`Discriminator property ${String(t5)} has duplicate value ${String(l2)}`);
          a2.set(l2, o10);
        }
      }
      return new ma({ typeName: q.ZodDiscriminatedUnion, discriminator: t5, options: r5, optionsMap: a2, ...ee(n10) });
    }
  };
  function c0(e10, t5) {
    let r5 = rr(e10), n10 = rr(t5);
    if (e10 === t5) return { valid: !0, data: e10 };
    if (r5 === B2.object && n10 === B2.object) {
      let a2 = oe.objectKeys(t5), o10 = oe.objectKeys(e10).filter((l2) => a2.indexOf(l2) !== -1), i10 = { ...e10, ...t5 };
      for (let l2 of o10) {
        let d3 = c0(e10[l2], t5[l2]);
        if (!d3.valid) return { valid: !1 };
        i10[l2] = d3.data;
      }
      return { valid: !0, data: i10 };
    } else if (r5 === B2.array && n10 === B2.array) {
      if (e10.length !== t5.length) return { valid: !1 };
      let a2 = [];
      for (let o10 = 0; o10 < e10.length; o10++) {
        let i10 = e10[o10], l2 = t5[o10], d3 = c0(i10, l2);
        if (!d3.valid) return { valid: !1 };
        a2.push(d3.data);
      }
      return { valid: !0, data: a2 };
    } else return r5 === B2.date && n10 === B2.date && +e10 == +t5 ? { valid: !0, data: e10 } : { valid: !1 };
  }
  var dn = class extends te {
    _parse(t5) {
      let { status: r5, ctx: n10 } = this._processInputParams(t5), a2 = (o10, i10) => {
        if (ki(o10) || ki(i10)) return $;
        let l2 = c0(o10.value, i10.value);
        return l2.valid ? ((Ii(o10) || Ii(i10)) && r5.dirty(), { status: r5.value, value: l2.data }) : (M2(n10, { code: k2.invalid_intersection_types }), $);
      };
      return n10.common.async ? Promise.all([this._def.left._parseAsync({ data: n10.data, path: n10.path, parent: n10 }), this._def.right._parseAsync({ data: n10.data, path: n10.path, parent: n10 })]).then(([o10, i10]) => a2(o10, i10)) : a2(this._def.left._parseSync({ data: n10.data, path: n10.path, parent: n10 }), this._def.right._parseSync({ data: n10.data, path: n10.path, parent: n10 }));
    }
  };
  dn.create = (e10, t5, r5) => new dn({ left: e10, right: t5, typeName: q.ZodIntersection, ...ee(r5) });
  var Et = class extends te {
    _parse(t5) {
      let { status: r5, ctx: n10 } = this._processInputParams(t5);
      if (n10.parsedType !== B2.array) return M2(n10, { code: k2.invalid_type, expected: B2.array, received: n10.parsedType }), $;
      if (n10.data.length < this._def.items.length) return M2(n10, { code: k2.too_small, minimum: this._def.items.length, inclusive: !0, exact: !1, type: "array" }), $;
      !this._def.rest && n10.data.length > this._def.items.length && (M2(n10, { code: k2.too_big, maximum: this._def.items.length, inclusive: !0, exact: !1, type: "array" }), r5.dirty());
      let o10 = [...n10.data].map((i10, l2) => {
        let d3 = this._def.items[l2] || this._def.rest;
        return d3 ? d3._parse(new It(n10, i10, n10.path, l2)) : null;
      }).filter((i10) => !!i10);
      return n10.common.async ? Promise.all(o10).then((i10) => Ne.mergeArray(r5, i10)) : Ne.mergeArray(r5, o10);
    }
    get items() {
      return this._def.items;
    }
    rest(t5) {
      return new Et({ ...this._def, rest: t5 });
    }
  };
  Et.create = (e10, t5) => {
    if (!Array.isArray(e10)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new Et({ items: e10, typeName: q.ZodTuple, rest: null, ...ee(t5) });
  };
  var un = class extends te {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(t5) {
      let { status: r5, ctx: n10 } = this._processInputParams(t5);
      if (n10.parsedType !== B2.object) return M2(n10, { code: k2.invalid_type, expected: B2.object, received: n10.parsedType }), $;
      let a2 = [], o10 = this._def.keyType, i10 = this._def.valueType;
      for (let l2 in n10.data) a2.push({ key: o10._parse(new It(n10, l2, n10.path, l2)), value: i10._parse(new It(n10, n10.data[l2], n10.path, l2)), alwaysSet: l2 in n10.data });
      return n10.common.async ? Ne.mergeObjectAsync(r5, a2) : Ne.mergeObjectSync(r5, a2);
    }
    get element() {
      return this._def.valueType;
    }
    static create(t5, r5, n10) {
      return r5 instanceof te ? new un({ keyType: t5, valueType: r5, typeName: q.ZodRecord, ...ee(n10) }) : new un({ keyType: vt.create(), valueType: t5, typeName: q.ZodRecord, ...ee(r5) });
    }
  }, ha = class extends te {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(t5) {
      let { status: r5, ctx: n10 } = this._processInputParams(t5);
      if (n10.parsedType !== B2.map) return M2(n10, { code: k2.invalid_type, expected: B2.map, received: n10.parsedType }), $;
      let a2 = this._def.keyType, o10 = this._def.valueType, i10 = [...n10.data.entries()].map(([l2, d3], u3) => ({ key: a2._parse(new It(n10, l2, n10.path, [u3, "key"])), value: o10._parse(new It(n10, d3, n10.path, [u3, "value"])) }));
      if (n10.common.async) {
        let l2 = /* @__PURE__ */ new Map();
        return Promise.resolve().then(async () => {
          for (let d3 of i10) {
            let u3 = await d3.key, c10 = await d3.value;
            if (u3.status === "aborted" || c10.status === "aborted") return $;
            (u3.status === "dirty" || c10.status === "dirty") && r5.dirty(), l2.set(u3.value, c10.value);
          }
          return { status: r5.value, value: l2 };
        });
      } else {
        let l2 = /* @__PURE__ */ new Map();
        for (let d3 of i10) {
          let u3 = d3.key, c10 = d3.value;
          if (u3.status === "aborted" || c10.status === "aborted") return $;
          (u3.status === "dirty" || c10.status === "dirty") && r5.dirty(), l2.set(u3.value, c10.value);
        }
        return { status: r5.value, value: l2 };
      }
    }
  };
  ha.create = (e10, t5, r5) => new ha({ valueType: t5, keyType: e10, typeName: q.ZodMap, ...ee(r5) });
  var wr = class extends te {
    _parse(t5) {
      let { status: r5, ctx: n10 } = this._processInputParams(t5);
      if (n10.parsedType !== B2.set) return M2(n10, { code: k2.invalid_type, expected: B2.set, received: n10.parsedType }), $;
      let a2 = this._def;
      a2.minSize !== null && n10.data.size < a2.minSize.value && (M2(n10, { code: k2.too_small, minimum: a2.minSize.value, type: "set", inclusive: !0, exact: !1, message: a2.minSize.message }), r5.dirty()), a2.maxSize !== null && n10.data.size > a2.maxSize.value && (M2(n10, { code: k2.too_big, maximum: a2.maxSize.value, type: "set", inclusive: !0, exact: !1, message: a2.maxSize.message }), r5.dirty());
      let o10 = this._def.valueType;
      function i10(d3) {
        let u3 = /* @__PURE__ */ new Set();
        for (let c10 of d3) {
          if (c10.status === "aborted") return $;
          c10.status === "dirty" && r5.dirty(), u3.add(c10.value);
        }
        return { status: r5.value, value: u3 };
      }
      let l2 = [...n10.data.values()].map((d3, u3) => o10._parse(new It(n10, d3, n10.path, u3)));
      return n10.common.async ? Promise.all(l2).then((d3) => i10(d3)) : i10(l2);
    }
    min(t5, r5) {
      return new wr({ ...this._def, minSize: { value: t5, message: H.toString(r5) } });
    }
    max(t5, r5) {
      return new wr({ ...this._def, maxSize: { value: t5, message: H.toString(r5) } });
    }
    size(t5, r5) {
      return this.min(t5, r5).max(t5, r5);
    }
    nonempty(t5) {
      return this.min(1, t5);
    }
  };
  wr.create = (e10, t5) => new wr({ valueType: e10, minSize: null, maxSize: null, typeName: q.ZodSet, ...ee(t5) });
  var Hr = class extends te {
    constructor() {
      super(...arguments), this.validate = this.implement;
    }
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5);
      if (r5.parsedType !== B2.function) return M2(r5, { code: k2.invalid_type, expected: B2.function, received: r5.parsedType }), $;
      function n10(l2, d3) {
        return eo({ data: l2, path: r5.path, errorMaps: [r5.common.contextualErrorMap, r5.schemaErrorMap, da(), hr].filter((u3) => !!u3), issueData: { code: k2.invalid_arguments, argumentsError: d3 } });
      }
      function a2(l2, d3) {
        return eo({ data: l2, path: r5.path, errorMaps: [r5.common.contextualErrorMap, r5.schemaErrorMap, da(), hr].filter((u3) => !!u3), issueData: { code: k2.invalid_return_type, returnTypeError: d3 } });
      }
      let o10 = { errorMap: r5.common.contextualErrorMap }, i10 = r5.data;
      if (this._def.returns instanceof Vr) {
        let l2 = this;
        return Xe(async function(...d3) {
          let u3 = new Ke([]), c10 = await l2._def.args.parseAsync(d3, o10).catch((m8) => {
            throw u3.addIssue(n10(d3, m8)), u3;
          }), p5 = await Reflect.apply(i10, this, c10);
          return await l2._def.returns._def.type.parseAsync(p5, o10).catch((m8) => {
            throw u3.addIssue(a2(p5, m8)), u3;
          });
        });
      } else {
        let l2 = this;
        return Xe(function(...d3) {
          let u3 = l2._def.args.safeParse(d3, o10);
          if (!u3.success) throw new Ke([n10(d3, u3.error)]);
          let c10 = Reflect.apply(i10, this, u3.data), p5 = l2._def.returns.safeParse(c10, o10);
          if (!p5.success) throw new Ke([a2(c10, p5.error)]);
          return p5.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...t5) {
      return new Hr({ ...this._def, args: Et.create(t5).rest(vr.create()) });
    }
    returns(t5) {
      return new Hr({ ...this._def, returns: t5 });
    }
    implement(t5) {
      return this.parse(t5);
    }
    strictImplement(t5) {
      return this.parse(t5);
    }
    static create(t5, r5, n10) {
      return new Hr({ args: t5 || Et.create([]).rest(vr.create()), returns: r5 || vr.create(), typeName: q.ZodFunction, ...ee(n10) });
    }
  }, cn = class extends te {
    get schema() {
      return this._def.getter();
    }
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5);
      return this._def.getter()._parse({ data: r5.data, path: r5.path, parent: r5 });
    }
  };
  cn.create = (e10, t5) => new cn({ getter: e10, typeName: q.ZodLazy, ...ee(t5) });
  var pn = class extends te {
    _parse(t5) {
      if (t5.data !== this._def.value) {
        let r5 = this._getOrReturnCtx(t5);
        return M2(r5, { received: r5.data, code: k2.invalid_literal, expected: this._def.value }), $;
      }
      return { status: "valid", value: t5.data };
    }
    get value() {
      return this._def.value;
    }
  };
  pn.create = (e10, t5) => new pn({ value: e10, typeName: q.ZodLiteral, ...ee(t5) });
  function hd(e10, t5) {
    return new or({ values: e10, typeName: q.ZodEnum, ...ee(t5) });
  }
  var or = class extends te {
    _parse(t5) {
      if (typeof t5.data != "string") {
        let r5 = this._getOrReturnCtx(t5), n10 = this._def.values;
        return M2(r5, { expected: oe.joinValues(n10), received: r5.parsedType, code: k2.invalid_type }), $;
      }
      if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(t5.data)) {
        let r5 = this._getOrReturnCtx(t5), n10 = this._def.values;
        return M2(r5, { received: r5.data, code: k2.invalid_enum_value, options: n10 }), $;
      }
      return Xe(t5.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      let t5 = {};
      for (let r5 of this._def.values) t5[r5] = r5;
      return t5;
    }
    get Values() {
      let t5 = {};
      for (let r5 of this._def.values) t5[r5] = r5;
      return t5;
    }
    get Enum() {
      let t5 = {};
      for (let r5 of this._def.values) t5[r5] = r5;
      return t5;
    }
    extract(t5, r5 = this._def) {
      return or.create(t5, { ...this._def, ...r5 });
    }
    exclude(t5, r5 = this._def) {
      return or.create(this.options.filter((n10) => !t5.includes(n10)), { ...this._def, ...r5 });
    }
  };
  or.create = hd;
  var fn = class extends te {
    _parse(t5) {
      let r5 = oe.getValidEnumValues(this._def.values), n10 = this._getOrReturnCtx(t5);
      if (n10.parsedType !== B2.string && n10.parsedType !== B2.number) {
        let a2 = oe.objectValues(r5);
        return M2(n10, { expected: oe.joinValues(a2), received: n10.parsedType, code: k2.invalid_type }), $;
      }
      if (this._cache || (this._cache = new Set(oe.getValidEnumValues(this._def.values))), !this._cache.has(t5.data)) {
        let a2 = oe.objectValues(r5);
        return M2(n10, { received: n10.data, code: k2.invalid_enum_value, options: a2 }), $;
      }
      return Xe(t5.data);
    }
    get enum() {
      return this._def.values;
    }
  };
  fn.create = (e10, t5) => new fn({ values: e10, typeName: q.ZodNativeEnum, ...ee(t5) });
  var Vr = class extends te {
    unwrap() {
      return this._def.type;
    }
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5);
      if (r5.parsedType !== B2.promise && r5.common.async === !1) return M2(r5, { code: k2.invalid_type, expected: B2.promise, received: r5.parsedType }), $;
      let n10 = r5.parsedType === B2.promise ? r5.data : Promise.resolve(r5.data);
      return Xe(n10.then((a2) => this._def.type.parseAsync(a2, { path: r5.path, errorMap: r5.common.contextualErrorMap })));
    }
  };
  Vr.create = (e10, t5) => new Vr({ type: e10, typeName: q.ZodPromise, ...ee(t5) });
  var Tt = class extends te {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === q.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(t5) {
      let { status: r5, ctx: n10 } = this._processInputParams(t5), a2 = this._def.effect || null, o10 = { addIssue: (i10) => {
        M2(n10, i10), i10.fatal ? r5.abort() : r5.dirty();
      }, get path() {
        return n10.path;
      } };
      if (o10.addIssue = o10.addIssue.bind(o10), a2.type === "preprocess") {
        let i10 = a2.transform(n10.data, o10);
        if (n10.common.async) return Promise.resolve(i10).then(async (l2) => {
          if (r5.value === "aborted") return $;
          let d3 = await this._def.schema._parseAsync({ data: l2, path: n10.path, parent: n10 });
          return d3.status === "aborted" ? $ : d3.status === "dirty" || r5.value === "dirty" ? nn(d3.value) : d3;
        });
        {
          if (r5.value === "aborted") return $;
          let l2 = this._def.schema._parseSync({ data: i10, path: n10.path, parent: n10 });
          return l2.status === "aborted" ? $ : l2.status === "dirty" || r5.value === "dirty" ? nn(l2.value) : l2;
        }
      }
      if (a2.type === "refinement") {
        let i10 = (l2) => {
          let d3 = a2.refinement(l2, o10);
          if (n10.common.async) return Promise.resolve(d3);
          if (d3 instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          return l2;
        };
        if (n10.common.async === !1) {
          let l2 = this._def.schema._parseSync({ data: n10.data, path: n10.path, parent: n10 });
          return l2.status === "aborted" ? $ : (l2.status === "dirty" && r5.dirty(), i10(l2.value), { status: r5.value, value: l2.value });
        } else return this._def.schema._parseAsync({ data: n10.data, path: n10.path, parent: n10 }).then((l2) => l2.status === "aborted" ? $ : (l2.status === "dirty" && r5.dirty(), i10(l2.value).then(() => ({ status: r5.value, value: l2.value }))));
      }
      if (a2.type === "transform") if (n10.common.async === !1) {
        let i10 = this._def.schema._parseSync({ data: n10.data, path: n10.path, parent: n10 });
        if (!Rr(i10)) return $;
        let l2 = a2.transform(i10.value, o10);
        if (l2 instanceof Promise) throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: r5.value, value: l2 };
      } else return this._def.schema._parseAsync({ data: n10.data, path: n10.path, parent: n10 }).then((i10) => Rr(i10) ? Promise.resolve(a2.transform(i10.value, o10)).then((l2) => ({ status: r5.value, value: l2 })) : $);
      oe.assertNever(a2);
    }
  };
  Tt.create = (e10, t5, r5) => new Tt({ schema: e10, typeName: q.ZodEffects, effect: t5, ...ee(r5) });
  Tt.createWithPreprocess = (e10, t5, r5) => new Tt({ schema: t5, effect: { type: "preprocess", transform: e10 }, typeName: q.ZodEffects, ...ee(r5) });
  var kt = class extends te {
    _parse(t5) {
      return this._getType(t5) === B2.undefined ? Xe(void 0) : this._def.innerType._parse(t5);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  kt.create = (e10, t5) => new kt({ innerType: e10, typeName: q.ZodOptional, ...ee(t5) });
  var ir = class extends te {
    _parse(t5) {
      return this._getType(t5) === B2.null ? Xe(null) : this._def.innerType._parse(t5);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ir.create = (e10, t5) => new ir({ innerType: e10, typeName: q.ZodNullable, ...ee(t5) });
  var mn = class extends te {
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5), n10 = r5.data;
      return r5.parsedType === B2.undefined && (n10 = this._def.defaultValue()), this._def.innerType._parse({ data: n10, path: r5.path, parent: r5 });
    }
    removeDefault() {
      return this._def.innerType;
    }
  };
  mn.create = (e10, t5) => new mn({ innerType: e10, typeName: q.ZodDefault, defaultValue: typeof t5.default == "function" ? t5.default : () => t5.default, ...ee(t5) });
  var hn = class extends te {
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5), n10 = { ...r5, common: { ...r5.common, issues: [] } }, a2 = this._def.innerType._parse({ data: n10.data, path: n10.path, parent: { ...n10 } });
      return ua(a2) ? a2.then((o10) => ({ status: "valid", value: o10.status === "valid" ? o10.value : this._def.catchValue({ get error() {
        return new Ke(n10.common.issues);
      }, input: n10.data }) })) : { status: "valid", value: a2.status === "valid" ? a2.value : this._def.catchValue({ get error() {
        return new Ke(n10.common.issues);
      }, input: n10.data }) };
    }
    removeCatch() {
      return this._def.innerType;
    }
  };
  hn.create = (e10, t5) => new hn({ innerType: e10, typeName: q.ZodCatch, catchValue: typeof t5.catch == "function" ? t5.catch : () => t5.catch, ...ee(t5) });
  var ga = class extends te {
    _parse(t5) {
      if (this._getType(t5) !== B2.nan) {
        let n10 = this._getOrReturnCtx(t5);
        return M2(n10, { code: k2.invalid_type, expected: B2.nan, received: n10.parsedType }), $;
      }
      return { status: "valid", value: t5.data };
    }
  };
  ga.create = (e10) => new ga({ typeName: q.ZodNaN, ...ee(e10) });
  var c7 = /* @__PURE__ */ Symbol("zod_brand"), to = class extends te {
    _parse(t5) {
      let { ctx: r5 } = this._processInputParams(t5), n10 = r5.data;
      return this._def.type._parse({ data: n10, path: r5.path, parent: r5 });
    }
    unwrap() {
      return this._def.type;
    }
  }, gn = class extends te {
    _parse(t5) {
      let { status: r5, ctx: n10 } = this._processInputParams(t5);
      if (n10.common.async) return (async () => {
        let o10 = await this._def.in._parseAsync({ data: n10.data, path: n10.path, parent: n10 });
        return o10.status === "aborted" ? $ : o10.status === "dirty" ? (r5.dirty(), nn(o10.value)) : this._def.out._parseAsync({ data: o10.value, path: n10.path, parent: n10 });
      })();
      {
        let a2 = this._def.in._parseSync({ data: n10.data, path: n10.path, parent: n10 });
        return a2.status === "aborted" ? $ : a2.status === "dirty" ? (r5.dirty(), { status: "dirty", value: a2.value }) : this._def.out._parseSync({ data: a2.value, path: n10.path, parent: n10 });
      }
    }
    static create(t5, r5) {
      return new gn({ in: t5, out: r5, typeName: q.ZodPipeline });
    }
  }, vn = class extends te {
    _parse(t5) {
      let r5 = this._def.innerType._parse(t5), n10 = (a2) => (Rr(a2) && (a2.value = Object.freeze(a2.value)), a2);
      return ua(r5) ? r5.then((a2) => n10(a2)) : n10(r5);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  vn.create = (e10, t5) => new vn({ innerType: e10, typeName: q.ZodReadonly, ...ee(t5) });
  function cd(e10, t5) {
    let r5 = typeof e10 == "function" ? e10(t5) : typeof e10 == "string" ? { message: e10 } : e10;
    return typeof r5 == "string" ? { message: r5 } : r5;
  }
  function gd(e10, t5 = {}, r5) {
    return e10 ? Dr.create().superRefine((n10, a2) => {
      let o10 = e10(n10);
      if (o10 instanceof Promise) return o10.then((i10) => {
        if (!i10) {
          let l2 = cd(t5, n10), d3 = l2.fatal ?? r5 ?? !0;
          a2.addIssue({ code: "custom", ...l2, fatal: d3 });
        }
      });
      if (!o10) {
        let i10 = cd(t5, n10), l2 = i10.fatal ?? r5 ?? !0;
        a2.addIssue({ code: "custom", ...i10, fatal: l2 });
      }
    }) : Dr.create();
  }
  var p7 = { object: ke.lazycreate }, q;
  (function(e10) {
    e10.ZodString = "ZodString", e10.ZodNumber = "ZodNumber", e10.ZodNaN = "ZodNaN", e10.ZodBigInt = "ZodBigInt", e10.ZodBoolean = "ZodBoolean", e10.ZodDate = "ZodDate", e10.ZodSymbol = "ZodSymbol", e10.ZodUndefined = "ZodUndefined", e10.ZodNull = "ZodNull", e10.ZodAny = "ZodAny", e10.ZodUnknown = "ZodUnknown", e10.ZodNever = "ZodNever", e10.ZodVoid = "ZodVoid", e10.ZodArray = "ZodArray", e10.ZodObject = "ZodObject", e10.ZodUnion = "ZodUnion", e10.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e10.ZodIntersection = "ZodIntersection", e10.ZodTuple = "ZodTuple", e10.ZodRecord = "ZodRecord", e10.ZodMap = "ZodMap", e10.ZodSet = "ZodSet", e10.ZodFunction = "ZodFunction", e10.ZodLazy = "ZodLazy", e10.ZodLiteral = "ZodLiteral", e10.ZodEnum = "ZodEnum", e10.ZodEffects = "ZodEffects", e10.ZodNativeEnum = "ZodNativeEnum", e10.ZodOptional = "ZodOptional", e10.ZodNullable = "ZodNullable", e10.ZodDefault = "ZodDefault", e10.ZodCatch = "ZodCatch", e10.ZodPromise = "ZodPromise", e10.ZodBranded = "ZodBranded", e10.ZodPipeline = "ZodPipeline", e10.ZodReadonly = "ZodReadonly";
  })(q || (q = {}));
  var f7 = (e10, t5 = { message: `Input not instance of ${e10.name}` }) => gd((r5) => r5 instanceof e10, t5), vd = vt.create, yd = nr.create, m7 = ga.create, h7 = ar.create, wd = an.create, g7 = yr.create, v7 = pa.create, y7 = on.create, w7 = sn.create, b7 = Dr.create, S7 = vr.create, x7 = Rt.create, C7 = fa.create, k7 = yt.create, I7 = ke.create, E7 = ke.strictCreate, T7 = ln.create, M7 = ma.create, L7 = dn.create, A7 = Et.create, B7 = un.create, _7 = ha.create, F7 = wr.create, P7 = Hr.create, O7 = cn.create, N7 = pn.create, R7 = or.create, H7 = fn.create, D7 = Vr.create, V7 = Tt.create, z7 = kt.create, Z7 = ir.create, j7 = Tt.createWithPreprocess, U7 = gn.create, $7 = () => vd().optional(), W7 = () => yd().optional(), q7 = () => wd().optional(), G7 = { string: (e10) => vt.create({ ...e10, coerce: !0 }), number: (e10) => nr.create({ ...e10, coerce: !0 }), boolean: (e10) => an.create({ ...e10, coerce: !0 }), bigint: (e10) => ar.create({ ...e10, coerce: !0 }), date: (e10) => yr.create({ ...e10, coerce: !0 }) }, Q7 = $, J7 = Mt.union([Mt.object({ message: Mt.literal("login") }), Mt.object({ message: Mt.literal("grant"), denied: Mt.boolean() }), Mt.object({ message: Mt.literal("createdProject"), projectId: Mt.string() })]), Ei = (e10) => {
    let t5 = useRef(), r5 = useRef();
    return useEffect(() => {
      let n10 = ({ origin: a2, data: o10 }) => {
        if (a2 === r5.current) {
          let i10;
          try {
            i10 = J7.parse(o10);
          } catch {
            return;
          }
          e10?.(i10);
        }
      };
      return window.addEventListener("message", n10), () => window.removeEventListener("message", n10);
    }, [e10]), [useCallback((n10) => {
      if (window.innerWidth > 800 && window.innerHeight > 800) {
        let d3 = (window.innerWidth - 800) / 2 + window.screenLeft, c10 = `scrollbars=yes,width=800,height=800,top=${(window.innerHeight - 800) / 2 + window.screenTop},left=${d3}`;
        t5.current = window.open(n10, "chromatic-dialog", c10), t5.current?.focus();
      } else t5.current = window.open(n10, "_blank");
      let { origin: l2 } = new URL(n10);
      r5.current = l2;
    }, []), useCallback(() => t5.current?.close(), [])];
  }, e3 = styled.ol(({ theme: e10 }) => ({ display: "inline-flex", listStyle: "none", marginTop: 15, marginBottom: 5, padding: 0, gap: 5, "li:not(:empty)": { display: "flex", alignItems: "center", justifyContent: "center", border: `1px dashed ${e10.input.border}`, borderRadius: 4, width: 28, height: 32 } })), t3 = Je(`
  query VisualTestsProjectCountQuery {
    viewer {
      projectCount
      accounts {
        newProjectUrl
      }
    }
  }
`), xd = ({ onBack: e10, hasProjectId: t5, setAccessToken: r5, setCreatedProjectId: n10, exchangeParameters: a2 }) => {
    let o10 = Si(), i10 = Jo(), { user_code: l2, verificationUrl: d3 } = a2, u3 = useRef(), c10 = useRef(), p5 = useRef(), f4 = useCallback(async (g3) => {
      if (g3.message === "login" && c10.current?.(d3), g3.message === "grant") try {
        let w2 = await Fl(a2);
        if (!w2) throw new Error("Failed to fetch an access token");
        u3.current = w2;
        let y10 = s0(w2), { data: v5 } = await o10.query(t3, {}, { fetchOptions: y10 });
        if (!v5?.viewer) throw new Error("Failed to fetch initial project list");
        if (v5.viewer.projectCount > 0 || t5) r5(u3.current), p5.current?.();
        else {
          if (!v5.viewer.accounts[0]) throw new Error("User has no accounts!");
          if (!v5.viewer.accounts[0].newProjectUrl) throw new Error("Unexpected missing project URL");
          c10.current?.(v5.viewer.accounts[0].newProjectUrl);
        }
      } catch (w2) {
        i10("Login Error", w2);
      }
      g3.message === "createdProject" && (u3.current ? (r5(u3.current), n10(`Project:${g3.projectId}`), p5.current?.()) : i10("Unexpected missing access token", new Error()));
    }, [d3, a2, o10, t5, r5, i10, n10]), [m8, h2] = Ei(f4);
    return c10.current = m8, p5.current = h2, react_default.createElement(K, { footer: null, ignoreConfig: !0 }, react_default.createElement(Xn, { onBack: e10 }), react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Verify your account"), react_default.createElement("div", null, react_default.createElement(L2, { center: !0, muted: !0 }, "Check this verification code on Chromatic to grant access to your published Storybooks.")), react_default.createElement(e3, null, l2?.split("").map((g3, w2) => react_default.createElement("li", { key: `${w2}-${g3}` }, g3.replace(/[^A-Z0-9]/, ""))))), react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", onClick: () => m8(d3) }, "Go to Chromatic"))));
  }, Ti = (e10) => react_default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e10 }, react_default.createElement("path", { d: "M5.06982 9.68493L7.99484 4.63927L14.5786 4.62406C14.5252 4.52043 14.4696 4.41742 14.4109 4.31532C12.372 0.768556 7.84405 -0.453864 4.29726 1.58495C3.24614 2.1892 2.39921 3.01211 1.78076 3.96327L5.06982 9.68493Z", fill: "#DB4437" }), react_default.createElement("path", { d: "M10.9276 9.68457L5.09539 9.6743L1.79036 3.98022C1.72727 4.07822 1.66591 4.17795 1.60682 4.27985C-0.445348 7.81892 0.759985 12.3515 4.29905 14.4037C5.34791 15.0118 6.48403 15.3338 7.617 15.3939L10.9276 9.68457Z", fill: "#0F9D58" }), react_default.createElement("path", { d: "M7.98649 4.61194L10.9032 9.66241L7.63525 15.3778C7.75167 15.3833 7.86871 15.3863 7.98649 15.3863C12.0775 15.3863 15.3939 12.0699 15.3939 7.97893C15.3939 6.76648 15.1025 5.62211 14.5861 4.61194L7.98649 4.61194Z", fill: "#FFCD40" }), react_default.createElement("path", { d: "M8.01367 4.6366V6.40005L14.613 4.6366H8.01367Z", fill: "url(#paint0_radial_466_21161)" }), react_default.createElement("path", { d: "M1.78198 4.00098L6.60102 8.8192L5.09764 9.687L1.78198 4.00098Z", fill: "url(#paint1_radial_466_21161)" }), react_default.createElement("path", { d: "M7.6626 15.4017L9.42689 8.81921L10.9303 9.68702L7.6626 15.4017Z", fill: "url(#paint2_radial_466_21161)" }), react_default.createElement("ellipse", { cx: "8.01347", cy: "8.00358", rx: "3.36699", ry: "3.36699", fill: "#F1F1F1" }), react_default.createElement("ellipse", { cx: "8.01367", cy: "8.00354", rx: "2.69361", ry: "2.6936", fill: "#4285F4" }), react_default.createElement("defs", null, react_default.createElement("radialGradient", { id: "paint0_radial_466_21161", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(7.69229 4.63226) scale(7.07721 1.89116)" }, react_default.createElement("stop", { stopColor: "#3E2723", stopOpacity: "0.2" }), react_default.createElement("stop", { offset: "1", stopColor: "#3E2723", stopOpacity: "0.01" })), react_default.createElement("radialGradient", { id: "paint1_radial_466_21161", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(1.77445 4.00677) scale(6.56938 7.75127)" }, react_default.createElement("stop", { stopColor: "#3E2723", stopOpacity: "0.2" }), react_default.createElement("stop", { offset: "1", stopColor: "#3E2723", stopOpacity: "0.01" })), react_default.createElement("radialGradient", { id: "paint2_radial_466_21161", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(8.00025 8.01489) scale(7.39644 14.8995)" }, react_default.createElement("stop", { stopColor: "#263238", stopOpacity: "0.2" }), react_default.createElement("stop", { offset: "1", stopColor: "#263238", stopOpacity: "0.01" })))), Mi = (e10) => react_default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e10 }, react_default.createElement("path", { d: "M14.9596 5.19849C14.6332 4.41337 13.9721 3.56574 13.453 3.29783C13.8755 4.12612 14.12 4.95699 14.2134 5.57708C14.2134 5.5783 14.2139 5.58133 14.2149 5.58958C13.3657 3.47293 11.9257 2.61943 10.7499 0.761053C10.6905 0.667084 10.631 0.572865 10.573 0.473553C10.5434 0.422834 10.5159 0.371004 10.4903 0.318178C10.4414 0.223861 10.4038 0.124166 10.378 0.0211155C10.3782 0.0162369 10.3765 0.0114673 10.3734 0.00774353C10.3702 0.0040198 10.3658 0.00161108 10.3609 0.000990505C10.3563 -0.000330168 10.3515 -0.000330168 10.3468 0.000990505C10.3458 0.0013655 10.3442 0.00258425 10.3431 0.00302175C10.3414 0.003678 10.3393 0.005178 10.3376 0.00614675C10.3384 0.00502175 10.3402 0.0024905 10.3407 0.00189675C8.45416 1.10677 7.81416 3.15068 7.75535 4.17327C7.00199 4.22506 6.28171 4.50262 5.68841 4.96977C5.62629 4.9173 5.56135 4.86827 5.49388 4.8229C5.3227 4.22402 5.31543 3.59017 5.47282 2.98752C4.70132 3.3388 4.10126 3.89408 3.66501 4.3844H3.66154C3.36382 4.0073 3.38482 2.76337 3.40179 2.50365C3.39822 2.48755 3.17969 2.61708 3.15107 2.63662C2.88835 2.82414 2.64275 3.03454 2.41713 3.26537C2.16039 3.52573 1.92581 3.80705 1.71582 4.1064C1.71582 4.10677 1.7156 4.10721 1.71547 4.10758C1.71547 4.10718 1.71569 4.10677 1.71582 4.1064C1.23289 4.79075 0.890387 5.56404 0.7081 6.38155C0.704506 6.39783 0.701475 6.41471 0.697975 6.43112C0.68385 6.49724 0.632975 6.82799 0.624068 6.89987C0.623381 6.9054 0.623068 6.91071 0.622412 6.91624C0.556638 7.2582 0.515905 7.60451 0.500537 7.9524C0.500537 7.96521 0.499756 7.9779 0.499756 7.99074C0.499881 12.138 3.86238 15.5 8.01001 15.5C11.7245 15.5 14.8088 12.8035 15.4126 9.26152C15.4253 9.1654 15.4355 9.06877 15.4467 8.9718C15.596 7.68399 15.4301 6.3304 14.9596 5.19849ZM6.30351 11.0764C6.33863 11.0932 6.37163 11.1116 6.40769 11.1276C6.40919 11.1287 6.41126 11.1298 6.41279 11.1308C6.37608 11.1132 6.33965 11.0951 6.30351 11.0764ZM14.2155 5.59143L14.2145 5.58415C14.2149 5.5868 14.2153 5.58958 14.2158 5.59224L14.2155 5.59143Z", fill: "url(#paint0_linear_466_21172)" }), react_default.createElement("path", { d: "M14.9598 5.19851C14.6334 4.41338 13.9723 3.56576 13.4532 3.29785C13.8757 4.12613 14.1202 4.95701 14.2136 5.5771C14.2136 5.57529 14.214 5.5786 14.2148 5.58416C14.2151 5.58682 14.2156 5.5896 14.216 5.59226C14.9246 7.5132 14.5386 9.46657 13.9823 10.6602C13.1217 12.5071 11.0381 14.3999 7.77678 14.3076C4.25319 14.2078 1.149 11.5934 0.569531 8.16904C0.463937 7.62904 0.569531 7.35485 0.622656 6.91641C0.557938 7.25441 0.533281 7.35204 0.500781 7.95257C0.500781 7.96538 0.5 7.97807 0.5 7.99091C0.500063 12.138 3.86256 15.5 8.01019 15.5C11.7247 15.5 14.8089 12.8035 15.4128 9.26154C15.4255 9.16541 15.4357 9.06879 15.4469 8.97182C15.5962 7.68401 15.4303 6.33041 14.9598 5.19851Z", fill: "url(#paint1_radial_466_21172)" }), react_default.createElement("path", { d: "M14.9598 5.19851C14.6334 4.41338 13.9723 3.56576 13.4532 3.29785C13.8757 4.12613 14.1202 4.95701 14.2136 5.5771C14.2136 5.57529 14.214 5.5786 14.2148 5.58416C14.2151 5.58682 14.2156 5.5896 14.216 5.59226C14.9246 7.5132 14.5386 9.46657 13.9823 10.6602C13.1217 12.5071 11.0381 14.3999 7.77678 14.3076C4.25319 14.2078 1.149 11.5934 0.569531 8.16904C0.463937 7.62904 0.569531 7.35485 0.622656 6.91641C0.557938 7.25441 0.533281 7.35204 0.500781 7.95257C0.500781 7.96538 0.5 7.97807 0.5 7.99091C0.500063 12.138 3.86256 15.5 8.01019 15.5C11.7247 15.5 14.8089 12.8035 15.4128 9.26154C15.4255 9.16541 15.4357 9.06879 15.4469 8.97182C15.5962 7.68401 15.4303 6.33041 14.9598 5.19851Z", fill: "url(#paint2_radial_466_21172)" }), react_default.createElement("path", { d: "M11.3101 6.08127C11.3265 6.09277 11.3413 6.10421 11.3567 6.11564C11.1683 5.78113 10.9336 5.47487 10.6596 5.20589C8.32502 2.87164 10.0474 0.144581 10.3379 0.00608106C10.3387 0.00495606 10.3405 0.0024248 10.341 0.00183105C8.45443 1.10671 7.81443 3.15061 7.75562 4.17321C7.84312 4.16714 7.93037 4.1598 8.01943 4.1598C9.42727 4.1598 10.6535 4.93386 11.3101 6.08127Z", fill: "url(#paint3_radial_466_21172)" }), react_default.createElement("path", { d: "M8.02405 6.54735C8.01177 6.73417 7.35173 7.37838 7.12092 7.37838C4.98533 7.37838 4.63867 8.6701 4.63867 8.6701C4.73327 9.75792 5.49058 10.6537 6.40777 11.1277C6.44961 11.1493 6.49195 11.1689 6.53433 11.1882C6.60698 11.2203 6.68054 11.2504 6.75492 11.2784C7.0694 11.3897 7.39881 11.4532 7.73214 11.4668C11.4753 11.6424 12.2005 6.99201 9.49917 5.64157C10.191 5.52126 10.909 5.79948 11.31 6.08117C10.6534 4.93385 9.4272 4.15979 8.01939 4.15979C7.93033 4.15979 7.84311 4.16713 7.75558 4.1732C7.00222 4.22499 6.28194 4.50255 5.68864 4.9697C5.80314 5.06657 5.93239 5.19607 6.2047 5.46432C6.71414 5.96642 8.02127 6.48635 8.02405 6.54735Z", fill: "url(#paint4_radial_466_21172)" }), react_default.createElement("path", { d: "M8.02405 6.54735C8.01177 6.73417 7.35173 7.37838 7.12092 7.37838C4.98533 7.37838 4.63867 8.6701 4.63867 8.6701C4.73327 9.75792 5.49058 10.6537 6.40777 11.1277C6.44961 11.1493 6.49195 11.1689 6.53433 11.1882C6.60698 11.2203 6.68054 11.2504 6.75492 11.2784C7.0694 11.3897 7.39881 11.4532 7.73214 11.4668C11.4753 11.6424 12.2005 6.99201 9.49917 5.64157C10.191 5.52126 10.909 5.79948 11.31 6.08117C10.6534 4.93385 9.4272 4.15979 8.01939 4.15979C7.93033 4.15979 7.84311 4.16713 7.75558 4.1732C7.00222 4.22499 6.28194 4.50255 5.68864 4.9697C5.80314 5.06657 5.93239 5.19607 6.2047 5.46432C6.71414 5.96642 8.02127 6.48635 8.02405 6.54735Z", fill: "url(#paint5_radial_466_21172)" }), react_default.createElement("path", { d: "M5.3385 4.71992C5.39081 4.75366 5.4427 4.78804 5.49416 4.82305C5.32298 4.22417 5.31571 3.59032 5.4731 2.98767C4.7016 3.33895 4.10153 3.89423 3.66528 4.38455C3.70138 4.38351 4.79072 4.36392 5.3385 4.71992Z", fill: "url(#paint6_radial_466_21172)" }), react_default.createElement("path", { d: "M0.569399 8.16902C1.14887 11.5933 4.25305 14.2078 7.77665 14.3076C11.0379 14.3999 13.1216 12.507 13.9821 10.6602C14.5384 9.46646 14.9245 7.51333 14.2159 5.59224L14.2156 5.59142L14.2146 5.58414C14.2138 5.57858 14.2134 5.57527 14.2135 5.57708C14.2135 5.5783 14.214 5.58133 14.215 5.58958C14.4813 7.32899 13.5965 9.01408 12.2134 10.1535L12.2092 10.1632C9.51406 12.3577 6.93502 11.4872 6.41284 11.1309C6.37613 11.1133 6.33967 11.0951 6.30346 11.0765C4.73215 10.3255 4.08302 8.89402 4.22221 7.66633C2.89543 7.66633 2.44302 6.5473 2.44302 6.5473C2.44302 6.5473 3.63424 5.69796 5.20421 6.43664C6.65827 7.1208 8.02384 6.54736 8.02399 6.5473C8.02121 6.4863 6.71409 5.96636 6.20452 5.4643C5.93224 5.19605 5.80296 5.06671 5.68846 4.96967C5.62634 4.91721 5.5614 4.86817 5.49393 4.8228C5.44241 4.78788 5.39052 4.7535 5.33827 4.71967C4.79052 4.36367 3.70115 4.38327 3.66505 4.38421H3.66159C3.36387 4.00711 3.38487 2.76317 3.40184 2.50346C3.39827 2.48736 3.17974 2.61689 3.15112 2.63642C2.8884 2.82395 2.6428 3.03435 2.41718 3.26517C2.16043 3.5256 1.92585 3.80698 1.71587 4.10639C1.71587 4.10677 1.71565 4.10721 1.71552 4.10758C1.71552 4.10717 1.71574 4.10677 1.71587 4.10639C1.23294 4.79075 0.890436 5.56403 0.708149 6.38155C0.704555 6.39783 0.437836 7.56411 0.569399 8.16902Z", fill: "url(#paint7_radial_466_21172)" }), react_default.createElement("path", { d: "M10.6595 5.2058C10.9335 5.47478 11.1682 5.78104 11.3566 6.11555C11.398 6.14662 11.4366 6.17759 11.4694 6.2078C13.172 7.77655 12.2799 9.9953 12.2134 10.1534C13.5965 9.01405 14.4813 7.32896 14.215 5.58955C13.3657 3.47293 11.9258 2.61943 10.7499 0.761053C10.6905 0.667084 10.631 0.572866 10.573 0.473553C10.5435 0.422834 10.5159 0.371004 10.4903 0.318178C10.4415 0.223861 10.4038 0.124166 10.3781 0.0211155C10.3782 0.0162369 10.3766 0.0114673 10.3734 0.00774353C10.3703 0.0040198 10.3658 0.00161108 10.361 0.000990505C10.3564 -0.000330168 10.3515 -0.000330168 10.3469 0.000990505C10.3458 0.0013655 10.3443 0.00258425 10.3431 0.00302176C10.3415 0.003678 10.3394 0.00517801 10.3376 0.00614676C10.0473 0.144522 8.32493 2.87158 10.6595 5.2058Z", fill: "url(#paint8_radial_466_21172)" }), react_default.createElement("path", { d: "M11.4694 6.20779C11.4366 6.17757 11.398 6.1466 11.3566 6.11554C11.3413 6.10404 11.3263 6.0926 11.31 6.08117C10.909 5.79948 10.1909 5.52126 9.49912 5.64157C12.2004 6.99201 11.4752 11.6424 7.73209 11.4668C7.39876 11.4532 7.06935 11.3897 6.75487 11.2784C6.6805 11.2504 6.60694 11.2203 6.53428 11.1882C6.4919 11.1689 6.44956 11.1493 6.40771 11.1277C6.40921 11.1287 6.41128 11.1299 6.41281 11.1308C6.935 11.4871 9.51403 12.3576 12.2092 10.1631L12.2133 10.1534C12.2799 9.99542 13.1719 7.77657 11.4694 6.20779Z", fill: "url(#paint9_radial_466_21172)" }), react_default.createElement("path", { d: "M4.63871 8.67006C4.63871 8.67006 4.98537 7.37834 7.12096 7.37834C7.35183 7.37834 8.01187 6.73412 8.02408 6.54731C8.0363 6.36049 6.65846 7.12081 5.2043 6.43665C3.63433 5.69796 2.44312 6.54731 2.44312 6.54731C2.44312 6.54731 2.89552 7.66634 4.2223 7.66634C4.08315 8.89402 4.73227 10.3257 6.30355 11.0765C6.33868 11.0932 6.37168 11.1116 6.40774 11.1277C5.49062 10.6537 4.7333 9.75787 4.63871 8.67006Z", fill: "url(#paint10_radial_466_21172)" }), react_default.createElement("path", { d: "M14.9597 5.19849C14.6333 4.41337 13.9722 3.56574 13.4531 3.29783C13.8756 4.12612 14.1201 4.95699 14.2136 5.57708C14.2136 5.5783 14.214 5.58133 14.215 5.58958C13.3658 3.47293 11.9258 2.61943 10.75 0.761053C10.6906 0.667084 10.6311 0.572865 10.5731 0.473553C10.5436 0.422834 10.516 0.371004 10.4904 0.318178C10.4416 0.223861 10.4039 0.124166 10.3781 0.0211155C10.3783 0.0162369 10.3767 0.0114673 10.3735 0.00774353C10.3703 0.0040198 10.3659 0.00161108 10.3611 0.000990505C10.3565 -0.000330168 10.3516 -0.000330168 10.347 0.000990505C10.3459 0.0013655 10.3443 0.00258425 10.3432 0.00302175C10.3416 0.003678 10.3395 0.005178 10.3377 0.00614675C10.3386 0.00502175 10.3403 0.0024905 10.3408 0.00189675C8.45428 1.10677 7.81428 3.15068 7.75547 4.17327C7.84297 4.16721 7.93022 4.15987 8.01928 4.15987C9.42719 4.15987 10.6534 4.93393 11.3099 6.08124C10.9089 5.79955 10.1908 5.52133 9.49906 5.64165C12.2003 6.99208 11.4752 11.6425 7.73203 11.4669C7.3987 11.4533 7.06929 11.3898 6.75481 11.2784C6.68044 11.2505 6.60688 11.2204 6.53422 11.1882C6.49184 11.1689 6.4495 11.1494 6.40766 11.1278C6.40916 11.1288 6.41122 11.13 6.41275 11.1309C6.37605 11.1132 6.33958 11.0951 6.30337 11.0764C6.3385 11.0932 6.3715 11.1116 6.40756 11.1276C5.49038 10.6536 4.73306 9.75786 4.63847 8.67005C4.63847 8.67005 4.98513 7.37833 7.12072 7.37833C7.35159 7.37833 8.01162 6.73412 8.02384 6.5473C8.02106 6.4863 6.71394 5.96637 6.20437 5.4643C5.93209 5.19605 5.80281 5.06671 5.68831 4.96968C5.62619 4.91721 5.56125 4.86818 5.49378 4.8228C5.3226 4.22393 5.31533 3.59008 5.47272 2.98743C4.70122 3.33871 4.10116 3.89399 3.66491 4.3843H3.66144C3.36372 4.00721 3.38472 2.76327 3.40169 2.50355C3.39812 2.48746 3.17959 2.61699 3.15097 2.63652C2.88825 2.82404 2.64265 3.03445 2.41703 3.26527C2.16036 3.52567 1.92585 3.80702 1.71594 4.1064C1.71594 4.10677 1.71572 4.10721 1.71559 4.10758C1.71559 4.10718 1.71581 4.10677 1.71594 4.1064C1.23301 4.79075 0.890506 5.56404 0.708219 6.38155C0.704625 6.39783 0.701594 6.41471 0.698094 6.43112C0.683969 6.49724 0.620406 6.83277 0.611531 6.90474C0.610844 6.91027 0.612187 6.89924 0.611531 6.90474C0.553567 7.25147 0.516583 7.60137 0.500781 7.95255C0.500781 7.96537 0.5 7.97805 0.5 7.9909C0.5 12.138 3.8625 15.5 8.01012 15.5C11.7247 15.5 14.8089 12.8035 15.4127 9.26152C15.4254 9.1654 15.4356 9.06877 15.4468 8.9718C15.5961 7.68399 15.4302 6.3304 14.9597 5.19849ZM14.2147 5.58415C14.2151 5.5868 14.2155 5.58958 14.2159 5.59224L14.2157 5.59143L14.2147 5.58415Z", fill: "url(#paint11_linear_466_21172)" }), react_default.createElement("defs", null, react_default.createElement("linearGradient", { id: "paint0_linear_466_21172", x1: "13.5874", y1: "2.40249", x2: "1.52839", y2: "14.0351", gradientUnits: "userSpaceOnUse" }, react_default.createElement("stop", { offset: "0.05", stopColor: "#FFF44F" }), react_default.createElement("stop", { offset: "0.37", stopColor: "#FF980E" }), react_default.createElement("stop", { offset: "0.53", stopColor: "#FF3647" }), react_default.createElement("stop", { offset: "0.7", stopColor: "#E31587" })), react_default.createElement("radialGradient", { id: "paint1_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(10.8936 1.72781) scale(15.3601 15.6187)" }, react_default.createElement("stop", { offset: "0.13", stopColor: "#FFBD4F" }), react_default.createElement("stop", { offset: "0.28", stopColor: "#FF980E" }), react_default.createElement("stop", { offset: "0.47", stopColor: "#FF3750" }), react_default.createElement("stop", { offset: "0.78", stopColor: "#EB0878" }), react_default.createElement("stop", { offset: "0.86", stopColor: "#E50080" })), react_default.createElement("radialGradient", { id: "paint2_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(6.43979 8.1787) scale(15.7441 15.6187)" }, react_default.createElement("stop", { offset: "0.3", stopColor: "#960E18" }), react_default.createElement("stop", { offset: "0.35", stopColor: "#B11927", stopOpacity: "0.74" }), react_default.createElement("stop", { offset: "0.43", stopColor: "#DB293D", stopOpacity: "0.34" }), react_default.createElement("stop", { offset: "0.5", stopColor: "#F5334B", stopOpacity: "0.09" }), react_default.createElement("stop", { offset: "0.53", stopColor: "#FF3750", stopOpacity: "0" })), react_default.createElement("radialGradient", { id: "paint3_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(9.48415 -0.731827) scale(5.04157 8.55934)" }, react_default.createElement("stop", { offset: "0.13", stopColor: "#FFF44F" }), react_default.createElement("stop", { offset: "0.53", stopColor: "#FF980E" })), react_default.createElement("radialGradient", { id: "paint4_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(6.15707 12.2109) scale(6.67134 7.31187)" }, react_default.createElement("stop", { offset: "0.35", stopColor: "#3A8EE6" }), react_default.createElement("stop", { offset: "0.67", stopColor: "#9059FF" }), react_default.createElement("stop", { offset: "1", stopColor: "#C139E6" })), react_default.createElement("radialGradient", { id: "paint5_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(7.29699 6.57271) scale(3.54248 4.314)" }, react_default.createElement("stop", { offset: "0.21", stopColor: "#9059FF", stopOpacity: "0" }), react_default.createElement("stop", { offset: "0.97", stopColor: "#6E008B", stopOpacity: "0.6" })), react_default.createElement("radialGradient", { id: "paint6_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(7.50592 1.1523) scale(5.30374 5.32259)" }, react_default.createElement("stop", { offset: "0.1", stopColor: "#FFE226" }), react_default.createElement("stop", { offset: "0.79", stopColor: "#FF7139" })), react_default.createElement("radialGradient", { id: "paint7_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(12.3495 -2.33951) scale(25.3212 21.2557)" }, react_default.createElement("stop", { offset: "0.11", stopColor: "#FFF44F" }), react_default.createElement("stop", { offset: "0.46", stopColor: "#FF980E" }), react_default.createElement("stop", { offset: "0.72", stopColor: "#FF3647" }), react_default.createElement("stop", { offset: "0.9", stopColor: "#E31587" })), react_default.createElement("radialGradient", { id: "paint8_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(2.94576 4.67997) rotate(77.3946) scale(8.03354 34.7519)" }, react_default.createElement("stop", { stopColor: "#FFF44F" }), react_default.createElement("stop", { offset: "0.3", stopColor: "#FF980E" }), react_default.createElement("stop", { offset: "0.57", stopColor: "#FF3647" }), react_default.createElement("stop", { offset: "0.74", stopColor: "#E31587" })), react_default.createElement("radialGradient", { id: "paint9_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(7.56027 3.06659) scale(14.5381 14.2827)" }, react_default.createElement("stop", { offset: "0.14", stopColor: "#FFF44F" }), react_default.createElement("stop", { offset: "0.48", stopColor: "#FF980E" }), react_default.createElement("stop", { offset: "0.66", stopColor: "#FF3647" }), react_default.createElement("stop", { offset: "0.9", stopColor: "#E31587" })), react_default.createElement("radialGradient", { id: "paint10_radial_466_21172", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(11.3337 3.90193) scale(17.4743 15.6328)" }, react_default.createElement("stop", { offset: "0.09", stopColor: "#FFF44F" }), react_default.createElement("stop", { offset: "0.63", stopColor: "#FF980E" })), react_default.createElement("linearGradient", { id: "paint11_linear_466_21172", x1: "12.5", y1: "2.16999", x2: "2.85701", y2: "12.7061", gradientUnits: "userSpaceOnUse" }, react_default.createElement("stop", { offset: "0.17", stopColor: "#FFF44F", stopOpacity: "0.8" }), react_default.createElement("stop", { offset: "0.6", stopColor: "#FFF44F", stopOpacity: "0" })))), Li = (e10) => react_default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e10 }, react_default.createElement("circle", { cx: "8.00009", cy: "7.99997", r: "7.7037", fill: "url(#paint0_linear_466_21186)" }), react_default.createElement("ellipse", { cx: "8.00094", cy: "8.00094", rx: "7.06173", ry: "7.06173", fill: "url(#paint1_radial_466_21186)" }), react_default.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.07134 1.36353C8.03043 1.36353 7.99727 1.39669 7.99727 1.4376V2.56469C7.99727 2.6056 8.03043 2.63877 8.07134 2.63877C8.11225 2.63877 8.14542 2.6056 8.14542 2.56469V1.4376C8.14542 1.39669 8.11225 1.36353 8.07134 1.36353ZM8.07134 14.7792C8.11225 14.7792 8.14542 14.746 8.14542 14.7051V13.578C8.14542 13.5371 8.11225 13.5039 8.07134 13.5039C8.03043 13.5039 7.99727 13.5371 7.99727 13.578V14.7051C7.99727 14.746 8.03043 14.7792 8.07134 14.7792ZM8.64883 1.46214C8.65292 1.42143 8.68923 1.39175 8.72994 1.39584C8.77064 1.39993 8.80032 1.43625 8.79623 1.47695L8.74793 1.95766C8.74384 1.99836 8.70752 2.02804 8.66682 2.02395C8.62612 2.01986 8.59643 1.98355 8.60052 1.94284L8.64883 1.46214ZM7.41372 14.7468C7.45442 14.7509 7.49074 14.7213 7.49483 14.6806L7.54313 14.1998C7.54722 14.1591 7.51754 14.1228 7.47683 14.1187C7.43613 14.1146 7.39982 14.1443 7.39573 14.185L7.34742 14.6657C7.34333 14.7064 7.37301 14.7428 7.41372 14.7468ZM14.7051 7.99727C14.746 7.99727 14.7792 8.03043 14.7792 8.07134C14.7792 8.11225 14.746 8.14542 14.7051 8.14542H13.578C13.5371 8.14542 13.5039 8.11225 13.5039 8.07134C13.5039 8.03043 13.5371 7.99727 13.578 7.99727H14.7051ZM1.36353 8.07134C1.36353 8.11225 1.39669 8.14542 1.4376 8.14542H2.56469C2.6056 8.14542 2.63877 8.11225 2.63877 8.07134C2.63877 8.03043 2.6056 7.99727 2.56469 7.99727H1.4376C1.39669 7.99727 1.36353 8.03043 1.36353 8.07134ZM14.6806 8.64883C14.7213 8.65292 14.7509 8.68923 14.7468 8.72994C14.7428 8.77064 14.7064 8.80032 14.6657 8.79623L14.185 8.74793C14.1443 8.74384 14.1146 8.70752 14.1187 8.66682C14.1228 8.62612 14.1591 8.59643 14.1998 8.60052L14.6806 8.64883ZM1.39584 7.41372C1.39175 7.45442 1.42143 7.49074 1.46214 7.49483L1.94284 7.54313C1.98355 7.54722 2.01986 7.51754 2.02395 7.47683C2.02804 7.43613 1.99836 7.39982 1.95766 7.39573L1.47695 7.34742C1.43625 7.34333 1.39993 7.37301 1.39584 7.41372ZM12.7097 3.3282C12.7387 3.29927 12.7856 3.29927 12.8145 3.3282C12.8434 3.35713 12.8434 3.40403 12.8145 3.43296L12.0175 4.22994C11.9886 4.25887 11.9417 4.25887 11.9127 4.22994C11.8838 4.20101 11.8838 4.15411 11.9127 4.12518L12.7097 3.3282ZM3.3282 12.8145C3.35713 12.8434 3.40403 12.8434 3.43296 12.8145L4.22994 12.0175C4.25887 11.9886 4.25887 11.9417 4.22994 11.9127C4.20101 11.8838 4.15411 11.8838 4.12518 11.9127L3.3282 12.7097C3.29927 12.7387 3.29927 12.7856 3.3282 12.8145ZM13.1523 3.80568C13.1839 3.77973 13.2306 3.78433 13.2566 3.81595C13.2825 3.84757 13.2779 3.89425 13.2463 3.9202L12.8729 4.22664C12.8413 4.2526 12.7946 4.248 12.7686 4.21638C12.7427 4.18475 12.7473 4.13808 12.7789 4.11212L13.1523 3.80568ZM2.88614 12.3267C2.91209 12.3584 2.95876 12.363 2.99039 12.337L3.36378 12.0306C3.3954 12.0046 3.4 11.9579 3.37404 11.9263C3.34809 11.8947 3.30142 11.8901 3.26979 11.916L2.8964 12.2225C2.86478 12.2484 2.86018 12.2951 2.88614 12.3267ZM12.8145 12.7097C12.8434 12.7387 12.8434 12.7856 12.8145 12.8145C12.7856 12.8434 12.7387 12.8434 12.7097 12.8145L11.9127 12.0175C11.8838 11.9886 11.8838 11.9417 11.9127 11.9127C11.9417 11.8838 11.9886 11.8838 12.0175 11.9127L12.8145 12.7097ZM3.3282 3.3282C3.29927 3.35713 3.29927 3.40403 3.3282 3.43296L4.12518 4.22994C4.15411 4.25887 4.20101 4.25887 4.22994 4.22994C4.25887 4.20101 4.25887 4.15411 4.22994 4.12518L3.43296 3.3282C3.40403 3.29927 3.35713 3.29927 3.3282 3.3282ZM12.337 13.1523C12.363 13.1839 12.3584 13.2306 12.3267 13.2566C12.2951 13.2825 12.2484 13.2779 12.2225 13.2463L11.916 12.8729C11.8901 12.8413 11.8947 12.7946 11.9263 12.7686C11.9579 12.7427 12.0046 12.7473 12.0306 12.7789L12.337 13.1523ZM3.81595 2.88614C3.78433 2.91209 3.77973 2.95876 3.80568 2.99039L4.11212 3.36378C4.13808 3.3954 4.18475 3.4 4.21638 3.37404C4.248 3.34809 4.2526 3.30142 4.22664 3.26979L3.9202 2.8964C3.89425 2.86478 3.84757 2.86018 3.81595 2.88614ZM10.5415 1.91422C10.5572 1.87643 10.6005 1.85848 10.6383 1.87413C10.6761 1.88979 10.6941 1.93312 10.6784 1.97092L10.2471 3.01221C10.2314 3.05 10.1881 3.06795 10.1503 3.05229C10.1125 3.03664 10.0946 2.99331 10.1102 2.95551L10.5415 1.91422ZM5.50437 14.2686C5.54216 14.2842 5.58549 14.2663 5.60115 14.2285L6.03247 13.1872C6.04813 13.1494 6.03018 13.1061 5.99238 13.0904C5.95459 13.0747 5.91126 13.0927 5.8956 13.1305L5.46428 14.1718C5.44862 14.2096 5.46657 14.2529 5.50437 14.2686ZM11.1332 2.18598C11.1524 2.1499 11.1973 2.13628 11.2334 2.15557C11.2695 2.17486 11.2831 2.21974 11.2638 2.25582L11.0361 2.68183C11.0168 2.7179 10.9719 2.73152 10.9358 2.71223C10.8998 2.69295 10.8861 2.64806 10.9054 2.61199L11.1332 2.18598ZM4.90931 13.9871C4.94539 14.0064 4.99027 13.9928 5.00955 13.9567L5.23726 13.5307C5.25654 13.4946 5.24293 13.4497 5.20685 13.4305C5.17077 13.4112 5.12589 13.4248 5.1066 13.4609L4.8789 13.8869C4.85961 13.923 4.87323 13.9678 4.90931 13.9871ZM14.2285 10.5415C14.2663 10.5572 14.2842 10.6005 14.2686 10.6383C14.2529 10.6761 14.2096 10.6941 14.1718 10.6784L13.1305 10.2471C13.0927 10.2314 13.0747 10.1881 13.0904 10.1503C13.1061 10.1125 13.1494 10.0946 13.1872 10.1102L14.2285 10.5415ZM1.87412 5.50437C1.85846 5.54216 1.87641 5.58549 1.91421 5.60115L2.95551 6.03247C2.99331 6.04813 3.03664 6.03018 3.05229 5.99238C3.06795 5.95459 3.05 5.91126 3.0122 5.8956L1.9709 5.46428C1.9331 5.44862 1.88977 5.46657 1.87412 5.50437ZM13.9567 11.1332C13.9928 11.1524 14.0064 11.1973 13.9871 11.2334C13.9678 11.2695 13.923 11.2831 13.8869 11.2638L13.4609 11.0361C13.4248 11.0168 13.4112 10.9719 13.4305 10.9358C13.4497 10.8998 13.4946 10.8861 13.5307 10.9054L13.9567 11.1332ZM2.15557 4.90929C2.13628 4.94537 2.1499 4.99025 2.18598 5.00954L2.61199 5.23726C2.64806 5.25654 2.69295 5.24293 2.71223 5.20685C2.73152 5.17077 2.7179 5.12589 2.68183 5.1066L2.25582 4.87888C2.21974 4.8596 2.17486 4.87321 2.15557 4.90929ZM14.1718 5.46428C14.2096 5.44862 14.2529 5.46657 14.2686 5.50437C14.2842 5.54216 14.2663 5.58549 14.2285 5.60115L13.1872 6.03247C13.1494 6.04813 13.1061 6.03018 13.0904 5.99238C13.0747 5.95459 13.0927 5.91126 13.1305 5.8956L14.1718 5.46428ZM1.87413 10.6383C1.88979 10.6761 1.93312 10.6941 1.97092 10.6784L3.01221 10.2471C3.05 10.2314 3.06795 10.1881 3.05229 10.1503C3.03664 10.1125 2.99331 10.0946 2.95551 10.1102L1.91422 10.5415C1.87643 10.5572 1.85848 10.6005 1.87413 10.6383ZM14.3979 6.07477C14.4371 6.0629 14.4785 6.08501 14.4903 6.12416C14.5022 6.1633 14.4801 6.20467 14.441 6.21654L13.9787 6.35677C13.9396 6.36864 13.8982 6.34654 13.8863 6.30739C13.8744 6.26824 13.8965 6.22688 13.9357 6.215L14.3979 6.07477ZM1.65237 10.0185C1.66425 10.0577 1.70561 10.0798 1.74476 10.0679L2.20699 9.92769C2.24614 9.91581 2.26825 9.87445 2.25637 9.8353C2.2445 9.79615 2.20313 9.77404 2.16399 9.78592L1.70175 9.92615C1.6626 9.93802 1.64049 9.97939 1.65237 10.0185ZM10.6383 14.2686C10.6005 14.2842 10.5572 14.2663 10.5415 14.2285L10.1102 13.1872C10.0946 13.1494 10.1125 13.1061 10.1503 13.0904C10.1881 13.0747 10.2314 13.0927 10.2471 13.1305L10.6784 14.1718C10.6941 14.2096 10.6761 14.2529 10.6383 14.2686ZM5.50437 1.87413C5.46657 1.88979 5.44862 1.93312 5.46428 1.97092L5.8956 3.01221C5.91126 3.05 5.95459 3.06795 5.99238 3.05229C6.03018 3.03664 6.04813 2.99331 6.03247 2.95551L5.60115 1.91422C5.58549 1.87643 5.54216 1.85848 5.50437 1.87413ZM10.0679 14.3979C10.0798 14.4371 10.0577 14.4785 10.0185 14.4903C9.97939 14.5022 9.93802 14.4801 9.92615 14.441L9.78592 13.9787C9.77404 13.9396 9.79615 13.8982 9.8353 13.8863C9.87445 13.8744 9.91581 13.8965 9.92769 13.9357L10.0679 14.3979ZM6.12417 1.65237C6.08502 1.66424 6.06291 1.70561 6.07479 1.74475L6.215 2.20699C6.22688 2.24614 6.26824 2.26825 6.30739 2.25637C6.34654 2.2445 6.36864 2.20314 6.35677 2.16399L6.21656 1.70175C6.20468 1.6626 6.16332 1.64049 6.12417 1.65237ZM9.29287 1.55062C9.30085 1.5105 9.33985 1.48444 9.37997 1.49242C9.4201 1.5004 9.44615 1.5394 9.43817 1.57952L9.21829 2.68496C9.21031 2.72508 9.17131 2.75114 9.13119 2.74316C9.09107 2.73518 9.06501 2.69618 9.07299 2.65606L9.29287 1.55062ZM6.76272 14.6503C6.80284 14.6583 6.84184 14.6322 6.84982 14.5921L7.0697 13.4866C7.07768 13.4465 7.05162 13.4075 7.0115 13.3995C6.97137 13.3916 6.93238 13.4176 6.9244 13.4577L6.70452 14.5632C6.69654 14.6033 6.72259 14.6423 6.76272 14.6503ZM9.92615 1.70175C9.93802 1.6626 9.97939 1.64049 10.0185 1.65237C10.0577 1.66425 10.0798 1.70561 10.0679 1.74476L9.92769 2.20699C9.91581 2.24614 9.87445 2.26825 9.8353 2.25637C9.79615 2.2445 9.77404 2.20313 9.78592 2.16399L9.92615 1.70175ZM6.12417 14.4903C6.16332 14.5022 6.20469 14.4801 6.21656 14.441L6.35677 13.9787C6.36864 13.9396 6.34653 13.8982 6.30739 13.8863C6.26824 13.8744 6.22687 13.8965 6.215 13.9357L6.07479 14.398C6.06291 14.4371 6.08502 14.4785 6.12417 14.4903ZM14.5921 9.29287C14.6322 9.30085 14.6583 9.33985 14.6503 9.37997C14.6423 9.4201 14.6033 9.44615 14.5632 9.43817L13.4577 9.21829C13.4176 9.21031 13.3916 9.17131 13.3995 9.13119C13.4075 9.09107 13.4465 9.06501 13.4866 9.07299L14.5921 9.29287ZM1.49242 6.76272C1.48444 6.80284 1.5105 6.84184 1.55062 6.84982L2.65606 7.0697C2.69618 7.07768 2.73518 7.05162 2.74316 7.0115C2.75114 6.97137 2.72508 6.93238 2.68496 6.9244L1.57952 6.70452C1.5394 6.69654 1.5004 6.72259 1.49242 6.76272ZM14.441 9.92615C14.4801 9.93802 14.5022 9.97939 14.4903 10.0185C14.4785 10.0577 14.4371 10.0798 14.3979 10.0679L13.9357 9.92769C13.8965 9.91581 13.8744 9.87445 13.8863 9.8353C13.8982 9.79615 13.9396 9.77404 13.9787 9.78592L14.441 9.92615ZM1.65237 6.12415C1.64049 6.1633 1.6626 6.20467 1.70175 6.21654L2.16399 6.35677C2.20313 6.36864 2.2445 6.34654 2.25637 6.30739C2.26825 6.26824 2.24614 6.22688 2.20699 6.215L1.74476 6.07477C1.70561 6.0629 1.66425 6.08501 1.65237 6.12415ZM13.5459 4.32424C13.58 4.30151 13.626 4.31066 13.6487 4.34468C13.6714 4.37869 13.6623 4.42469 13.6282 4.44742L12.6911 5.0736C12.6571 5.09633 12.6111 5.08718 12.5884 5.05317C12.5656 5.01915 12.5748 4.97315 12.6088 4.95042L13.5459 4.32424ZM2.494 11.798C2.51673 11.832 2.56273 11.8412 2.59675 11.8184L3.53389 11.1923C3.56791 11.1695 3.57706 11.1235 3.55433 11.0895C3.5316 11.0555 3.4856 11.0464 3.45159 11.0691L2.51444 11.6953C2.48043 11.718 2.47128 11.764 2.494 11.798ZM13.8869 4.87888C13.923 4.8596 13.9678 4.87321 13.9871 4.90929C14.0064 4.94537 13.9928 4.99025 13.9567 5.00954L13.5307 5.23726C13.4946 5.25654 13.4497 5.24293 13.4305 5.20685C13.4112 5.17077 13.4248 5.12589 13.4609 5.1066L13.8869 4.87888ZM2.15557 11.2334C2.17486 11.2695 2.21974 11.2831 2.25582 11.2638L2.68183 11.0361C2.7179 11.0168 2.73152 10.9719 2.71223 10.9358C2.69295 10.8998 2.64806 10.8861 2.61199 10.9054L2.18598 11.1332C2.1499 11.1524 2.13628 11.1973 2.15557 11.2334ZM11.8184 13.5459C11.8412 13.58 11.832 13.626 11.798 13.6487C11.764 13.6714 11.718 13.6623 11.6953 13.6282L11.0691 12.6911C11.0464 12.6571 11.0555 12.6111 11.0895 12.5884C11.1235 12.5656 11.1695 12.5748 11.1923 12.6088L11.8184 13.5459ZM4.34468 2.494C4.31066 2.51673 4.30151 2.56273 4.32424 2.59675L4.95042 3.53389C4.97315 3.56791 5.01915 3.57706 5.05317 3.55433C5.08718 3.5316 5.09633 3.4856 5.0736 3.45159L4.44742 2.51444C4.42469 2.48043 4.37869 2.47128 4.34468 2.494ZM11.2638 13.8869C11.2831 13.923 11.2695 13.9678 11.2334 13.9871C11.1973 14.0064 11.1524 13.9928 11.1331 13.9567L10.9054 13.5307C10.8861 13.4946 10.8998 13.4497 10.9358 13.4305C10.9719 13.4112 11.0168 13.4248 11.0361 13.4609L11.2638 13.8869ZM4.90931 2.15557C4.87323 2.17485 4.85961 2.21974 4.8789 2.25581L5.1066 2.68182C5.12589 2.7179 5.17077 2.73152 5.20685 2.71223C5.24293 2.69295 5.25654 2.64807 5.23726 2.61199L5.00955 2.18598C4.99027 2.1499 4.94539 2.13628 4.90931 2.15557ZM11.6953 2.51444C11.718 2.48043 11.764 2.47128 11.798 2.494C11.832 2.51673 11.8412 2.56273 11.8184 2.59675L11.1923 3.53389C11.1695 3.56791 11.1235 3.57706 11.0895 3.55433C11.0555 3.5316 11.0464 3.4856 11.0691 3.45159L11.6953 2.51444ZM4.34468 13.6487C4.37869 13.6714 4.42469 13.6623 4.44742 13.6282L5.0736 12.6911C5.09633 12.6571 5.08718 12.6111 5.05317 12.5884C5.01915 12.5656 4.97315 12.5748 4.95042 12.6088L4.32424 13.5459C4.30151 13.58 4.31066 13.626 4.34468 13.6487ZM12.2225 2.8964C12.2484 2.86478 12.2951 2.86018 12.3267 2.88614C12.3584 2.91209 12.363 2.95876 12.337 2.99039L12.0306 3.36378C12.0046 3.3954 11.9579 3.4 11.9263 3.37404C11.8947 3.34809 11.8901 3.30142 11.916 3.26979L12.2225 2.8964ZM3.81595 13.2566C3.84757 13.2825 3.89425 13.2779 3.9202 13.2463L4.22664 12.8729C4.2526 12.8413 4.248 12.7946 4.21638 12.7686C4.18475 12.7427 4.13808 12.7473 4.11212 12.7789L3.80568 13.1523C3.77973 13.1839 3.78433 13.2306 3.81595 13.2566ZM13.6282 11.6953C13.6623 11.718 13.6714 11.764 13.6487 11.798C13.626 11.832 13.58 11.8412 13.5459 11.8184L12.6088 11.1923C12.5748 11.1695 12.5656 11.1235 12.5884 11.0895C12.6111 11.0555 12.6571 11.0464 12.6911 11.0691L13.6282 11.6953ZM2.494 4.34468C2.47128 4.37869 2.48043 4.42469 2.51444 4.44742L3.45159 5.0736C3.4856 5.09633 3.5316 5.08718 3.55433 5.05317C3.57706 5.01915 3.56791 4.97315 3.53389 4.95042L2.59675 4.32424C2.56273 4.30151 2.51673 4.31066 2.494 4.34468ZM13.2463 12.2225C13.2779 12.2484 13.2825 12.2951 13.2566 12.3267C13.2306 12.3584 13.1839 12.363 13.1523 12.337L12.7789 12.0306C12.7473 12.0046 12.7427 11.9579 12.7686 11.9263C12.7946 11.8947 12.8413 11.8901 12.8729 11.916L13.2463 12.2225ZM2.88614 3.81595C2.86018 3.84757 2.86478 3.89425 2.8964 3.9202L3.26979 4.22664C3.30142 4.2526 3.34809 4.248 3.37404 4.21638C3.4 4.18475 3.3954 4.13808 3.36378 4.11212L2.99039 3.80568C2.95876 3.77973 2.91209 3.78433 2.88614 3.81595ZM14.5632 6.70452C14.6033 6.69654 14.6423 6.72259 14.6503 6.76272C14.6583 6.80284 14.6322 6.84184 14.5921 6.84982L13.4866 7.0697C13.4465 7.07768 13.4075 7.05162 13.3995 7.0115C13.3916 6.97137 13.4176 6.93238 13.4577 6.9244L14.5632 6.70452ZM1.49242 9.37997C1.5004 9.4201 1.5394 9.44615 1.57952 9.43817L2.68496 9.21829C2.72508 9.21031 2.75114 9.17131 2.74316 9.13119C2.73518 9.09107 2.69618 9.06501 2.65606 9.07299L1.55062 9.29287C1.5105 9.30085 1.48444 9.33985 1.49242 9.37997ZM14.6657 7.34742C14.7064 7.34333 14.7428 7.37301 14.7468 7.41372C14.7509 7.45442 14.7213 7.49074 14.6806 7.49483L14.1998 7.54313C14.1591 7.54722 14.1228 7.51754 14.1187 7.47683C14.1146 7.43613 14.1443 7.39982 14.185 7.39573L14.6657 7.34742ZM1.39584 8.72994C1.39993 8.77064 1.43625 8.80032 1.47695 8.79623L1.95766 8.74793C1.99836 8.74384 2.02804 8.70752 2.02395 8.66682C2.01986 8.62612 1.98355 8.59643 1.94284 8.60052L1.46214 8.64883C1.42143 8.65292 1.39175 8.68923 1.39584 8.72994ZM9.43817 14.5632C9.44615 14.6033 9.4201 14.6423 9.37997 14.6503C9.33985 14.6583 9.30085 14.6322 9.29287 14.5921L9.07299 13.4866C9.06501 13.4465 9.09107 13.4075 9.13119 13.3995C9.17131 13.3916 9.21031 13.4176 9.21829 13.4577L9.43817 14.5632ZM6.76272 1.49242C6.72259 1.5004 6.69654 1.5394 6.70452 1.57952L6.9244 2.68496C6.93238 2.72508 6.97137 2.75114 7.0115 2.74316C7.05162 2.73518 7.07768 2.69618 7.0697 2.65606L6.84982 1.55062C6.84184 1.5105 6.80284 1.48444 6.76272 1.49242ZM8.79623 14.6657C8.80032 14.7064 8.77064 14.7428 8.72994 14.7468C8.68923 14.7509 8.65292 14.7213 8.64883 14.6806L8.60052 14.1998C8.59643 14.1591 8.62612 14.1228 8.66682 14.1187C8.70752 14.1146 8.74384 14.1443 8.74793 14.185L8.79623 14.6657ZM7.41372 1.39584C7.37301 1.39993 7.34333 1.43625 7.34742 1.47695L7.39573 1.95766C7.39982 1.99836 7.43613 2.02804 7.47683 2.02395C7.51754 2.01986 7.54722 1.98355 7.54313 1.94284L7.49483 1.46214C7.49074 1.42143 7.45442 1.39175 7.41372 1.39584Z", fill: "#DDDDDD" }), react_default.createElement("path", { d: "M3.14941 12.8505L7.29562 7.28674L7.99989 7.99218L3.14941 12.8505Z", fill: "#DDDDDD" }), react_default.createElement("path", { d: "M7.28662 7.29574L12.8504 3.14954L7.99204 8.00002L7.28662 7.29574Z", fill: "#EE4444" }), react_default.createElement("path", { d: "M12.8505 3.14954L8.70427 8.71332L8 8.00789L12.8505 3.14954Z", fill: "#CC0000" }), react_default.createElement("path", { d: "M3.14941 12.8505L8.7132 8.70427L8.00777 8L3.14941 12.8505Z", fill: "#AAAAAA" }), react_default.createElement("defs", null, react_default.createElement("linearGradient", { id: "paint0_linear_466_21186", x1: "0.300303", y1: "0.300951", x2: "0.300303", y2: "15.7084", gradientUnits: "userSpaceOnUse" }, react_default.createElement("stop", { stopColor: "#F8F8F8" }), react_default.createElement("stop", { offset: "1", stopColor: "#CCCCCC" })), react_default.createElement("radialGradient", { id: "paint1_radial_466_21186", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(8.00216 8.0046) scale(7.06173)" }, react_default.createElement("stop", { stopColor: "#00F0FF" }), react_default.createElement("stop", { offset: "1", stopColor: "#0070E0" })))), r3 = styled(W2)(({ theme: e10 }) => ({ fontSize: e10.typography.size.s3, "@container (min-width: 800px)": { fontSize: e10.typography.size.m1 } })), n3 = styled(Q)({ alignItems: "flex-start", justifyContent: "flex-start", padding: "30px 30px 0 30px", gap: 30, "@container (min-width: 800px)": { alignItems: "center", justifyContent: "center", flexDirection: "row-reverse", padding: "20px 40px", gap: 40 } }), a3 = styled.div({ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", height: 40 }), o3 = styled.div({ display: "flex", gap: 8 }), i3 = styled.div({ display: "flex", flexDirection: "column", gap: 8 }), s3 = styled.div(({ theme: e10 }) => ({ display: "flex", flexDirection: "column", maxWidth: 400, overflow: "hidden", backgroundColor: "white", outline: `1px solid ${e10.appBorderColor}`, borderRadius: 8, video: { margin: 4, width: "calc(100% - 8px)", aspectRatio: "400/220" } })), l3 = styled.div({ display: "flex", flexDirection: "row", gap: 8, justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(38, 85, 115, 0.15)", padding: "8px 15px 8px 10px", color: "#5C6870", fontSize: "13px", pointerEvents: "none", "& > div": { display: "flex", gap: 8 }, span: { display: "inline-flex", alignItems: "center", gap: 5, padding: "0 5px" } }), Cd = ({ onNext: e10, onUninstall: t5 }) => react_default.createElement(K, { footer: null, ignoreConfig: !0, interstitial: !0 }, react_default.createElement(n3, null, react_default.createElement(U, { alignItems: "start", textAlign: "left" }, react_default.createElement("div", null, react_default.createElement(r3, null, "Visual tests in Storybook"), react_default.createElement(L2, { muted: !0 }, "Pinpoint visual bugs across browsers, viewports, and themes using Chromatic.")), react_default.createElement(i3, null, react_default.createElement(o3, null, react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", onClick: e10 }, "Get started for free"), react_default.createElement(J, { ariaLabel: !1, asChild: !0, variant: "outline", size: "medium" }, react_default.createElement("a", { href: "https://www.chromatic.com/storybook", target: "_blank" }, "See all the features"))), react_default.createElement(L2, { muted: !0, small: !0 }, "No credit card required"))), react_default.createElement(s3, null, react_default.createElement("video", { autoPlay: !0, muted: !0, loop: !0 }, react_default.createElement("source", { src: "./addon-visual-tests-assets/visual-test-illustration.mp4", type: "video/mp4" })), react_default.createElement(l3, { "aria-hidden": !0 }, react_default.createElement("span", null, "Testing 97/248 stories..."), react_default.createElement("div", null, react_default.createElement("span", null, "Light mode", react_default.createElement(Fs, { size: 10 })), react_default.createElement(Ti, { alt: "" }), react_default.createElement(Li, { alt: "" }), react_default.createElement(Mi, { alt: "" }))))), react_default.createElement(a3, null, react_default.createElement(L2, { muted: !0 }, "Not interested?"), react_default.createElement(ye, { onClick: () => t5() }, "Uninstall this addon"))), kd = ({ setAccessToken: e10, setCreatedProjectId: t5, hasProjectId: r5 }) => {
    let [n10, a2] = Oe("authenticationScreen", r5 ? "signin" : "welcome"), [o10, i10] = Oe("exchangeParameters"), l2 = Jo(), { uninstallAddon: d3 } = Ko(), { setSubdomain: u3 } = zn();
    be("Authentication", n10.charAt(0).toUpperCase() + n10.slice(1));
    let c10 = useCallback(async (p5) => {
      try {
        u3(p5 ?? "www"), i10(await _l(p5)), a2("verify");
      } catch (f4) {
        l2("Sign in Error", f4);
      }
    }, [l2, i10, a2, u3]);
    if (n10 === "welcome" && !r5) return react_default.createElement(Cd, { onNext: () => a2("signin"), onUninstall: d3 });
    if (n10 === "signin" || n10 === "welcome" && r5) return react_default.createElement(w5, { ...r5 ? {} : { onBack: () => a2("welcome") }, onSignIn: c10, onSignInWithSSO: () => a2("subdomain") });
    if (n10 === "subdomain") return react_default.createElement(y5, { onBack: () => a2("signin"), onSignIn: c10 });
    if (n10 === "verify") {
      if (!o10) throw new Error("Expected to have a `exchangeParameters` if at `verify` step");
      return react_default.createElement(xd, { onBack: () => a2("signin"), hasProjectId: r5, setAccessToken: e10, setCreatedProjectId: t5, exchangeParameters: o10 });
    }
    return null;
  }, Ed = (e10) => react_default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e10 }, react_default.createElement("path", { fill: "currentColor", d: "M13.85 3.35a.5.5 0 0 0-.7-.7L5 10.79.85 6.65a.5.5 0 1 0-.7.7l4.5 4.5c.2.2.5.2.7 0l8.5-8.5Z" })), Md = (e10) => react_default.createElement("svg", { width: "14", height: "14", viewBox: "0 0 14 14", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e10 }, react_default.createElement("path", { fill: "currentColor", d: "m11.1 7.35-5.5 5.5a.5.5 0 0 1-.7-.7L10.04 7 4.9 1.85a.5.5 0 1 1 .7-.7l5.5 5.5c.2.2.2.5 0 .7Z" })), c3 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  4.41177% {
    transform: translate(3px, 0);
  }
  8.82353% {
    transform: translate(0, 0);
  }
  13.23529% {
    transform: translate(3px, 0);
  }
  17.64706% {
    transform: translate(0, 0);
  }
  22.05882% {
    transform: translate(3px, 0);
  }
  26.47059% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(0, 0);
  }
`, f0 = styled(Ed)(({ theme: e10 }) => ({ background: e10.base === "dark" ? `color-mix(in srgb, ${e10.color.positive}, transparent 50%)` : e10.color.positive, color: "white", width: 20, height: 20, padding: 4, borderRadius: "50%" })), m0 = styled(Md)(({ theme: e10 }) => ({ background: e10.background.hoverable, color: e10.color.secondary, width: 20, height: 20, padding: 4, borderRadius: "50%", animation: `${c3} 3.72s ease infinite`, transformOrigin: "50% 50%" })), p3 = styled.ul({ textAlign: "left", listStyleType: "none", margin: 0, padding: 0, li: { display: "flex", gap: 10, padding: 10, lineHeight: "20px" } }), h0 = styled.div({ width: "100%", display: "flex", flexDirection: "column", gap: 8 }), Bi = styled.pre(({ theme: e10 }) => ({ margin: 0, padding: "10px 12px", fontSize: "12px", background: e10.background.content, border: `1px solid ${e10.appBorderColor}`, borderRadius: 4 })), Ld = ({ gitInfoError: e10 }) => {
    let t5 = e10?.message.includes("git init"), r5 = t5 || e10?.message.includes("one commit"), n10 = e10?.message.includes("user.email");
    return be("Errors", t5 ? "GitNotFound" : "GitError"), react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, n10 ? react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Configure your Git email"), react_default.createElement(L2, { center: !0, muted: !0 }, "Chromatic requires Git to be configured with an email address to connect local builds to CI builds and link builds to user accounts.")), react_default.createElement(L2, { center: !0, muted: !0 }, "Run this command to set an email address:"), react_default.createElement(Bi, null, 'git config user.email "you@example.com"'), react_default.createElement(L2, { muted: !0, small: !0 }, react_default.createElement(ye, { target: "_blank", href: "https://www.chromatic.com/docs/privacy-policy/", withArrow: !0, secondary: !0 }, "Privacy policy"))) : react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Set up a Git repository"), react_default.createElement(L2, { center: !0, muted: !0 }, "Chromatic requires Git to associate test results with commits and branches. Run these steps to get started:")), react_default.createElement(p3, null, react_default.createElement("li", null, t5 ? react_default.createElement(m0, null) : react_default.createElement(f0, null), react_default.createElement(h0, null, react_default.createElement("span", null, "Initialize a Git repository"), t5 && react_default.createElement(Bi, null, "git init"))), react_default.createElement("li", null, r5 ? react_default.createElement(m0, null) : react_default.createElement(f0, null), react_default.createElement(h0, null, react_default.createElement("span", null, "Stage all files"), r5 && react_default.createElement(Bi, null, "git add ."))), react_default.createElement("li", null, r5 ? react_default.createElement(m0, null) : react_default.createElement(f0, null), react_default.createElement(h0, null, react_default.createElement("span", null, "Commit the changes"), r5 && react_default.createElement(Bi, null, 'git commit -m "Initial commit"')))), react_default.createElement(ye, { target: "_blank", href: "https://www.chromatic.com/docs/visual-tests-addon#git-addon", withArrow: !0, secondary: !0 }, "Visual tests requirements"))));
  }, f3 = styled(Rn)(({ theme: e10 }) => ({ width: 40, height: 40, padding: 10, background: e10.color.positive, borderRadius: "100%", color: "white" })), m3 = styled(ye)(() => ({ marginTop: 5 })), h3 = Je(`
  query ProjectQuery($projectId: ID!) {
    project(id: $projectId) {
      id
      name
      webUrl
      lastBuild {
        branch
        number
      }
    }
  }
`), Bd = ({ projectId: e10, configFile: t5, goToNext: r5 }) => {
    be("LinkProject", "LinkedProject");
    let [{ data: n10, fetching: a2, error: o10 }] = la({ query: h3, variables: { projectId: e10 } });
    return react_default.createElement(K, { footer: react_default.createElement(Kr, null, react_default.createElement(Ue, null, n10?.project?.lastBuild && react_default.createElement(L2, { style: { marginLeft: 5 } }, "Last build: ", n10.project.lastBuild.number, " on branch", " ", n10.project.lastBuild.branch)), react_default.createElement(Ue, { push: !0 }, react_default.createElement(Br, null))) }, react_default.createElement(Q, null, react_default.createElement(U, null, a2 && react_default.createElement("p", null, "Loading..."), o10 && react_default.createElement("p", null, o10.message), n10?.project && react_default.createElement(react_default.Fragment, null, react_default.createElement(f3, null), react_default.createElement("div", null, react_default.createElement(W2, null, "Project linked!"), react_default.createElement(L2, { center: !0, muted: !0, style: { maxWidth: 500 } }, "The ", react_default.createElement(Fe, null, "projectId"), " for ", react_default.createElement("strong", null, n10.project.name), " was added in", " ", react_default.createElement(Fe, null, t5), " to sync tests with Chromatic. Please commit this change to continue using this addon.")), react_default.createElement($e, null, react_default.createElement(J, { ariaLabel: "Continue", variant: "solid", size: "medium", onClick: () => r5() }, "Catch a UI change"), react_default.createElement(m3, { href: "https://www.chromatic.com/docs/cli", target: "_blank", withArrow: !0, secondary: !0 }, "What's a project ID?"))))));
  };
  function _d(e10) {
    for (var t5 = [], r5 = 1; r5 < arguments.length; r5++) t5[r5 - 1] = arguments[r5];
    var n10 = Array.from(typeof e10 == "string" ? [e10] : e10);
    n10[n10.length - 1] = n10[n10.length - 1].replace(/\r?\n([\t ]*)$/, "");
    var a2 = n10.reduce(function(l2, d3) {
      var u3 = d3.match(/\n([\t ]+|(?!\s).)/g);
      return u3 ? l2.concat(u3.map(function(c10) {
        var p5, f4;
        return (f4 = (p5 = c10.match(/[\t ]/g)) === null || p5 === void 0 ? void 0 : p5.length) !== null && f4 !== void 0 ? f4 : 0;
      })) : l2;
    }, []);
    if (a2.length) {
      var o10 = new RegExp(`
[	 ]{` + Math.min.apply(Math, a2) + "}", "g");
      n10 = n10.map(function(l2) {
        return l2.replace(o10, `
`);
      });
    }
    n10[0] = n10[0].replace(/^\r?\n/, "");
    var i10 = n10[0];
    return t5.forEach(function(l2, d3) {
      var u3 = i10.match(/(?:^|\n)( *)$/), c10 = u3 ? u3[1] : "", p5 = l2;
      typeof l2 == "string" && l2.includes(`
`) && (p5 = String(l2).split(`
`).map(function(f4, m8) {
        return m8 === 0 ? f4 : "" + c10 + f4;
      }).join(`
`)), i10 += p5 + n10[d3 + 1];
    }), i10;
  }
  var v3 = styled.div(({ theme: e10 }) => ({ "&& > *": { margin: 0 }, "&& pre": { color: e10.base === "light" ? e10.color.darker : e10.color.lighter, background: e10.base === "light" ? e10.color.lightest : e10.color.darkest, fontSize: "12px", lineHeight: "16px", textAlign: "left", padding: "15px !important" } })), y3 = "https://www.chromatic.com/docs/visual-tests-addon#addon-configuration-options";
  function Fd({ projectId: e10, configFile: t5 }) {
    return be("LinkProject", "LinkingProjectFailed"), react_default.createElement(K, null, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Add the project ID to your Chromatic config"), react_default.createElement(L2, { center: !0, muted: !0 }, "The ", react_default.createElement(Fe, null, "projectId"), " will be used to sync tests with Chromatic. Please commit this change to continue using the addon. The file should be saved at", " ", react_default.createElement(Fe, null, t5), ".")), react_default.createElement(v3, null, react_default.createElement(Fe, null, _d`
                {
                  "projectId": "${e10}",
                }
              `)), react_default.createElement(ye, { secondary: !0, withArrow: !0, target: "_blank", href: y3 }, "What's this for?"))));
  }
  var w3 = Je(`
  query SelectProjectsQuery {
    viewer {
      accounts {
        id
        name
        avatarUrl
        newProjectUrl
        projects {
          id
          name
          webUrl
          lastBuild {
            branch
            number
          }
        }
      }
    }
  }
`), Rd = ({ createdProjectId: e10, setCreatedProjectId: t5, onUpdateProject: r5 }) => {
    let n10 = react_default.useCallback(async (a2) => {
      await r5(a2);
    }, [r5]);
    return react_default.createElement(x3, { createdProjectId: e10, setCreatedProjectId: t5, onSelectProjectId: n10 });
  }, _i = styled.div(({ theme: e10 }) => ({ fontSize: `${e10.typography.size.s1 - 1}px`, fontWeight: e10.typography.weight.bold, color: e10.base === "light" ? e10.color.dark : e10.color.light, backgroundColor: "inherit", padding: "7px 15px", borderBottom: `1px solid ${e10.appBorderColor}`, lineHeight: "18px", letterSpacing: "0.38em", textTransform: "uppercase" })), Pd = styled.div({}), Od = styled.div(({ theme: e10 }) => ({ background: e10.base === "light" ? e10.color.lighter : e10.color.darker })), Nd = styled.div(({ theme: e10 }) => ({ background: e10.base === "light" ? e10.color.lightest : e10.color.darkest, borderRadius: 5, border: `1px solid ${e10.appBorderColor}`, height: 260, maxWidth: 420, minWidth: 260, width: "100%", overflow: "hidden", textAlign: "left", position: "relative", display: "flex", "> *": { flex: 1, display: "flex", flexDirection: "column", width: "50%" } })), Fi = styled.div({ height: "100%", overflowY: "auto" }), b3 = styled(U)({ width: "100%" }), S3 = styled(yl)({ marginRight: 10 });
  function x3({ createdProjectId: e10, setCreatedProjectId: t5, onSelectProjectId: r5 }) {
    let [{ data: n10, fetching: a2, error: o10 }, i10] = la({ query: w3 });
    useEffect(() => {
      let v5 = setInterval(i10, 5e3);
      return () => clearInterval(v5);
    }, [i10]);
    let [l2, d3] = Oe("selectedAccountId"), u3 = n10?.viewer?.accounts.find((v5) => v5.id === l2), c10 = useCallback((v5) => d3(v5.id), [d3]);
    useEffect(() => {
      !l2 && n10?.viewer?.accounts && c10(n10.viewer.accounts[0]);
    }, [n10, l2, c10]);
    let [p5, f4] = Oe("isSelectingProject", !1), m8 = useCallback((v5) => {
      f4(!0), r5(v5.id);
      let C3 = setTimeout(() => {
        f4(!1);
      }, 1e3);
      return () => clearTimeout(C3);
    }, [r5, f4]), h2 = useCallback(async (v5) => {
      v5.message === "createdProject" && (i10(), t5(v5.projectId));
    }, [i10, t5]), [g3, w2] = Ei(h2), y10 = e10 && u3?.projects?.find((v5) => v5?.id.endsWith(e10));
    return useEffect(() => {
      y10 && (w2(), m8(y10));
    }, [y10, m8, w2]), be("LinkProject", "LinkProject"), react_default.createElement(K, null, react_default.createElement(Q, null, react_default.createElement(b3, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Select a project"), react_default.createElement(L2, { muted: !0 }, "Your tests will sync with this project.")), o10 && react_default.createElement("p", null, o10.message), !n10 && a2 && react_default.createElement(Nd, null, react_default.createElement(Pd, null, react_default.createElement(_i, null, "Accounts"), react_default.createElement(Fi, null, react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 }), react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 }), react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 }), react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 }), react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 }))), react_default.createElement(Od, null, react_default.createElement(_i, null, "Projects"), react_default.createElement(Fi, { "data-testid": "right-list" }, react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 }), react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 }), react_default.createElement(Ct, { appearance: "secondary", isLoading: !0 })))), n10?.viewer?.accounts && react_default.createElement(Nd, null, react_default.createElement(Pd, null, react_default.createElement(_i, null, "Accounts"), react_default.createElement(Fi, { "data-testid": "left-list" }, n10.viewer.accounts?.map((v5) => react_default.createElement(Ct, { key: v5.id, title: v5.name, appearance: "secondary", left: react_default.createElement(S3, { src: v5.avatarUrl ?? void 0, size: "tiny" }), onClick: () => c10(v5), active: l2 === v5.id })))), react_default.createElement(Od, null, react_default.createElement(_i, null, "Projects"), react_default.createElement(Fi, { "data-testid": "right-list" }, u3 && react_default.createElement(Ct, { isLink: !1, onClick: () => {
      if (!u3?.newProjectUrl) throw new Error("Unexpected missing `newProjectUrl` on account");
      g3(u3.newProjectUrl);
    }, title: react_default.createElement(ye, { isButton: !0, withArrow: !0 }, "Create new project") }), u3?.projects?.map((v5) => v5 && react_default.createElement(Ct, { appearance: "secondary", key: v5.id, title: v5.name, right: react_default.createElement(Is, { "aria-label": v5.name }), onClick: () => m8(v5), disabled: p5 }))))))));
  }
  var Hd = () => react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Visual tests"), react_default.createElement(L2, { center: !0, muted: !0 }, "Visual tests only runs locally. To test this Storybook, clone it to your machine and run ", react_default.createElement(Fe, null, "npx storybook dev"), "."))))), Dd = ({ offline: e10 = !1 }) => react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Can't connect to Chromatic"), react_default.createElement(L2, { center: !0, muted: !0 }, e10 ? "You're offline. Double check your internet connection." : "We're having trouble connecting to the Chromatic API.")), !e10 && react_default.createElement(ye, { href: "https://status.chromatic.com", target: "_blank", rel: "noreferrer", withArrow: !0 }, "Chromatic API status")))), Vd = () => (be("Uninstalled", "uninstalled"), react_default.createElement(K, { footer: !1 }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Uninstall complete"), react_default.createElement(L2, { center: !0, muted: !0 }, "Visual tests will vanish the next time you restart your Storybook.")))))), zd = { isRunning: !1, startBuild: () => {
  }, stopBuild: () => {
  } }, Zd = createContext(zd), sr = () => Ze(Zd, "RunBuild"), jd = ({ children: e10, watchState: t5 = zd }) => react_default.createElement(Zd.Provider, { value: t5 }, e10), Pi = { PENDING: "status-value:warning", FAILED: "status-value:error", DENIED: "status-value:error", BROKEN: "status-value:error", IN_PROGRESS: "status-value:pending", ACCEPTED: "status-value:success", PASSED: "status-value:success" }, y0 = ["status-value:unknown", "status-value:pending", "status-value:success", "status-value:warning", "status-value:error"];
  function I3(e10, t5) {
    return y0[Math.max(y0.indexOf(e10), y0.indexOf(t5))];
  }
  function Ud(e10) {
    let t5 = {};
    return e10?.forEach((r5) => {
      if (!r5.story || !r5.status) return;
      let n10 = t5[r5.story.storyId];
      if (!n10) {
        t5[r5.story.storyId] = Pi[r5.status];
        return;
      }
      t5[r5.story.storyId] = I3(n10, Pi[r5.status]);
    }), Object.entries(t5).map(([r5, n10]) => ({ value: n10, typeId: z, storyId: r5, title: "Visual tests", description: "Chromatic Visual Tests" }));
  }
  function $d(e10, { shouldSwitchToLastBuildOnBranch: t5, lastBuildOnBranchId: r5, storyId: n10 }) {
    if (!t5) return e10 ? { ...e10, storyId: n10 } : void 0;
    if (!r5) throw new Error("Impossible state");
    return { buildId: r5, storyId: n10 };
  }
  var Wd = { EXCEEDED_THRESHOLD: { heading: "Snapshot limit reached", message: "Your account has reached its monthly snapshot limit. Visual testing is disabled. Upgrade your plan to increase your quota.", action: "Upgrade plan" }, PAYMENT_REQUIRED: { heading: "Payment required", message: "Your subscription payment is past due. Review or replace your payment method to continue using Chromatic.", action: "Review billing details" }, OTHER: { heading: "Account suspended", message: "Your account has been suspended. Contact customer support for details.", action: "Billing details" } }, Oi = ({ children: e10, billingUrl: t5, suspensionReason: r5 = "OTHER" }) => {
    be("Errors", "AccountSuspended");
    let { heading: n10, message: a2, action: o10 } = Wd[r5] || Wd.OTHER;
    return react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, n10), react_default.createElement(L2, { center: !0, muted: !0 }, a2)), t5 && react_default.createElement(J, { ariaLabel: !1, asChild: !0, size: "medium", variant: "solid" }, react_default.createElement("a", { href: t5, target: "_new" }, o10)), e10)));
  }, qd = ({ children: e10, manageUrl: t5 }) => (be("Errors", "VisualTestsDisabled"), react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Visual tests disabled for your project"), react_default.createElement(L2, { center: !0, muted: !0 }, "Update your project settings to enable visual testing.")), react_default.createElement(J, { ariaLabel: !1, asChild: !0, size: "medium", variant: "solid" }, react_default.createElement("a", { href: t5, target: "_new" }, "Manage project settings")), e10))));
  function Yd(e10) {
    return (t5) => typeof t5 === e10;
  }
  var T3 = Yd("function"), M3 = (e10) => e10 === null, Gd = (e10) => Object.prototype.toString.call(e10).slice(8, -1) === "RegExp", Qd = (e10) => !L3(e10) && !M3(e10) && (T3(e10) || typeof e10 == "object"), L3 = Yd("undefined");
  function A3(e10, t5) {
    let { length: r5 } = e10;
    if (r5 !== t5.length) return !1;
    for (let n10 = r5; n10-- !== 0; ) if (!ze(e10[n10], t5[n10])) return !1;
    return !0;
  }
  function B3(e10, t5) {
    if (e10.byteLength !== t5.byteLength) return !1;
    let r5 = new DataView(e10.buffer), n10 = new DataView(t5.buffer), a2 = e10.byteLength;
    for (; a2--; ) if (r5.getUint8(a2) !== n10.getUint8(a2)) return !1;
    return !0;
  }
  function _3(e10, t5) {
    if (e10.size !== t5.size) return !1;
    for (let r5 of e10.entries()) if (!t5.has(r5[0])) return !1;
    for (let r5 of e10.entries()) if (!ze(r5[1], t5.get(r5[0]))) return !1;
    return !0;
  }
  function F3(e10, t5) {
    if (e10.size !== t5.size) return !1;
    for (let r5 of e10.entries()) if (!t5.has(r5[0])) return !1;
    return !0;
  }
  function ze(e10, t5) {
    if (e10 === t5) return !0;
    if (e10 && Qd(e10) && t5 && Qd(t5)) {
      if (e10.constructor !== t5.constructor) return !1;
      if (Array.isArray(e10) && Array.isArray(t5)) return A3(e10, t5);
      if (e10 instanceof Map && t5 instanceof Map) return _3(e10, t5);
      if (e10 instanceof Set && t5 instanceof Set) return F3(e10, t5);
      if (ArrayBuffer.isView(e10) && ArrayBuffer.isView(t5)) return B3(e10, t5);
      if (Gd(e10) && Gd(t5)) return e10.source === t5.source && e10.flags === t5.flags;
      if (e10.valueOf !== Object.prototype.valueOf) return e10.valueOf() === t5.valueOf();
      if (e10.toString !== Object.prototype.toString) return e10.toString() === t5.toString();
      let r5 = Object.keys(e10), n10 = Object.keys(t5);
      if (r5.length !== n10.length) return !1;
      for (let a2 = r5.length; a2-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t5, r5[a2])) return !1;
      for (let a2 = r5.length; a2-- !== 0; ) {
        let o10 = r5[a2];
        if (!(o10 === "_owner" && e10.$$typeof) && !ze(e10[o10], t5[o10])) return !1;
      }
      return !0;
    }
    return Number.isNaN(e10) && Number.isNaN(t5) ? !0 : e10 === t5;
  }
  var P3 = ["Array", "ArrayBuffer", "AsyncFunction", "AsyncGenerator", "AsyncGeneratorFunction", "Date", "Error", "Function", "Generator", "GeneratorFunction", "HTMLElement", "Map", "Object", "Promise", "RegExp", "Set", "WeakMap", "WeakSet"], O3 = ["bigint", "boolean", "null", "number", "string", "symbol", "undefined"];
  function Ni(e10) {
    let t5 = Object.prototype.toString.call(e10).slice(8, -1);
    if (/HTML\w+Element/.test(t5)) return "HTMLElement";
    if (N3(t5)) return t5;
  }
  function Vt(e10) {
    return (t5) => Ni(t5) === e10;
  }
  function N3(e10) {
    return P3.includes(e10);
  }
  function ya(e10) {
    return (t5) => typeof t5 === e10;
  }
  function R3(e10) {
    return O3.includes(e10);
  }
  var H32 = ["innerHTML", "ownerDocument", "style", "attributes", "nodeValue"];
  function _2(e10) {
    if (e10 === null) return "null";
    switch (typeof e10) {
      case "bigint":
        return "bigint";
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
      case "symbol":
        return "symbol";
      case "undefined":
        return "undefined";
    }
    return _2.array(e10) ? "Array" : _2.plainFunction(e10) ? "Function" : Ni(e10) || "Object";
  }
  _2.array = Array.isArray;
  _2.arrayOf = (e10, t5) => !_2.array(e10) && !_2.function(t5) ? !1 : e10.every((r5) => t5(r5));
  _2.asyncGeneratorFunction = (e10) => Ni(e10) === "AsyncGeneratorFunction";
  _2.asyncFunction = Vt("AsyncFunction");
  _2.bigint = ya("bigint");
  _2.boolean = (e10) => e10 === !0 || e10 === !1;
  _2.date = Vt("Date");
  _2.defined = (e10) => !_2.undefined(e10);
  _2.domElement = (e10) => _2.object(e10) && !_2.plainObject(e10) && e10.nodeType === 1 && _2.string(e10.nodeName) && H32.every((t5) => t5 in e10);
  _2.empty = (e10) => _2.string(e10) && e10.length === 0 || _2.array(e10) && e10.length === 0 || _2.object(e10) && !_2.map(e10) && !_2.set(e10) && Object.keys(e10).length === 0 || _2.set(e10) && e10.size === 0 || _2.map(e10) && e10.size === 0;
  _2.error = Vt("Error");
  _2.function = ya("function");
  _2.generator = (e10) => _2.iterable(e10) && _2.function(e10.next) && _2.function(e10.throw);
  _2.generatorFunction = Vt("GeneratorFunction");
  _2.instanceOf = (e10, t5) => !e10 || !t5 ? !1 : Object.getPrototypeOf(e10) === t5.prototype;
  _2.iterable = (e10) => !_2.nullOrUndefined(e10) && _2.function(e10[Symbol.iterator]);
  _2.map = Vt("Map");
  _2.nan = (e10) => Number.isNaN(e10);
  _2.null = (e10) => e10 === null;
  _2.nullOrUndefined = (e10) => _2.null(e10) || _2.undefined(e10);
  _2.number = (e10) => ya("number")(e10) && !_2.nan(e10);
  _2.numericString = (e10) => _2.string(e10) && e10.length > 0 && !Number.isNaN(Number(e10));
  _2.object = (e10) => !_2.nullOrUndefined(e10) && (_2.function(e10) || typeof e10 == "object");
  _2.oneOf = (e10, t5) => _2.array(e10) ? e10.indexOf(t5) > -1 : !1;
  _2.plainFunction = Vt("Function");
  _2.plainObject = (e10) => {
    if (Ni(e10) !== "Object") return !1;
    let t5 = Object.getPrototypeOf(e10);
    return t5 === null || t5 === Object.getPrototypeOf({});
  };
  _2.primitive = (e10) => _2.null(e10) || R3(typeof e10);
  _2.promise = Vt("Promise");
  _2.propertyOf = (e10, t5, r5) => {
    if (!_2.object(e10) || !t5) return !1;
    let n10 = e10[t5];
    return _2.function(r5) ? r5(n10) : _2.defined(n10);
  };
  _2.regexp = Vt("RegExp");
  _2.set = Vt("Set");
  _2.string = ya("string");
  _2.symbol = ya("symbol");
  _2.undefined = ya("undefined");
  _2.weakMap = Vt("WeakMap");
  _2.weakSet = Vt("WeakSet");
  var A2 = _2;
  function D3(...e10) {
    return e10.every((t5) => A2.string(t5) || A2.array(t5) || A2.plainObject(t5));
  }
  function V3(e10, t5, r5) {
    return ru(e10, t5) ? [e10, t5].every(A2.array) ? !e10.some(tu(r5)) && t5.some(tu(r5)) : [e10, t5].every(A2.plainObject) ? !Object.entries(e10).some(eu(r5)) && Object.entries(t5).some(eu(r5)) : t5 === r5 : !1;
  }
  function Jd(e10, t5, r5) {
    let { actual: n10, key: a2, previous: o10, type: i10 } = r5, l2 = lr(e10, a2), d3 = lr(t5, a2), u3 = [l2, d3].every(A2.number) && (i10 === "increased" ? l2 < d3 : l2 > d3);
    return A2.undefined(n10) || (u3 = u3 && d3 === n10), A2.undefined(o10) || (u3 = u3 && l2 === o10), u3;
  }
  function Kd(e10, t5, r5) {
    let { key: n10, type: a2, value: o10 } = r5, i10 = lr(e10, n10), l2 = lr(t5, n10), d3 = a2 === "added" ? i10 : l2, u3 = a2 === "added" ? l2 : i10;
    if (!A2.nullOrUndefined(o10)) {
      if (A2.defined(d3)) {
        if (A2.array(d3) || A2.plainObject(d3)) return V3(d3, u3, o10);
      } else return ze(u3, o10);
      return !1;
    }
    return [i10, l2].every(A2.array) ? !u3.every(w0(d3)) : [i10, l2].every(A2.plainObject) ? z3(Object.keys(d3), Object.keys(u3)) : ![i10, l2].every((c10) => A2.primitive(c10) && A2.defined(c10)) && (a2 === "added" ? !A2.defined(i10) && A2.defined(l2) : A2.defined(i10) && !A2.defined(l2));
  }
  function Xd(e10, t5, { key: r5 } = {}) {
    let n10 = lr(e10, r5), a2 = lr(t5, r5);
    if (!ru(n10, a2)) throw new TypeError("Inputs have different types");
    if (!D3(n10, a2)) throw new TypeError("Inputs don't have length");
    return [n10, a2].every(A2.plainObject) && (n10 = Object.keys(n10), a2 = Object.keys(a2)), [n10, a2];
  }
  function eu(e10) {
    return ([t5, r5]) => A2.array(e10) ? ze(e10, r5) || e10.some((n10) => ze(n10, r5) || A2.array(r5) && w0(r5)(n10)) : A2.plainObject(e10) && e10[t5] ? !!e10[t5] && ze(e10[t5], r5) : ze(e10, r5);
  }
  function z3(e10, t5) {
    return t5.some((r5) => !e10.includes(r5));
  }
  function tu(e10) {
    return (t5) => A2.array(e10) ? e10.some((r5) => ze(r5, t5) || A2.array(t5) && w0(t5)(r5)) : ze(e10, t5);
  }
  function no(e10, t5) {
    return A2.array(e10) ? e10.some((r5) => ze(r5, t5)) : ze(e10, t5);
  }
  function w0(e10) {
    return (t5) => e10.some((r5) => ze(r5, t5));
  }
  function ru(...e10) {
    return e10.every(A2.array) || e10.every(A2.number) || e10.every(A2.plainObject) || e10.every(A2.string);
  }
  function lr(e10, t5) {
    return A2.plainObject(e10) || A2.array(e10) ? A2.string(t5) ? t5.split(".").reduce((n10, a2) => n10 && n10[a2], e10) : A2.number(t5) ? e10[t5] : e10 : e10;
  }
  function xn(e10, t5) {
    if ([e10, t5].some(A2.nullOrUndefined)) throw new Error("Missing required parameters");
    if (![e10, t5].every((c10) => A2.plainObject(c10) || A2.array(c10))) throw new Error("Expected plain objects or array");
    return { added: (c10, p5) => {
      try {
        return Kd(e10, t5, { key: c10, type: "added", value: p5 });
      } catch {
        return !1;
      }
    }, changed: (c10, p5, f4) => {
      try {
        let m8 = lr(e10, c10), h2 = lr(t5, c10), g3 = A2.defined(p5), w2 = A2.defined(f4);
        if (g3 || w2) {
          let y10 = w2 ? no(f4, m8) : !no(p5, m8), v5 = no(p5, h2);
          return y10 && v5;
        }
        return [m8, h2].every(A2.array) || [m8, h2].every(A2.plainObject) ? !ze(m8, h2) : m8 !== h2;
      } catch {
        return !1;
      }
    }, changedFrom: (c10, p5, f4) => {
      if (!A2.defined(c10)) return !1;
      try {
        let m8 = lr(e10, c10), h2 = lr(t5, c10), g3 = A2.defined(f4);
        return no(p5, m8) && (g3 ? no(f4, h2) : !g3);
      } catch {
        return !1;
      }
    }, decreased: (c10, p5, f4) => {
      if (!A2.defined(c10)) return !1;
      try {
        return Jd(e10, t5, { key: c10, actual: p5, previous: f4, type: "decreased" });
      } catch {
        return !1;
      }
    }, emptied: (c10) => {
      try {
        let [p5, f4] = Xd(e10, t5, { key: c10 });
        return !!p5.length && !f4.length;
      } catch {
        return !1;
      }
    }, filled: (c10) => {
      try {
        let [p5, f4] = Xd(e10, t5, { key: c10 });
        return !p5.length && !!f4.length;
      } catch {
        return !1;
      }
    }, increased: (c10, p5, f4) => {
      if (!A2.defined(c10)) return !1;
      try {
        return Jd(e10, t5, { key: c10, actual: p5, previous: f4, type: "increased" });
      } catch {
        return !1;
      }
    }, removed: (c10, p5) => {
      try {
        return Kd(e10, t5, { key: c10, type: "removed", value: p5 });
      } catch {
        return !1;
      }
    } };
  }
  var uc = Jt(iu(), 1), j0 = Jt(lu(), 1), z0 = Jt(uu(), 1), vo = Jt(Hi(), 1), yo = Jt(Hi(), 1), T2 = Jt(Su()), io = typeof window < "u" && typeof document < "u" && typeof navigator < "u", uh = (function() {
    for (var e10 = ["Edge", "Trident", "Firefox"], t5 = 0; t5 < e10.length; t5 += 1) if (io && navigator.userAgent.indexOf(e10[t5]) >= 0) return 1;
    return 0;
  })();
  function ch(e10) {
    var t5 = !1;
    return function() {
      t5 || (t5 = !0, window.Promise.resolve().then(function() {
        t5 = !1, e10();
      }));
    };
  }
  function ph(e10) {
    var t5 = !1;
    return function() {
      t5 || (t5 = !0, setTimeout(function() {
        t5 = !1, e10();
      }, uh));
    };
  }
  var fh = io && window.Promise, mh = fh ? ch : ph;
  function Tu(e10) {
    var t5 = {};
    return e10 && t5.toString.call(e10) === "[object Function]";
  }
  function Cn(e10, t5) {
    if (e10.nodeType !== 1) return [];
    var r5 = e10.ownerDocument.defaultView, n10 = r5.getComputedStyle(e10, null);
    return t5 ? n10[t5] : n10;
  }
  function I0(e10) {
    return e10.nodeName === "HTML" ? e10 : e10.parentNode || e10.host;
  }
  function so(e10) {
    if (!e10) return document.body;
    switch (e10.nodeName) {
      case "HTML":
      case "BODY":
        return e10.ownerDocument.body;
      case "#document":
        return e10.body;
    }
    var t5 = Cn(e10), r5 = t5.overflow, n10 = t5.overflowX, a2 = t5.overflowY;
    return /(auto|scroll|overlay)/.test(r5 + a2 + n10) ? e10 : so(I0(e10));
  }
  function Mu(e10) {
    return e10 && e10.referenceNode ? e10.referenceNode : e10;
  }
  var xu = io && !!(window.MSInputMethodContext && document.documentMode), Cu = io && /MSIE 10/.test(navigator.userAgent);
  function Ca(e10) {
    return e10 === 11 ? xu : e10 === 10 ? Cu : xu || Cu;
  }
  function ba(e10) {
    if (!e10) return document.documentElement;
    for (var t5 = Ca(10) ? document.body : null, r5 = e10.offsetParent || null; r5 === t5 && e10.nextElementSibling; ) r5 = (e10 = e10.nextElementSibling).offsetParent;
    var n10 = r5 && r5.nodeName;
    return !n10 || n10 === "BODY" || n10 === "HTML" ? e10 ? e10.ownerDocument.documentElement : document.documentElement : ["TH", "TD", "TABLE"].indexOf(r5.nodeName) !== -1 && Cn(r5, "position") === "static" ? ba(r5) : r5;
  }
  function hh(e10) {
    var t5 = e10.nodeName;
    return t5 === "BODY" ? !1 : t5 === "HTML" || ba(e10.firstElementChild) === e10;
  }
  function x0(e10) {
    return e10.parentNode !== null ? x0(e10.parentNode) : e10;
  }
  function Di(e10, t5) {
    if (!e10 || !e10.nodeType || !t5 || !t5.nodeType) return document.documentElement;
    var r5 = e10.compareDocumentPosition(t5) & Node.DOCUMENT_POSITION_FOLLOWING, n10 = r5 ? e10 : t5, a2 = r5 ? t5 : e10, o10 = document.createRange();
    o10.setStart(n10, 0), o10.setEnd(a2, 0);
    var i10 = o10.commonAncestorContainer;
    if (e10 !== i10 && t5 !== i10 || n10.contains(a2)) return hh(i10) ? i10 : ba(i10);
    var l2 = x0(e10);
    return l2.host ? Di(l2.host, t5) : Di(e10, x0(t5).host);
  }
  function Sa(e10) {
    var t5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "top", r5 = t5 === "top" ? "scrollTop" : "scrollLeft", n10 = e10.nodeName;
    if (n10 === "BODY" || n10 === "HTML") {
      var a2 = e10.ownerDocument.documentElement, o10 = e10.ownerDocument.scrollingElement || a2;
      return o10[r5];
    }
    return e10[r5];
  }
  function gh(e10, t5) {
    var r5 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1, n10 = Sa(t5, "top"), a2 = Sa(t5, "left"), o10 = r5 ? -1 : 1;
    return e10.top += n10 * o10, e10.bottom += n10 * o10, e10.left += a2 * o10, e10.right += a2 * o10, e10;
  }
  function ku(e10, t5) {
    var r5 = t5 === "x" ? "Left" : "Top", n10 = r5 === "Left" ? "Right" : "Bottom";
    return parseFloat(e10["border" + r5 + "Width"]) + parseFloat(e10["border" + n10 + "Width"]);
  }
  function Iu(e10, t5, r5, n10) {
    return Math.max(t5["offset" + e10], t5["scroll" + e10], r5["client" + e10], r5["offset" + e10], r5["scroll" + e10], Ca(10) ? parseInt(r5["offset" + e10]) + parseInt(n10["margin" + (e10 === "Height" ? "Top" : "Left")]) + parseInt(n10["margin" + (e10 === "Height" ? "Bottom" : "Right")]) : 0);
  }
  function Lu(e10) {
    var t5 = e10.body, r5 = e10.documentElement, n10 = Ca(10) && getComputedStyle(r5);
    return { height: Iu("Height", t5, r5, n10), width: Iu("Width", t5, r5, n10) };
  }
  var vh = function(e10, t5) {
    if (!(e10 instanceof t5)) throw new TypeError("Cannot call a class as a function");
  }, yh = /* @__PURE__ */ (function() {
    function e10(t5, r5) {
      for (var n10 = 0; n10 < r5.length; n10++) {
        var a2 = r5[n10];
        a2.enumerable = a2.enumerable || !1, a2.configurable = !0, "value" in a2 && (a2.writable = !0), Object.defineProperty(t5, a2.key, a2);
      }
    }
    return function(t5, r5, n10) {
      return r5 && e10(t5.prototype, r5), n10 && e10(t5, n10), t5;
    };
  })(), xa = function(e10, t5, r5) {
    return t5 in e10 ? Object.defineProperty(e10, t5, { value: r5, enumerable: !0, configurable: !0, writable: !0 }) : e10[t5] = r5, e10;
  }, Lt = Object.assign || function(e10) {
    for (var t5 = 1; t5 < arguments.length; t5++) {
      var r5 = arguments[t5];
      for (var n10 in r5) Object.prototype.hasOwnProperty.call(r5, n10) && (e10[n10] = r5[n10]);
    }
    return e10;
  };
  function Ur(e10) {
    return Lt({}, e10, { right: e10.left + e10.width, bottom: e10.top + e10.height });
  }
  function C0(e10) {
    var t5 = {};
    try {
      if (Ca(10)) {
        t5 = e10.getBoundingClientRect();
        var r5 = Sa(e10, "top"), n10 = Sa(e10, "left");
        t5.top += r5, t5.left += n10, t5.bottom += r5, t5.right += n10;
      } else t5 = e10.getBoundingClientRect();
    } catch {
    }
    var a2 = { left: t5.left, top: t5.top, width: t5.right - t5.left, height: t5.bottom - t5.top }, o10 = e10.nodeName === "HTML" ? Lu(e10.ownerDocument) : {}, i10 = o10.width || e10.clientWidth || a2.width, l2 = o10.height || e10.clientHeight || a2.height, d3 = e10.offsetWidth - i10, u3 = e10.offsetHeight - l2;
    if (d3 || u3) {
      var c10 = Cn(e10);
      d3 -= ku(c10, "x"), u3 -= ku(c10, "y"), a2.width -= d3, a2.height -= u3;
    }
    return Ur(a2);
  }
  function E0(e10, t5) {
    var r5 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1, n10 = Ca(10), a2 = t5.nodeName === "HTML", o10 = C0(e10), i10 = C0(t5), l2 = so(e10), d3 = Cn(t5), u3 = parseFloat(d3.borderTopWidth), c10 = parseFloat(d3.borderLeftWidth);
    r5 && a2 && (i10.top = Math.max(i10.top, 0), i10.left = Math.max(i10.left, 0));
    var p5 = Ur({ top: o10.top - i10.top - u3, left: o10.left - i10.left - c10, width: o10.width, height: o10.height });
    if (p5.marginTop = 0, p5.marginLeft = 0, !n10 && a2) {
      var f4 = parseFloat(d3.marginTop), m8 = parseFloat(d3.marginLeft);
      p5.top -= u3 - f4, p5.bottom -= u3 - f4, p5.left -= c10 - m8, p5.right -= c10 - m8, p5.marginTop = f4, p5.marginLeft = m8;
    }
    return (n10 && !r5 ? t5.contains(l2) : t5 === l2 && l2.nodeName !== "BODY") && (p5 = gh(p5, t5)), p5;
  }
  function wh(e10) {
    var t5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, r5 = e10.ownerDocument.documentElement, n10 = E0(e10, r5), a2 = Math.max(r5.clientWidth, window.innerWidth || 0), o10 = Math.max(r5.clientHeight, window.innerHeight || 0), i10 = t5 ? 0 : Sa(r5), l2 = t5 ? 0 : Sa(r5, "left"), d3 = { top: i10 - n10.top + n10.marginTop, left: l2 - n10.left + n10.marginLeft, width: a2, height: o10 };
    return Ur(d3);
  }
  function Au(e10) {
    var t5 = e10.nodeName;
    if (t5 === "BODY" || t5 === "HTML") return !1;
    if (Cn(e10, "position") === "fixed") return !0;
    var r5 = I0(e10);
    return r5 ? Au(r5) : !1;
  }
  function Bu(e10) {
    if (!e10 || !e10.parentElement || Ca()) return document.documentElement;
    for (var t5 = e10.parentElement; t5 && Cn(t5, "transform") === "none"; ) t5 = t5.parentElement;
    return t5 || document.documentElement;
  }
  function T0(e10, t5, r5, n10) {
    var a2 = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !1, o10 = { top: 0, left: 0 }, i10 = a2 ? Bu(e10) : Di(e10, Mu(t5));
    if (n10 === "viewport") o10 = wh(i10, a2);
    else {
      var l2 = void 0;
      n10 === "scrollParent" ? (l2 = so(I0(t5)), l2.nodeName === "BODY" && (l2 = e10.ownerDocument.documentElement)) : n10 === "window" ? l2 = e10.ownerDocument.documentElement : l2 = n10;
      var d3 = E0(l2, i10, a2);
      if (l2.nodeName === "HTML" && !Au(i10)) {
        var u3 = Lu(e10.ownerDocument), c10 = u3.height, p5 = u3.width;
        o10.top += d3.top - d3.marginTop, o10.bottom = c10 + d3.top, o10.left += d3.left - d3.marginLeft, o10.right = p5 + d3.left;
      } else o10 = d3;
    }
    r5 = r5 || 0;
    var f4 = typeof r5 == "number";
    return o10.left += f4 ? r5 : r5.left || 0, o10.top += f4 ? r5 : r5.top || 0, o10.right -= f4 ? r5 : r5.right || 0, o10.bottom -= f4 ? r5 : r5.bottom || 0, o10;
  }
  function bh(e10) {
    var t5 = e10.width, r5 = e10.height;
    return t5 * r5;
  }
  function _u(e10, t5, r5, n10, a2) {
    var o10 = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 0;
    if (e10.indexOf("auto") === -1) return e10;
    var i10 = T0(r5, n10, o10, a2), l2 = { top: { width: i10.width, height: t5.top - i10.top }, right: { width: i10.right - t5.right, height: i10.height }, bottom: { width: i10.width, height: i10.bottom - t5.bottom }, left: { width: t5.left - i10.left, height: i10.height } }, d3 = Object.keys(l2).map(function(f4) {
      return Lt({ key: f4 }, l2[f4], { area: bh(l2[f4]) });
    }).sort(function(f4, m8) {
      return m8.area - f4.area;
    }), u3 = d3.filter(function(f4) {
      var m8 = f4.width, h2 = f4.height;
      return m8 >= r5.clientWidth && h2 >= r5.clientHeight;
    }), c10 = u3.length > 0 ? u3[0].key : d3[0].key, p5 = e10.split("-")[1];
    return c10 + (p5 ? "-" + p5 : "");
  }
  function Fu(e10, t5, r5) {
    var n10 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null, a2 = n10 ? Bu(t5) : Di(t5, Mu(r5));
    return E0(r5, a2, n10);
  }
  function Pu(e10) {
    var t5 = e10.ownerDocument.defaultView, r5 = t5.getComputedStyle(e10), n10 = parseFloat(r5.marginTop || 0) + parseFloat(r5.marginBottom || 0), a2 = parseFloat(r5.marginLeft || 0) + parseFloat(r5.marginRight || 0), o10 = { width: e10.offsetWidth + a2, height: e10.offsetHeight + n10 };
    return o10;
  }
  function Vi(e10) {
    var t5 = { left: "right", right: "left", bottom: "top", top: "bottom" };
    return e10.replace(/left|right|bottom|top/g, function(r5) {
      return t5[r5];
    });
  }
  function Ou(e10, t5, r5) {
    r5 = r5.split("-")[0];
    var n10 = Pu(e10), a2 = { width: n10.width, height: n10.height }, o10 = ["right", "left"].indexOf(r5) !== -1, i10 = o10 ? "top" : "left", l2 = o10 ? "left" : "top", d3 = o10 ? "height" : "width", u3 = o10 ? "width" : "height";
    return a2[i10] = t5[i10] + t5[d3] / 2 - n10[d3] / 2, r5 === l2 ? a2[l2] = t5[l2] - n10[u3] : a2[l2] = t5[Vi(l2)], a2;
  }
  function lo(e10, t5) {
    return Array.prototype.find ? e10.find(t5) : e10.filter(t5)[0];
  }
  function Sh(e10, t5, r5) {
    if (Array.prototype.findIndex) return e10.findIndex(function(a2) {
      return a2[t5] === r5;
    });
    var n10 = lo(e10, function(a2) {
      return a2[t5] === r5;
    });
    return e10.indexOf(n10);
  }
  function Nu(e10, t5, r5) {
    var n10 = r5 === void 0 ? e10 : e10.slice(0, Sh(e10, "name", r5));
    return n10.forEach(function(a2) {
      a2.function && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
      var o10 = a2.function || a2.fn;
      a2.enabled && Tu(o10) && (t5.offsets.popper = Ur(t5.offsets.popper), t5.offsets.reference = Ur(t5.offsets.reference), t5 = o10(t5, a2));
    }), t5;
  }
  function xh() {
    if (!this.state.isDestroyed) {
      var e10 = { instance: this, styles: {}, arrowStyles: {}, attributes: {}, flipped: !1, offsets: {} };
      e10.offsets.reference = Fu(this.state, this.popper, this.reference, this.options.positionFixed), e10.placement = _u(this.options.placement, e10.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e10.originalPlacement = e10.placement, e10.positionFixed = this.options.positionFixed, e10.offsets.popper = Ou(this.popper, e10.offsets.reference, e10.placement), e10.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e10 = Nu(this.modifiers, e10), this.state.isCreated ? this.options.onUpdate(e10) : (this.state.isCreated = !0, this.options.onCreate(e10));
    }
  }
  function Ru(e10, t5) {
    return e10.some(function(r5) {
      var n10 = r5.name, a2 = r5.enabled;
      return a2 && n10 === t5;
    });
  }
  function M0(e10) {
    for (var t5 = [!1, "ms", "Webkit", "Moz", "O"], r5 = e10.charAt(0).toUpperCase() + e10.slice(1), n10 = 0; n10 < t5.length; n10++) {
      var a2 = t5[n10], o10 = a2 ? "" + a2 + r5 : e10;
      if (typeof document.body.style[o10] < "u") return o10;
    }
    return null;
  }
  function Ch() {
    return this.state.isDestroyed = !0, Ru(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[M0("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this;
  }
  function Hu(e10) {
    var t5 = e10.ownerDocument;
    return t5 ? t5.defaultView : window;
  }
  function Du(e10, t5, r5, n10) {
    var a2 = e10.nodeName === "BODY", o10 = a2 ? e10.ownerDocument.defaultView : e10;
    o10.addEventListener(t5, r5, { passive: !0 }), a2 || Du(so(o10.parentNode), t5, r5, n10), n10.push(o10);
  }
  function kh(e10, t5, r5, n10) {
    r5.updateBound = n10, Hu(e10).addEventListener("resize", r5.updateBound, { passive: !0 });
    var a2 = so(e10);
    return Du(a2, "scroll", r5.updateBound, r5.scrollParents), r5.scrollElement = a2, r5.eventsEnabled = !0, r5;
  }
  function Ih() {
    this.state.eventsEnabled || (this.state = kh(this.reference, this.options, this.state, this.scheduleUpdate));
  }
  function Eh(e10, t5) {
    return Hu(e10).removeEventListener("resize", t5.updateBound), t5.scrollParents.forEach(function(r5) {
      r5.removeEventListener("scroll", t5.updateBound);
    }), t5.updateBound = null, t5.scrollParents = [], t5.scrollElement = null, t5.eventsEnabled = !1, t5;
  }
  function Th() {
    this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = Eh(this.reference, this.state));
  }
  function L0(e10) {
    return e10 !== "" && !isNaN(parseFloat(e10)) && isFinite(e10);
  }
  function k0(e10, t5) {
    Object.keys(t5).forEach(function(r5) {
      var n10 = "";
      ["width", "height", "top", "right", "bottom", "left"].indexOf(r5) !== -1 && L0(t5[r5]) && (n10 = "px"), e10.style[r5] = t5[r5] + n10;
    });
  }
  function Mh(e10, t5) {
    Object.keys(t5).forEach(function(r5) {
      var n10 = t5[r5];
      n10 !== !1 ? e10.setAttribute(r5, t5[r5]) : e10.removeAttribute(r5);
    });
  }
  function Lh(e10) {
    return k0(e10.instance.popper, e10.styles), Mh(e10.instance.popper, e10.attributes), e10.arrowElement && Object.keys(e10.arrowStyles).length && k0(e10.arrowElement, e10.arrowStyles), e10;
  }
  function Ah(e10, t5, r5, n10, a2) {
    var o10 = Fu(a2, t5, e10, r5.positionFixed), i10 = _u(r5.placement, o10, t5, e10, r5.modifiers.flip.boundariesElement, r5.modifiers.flip.padding);
    return t5.setAttribute("x-placement", i10), k0(t5, { position: r5.positionFixed ? "fixed" : "absolute" }), r5;
  }
  function Bh(e10, t5) {
    var r5 = e10.offsets, n10 = r5.popper, a2 = r5.reference, o10 = Math.round, i10 = Math.floor, l2 = function(y10) {
      return y10;
    }, d3 = o10(a2.width), u3 = o10(n10.width), c10 = ["left", "right"].indexOf(e10.placement) !== -1, p5 = e10.placement.indexOf("-") !== -1, f4 = d3 % 2 === u3 % 2, m8 = d3 % 2 === 1 && u3 % 2 === 1, h2 = t5 ? c10 || p5 || f4 ? o10 : i10 : l2, g3 = t5 ? o10 : l2;
    return { left: h2(m8 && !p5 && t5 ? n10.left - 1 : n10.left), top: g3(n10.top), bottom: g3(n10.bottom), right: h2(n10.right) };
  }
  var _h = io && /Firefox/i.test(navigator.userAgent);
  function Fh(e10, t5) {
    var r5 = t5.x, n10 = t5.y, a2 = e10.offsets.popper, o10 = lo(e10.instance.modifiers, function(C3) {
      return C3.name === "applyStyle";
    }).gpuAcceleration;
    o10 !== void 0 && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
    var i10 = o10 !== void 0 ? o10 : t5.gpuAcceleration, l2 = ba(e10.instance.popper), d3 = C0(l2), u3 = { position: a2.position }, c10 = Bh(e10, window.devicePixelRatio < 2 || !_h), p5 = r5 === "bottom" ? "top" : "bottom", f4 = n10 === "right" ? "left" : "right", m8 = M0("transform"), h2 = void 0, g3 = void 0;
    if (p5 === "bottom" ? l2.nodeName === "HTML" ? g3 = -l2.clientHeight + c10.bottom : g3 = -d3.height + c10.bottom : g3 = c10.top, f4 === "right" ? l2.nodeName === "HTML" ? h2 = -l2.clientWidth + c10.right : h2 = -d3.width + c10.right : h2 = c10.left, i10 && m8) u3[m8] = "translate3d(" + h2 + "px, " + g3 + "px, 0)", u3[p5] = 0, u3[f4] = 0, u3.willChange = "transform";
    else {
      var w2 = p5 === "bottom" ? -1 : 1, y10 = f4 === "right" ? -1 : 1;
      u3[p5] = g3 * w2, u3[f4] = h2 * y10, u3.willChange = p5 + ", " + f4;
    }
    var v5 = { "x-placement": e10.placement };
    return e10.attributes = Lt({}, v5, e10.attributes), e10.styles = Lt({}, u3, e10.styles), e10.arrowStyles = Lt({}, e10.offsets.arrow, e10.arrowStyles), e10;
  }
  function Vu(e10, t5, r5) {
    var n10 = lo(e10, function(l2) {
      var d3 = l2.name;
      return d3 === t5;
    }), a2 = !!n10 && e10.some(function(l2) {
      return l2.name === r5 && l2.enabled && l2.order < n10.order;
    });
    if (!a2) {
      var o10 = "`" + t5 + "`", i10 = "`" + r5 + "`";
      console.warn(i10 + " modifier is required by " + o10 + " modifier in order to work, be sure to include it before " + o10 + "!");
    }
    return a2;
  }
  function Ph(e10, t5) {
    var r5;
    if (!Vu(e10.instance.modifiers, "arrow", "keepTogether")) return e10;
    var n10 = t5.element;
    if (typeof n10 == "string") {
      if (n10 = e10.instance.popper.querySelector(n10), !n10) return e10;
    } else if (!e10.instance.popper.contains(n10)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), e10;
    var a2 = e10.placement.split("-")[0], o10 = e10.offsets, i10 = o10.popper, l2 = o10.reference, d3 = ["left", "right"].indexOf(a2) !== -1, u3 = d3 ? "height" : "width", c10 = d3 ? "Top" : "Left", p5 = c10.toLowerCase(), f4 = d3 ? "left" : "top", m8 = d3 ? "bottom" : "right", h2 = Pu(n10)[u3];
    l2[m8] - h2 < i10[p5] && (e10.offsets.popper[p5] -= i10[p5] - (l2[m8] - h2)), l2[p5] + h2 > i10[m8] && (e10.offsets.popper[p5] += l2[p5] + h2 - i10[m8]), e10.offsets.popper = Ur(e10.offsets.popper);
    var g3 = l2[p5] + l2[u3] / 2 - h2 / 2, w2 = Cn(e10.instance.popper), y10 = parseFloat(w2["margin" + c10]), v5 = parseFloat(w2["border" + c10 + "Width"]), C3 = g3 - e10.offsets.popper[p5] - y10 - v5;
    return C3 = Math.max(Math.min(i10[u3] - h2, C3), 0), e10.arrowElement = n10, e10.offsets.arrow = (r5 = {}, xa(r5, p5, Math.round(C3)), xa(r5, f4, ""), r5), e10;
  }
  function Oh(e10) {
    return e10 === "end" ? "start" : e10 === "start" ? "end" : e10;
  }
  var zu = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"], b0 = zu.slice(3);
  function Eu(e10) {
    var t5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, r5 = b0.indexOf(e10), n10 = b0.slice(r5 + 1).concat(b0.slice(0, r5));
    return t5 ? n10.reverse() : n10;
  }
  var S0 = { FLIP: "flip", CLOCKWISE: "clockwise", COUNTERCLOCKWISE: "counterclockwise" };
  function Nh(e10, t5) {
    if (Ru(e10.instance.modifiers, "inner") || e10.flipped && e10.placement === e10.originalPlacement) return e10;
    var r5 = T0(e10.instance.popper, e10.instance.reference, t5.padding, t5.boundariesElement, e10.positionFixed), n10 = e10.placement.split("-")[0], a2 = Vi(n10), o10 = e10.placement.split("-")[1] || "", i10 = [];
    switch (t5.behavior) {
      case S0.FLIP:
        i10 = [n10, a2];
        break;
      case S0.CLOCKWISE:
        i10 = Eu(n10);
        break;
      case S0.COUNTERCLOCKWISE:
        i10 = Eu(n10, !0);
        break;
      default:
        i10 = t5.behavior;
    }
    return i10.forEach(function(l2, d3) {
      if (n10 !== l2 || i10.length === d3 + 1) return e10;
      n10 = e10.placement.split("-")[0], a2 = Vi(n10);
      var u3 = e10.offsets.popper, c10 = e10.offsets.reference, p5 = Math.floor, f4 = n10 === "left" && p5(u3.right) > p5(c10.left) || n10 === "right" && p5(u3.left) < p5(c10.right) || n10 === "top" && p5(u3.bottom) > p5(c10.top) || n10 === "bottom" && p5(u3.top) < p5(c10.bottom), m8 = p5(u3.left) < p5(r5.left), h2 = p5(u3.right) > p5(r5.right), g3 = p5(u3.top) < p5(r5.top), w2 = p5(u3.bottom) > p5(r5.bottom), y10 = n10 === "left" && m8 || n10 === "right" && h2 || n10 === "top" && g3 || n10 === "bottom" && w2, v5 = ["top", "bottom"].indexOf(n10) !== -1, C3 = !!t5.flipVariations && (v5 && o10 === "start" && m8 || v5 && o10 === "end" && h2 || !v5 && o10 === "start" && g3 || !v5 && o10 === "end" && w2), b8 = !!t5.flipVariationsByContent && (v5 && o10 === "start" && h2 || v5 && o10 === "end" && m8 || !v5 && o10 === "start" && w2 || !v5 && o10 === "end" && g3), I = C3 || b8;
      (f4 || y10 || I) && (e10.flipped = !0, (f4 || y10) && (n10 = i10[d3 + 1]), I && (o10 = Oh(o10)), e10.placement = n10 + (o10 ? "-" + o10 : ""), e10.offsets.popper = Lt({}, e10.offsets.popper, Ou(e10.instance.popper, e10.offsets.reference, e10.placement)), e10 = Nu(e10.instance.modifiers, e10, "flip"));
    }), e10;
  }
  function Rh(e10) {
    var t5 = e10.offsets, r5 = t5.popper, n10 = t5.reference, a2 = e10.placement.split("-")[0], o10 = Math.floor, i10 = ["top", "bottom"].indexOf(a2) !== -1, l2 = i10 ? "right" : "bottom", d3 = i10 ? "left" : "top", u3 = i10 ? "width" : "height";
    return r5[l2] < o10(n10[d3]) && (e10.offsets.popper[d3] = o10(n10[d3]) - r5[u3]), r5[d3] > o10(n10[l2]) && (e10.offsets.popper[d3] = o10(n10[l2])), e10;
  }
  function Hh(e10, t5, r5, n10) {
    var a2 = e10.match(/((?:\-|\+)?\d*\.?\d*)(.*)/), o10 = +a2[1], i10 = a2[2];
    if (!o10) return e10;
    if (i10.indexOf("%") === 0) {
      var l2 = void 0;
      i10 === "%p" ? l2 = r5 : l2 = n10;
      var d3 = Ur(l2);
      return d3[t5] / 100 * o10;
    } else if (i10 === "vh" || i10 === "vw") {
      var u3 = void 0;
      return i10 === "vh" ? u3 = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : u3 = Math.max(document.documentElement.clientWidth, window.innerWidth || 0), u3 / 100 * o10;
    } else return o10;
  }
  function Dh(e10, t5, r5, n10) {
    var a2 = [0, 0], o10 = ["right", "left"].indexOf(n10) !== -1, i10 = e10.split(/(\+|\-)/).map(function(c10) {
      return c10.trim();
    }), l2 = i10.indexOf(lo(i10, function(c10) {
      return c10.search(/,|\s/) !== -1;
    }));
    i10[l2] && i10[l2].indexOf(",") === -1 && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
    var d3 = /\s*,\s*|\s+/, u3 = l2 !== -1 ? [i10.slice(0, l2).concat([i10[l2].split(d3)[0]]), [i10[l2].split(d3)[1]].concat(i10.slice(l2 + 1))] : [i10];
    return u3 = u3.map(function(c10, p5) {
      var f4 = (p5 === 1 ? !o10 : o10) ? "height" : "width", m8 = !1;
      return c10.reduce(function(h2, g3) {
        return h2[h2.length - 1] === "" && ["+", "-"].indexOf(g3) !== -1 ? (h2[h2.length - 1] = g3, m8 = !0, h2) : m8 ? (h2[h2.length - 1] += g3, m8 = !1, h2) : h2.concat(g3);
      }, []).map(function(h2) {
        return Hh(h2, f4, t5, r5);
      });
    }), u3.forEach(function(c10, p5) {
      c10.forEach(function(f4, m8) {
        L0(f4) && (a2[p5] += f4 * (c10[m8 - 1] === "-" ? -1 : 1));
      });
    }), a2;
  }
  function Vh(e10, t5) {
    var r5 = t5.offset, n10 = e10.placement, a2 = e10.offsets, o10 = a2.popper, i10 = a2.reference, l2 = n10.split("-")[0], d3 = void 0;
    return L0(+r5) ? d3 = [+r5, 0] : d3 = Dh(r5, o10, i10, l2), l2 === "left" ? (o10.top += d3[0], o10.left -= d3[1]) : l2 === "right" ? (o10.top += d3[0], o10.left += d3[1]) : l2 === "top" ? (o10.left += d3[0], o10.top -= d3[1]) : l2 === "bottom" && (o10.left += d3[0], o10.top += d3[1]), e10.popper = o10, e10;
  }
  function zh(e10, t5) {
    var r5 = t5.boundariesElement || ba(e10.instance.popper);
    e10.instance.reference === r5 && (r5 = ba(r5));
    var n10 = M0("transform"), a2 = e10.instance.popper.style, o10 = a2.top, i10 = a2.left, l2 = a2[n10];
    a2.top = "", a2.left = "", a2[n10] = "";
    var d3 = T0(e10.instance.popper, e10.instance.reference, t5.padding, r5, e10.positionFixed);
    a2.top = o10, a2.left = i10, a2[n10] = l2, t5.boundaries = d3;
    var u3 = t5.priority, c10 = e10.offsets.popper, p5 = { primary: function(m8) {
      var h2 = c10[m8];
      return c10[m8] < d3[m8] && !t5.escapeWithReference && (h2 = Math.max(c10[m8], d3[m8])), xa({}, m8, h2);
    }, secondary: function(m8) {
      var h2 = m8 === "right" ? "left" : "top", g3 = c10[h2];
      return c10[m8] > d3[m8] && !t5.escapeWithReference && (g3 = Math.min(c10[h2], d3[m8] - (m8 === "right" ? c10.width : c10.height))), xa({}, h2, g3);
    } };
    return u3.forEach(function(f4) {
      var m8 = ["left", "top"].indexOf(f4) !== -1 ? "primary" : "secondary";
      c10 = Lt({}, c10, p5[m8](f4));
    }), e10.offsets.popper = c10, e10;
  }
  function Zh(e10) {
    var t5 = e10.placement, r5 = t5.split("-")[0], n10 = t5.split("-")[1];
    if (n10) {
      var a2 = e10.offsets, o10 = a2.reference, i10 = a2.popper, l2 = ["bottom", "top"].indexOf(r5) !== -1, d3 = l2 ? "left" : "top", u3 = l2 ? "width" : "height", c10 = { start: xa({}, d3, o10[d3]), end: xa({}, d3, o10[d3] + o10[u3] - i10[u3]) };
      e10.offsets.popper = Lt({}, i10, c10[n10]);
    }
    return e10;
  }
  function jh(e10) {
    if (!Vu(e10.instance.modifiers, "hide", "preventOverflow")) return e10;
    var t5 = e10.offsets.reference, r5 = lo(e10.instance.modifiers, function(n10) {
      return n10.name === "preventOverflow";
    }).boundaries;
    if (t5.bottom < r5.top || t5.left > r5.right || t5.top > r5.bottom || t5.right < r5.left) {
      if (e10.hide === !0) return e10;
      e10.hide = !0, e10.attributes["x-out-of-boundaries"] = "";
    } else {
      if (e10.hide === !1) return e10;
      e10.hide = !1, e10.attributes["x-out-of-boundaries"] = !1;
    }
    return e10;
  }
  function Uh(e10) {
    var t5 = e10.placement, r5 = t5.split("-")[0], n10 = e10.offsets, a2 = n10.popper, o10 = n10.reference, i10 = ["left", "right"].indexOf(r5) !== -1, l2 = ["top", "left"].indexOf(r5) === -1;
    return a2[i10 ? "left" : "top"] = o10[r5] - (l2 ? a2[i10 ? "width" : "height"] : 0), e10.placement = Vi(t5), e10.offsets.popper = Ur(a2), e10;
  }
  var $h = { shift: { order: 100, enabled: !0, fn: Zh }, offset: { order: 200, enabled: !0, fn: Vh, offset: 0 }, preventOverflow: { order: 300, enabled: !0, fn: zh, priority: ["left", "right", "top", "bottom"], padding: 5, boundariesElement: "scrollParent" }, keepTogether: { order: 400, enabled: !0, fn: Rh }, arrow: { order: 500, enabled: !0, fn: Ph, element: "[x-arrow]" }, flip: { order: 600, enabled: !0, fn: Nh, behavior: "flip", padding: 5, boundariesElement: "viewport", flipVariations: !1, flipVariationsByContent: !1 }, inner: { order: 700, enabled: !1, fn: Uh }, hide: { order: 800, enabled: !0, fn: jh }, computeStyle: { order: 850, enabled: !0, fn: Fh, gpuAcceleration: !0, x: "bottom", y: "right" }, applyStyle: { order: 900, enabled: !0, fn: Lh, onLoad: Ah, gpuAcceleration: void 0 } }, Wh = { placement: "bottom", positionFixed: !1, eventsEnabled: !0, removeOnDestroy: !1, onCreate: function() {
  }, onUpdate: function() {
  }, modifiers: $h }, zi = (function() {
    function e10(t5, r5) {
      var n10 = this, a2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      vh(this, e10), this.scheduleUpdate = function() {
        return requestAnimationFrame(n10.update);
      }, this.update = mh(this.update.bind(this)), this.options = Lt({}, e10.Defaults, a2), this.state = { isDestroyed: !1, isCreated: !1, scrollParents: [] }, this.reference = t5 && t5.jquery ? t5[0] : t5, this.popper = r5 && r5.jquery ? r5[0] : r5, this.options.modifiers = {}, Object.keys(Lt({}, e10.Defaults.modifiers, a2.modifiers)).forEach(function(i10) {
        n10.options.modifiers[i10] = Lt({}, e10.Defaults.modifiers[i10] || {}, a2.modifiers ? a2.modifiers[i10] : {});
      }), this.modifiers = Object.keys(this.options.modifiers).map(function(i10) {
        return Lt({ name: i10 }, n10.options.modifiers[i10]);
      }).sort(function(i10, l2) {
        return i10.order - l2.order;
      }), this.modifiers.forEach(function(i10) {
        i10.enabled && Tu(i10.onLoad) && i10.onLoad(n10.reference, n10.popper, n10.options, i10, n10.state);
      }), this.update();
      var o10 = this.options.eventsEnabled;
      o10 && this.enableEventListeners(), this.state.eventsEnabled = o10;
    }
    return yh(e10, [{ key: "update", value: function() {
      return xh.call(this);
    } }, { key: "destroy", value: function() {
      return Ch.call(this);
    } }, { key: "enableEventListeners", value: function() {
      return Ih.call(this);
    } }, { key: "disableEventListeners", value: function() {
      return Th.call(this);
    } }]), e10;
  })();
  zi.Utils = window.PopperUtils;
  zi.placements = zu;
  zi.Defaults = Wh;
  var A0 = zi, Wi = Jt(Hi()), qh = ["innerHTML", "ownerDocument", "style", "attributes", "nodeValue"], Gh = ["Array", "ArrayBuffer", "AsyncFunction", "AsyncGenerator", "AsyncGeneratorFunction", "Date", "Error", "Function", "Generator", "GeneratorFunction", "HTMLElement", "Map", "Object", "Promise", "RegExp", "Set", "WeakMap", "WeakSet"], Qh = ["bigint", "boolean", "null", "number", "string", "symbol", "undefined"];
  function Zi(e10) {
    var t5 = Object.prototype.toString.call(e10).slice(8, -1);
    if (/HTML\w+Element/.test(t5)) return "HTMLElement";
    if (Yh(t5)) return t5;
  }
  function zt(e10) {
    return function(t5) {
      return Zi(t5) === e10;
    };
  }
  function Yh(e10) {
    return Gh.includes(e10);
  }
  function ka(e10) {
    return function(t5) {
      return typeof t5 === e10;
    };
  }
  function Jh(e10) {
    return Qh.includes(e10);
  }
  function F2(e10) {
    if (e10 === null) return "null";
    switch (typeof e10) {
      case "bigint":
        return "bigint";
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
      case "symbol":
        return "symbol";
      case "undefined":
        return "undefined";
    }
    if (F2.array(e10)) return "Array";
    if (F2.plainFunction(e10)) return "Function";
    var t5 = Zi(e10);
    return t5 || "Object";
  }
  F2.array = Array.isArray;
  F2.arrayOf = function(e10, t5) {
    return !F2.array(e10) && !F2.function(t5) ? !1 : e10.every(function(r5) {
      return t5(r5);
    });
  };
  F2.asyncGeneratorFunction = function(e10) {
    return Zi(e10) === "AsyncGeneratorFunction";
  };
  F2.asyncFunction = zt("AsyncFunction");
  F2.bigint = ka("bigint");
  F2.boolean = function(e10) {
    return e10 === !0 || e10 === !1;
  };
  F2.date = zt("Date");
  F2.defined = function(e10) {
    return !F2.undefined(e10);
  };
  F2.domElement = function(e10) {
    return F2.object(e10) && !F2.plainObject(e10) && e10.nodeType === 1 && F2.string(e10.nodeName) && qh.every(function(t5) {
      return t5 in e10;
    });
  };
  F2.empty = function(e10) {
    return F2.string(e10) && e10.length === 0 || F2.array(e10) && e10.length === 0 || F2.object(e10) && !F2.map(e10) && !F2.set(e10) && Object.keys(e10).length === 0 || F2.set(e10) && e10.size === 0 || F2.map(e10) && e10.size === 0;
  };
  F2.error = zt("Error");
  F2.function = ka("function");
  F2.generator = function(e10) {
    return F2.iterable(e10) && F2.function(e10.next) && F2.function(e10.throw);
  };
  F2.generatorFunction = zt("GeneratorFunction");
  F2.instanceOf = function(e10, t5) {
    return !e10 || !t5 ? !1 : Object.getPrototypeOf(e10) === t5.prototype;
  };
  F2.iterable = function(e10) {
    return !F2.nullOrUndefined(e10) && F2.function(e10[Symbol.iterator]);
  };
  F2.map = zt("Map");
  F2.nan = function(e10) {
    return Number.isNaN(e10);
  };
  F2.null = function(e10) {
    return e10 === null;
  };
  F2.nullOrUndefined = function(e10) {
    return F2.null(e10) || F2.undefined(e10);
  };
  F2.number = function(e10) {
    return ka("number")(e10) && !F2.nan(e10);
  };
  F2.numericString = function(e10) {
    return F2.string(e10) && e10.length > 0 && !Number.isNaN(Number(e10));
  };
  F2.object = function(e10) {
    return !F2.nullOrUndefined(e10) && (F2.function(e10) || typeof e10 == "object");
  };
  F2.oneOf = function(e10, t5) {
    return F2.array(e10) ? e10.indexOf(t5) > -1 : !1;
  };
  F2.plainFunction = zt("Function");
  F2.plainObject = function(e10) {
    if (Zi(e10) !== "Object") return !1;
    var t5 = Object.getPrototypeOf(e10);
    return t5 === null || t5 === Object.getPrototypeOf({});
  };
  F2.primitive = function(e10) {
    return F2.null(e10) || Jh(typeof e10);
  };
  F2.promise = zt("Promise");
  F2.propertyOf = function(e10, t5, r5) {
    if (!F2.object(e10) || !t5) return !1;
    var n10 = e10[t5];
    return F2.function(r5) ? r5(n10) : F2.defined(n10);
  };
  F2.regexp = zt("RegExp");
  F2.set = zt("Set");
  F2.string = ka("string");
  F2.symbol = ka("symbol");
  F2.undefined = ka("undefined");
  F2.weakMap = zt("WeakMap");
  F2.weakSet = zt("WeakSet");
  var wt = F2;
  function Zu(e10) {
    return function(t5) {
      return typeof t5 === e10;
    };
  }
  var Kh = Zu("function"), Xh = function(e10) {
    return e10 === null;
  }, B0 = function(e10) {
    return Object.prototype.toString.call(e10).slice(8, -1) === "RegExp";
  }, _0 = function(e10) {
    return !e6(e10) && !Xh(e10) && (Kh(e10) || typeof e10 == "object");
  }, e6 = Zu("undefined"), F0 = function(e10) {
    var t5 = typeof Symbol == "function" && Symbol.iterator, r5 = t5 && e10[t5], n10 = 0;
    if (r5) return r5.call(e10);
    if (e10 && typeof e10.length == "number") return { next: function() {
      return e10 && n10 >= e10.length && (e10 = void 0), { value: e10 && e10[n10++], done: !e10 };
    } };
    throw new TypeError(t5 ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function t6(e10, t5) {
    var r5 = e10.length;
    if (r5 !== t5.length) return !1;
    for (var n10 = r5; n10-- !== 0; ) if (!qe(e10[n10], t5[n10])) return !1;
    return !0;
  }
  function r6(e10, t5) {
    if (e10.byteLength !== t5.byteLength) return !1;
    for (var r5 = new DataView(e10.buffer), n10 = new DataView(t5.buffer), a2 = e10.byteLength; a2--; ) if (r5.getUint8(a2) !== n10.getUint8(a2)) return !1;
    return !0;
  }
  function n6(e10, t5) {
    var r5, n10, a2, o10;
    if (e10.size !== t5.size) return !1;
    try {
      for (var i10 = F0(e10.entries()), l2 = i10.next(); !l2.done; l2 = i10.next()) {
        var d3 = l2.value;
        if (!t5.has(d3[0])) return !1;
      }
    } catch (p5) {
      r5 = { error: p5 };
    } finally {
      try {
        l2 && !l2.done && (n10 = i10.return) && n10.call(i10);
      } finally {
        if (r5) throw r5.error;
      }
    }
    try {
      for (var u3 = F0(e10.entries()), c10 = u3.next(); !c10.done; c10 = u3.next()) {
        var d3 = c10.value;
        if (!qe(d3[1], t5.get(d3[0]))) return !1;
      }
    } catch (p5) {
      a2 = { error: p5 };
    } finally {
      try {
        c10 && !c10.done && (o10 = u3.return) && o10.call(u3);
      } finally {
        if (a2) throw a2.error;
      }
    }
    return !0;
  }
  function a6(e10, t5) {
    var r5, n10;
    if (e10.size !== t5.size) return !1;
    try {
      for (var a2 = F0(e10.entries()), o10 = a2.next(); !o10.done; o10 = a2.next()) {
        var i10 = o10.value;
        if (!t5.has(i10[0])) return !1;
      }
    } catch (l2) {
      r5 = { error: l2 };
    } finally {
      try {
        o10 && !o10.done && (n10 = a2.return) && n10.call(a2);
      } finally {
        if (r5) throw r5.error;
      }
    }
    return !0;
  }
  function qe(e10, t5) {
    if (e10 === t5) return !0;
    if (e10 && _0(e10) && t5 && _0(t5)) {
      if (e10.constructor !== t5.constructor) return !1;
      if (Array.isArray(e10) && Array.isArray(t5)) return t6(e10, t5);
      if (e10 instanceof Map && t5 instanceof Map) return n6(e10, t5);
      if (e10 instanceof Set && t5 instanceof Set) return a6(e10, t5);
      if (ArrayBuffer.isView(e10) && ArrayBuffer.isView(t5)) return r6(e10, t5);
      if (B0(e10) && B0(t5)) return e10.source === t5.source && e10.flags === t5.flags;
      if (e10.valueOf !== Object.prototype.valueOf) return e10.valueOf() === t5.valueOf();
      if (e10.toString !== Object.prototype.toString) return e10.toString() === t5.toString();
      var r5 = Object.keys(e10), n10 = Object.keys(t5);
      if (r5.length !== n10.length) return !1;
      for (var a2 = r5.length; a2-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t5, r5[a2])) return !1;
      for (var a2 = r5.length; a2-- !== 0; ) {
        var o10 = r5[a2];
        if (!(o10 === "_owner" && e10.$$typeof) && !qe(e10[o10], t5[o10])) return !1;
      }
      return !0;
    }
    return Number.isNaN(e10) && Number.isNaN(t5) ? !0 : e10 === t5;
  }
  var o6 = ["innerHTML", "ownerDocument", "style", "attributes", "nodeValue"], i6 = ["Array", "ArrayBuffer", "AsyncFunction", "AsyncGenerator", "AsyncGeneratorFunction", "Date", "Error", "Function", "Generator", "GeneratorFunction", "HTMLElement", "Map", "Object", "Promise", "RegExp", "Set", "WeakMap", "WeakSet"], s6 = ["bigint", "boolean", "null", "number", "string", "symbol", "undefined"];
  function ji(e10) {
    var t5 = Object.prototype.toString.call(e10).slice(8, -1);
    if (/HTML\w+Element/.test(t5)) return "HTMLElement";
    if (l6(t5)) return t5;
  }
  function Zt(e10) {
    return function(t5) {
      return ji(t5) === e10;
    };
  }
  function l6(e10) {
    return i6.includes(e10);
  }
  function Ia(e10) {
    return function(t5) {
      return typeof t5 === e10;
    };
  }
  function d6(e10) {
    return s6.includes(e10);
  }
  function P4(e10) {
    if (e10 === null) return "null";
    switch (typeof e10) {
      case "bigint":
        return "bigint";
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
      case "symbol":
        return "symbol";
      case "undefined":
        return "undefined";
    }
    if (P4.array(e10)) return "Array";
    if (P4.plainFunction(e10)) return "Function";
    var t5 = ji(e10);
    return t5 || "Object";
  }
  P4.array = Array.isArray;
  P4.arrayOf = function(e10, t5) {
    return !P4.array(e10) && !P4.function(t5) ? !1 : e10.every(function(r5) {
      return t5(r5);
    });
  };
  P4.asyncGeneratorFunction = function(e10) {
    return ji(e10) === "AsyncGeneratorFunction";
  };
  P4.asyncFunction = Zt("AsyncFunction");
  P4.bigint = Ia("bigint");
  P4.boolean = function(e10) {
    return e10 === !0 || e10 === !1;
  };
  P4.date = Zt("Date");
  P4.defined = function(e10) {
    return !P4.undefined(e10);
  };
  P4.domElement = function(e10) {
    return P4.object(e10) && !P4.plainObject(e10) && e10.nodeType === 1 && P4.string(e10.nodeName) && o6.every(function(t5) {
      return t5 in e10;
    });
  };
  P4.empty = function(e10) {
    return P4.string(e10) && e10.length === 0 || P4.array(e10) && e10.length === 0 || P4.object(e10) && !P4.map(e10) && !P4.set(e10) && Object.keys(e10).length === 0 || P4.set(e10) && e10.size === 0 || P4.map(e10) && e10.size === 0;
  };
  P4.error = Zt("Error");
  P4.function = Ia("function");
  P4.generator = function(e10) {
    return P4.iterable(e10) && P4.function(e10.next) && P4.function(e10.throw);
  };
  P4.generatorFunction = Zt("GeneratorFunction");
  P4.instanceOf = function(e10, t5) {
    return !e10 || !t5 ? !1 : Object.getPrototypeOf(e10) === t5.prototype;
  };
  P4.iterable = function(e10) {
    return !P4.nullOrUndefined(e10) && P4.function(e10[Symbol.iterator]);
  };
  P4.map = Zt("Map");
  P4.nan = function(e10) {
    return Number.isNaN(e10);
  };
  P4.null = function(e10) {
    return e10 === null;
  };
  P4.nullOrUndefined = function(e10) {
    return P4.null(e10) || P4.undefined(e10);
  };
  P4.number = function(e10) {
    return Ia("number")(e10) && !P4.nan(e10);
  };
  P4.numericString = function(e10) {
    return P4.string(e10) && e10.length > 0 && !Number.isNaN(Number(e10));
  };
  P4.object = function(e10) {
    return !P4.nullOrUndefined(e10) && (P4.function(e10) || typeof e10 == "object");
  };
  P4.oneOf = function(e10, t5) {
    return P4.array(e10) ? e10.indexOf(t5) > -1 : !1;
  };
  P4.plainFunction = Zt("Function");
  P4.plainObject = function(e10) {
    if (ji(e10) !== "Object") return !1;
    var t5 = Object.getPrototypeOf(e10);
    return t5 === null || t5 === Object.getPrototypeOf({});
  };
  P4.primitive = function(e10) {
    return P4.null(e10) || d6(typeof e10);
  };
  P4.promise = Zt("Promise");
  P4.propertyOf = function(e10, t5, r5) {
    if (!P4.object(e10) || !t5) return !1;
    var n10 = e10[t5];
    return P4.function(r5) ? r5(n10) : P4.defined(n10);
  };
  P4.regexp = Zt("RegExp");
  P4.set = Zt("Set");
  P4.string = Ia("string");
  P4.symbol = Ia("symbol");
  P4.undefined = Ia("undefined");
  P4.weakMap = Zt("WeakMap");
  P4.weakSet = Zt("WeakSet");
  var G = P4;
  function u6() {
    for (var e10 = [], t5 = 0; t5 < arguments.length; t5++) e10[t5] = arguments[t5];
    return e10.every(function(r5) {
      return G.string(r5) || G.array(r5) || G.plainObject(r5);
    });
  }
  function c6(e10, t5, r5) {
    return $u(e10, t5) ? [e10, t5].every(G.array) ? !e10.some(Uu(r5)) && t5.some(Uu(r5)) : [e10, t5].every(G.plainObject) ? !Object.entries(e10).some(ju(r5)) && Object.entries(t5).some(ju(r5)) : t5 === r5 : !1;
  }
  function P0(e10, t5, r5) {
    var n10 = r5.actual, a2 = r5.key, o10 = r5.previous, i10 = r5.type, l2 = jt(e10, a2), d3 = jt(t5, a2), u3 = [l2, d3].every(G.number) && (i10 === "increased" ? l2 < d3 : l2 > d3);
    return G.undefined(n10) || (u3 = u3 && d3 === n10), G.undefined(o10) || (u3 = u3 && l2 === o10), u3;
  }
  function O0(e10, t5, r5) {
    var n10 = r5.key, a2 = r5.type, o10 = r5.value, i10 = jt(e10, n10), l2 = jt(t5, n10), d3 = a2 === "added" ? i10 : l2, u3 = a2 === "added" ? l2 : i10;
    if (!G.nullOrUndefined(o10)) {
      if (G.defined(d3)) {
        if (G.array(d3) || G.plainObject(d3)) return c6(d3, u3, o10);
      } else return qe(u3, o10);
      return !1;
    }
    return [i10, l2].every(G.array) ? !u3.every(R0(d3)) : [i10, l2].every(G.plainObject) ? p6(Object.keys(d3), Object.keys(u3)) : ![i10, l2].every(function(c10) {
      return G.primitive(c10) && G.defined(c10);
    }) && (a2 === "added" ? !G.defined(i10) && G.defined(l2) : G.defined(i10) && !G.defined(l2));
  }
  function N0(e10, t5, r5) {
    var n10 = r5 === void 0 ? {} : r5, a2 = n10.key, o10 = jt(e10, a2), i10 = jt(t5, a2);
    if (!$u(o10, i10)) throw new TypeError("Inputs have different types");
    if (!u6(o10, i10)) throw new TypeError("Inputs don't have length");
    return [o10, i10].every(G.plainObject) && (o10 = Object.keys(o10), i10 = Object.keys(i10)), [o10, i10];
  }
  function ju(e10) {
    return function(t5) {
      var r5 = t5[0], n10 = t5[1];
      return G.array(e10) ? qe(e10, n10) || e10.some(function(a2) {
        return qe(a2, n10) || G.array(n10) && R0(n10)(a2);
      }) : G.plainObject(e10) && e10[r5] ? !!e10[r5] && qe(e10[r5], n10) : qe(e10, n10);
    };
  }
  function p6(e10, t5) {
    return t5.some(function(r5) {
      return !e10.includes(r5);
    });
  }
  function Uu(e10) {
    return function(t5) {
      return G.array(e10) ? e10.some(function(r5) {
        return qe(r5, t5) || G.array(t5) && R0(t5)(r5);
      }) : qe(e10, t5);
    };
  }
  function Ea(e10, t5) {
    return G.array(e10) ? e10.some(function(r5) {
      return qe(r5, t5);
    }) : qe(e10, t5);
  }
  function R0(e10) {
    return function(t5) {
      return e10.some(function(r5) {
        return qe(r5, t5);
      });
    };
  }
  function $u() {
    for (var e10 = [], t5 = 0; t5 < arguments.length; t5++) e10[t5] = arguments[t5];
    return e10.every(G.array) || e10.every(G.number) || e10.every(G.plainObject) || e10.every(G.string);
  }
  function jt(e10, t5) {
    if (G.plainObject(e10) || G.array(e10)) {
      if (G.string(t5)) {
        var r5 = t5.split(".");
        return r5.reduce(function(n10, a2) {
          return n10 && n10[a2];
        }, e10);
      }
      return G.number(t5) ? e10[t5] : e10;
    }
    return e10;
  }
  function H0(e10, t5) {
    if ([e10, t5].some(G.nullOrUndefined)) throw new Error("Missing required parameters");
    if (![e10, t5].every(function(p5) {
      return G.plainObject(p5) || G.array(p5);
    })) throw new Error("Expected plain objects or array");
    var r5 = function(p5, f4) {
      try {
        return O0(e10, t5, { key: p5, type: "added", value: f4 });
      } catch {
        return !1;
      }
    }, n10 = function(p5, f4, m8) {
      try {
        var h2 = jt(e10, p5), g3 = jt(t5, p5), w2 = G.defined(f4), y10 = G.defined(m8);
        if (w2 || y10) {
          var v5 = y10 ? Ea(m8, h2) : !Ea(f4, h2), C3 = Ea(f4, g3);
          return v5 && C3;
        }
        return [h2, g3].every(G.array) || [h2, g3].every(G.plainObject) ? !qe(h2, g3) : h2 !== g3;
      } catch {
        return !1;
      }
    }, a2 = function(p5, f4, m8) {
      if (!G.defined(p5)) return !1;
      try {
        var h2 = jt(e10, p5), g3 = jt(t5, p5), w2 = G.defined(m8);
        return Ea(f4, h2) && (w2 ? Ea(m8, g3) : !w2);
      } catch {
        return !1;
      }
    }, o10 = function(p5, f4) {
      return G.defined(p5) ? n10(p5, f4) : !1;
    }, i10 = function(p5, f4, m8) {
      if (!G.defined(p5)) return !1;
      try {
        return P0(e10, t5, { key: p5, actual: f4, previous: m8, type: "decreased" });
      } catch {
        return !1;
      }
    }, l2 = function(p5) {
      try {
        var f4 = N0(e10, t5, { key: p5 }), m8 = f4[0], h2 = f4[1];
        return !!m8.length && !h2.length;
      } catch {
        return !1;
      }
    }, d3 = function(p5) {
      try {
        var f4 = N0(e10, t5, { key: p5 }), m8 = f4[0], h2 = f4[1];
        return !m8.length && !!h2.length;
      } catch {
        return !1;
      }
    }, u3 = function(p5, f4, m8) {
      if (!G.defined(p5)) return !1;
      try {
        return P0(e10, t5, { key: p5, actual: f4, previous: m8, type: "increased" });
      } catch {
        return !1;
      }
    }, c10 = function(p5, f4) {
      try {
        return O0(e10, t5, { key: p5, type: "removed", value: f4 });
      } catch {
        return !1;
      }
    };
    return { added: r5, changed: n10, changedFrom: a2, changedTo: o10, decreased: i10, emptied: l2, filled: d3, increased: u3, removed: c10 };
  }
  function Wu(e10, t5) {
    var r5 = Object.keys(e10);
    if (Object.getOwnPropertySymbols) {
      var n10 = Object.getOwnPropertySymbols(e10);
      t5 && (n10 = n10.filter(function(a2) {
        return Object.getOwnPropertyDescriptor(e10, a2).enumerable;
      })), r5.push.apply(r5, n10);
    }
    return r5;
  }
  function Ee(e10) {
    for (var t5 = 1; t5 < arguments.length; t5++) {
      var r5 = arguments[t5] != null ? arguments[t5] : {};
      t5 % 2 ? Wu(Object(r5), !0).forEach(function(n10) {
        et(e10, n10, r5[n10]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e10, Object.getOwnPropertyDescriptors(r5)) : Wu(Object(r5)).forEach(function(n10) {
        Object.defineProperty(e10, n10, Object.getOwnPropertyDescriptor(r5, n10));
      });
    }
    return e10;
  }
  function co(e10, t5) {
    if (!(e10 instanceof t5)) throw new TypeError("Cannot call a class as a function");
  }
  function qu(e10, t5) {
    for (var r5 = 0; r5 < t5.length; r5++) {
      var n10 = t5[r5];
      n10.enumerable = n10.enumerable || !1, n10.configurable = !0, "value" in n10 && (n10.writable = !0), Object.defineProperty(e10, Ju(n10.key), n10);
    }
  }
  function po(e10, t5, r5) {
    return t5 && qu(e10.prototype, t5), r5 && qu(e10, r5), Object.defineProperty(e10, "prototype", { writable: !1 }), e10;
  }
  function et(e10, t5, r5) {
    return t5 = Ju(t5), t5 in e10 ? Object.defineProperty(e10, t5, { value: r5, enumerable: !0, configurable: !0, writable: !0 }) : e10[t5] = r5, e10;
  }
  function fo(e10, t5) {
    if (typeof t5 != "function" && t5 !== null) throw new TypeError("Super expression must either be null or a function");
    e10.prototype = Object.create(t5 && t5.prototype, { constructor: { value: e10, writable: !0, configurable: !0 } }), Object.defineProperty(e10, "prototype", { writable: !1 }), t5 && V0(e10, t5);
  }
  function qi(e10) {
    return qi = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(r5) {
      return r5.__proto__ || Object.getPrototypeOf(r5);
    }, qi(e10);
  }
  function V0(e10, t5) {
    return V0 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n10, a2) {
      return n10.__proto__ = a2, n10;
    }, V0(e10, t5);
  }
  function f6() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function m6(e10, t5) {
    if (e10 == null) return {};
    var r5 = {}, n10 = Object.keys(e10), a2, o10;
    for (o10 = 0; o10 < n10.length; o10++) a2 = n10[o10], !(t5.indexOf(a2) >= 0) && (r5[a2] = e10[a2]);
    return r5;
  }
  function Yu(e10, t5) {
    if (e10 == null) return {};
    var r5 = m6(e10, t5), n10, a2;
    if (Object.getOwnPropertySymbols) {
      var o10 = Object.getOwnPropertySymbols(e10);
      for (a2 = 0; a2 < o10.length; a2++) n10 = o10[a2], !(t5.indexOf(n10) >= 0) && Object.prototype.propertyIsEnumerable.call(e10, n10) && (r5[n10] = e10[n10]);
    }
    return r5;
  }
  function br(e10) {
    if (e10 === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e10;
  }
  function h6(e10, t5) {
    if (t5 && (typeof t5 == "object" || typeof t5 == "function")) return t5;
    if (t5 !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
    return br(e10);
  }
  function mo(e10) {
    var t5 = f6();
    return function() {
      var n10 = qi(e10), a2;
      if (t5) {
        var o10 = qi(this).constructor;
        a2 = Reflect.construct(n10, arguments, o10);
      } else a2 = n10.apply(this, arguments);
      return h6(this, a2);
    };
  }
  function g6(e10, t5) {
    if (typeof e10 != "object" || e10 === null) return e10;
    var r5 = e10[Symbol.toPrimitive];
    if (r5 !== void 0) {
      var n10 = r5.call(e10, t5 || "default");
      if (typeof n10 != "object") return n10;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t5 === "string" ? String : Number)(e10);
  }
  function Ju(e10) {
    var t5 = g6(e10, "string");
    return typeof t5 == "symbol" ? t5 : String(t5);
  }
  var v6 = { flip: { padding: 20 }, preventOverflow: { padding: 10 } }, y6 = "The typeValidator argument must be a function with the signature function(props, propName, componentName).", w6 = "The error message is optional, but must be a string if provided.";
  function b6(e10, t5, r5, n10) {
    return typeof e10 == "boolean" ? e10 : typeof e10 == "function" ? e10(t5, r5, n10) : e10 ? !!e10 : !1;
  }
  function S6(e10, t5) {
    return Object.hasOwnProperty.call(e10, t5);
  }
  function x6(e10, t5, r5, n10) {
    return n10 ? new Error(n10) : new Error("Required ".concat(e10[t5], " `").concat(t5, "` was not specified in `").concat(r5, "`."));
  }
  function C6(e10, t5) {
    if (typeof e10 != "function") throw new TypeError(y6);
    if (t5 && typeof t5 != "string") throw new TypeError(w6);
  }
  function Gu(e10, t5, r5) {
    return C6(e10, r5), function(n10, a2, o10) {
      for (var i10 = arguments.length, l2 = new Array(i10 > 3 ? i10 - 3 : 0), d3 = 3; d3 < i10; d3++) l2[d3 - 3] = arguments[d3];
      return b6(t5, n10, a2, o10) ? S6(n10, a2) ? e10.apply(void 0, [n10, a2, o10].concat(l2)) : x6(n10, a2, o10, r5) : e10.apply(void 0, [n10, a2, o10].concat(l2));
    };
  }
  var pe = { INIT: "init", IDLE: "idle", OPENING: "opening", OPEN: "open", CLOSING: "closing", ERROR: "error" }, uo = react_dom_default.createPortal !== void 0;
  function dr() {
    return !!(typeof window < "u" && window.document && window.document.createElement);
  }
  function D0() {
    return "ontouchstart" in window && /Mobi/.test(navigator.userAgent);
  }
  function Ui(e10) {
    var t5 = e10.title, r5 = e10.data, n10 = e10.warn, a2 = n10 === void 0 ? !1 : n10, o10 = e10.debug, i10 = o10 === void 0 ? !1 : o10, l2 = a2 ? console.warn || console.error : console.log;
    i10 && t5 && r5 && (console.groupCollapsed("%creact-floater: ".concat(t5), "color: #9b00ff; font-weight: bold; font-size: 12px;"), Array.isArray(r5) ? r5.forEach(function(d3) {
      wt.plainObject(d3) && d3.key ? l2.apply(console, [d3.key, d3.value]) : l2.apply(console, [d3]);
    }) : l2.apply(console, [r5]), console.groupEnd());
  }
  function k6(e10, t5, r5) {
    var n10 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
    e10.addEventListener(t5, r5, n10);
  }
  function I6(e10, t5, r5) {
    var n10 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
    e10.removeEventListener(t5, r5, n10);
  }
  function E6(e10, t5, r5) {
    var n10 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1, a2;
    a2 = function(i10) {
      r5(i10), I6(e10, t5, a2);
    }, k6(e10, t5, a2, n10);
  }
  function Qu() {
  }
  var Ku = (function(e10) {
    fo(r5, e10);
    var t5 = mo(r5);
    function r5() {
      return co(this, r5), t5.apply(this, arguments);
    }
    return po(r5, [{ key: "componentDidMount", value: function() {
      dr() && (this.node || this.appendNode(), uo || this.renderPortal());
    } }, { key: "componentDidUpdate", value: function() {
      dr() && (uo || this.renderPortal());
    } }, { key: "componentWillUnmount", value: function() {
      !dr() || !this.node || (uo || react_dom_default.unmountComponentAtNode(this.node), this.node && this.node.parentNode === document.body && (document.body.removeChild(this.node), this.node = void 0));
    } }, { key: "appendNode", value: function() {
      var a2 = this.props, o10 = a2.id, i10 = a2.zIndex;
      this.node || (this.node = document.createElement("div"), o10 && (this.node.id = o10), i10 && (this.node.style.zIndex = i10), document.body.appendChild(this.node));
    } }, { key: "renderPortal", value: function() {
      if (!dr()) return null;
      var a2 = this.props, o10 = a2.children, i10 = a2.setRef;
      if (this.node || this.appendNode(), uo) return react_dom_default.createPortal(o10, this.node);
      var l2 = react_dom_default.unstable_renderSubtreeIntoContainer(this, o10.length > 1 ? react_default.createElement("div", null, o10) : o10[0], this.node);
      return i10(l2), null;
    } }, { key: "renderReact16", value: function() {
      var a2 = this.props, o10 = a2.hasChildren, i10 = a2.placement, l2 = a2.target;
      return o10 ? this.renderPortal() : l2 || i10 === "center" ? this.renderPortal() : null;
    } }, { key: "render", value: function() {
      return uo ? this.renderReact16() : null;
    } }]), r5;
  })(react_default.Component);
  et(Ku, "propTypes", { children: T2.default.oneOfType([T2.default.element, T2.default.array]), hasChildren: T2.default.bool, id: T2.default.oneOfType([T2.default.string, T2.default.number]), placement: T2.default.string, setRef: T2.default.func.isRequired, target: T2.default.oneOfType([T2.default.object, T2.default.string]), zIndex: T2.default.number });
  var Xu = (function(e10) {
    fo(r5, e10);
    var t5 = mo(r5);
    function r5() {
      return co(this, r5), t5.apply(this, arguments);
    }
    return po(r5, [{ key: "parentStyle", get: function() {
      var a2 = this.props, o10 = a2.placement, i10 = a2.styles, l2 = i10.arrow.length, d3 = { pointerEvents: "none", position: "absolute", width: "100%" };
      return o10.startsWith("top") ? (d3.bottom = 0, d3.left = 0, d3.right = 0, d3.height = l2) : o10.startsWith("bottom") ? (d3.left = 0, d3.right = 0, d3.top = 0, d3.height = l2) : o10.startsWith("left") ? (d3.right = 0, d3.top = 0, d3.bottom = 0) : o10.startsWith("right") && (d3.left = 0, d3.top = 0), d3;
    } }, { key: "render", value: function() {
      var a2 = this.props, o10 = a2.placement, i10 = a2.setArrowRef, l2 = a2.styles, d3 = l2.arrow, u3 = d3.color, c10 = d3.display, p5 = d3.length, f4 = d3.margin, m8 = d3.position, h2 = d3.spread, g3 = { display: c10, position: m8 }, w2, y10 = h2, v5 = p5;
      return o10.startsWith("top") ? (w2 = "0,0 ".concat(y10 / 2, ",").concat(v5, " ").concat(y10, ",0"), g3.bottom = 0, g3.marginLeft = f4, g3.marginRight = f4) : o10.startsWith("bottom") ? (w2 = "".concat(y10, ",").concat(v5, " ").concat(y10 / 2, ",0 0,").concat(v5), g3.top = 0, g3.marginLeft = f4, g3.marginRight = f4) : o10.startsWith("left") ? (v5 = h2, y10 = p5, w2 = "0,0 ".concat(y10, ",").concat(v5 / 2, " 0,").concat(v5), g3.right = 0, g3.marginTop = f4, g3.marginBottom = f4) : o10.startsWith("right") && (v5 = h2, y10 = p5, w2 = "".concat(y10, ",").concat(v5, " ").concat(y10, ",0 0,").concat(v5 / 2), g3.left = 0, g3.marginTop = f4, g3.marginBottom = f4), react_default.createElement("div", { className: "__floater__arrow", style: this.parentStyle }, react_default.createElement("span", { ref: i10, style: g3 }, react_default.createElement("svg", { width: y10, height: v5, version: "1.1", xmlns: "http://www.w3.org/2000/svg" }, react_default.createElement("polygon", { points: w2, fill: u3 }))));
    } }]), r5;
  })(react_default.Component);
  et(Xu, "propTypes", { placement: T2.default.string.isRequired, setArrowRef: T2.default.func.isRequired, styles: T2.default.object.isRequired });
  var T6 = ["color", "height", "width"];
  function ec(e10) {
    var t5 = e10.handleClick, r5 = e10.styles, n10 = r5.color, a2 = r5.height, o10 = r5.width, i10 = Yu(r5, T6);
    return react_default.createElement("button", { "aria-label": "close", onClick: t5, style: i10, type: "button" }, react_default.createElement("svg", { width: "".concat(o10, "px"), height: "".concat(a2, "px"), viewBox: "0 0 18 18", version: "1.1", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid" }, react_default.createElement("g", null, react_default.createElement("path", { d: "M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z", fill: n10 }))));
  }
  ec.propTypes = { handleClick: T2.default.func.isRequired, styles: T2.default.object.isRequired };
  function tc(e10) {
    var t5 = e10.content, r5 = e10.footer, n10 = e10.handleClick, a2 = e10.open, o10 = e10.positionWrapper, i10 = e10.showCloseButton, l2 = e10.title, d3 = e10.styles, u3 = { content: react_default.isValidElement(t5) ? t5 : react_default.createElement("div", { className: "__floater__content", style: d3.content }, t5) };
    return l2 && (u3.title = react_default.isValidElement(l2) ? l2 : react_default.createElement("div", { className: "__floater__title", style: d3.title }, l2)), r5 && (u3.footer = react_default.isValidElement(r5) ? r5 : react_default.createElement("div", { className: "__floater__footer", style: d3.footer }, r5)), (i10 || o10) && !wt.boolean(a2) && (u3.close = react_default.createElement(ec, { styles: d3.close, handleClick: n10 })), react_default.createElement("div", { className: "__floater__container", style: d3.container }, u3.close, u3.title, u3.content, u3.footer);
  }
  tc.propTypes = { content: T2.default.node.isRequired, footer: T2.default.node, handleClick: T2.default.func.isRequired, open: T2.default.bool, positionWrapper: T2.default.bool.isRequired, showCloseButton: T2.default.bool.isRequired, styles: T2.default.object.isRequired, title: T2.default.node };
  var rc = (function(e10) {
    fo(r5, e10);
    var t5 = mo(r5);
    function r5() {
      return co(this, r5), t5.apply(this, arguments);
    }
    return po(r5, [{ key: "style", get: function() {
      var a2 = this.props, o10 = a2.disableAnimation, i10 = a2.component, l2 = a2.placement, d3 = a2.hideArrow, u3 = a2.status, c10 = a2.styles, p5 = c10.arrow.length, f4 = c10.floater, m8 = c10.floaterCentered, h2 = c10.floaterClosing, g3 = c10.floaterOpening, w2 = c10.floaterWithAnimation, y10 = c10.floaterWithComponent, v5 = {};
      return d3 || (l2.startsWith("top") ? v5.padding = "0 0 ".concat(p5, "px") : l2.startsWith("bottom") ? v5.padding = "".concat(p5, "px 0 0") : l2.startsWith("left") ? v5.padding = "0 ".concat(p5, "px 0 0") : l2.startsWith("right") && (v5.padding = "0 0 0 ".concat(p5, "px"))), [pe.OPENING, pe.OPEN].indexOf(u3) !== -1 && (v5 = Ee(Ee({}, v5), g3)), u3 === pe.CLOSING && (v5 = Ee(Ee({}, v5), h2)), u3 === pe.OPEN && !o10 && (v5 = Ee(Ee({}, v5), w2)), l2 === "center" && (v5 = Ee(Ee({}, v5), m8)), i10 && (v5 = Ee(Ee({}, v5), y10)), Ee(Ee({}, f4), v5);
    } }, { key: "render", value: function() {
      var a2 = this.props, o10 = a2.component, i10 = a2.handleClick, l2 = a2.hideArrow, d3 = a2.setFloaterRef, u3 = a2.status, c10 = {}, p5 = ["__floater"];
      return o10 ? react_default.isValidElement(o10) ? c10.content = react_default.cloneElement(o10, { closeFn: i10 }) : c10.content = o10({ closeFn: i10 }) : c10.content = react_default.createElement(tc, this.props), u3 === pe.OPEN && p5.push("__floater__open"), l2 || (c10.arrow = react_default.createElement(Xu, this.props)), react_default.createElement("div", { ref: d3, className: p5.join(" "), style: this.style }, react_default.createElement("div", { className: "__floater__body" }, c10.content, c10.arrow));
    } }]), r5;
  })(react_default.Component);
  et(rc, "propTypes", { component: T2.default.oneOfType([T2.default.func, T2.default.element]), content: T2.default.node, disableAnimation: T2.default.bool.isRequired, footer: T2.default.node, handleClick: T2.default.func.isRequired, hideArrow: T2.default.bool.isRequired, open: T2.default.bool, placement: T2.default.string.isRequired, positionWrapper: T2.default.bool.isRequired, setArrowRef: T2.default.func.isRequired, setFloaterRef: T2.default.func.isRequired, showCloseButton: T2.default.bool, status: T2.default.string.isRequired, styles: T2.default.object.isRequired, title: T2.default.node });
  var nc = (function(e10) {
    fo(r5, e10);
    var t5 = mo(r5);
    function r5() {
      return co(this, r5), t5.apply(this, arguments);
    }
    return po(r5, [{ key: "render", value: function() {
      var a2 = this.props, o10 = a2.children, i10 = a2.handleClick, l2 = a2.handleMouseEnter, d3 = a2.handleMouseLeave, u3 = a2.setChildRef, c10 = a2.setWrapperRef, p5 = a2.style, f4 = a2.styles, m8;
      if (o10) if (react_default.Children.count(o10) === 1) if (!react_default.isValidElement(o10)) m8 = react_default.createElement("span", null, o10);
      else {
        var h2 = wt.function(o10.type) ? "innerRef" : "ref";
        m8 = react_default.cloneElement(react_default.Children.only(o10), et({}, h2, u3));
      }
      else m8 = o10;
      return m8 ? react_default.createElement("span", { ref: c10, style: Ee(Ee({}, f4), p5), onClick: i10, onMouseEnter: l2, onMouseLeave: d3 }, m8) : null;
    } }]), r5;
  })(react_default.Component);
  et(nc, "propTypes", { children: T2.default.node, handleClick: T2.default.func.isRequired, handleMouseEnter: T2.default.func.isRequired, handleMouseLeave: T2.default.func.isRequired, setChildRef: T2.default.func.isRequired, setWrapperRef: T2.default.func.isRequired, style: T2.default.object, styles: T2.default.object.isRequired });
  var M6 = { zIndex: 100 };
  function L6(e10) {
    var t5 = (0, Wi.default)(M6, e10.options || {});
    return { wrapper: { cursor: "help", display: "inline-flex", flexDirection: "column", zIndex: t5.zIndex }, wrapperPosition: { left: -1e3, position: "absolute", top: -1e3, visibility: "hidden" }, floater: { display: "inline-block", filter: "drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))", maxWidth: 300, opacity: 0, position: "relative", transition: "opacity 0.3s", visibility: "hidden", zIndex: t5.zIndex }, floaterOpening: { opacity: 1, visibility: "visible" }, floaterWithAnimation: { opacity: 1, transition: "opacity 0.3s, transform 0.2s", visibility: "visible" }, floaterWithComponent: { maxWidth: "100%" }, floaterClosing: { opacity: 0, visibility: "visible" }, floaterCentered: { left: "50%", position: "fixed", top: "50%", transform: "translate(-50%, -50%)" }, container: { backgroundColor: "#fff", color: "#666", minHeight: 60, minWidth: 200, padding: 20, position: "relative", zIndex: 10 }, title: { borderBottom: "1px solid #555", color: "#555", fontSize: 18, marginBottom: 5, paddingBottom: 6, paddingRight: 18 }, content: { fontSize: 15 }, close: { backgroundColor: "transparent", border: 0, borderRadius: 0, color: "#555", fontSize: 0, height: 15, outline: "none", padding: 10, position: "absolute", right: 0, top: 0, width: 15, WebkitAppearance: "none" }, footer: { borderTop: "1px solid #ccc", fontSize: 13, marginTop: 10, paddingTop: 5 }, arrow: { color: "#fff", display: "inline-flex", length: 16, margin: 8, position: "absolute", spread: 32 }, options: t5 };
  }
  var A6 = ["arrow", "flip", "offset"], B6 = ["position", "top", "right", "bottom", "left"], Gi = (function(e10) {
    fo(r5, e10);
    var t5 = mo(r5);
    function r5(n10) {
      var a2;
      return co(this, r5), a2 = t5.call(this, n10), et(br(a2), "setArrowRef", function(o10) {
        a2.arrowRef = o10;
      }), et(br(a2), "setChildRef", function(o10) {
        a2.childRef = o10;
      }), et(br(a2), "setFloaterRef", function(o10) {
        a2.floaterRef = o10;
      }), et(br(a2), "setWrapperRef", function(o10) {
        a2.wrapperRef = o10;
      }), et(br(a2), "handleTransitionEnd", function() {
        var o10 = a2.state.status, i10 = a2.props.callback;
        a2.wrapperPopper && a2.wrapperPopper.instance.update(), a2.setState({ status: o10 === pe.OPENING ? pe.OPEN : pe.IDLE }, function() {
          var l2 = a2.state.status;
          i10(l2 === pe.OPEN ? "open" : "close", a2.props);
        });
      }), et(br(a2), "handleClick", function() {
        var o10 = a2.props, i10 = o10.event, l2 = o10.open;
        if (!wt.boolean(l2)) {
          var d3 = a2.state, u3 = d3.positionWrapper, c10 = d3.status;
          (a2.event === "click" || a2.event === "hover" && u3) && (Ui({ title: "click", data: [{ event: i10, status: c10 === pe.OPEN ? "closing" : "opening" }], debug: a2.debug }), a2.toggle());
        }
      }), et(br(a2), "handleMouseEnter", function() {
        var o10 = a2.props, i10 = o10.event, l2 = o10.open;
        if (!(wt.boolean(l2) || D0())) {
          var d3 = a2.state.status;
          a2.event === "hover" && d3 === pe.IDLE && (Ui({ title: "mouseEnter", data: [{ key: "originalEvent", value: i10 }], debug: a2.debug }), clearTimeout(a2.eventDelayTimeout), a2.toggle());
        }
      }), et(br(a2), "handleMouseLeave", function() {
        var o10 = a2.props, i10 = o10.event, l2 = o10.eventDelay, d3 = o10.open;
        if (!(wt.boolean(d3) || D0())) {
          var u3 = a2.state, c10 = u3.status, p5 = u3.positionWrapper;
          a2.event === "hover" && (Ui({ title: "mouseLeave", data: [{ key: "originalEvent", value: i10 }], debug: a2.debug }), l2 ? [pe.OPENING, pe.OPEN].indexOf(c10) !== -1 && !p5 && !a2.eventDelayTimeout && (a2.eventDelayTimeout = setTimeout(function() {
            delete a2.eventDelayTimeout, a2.toggle();
          }, l2 * 1e3)) : a2.toggle(pe.IDLE));
        }
      }), a2.state = { currentPlacement: n10.placement, needsUpdate: !1, positionWrapper: n10.wrapperOptions.position && !!n10.target, status: pe.INIT, statusWrapper: pe.INIT }, a2._isMounted = !1, a2.hasMounted = !1, dr() && window.addEventListener("load", function() {
        a2.popper && a2.popper.instance.update(), a2.wrapperPopper && a2.wrapperPopper.instance.update();
      }), a2;
    }
    return po(r5, [{ key: "componentDidMount", value: function() {
      if (dr()) {
        var a2 = this.state.positionWrapper, o10 = this.props, i10 = o10.children, l2 = o10.open, d3 = o10.target;
        this._isMounted = !0, Ui({ title: "init", data: { hasChildren: !!i10, hasTarget: !!d3, isControlled: wt.boolean(l2), positionWrapper: a2, target: this.target, floater: this.floaterRef }, debug: this.debug }), this.hasMounted || (this.initPopper(), this.hasMounted = !0), !i10 && d3 && wt.boolean(l2);
      }
    } }, { key: "componentDidUpdate", value: function(a2, o10) {
      if (dr()) {
        var i10 = this.props, l2 = i10.autoOpen, d3 = i10.open, u3 = i10.target, c10 = i10.wrapperOptions, p5 = H0(o10, this.state), f4 = p5.changedFrom, m8 = p5.changed;
        if (a2.open !== d3) {
          var h2;
          wt.boolean(d3) && (h2 = d3 ? pe.OPENING : pe.CLOSING), this.toggle(h2);
        }
        (a2.wrapperOptions.position !== c10.position || a2.target !== u3) && this.changeWrapperPosition(this.props), m8("status", pe.IDLE) && d3 ? this.toggle(pe.OPEN) : f4("status", pe.INIT, pe.IDLE) && l2 && this.toggle(pe.OPEN), this.popper && m8("status", pe.OPENING) && this.popper.instance.update(), this.floaterRef && (m8("status", pe.OPENING) || m8("status", pe.CLOSING)) && E6(this.floaterRef, "transitionend", this.handleTransitionEnd), m8("needsUpdate", !0) && this.rebuildPopper();
      }
    } }, { key: "componentWillUnmount", value: function() {
      dr() && (this._isMounted = !1, this.popper && this.popper.instance.destroy(), this.wrapperPopper && this.wrapperPopper.instance.destroy());
    } }, { key: "initPopper", value: function() {
      var a2 = this, o10 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.target, i10 = this.state.positionWrapper, l2 = this.props, d3 = l2.disableFlip, u3 = l2.getPopper, c10 = l2.hideArrow, p5 = l2.offset, f4 = l2.placement, m8 = l2.wrapperOptions, h2 = f4 === "top" || f4 === "bottom" ? "flip" : ["right", "bottom-end", "top-end", "left", "top-start", "bottom-start"];
      if (f4 === "center") this.setState({ status: pe.IDLE });
      else if (o10 && this.floaterRef) {
        var g3 = this.options, w2 = g3.arrow, y10 = g3.flip, v5 = g3.offset, C3 = Yu(g3, A6);
        new A0(o10, this.floaterRef, { placement: f4, modifiers: Ee({ arrow: Ee({ enabled: !c10, element: this.arrowRef }, w2), flip: Ee({ enabled: !d3, behavior: h2 }, y10), offset: Ee({ offset: "0, ".concat(p5, "px") }, v5) }, C3), onCreate: function(x2) {
          var D;
          if (a2.popper = x2, !((D = a2.floaterRef) !== null && D !== void 0 && D.isConnected)) {
            a2.setState({ needsUpdate: !0 });
            return;
          }
          u3(x2, "floater"), a2._isMounted && a2.setState({ currentPlacement: x2.placement, status: pe.IDLE }), f4 !== x2.placement && setTimeout(function() {
            x2.instance.update();
          }, 1);
        }, onUpdate: function(x2) {
          a2.popper = x2;
          var D = a2.state.currentPlacement;
          a2._isMounted && x2.placement !== D && a2.setState({ currentPlacement: x2.placement });
        } });
      }
      if (i10) {
        var b8 = wt.undefined(m8.offset) ? 0 : m8.offset;
        new A0(this.target, this.wrapperRef, { placement: m8.placement || f4, modifiers: { arrow: { enabled: !1 }, offset: { offset: "0, ".concat(b8, "px") }, flip: { enabled: !1 } }, onCreate: function(x2) {
          a2.wrapperPopper = x2, a2._isMounted && a2.setState({ statusWrapper: pe.IDLE }), u3(x2, "wrapper"), f4 !== x2.placement && setTimeout(function() {
            x2.instance.update();
          }, 1);
        } });
      }
    } }, { key: "rebuildPopper", value: function() {
      var a2 = this;
      this.floaterRefInterval = setInterval(function() {
        var o10;
        (o10 = a2.floaterRef) !== null && o10 !== void 0 && o10.isConnected && (clearInterval(a2.floaterRefInterval), a2.setState({ needsUpdate: !1 }), a2.initPopper());
      }, 50);
    } }, { key: "changeWrapperPosition", value: function(a2) {
      var o10 = a2.target, i10 = a2.wrapperOptions;
      this.setState({ positionWrapper: i10.position && !!o10 });
    } }, { key: "toggle", value: function(a2) {
      var o10 = this.state.status, i10 = o10 === pe.OPEN ? pe.CLOSING : pe.OPENING;
      wt.undefined(a2) || (i10 = a2), this.setState({ status: i10 });
    } }, { key: "debug", get: function() {
      var a2 = this.props.debug;
      return a2 || dr() && "ReactFloaterDebug" in window && !!window.ReactFloaterDebug;
    } }, { key: "event", get: function() {
      var a2 = this.props, o10 = a2.disableHoverToClick, i10 = a2.event;
      return i10 === "hover" && D0() && !o10 ? "click" : i10;
    } }, { key: "options", get: function() {
      var a2 = this.props.options;
      return (0, Wi.default)(v6, a2 || {});
    } }, { key: "styles", get: function() {
      var a2 = this, o10 = this.state, i10 = o10.status, l2 = o10.positionWrapper, d3 = o10.statusWrapper, u3 = this.props.styles, c10 = (0, Wi.default)(L6(u3), u3);
      if (l2) {
        var p5;
        [pe.IDLE].indexOf(i10) === -1 || [pe.IDLE].indexOf(d3) === -1 ? p5 = c10.wrapperPosition : p5 = this.wrapperPopper.styles, c10.wrapper = Ee(Ee({}, c10.wrapper), p5);
      }
      if (this.target) {
        var f4 = window.getComputedStyle(this.target);
        this.wrapperStyles ? c10.wrapper = Ee(Ee({}, c10.wrapper), this.wrapperStyles) : ["relative", "static"].indexOf(f4.position) === -1 && (this.wrapperStyles = {}, l2 || (B6.forEach(function(m8) {
          a2.wrapperStyles[m8] = f4[m8];
        }), c10.wrapper = Ee(Ee({}, c10.wrapper), this.wrapperStyles), this.target.style.position = "relative", this.target.style.top = "auto", this.target.style.right = "auto", this.target.style.bottom = "auto", this.target.style.left = "auto"));
      }
      return c10;
    } }, { key: "target", get: function() {
      if (!dr()) return null;
      var a2 = this.props.target;
      return a2 ? wt.domElement(a2) ? a2 : document.querySelector(a2) : this.childRef || this.wrapperRef;
    } }, { key: "render", value: function() {
      var a2 = this.state, o10 = a2.currentPlacement, i10 = a2.positionWrapper, l2 = a2.status, d3 = this.props, u3 = d3.children, c10 = d3.component, p5 = d3.content, f4 = d3.disableAnimation, m8 = d3.footer, h2 = d3.hideArrow, g3 = d3.id, w2 = d3.open, y10 = d3.showCloseButton, v5 = d3.style, C3 = d3.target, b8 = d3.title, I = react_default.createElement(nc, { handleClick: this.handleClick, handleMouseEnter: this.handleMouseEnter, handleMouseLeave: this.handleMouseLeave, setChildRef: this.setChildRef, setWrapperRef: this.setWrapperRef, style: v5, styles: this.styles.wrapper }, u3), x2 = {};
      return i10 ? x2.wrapperInPortal = I : x2.wrapperAsChildren = I, react_default.createElement("span", null, react_default.createElement(Ku, { hasChildren: !!u3, id: g3, placement: o10, setRef: this.setFloaterRef, target: C3, zIndex: this.styles.options.zIndex }, react_default.createElement(rc, { component: c10, content: p5, disableAnimation: f4, footer: m8, handleClick: this.handleClick, hideArrow: h2 || o10 === "center", open: w2, placement: o10, positionWrapper: i10, setArrowRef: this.setArrowRef, setFloaterRef: this.setFloaterRef, showCloseButton: y10, status: l2, styles: this.styles, title: b8 }), x2.wrapperInPortal), x2.wrapperAsChildren);
    } }]), r5;
  })(react_default.Component);
  et(Gi, "propTypes", { autoOpen: T2.default.bool, callback: T2.default.func, children: T2.default.node, component: Gu(T2.default.oneOfType([T2.default.func, T2.default.element]), function(e10) {
    return !e10.content;
  }), content: Gu(T2.default.node, function(e10) {
    return !e10.component;
  }), debug: T2.default.bool, disableAnimation: T2.default.bool, disableFlip: T2.default.bool, disableHoverToClick: T2.default.bool, event: T2.default.oneOf(["hover", "click"]), eventDelay: T2.default.number, footer: T2.default.node, getPopper: T2.default.func, hideArrow: T2.default.bool, id: T2.default.oneOfType([T2.default.string, T2.default.number]), offset: T2.default.number, open: T2.default.bool, options: T2.default.object, placement: T2.default.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end", "auto", "center"]), showCloseButton: T2.default.bool, style: T2.default.object, styles: T2.default.object, target: T2.default.oneOfType([T2.default.object, T2.default.string]), title: T2.default.node, wrapperOptions: T2.default.shape({ offset: T2.default.number, placement: T2.default.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end", "auto"]), position: T2.default.bool }) });
  et(Gi, "defaultProps", { autoOpen: !1, callback: Qu, debug: !1, disableAnimation: !1, disableFlip: !1, disableHoverToClick: !1, event: "click", eventDelay: 0.4, getPopper: Qu, hideArrow: !1, offset: 15, placement: "bottom", showCloseButton: !1, styles: {}, target: null, wrapperOptions: { position: !1 } });
  var _6 = Object.defineProperty, F6 = (e10, t5, r5) => t5 in e10 ? _6(e10, t5, { enumerable: !0, configurable: !0, writable: !0, value: r5 }) : e10[t5] = r5, N2 = (e10, t5, r5) => F6(e10, typeof t5 != "symbol" ? t5 + "" : t5, r5), he = { INIT: "init", START: "start", STOP: "stop", RESET: "reset", PREV: "prev", NEXT: "next", GO: "go", CLOSE: "close", SKIP: "skip", UPDATE: "update" }, $t = { TOUR_START: "tour:start", STEP_BEFORE: "step:before", BEACON: "beacon", TOOLTIP: "tooltip", STEP_AFTER: "step:after", TOUR_END: "tour:end", TOUR_STATUS: "tour:status", TARGET_NOT_FOUND: "error:target_not_found", ERROR: "error" }, X = { INIT: "init", READY: "ready", BEACON: "beacon", TOOLTIP: "tooltip", COMPLETE: "complete", ERROR: "error" }, de = { IDLE: "idle", READY: "ready", WAITING: "waiting", RUNNING: "running", PAUSED: "paused", SKIPPED: "skipped", FINISHED: "finished", ERROR: "error" };
  function $r() {
    var e10;
    return !!(typeof window < "u" && (e10 = window.document) != null && e10.createElement);
  }
  function cc(e10) {
    return e10 ? e10.getBoundingClientRect() : null;
  }
  function P6(e10 = !1) {
    let { body: t5, documentElement: r5 } = document;
    if (!t5 || !r5) return 0;
    if (e10) {
      let n10 = [t5.scrollHeight, t5.offsetHeight, r5.clientHeight, r5.scrollHeight, r5.offsetHeight].sort((o10, i10) => o10 - i10), a2 = Math.floor(n10.length / 2);
      return n10.length % 2 === 0 ? (n10[a2 - 1] + n10[a2]) / 2 : n10[a2];
    }
    return Math.max(t5.scrollHeight, t5.offsetHeight, r5.clientHeight, r5.scrollHeight, r5.offsetHeight);
  }
  function Sr(e10) {
    if (typeof e10 == "string") try {
      return document.querySelector(e10);
    } catch {
      return null;
    }
    return e10;
  }
  function O6(e10) {
    return !e10 || e10.nodeType !== 1 ? null : getComputedStyle(e10);
  }
  function wo(e10, t5, r5) {
    if (!e10) return In();
    let n10 = (0, j0.default)(e10);
    if (n10) {
      if (n10.isSameNode(In())) return r5 ? document : In();
      if (!(n10.scrollHeight > n10.offsetHeight) && !t5) return n10.style.overflow = "initial", In();
    }
    return n10;
  }
  function Ji(e10, t5) {
    if (!e10) return !1;
    let r5 = wo(e10, t5);
    return r5 ? !r5.isSameNode(In()) : !1;
  }
  function N6(e10) {
    return e10.offsetParent !== document.body;
  }
  function La(e10, t5 = "fixed") {
    if (!e10 || !(e10 instanceof HTMLElement)) return !1;
    let { nodeName: r5 } = e10, n10 = O6(e10);
    return r5 === "BODY" || r5 === "HTML" ? !1 : n10 && n10.position === t5 ? !0 : e10.parentNode ? La(e10.parentNode, t5) : !1;
  }
  function R6(e10) {
    var t5;
    if (!e10) return !1;
    let r5 = e10;
    for (; r5 && r5 !== document.body; ) {
      if (r5 instanceof HTMLElement) {
        let { display: n10, visibility: a2 } = getComputedStyle(r5);
        if (n10 === "none" || a2 === "hidden") return !1;
      }
      r5 = (t5 = r5.parentElement) != null ? t5 : null;
    }
    return !0;
  }
  function H62(e10, t5, r5) {
    var n10, a2, o10;
    let i10 = cc(e10), l2 = wo(e10, r5), d3 = Ji(e10, r5), u3 = La(e10), c10 = 0, p5 = (n10 = i10?.top) != null ? n10 : 0;
    if (d3 && u3) {
      let f4 = (a2 = e10?.offsetTop) != null ? a2 : 0, m8 = (o10 = l2?.scrollTop) != null ? o10 : 0;
      p5 = f4 - m8;
    } else l2 instanceof HTMLElement && (c10 = l2.scrollTop, !d3 && !La(e10) && (p5 += c10), l2.isSameNode(In()) || (p5 += In().scrollTop));
    return Math.floor(p5 - t5);
  }
  function D6(e10, t5, r5) {
    var n10;
    if (!e10) return 0;
    let { offsetTop: a2 = 0, scrollTop: o10 = 0 } = (n10 = (0, j0.default)(e10)) != null ? n10 : {}, i10 = e10.getBoundingClientRect().top + o10;
    a2 && (Ji(e10, r5) || N6(e10)) && (i10 -= a2);
    let l2 = Math.floor(i10 - t5);
    return l2 < 0 ? 0 : l2;
  }
  function In() {
    var e10;
    return (e10 = document.scrollingElement) != null ? e10 : document.documentElement;
  }
  function V6(e10, t5) {
    let { duration: r5, element: n10 } = t5;
    return new Promise((a2, o10) => {
      let { scrollTop: i10 } = n10, l2 = e10 > i10 ? e10 - i10 : i10 - e10;
      uc.default.top(n10, e10, { duration: l2 < 100 ? 50 : r5 }, (d3) => d3 && d3.message !== "Element already at target scroll position" ? o10(d3) : a2());
    });
  }
  var ho = createPortal !== void 0;
  function fc(e10 = navigator.userAgent) {
    let t5 = e10;
    return typeof window > "u" ? t5 = "node" : document.documentMode ? t5 = "ie" : /Edge/.test(e10) ? t5 = "edge" : window.opera || e10.includes(" OPR/") ? t5 = "opera" : typeof window.InstallTrigger < "u" ? t5 = "firefox" : window.chrome ? t5 = "chrome" : /(Version\/([\d._]+).*Safari|CriOS|FxiOS| Mobile\/)/.test(e10) && (t5 = "safari"), t5;
  }
  function Yi(e10) {
    return Object.prototype.toString.call(e10).slice(8, -1).toLowerCase();
  }
  function ur(e10, t5 = {}) {
    let { defaultValue: r5, step: n10, steps: a2 } = t5, o10 = (0, z0.default)(e10);
    if (o10) (o10.includes("{step}") || o10.includes("{steps}")) && n10 && a2 && (o10 = o10.replace("{step}", n10.toString()).replace("{steps}", a2.toString()));
    else if (isValidElement(e10) && !Object.values(e10.props).length && Yi(e10.type) === "function") {
      let i10 = e10.type({});
      o10 = ur(i10, t5);
    } else o10 = (0, z0.default)(r5);
    return o10;
  }
  function Z6(e10, t5) {
    return !A2.plainObject(e10) || !A2.array(t5) ? !1 : Object.keys(e10).every((r5) => t5.includes(r5));
  }
  function j6(e10) {
    let t5 = /^#?([\da-f])([\da-f])([\da-f])$/i, r5 = e10.replace(t5, (a2, o10, i10, l2) => o10 + o10 + i10 + i10 + l2 + l2), n10 = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(r5);
    return n10 ? [parseInt(n10[1], 16), parseInt(n10[2], 16), parseInt(n10[3], 16)] : [];
  }
  function oc(e10) {
    return e10.disableBeacon || e10.placement === "center";
  }
  function ic() {
    return !["chrome", "safari", "firefox", "opera"].includes(fc());
  }
  function Mn({ data: e10, debug: t5 = !1, title: r5, warn: n10 = !1 }) {
    let a2 = n10 ? console.warn || console.error : console.log;
    t5 && (r5 && e10 ? (console.groupCollapsed(`%creact-joyride: ${r5}`, "color: #ff0044; font-weight: bold; font-size: 12px;"), Array.isArray(e10) ? e10.forEach((o10) => {
      A2.plainObject(o10) && o10.key ? a2.apply(console, [o10.key, o10.value]) : a2.apply(console, [o10]);
    }) : a2.apply(console, [e10]), console.groupEnd()) : console.error("Missing title or data props"));
  }
  function U6(e10) {
    return Object.keys(e10);
  }
  function mc(e10, ...t5) {
    if (!A2.plainObject(e10)) throw new TypeError("Expected an object");
    let r5 = {};
    for (let n10 in e10) ({}).hasOwnProperty.call(e10, n10) && (t5.includes(n10) || (r5[n10] = e10[n10]));
    return r5;
  }
  function $6(e10, ...t5) {
    if (!A2.plainObject(e10)) throw new TypeError("Expected an object");
    if (!t5.length) return e10;
    let r5 = {};
    for (let n10 in e10) ({}).hasOwnProperty.call(e10, n10) && t5.includes(n10) && (r5[n10] = e10[n10]);
    return r5;
  }
  function Z0(e10, t5, r5) {
    let n10 = (o10) => o10.replace("{step}", String(t5)).replace("{steps}", String(r5));
    if (Yi(e10) === "string") return n10(e10);
    if (!isValidElement(e10)) return e10;
    let { children: a2 } = e10.props;
    if (Yi(a2) === "string" && a2.includes("{step}")) return cloneElement(e10, { children: n10(a2) });
    if (Array.isArray(a2)) return cloneElement(e10, { children: a2.map((o10) => typeof o10 == "string" ? n10(o10) : Z0(o10, t5, r5)) });
    if (Yi(e10.type) === "function" && !Object.values(e10.props).length) {
      let o10 = e10.type({});
      return Z0(o10, t5, r5);
    }
    return e10;
  }
  function W6(e10) {
    let { isFirstStep: t5, lifecycle: r5, previousLifecycle: n10, scrollToFirstStep: a2, step: o10, target: i10 } = e10;
    return !o10.disableScrolling && (!t5 || a2 || r5 === X.TOOLTIP) && o10.placement !== "center" && (!o10.isFixed || !La(i10)) && n10 !== r5 && [X.BEACON, X.TOOLTIP].includes(r5);
  }
  var q6 = { options: { preventOverflow: { boundariesElement: "scrollParent" } }, wrapperOptions: { offset: -18, position: !0 } }, hc = { back: "Back", close: "Close", last: "Last", next: "Next", nextLabelWithProgress: "Next (Step {step} of {steps})", open: "Open the dialog", skip: "Skip" }, G6 = { event: "click", placement: "bottom", offset: 10, disableBeacon: !1, disableCloseOnEsc: !1, disableOverlay: !1, disableOverlayClose: !1, disableScrollParentFix: !1, disableScrolling: !1, hideBackButton: !1, hideCloseButton: !1, hideFooter: !1, isFixed: !1, locale: hc, showProgress: !1, showSkipButton: !1, spotlightClicks: !1, spotlightPadding: 10 }, Q6 = { continuous: !1, debug: !1, disableCloseOnEsc: !1, disableOverlay: !1, disableOverlayClose: !1, disableScrolling: !1, disableScrollParentFix: !1, getHelpers: void 0, hideBackButton: !1, run: !0, scrollOffset: 20, scrollDuration: 300, scrollToFirstStep: !1, showSkipButton: !1, showProgress: !1, spotlightClicks: !1, spotlightPadding: 10, steps: [] }, Y6 = { arrowColor: "#fff", backgroundColor: "#fff", beaconSize: 36, overlayColor: "rgba(0, 0, 0, 0.5)", primaryColor: "#f04", spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)", textColor: "#333", width: 380, zIndex: 100 }, go = { backgroundColor: "transparent", border: 0, borderRadius: 0, color: "#555", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 8, WebkitAppearance: "none" }, sc = { borderRadius: 4, position: "absolute" };
  function J6(e10, t5) {
    var r5, n10, a2, o10, i10;
    let { floaterProps: l2, styles: d3 } = e10, u3 = (0, yo.default)((r5 = t5.floaterProps) != null ? r5 : {}, l2 ?? {}), c10 = (0, yo.default)(d3 ?? {}, (n10 = t5.styles) != null ? n10 : {}), p5 = (0, yo.default)(Y6, c10.options || {}), f4 = t5.placement === "center" || t5.disableBeacon, { width: m8 } = p5;
    window.innerWidth > 480 && (m8 = 380), "width" in p5 && (m8 = typeof p5.width == "number" && window.innerWidth < p5.width ? window.innerWidth - 30 : p5.width);
    let h2 = { bottom: 0, left: 0, overflow: "hidden", position: "absolute", right: 0, top: 0, zIndex: p5.zIndex }, g3 = { beacon: { ...go, display: f4 ? "none" : "inline-block", height: p5.beaconSize, position: "relative", width: p5.beaconSize, zIndex: p5.zIndex }, beaconInner: { animation: "joyride-beacon-inner 1.2s infinite ease-in-out", backgroundColor: p5.primaryColor, borderRadius: "50%", display: "block", height: "50%", left: "50%", opacity: 0.7, position: "absolute", top: "50%", transform: "translate(-50%, -50%)", width: "50%" }, beaconOuter: { animation: "joyride-beacon-outer 1.2s infinite ease-in-out", backgroundColor: `rgba(${j6(p5.primaryColor).join(",")}, 0.2)`, border: `2px solid ${p5.primaryColor}`, borderRadius: "50%", boxSizing: "border-box", display: "block", height: "100%", left: 0, opacity: 0.9, position: "absolute", top: 0, transformOrigin: "center", width: "100%" }, tooltip: { backgroundColor: p5.backgroundColor, borderRadius: 5, boxSizing: "border-box", color: p5.textColor, fontSize: 16, maxWidth: "100%", padding: 15, position: "relative", width: m8 }, tooltipContainer: { lineHeight: 1.4, textAlign: "center" }, tooltipTitle: { fontSize: 18, margin: 0 }, tooltipContent: { padding: "20px 10px" }, tooltipFooter: { alignItems: "center", display: "flex", justifyContent: "flex-end", marginTop: 15 }, tooltipFooterSpacer: { flex: 1 }, buttonNext: { ...go, backgroundColor: p5.primaryColor, borderRadius: 4, color: "#fff" }, buttonBack: { ...go, color: p5.primaryColor, marginLeft: "auto", marginRight: 5 }, buttonClose: { ...go, color: p5.textColor, height: 14, padding: 15, position: "absolute", right: 0, top: 0, width: 14 }, buttonSkip: { ...go, color: p5.textColor, fontSize: 14 }, overlay: { ...h2, backgroundColor: p5.overlayColor, mixBlendMode: "hard-light" }, overlayLegacy: { ...h2 }, overlayLegacyCenter: { ...h2, backgroundColor: p5.overlayColor }, spotlight: { ...sc, backgroundColor: "gray" }, spotlightLegacy: { ...sc, boxShadow: `0 0 0 9999px ${p5.overlayColor}, ${p5.spotlightShadow}` }, floaterStyles: { arrow: { color: (i10 = (o10 = (a2 = u3?.styles) == null ? void 0 : a2.arrow) == null ? void 0 : o10.color) != null ? i10 : p5.arrowColor }, options: { zIndex: p5.zIndex + 100 } }, options: p5 };
    return (0, yo.default)(g3, c10);
  }
  function K6(e10) {
    return $6(e10, "beaconComponent", "disableCloseOnEsc", "disableOverlay", "disableOverlayClose", "disableScrolling", "disableScrollParentFix", "floaterProps", "hideBackButton", "hideCloseButton", "locale", "showProgress", "showSkipButton", "spotlightClicks", "spotlightPadding", "styles", "tooltipComponent");
  }
  function Ta(e10, t5) {
    var r5, n10, a2, o10, i10, l2;
    let d3 = t5 ?? {}, u3 = vo.default.all([G6, K6(e10), d3], { isMergeableObject: A2.plainObject }), c10 = J6(e10, u3), p5 = Ji(Sr(u3.target), u3.disableScrollParentFix), f4 = vo.default.all([q6, (r5 = e10.floaterProps) != null ? r5 : {}, (n10 = u3.floaterProps) != null ? n10 : {}]);
    return f4.offset = u3.offset, f4.styles = (0, vo.default)((a2 = f4.styles) != null ? a2 : {}, c10.floaterStyles), f4.offset += (i10 = (o10 = e10.spotlightPadding) != null ? o10 : u3.spotlightPadding) != null ? i10 : 0, u3.placementBeacon && f4.wrapperOptions && (f4.wrapperOptions.placement = u3.placementBeacon), p5 && f4.options.preventOverflow && (f4.options.preventOverflow.boundariesElement = "window"), { ...u3, locale: vo.default.all([hc, (l2 = e10.locale) != null ? l2 : {}, u3.locale || {}]), floaterProps: f4, styles: mc(c10, "floaterStyles") };
  }
  function gc(e10, t5 = !1) {
    return A2.plainObject(e10) ? e10.target ? !0 : (Mn({ title: "validateStep", data: "target is missing from the step", warn: !0, debug: t5 }), !1) : (Mn({ title: "validateStep", data: "step must be an object", warn: !0, debug: t5 }), !1);
  }
  function lc(e10, t5 = !1) {
    return A2.array(e10) ? e10.every((r5) => gc(r5, t5)) : (Mn({ title: "validateSteps", data: "steps must be an array", warn: !0, debug: t5 }), !1);
  }
  var vc = { action: "init", controlled: !1, index: 0, lifecycle: X.INIT, origin: null, size: 0, status: de.IDLE }, dc = U6(mc(vc, "controlled", "size")), X6 = class {
    constructor(e10) {
      N2(this, "beaconPopper"), N2(this, "tooltipPopper"), N2(this, "data", /* @__PURE__ */ new Map()), N2(this, "listener"), N2(this, "store", /* @__PURE__ */ new Map()), N2(this, "addListener", (a2) => {
        this.listener = a2;
      }), N2(this, "setSteps", (a2) => {
        let { size: o10, status: i10 } = this.getState(), l2 = { size: a2.length, status: i10 };
        this.data.set("steps", a2), i10 === de.WAITING && !o10 && a2.length && (l2.status = de.RUNNING), this.setState(l2);
      }), N2(this, "getPopper", (a2) => a2 === "beacon" ? this.beaconPopper : this.tooltipPopper), N2(this, "setPopper", (a2, o10) => {
        a2 === "beacon" ? this.beaconPopper = o10 : this.tooltipPopper = o10;
      }), N2(this, "cleanupPoppers", () => {
        this.beaconPopper = null, this.tooltipPopper = null;
      }), N2(this, "close", (a2 = null) => {
        let { index: o10, status: i10 } = this.getState();
        i10 === de.RUNNING && this.setState({ ...this.getNextState({ action: he.CLOSE, index: o10 + 1, origin: a2 }) });
      }), N2(this, "go", (a2) => {
        let { controlled: o10, status: i10 } = this.getState();
        if (o10 || i10 !== de.RUNNING) return;
        let l2 = this.getSteps()[a2];
        this.setState({ ...this.getNextState({ action: he.GO, index: a2 }), status: l2 ? i10 : de.FINISHED });
      }), N2(this, "info", () => this.getState()), N2(this, "next", () => {
        let { index: a2, status: o10 } = this.getState();
        o10 === de.RUNNING && this.setState(this.getNextState({ action: he.NEXT, index: a2 + 1 }));
      }), N2(this, "open", () => {
        let { status: a2 } = this.getState();
        a2 === de.RUNNING && this.setState({ ...this.getNextState({ action: he.UPDATE, lifecycle: X.TOOLTIP }) });
      }), N2(this, "prev", () => {
        let { index: a2, status: o10 } = this.getState();
        o10 === de.RUNNING && this.setState({ ...this.getNextState({ action: he.PREV, index: a2 - 1 }) });
      }), N2(this, "reset", (a2 = !1) => {
        let { controlled: o10 } = this.getState();
        o10 || this.setState({ ...this.getNextState({ action: he.RESET, index: 0 }), status: a2 ? de.RUNNING : de.READY });
      }), N2(this, "skip", () => {
        let { status: a2 } = this.getState();
        a2 === de.RUNNING && this.setState({ action: he.SKIP, lifecycle: X.INIT, status: de.SKIPPED });
      }), N2(this, "start", (a2) => {
        let { index: o10, size: i10 } = this.getState();
        this.setState({ ...this.getNextState({ action: he.START, index: A2.number(a2) ? a2 : o10 }, !0), status: i10 ? de.RUNNING : de.WAITING });
      }), N2(this, "stop", (a2 = !1) => {
        let { index: o10, status: i10 } = this.getState();
        [de.FINISHED, de.SKIPPED].includes(i10) || this.setState({ ...this.getNextState({ action: he.STOP, index: o10 + (a2 ? 1 : 0) }), status: de.PAUSED });
      }), N2(this, "update", (a2) => {
        var o10, i10;
        if (!Z6(a2, dc)) throw new Error(`State is not valid. Valid keys: ${dc.join(", ")}`);
        this.setState({ ...this.getNextState({ ...this.getState(), ...a2, action: (o10 = a2.action) != null ? o10 : he.UPDATE, origin: (i10 = a2.origin) != null ? i10 : null }, !0) });
      });
      let { continuous: t5 = !1, stepIndex: r5, steps: n10 = [] } = e10 ?? {};
      this.setState({ action: he.INIT, controlled: A2.number(r5), continuous: t5, index: A2.number(r5) ? r5 : 0, lifecycle: X.INIT, origin: null, status: n10.length ? de.READY : de.IDLE }, !0), this.beaconPopper = null, this.tooltipPopper = null, this.listener = null, this.setSteps(n10);
    }
    getState() {
      return this.store.size ? { action: this.store.get("action") || "", controlled: this.store.get("controlled") || !1, index: parseInt(this.store.get("index"), 10), lifecycle: this.store.get("lifecycle") || "", origin: this.store.get("origin") || null, size: this.store.get("size") || 0, status: this.store.get("status") || "" } : { ...vc };
    }
    getNextState(e10, t5 = !1) {
      var r5, n10, a2, o10, i10;
      let { action: l2, controlled: d3, index: u3, size: c10, status: p5 } = this.getState(), f4 = A2.number(e10.index) ? e10.index : u3, m8 = d3 && !t5 ? u3 : Math.min(Math.max(f4, 0), c10);
      return { action: (r5 = e10.action) != null ? r5 : l2, controlled: d3, index: m8, lifecycle: (n10 = e10.lifecycle) != null ? n10 : X.INIT, origin: (a2 = e10.origin) != null ? a2 : null, size: (o10 = e10.size) != null ? o10 : c10, status: m8 === c10 ? de.FINISHED : (i10 = e10.status) != null ? i10 : p5 };
    }
    getSteps() {
      let e10 = this.data.get("steps");
      return Array.isArray(e10) ? e10 : [];
    }
    hasUpdatedState(e10) {
      let t5 = JSON.stringify(e10), r5 = JSON.stringify(this.getState());
      return t5 !== r5;
    }
    setState(e10, t5 = !1) {
      let r5 = this.getState(), { action: n10, index: a2, lifecycle: o10, origin: i10 = null, size: l2, status: d3 } = { ...r5, ...e10 };
      this.store.set("action", n10), this.store.set("index", a2), this.store.set("lifecycle", o10), this.store.set("origin", i10), this.store.set("size", l2), this.store.set("status", d3), t5 && (this.store.set("controlled", e10.controlled), this.store.set("continuous", e10.continuous)), this.listener && this.hasUpdatedState(r5) && this.listener(this.getState());
    }
    getHelpers() {
      return { close: this.close, go: this.go, info: this.info, next: this.next, open: this.open, prev: this.prev, reset: this.reset, skip: this.skip };
    }
  };
  function e8(e10) {
    return new X6(e10);
  }
  function t8({ styles: e10 }) {
    return createElement("div", { key: "JoyrideSpotlight", className: "react-joyride__spotlight", "data-test-id": "spotlight", style: e10 });
  }
  var r8 = t8, n8 = class extends Component {
    constructor() {
      super(...arguments), N2(this, "isActive", !1), N2(this, "resizeTimeout"), N2(this, "scrollTimeout"), N2(this, "scrollParent"), N2(this, "state", { isScrolling: !1, mouseOverSpotlight: !1, showSpotlight: !0 }), N2(this, "hideSpotlight", () => {
        let { continuous: e10, disableOverlay: t5, lifecycle: r5 } = this.props, n10 = [X.INIT, X.BEACON, X.COMPLETE, X.ERROR];
        return t5 || (e10 ? n10.includes(r5) : r5 !== X.TOOLTIP);
      }), N2(this, "handleMouseMove", (e10) => {
        let { mouseOverSpotlight: t5 } = this.state, { height: r5, left: n10, position: a2, top: o10, width: i10 } = this.spotlightStyles, l2 = a2 === "fixed" ? e10.clientY : e10.pageY, d3 = a2 === "fixed" ? e10.clientX : e10.pageX, u3 = l2 >= o10 && l2 <= o10 + r5, p5 = d3 >= n10 && d3 <= n10 + i10 && u3;
        p5 !== t5 && this.updateState({ mouseOverSpotlight: p5 });
      }), N2(this, "handleScroll", () => {
        let { target: e10 } = this.props, t5 = Sr(e10);
        if (this.scrollParent !== document) {
          let { isScrolling: r5 } = this.state;
          r5 || this.updateState({ isScrolling: !0, showSpotlight: !1 }), clearTimeout(this.scrollTimeout), this.scrollTimeout = window.setTimeout(() => {
            this.updateState({ isScrolling: !1, showSpotlight: !0 });
          }, 50);
        } else La(t5, "sticky") && this.updateState({});
      }), N2(this, "handleResize", () => {
        clearTimeout(this.resizeTimeout), this.resizeTimeout = window.setTimeout(() => {
          this.isActive && this.forceUpdate();
        }, 100);
      });
    }
    componentDidMount() {
      let { debug: e10, disableScrolling: t5, disableScrollParentFix: r5 = !1, target: n10 } = this.props, a2 = Sr(n10);
      this.scrollParent = wo(a2 ?? document.body, r5, !0), this.isActive = !0, window.addEventListener("resize", this.handleResize);
    }
    componentDidUpdate(e10) {
      var t5;
      let { disableScrollParentFix: r5, lifecycle: n10, spotlightClicks: a2, target: o10 } = this.props, { changed: i10 } = xn(e10, this.props);
      if (i10("target") || i10("disableScrollParentFix")) {
        let l2 = Sr(o10);
        this.scrollParent = wo(l2 ?? document.body, r5, !0);
      }
      i10("lifecycle", X.TOOLTIP) && ((t5 = this.scrollParent) == null || t5.addEventListener("scroll", this.handleScroll, { passive: !0 }), setTimeout(() => {
        let { isScrolling: l2 } = this.state;
        l2 || this.updateState({ showSpotlight: !0 });
      }, 100)), (i10("spotlightClicks") || i10("disableOverlay") || i10("lifecycle")) && (a2 && n10 === X.TOOLTIP ? window.addEventListener("mousemove", this.handleMouseMove, !1) : n10 !== X.TOOLTIP && window.removeEventListener("mousemove", this.handleMouseMove));
    }
    componentWillUnmount() {
      var e10;
      this.isActive = !1, window.removeEventListener("mousemove", this.handleMouseMove), window.removeEventListener("resize", this.handleResize), clearTimeout(this.resizeTimeout), clearTimeout(this.scrollTimeout), (e10 = this.scrollParent) == null || e10.removeEventListener("scroll", this.handleScroll);
    }
    get overlayStyles() {
      let { mouseOverSpotlight: e10 } = this.state, { disableOverlayClose: t5, placement: r5, styles: n10 } = this.props, a2 = n10.overlay;
      return ic() && (a2 = r5 === "center" ? n10.overlayLegacyCenter : n10.overlayLegacy), { cursor: t5 ? "default" : "pointer", height: P6(), pointerEvents: e10 ? "none" : "auto", ...a2 };
    }
    get spotlightStyles() {
      var e10, t5, r5;
      let { showSpotlight: n10 } = this.state, { disableScrollParentFix: a2 = !1, spotlightClicks: o10, spotlightPadding: i10 = 0, styles: l2, target: d3 } = this.props, u3 = Sr(d3), c10 = cc(u3), p5 = La(u3), f4 = H62(u3, i10, a2);
      return { ...ic() ? l2.spotlightLegacy : l2.spotlight, height: Math.round(((e10 = c10?.height) != null ? e10 : 0) + i10 * 2), left: Math.round(((t5 = c10?.left) != null ? t5 : 0) - i10), opacity: n10 ? 1 : 0, pointerEvents: o10 ? "none" : "auto", position: p5 ? "fixed" : "absolute", top: f4, transition: "opacity 0.2s", width: Math.round(((r5 = c10?.width) != null ? r5 : 0) + i10 * 2) };
    }
    updateState(e10) {
      this.isActive && this.setState((t5) => ({ ...t5, ...e10 }));
    }
    render() {
      let { showSpotlight: e10 } = this.state, { onClickOverlay: t5, placement: r5 } = this.props, { hideSpotlight: n10, overlayStyles: a2, spotlightStyles: o10 } = this;
      if (n10()) return null;
      let i10 = r5 !== "center" && e10 && createElement(r8, { styles: o10 });
      if (fc() === "safari") {
        let { mixBlendMode: l2, zIndex: d3, ...u3 } = a2;
        i10 = createElement("div", { style: { ...u3 } }, i10), delete a2.backgroundColor;
      }
      return createElement("div", { className: "react-joyride__overlay", "data-test-id": "overlay", onClick: t5, role: "presentation", style: a2 }, i10);
    }
  }, a8 = class extends Component {
    constructor() {
      super(...arguments), N2(this, "node", null);
    }
    componentDidMount() {
      let { id: e10 } = this.props;
      $r() && (this.node = document.createElement("div"), this.node.id = e10, document.body.appendChild(this.node), ho || this.renderReact15());
    }
    componentDidUpdate() {
      $r() && (ho || this.renderReact15());
    }
    componentWillUnmount() {
      !$r() || !this.node || (ho || unmountComponentAtNode(this.node), this.node.parentNode === document.body && (document.body.removeChild(this.node), this.node = null));
    }
    renderReact15() {
      if (!$r()) return;
      let { children: e10 } = this.props;
      this.node && unstable_renderSubtreeIntoContainer(this, e10, this.node);
    }
    renderReact16() {
      if (!$r() || !ho) return null;
      let { children: e10 } = this.props;
      return this.node ? createPortal(e10, this.node) : null;
    }
    render() {
      return ho ? this.renderReact16() : null;
    }
  }, o8 = class {
    constructor(e10, t5) {
      if (N2(this, "element"), N2(this, "options"), N2(this, "canBeTabbed", (r5) => {
        let { tabIndex: n10 } = r5;
        return n10 === null || n10 < 0 ? !1 : this.canHaveFocus(r5);
      }), N2(this, "canHaveFocus", (r5) => {
        let n10 = /input|select|textarea|button|object/, a2 = r5.nodeName.toLowerCase();
        return (n10.test(a2) && !r5.getAttribute("disabled") || a2 === "a" && !!r5.getAttribute("href")) && this.isVisible(r5);
      }), N2(this, "findValidTabElements", () => [].slice.call(this.element.querySelectorAll("*"), 0).filter(this.canBeTabbed)), N2(this, "handleKeyDown", (r5) => {
        let { code: n10 = "Tab" } = this.options;
        r5.code === n10 && this.interceptTab(r5);
      }), N2(this, "interceptTab", (r5) => {
        r5.preventDefault();
        let n10 = this.findValidTabElements(), { shiftKey: a2 } = r5;
        if (!n10.length) return;
        let o10 = document.activeElement ? n10.indexOf(document.activeElement) : 0;
        o10 === -1 || !a2 && o10 + 1 === n10.length ? o10 = 0 : a2 && o10 === 0 ? o10 = n10.length - 1 : o10 += a2 ? -1 : 1, n10[o10].focus();
      }), N2(this, "isHidden", (r5) => {
        let n10 = r5.offsetWidth <= 0 && r5.offsetHeight <= 0, a2 = window.getComputedStyle(r5);
        return n10 && !r5.innerHTML ? !0 : n10 && a2.getPropertyValue("overflow") !== "visible" || a2.getPropertyValue("display") === "none";
      }), N2(this, "isVisible", (r5) => {
        let n10 = r5;
        for (; n10; ) if (n10 instanceof HTMLElement) {
          if (n10 === document.body) break;
          if (this.isHidden(n10)) return !1;
          n10 = n10.parentNode;
        }
        return !0;
      }), N2(this, "removeScope", () => {
        window.removeEventListener("keydown", this.handleKeyDown);
      }), N2(this, "checkFocus", (r5) => {
        document.activeElement !== r5 && (r5.focus(), window.requestAnimationFrame(() => this.checkFocus(r5)));
      }), N2(this, "setFocus", () => {
        let { selector: r5 } = this.options;
        if (!r5) return;
        let n10 = this.element.querySelector(r5);
        n10 && window.requestAnimationFrame(() => this.checkFocus(n10));
      }), !(e10 instanceof HTMLElement)) throw new TypeError("Invalid parameter: element must be an HTMLElement");
      this.element = e10, this.options = t5, window.addEventListener("keydown", this.handleKeyDown, !1), this.setFocus();
    }
  }, i8 = class extends Component {
    constructor(e10) {
      if (super(e10), N2(this, "beacon", null), N2(this, "setBeaconRef", (a2) => {
        this.beacon = a2;
      }), e10.beaconComponent) return;
      let t5 = document.head || document.getElementsByTagName("head")[0], r5 = document.createElement("style");
      r5.id = "joyride-beacon-animation", e10.nonce && r5.setAttribute("nonce", e10.nonce), r5.appendChild(document.createTextNode(`
        @keyframes joyride-beacon-inner {
          20% {
            opacity: 0.9;
          }
        
          90% {
            opacity: 0.7;
          }
        }
        
        @keyframes joyride-beacon-outer {
          0% {
            transform: scale(1);
          }
        
          45% {
            opacity: 0.7;
            transform: scale(0.75);
          }
        
          100% {
            opacity: 0.9;
            transform: scale(1);
          }
        }
      `)), t5.appendChild(r5);
    }
    componentDidMount() {
      let { shouldFocus: e10 } = this.props;
      setTimeout(() => {
        A2.domElement(this.beacon) && e10 && this.beacon.focus();
      }, 0);
    }
    componentWillUnmount() {
      let e10 = document.getElementById("joyride-beacon-animation");
      e10?.parentNode && e10.parentNode.removeChild(e10);
    }
    render() {
      let { beaconComponent: e10, continuous: t5, index: r5, isLastStep: n10, locale: a2, onClickOrHover: o10, size: i10, step: l2, styles: d3 } = this.props, u3 = ur(a2.open), c10 = { "aria-label": u3, onClick: o10, onMouseEnter: o10, ref: this.setBeaconRef, title: u3 }, p5;
      return e10 ? p5 = createElement(e10, { continuous: t5, index: r5, isLastStep: n10, size: i10, step: l2, ...c10 }) : p5 = createElement("button", { key: "JoyrideBeacon", className: "react-joyride__beacon", "data-test-id": "button-beacon", style: d3.beacon, type: "button", ...c10 }, createElement("span", { style: d3.beaconInner }), createElement("span", { style: d3.beaconOuter })), p5;
    }
  };
  function s8({ styles: e10, ...t5 }) {
    let { color: r5, height: n10, width: a2, ...o10 } = e10;
    return react_default.createElement("button", { style: o10, type: "button", ...t5 }, react_default.createElement("svg", { height: typeof n10 == "number" ? `${n10}px` : n10, preserveAspectRatio: "xMidYMid", version: "1.1", viewBox: "0 0 18 18", width: typeof a2 == "number" ? `${a2}px` : a2, xmlns: "http://www.w3.org/2000/svg" }, react_default.createElement("g", null, react_default.createElement("path", { d: "M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z", fill: r5 }))));
  }
  var l8 = s8;
  function d8(e10) {
    let { backProps: t5, closeProps: r5, index: n10, isLastStep: a2, primaryProps: o10, skipProps: i10, step: l2, tooltipProps: d3 } = e10, { content: u3, hideBackButton: c10, hideCloseButton: p5, hideFooter: f4, showSkipButton: m8, styles: h2, title: g3 } = l2, w2 = {};
    return w2.primary = createElement("button", { "data-test-id": "button-primary", style: h2.buttonNext, type: "button", ...o10 }), m8 && !a2 && (w2.skip = createElement("button", { "aria-live": "off", "data-test-id": "button-skip", style: h2.buttonSkip, type: "button", ...i10 })), !c10 && n10 > 0 && (w2.back = createElement("button", { "data-test-id": "button-back", style: h2.buttonBack, type: "button", ...t5 })), w2.close = !p5 && createElement(l8, { "data-test-id": "button-close", styles: h2.buttonClose, ...r5 }), createElement("div", { key: "JoyrideTooltip", "aria-label": ur(g3 ?? u3), className: "react-joyride__tooltip", style: h2.tooltip, ...d3 }, createElement("div", { style: h2.tooltipContainer }, g3 && createElement("h1", { "aria-label": ur(g3), style: h2.tooltipTitle }, g3), createElement("div", { style: h2.tooltipContent }, u3)), !f4 && createElement("div", { style: h2.tooltipFooter }, createElement("div", { style: h2.tooltipFooterSpacer }, w2.skip), w2.back, w2.primary), w2.close);
  }
  var u8 = d8, c8 = class extends Component {
    constructor() {
      super(...arguments), N2(this, "handleClickBack", (e10) => {
        e10.preventDefault();
        let { helpers: t5 } = this.props;
        t5.prev();
      }), N2(this, "handleClickClose", (e10) => {
        e10.preventDefault();
        let { helpers: t5 } = this.props;
        t5.close("button_close");
      }), N2(this, "handleClickPrimary", (e10) => {
        e10.preventDefault();
        let { continuous: t5, helpers: r5 } = this.props;
        if (!t5) {
          r5.close("button_primary");
          return;
        }
        r5.next();
      }), N2(this, "handleClickSkip", (e10) => {
        e10.preventDefault();
        let { helpers: t5 } = this.props;
        t5.skip();
      }), N2(this, "getElementsProps", () => {
        let { continuous: e10, index: t5, isLastStep: r5, setTooltipRef: n10, size: a2, step: o10 } = this.props, { back: i10, close: l2, last: d3, next: u3, nextLabelWithProgress: c10, skip: p5 } = o10.locale, f4 = ur(i10), m8 = ur(l2), h2 = ur(d3), g3 = ur(u3), w2 = ur(p5), y10 = l2, v5 = m8;
        if (e10) {
          if (y10 = u3, v5 = g3, o10.showProgress && !r5) {
            let C3 = ur(c10, { step: t5 + 1, steps: a2 });
            y10 = Z0(c10, t5 + 1, a2), v5 = C3;
          }
          r5 && (y10 = d3, v5 = h2);
        }
        return { backProps: { "aria-label": f4, children: i10, "data-action": "back", onClick: this.handleClickBack, role: "button", title: f4 }, closeProps: { "aria-label": m8, children: l2, "data-action": "close", onClick: this.handleClickClose, role: "button", title: m8 }, primaryProps: { "aria-label": v5, children: y10, "data-action": "primary", onClick: this.handleClickPrimary, role: "button", title: v5 }, skipProps: { "aria-label": w2, children: p5, "data-action": "skip", onClick: this.handleClickSkip, role: "button", title: w2 }, tooltipProps: { "aria-modal": !0, ref: n10, role: "alertdialog" } };
      });
    }
    render() {
      let { continuous: e10, index: t5, isLastStep: r5, setTooltipRef: n10, size: a2, step: o10 } = this.props, { beaconComponent: i10, tooltipComponent: l2, ...d3 } = o10, u3;
      if (l2) {
        let c10 = { ...this.getElementsProps(), continuous: e10, index: t5, isLastStep: r5, size: a2, step: d3, setTooltipRef: n10 };
        u3 = createElement(l2, { ...c10 });
      } else u3 = createElement(u8, { ...this.getElementsProps(), continuous: e10, index: t5, isLastStep: r5, size: a2, step: o10 });
      return u3;
    }
  }, p8 = class extends Component {
    constructor() {
      super(...arguments), N2(this, "scope", null), N2(this, "tooltip", null), N2(this, "handleClickHoverBeacon", (e10) => {
        let { step: t5, store: r5 } = this.props;
        e10.type === "mouseenter" && t5.event !== "hover" || r5.update({ lifecycle: X.TOOLTIP });
      }), N2(this, "setTooltipRef", (e10) => {
        this.tooltip = e10;
      }), N2(this, "setPopper", (e10, t5) => {
        var r5;
        let { action: n10, lifecycle: a2, step: o10, store: i10 } = this.props;
        t5 === "wrapper" ? i10.setPopper("beacon", e10) : i10.setPopper("tooltip", e10), i10.getPopper("beacon") && (i10.getPopper("tooltip") || o10.placement === "center") && a2 === X.INIT && i10.update({ action: n10, lifecycle: X.READY }), (r5 = o10.floaterProps) != null && r5.getPopper && o10.floaterProps.getPopper(e10, t5);
      }), N2(this, "renderTooltip", (e10) => {
        let { continuous: t5, helpers: r5, index: n10, size: a2, step: o10 } = this.props;
        return createElement(c8, { continuous: t5, helpers: r5, index: n10, isLastStep: n10 + 1 === a2, setTooltipRef: this.setTooltipRef, size: a2, step: o10, ...e10 });
      });
    }
    componentDidMount() {
      let { debug: e10, index: t5 } = this.props;
      Mn({ title: `step:${t5}`, data: [{ key: "props", value: this.props }], debug: e10 });
    }
    componentDidUpdate(e10) {
      var t5;
      let { action: r5, callback: n10, continuous: a2, controlled: o10, debug: i10, helpers: l2, index: d3, lifecycle: u3, shouldScroll: c10, status: p5, step: f4, store: m8 } = this.props, { changed: h2, changedFrom: g3 } = xn(e10, this.props), w2 = l2.info(), y10 = a2 && r5 !== he.CLOSE && (d3 > 0 || r5 === he.PREV), v5 = h2("action") || h2("index") || h2("lifecycle") || h2("status"), C3 = g3("lifecycle", [X.TOOLTIP, X.INIT], X.INIT), b8 = h2("action", [he.NEXT, he.PREV, he.SKIP, he.CLOSE]), I = o10 && d3 === e10.index;
      if (b8 && (C3 || I) && n10({ ...w2, index: e10.index, lifecycle: X.COMPLETE, step: e10.step, type: $t.STEP_AFTER }), f4.placement === "center" && p5 === de.RUNNING && h2("index") && r5 !== he.START && u3 === X.INIT && m8.update({ lifecycle: X.READY }), v5) {
        let x2 = Sr(f4.target), D = !!x2;
        D && R6(x2) ? (g3("status", de.READY, de.RUNNING) || g3("lifecycle", X.INIT, X.READY)) && n10({ ...w2, step: f4, type: $t.STEP_BEFORE }) : (console.warn(D ? "Target not visible" : "Target not mounted", f4), n10({ ...w2, type: $t.TARGET_NOT_FOUND, step: f4 }), o10 || m8.update({ index: d3 + (r5 === he.PREV ? -1 : 1) }));
      }
      g3("lifecycle", X.INIT, X.READY) && m8.update({ lifecycle: oc(f4) || y10 ? X.TOOLTIP : X.BEACON }), h2("index") && Mn({ title: `step:${u3}`, data: [{ key: "props", value: this.props }], debug: i10 }), h2("lifecycle", X.BEACON) && n10({ ...w2, step: f4, type: $t.BEACON }), h2("lifecycle", X.TOOLTIP) && (n10({ ...w2, step: f4, type: $t.TOOLTIP }), c10 && this.tooltip && (this.scope = new o8(this.tooltip, { selector: "[data-action=primary]" }), this.scope.setFocus())), g3("lifecycle", [X.TOOLTIP, X.INIT], X.INIT) && ((t5 = this.scope) == null || t5.removeScope(), m8.cleanupPoppers());
    }
    componentWillUnmount() {
      var e10;
      (e10 = this.scope) == null || e10.removeScope();
    }
    get open() {
      let { lifecycle: e10, step: t5 } = this.props;
      return oc(t5) || e10 === X.TOOLTIP;
    }
    render() {
      let { continuous: e10, debug: t5, index: r5, nonce: n10, shouldScroll: a2, size: o10, step: i10 } = this.props, l2 = Sr(i10.target);
      return !gc(i10) || !A2.domElement(l2) ? null : createElement("div", { key: `JoyrideStep-${r5}`, className: "react-joyride__step" }, createElement(Gi, { ...i10.floaterProps, component: this.renderTooltip, debug: t5, getPopper: this.setPopper, id: `react-joyride-step-${r5}`, open: this.open, placement: i10.placement, target: i10.target }, createElement(i8, { beaconComponent: i10.beaconComponent, continuous: e10, index: r5, isLastStep: r5 + 1 === o10, locale: i10.locale, nonce: n10, onClickOrHover: this.handleClickHoverBeacon, shouldFocus: a2, size: o10, step: i10, styles: i10.styles })));
    }
  }, bc = class extends Component {
    constructor(e10) {
      super(e10), N2(this, "helpers"), N2(this, "store"), N2(this, "callback", (i10) => {
        let { callback: l2 } = this.props;
        A2.function(l2) && l2(i10);
      }), N2(this, "handleKeyboard", (i10) => {
        let { index: l2, lifecycle: d3 } = this.state, { steps: u3 } = this.props, c10 = u3[l2];
        d3 === X.TOOLTIP && i10.code === "Escape" && c10 && !c10.disableCloseOnEsc && this.store.close("keyboard");
      }), N2(this, "handleClickOverlay", () => {
        let { index: i10 } = this.state, { steps: l2 } = this.props;
        Ta(this.props, l2[i10]).disableOverlayClose || this.helpers.close("overlay");
      }), N2(this, "syncState", (i10) => {
        this.setState(i10);
      });
      let { debug: t5, getHelpers: r5, run: n10 = !0, stepIndex: a2 } = e10;
      this.store = e8({ ...e10, controlled: n10 && A2.number(a2) }), this.helpers = this.store.getHelpers();
      let { addListener: o10 } = this.store;
      Mn({ title: "init", data: [{ key: "props", value: this.props }, { key: "state", value: this.state }], debug: t5 }), o10(this.syncState), r5 && r5(this.helpers), this.state = this.store.getState();
    }
    componentDidMount() {
      if (!$r()) return;
      let { debug: e10, disableCloseOnEsc: t5, run: r5, steps: n10 } = this.props, { start: a2 } = this.store;
      lc(n10, e10) && r5 && a2(), t5 || document.body.addEventListener("keydown", this.handleKeyboard, { passive: !0 });
    }
    componentDidUpdate(e10, t5) {
      if (!$r()) return;
      let { action: r5, controlled: n10, index: a2, status: o10 } = this.state, { debug: i10, run: l2, stepIndex: d3, steps: u3 } = this.props, { stepIndex: c10, steps: p5 } = e10, { reset: f4, setSteps: m8, start: h2, stop: g3, update: w2 } = this.store, { changed: y10 } = xn(e10, this.props), { changed: v5, changedFrom: C3 } = xn(t5, this.state), b8 = Ta(this.props, u3[a2]), I = !ze(p5, u3), x2 = A2.number(d3) && y10("stepIndex"), D = Sr(b8.target);
      if (I && (lc(u3, i10) ? m8(u3) : console.warn("Steps are not valid", u3)), y10("run") && (l2 ? h2(d3) : g3()), x2) {
        let we = A2.number(c10) && c10 < d3 ? he.NEXT : he.PREV;
        r5 === he.STOP && (we = he.START), [de.FINISHED, de.SKIPPED].includes(o10) || w2({ action: r5 === he.CLOSE ? he.CLOSE : we, index: d3, lifecycle: X.INIT });
      }
      !n10 && o10 === de.RUNNING && a2 === 0 && !D && (this.store.update({ index: a2 + 1 }), this.callback({ ...this.state, type: $t.TARGET_NOT_FOUND, step: b8 }));
      let le = { ...this.state, index: a2, step: b8 };
      if (v5("action", [he.NEXT, he.PREV, he.SKIP, he.CLOSE]) && v5("status", de.PAUSED)) {
        let we = Ta(this.props, u3[t5.index]);
        this.callback({ ...le, index: t5.index, lifecycle: X.COMPLETE, step: we, type: $t.STEP_AFTER });
      }
      if (v5("status", [de.FINISHED, de.SKIPPED])) {
        let we = Ta(this.props, u3[t5.index]);
        n10 || this.callback({ ...le, index: t5.index, lifecycle: X.COMPLETE, step: we, type: $t.STEP_AFTER }), this.callback({ ...le, type: $t.TOUR_END, step: we, index: t5.index }), f4();
      } else C3("status", [de.IDLE, de.READY], de.RUNNING) ? this.callback({ ...le, type: $t.TOUR_START }) : (v5("status") || v5("action", he.RESET)) && this.callback({ ...le, type: $t.TOUR_STATUS });
      this.scrollToStep(t5);
    }
    componentWillUnmount() {
      let { disableCloseOnEsc: e10 } = this.props;
      e10 || document.body.removeEventListener("keydown", this.handleKeyboard);
    }
    scrollToStep(e10) {
      let { index: t5, lifecycle: r5, status: n10 } = this.state, { debug: a2, disableScrollParentFix: o10 = !1, scrollDuration: i10, scrollOffset: l2 = 20, scrollToFirstStep: d3 = !1, steps: u3 } = this.props, c10 = Ta(this.props, u3[t5]), p5 = Sr(c10.target), f4 = W6({ isFirstStep: t5 === 0, lifecycle: r5, previousLifecycle: e10.lifecycle, scrollToFirstStep: d3, step: c10, target: p5 });
      if (n10 === de.RUNNING && f4) {
        let m8 = Ji(p5, o10), h2 = wo(p5, o10), g3 = Math.floor(D6(p5, l2, o10)) || 0;
        Mn({ title: "scrollToStep", data: [{ key: "index", value: t5 }, { key: "lifecycle", value: r5 }, { key: "status", value: n10 }], debug: a2 });
        let w2 = this.store.getPopper("beacon"), y10 = this.store.getPopper("tooltip");
        if (r5 === X.BEACON && w2) {
          let { offsets: v5, placement: C3 } = w2;
          !["bottom"].includes(C3) && !m8 && (g3 = Math.floor(v5.popper.top - l2));
        } else if (r5 === X.TOOLTIP && y10) {
          let { flipped: v5, offsets: C3, placement: b8 } = y10;
          ["top", "right", "left"].includes(b8) && !v5 && !m8 ? g3 = Math.floor(C3.popper.top - l2) : g3 -= c10.spotlightPadding;
        }
        g3 = g3 >= 0 ? g3 : 0, n10 === de.RUNNING && V6(g3, { element: h2, duration: i10 }).then(() => {
          setTimeout(() => {
            var v5;
            (v5 = this.store.getPopper("tooltip")) == null || v5.instance.update();
          }, 10);
        });
      }
    }
    render() {
      if (!$r()) return null;
      let { index: e10, lifecycle: t5, status: r5 } = this.state, { continuous: n10 = !1, debug: a2 = !1, nonce: o10, scrollToFirstStep: i10 = !1, steps: l2 } = this.props, d3 = r5 === de.RUNNING, u3 = {};
      if (d3 && l2[e10]) {
        let c10 = Ta(this.props, l2[e10]);
        u3.step = createElement(p8, { ...this.state, callback: this.callback, continuous: n10, debug: a2, helpers: this.helpers, nonce: o10, shouldScroll: !c10.disableScrolling && (e10 !== 0 || i10), step: c10, store: this.store }), u3.overlay = createElement(a8, { id: "react-joyride-portal" }, createElement(n8, { ...c10, continuous: n10, debug: a2, lifecycle: t5, onClickOverlay: this.handleClickOverlay }));
      }
      return createElement("div", { className: "react-joyride" }, u3.step, u3.overlay);
    }
  };
  N2(bc, "defaultProps", Q6);
  var Sc = bc, xc = [void 0, "SKIPPED", "EQUAL", "FIXED", "ADDED", "CHANGED", "REMOVED", "CAPTURE_ERROR", "SYSTEM_ERROR"], An = ([e10, ...t5]) => t5.reduce((r5, n10) => xc.indexOf(n10) > xc.indexOf(r5) ? n10 : r5, e10);
  function f8(e10) {
    return (e10.FAILED ?? 0) > 0 ? "FAILED" : (e10.IN_PROGRESS ?? 0) > 0 ? "IN_PROGRESS" : (e10.BROKEN ?? 0) > 0 ? "BROKEN" : (e10.DENIED ?? 0) > 0 ? "DENIED" : (e10.PENDING ?? 0) > 0 ? "PENDING" : (e10.ACCEPTED ?? 0) > 0 ? "ACCEPTED" : "PASSED";
  }
  function Ba(e10) {
    let { statusCounts: t5, isInProgress: r5, changeCount: n10, brokenCount: a2, resultsByBrowser: o10, resultsByMode: i10, modesByName: l2 } = e10.reduce((p5, f4) => (p5.statusCounts[f4.status] = (p5.statusCounts[f4.status] || 0) + 1, f4.status === "IN_PROGRESS" && (p5.isInProgress = !0), f4.result && ["CHANGED", "ADDED"].includes(f4.result) && (p5.changeCount += 1), f4.result && ["CAPTURE_ERROR", "SYSTEM_ERROR"].includes(f4.result) && (p5.brokenCount += 1), f4.comparisons?.forEach(({ browser: m8, result: h2 }) => {
      p5.resultsByBrowser[m8.id] = An([h2 ?? void 0, p5.resultsByBrowser[m8.id]]);
    }), f4.comparisons?.forEach(({ result: m8 }) => {
      p5.resultsByMode[f4.mode.name] = An([m8 ?? void 0, p5.resultsByMode[f4.mode.name]]);
    }), p5.modesByName[f4.mode.name] = f4.mode, p5), { statusCounts: {}, isInProgress: !1, changeCount: 0, brokenCount: 0, resultsByBrowser: {}, resultsByMode: {}, modesByName: {} }), d3 = e10.length ? Object.fromEntries(e10[0].comparisons.map((p5) => [p5.browser.id, p5.browser])) : {}, u3 = Object.entries(o10).map(([p5, f4]) => ({ browser: d3[p5], result: f4 })), c10 = Object.entries(i10).map(([p5, f4]) => ({ mode: l2[p5], result: f4 }));
    return { status: f8(t5), isInProgress: r5, changeCount: n10, brokenCount: a2, browserResults: u3, modeResults: c10 };
  }
  var v8 = (e10) => {
    try {
      return [useGlobals()[0][e10], useGlobalTypes()[e10]];
    } catch {
      return [null, null];
    }
  }, kc = ({ result: e10 }) => e10 && !["EQUAL", "FIXED", "SKIPPED"].includes(e10), y8 = (e10, t5) => {
    let r5 = e10.filter((o10) => o10.comparisons.some(kc)), n10 = r5.length ? r5 : e10;
    return n10.find((o10) => o10.mode.name === t5) || n10[0];
  }, w8 = (e10, t5) => {
    let r5 = e10.filter(kc), n10 = r5.length ? r5 : e10;
    return n10.find((o10) => o10.browser.id === t5) || n10[0];
  };
  function Ic(e10) {
    let [t5, r5] = useState(!0), n10 = v8("theme")[1], [a2, o10] = Ce($s), [i10, l2] = Ce(Ws), d3, u3;
    return e10.length && (d3 = t5 ? y8(e10, a2) : e10.find(({ mode: c10 }) => c10.name === a2) || e10[0], u3 = t5 ? w8(d3.comparisons, i10) : d3?.comparisons.find(({ browser: c10 }) => c10.id === i10) || d3?.comparisons[0], t5 && (a2 !== d3?.mode.name && o10(d3?.mode.name), i10 !== u3?.browser.id && l2(u3?.browser.id), r5(!1))), { modeOrder: n10?.toolbar?.items?.map((c10) => c10.title), selectedTest: d3, selectedComparison: u3, onSelectBrowser: useCallback((c10) => l2(c10.id), [l2]), onSelectMode: useCallback((c10) => o10(c10.name), [o10]) };
  }
  var Ec = Je(`
  query AddonVisualTestsBuild(
    $projectId: ID!
    $branch: String!
    $gitUserEmailHash: String!
    $repositoryOwnerName: String
    $storyId: String!
    $testStatuses: [TestStatus!]!
    $selectedBuildId: ID!
    $hasSelectedBuildId: Boolean!
  ) {
    project(id: $projectId) {
      name
      manageUrl
      account {
        billingUrl
        suspensionReason
      }
      features {
        uiTests
      }
      lastBuildOnBranch: lastBuild(
        branches: [$branch]
        repositoryOwnerName: $repositoryOwnerName
        localBuilds: { localBuildEmailHash: $gitUserEmailHash }
      ) {
        ...LastBuildOnBranchBuildFields
        ...SelectedBuildFields @skip(if: $hasSelectedBuildId)
      }
      lastBuild {
        id
        slug
        branch
      }
    }
    selectedBuild: build(id: $selectedBuildId) @include(if: $hasSelectedBuildId) {
      ...SelectedBuildFields
    }
    viewer {
      preferences {
        vtaOnboarding
      }
      projectMembership(projectId: $projectId) {
        userCanReview: meetsAccessLevel(minimumAccessLevel: REVIEWER)
      }
    }
  }
`), Tc = Je(`
  fragment LastBuildOnBranchBuildFields on Build {
    __typename
    id
    status
    committedAt
    ... on StartedBuild {
      testsForStatus: tests(first: 1000, statuses: $testStatuses) {
        nodes {
          ...StatusTestFields
        }
      }
      testsForStory: tests(storyId: $storyId) {
        nodes {
          ...LastBuildOnBranchTestFields
        }
      }
    }
    ... on CompletedBuild {
      result
      testsForStatus: tests(first: 1000, statuses: $testStatuses) {
        nodes {
          ...StatusTestFields
        }
      }
      testsForStory: tests(storyId: $storyId) {
        nodes {
          ...LastBuildOnBranchTestFields
        }
      }
    }
  }
`), Mc = Je(`
  fragment SelectedBuildFields on Build {
    __typename
    id
    number
    branch
    commit
    committedAt
    uncommittedHash
    status
    ... on StartedBuild {
      startedAt
      testsForStory: tests(storyId: $storyId) {
        nodes {
          ...StoryTestFields
        }
      }
    }
    ... on CompletedBuild {
      startedAt
      testsForStory: tests(storyId: $storyId) {
        nodes {
          ...StoryTestFields
        }
      }
    }
  }
`), $0 = Je(`
  fragment StatusTestFields on Test {
    id
    status
    result
    story {
      storyId
    }
  }
`), Lc = Je(`
  fragment LastBuildOnBranchTestFields on Test {
    status
    result
  }
`), Ac = Je(`
  fragment StoryTestFields on Test {
    id
    status
    result
    webUrl
    comparisons {
      id
      result
      browser {
        id
        key
        name
        version
      }
      captureDiff {
        diffImage(signed: true) {
          imageUrl
          imageWidth
        }
        focusImage(signed: true) {
          imageUrl
          imageWidth
        }
      }
      headCapture {
        captureImage(signed: true) {
          backgroundColor
          imageUrl
          imageWidth
          imageHeight
          thumbnailUrl
        }
        captureError {
          kind
          ... on CaptureErrorInteractionFailure {
            error
          }
          ... on CaptureErrorJSError {
            error
          }
          ... on CaptureErrorFailedJS {
            error
          }
        }
      }
      baseCapture {
        captureImage(signed: true) {
          imageUrl
          imageWidth
          imageHeight
        }
      }
    }
    mode {
      name
      globals
    }
    story {
      storyId
      name
      component {
        name
      }
    }
  }
`), Bc = Je(`
  mutation ReviewTest($input: ReviewTestInput!) {
    reviewTest(input: $input) {
      updatedTests {
        id
        status
      }
      userErrors {
        ... on UserError {
          __typename
          message
        }
        ... on BuildSupersededError {
          build {
            id
          }
        }
        ... on TestUnreviewableError {
          test {
            id
          }
        }
      }
    }
  }
`), Oc = ({ projectId: e10, storyId: t5, gitInfo: r5, selectedBuildInfo: n10 }) => {
    let [{ data: a2, error: o10, operation: i10 }, l2] = la({ query: Ec, variables: { projectId: e10, storyId: t5, testStatuses: Object.keys(Pi), branch: r5.branch || "", ...r5.slug ? { repositoryOwnerName: r5.slug.split("/", 1)[0] } : {}, gitUserEmailHash: r5.userEmailHash, selectedBuildId: n10?.buildId || "", hasSelectedBuildId: !!n10 } });
    useEffect(() => {
      let g3 = setInterval(l2, 5e3);
      return () => clearInterval(g3);
    }, [l2]);
    let d3 = i10 && t5 && i10.variables.storyId !== t5, u3 = Nr(Tc, a2?.project?.lastBuildOnBranch), c10 = [...Nr(Lc, u3 && "testsForStory" in u3 && u3.testsForStory ? u3.testsForStory.nodes : [])], p5 = u3?.committedAt > r5.committedAt, f4 = !!u3 && !p5, m8 = !!u3 && c10.every((g3) => g3.status !== "IN_PROGRESS"), h2 = Nr(Mc, a2?.selectedBuild ?? (m8 ? a2?.project?.lastBuildOnBranch : void 0));
    return { account: a2?.project?.account, features: a2?.project?.features, manageUrl: a2?.project?.manageUrl, hasData: !!a2 && !d3, hasProject: !!a2?.project, hasSelectedBuild: h2?.branch.split(":").at(-1) === r5.branch, lastBuildOnBranch: u3, lastBuildOnBranchIsNewer: p5, lastBuildOnBranchIsReady: m8, lastBuildOnBranchIsSelectable: f4, selectedBuild: h2, selectedBuildMatchesGit: h2?.branch.split(":").at(-1) === r5.branch && h2?.commit === r5.commit && h2?.uncommittedHash === r5.uncommittedHash, rerunQuery: l2, queryError: o10, userCanReview: !!a2?.viewer?.projectMembership?.userCanReview, vtaOnboarding: a2?.viewer?.preferences?.vtaOnboarding };
  }, W0 = createContext(null), Nc = createContext(null), Rc = () => Ze(W0, "Build"), Ki = () => {
    let { selectedBuild: e10 } = Ze(W0, "Build");
    if (!e10) throw new Error("No selectedBuild on Build context");
    return e10;
  }, pt = () => Ze(Nc, "Story"), Xi = ({ children: e10, watchState: t5 }) => {
    let r5 = !!t5?.selectedBuild && "testsForStory" in t5.selectedBuild, n10 = t5?.selectedBuild && "testsForStory" in t5.selectedBuild && t5.selectedBuild.testsForStory?.nodes, a2 = [...Nr(Ac, n10 || [])], o10 = Ba(a2), { toggleDiff: i10 } = Xt();
    return useEffect(() => i10(o10.changeCount > 0), [i10, o10.changeCount]), react_default.createElement(W0.Provider, { value: useMemo(() => t5, [JSON.stringify(t5?.selectedBuild)]) }, react_default.createElement(Nc.Provider, { value: { hasTests: r5, tests: a2, summary: o10, ...Ic(a2) } }, e10));
  }, C8 = styled.div({ zIndex: 9999, position: "fixed", top: 0, left: "50%", width: "50%", height: "100%" }), Hc = react_default.memo(function({ timeToFade: t5 = 5e3, colors: r5 = ["#CA90FF", "#FC521F", "#66BF3C", "#FF4785", "#FFAE00", "#1EA7FD"], ...n10 }) {
    return react_default.createElement(C8, null, react_default.createElement(F, { colors: r5, particleCount: 200, duration: t5, stageHeight: window.innerHeight, stageWidth: window.innerWidth, destroyAfterDone: !0, ...n10 }));
  }), k8 = styled.div(({ theme: e10 }) => ({ background: e10.base === "light" ? e10.color.lightest : "#292A2C", width: 260, padding: 15, borderRadius: 5, boxShadow: "0px 0px 32px 0px #00000029" })), I8 = styled.div({ display: "flex", flexDirection: "column", alignItems: "flex-start" }), E8 = styled.div(({ theme: e10 }) => ({ fontSize: 13, lineHeight: "18px", fontWeight: 700, color: e10.color.defaultText })), T8 = styled.div(({ theme: e10 }) => ({ fontSize: 13, lineHeight: "18px", textAlign: "start", color: e10.color.defaultText, margin: 0, marginTop: 5 })), M8 = styled.div({ display: "flex", justifyContent: "flex-end", marginTop: 15 }), Dc = ({ isLastStep: e10, step: t5, primaryProps: r5, tooltipProps: n10 }) => react_default.createElement(k8, { ...n10 }, react_default.createElement(I8, null, t5.title && react_default.createElement(E8, null, t5.title), react_default.createElement(T8, null, t5.content)), (t5.hideNextButton || t5.hideBackButton) && react_default.createElement(M8, { id: "buttonSkip" }, !t5.hideSkipButton && !e10 && react_default.createElement(J, { ariaLabel: !1, size: "medium", onClick: t5.onSkipWalkthroughButtonClick, link: !0, style: { paddingRight: 12, paddingLeft: 12, marginRight: 8 } }, "Skip"), !t5.hideNextButton && react_default.createElement(J, { ariaLabel: !1, ...r5, onClick: r5.onClick, variant: "solid", ...t5.onNextButtonClick ? { onClick: t5.onNextButtonClick } : {} }, t5.nextButtonText || "Next"))), Vc = "setFilter", zc = ({ managerApi: e10, skipWalkthrough: t5, startWalkthrough: r5, completeWalkthrough: n10 }) => {
    let a2 = useTheme(), o10 = pt(), i10 = o10?.selectedTest?.result === "CHANGED", l2 = o10?.selectedTest?.status !== "ACCEPTED", d3 = JSON.stringify(useStorybookState().layout), u3 = useRef(d3);
    u3.current !== d3 && (window.dispatchEvent(new Event("resize")), u3.current = d3), useEffect(() => {
      r5();
    }), useEffect(() => {
      e10.getCurrentStoryData()?.type !== "story" && e10.jumpToStory(1), e10.togglePanel(!0), e10.togglePanelPosition("right"), e10.setSelectedPanel(_t);
    }, [e10]);
    let [c10, p5] = Oe("showConfetti", !1), [f4, m8] = Oe("stepIndex", 0), h2 = () => m8((w2 = 0) => w2 + 1);
    return useEffect(() => {
      let w2 = document.getElementById("storybook-explorer-tree"), y10 = Array.from(w2 instanceof HTMLElement ? w2.children : []).filter((v5) => v5 instanceof HTMLElement).slice(1);
      return y10.forEach((v5) => v5.style.display = "none"), () => y10.forEach((v5) => v5.style.display = "");
    }, []), useEffect(() => {
      let w2 = () => {
        m8(1), setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 100);
      };
      return e10.on(T1, w2), e10.on(Vc, w2), () => {
        e10.off(T1, w2), e10.off(Vc, w2);
      };
    }, [e10, m8]), useEffect(() => {
      o10?.selectedTest?.status === "ACCEPTED" && f4 === 5 && (p5(!0), m8(6));
    }, [o10?.selectedTest?.status, c10, p5, f4, m8]), react_default.createElement(react_default.Fragment, null, c10 && react_default.createElement(Hc, null), react_default.createElement(Sc, { steps: [{ target: "#sidebar-bottom-wrapper", title: "Changes found", content: react_default.createElement(react_default.Fragment, null, "The visual tests addon will detect changes in all of your stories and allow you to review them before opening a pull request.", react_default.createElement("br", null), react_default.createElement("br", null), "Click the number at the bottom-right to only show stories with visual changes."), floaterProps: { target: "#warnings-found-filter", options: { preventOverflow: { boundariesElement: "window" } } }, placement: "top", disableBeacon: !0, hideNextButton: !0, spotlightClicks: !0, onSkipWalkthroughButtonClick: t5 }, i10 && l2 ? { target: "#storybook-explorer-tree > div", title: "Stories with changes", content: react_default.createElement(react_default.Fragment, null, "Here you have a filtered list of only stories with changes."), placement: "right", disableBeacon: !0, spotlightClicks: !0, onNextButtonClick: h2, onSkipWalkthroughButtonClick: t5 } : { target: "#storybook-explorer-tree > div", title: "Stories with changes", content: react_default.createElement(react_default.Fragment, null, "Here you have a list of all stories in your Storybook.", react_default.createElement("br", null), react_default.createElement("br", null), "Select a story with changes to see the exact pixels that changed."), placement: "right", disableBeacon: !0, spotlightClicks: !0, hideNextButton: !0, onSkipWalkthroughButtonClick: t5 }, { target: "#panel-tab-content", title: "Inspect changes", content: react_default.createElement(react_default.Fragment, null, "The results of the changes are shown here. The pixels that changed are highlighted in green."), disableBeacon: !0, placement: "left", onNextButtonClick: h2, onSkipWalkthroughButtonClick: t5 }, { target: "#button-diff-visible", title: "Toggle the diff", content: react_default.createElement(react_default.Fragment, null, "This button shows or hides the visual diff. Use it to make the visual changes in your stories obvious. Try it out."), onNextButtonClick: h2, onSkipWalkthroughButtonClick: t5, spotlightClicks: !0, disableBeacon: !0, placement: "bottom", disableOverlay: !0 }, { target: "#button-toggle-snapshot", title: "This is the Switch button", content: react_default.createElement(react_default.Fragment, null, "Switch between the baseline snapshot (old) and the latest snapshot. The info bar will let you know which version you're looking at."), onNextButtonClick: h2, onSkipWalkthroughButtonClick: t5, spotlightClicks: !0, disableBeacon: !0, placement: "bottom", disableOverlay: !0 }, { target: "#button-toggle-accept-story", title: "Accept changes", content: react_default.createElement(react_default.Fragment, null, "If the visual changes are intentional, accept them to update the test baselines. The next time you run visual tests, future changes will be compared to these new baselines. This can be undone."), disableBeacon: !0, spotlightClicks: !0, onNextButtonClick: h2, hideNextButton: !0, placement: "bottom", disableOverlay: !0, onSkipWalkthroughButtonClick: t5 }, { target: "#button-toggle-accept-story", title: "Perfection!", placement: "bottom", disableOverlay: !0, content: react_default.createElement(react_default.Fragment, null, "You've got the basics down! You can always unaccept if you're not happy with the changes."), onNextButtonClick: h2, onSkipWalkthroughButtonClick: t5 }, { target: "#button-run-tests", title: "You are ready to test", placement: "bottom", disableOverlay: !0, content: react_default.createElement(react_default.Fragment, null, "Any time you want to run tests, tap this button in the sidebar to see exactly what changed across your Storybook."), disableBeacon: !0, nextButtonText: "Done", onNextButtonClick: n10 }], continuous: !0, stepIndex: f4, spotlightPadding: 0, hideBackButton: !0, disableCloseOnEsc: !0, disableOverlayClose: !0, disableScrolling: !0, hideCloseButton: !0, showSkipButton: !0, floaterProps: { options: { offset: { offset: "0, 6" } }, styles: { floater: { padding: 0, paddingLeft: 8, paddingTop: 8, filter: a2.base === "light" ? "drop-shadow(0px 5px 5px rgba(0,0,0,0.05)) drop-shadow(0 1px 3px rgba(0,0,0,0.1))" : "drop-shadow(#fff5 0px 0px 0.5px) drop-shadow(#fff5 0px 0px 0.5px)" } } }, tooltipComponent: Dc, styles: { overlay: { mixBlendMode: "unset", backgroundColor: "none" }, spotlight: { backgroundColor: "none", border: `solid 2px ${a2.color.secondary}`, boxShadow: "0px 0px 0px 9999px rgba(0,0,0,0.4)" }, options: { zIndex: 1e4, primaryColor: a2.color.secondary, arrowColor: a2.base === "light" ? a2.color.lightest : "#292A2C" } } }));
  }, Zc = styled.div(({ theme: e10 }) => ({ display: "flex", flexDirection: "row", alignItems: "center", borderRadius: e10.appBorderRadius, background: e10.base === "light" ? e10.color.lightest : e10.color.darkest, border: `1px solid ${e10.appBorderColor}`, padding: 15, flex: 1, gap: 14, maxWidth: "500px", width: "100%" }), ({ theme: e10, warning: t5 }) => t5 && { background: e10.base === "dark" ? "#342e1a" : e10.background.warning }), P8 = ({ content: e10 }) => {
    let t5 = e10.split(/\r?\n/);
    return react_default.createElement(react_default.Fragment, null, t5.reduce((r5, n10, a2) => r5.concat([a2 && react_default.createElement("br", null), n10].filter(Boolean)), []));
  }, G0 = ({ localBuildProgress: e10, title: t5 }) => react_default.createElement(Zc, { warning: !0 }, react_default.createElement(L2, null, react_default.createElement("span", null, t5 && react_default.createElement("b", null, t5, ": "), react_default.createElement(P8, { content: stripAnsi(Array.isArray(e10.originalError) ? e10.originalError[0]?.message : e10.originalError?.message || "Unknown error") })), " ", react_default.createElement(ye, { target: "_blank", href: e10.errorDetailsUrl || `${Do}#troubleshooting`, withArrow: !0 }, e10.errorDetailsUrl ? "Details" : "Troubleshoot"))), jc = ({ children: e10, localBuildProgress: t5 }) => (be("Errors", "BuildError"), react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Build failed"), react_default.createElement(L2, { center: !0, muted: !0 }, "Check the Storybook process on the command line for more details.")), react_default.createElement(G0, { localBuildProgress: t5 }), e10)))), e1 = ["initialize", "build", "upload", "verify", "snapshot"], _a = { initialize: { key: "initialize", emoji: "\u{1F680}", renderName: () => "Initialize build", renderProgress: () => "Initializing build...", renderComplete: () => "Initialized", estimateDuration: 2e3 }, build: { key: "build", emoji: "\u{1F3D7}", renderName: () => "Build Storybook", renderProgress: () => "Building your Storybook...", renderComplete: () => "Storybook built", estimateDuration: 2e4 }, upload: { key: "upload", emoji: "\u{1F4E1}", renderName: () => "Publish your Storybook", renderProgress: ({ stepProgress: e10 }) => {
    let { numerator: t5, denominator: r5 } = e10.upload;
    if (!r5 || !t5) return "Uploading files...";
    let { value: n10, exponent: a2 } = filesize(r5, { output: "object", round: 1 }), { value: o10, symbol: i10 } = filesize(t5, { exponent: a2, output: "object", round: 1 });
    return `Uploading files... ${o10}/${n10} ${i10}`;
  }, renderComplete: () => "Publish complete", estimateDuration: 2e4 }, verify: { key: "verify", emoji: "\u{1F50D}", renderName: () => "Verify your Storybook", renderProgress: () => "Verifying contents...", renderComplete: () => "Storybook verified", estimateDuration: 2e4 }, snapshot: { key: "snapshot", emoji: "\u{1F4F8}", renderName: () => "Run visual tests", renderProgress: ({ stepProgress: e10 }) => {
    let { numerator: t5, denominator: r5 } = e10.snapshot;
    return r5 ? `Running visual tests... ${t5}/${r5}` : "Running visual tests...";
  }, renderComplete: () => "Tested your stories", estimateDuration: 9e4 }, aborted: { key: "aborted", emoji: "\u270B", renderName: () => "Build canceled", renderProgress: () => "Build canceled", renderComplete: () => "Build canceled", estimateDuration: 0 }, complete: { key: "complete", emoji: "\u{1F389}", renderName: () => "Visual tests completed!", renderProgress: () => "Visual tests completed!", renderComplete: () => "Visual tests completed!", estimateDuration: 0 }, error: { key: "error", emoji: "\u{1F6A8}", renderName: () => "Build failed", renderProgress: () => "Build failed", renderComplete: () => "Build failed", estimateDuration: 0 }, limited: { key: "error", emoji: "\u{1F6A8}", renderName: () => "Build limited", renderProgress: () => "Build limited", renderComplete: () => "Build limited", estimateDuration: 0 } }, O8 = { buildProgressPercentage: 0, currentStep: e1[0], stepProgress: Object.fromEntries(e1.map((e10) => [e10, {}])) };
  JSON.stringify(O8);
  var t1 = ({ localBuildProgress: e10, withEmoji: t5 = !1, ...r5 }) => {
    let { emoji: n10, renderProgress: a2 } = _a[e10.currentStep], o10 = a2(e10);
    return react_default.createElement(L2, { ...r5 }, t5 && n10, " ", o10);
  }, R8 = styled(L2)({ display: "flex", flexDirection: "column", gap: 10, width: 200, marginTop: 15 }), $c = styled.div(({ theme: e10 }) => ({ height: 5, background: e10.background.hoverable, borderRadius: 5, overflow: "hidden" })), H8 = styled($c)(({ theme: e10 }) => ({ background: e10.color.secondary, transition: "width 3s ease-out" }));
  function Wr({ localBuildProgress: e10 }) {
    return react_default.createElement(R8, { center: !0, small: !0 }, react_default.createElement($c, null, typeof e10.buildProgressPercentage == "number" && react_default.createElement(H8, { style: { width: `${e10.buildProgressPercentage}%` } })), react_default.createElement(t1, { center: !0, muted: !0, small: !0, localBuildProgress: e10 }));
  }
  var Wc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB7ZfPTupAFMa/mbb0XkAk6r2516jRnXHlxr0+ib4J+iTqm7Bx5YaVcWPQECUoGiJCpX/mOKcxRo2DILa44Jc0Taad+b45mZkzR+CZaq2+CcsqAWIdoCKSowyFw5WFvwcvLRf1m1Kt0SSv51OkFCVJx+sRa1W1JmuLav16x5Zyf/7PDKQQSAM9RVzd3CH0aUsKEtsz0/nUxBnWmisWAItKkkCbWddF2mQcm1/rEmPiOeJF2/TD+f0pKo0jBKqHUcg5U1ib28ByYfXD78YInDSPRxZnOkE7nogJ2a/jd9FvImNbAz/GgHERZp08pjJ8OA3uMVIh2kELXvAwcB/j6HmnOJQ4Y0kbBW16GGS/wb7CsKYni9AYZ9f6haydhzCEVFGEbtiFH3kYBWMEfts5o3jcUVjIaYOjIvsJfIb4hhQ+WYQTAz/XgDXALuCz4D2ckN7Dt6KhDfzLLcGxMsaORApe2MFbQyrOhq9xpIu12Q3jOMaTcNqdjZ+k0REQLS4UxoXUZ1nFD0KkTffR51dZUhTuNVttpBkF1rq717cmFR3GDdXLxm6tcUudxx4lCRe+XACz1pnWZO2XbMJFKteJXKohMYTeIlRBFO2tLP4vc8sThEpu8pkDBW8AAAAASUVORK5CYII=", qc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAN0SURBVHgBvVdLTxNRFP7uUDpSC7Q8rFSLqWJEExOfC1/xHWPiQuPShS50Y/wP6F9wq1HZuTAxMXFlNGzUhWIQDWICLYhSC4XWlj5m2pnjvS20NNDhltB+i870zpnzffece8/cw7CI4FToDBoa+gB2ACAXaocBmOj3b9/yrDgyGZrtmwpHKK3pZJgm1RLJtEaCK8g5BTcLhmZu2RTlqbezDQpjqAf4FDE9O4+cTmcVRuxmW6uzbuQCgqvD1QI0UJ9CoDMOVUW9YW+0icsBG9YDLQNMjIAS0fxf1u4FvH5A3STtYjHiruoEcGL6/Bb07X3ZMImfZjfYnkNgR86jGsgL4LM1Xz3OXys9F+KQiIGdvQ5ZKLKGBefRte1+DoKG30MWcgKmg9zxF8iCBt8W1slGCaDgCKqCIA8FpEzlIjAXQrWgiNw70mugVpDaBczF9/nXvzy03NxmAo4sqEUrN2rls3YUPLIUkOnoQpOEb0sBWVPDp5l3SOqjuDjeVi5KzYG2x0E9KZi7eCVYVoNEXXgY2YpdvOaf38bgtlfmqJiCZDaO15P9CMS/I9xtILzDKDfg0WD7LwHnzpWRC3w0TiBGbgxGgEejhKiO6gW8+f0cC9l/JadXNCRdVDI42QtcPQrFcwHMubM4HCIv3hmlahjlmXoRIFQlQMx6ObnAQivhzY10SQQnLzrxFAh/GHvxJHsbGSoPSSABjFSoYauugV8LY6saCxEv76bgne5Ec5MCj65DIxMxeDBE9xDIeVEJIh373JICotoMrDDevQlz8fIIpRu5d4tch9IicivPHOuqA8Ts2CisKsBpa7F8yWbMrxgzcw2W77jtTF6Ax+GDFexmFIyyZeQ5zToqhzsgL6DXfQR2xfp006oPF++zKYelrShE/mbIC7ArKo51XYYVnLw6qkaYz1xFJu60tL3SzauhWoUAAd/mHpzedg3Oxsrr4ZQaxUGbu+JzMfM7vWzV7bcEy2+BEOHz9+QL01RiDLqZyadms70FPudueJoKa+V4J/AhzM8t6RJxF8/K4XZepdf43LHg9Gy0e2u7q559wRImQrP8dAwM6dkc6o1UJl+1BhQycg8isUS+XaoXBNd8fIHfGP35geCf8P2p8BwlMxrVEqLxFQ2w4BrnnIK7mHjRpIo+UbRqqBlYjBfyIRjGA7+va0CM/AdEDxpHNfo8owAAAABJRU5ErkJggg==", Gc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMJSURBVHgB7VfNblJBFD5z+5e0poXGNqnFRFxoUly0K+vCpG7aFyhrTRofwBcQ6974AIZo1/QFyorEBezsQkhqYqkBSoBaAcWW3+N8dxh+hFJI+Nn0S264d+65c77znXNmGEFVhCPxDRobcxGJVSK20ODgowrt2W2Ln2ojP+IpVyRxxhf5ApcrFR4kchd5hq+w9AnfIhxPvhg3jI93FubJEIKGARkinabOqVTgZ4Zg8Xx+7tbQnAPwddsySzTGLoOJN6anpmjYmJwYx8+qQSNCVXHLyAho3BAY78bo5WemFau6D/0i+vC0fx1zLYFQmmjTJshpV8+BpLrWF6kvuDYFB1GuOQfg+CDG1C90lQIgKKWH8EiFbZooWySanWi18yeRJjbfA7DZkgraZqh3Aoh+a1nl21uNesUqzAk9YaadB/VagMP3X5W9876okYvmVMoyxWZ7jY4pCKSoVnyNQDTZQvOY51g5QIq8kjjIvP2iSG8jhawKuGsCYL5iUYyhxJNFYV6IBkCEWmYAxYpv3EfwJejVI0Gv15RSAFQLprl7AoEknNYnR2S4/Ek1CWTWk5vPdkXWYVV23phKydxk55a9sgYiMprtGRWlzi8Qy9UVaJQUaYENfh0WVXTrUrHoH+qdACK2zYiaI9da+ygQtV4T3N+Y3j0WJlnUQzCtbPDssoreCCDnyCGwL2WO5JrfO+SEm8vKMaJGznW3uI/YJKbbTivXEwENFFVGRqDJaMBJtlhvNbzVXYGxjLyfnVRKOKyda6ClCHXFAyhEHVkjMKnOP2whc6ha4TsPhVknnmNl126xakSLAvsnaD82VzQosG1v/QjSY4PyV1sSZKAS5DadyujniqpjMIe2w73zv/lE+DTJ95YWqF8AGSiCGrhq+dU4iae63wu6RbuVsxNu/hFJAiKNg8LICMgmOywUSzRs/L00Fw6fweXS7ln6Nw1TBfg6z8pNolLeMwfCscSbSOIn5y7zPEjg4IsDMHx9lz7hu7bM4ZCKcyKOajQwCLlF8SGVy7v2u0s+jPwDEeUTfjDhTd4AAAAASUVORK5CYII=", Qc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALVSURBVHgBxZfLbtNAFIb/8TgJCbm2adNUIOiuYpUN+7JiySPAm5Q+CfQBeIcuWYDaVYWEUIQqCLmQpEmaJq7Hw5y4dpOOadwEh0+yZnx8OWfm/HNjuKZ6VtsD5/sAqwAyj+g4goPDnUeb733L91pz/6zekpdjSwrHkVFycTmW5KuqfJJvVq013piG8W57Yw0GY1gFqon42WzDtuQLg0n2ei2XXplzgnwV81mAy31DQu6lEgmsmnjMpKJi4D9x3eN58/YDabdUkmrAuboMDqTXgV4DSOWgkuZei9iEElzyCRDbmvGnBYDmZ6C4rWIr39i8ejy1uI0aN/gKVpgNQE9BtoDIeJDUTHoP2GPVAvfFL708jrtlCMmxCClu4Vm2gd1s1zUM2kBybgCWXz3tbSJtmlicxKQBfgCkiVvoKUiv+dWhiGNZZnpv1Nee683rNWcFeM2lfQzH/oi++IUcL6LvdJAziuiIunsvOsjwAobSQT7+Ui0ruwiD3gOp4HVI2J9UtBIFXlIf8Ylzwr9XQVCZZjE0Rx8C/4EH6RABkAgDGDkNhKXA/zKSSITzA7ACv02yhwgLpSWQ+4pwmgvZQ1i89GgEiFAPgEQYQIaFn6D6Tjv0u6FF2JdDhCXJy8EPlhHheuKVGmISV9LCQA1BKs+dltpdiUlJUO6lGium+TzwH0EivHMmnIbGdSHpjm2vHV7pza5bmMN9RWgygWVJ8aubm/vOhJV8Ta0HJTUlx7AIJnPUP+p3v6NZpkRIi4i/kPwLaGNyCz0FSmiR0dFnU60HWPwpZPdUaSHjqpaE4+WOhtEiNkdpKbMJtl6ZHwDiJbCNklv35D29iVjGFoBKAes6UXb7HAy1OT6xrmysmuFoMt8cGVLYB61uH6vsBfLV7g1IG4cTQ/VH/e1Z/be8GI1llNDBlw7A5Oub8km+/QMhHVLpnEhHNUQGU5OKPIEQBzuPy0dk+QPy8+sGXJtnqwAAAABJRU5ErkJggg==", j8 = styled.div(({ theme: e10 }) => ({ border: `1px solid ${e10.appBorderColor}`, borderRadius: e10.appBorderRadius, padding: "6px 10px", fontSize: 13, lineHeight: "18px" })), U8 = styled.div(({ theme: e10 }) => ({ lineHeight: "18px", position: "relative", borderRadius: 5, display: "block", minWidth: "80%", color: e10.color.warningText, background: e10.background.warning, border: `1px solid ${jo(0.5, e10.color.warningText)}`, padding: 15, margin: 0 })), $8 = styled(L2)(({ theme: e10 }) => ({ color: e10.color.darkest })), W8 = ({ onSkip: e10, runningSecondBuild: t5 }) => react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Make a change to this story"), react_default.createElement(L2, { center: !0, muted: !0, block: !0 }, "In your code, adjust the markup, styling, or assets to see how visual testing works. Don't worry, you can undo it later. Here are a few ideas to get you started.")), react_default.createElement(U, { style: { display: "flex", alignItems: "flex-start", gap: "8px", margin: "10px 0" } }, react_default.createElement(Yn, { style: { margin: 0, alignItems: "center", gap: "10px" } }, react_default.createElement("img", { src: qc, alt: "Color Palette", style: { width: 32, height: 32 } }), "Shift the color palette"), react_default.createElement(Yn, { style: { margin: 0, alignItems: "center", gap: "10px" } }, react_default.createElement("img", { src: Gc, alt: "Embiggen", style: { width: 32, height: 32 } }), " ", "Embiggen the type"), react_default.createElement(Yn, { style: { margin: 0, alignItems: "center", gap: "10px" } }, react_default.createElement("img", { src: Qc, alt: "Layout", style: { width: 32, height: 32 } }), "Change the layout"), react_default.createElement(Yn, { style: { margin: 0, alignItems: "center", gap: "10px" } }, react_default.createElement("img", { src: Wc, alt: "Adjust", style: { width: 32, height: 32 } }), "Adjust the size or scale")), react_default.createElement($e, null, t5 ? react_default.createElement(U8, null, react_default.createElement($8, null, "No changes found in the Storybook you published. Make a UI tweak and try again to continue.")) : react_default.createElement(j8, null, "Awaiting changes..."), react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: e10 }, "Skip walkthrough"))))), q8 = ({ isRunning: e10, setRunningSecondBuild: t5, startBuild: r5, setInitialGitHash: n10, uncommittedHash: a2 }) => react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Changes detected"), react_default.createElement(L2, { center: !0, muted: !0 }, "Time to run your first visual tests to pinpoint the exact changes made to this story.")), react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", disabled: e10, onClick: () => {
    t5(!0), r5(), setTimeout(() => {
      n10(a2);
    }, 1e4);
  } }, react_default.createElement(Ir, null), "Run visual tests")))), G8 = ({ localBuildProgress: e10 }) => react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Running your first test"), react_default.createElement(L2, { center: !0, muted: !0 }, "A new snapshot is being created in a standardized cloud browser. Once complete, you'll be able to pinpoint exactly what changed.")), react_default.createElement(Wr, { localBuildProgress: e10 })))), Yc = ({ isUnchanged: e10, localBuildProgress: t5, ...r5 }) => (be("Onboarding", "CatchAChange"), r5.isRunning && t5 ? react_default.createElement(G8, { localBuildProgress: t5 }) : e10 ? react_default.createElement(W8, { ...r5 }) : react_default.createElement(q8, { ...r5 })), Q8 = styled.div(({ status: e10, theme: t5 }) => ({ position: "relative", display: "inline-flex", border: `1px solid ${e10 === "positive" ? t5.color.green : t5.appBorderColor}`, borderRadius: 5, margin: "15px 15px 0", minHeight: 200, minWidth: 200, maxWidth: 500, img: { display: "block", maxWidth: "100%" }, svg: { position: "absolute", top: -12, left: -12, width: 24, height: 24, padding: 5, color: t5.color.lightest, borderRadius: "50%", backgroundColor: t5.color.green } })), Y8 = styled.div({ width: "100%", margin: 2, background: "white", borderRadius: 3, overflow: "hidden", div: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" } }), ko = ({ backgroundColor: e10, status: t5, thumbnailUrl: r5 }) => react_default.createElement(Q8, { status: t5 }, react_default.createElement(Y8, null, react_default.createElement("div", { style: e10 ? { backgroundColor: e10 } : {} }, react_default.createElement("img", { alt: "Snapshot thumbnail", src: r5 }))), t5 === "positive" && react_default.createElement(Rn, null)), Kc = styled(L2)({ marginBottom: 5 }), J0 = ({ onComplete: e10, onSkip: t5, ranSecondBuild: r5 = !1 }) => {
    be("Onboarding", "CatchAChangeComplete");
    let n10 = pt();
    return react_default.createElement(K, { footer: null }, react_default.createElement(Q, { style: { overflowY: "auto" } }, r5 ? react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Nice. Your stories were saved as test baselines."), react_default.createElement(L2, { center: !0, muted: !0, block: !0 }, "This story was indexed and snapshotted in a standardized cloud browser."), n10.selectedComparison?.headCapture?.captureImage && react_default.createElement(ko, { ...n10.selectedComparison?.headCapture?.captureImage, status: "positive" })), react_default.createElement($e, null, react_default.createElement(Kc, null, "You're ready to start testing!"), react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", onClick: e10 }, "Done"), react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: t5 }, "Skip walkthrough"))) : react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Nice. You ran your first tests!"), react_default.createElement(L2, { center: !0, muted: !0, block: !0 }, "This story was indexed and snapshotted in a standardized cloud browser and changes were found."), n10.selectedComparison?.headCapture?.captureImage && react_default.createElement(ko, { ...n10.selectedComparison?.headCapture?.captureImage, status: "positive" })), react_default.createElement($e, null, react_default.createElement(Kc, null, "It's time to review changes!"), react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", onClick: e10 }, "Take a tour"), react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: t5 }, "Skip walkthrough")))));
  }, Xc = () => react_default.createElement("div", null, react_default.createElement(W2, null, "Get started with visual testing"), react_default.createElement(L2, { center: !0, muted: !0 }, 'Take an image snapshot of your stories to save their "last known good state" as test baselines.')), e22 = ({ isRunning: e10, localBuildProgress: t5, startBuild: r5, onSkip: n10 }) => (be("Onboarding", "InitialBuild"), react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, t5 ? react_default.createElement(U, null, react_default.createElement(Xc, null), react_default.createElement(Wr, { localBuildProgress: t5 })) : react_default.createElement(U, null, react_default.createElement(Xc, null), react_default.createElement($e, null, react_default.createElement(J, { ariaLabel: !1, disabled: e10, size: "medium", variant: "solid", onClick: r5 }, "Take snapshots"), react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: n10 }, "Skip walkthrough")))))), X8 = styled(L2)({ marginBottom: 5 }), t2 = ({ onCatchAChange: e10, onSkip: t5 }) => {
    be("Onboarding", "InitialBuildComplete");
    let r5 = pt();
    return react_default.createElement(K, { footer: null }, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Nice. Your stories were saved as test baselines."), react_default.createElement(L2, { center: !0, muted: !0, block: !0 }, "This story was indexed and snapshotted in a standardized cloud browser."), r5?.selectedComparison?.headCapture?.captureImage && react_default.createElement(ko, { ...r5?.selectedComparison?.headCapture.captureImage, status: "positive" })), react_default.createElement($e, null, react_default.createElement(X8, { muted: !0 }, "Let's see the superpower of catching visual changes."), react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", onClick: e10 }, "Catch a UI change"), react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: t5 }, "Skip walkthrough")))));
  }, r2 = ({ dismissBuildError: e10, localBuildProgress: t5, showInitialBuildScreen: r5, gitInfo: n10, lastBuildHasChangesForStory: a2, onComplete: o10, onSkip: i10 }) => {
    let { isRunning: l2, startBuild: d3 } = sr(), [u3, c10] = Oe("showInitialBuild", r5);
    useEffect(() => {
      r5 && c10(!0);
    }, [r5, c10]);
    let [p5, f4] = Oe("showCatchAChange", !u3), [m8, h2] = Oe("initialGitHash", n10.uncommittedHash), g3 = () => {
      h2(n10.uncommittedHash), f4(!0);
    }, [w2, y10] = Oe("runningSecondBuild", !1);
    return t5?.currentStep === "error" ? react_default.createElement(jc, { localBuildProgress: t5 }, react_default.createElement($e, null, react_default.createElement(J, { ariaLabel: !1, variant: "solid", size: "medium", onClick: d3 }, "Try again"), react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: i10 }, "Skip walkthrough"))) : t5?.currentStep === "limited" ? react_default.createElement(Oi, { billingUrl: t5.errorDetailsUrl, suspensionReason: "EXCEEDED_THRESHOLD" }, react_default.createElement(J, { ariaLabel: !1, link: !0, onClick: e10 }, "Continue")) : u3 && (!t5 || t5 && l2) ? react_default.createElement(e22, { isRunning: l2, localBuildProgress: t5, startBuild: d3, onSkip: i10 }) : t5?.currentStep === "complete" && !p5 && !w2 ? a2 ? react_default.createElement(J0, { onComplete: o10, onSkip: i10 }) : react_default.createElement(t2, { onCatchAChange: g3, onSkip: i10 }) : p5 && !a2 ? react_default.createElement(Yc, { isRunning: l2, isUnchanged: m8 === n10.uncommittedHash, localBuildProgress: t5, onSkip: i10, runningSecondBuild: w2, setInitialGitHash: h2, setRunningSecondBuild: y10, startBuild: d3, uncommittedHash: n10.uncommittedHash }) : a2 ? react_default.createElement(J0, { onComplete: o10, onSkip: i10, ranSecondBuild: p5 && w2 }) : null;
  }, n2 = styled.div(({ theme: e10 }) => ({ background: e10.background.app, padding: "9px 15px", lineHeight: "21px", color: e10.color.defaultText, borderBottom: `1px solid ${e10.appBorderColor}` })), ig = keyframes({ from: { transform: "rotate(0deg)" }, to: { transform: "rotate(359deg)" } }), sg = styled(Fo)({ animation: `${ig} 1s linear infinite` }), n1 = { width: 10, marginRight: 8 }, o2 = styled.div(({ isWarning: e10, onClick: t5, theme: r5 }) => {
    let n10 = r5.base === "light" ? r5.background.warning : "#2e271a";
    return { position: "relative", display: "flex", width: "100%", lineHeight: "20px", padding: "5px 7px 5px 15px", justifyContent: "space-between", alignItems: "center", background: e10 ? n10 : r5.background.app, border: "none", borderBottom: `1px solid ${r5.appBorderColor}`, color: r5.color.defaultText, cursor: t5 ? "pointer" : "default", textAlign: "left", "& > *": { zIndex: 1 }, code: { fontFamily: r5.typography.fonts.mono, fontSize: "12px" } };
  }), i2 = styled.div(({ isWarning: e10, percentage: t5, theme: r5 }) => {
    let n10 = r5.base === "light" ? "#FFE6B1" : "#43361f";
    return { display: "block", position: "absolute", top: "0", height: "100%", left: "0", width: `${t5}%`, transition: "width 3s ease-out", backgroundColor: e10 ? n10 : r5.background.hoverable, pointerEvents: "none", zIndex: 0 };
  }), a1 = styled.div({ lineHeight: "21px", padding: "4px 0" }), lg = styled(Ns)({ transition: "transform 0.1s ease-in-out" }), dg = styled.div(({ expanded: e10, theme: t5 }) => ({ display: "grid", gridTemplateRows: e10 ? "1fr" : "0fr", background: t5.background.app, borderBottom: e10 ? `1px solid ${t5.appBorderColor}` : "none", transition: "grid-template-rows 150ms ease-out" })), ug = styled.div(({ theme: e10 }) => ({ whiteSpace: "nowrap", overflow: "hidden", color: e10.base === "light" ? e10.color.dark : e10.color.lightest })), cg = styled.div(({ isCurrent: e10, isFailed: t5, isPending: r5, theme: n10 }) => ({ display: "flex", flexDirection: "row", gap: 8, opacity: r5 ? 0.7 : 1, color: t5 ? n10.color.negativeText : "inherit", fontWeight: e10 || t5 ? "bold" : "normal", fontFamily: "Menlo, monospace", fontSize: 12, lineHeight: "24px", margin: "0 15px", "&:first-of-type": { marginTop: 10 }, "&:last-of-type": { marginBottom: 10 }, "& > div": { display: "flex", alignItems: "center" } })), pg = ({ localBuildProgress: e10, expanded: t5 = !1 }) => {
    let r5 = useRef({});
    useEffect(() => {
      r5.current[e10.currentStep] = { ...e10 };
    }, [e10]);
    let n10 = ["aborted", "error"].includes(e10.currentStep), a2 = e1.map((o10) => {
      let { startedAt: i10, completedAt: l2 } = e10.stepProgress[o10], d3 = !!i10 && !l2, u3 = d3 && n10, c10 = !i10, p5 = { ..._a[o10], isCurrent: d3, isFailed: u3, isPending: c10 };
      return u3 ? { ...p5, icon: react_default.createElement(Bt, { style: n1 }), renderLabel: p5.renderProgress } : d3 ? { ...p5, icon: react_default.createElement(sg, { style: n1 }), renderLabel: p5.renderProgress } : c10 ? { ...p5, icon: react_default.createElement(Os, { style: n1 }), renderLabel: p5.renderName } : { ...p5, icon: react_default.createElement(Rn, { style: n1 }), renderLabel: p5.renderComplete };
    });
    return react_default.createElement(dg, { expanded: t5 }, react_default.createElement(ug, null, a2.map(({ icon: o10, isCurrent: i10, isFailed: l2, isPending: d3, key: u3, renderLabel: c10 }) => react_default.createElement(cg, { isCurrent: i10, isFailed: l2, isPending: d3, key: u3 }, react_default.createElement("div", null, o10, c10(r5.current[u3] || e10))))));
  }, s2 = ({ branch: e10, dismissBuildError: t5, localBuildProgress: r5, lastBuildOnBranchInProgress: n10, switchToLastBuildOnBranch: a2 }) => {
    let [o10, i10] = react_default.useState(!1), l2 = () => {
      i10(!o10);
    };
    if (r5) {
      let u3 = r5.currentStep === "aborted", c10 = r5.currentStep === "error", p5 = u3 || c10;
      return react_default.createElement(react_default.Fragment, null, react_default.createElement(o2, { onClick: c10 ? void 0 : l2, isWarning: p5 }, react_default.createElement(i2, { percentage: r5.buildProgressPercentage, isWarning: p5 }), react_default.createElement(a1, null, react_default.createElement(t1, { localBuildProgress: r5, withEmoji: !0 })), c10 ? react_default.createElement(ActionList.Button, { ariaLabel: "Dismiss", onClick: t5, size: "small" }, react_default.createElement(Hn, null)) : react_default.createElement(ActionList.Button, { ariaLabel: `${o10 ? "Collapse" : "Expand"} build progress`, onClick: c10 ? void 0 : l2, size: "small" }, react_default.createElement(lg, { style: { transform: `rotate(${o10 ? -180 : 0}deg)` } }))), react_default.createElement(pg, { localBuildProgress: r5, expanded: o10 || c10 }));
    }
    function d3() {
      return a2 ? n10 ? react_default.createElement(a1, null, "Reviewing is disabled because there's a newer build in progress on", " ", react_default.createElement(Fe, null, e10), ". This can happen when a build runs in CI.") : react_default.createElement(a1, null, "There's a newer snapshot with changes.", " ", react_default.createElement(Link, { withArrow: !0, onClick: a2 }, "Switch to newer snapshot")) : react_default.createElement(a1, null, "Reviewing is disabled because there's a newer build on ", react_default.createElement(Fe, null, e10), ".");
    }
    return react_default.createElement(o2, { onClick: a2 }, react_default.createElement(i2, { percentage: 100 }), d3());
  }, d2 = { isReviewing: !1, userCanReview: !1, buildIsReviewable: !1, acceptTest: (e10, t5 = "SPEC") => Promise.resolve(), unacceptTest: (e10, t5 = "SPEC") => Promise.resolve() }, u2 = createContext(d2), o1 = () => Ze(u2, "ReviewTest"), c2 = ({ children: e10, watchState: t5 = d2 }) => react_default.createElement(u2.Provider, { value: t5 }, e10), gg = styled.div(({ theme: e10 }) => ({ position: "relative", display: "flex", background: "transparent", overflow: "hidden", margin: 2, maxWidth: "calc(100% - 4px)", "& > div": { display: "flex", flexDirection: "column", alignItems: "center", width: "100%", p: { maxWidth: 380, textAlign: "center" }, svg: { width: 24, height: 24 } }, "& > svg": { position: "absolute", left: "calc(50% - 14px)", top: "calc(50% - 14px)", width: 20, height: 20, color: e10.color.lightest, opacity: 0, transition: "opacity 0.1s ease-in-out", pointerEvents: "none" } }), ({ href: e10 }) => e10 && { display: "inline-flex", cursor: "pointer", "&:hover": { "& > svg": { opacity: 1 }, img: { filter: "brightness(85%)" } } }), p2 = styled.div(({ isVisible: e10 }) => ({ position: e10 ? "static" : "absolute", visibility: e10 ? "visible" : "hidden", maxWidth: "100%", minHeight: 100 })), i1 = styled.img({ display: "block", width: "100%", height: "auto", transition: "filter 0.1s ease-in-out, opacity 0.1s ease-in-out", "&[data-overlay]": { position: "absolute", opacity: 0.7, pointerEvents: "none", transition: "opacity 0.1s ease-in-out" } }), vg = styled(U)({ margin: "30px 15px" }), yg = ({ comparisonImageLoaded: e10, focusImageLoaded: t5, showDiff: r5, showFocus: n10 }) => r5 && n10 ? e10 && t5 : r5 ? e10 : n10 ? t5 : !0, f2 = ({ componentName: e10, storyName: t5, testUrl: r5, comparisonResult: n10, latestImage: a2, baselineImage: o10, baselineImageVisible: i10, diffImage: l2, focusImage: d3, diffVisible: u3, focusVisible: c10, ...p5 }) => {
    let f4 = useTheme(), m8 = !!a2 && !!l2 && n10 === "CHANGED", h2 = n10 === "CAPTURE_ERROR", g3 = m8 && !!d3, w2 = m8 ? { as: "a", href: r5, target: "_blank", title: "View on Chromatic.com" } : {}, y10 = m8 && u3, v5 = g3 && c10, [C3, b8] = react_default.useState(!1), [I, x2] = react_default.useState(!1), [D, le] = react_default.useState(!1), [Te, we] = react_default.useState(!1), lt = i10 ? I : C3, ft = yg({ comparisonImageLoaded: D, focusImageLoaded: Te, showDiff: y10, showFocus: v5 });
    return react_default.createElement(gg, { ...p5, ...w2 }, a2 && react_default.createElement(p2, { isVisible: !o10 || !i10, style: { aspectRatio: `${a2.imageWidth} / ${a2.imageHeight}`, width: a2.imageWidth } }, (!C3 || !ft) && react_default.createElement(ja, null), react_default.createElement(i1, { alt: `Latest snapshot for the '${t5}' story of the '${e10}' component`, src: a2.imageUrl, style: { opacity: C3 ? 1 : 0 }, onLoad: () => b8(!0) })), o10 && react_default.createElement(p2, { isVisible: i10, style: { aspectRatio: `${o10.imageWidth} / ${o10.imageHeight}`, width: o10.imageWidth } }, (!I || !ft) && react_default.createElement(ja, null), react_default.createElement(i1, { alt: `Baseline snapshot for the '${t5}' story of the '${e10}' component`, src: o10.imageUrl, style: { opacity: I ? 1 : 0 }, onLoad: () => x2(!0) })), m8 && lt && react_default.createElement(i1, { alt: "", "data-overlay": "diff", src: l2.imageUrl, style: { width: l2.imageWidth, maxWidth: `${l2.imageWidth / a2.imageWidth * 100}%`, opacity: y10 && D ? 0.7 : 0 }, onLoad: () => le(!0) }), g3 && lt && react_default.createElement(i1, { alt: "", "data-overlay": "focus", src: d3.imageUrl, style: { width: d3.imageWidth, maxWidth: `${d3.imageWidth / a2.imageWidth * 100}%`, opacity: v5 && Te ? 0.7 : 0, filter: v5 ? "blur(2px)" : "none" }, onLoad: () => we(!0) }), m8 && react_default.createElement(Bs, null), h2 && !a2 && react_default.createElement(vg, null, react_default.createElement(ms, { color: f4.base === "light" ? "currentColor" : f4.color.medium }), react_default.createElement(L2, { center: !0, muted: !0 }, "A snapshot couldn't be captured. This often occurs when a story has a code error. Confirm that this story successfully renders in your local Storybook and run the build again.")));
  }, m2 = (e10) => react_default.createElement("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...e10 }, react_default.createElement("circle", { cx: "8.00009", cy: "7.99997", r: "7.7037", fill: "url(#paint0_linear_466_21186)" }), react_default.createElement("ellipse", { cx: "8.00094", cy: "8.00094", rx: "7.06173", ry: "7.06173", fill: "url(#paint1_radial_466_21186)" }), react_default.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.07134 1.36353C8.03043 1.36353 7.99727 1.39669 7.99727 1.4376V2.56469C7.99727 2.6056 8.03043 2.63877 8.07134 2.63877C8.11225 2.63877 8.14542 2.6056 8.14542 2.56469V1.4376C8.14542 1.39669 8.11225 1.36353 8.07134 1.36353ZM8.07134 14.7792C8.11225 14.7792 8.14542 14.746 8.14542 14.7051V13.578C8.14542 13.5371 8.11225 13.5039 8.07134 13.5039C8.03043 13.5039 7.99727 13.5371 7.99727 13.578V14.7051C7.99727 14.746 8.03043 14.7792 8.07134 14.7792ZM8.64883 1.46214C8.65292 1.42143 8.68923 1.39175 8.72994 1.39584C8.77064 1.39993 8.80032 1.43625 8.79623 1.47695L8.74793 1.95766C8.74384 1.99836 8.70752 2.02804 8.66682 2.02395C8.62612 2.01986 8.59643 1.98355 8.60052 1.94284L8.64883 1.46214ZM7.41372 14.7468C7.45442 14.7509 7.49074 14.7213 7.49483 14.6806L7.54313 14.1998C7.54722 14.1591 7.51754 14.1228 7.47683 14.1187C7.43613 14.1146 7.39982 14.1443 7.39573 14.185L7.34742 14.6657C7.34333 14.7064 7.37301 14.7428 7.41372 14.7468ZM14.7051 7.99727C14.746 7.99727 14.7792 8.03043 14.7792 8.07134C14.7792 8.11225 14.746 8.14542 14.7051 8.14542H13.578C13.5371 8.14542 13.5039 8.11225 13.5039 8.07134C13.5039 8.03043 13.5371 7.99727 13.578 7.99727H14.7051ZM1.36353 8.07134C1.36353 8.11225 1.39669 8.14542 1.4376 8.14542H2.56469C2.6056 8.14542 2.63877 8.11225 2.63877 8.07134C2.63877 8.03043 2.6056 7.99727 2.56469 7.99727H1.4376C1.39669 7.99727 1.36353 8.03043 1.36353 8.07134ZM14.6806 8.64883C14.7213 8.65292 14.7509 8.68923 14.7468 8.72994C14.7428 8.77064 14.7064 8.80032 14.6657 8.79623L14.185 8.74793C14.1443 8.74384 14.1146 8.70752 14.1187 8.66682C14.1228 8.62612 14.1591 8.59643 14.1998 8.60052L14.6806 8.64883ZM1.39584 7.41372C1.39175 7.45442 1.42143 7.49074 1.46214 7.49483L1.94284 7.54313C1.98355 7.54722 2.01986 7.51754 2.02395 7.47683C2.02804 7.43613 1.99836 7.39982 1.95766 7.39573L1.47695 7.34742C1.43625 7.34333 1.39993 7.37301 1.39584 7.41372ZM12.7097 3.3282C12.7387 3.29927 12.7856 3.29927 12.8145 3.3282C12.8434 3.35713 12.8434 3.40403 12.8145 3.43296L12.0175 4.22994C11.9886 4.25887 11.9417 4.25887 11.9127 4.22994C11.8838 4.20101 11.8838 4.15411 11.9127 4.12518L12.7097 3.3282ZM3.3282 12.8145C3.35713 12.8434 3.40403 12.8434 3.43296 12.8145L4.22994 12.0175C4.25887 11.9886 4.25887 11.9417 4.22994 11.9127C4.20101 11.8838 4.15411 11.8838 4.12518 11.9127L3.3282 12.7097C3.29927 12.7387 3.29927 12.7856 3.3282 12.8145ZM13.1523 3.80568C13.1839 3.77973 13.2306 3.78433 13.2566 3.81595C13.2825 3.84757 13.2779 3.89425 13.2463 3.9202L12.8729 4.22664C12.8413 4.2526 12.7946 4.248 12.7686 4.21638C12.7427 4.18475 12.7473 4.13808 12.7789 4.11212L13.1523 3.80568ZM2.88614 12.3267C2.91209 12.3584 2.95876 12.363 2.99039 12.337L3.36378 12.0306C3.3954 12.0046 3.4 11.9579 3.37404 11.9263C3.34809 11.8947 3.30142 11.8901 3.26979 11.916L2.8964 12.2225C2.86478 12.2484 2.86018 12.2951 2.88614 12.3267ZM12.8145 12.7097C12.8434 12.7387 12.8434 12.7856 12.8145 12.8145C12.7856 12.8434 12.7387 12.8434 12.7097 12.8145L11.9127 12.0175C11.8838 11.9886 11.8838 11.9417 11.9127 11.9127C11.9417 11.8838 11.9886 11.8838 12.0175 11.9127L12.8145 12.7097ZM3.3282 3.3282C3.29927 3.35713 3.29927 3.40403 3.3282 3.43296L4.12518 4.22994C4.15411 4.25887 4.20101 4.25887 4.22994 4.22994C4.25887 4.20101 4.25887 4.15411 4.22994 4.12518L3.43296 3.3282C3.40403 3.29927 3.35713 3.29927 3.3282 3.3282ZM12.337 13.1523C12.363 13.1839 12.3584 13.2306 12.3267 13.2566C12.2951 13.2825 12.2484 13.2779 12.2225 13.2463L11.916 12.8729C11.8901 12.8413 11.8947 12.7946 11.9263 12.7686C11.9579 12.7427 12.0046 12.7473 12.0306 12.7789L12.337 13.1523ZM3.81595 2.88614C3.78433 2.91209 3.77973 2.95876 3.80568 2.99039L4.11212 3.36378C4.13808 3.3954 4.18475 3.4 4.21638 3.37404C4.248 3.34809 4.2526 3.30142 4.22664 3.26979L3.9202 2.8964C3.89425 2.86478 3.84757 2.86018 3.81595 2.88614ZM10.5415 1.91422C10.5572 1.87643 10.6005 1.85848 10.6383 1.87413C10.6761 1.88979 10.6941 1.93312 10.6784 1.97092L10.2471 3.01221C10.2314 3.05 10.1881 3.06795 10.1503 3.05229C10.1125 3.03664 10.0946 2.99331 10.1102 2.95551L10.5415 1.91422ZM5.50437 14.2686C5.54216 14.2842 5.58549 14.2663 5.60115 14.2285L6.03247 13.1872C6.04813 13.1494 6.03018 13.1061 5.99238 13.0904C5.95459 13.0747 5.91126 13.0927 5.8956 13.1305L5.46428 14.1718C5.44862 14.2096 5.46657 14.2529 5.50437 14.2686ZM11.1332 2.18598C11.1524 2.1499 11.1973 2.13628 11.2334 2.15557C11.2695 2.17486 11.2831 2.21974 11.2638 2.25582L11.0361 2.68183C11.0168 2.7179 10.9719 2.73152 10.9358 2.71223C10.8998 2.69295 10.8861 2.64806 10.9054 2.61199L11.1332 2.18598ZM4.90931 13.9871C4.94539 14.0064 4.99027 13.9928 5.00955 13.9567L5.23726 13.5307C5.25654 13.4946 5.24293 13.4497 5.20685 13.4305C5.17077 13.4112 5.12589 13.4248 5.1066 13.4609L4.8789 13.8869C4.85961 13.923 4.87323 13.9678 4.90931 13.9871ZM14.2285 10.5415C14.2663 10.5572 14.2842 10.6005 14.2686 10.6383C14.2529 10.6761 14.2096 10.6941 14.1718 10.6784L13.1305 10.2471C13.0927 10.2314 13.0747 10.1881 13.0904 10.1503C13.1061 10.1125 13.1494 10.0946 13.1872 10.1102L14.2285 10.5415ZM1.87412 5.50437C1.85846 5.54216 1.87641 5.58549 1.91421 5.60115L2.95551 6.03247C2.99331 6.04813 3.03664 6.03018 3.05229 5.99238C3.06795 5.95459 3.05 5.91126 3.0122 5.8956L1.9709 5.46428C1.9331 5.44862 1.88977 5.46657 1.87412 5.50437ZM13.9567 11.1332C13.9928 11.1524 14.0064 11.1973 13.9871 11.2334C13.9678 11.2695 13.923 11.2831 13.8869 11.2638L13.4609 11.0361C13.4248 11.0168 13.4112 10.9719 13.4305 10.9358C13.4497 10.8998 13.4946 10.8861 13.5307 10.9054L13.9567 11.1332ZM2.15557 4.90929C2.13628 4.94537 2.1499 4.99025 2.18598 5.00954L2.61199 5.23726C2.64806 5.25654 2.69295 5.24293 2.71223 5.20685C2.73152 5.17077 2.7179 5.12589 2.68183 5.1066L2.25582 4.87888C2.21974 4.8596 2.17486 4.87321 2.15557 4.90929ZM14.1718 5.46428C14.2096 5.44862 14.2529 5.46657 14.2686 5.50437C14.2842 5.54216 14.2663 5.58549 14.2285 5.60115L13.1872 6.03247C13.1494 6.04813 13.1061 6.03018 13.0904 5.99238C13.0747 5.95459 13.0927 5.91126 13.1305 5.8956L14.1718 5.46428ZM1.87413 10.6383C1.88979 10.6761 1.93312 10.6941 1.97092 10.6784L3.01221 10.2471C3.05 10.2314 3.06795 10.1881 3.05229 10.1503C3.03664 10.1125 2.99331 10.0946 2.95551 10.1102L1.91422 10.5415C1.87643 10.5572 1.85848 10.6005 1.87413 10.6383ZM14.3979 6.07477C14.4371 6.0629 14.4785 6.08501 14.4903 6.12416C14.5022 6.1633 14.4801 6.20467 14.441 6.21654L13.9787 6.35677C13.9396 6.36864 13.8982 6.34654 13.8863 6.30739C13.8744 6.26824 13.8965 6.22688 13.9357 6.215L14.3979 6.07477ZM1.65237 10.0185C1.66425 10.0577 1.70561 10.0798 1.74476 10.0679L2.20699 9.92769C2.24614 9.91581 2.26825 9.87445 2.25637 9.8353C2.2445 9.79615 2.20313 9.77404 2.16399 9.78592L1.70175 9.92615C1.6626 9.93802 1.64049 9.97939 1.65237 10.0185ZM10.6383 14.2686C10.6005 14.2842 10.5572 14.2663 10.5415 14.2285L10.1102 13.1872C10.0946 13.1494 10.1125 13.1061 10.1503 13.0904C10.1881 13.0747 10.2314 13.0927 10.2471 13.1305L10.6784 14.1718C10.6941 14.2096 10.6761 14.2529 10.6383 14.2686ZM5.50437 1.87413C5.46657 1.88979 5.44862 1.93312 5.46428 1.97092L5.8956 3.01221C5.91126 3.05 5.95459 3.06795 5.99238 3.05229C6.03018 3.03664 6.04813 2.99331 6.03247 2.95551L5.60115 1.91422C5.58549 1.87643 5.54216 1.85848 5.50437 1.87413ZM10.0679 14.3979C10.0798 14.4371 10.0577 14.4785 10.0185 14.4903C9.97939 14.5022 9.93802 14.4801 9.92615 14.441L9.78592 13.9787C9.77404 13.9396 9.79615 13.8982 9.8353 13.8863C9.87445 13.8744 9.91581 13.8965 9.92769 13.9357L10.0679 14.3979ZM6.12417 1.65237C6.08502 1.66424 6.06291 1.70561 6.07479 1.74475L6.215 2.20699C6.22688 2.24614 6.26824 2.26825 6.30739 2.25637C6.34654 2.2445 6.36864 2.20314 6.35677 2.16399L6.21656 1.70175C6.20468 1.6626 6.16332 1.64049 6.12417 1.65237ZM9.29287 1.55062C9.30085 1.5105 9.33985 1.48444 9.37997 1.49242C9.4201 1.5004 9.44615 1.5394 9.43817 1.57952L9.21829 2.68496C9.21031 2.72508 9.17131 2.75114 9.13119 2.74316C9.09107 2.73518 9.06501 2.69618 9.07299 2.65606L9.29287 1.55062ZM6.76272 14.6503C6.80284 14.6583 6.84184 14.6322 6.84982 14.5921L7.0697 13.4866C7.07768 13.4465 7.05162 13.4075 7.0115 13.3995C6.97137 13.3916 6.93238 13.4176 6.9244 13.4577L6.70452 14.5632C6.69654 14.6033 6.72259 14.6423 6.76272 14.6503ZM9.92615 1.70175C9.93802 1.6626 9.97939 1.64049 10.0185 1.65237C10.0577 1.66425 10.0798 1.70561 10.0679 1.74476L9.92769 2.20699C9.91581 2.24614 9.87445 2.26825 9.8353 2.25637C9.79615 2.2445 9.77404 2.20313 9.78592 2.16399L9.92615 1.70175ZM6.12417 14.4903C6.16332 14.5022 6.20469 14.4801 6.21656 14.441L6.35677 13.9787C6.36864 13.9396 6.34653 13.8982 6.30739 13.8863C6.26824 13.8744 6.22687 13.8965 6.215 13.9357L6.07479 14.398C6.06291 14.4371 6.08502 14.4785 6.12417 14.4903ZM14.5921 9.29287C14.6322 9.30085 14.6583 9.33985 14.6503 9.37997C14.6423 9.4201 14.6033 9.44615 14.5632 9.43817L13.4577 9.21829C13.4176 9.21031 13.3916 9.17131 13.3995 9.13119C13.4075 9.09107 13.4465 9.06501 13.4866 9.07299L14.5921 9.29287ZM1.49242 6.76272C1.48444 6.80284 1.5105 6.84184 1.55062 6.84982L2.65606 7.0697C2.69618 7.07768 2.73518 7.05162 2.74316 7.0115C2.75114 6.97137 2.72508 6.93238 2.68496 6.9244L1.57952 6.70452C1.5394 6.69654 1.5004 6.72259 1.49242 6.76272ZM14.441 9.92615C14.4801 9.93802 14.5022 9.97939 14.4903 10.0185C14.4785 10.0577 14.4371 10.0798 14.3979 10.0679L13.9357 9.92769C13.8965 9.91581 13.8744 9.87445 13.8863 9.8353C13.8982 9.79615 13.9396 9.77404 13.9787 9.78592L14.441 9.92615ZM1.65237 6.12415C1.64049 6.1633 1.6626 6.20467 1.70175 6.21654L2.16399 6.35677C2.20313 6.36864 2.2445 6.34654 2.25637 6.30739C2.26825 6.26824 2.24614 6.22688 2.20699 6.215L1.74476 6.07477C1.70561 6.0629 1.66425 6.08501 1.65237 6.12415ZM13.5459 4.32424C13.58 4.30151 13.626 4.31066 13.6487 4.34468C13.6714 4.37869 13.6623 4.42469 13.6282 4.44742L12.6911 5.0736C12.6571 5.09633 12.6111 5.08718 12.5884 5.05317C12.5656 5.01915 12.5748 4.97315 12.6088 4.95042L13.5459 4.32424ZM2.494 11.798C2.51673 11.832 2.56273 11.8412 2.59675 11.8184L3.53389 11.1923C3.56791 11.1695 3.57706 11.1235 3.55433 11.0895C3.5316 11.0555 3.4856 11.0464 3.45159 11.0691L2.51444 11.6953C2.48043 11.718 2.47128 11.764 2.494 11.798ZM13.8869 4.87888C13.923 4.8596 13.9678 4.87321 13.9871 4.90929C14.0064 4.94537 13.9928 4.99025 13.9567 5.00954L13.5307 5.23726C13.4946 5.25654 13.4497 5.24293 13.4305 5.20685C13.4112 5.17077 13.4248 5.12589 13.4609 5.1066L13.8869 4.87888ZM2.15557 11.2334C2.17486 11.2695 2.21974 11.2831 2.25582 11.2638L2.68183 11.0361C2.7179 11.0168 2.73152 10.9719 2.71223 10.9358C2.69295 10.8998 2.64806 10.8861 2.61199 10.9054L2.18598 11.1332C2.1499 11.1524 2.13628 11.1973 2.15557 11.2334ZM11.8184 13.5459C11.8412 13.58 11.832 13.626 11.798 13.6487C11.764 13.6714 11.718 13.6623 11.6953 13.6282L11.0691 12.6911C11.0464 12.6571 11.0555 12.6111 11.0895 12.5884C11.1235 12.5656 11.1695 12.5748 11.1923 12.6088L11.8184 13.5459ZM4.34468 2.494C4.31066 2.51673 4.30151 2.56273 4.32424 2.59675L4.95042 3.53389C4.97315 3.56791 5.01915 3.57706 5.05317 3.55433C5.08718 3.5316 5.09633 3.4856 5.0736 3.45159L4.44742 2.51444C4.42469 2.48043 4.37869 2.47128 4.34468 2.494ZM11.2638 13.8869C11.2831 13.923 11.2695 13.9678 11.2334 13.9871C11.1973 14.0064 11.1524 13.9928 11.1331 13.9567L10.9054 13.5307C10.8861 13.4946 10.8998 13.4497 10.9358 13.4305C10.9719 13.4112 11.0168 13.4248 11.0361 13.4609L11.2638 13.8869ZM4.90931 2.15557C4.87323 2.17485 4.85961 2.21974 4.8789 2.25581L5.1066 2.68182C5.12589 2.7179 5.17077 2.73152 5.20685 2.71223C5.24293 2.69295 5.25654 2.64807 5.23726 2.61199L5.00955 2.18598C4.99027 2.1499 4.94539 2.13628 4.90931 2.15557ZM11.6953 2.51444C11.718 2.48043 11.764 2.47128 11.798 2.494C11.832 2.51673 11.8412 2.56273 11.8184 2.59675L11.1923 3.53389C11.1695 3.56791 11.1235 3.57706 11.0895 3.55433C11.0555 3.5316 11.0464 3.4856 11.0691 3.45159L11.6953 2.51444ZM4.34468 13.6487C4.37869 13.6714 4.42469 13.6623 4.44742 13.6282L5.0736 12.6911C5.09633 12.6571 5.08718 12.6111 5.05317 12.5884C5.01915 12.5656 4.97315 12.5748 4.95042 12.6088L4.32424 13.5459C4.30151 13.58 4.31066 13.626 4.34468 13.6487ZM12.2225 2.8964C12.2484 2.86478 12.2951 2.86018 12.3267 2.88614C12.3584 2.91209 12.363 2.95876 12.337 2.99039L12.0306 3.36378C12.0046 3.3954 11.9579 3.4 11.9263 3.37404C11.8947 3.34809 11.8901 3.30142 11.916 3.26979L12.2225 2.8964ZM3.81595 13.2566C3.84757 13.2825 3.89425 13.2779 3.9202 13.2463L4.22664 12.8729C4.2526 12.8413 4.248 12.7946 4.21638 12.7686C4.18475 12.7427 4.13808 12.7473 4.11212 12.7789L3.80568 13.1523C3.77973 13.1839 3.78433 13.2306 3.81595 13.2566ZM13.6282 11.6953C13.6623 11.718 13.6714 11.764 13.6487 11.798C13.626 11.832 13.58 11.8412 13.5459 11.8184L12.6088 11.1923C12.5748 11.1695 12.5656 11.1235 12.5884 11.0895C12.6111 11.0555 12.6571 11.0464 12.6911 11.0691L13.6282 11.6953ZM2.494 4.34468C2.47128 4.37869 2.48043 4.42469 2.51444 4.44742L3.45159 5.0736C3.4856 5.09633 3.5316 5.08718 3.55433 5.05317C3.57706 5.01915 3.56791 4.97315 3.53389 4.95042L2.59675 4.32424C2.56273 4.30151 2.51673 4.31066 2.494 4.34468ZM13.2463 12.2225C13.2779 12.2484 13.2825 12.2951 13.2566 12.3267C13.2306 12.3584 13.1839 12.363 13.1523 12.337L12.7789 12.0306C12.7473 12.0046 12.7427 11.9579 12.7686 11.9263C12.7946 11.8947 12.8413 11.8901 12.8729 11.916L13.2463 12.2225ZM2.88614 3.81595C2.86018 3.84757 2.86478 3.89425 2.8964 3.9202L3.26979 4.22664C3.30142 4.2526 3.34809 4.248 3.37404 4.21638C3.4 4.18475 3.3954 4.13808 3.36378 4.11212L2.99039 3.80568C2.95876 3.77973 2.91209 3.78433 2.88614 3.81595ZM14.5632 6.70452C14.6033 6.69654 14.6423 6.72259 14.6503 6.76272C14.6583 6.80284 14.6322 6.84184 14.5921 6.84982L13.4866 7.0697C13.4465 7.07768 13.4075 7.05162 13.3995 7.0115C13.3916 6.97137 13.4176 6.93238 13.4577 6.9244L14.5632 6.70452ZM1.49242 9.37997C1.5004 9.4201 1.5394 9.44615 1.57952 9.43817L2.68496 9.21829C2.72508 9.21031 2.75114 9.17131 2.74316 9.13119C2.73518 9.09107 2.69618 9.06501 2.65606 9.07299L1.55062 9.29287C1.5105 9.30085 1.48444 9.33985 1.49242 9.37997ZM14.6657 7.34742C14.7064 7.34333 14.7428 7.37301 14.7468 7.41372C14.7509 7.45442 14.7213 7.49074 14.6806 7.49483L14.1998 7.54313C14.1591 7.54722 14.1228 7.51754 14.1187 7.47683C14.1146 7.43613 14.1443 7.39982 14.185 7.39573L14.6657 7.34742ZM1.39584 8.72994C1.39993 8.77064 1.43625 8.80032 1.47695 8.79623L1.95766 8.74793C1.99836 8.74384 2.02804 8.70752 2.02395 8.66682C2.01986 8.62612 1.98355 8.59643 1.94284 8.60052L1.46214 8.64883C1.42143 8.65292 1.39175 8.68923 1.39584 8.72994ZM9.43817 14.5632C9.44615 14.6033 9.4201 14.6423 9.37997 14.6503C9.33985 14.6583 9.30085 14.6322 9.29287 14.5921L9.07299 13.4866C9.06501 13.4465 9.09107 13.4075 9.13119 13.3995C9.17131 13.3916 9.21031 13.4176 9.21829 13.4577L9.43817 14.5632ZM6.76272 1.49242C6.72259 1.5004 6.69654 1.5394 6.70452 1.57952L6.9244 2.68496C6.93238 2.72508 6.97137 2.75114 7.0115 2.74316C7.05162 2.73518 7.07768 2.69618 7.0697 2.65606L6.84982 1.55062C6.84184 1.5105 6.80284 1.48444 6.76272 1.49242ZM8.79623 14.6657C8.80032 14.7064 8.77064 14.7428 8.72994 14.7468C8.68923 14.7509 8.65292 14.7213 8.64883 14.6806L8.60052 14.1998C8.59643 14.1591 8.62612 14.1228 8.66682 14.1187C8.70752 14.1146 8.74384 14.1443 8.74793 14.185L8.79623 14.6657ZM7.41372 1.39584C7.37301 1.39993 7.34333 1.43625 7.34742 1.47695L7.39573 1.95766C7.39982 1.99836 7.43613 2.02804 7.47683 2.02395C7.51754 2.01986 7.54722 1.98355 7.54313 1.94284L7.49483 1.46214C7.49074 1.42143 7.45442 1.39175 7.41372 1.39584Z", fill: "#DDDDDD" }), react_default.createElement("path", { d: "M3.14941 12.8505L7.29562 7.28674L7.99989 7.99218L3.14941 12.8505Z", fill: "#DDDDDD" }), react_default.createElement("path", { d: "M7.28662 7.29574L12.8504 3.14954L7.99204 8.00002L7.28662 7.29574Z", fill: "#EE4444" }), react_default.createElement("path", { d: "M12.8505 3.14954L8.70427 8.71332L8 8.00789L12.8505 3.14954Z", fill: "#CC0000" }), react_default.createElement("path", { d: "M3.14941 12.8505L8.7132 8.70427L8.00777 8L3.14941 12.8505Z", fill: "#AAAAAA" }), react_default.createElement("defs", null, react_default.createElement("linearGradient", { id: "paint0_linear_466_21186", x1: "0.300303", y1: "0.300951", x2: "0.300303", y2: "15.7084", gradientUnits: "userSpaceOnUse" }, react_default.createElement("stop", { stopColor: "#F8F8F8" }), react_default.createElement("stop", { offset: "1", stopColor: "#CCCCCC" })), react_default.createElement("radialGradient", { id: "paint1_radial_466_21186", cx: "0", cy: "0", r: "1", gradientUnits: "userSpaceOnUse", gradientTransform: "translate(8.00216 8.0046) scale(7.06173)" }, react_default.createElement("stop", { stopColor: "#00F0FF" }), react_default.createElement("stop", { offset: "1", stopColor: "#0070E0" })))), g2 = styled.div(({ status: e10, theme: t5 }) => ({ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: e10 && { IN_PROGRESS: "transparent", PASSED: t5.color.positive, PENDING: t5.color.gold, ACCEPTED: t5.color.positive, DENIED: t5.color.positive, BROKEN: t5.color.negative, FAILED: t5.color.negative, SKIPPED: "transparent", EQUAL: t5.color.positive, FIXED: t5.color.positive, ADDED: t5.color.gold, CHANGED: t5.color.gold, REMOVED: t5.color.gold, CAPTURE_ERROR: t5.color.negative, SYSTEM_ERROR: t5.color.negative, positive: t5.color.positive, negative: t5.color.negative, warning: t5.color.gold, notification: t5.color.secondary }[e10] }), ({ overlay: e10, theme: t5 }) => e10 && css({ position: "absolute", top: -1, right: -2, width: 7, height: 7, border: "1px solid rgba(0, 0, 0, 0.1)", boxShadow: `0 0 0 2px var(--bg-color, ${t5.background.bar})`, boxSizing: "border-box" })), l1 = ({ status: e10 }) => react_default.createElement(g2, { status: e10 }), bg = styled.div({ position: "relative", display: "inline-flex", justifyContent: "center", "img, svg": { verticalAlign: "top" } }), d1 = ({ status: e10, children: t5 }) => react_default.createElement(bg, null, t5, react_default.createElement(g2, { overlay: !0, status: e10 })), v2 = { CHROME: react_default.createElement(Ti, { alt: "Chrome" }), FIREFOX: react_default.createElement(Mi, { alt: "Firefox" }), SAFARI: react_default.createElement(Li, { alt: "Safari" }), EDGE: react_default.createElement(m2, { alt: "Edge" }) }, y2 = styled(ActionList.Text)({ display: "none", "@container (min-width: 300px)": { display: "inline-block" } }), xg = styled(ActionList.Text)(({ theme: e10, active: t5 }) => ({ minWidth: 80, color: t5 ? e10.color.secondary : "inherit", fontWeight: t5 ? e10.typography.weight.bold : "inherit" })), b2 = ({ isAccepted: e10, selectedBrowser: t5, browserResults: r5, onSelectBrowser: n10 }) => {
    let a2 = An(r5.map(({ result: l2 }) => l2));
    if (!a2) return null;
    let o10 = v2[t5.key];
    if (!e10 && !["EQUAL", "SKIPPED"].includes(a2) && r5.length >= 2 && (o10 = react_default.createElement(d1, { status: a2 }, o10)), r5.length === 1) return react_default.createElement(ActionList.Button, { readOnly: !0, tooltip: `Tested in ${t5.name}` }, react_default.createElement(ActionList.Icon, null, o10), react_default.createElement(y2, null, t5.name));
    let i10 = r5.map(({ browser: l2, result: d3 }) => ({ id: l2.id, title: l2.name, icon: v2[l2.key], right: !e10 && !["EQUAL", "SKIPPED"].includes(a2) && react_default.createElement(l1, { status: d3 }), onClick: () => n10(l2), active: t5.name === l2.name }));
    return react_default.createElement(PopoverProvider, { padding: 0, popover: ({ onHide: l2 }) => react_default.createElement(ActionList, null, i10.map((d3) => react_default.createElement(ActionList.Item, { key: d3.id }, react_default.createElement(ActionList.Action, { ariaLabel: !1, onClick: () => {
      d3.onClick(), l2();
    } }, react_default.createElement(ActionList.Icon, null, d3.icon), react_default.createElement(xg, { active: d3.active }, d3.title), d3.right && react_default.createElement(ActionList.Icon, null, d3.right))))) }, react_default.createElement(ActionList.Button, { size: "small", ariaLabel: "Switch browser" }, react_default.createElement(ActionList.Icon, null, o10), react_default.createElement(y2, null, t5.name)));
  }, S2 = styled(ActionList.Text)({ display: "none", "@container (min-width: 300px)": { display: "inline-block" } }), kg = styled(ActionList.Text)(({ theme: e10, active: t5 }) => ({ minWidth: 80, color: t5 ? e10.color.secondary : "inherit", fontWeight: t5 ? e10.typography.weight.bold : "inherit" })), C2 = ({ isAccepted: e10, modeOrder: t5, modeResults: r5, onSelectMode: n10, selectedMode: a2 }) => {
    let o10 = An(r5.map(({ result: d3 }) => d3));
    if (!o10) return null;
    let i10 = react_default.createElement(_s, null);
    if (!e10 && !["EQUAL", "SKIPPED"].includes(o10) && r5.length >= 2 && (i10 = react_default.createElement(d1, { status: o10 }, i10)), r5.length === 1) return react_default.createElement(ActionList.Button, { readOnly: !0, tooltip: `View mode: ${a2.name}` }, react_default.createElement(ActionList.Icon, null, i10), react_default.createElement(S2, null, a2.name));
    let l2 = r5.map(({ mode: d3, result: u3 }) => ({ id: d3.name, title: d3.name, right: !e10 && !["EQUAL", "SKIPPED"].includes(o10) && react_default.createElement(l1, { status: u3 }), onClick: () => n10(d3), active: a2.name === d3.name })).sort((d3, u3) => {
      if (!t5) return 0;
      let c10 = t5.indexOf(d3.title), p5 = t5.indexOf(u3.title);
      return c10 !== -1 && p5 !== -1 ? c10 - p5 : 0;
    });
    return react_default.createElement(PopoverProvider, { padding: 0, popover: ({ onHide: d3 }) => react_default.createElement(ActionList, null, l2.map((u3) => react_default.createElement(ActionList.Item, { key: u3.id }, react_default.createElement(ActionList.Action, { ariaLabel: !1, onClick: () => {
      u3.onClick(), d3();
    } }, react_default.createElement(kg, { active: u3.active }, u3.title), u3.right && react_default.createElement(ActionList.Icon, null, u3.right))))) }, react_default.createElement(ActionList.Button, { size: "small", ariaLabel: "Switch mode" }, react_default.createElement(ActionList.Icon, null, i10), react_default.createElement(S2, null, a2.name)));
  }, X0 = () => {
    let e10 = pt(), { browserResults: t5, modeResults: r5 } = e10.summary;
    return react_default.createElement(Kr, null, r5.length > 0 && e10.selectedTest && react_default.createElement(C2, { isAccepted: e10.summary.status === "ACCEPTED", modeOrder: e10.modeOrder, selectedMode: e10.selectedTest.mode, modeResults: r5, onSelectMode: e10.onSelectMode }), t5.length > 0 && e10.selectedComparison && react_default.createElement(b2, { isAccepted: e10.summary.status === "ACCEPTED", selectedBrowser: e10.selectedComparison.browser, browserResults: t5, onSelectBrowser: e10.onSelectBrowser }), react_default.createElement(Ue, { push: !0 }, react_default.createElement(Br, null)));
  }, Fa = styled(ActionList.Button)({ "@container (max-width: 299px)": { height: 28, padding: "0 7px" }, "@container (min-width: 800px)": { height: 28, padding: "0 7px" } }), Pa = styled.div(({ theme: e10 }) => ({ width: 12, height: 12, margin: "3px 6px", verticalAlign: "top", display: "inline-block", animation: `${qo} 0.7s linear infinite`, border: "2px solid transparent", borderLeftColor: e10.base === "light" ? "#00aaff" : "#58faf9", borderBottomColor: "#25ccfd", borderRightColor: e10.base === "light" ? "#58faf9" : "#00aaff", borderRadius: "100%", transform: "translate3d(0, 0, 0)" }), ({ parentComponent: e10 }) => e10 && css({ margin: e10 === "IconButton" ? 1 : 0, borderWidth: 1, borderLeftColor: "currentcolor", borderBottomColor: "currentcolor", borderRightColor: "currentcolor" })), u1 = styled.div(({ theme: e10, width: t5 = 14, height: r5 = 14, marginLeft: n10 = 7, marginRight: a2 = 8 }) => ({ display: "inline-block", backgroundColor: e10.appBorderColor, borderRadius: 3, animation: `${e10.animation.glow} 1.5s ease-in-out infinite`, height: r5, width: t5, margin: 7, marginLeft: n10, marginRight: a2 })), Ag = styled.div(({ theme: e10 }) => ({ gridArea: "label", margin: "8px 15px", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 6, span: { display: "none", "@container (min-width: 300px)": { display: "initial" } }, "@container (min-width: 800px)": { borderLeft: `1px solid ${e10.appBorderColor}`, paddingLeft: 10, marginLeft: 0 } })), I2 = styled.div({ gridArea: "controls", margin: "6px 10px 6px 15px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, "@container (min-width: 800px)": { margin: 8 } }), Bg = styled.div(({ theme: e10, showDivider: t5 }) => ({ gridArea: "actions", display: "flex", alignItems: "center", justifyContent: "flex-end", margin: "0px 10px 0px 15px", gap: 6, "@container (min-width: 300px)": { alignItems: "flex-start", margin: "15px 10px 15px 0px" }, "@container (min-width: 800px)": { alignItems: "center", borderLeft: t5 ? `1px solid ${e10.appBorderColor}` : "none", margin: "8px 10px 8px 0px", paddingLeft: 8 } })), c1 = styled(ActionList.Action)({ height: "auto", flex: "0 1 100%" }), p1 = styled(ActionList.Text)(({ theme: e10 }) => ({ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: "0 1 100%", padding: "8px 0", gap: 2, span: { color: e10.textMutedColor } })), f1 = styled(Fa)(({ theme: e10, side: t5, status: r5 }) => ({ ...r5 === "positive" && { backgroundColor: e10.background.positive, border: `1px solid ${jo(0.35, e10.color.positive)}`, color: e10.color.positiveText, "&:hover": { backgroundColor: za(0.05, e10.background.positive) } }, ...t5 === "left" && { borderTopRightRadius: 0, borderBottomRightRadius: 0 }, ...t5 === "right" && { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: r5 === "positive" ? "none" : `1px solid ${e10.base === "dark" ? "#0006" : "#fff6"}` } })), E2 = ({ isOutdated: e10 }) => {
    let { baselineImageVisible: t5, diffVisible: r5, focusVisible: n10 } = Gn(), { toggleBaselineImage: a2, toggleDiff: o10, toggleFocus: i10 } = Xt(), { isRunning: l2, startBuild: d3 } = sr(), { selectedTest: u3, selectedComparison: c10, summary: p5 } = pt(), { changeCount: f4, isInProgress: m8 } = p5, { isReviewing: h2, buildIsReviewable: g3, userCanReview: w2, acceptTest: y10, unacceptTest: v5 } = o1();
    if (m8) return react_default.createElement(I2, null, react_default.createElement(u1, null), react_default.createElement(u1, null), react_default.createElement(u1, null));
    let C3 = f4 > 0 && u3?.status !== "ACCEPTED", b8 = f4 > 0 && u3?.status === "ACCEPTED", I = c10?.result === "CHANGED";
    return react_default.createElement(react_default.Fragment, null, I && react_default.createElement(Ag, null, react_default.createElement(L2, null, react_default.createElement("b", null, t5 ? "Baseline" : "Latest", react_default.createElement("span", null, " snapshot")))), I && react_default.createElement(I2, null, react_default.createElement(ActionList.Button, { id: "button-toggle-snapshot", size: "small", ariaLabel: t5 ? "Show latest snapshot" : "Show baseline snapshot", onClick: () => a2() }, react_default.createElement(Rs, null)), react_default.createElement(ActionList.Toggle, { id: "button-toggle-spotlight", size: "small", pressed: n10, ariaLabel: n10 ? "Hide spotlight" : "Show spotlight", onClick: () => i10(!n10) }, react_default.createElement(Ds, null)), react_default.createElement(ActionList.Toggle, { id: "button-diff-visible", size: "small", pressed: r5, ariaLabel: r5 ? "Hide diff" : "Show diff", onClick: () => o10(!r5) }, react_default.createElement(Bo, null))), (C3 || b8) && react_default.createElement(Bg, { showDivider: I }, w2 && g3 && C3 && u3 && react_default.createElement("div", null, react_default.createElement(f1, { id: "button-toggle-accept-story", disabled: h2, ariaLabel: "Accept this story", onClick: () => y10(u3.id, "SPEC"), side: "left", variant: "solid" }, "Accept"), react_default.createElement(PopoverProvider, { padding: 0, popover: ({ onHide: x2 }) => react_default.createElement(ActionList, null, react_default.createElement(ActionList.Item, null, react_default.createElement(c1, { ariaLabel: "Accept component", disabled: h2, onClick: () => {
      y10(u3.id, "COMPONENT"), x2();
    } }, react_default.createElement(p1, null, react_default.createElement("strong", null, "Accept component"), react_default.createElement("span", null, "Accept all unreviewed changes for this component")))), react_default.createElement(ActionList.Item, null, react_default.createElement(c1, { ariaLabel: "Accept entire build", disabled: h2, onClick: () => {
      y10(u3.id, "BUILD"), x2();
    } }, react_default.createElement(p1, null, react_default.createElement("strong", null, "Accept entire build"), react_default.createElement("span", null, "Accept all unreviewed changes for every story in the Storybook"))))) }, react_default.createElement(f1, { disabled: h2, ariaLabel: "Batch accept options", side: "right", variant: "solid" }, h2 ? react_default.createElement(Pa, { parentComponent: "IconButton" }) : react_default.createElement(I1, null)))), w2 && g3 && b8 && react_default.createElement("div", null, react_default.createElement(f1, { id: "button-toggle-accept-story", disabled: h2, ariaLabel: "Unaccept this story", onClick: () => v5(u3.id, "SPEC"), side: "left", variant: "solid", status: "positive" }, react_default.createElement(Hs, null), "Unaccept"), react_default.createElement(PopoverProvider, { padding: 0, popover: ({ onHide: x2 }) => react_default.createElement(ActionList, null, react_default.createElement(ActionList.Item, null, react_default.createElement(c1, { ariaLabel: "Unaccept component", disabled: h2, onClick: () => {
      v5(u3.id, "COMPONENT"), x2();
    } }, react_default.createElement(p1, null, react_default.createElement("strong", null, "Unaccept component"), react_default.createElement("span", null, "Unaccept all unreviewed changes for this component")))), react_default.createElement(ActionList.Item, null, react_default.createElement(c1, { ariaLabel: "Unaccept entire build", disabled: h2, onClick: () => {
      v5(u3.id, "BUILD"), x2();
    } }, react_default.createElement(p1, null, react_default.createElement("strong", null, "Unaccept entire build"), react_default.createElement("span", null, "Unaccept all unreviewed changes for every story in the Storybook"))))) }, react_default.createElement(f1, { disabled: h2, ariaLabel: "Batch accept options", side: "right", variant: "solid", status: "positive" }, h2 ? react_default.createElement(Pa, { parentComponent: "IconButton" }) : react_default.createElement(I1, null)))), !(w2 && g3) && react_default.createElement(Fa, { readOnly: !0, tooltip: "Reviewing disabled" }, react_default.createElement(Ms, null)), react_default.createElement(Fa, { ariaLabel: e10 ? "Run new tests" : "Rerun tests", onClick: d3, disabled: l2, variant: "outline" }, e10 ? react_default.createElement(Ir, null) : react_default.createElement(Fo, null))));
  }, Lo = Jt(ti()), M22 = (e10) => react_default.createElement("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { margin: "3px 6px", verticalAlign: "top" }, ...e10 }, react_default.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM5.57143 6.85714C5.57143 7.09384 5.76331 7.28571 6 7.28571C6.23669 7.28571 6.42857 7.09384 6.42857 6.85714L6.42857 3.42857C6.42857 3.19188 6.23669 3 6 3C5.76331 3 5.57143 3.19188 5.57143 3.42857V6.85714ZM5.35714 8.78572C5.35714 8.43067 5.64496 8.14286 6 8.14286C6.35504 8.14286 6.64286 8.43067 6.64286 8.78571C6.64286 9.14075 6.35504 9.42857 6 9.42857C5.64496 9.42857 5.35714 9.14075 5.35714 8.78572Z", fill: "#73828C" })), ts = { width: 12, height: 12, margin: "3px 3px 3px 6px", verticalAlign: "top" }, L22 = ({ icon: e10 }) => {
    let { color: t5 } = useTheme();
    return { passed: react_default.createElement(Es, { style: { ...ts, color: t5.positive } }), changed: react_default.createElement(Ts, { style: { ...ts, color: t5.warning } }), failed: react_default.createElement(Bt, { style: { ...ts, color: t5.negative } }) }[e10];
  };
  function m1(e10) {
    "@babel/helpers - typeof";
    return m1 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t5) {
      return typeof t5;
    } : function(t5) {
      return t5 && typeof Symbol == "function" && t5.constructor === Symbol && t5 !== Symbol.prototype ? "symbol" : typeof t5;
    }, m1(e10);
  }
  function xr(e10, t5) {
    if (t5.length < e10) throw new TypeError(e10 + " argument" + (e10 > 1 ? "s" : "") + " required, but only " + t5.length + " present");
  }
  function Cr(e10) {
    xr(1, arguments);
    var t5 = Object.prototype.toString.call(e10);
    return e10 instanceof Date || m1(e10) === "object" && t5 === "[object Date]" ? new Date(e10.getTime()) : typeof e10 == "number" || t5 === "[object Number]" ? new Date(e10) : ((typeof e10 == "string" || t5 === "[object String]") && typeof console < "u" && (console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"), console.warn(new Error().stack)), /* @__PURE__ */ new Date(NaN));
  }
  var Fg = {};
  function A22() {
    return Fg;
  }
  function h1(e10) {
    var t5 = new Date(Date.UTC(e10.getFullYear(), e10.getMonth(), e10.getDate(), e10.getHours(), e10.getMinutes(), e10.getSeconds(), e10.getMilliseconds()));
    return t5.setUTCFullYear(e10.getFullYear()), e10.getTime() - t5.getTime();
  }
  function rs(e10, t5) {
    xr(2, arguments);
    var r5 = Cr(e10), n10 = Cr(t5), a2 = r5.getTime() - n10.getTime();
    return a2 < 0 ? -1 : a2 > 0 ? 1 : a2;
  }
  var Pg = { lessThanXSeconds: { one: "less than a second", other: "less than {{count}} seconds" }, xSeconds: { one: "1 second", other: "{{count}} seconds" }, halfAMinute: "half a minute", lessThanXMinutes: { one: "less than a minute", other: "less than {{count}} minutes" }, xMinutes: { one: "1 minute", other: "{{count}} minutes" }, aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" }, xHours: { one: "1 hour", other: "{{count}} hours" }, xDays: { one: "1 day", other: "{{count}} days" }, aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" }, xWeeks: { one: "1 week", other: "{{count}} weeks" }, aboutXMonths: { one: "about 1 month", other: "about {{count}} months" }, xMonths: { one: "1 month", other: "{{count}} months" }, aboutXYears: { one: "about 1 year", other: "about {{count}} years" }, xYears: { one: "1 year", other: "{{count}} years" }, overXYears: { one: "over 1 year", other: "over {{count}} years" }, almostXYears: { one: "almost 1 year", other: "almost {{count}} years" } }, Og = function(t5, r5, n10) {
    var a2, o10 = Pg[t5];
    return typeof o10 == "string" ? a2 = o10 : r5 === 1 ? a2 = o10.one : a2 = o10.other.replace("{{count}}", r5.toString()), n10 != null && n10.addSuffix ? n10.comparison && n10.comparison > 0 ? "in " + a2 : a2 + " ago" : a2;
  }, B22 = Og;
  function Eo(e10) {
    return function() {
      var t5 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r5 = t5.width ? String(t5.width) : e10.defaultWidth, n10 = e10.formats[r5] || e10.formats[e10.defaultWidth];
      return n10;
    };
  }
  var Ng = { full: "EEEE, MMMM do, y", long: "MMMM do, y", medium: "MMM d, y", short: "MM/dd/yyyy" }, Rg = { full: "h:mm:ss a zzzz", long: "h:mm:ss a z", medium: "h:mm:ss a", short: "h:mm a" }, Hg = { full: "{{date}} 'at' {{time}}", long: "{{date}} 'at' {{time}}", medium: "{{date}}, {{time}}", short: "{{date}}, {{time}}" }, Dg = { date: Eo({ formats: Ng, defaultWidth: "full" }), time: Eo({ formats: Rg, defaultWidth: "full" }), dateTime: Eo({ formats: Hg, defaultWidth: "full" }) }, _22 = Dg, Vg = { lastWeek: "'last' eeee 'at' p", yesterday: "'yesterday at' p", today: "'today at' p", tomorrow: "'tomorrow at' p", nextWeek: "eeee 'at' p", other: "P" }, zg = function(t5, r5, n10, a2) {
    return Vg[t5];
  }, F22 = zg;
  function _n(e10) {
    return function(t5, r5) {
      var n10 = r5 != null && r5.context ? String(r5.context) : "standalone", a2;
      if (n10 === "formatting" && e10.formattingValues) {
        var o10 = e10.defaultFormattingWidth || e10.defaultWidth, i10 = r5 != null && r5.width ? String(r5.width) : o10;
        a2 = e10.formattingValues[i10] || e10.formattingValues[o10];
      } else {
        var l2 = e10.defaultWidth, d3 = r5 != null && r5.width ? String(r5.width) : e10.defaultWidth;
        a2 = e10.values[d3] || e10.values[l2];
      }
      var u3 = e10.argumentCallback ? e10.argumentCallback(t5) : t5;
      return a2[u3];
    };
  }
  var Zg = { narrow: ["B", "A"], abbreviated: ["BC", "AD"], wide: ["Before Christ", "Anno Domini"] }, jg = { narrow: ["1", "2", "3", "4"], abbreviated: ["Q1", "Q2", "Q3", "Q4"], wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"] }, Ug = { narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] }, $g = { narrow: ["S", "M", "T", "W", "T", "F", "S"], short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] }, Wg = { narrow: { am: "a", pm: "p", midnight: "mi", noon: "n", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" }, abbreviated: { am: "AM", pm: "PM", midnight: "midnight", noon: "noon", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" }, wide: { am: "a.m.", pm: "p.m.", midnight: "midnight", noon: "noon", morning: "morning", afternoon: "afternoon", evening: "evening", night: "night" } }, qg = { narrow: { am: "a", pm: "p", midnight: "mi", noon: "n", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" }, abbreviated: { am: "AM", pm: "PM", midnight: "midnight", noon: "noon", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" }, wide: { am: "a.m.", pm: "p.m.", midnight: "midnight", noon: "noon", morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening", night: "at night" } }, Gg = function(t5, r5) {
    var n10 = Number(t5), a2 = n10 % 100;
    if (a2 > 20 || a2 < 10) switch (a2 % 10) {
      case 1:
        return n10 + "st";
      case 2:
        return n10 + "nd";
      case 3:
        return n10 + "rd";
    }
    return n10 + "th";
  }, Qg = { ordinalNumber: Gg, era: _n({ values: Zg, defaultWidth: "wide" }), quarter: _n({ values: jg, defaultWidth: "wide", argumentCallback: function(t5) {
    return t5 - 1;
  } }), month: _n({ values: Ug, defaultWidth: "wide" }), day: _n({ values: $g, defaultWidth: "wide" }), dayPeriod: _n({ values: Wg, defaultWidth: "wide", formattingValues: qg, defaultFormattingWidth: "wide" }) }, P22 = Qg;
  function Fn(e10) {
    return function(t5) {
      var r5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n10 = r5.width, a2 = n10 && e10.matchPatterns[n10] || e10.matchPatterns[e10.defaultMatchWidth], o10 = t5.match(a2);
      if (!o10) return null;
      var i10 = o10[0], l2 = n10 && e10.parsePatterns[n10] || e10.parsePatterns[e10.defaultParseWidth], d3 = Array.isArray(l2) ? Jg(l2, function(p5) {
        return p5.test(i10);
      }) : Yg(l2, function(p5) {
        return p5.test(i10);
      }), u3;
      u3 = e10.valueCallback ? e10.valueCallback(d3) : d3, u3 = r5.valueCallback ? r5.valueCallback(u3) : u3;
      var c10 = t5.slice(i10.length);
      return { value: u3, rest: c10 };
    };
  }
  function Yg(e10, t5) {
    for (var r5 in e10) if (e10.hasOwnProperty(r5) && t5(e10[r5])) return r5;
  }
  function Jg(e10, t5) {
    for (var r5 = 0; r5 < e10.length; r5++) if (t5(e10[r5])) return r5;
  }
  function ns(e10) {
    return function(t5) {
      var r5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n10 = t5.match(e10.matchPattern);
      if (!n10) return null;
      var a2 = n10[0], o10 = t5.match(e10.parsePattern);
      if (!o10) return null;
      var i10 = e10.valueCallback ? e10.valueCallback(o10[0]) : o10[0];
      i10 = r5.valueCallback ? r5.valueCallback(i10) : i10;
      var l2 = t5.slice(a2.length);
      return { value: i10, rest: l2 };
    };
  }
  var Kg = /^(\d+)(th|st|nd|rd)?/i, Xg = /\d+/i, e9 = { narrow: /^(b|a)/i, abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i, wide: /^(before christ|before common era|anno domini|common era)/i }, t9 = { any: [/^b/i, /^(a|c)/i] }, r9 = { narrow: /^[1234]/i, abbreviated: /^q[1234]/i, wide: /^[1234](th|st|nd|rd)? quarter/i }, n9 = { any: [/1/i, /2/i, /3/i, /4/i] }, a9 = { narrow: /^[jfmasond]/i, abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i, wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i }, o9 = { narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i], any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i] }, i9 = { narrow: /^[smtwf]/i, short: /^(su|mo|tu|we|th|fr|sa)/i, abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i, wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i }, s9 = { narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i], any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i] }, l9 = { narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i, any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i }, d9 = { any: { am: /^a/i, pm: /^p/i, midnight: /^mi/i, noon: /^no/i, morning: /morning/i, afternoon: /afternoon/i, evening: /evening/i, night: /night/i } }, u9 = { ordinalNumber: ns({ matchPattern: Kg, parsePattern: Xg, valueCallback: function(t5) {
    return parseInt(t5, 10);
  } }), era: Fn({ matchPatterns: e9, defaultMatchWidth: "wide", parsePatterns: t9, defaultParseWidth: "any" }), quarter: Fn({ matchPatterns: r9, defaultMatchWidth: "wide", parsePatterns: n9, defaultParseWidth: "any", valueCallback: function(t5) {
    return t5 + 1;
  } }), month: Fn({ matchPatterns: a9, defaultMatchWidth: "wide", parsePatterns: o9, defaultParseWidth: "any" }), day: Fn({ matchPatterns: i9, defaultMatchWidth: "wide", parsePatterns: s9, defaultParseWidth: "any" }), dayPeriod: Fn({ matchPatterns: l9, defaultMatchWidth: "any", parsePatterns: d9, defaultParseWidth: "any" }) }, O2 = u9, c9 = { code: "en-US", formatDistance: B22, formatLong: _22, formatRelative: F22, localize: P22, match: O2, options: { weekStartsOn: 0, firstWeekContainsDate: 1 } }, g1 = c9, N22 = g1;
  function To(e10, t5) {
    if (e10 == null) throw new TypeError("assign requires that input parameter not be null or undefined");
    for (var r5 in t5) Object.prototype.hasOwnProperty.call(t5, r5) && (e10[r5] = t5[r5]);
    return e10;
  }
  function as(e10) {
    return To({}, e10);
  }
  var R2 = 1e3 * 60, v1 = 1440, H22 = v1 * 30, D2 = v1 * 365;
  function os(e10, t5, r5) {
    var n10, a2, o10;
    xr(2, arguments);
    var i10 = A22(), l2 = (n10 = (a2 = r5?.locale) !== null && a2 !== void 0 ? a2 : i10.locale) !== null && n10 !== void 0 ? n10 : N22;
    if (!l2.formatDistance) throw new RangeError("locale must contain localize.formatDistance property");
    var d3 = rs(e10, t5);
    if (isNaN(d3)) throw new RangeError("Invalid time value");
    var u3 = To(as(r5), { addSuffix: !!r5?.addSuffix, comparison: d3 }), c10, p5;
    d3 > 0 ? (c10 = Cr(t5), p5 = Cr(e10)) : (c10 = Cr(e10), p5 = Cr(t5));
    var f4 = String((o10 = r5?.roundingMethod) !== null && o10 !== void 0 ? o10 : "round"), m8;
    if (f4 === "floor") m8 = Math.floor;
    else if (f4 === "ceil") m8 = Math.ceil;
    else if (f4 === "round") m8 = Math.round;
    else throw new RangeError("roundingMethod must be 'floor', 'ceil' or 'round'");
    var h2 = p5.getTime() - c10.getTime(), g3 = h2 / R2, w2 = h1(p5) - h1(c10), y10 = (h2 - w2) / R2, v5 = r5?.unit, C3;
    if (v5 ? C3 = String(v5) : g3 < 1 ? C3 = "second" : g3 < 60 ? C3 = "minute" : g3 < v1 ? C3 = "hour" : y10 < H22 ? C3 = "day" : y10 < D2 ? C3 = "month" : C3 = "year", C3 === "second") {
      var b8 = m8(h2 / 1e3);
      return l2.formatDistance("xSeconds", b8, u3);
    } else if (C3 === "minute") {
      var I = m8(g3);
      return l2.formatDistance("xMinutes", I, u3);
    } else if (C3 === "hour") {
      var x2 = m8(g3 / 60);
      return l2.formatDistance("xHours", x2, u3);
    } else if (C3 === "day") {
      var D = m8(y10 / v1);
      return l2.formatDistance("xDays", D, u3);
    } else if (C3 === "month") {
      var le = m8(y10 / H22);
      return le === 12 && v5 !== "month" ? l2.formatDistance("xYears", 1, u3) : l2.formatDistance("xMonths", le, u3);
    } else if (C3 === "year") {
      var Te = m8(y10 / D2);
      return l2.formatDistance("xYears", Te, u3);
    }
    throw new RangeError("unit must be 'second', 'minute', 'hour', 'day', 'month' or 'year'");
  }
  function y1(e10, t5) {
    return xr(1, arguments), os(e10, Date.now(), t5);
  }
  var p9 = { lessThanXSeconds: "just now", xSeconds: "just now", halfAMinute: "just now", lessThanXMinutes: "{{count}}m", xMinutes: "{{count}}m", aboutXHours: "{{count}}h", xHours: "{{count}}h", xDays: "{{count}}d", aboutXWeeks: "{{count}}w", xWeeks: "{{count}}w", aboutXMonths: "{{count}}mo", xMonths: "{{count}}mo", aboutXYears: "{{count}}y", xYears: "{{count}}y", overXYears: "{{count}}y", almostXYears: "{{count}}y" };
  function f9(e10, t5, r5 = { addSuffix: !1, comparison: 0 }) {
    let n10 = p9[e10].replace("{{count}}", t5);
    return ["lessThanXSeconds", "xSeconds", "halfAMinute"].includes(e10) ? `${n10}` : r5.addSuffix ? r5.comparison > 0 ? `in ${n10}` : `${n10} ago` : n10;
  }
  var V2 = (e10) => y1(e10, { addSuffix: !0, locale: { ...g1, formatDistance: f9 } }), Mo = styled.div(({ theme: e10 }) => ({ gridArea: "info", display: "flex", justifySelf: "start", justifyContent: "center", flexDirection: "column", margin: 15, lineHeight: "18px", color: e10.base === "light" ? `${e10.color.defaultText}99` : `${e10.color.light}99`, fontSize: e10.typography.size.s2, b: { color: e10.base === "light" ? `${e10.color.defaultText}` : `${e10.color.light}` }, small: { fontSize: e10.typography.size.s2 - 1 }, "@container (min-width: 800px)": { margin: "6px 10px 6px 15px", alignItems: "center", flexDirection: "row", small: { fontSize: "inherit" }, "[data-hidden-large]": { display: "none" }, "& > span:first-of-type": { display: "inline-flex", alignItems: "center", height: 24, marginRight: 6 } } })), h9 = styled.div({ gridArea: "actions", display: "flex", justifySelf: "end", justifyContent: "center", alignItems: "start", margin: 15, marginRight: 10, "@container (min-width: 800px)": { margin: "6px 10px 0 0" } }), Z2 = ({ isStarting: e10, tests: t5, startedAt: r5, isBuildFailed: n10, isOutdated: a2, shouldSwitchToLastBuildOnBranch: o10, switchToLastBuildOnBranch: i10 }) => {
    let { isRunning: l2, startBuild: d3 } = sr(), { status: u3, isInProgress: c10, changeCount: p5, brokenCount: f4, modeResults: m8, browserResults: h2 } = Ba(t5 ?? []), g3 = !e10 && r5 && V2(new Date(r5).getTime()), w2 = e10 || c10, y10 = n10 || u3 === "FAILED", v5 = y10 || u3 === "BROKEN", C3 = (v5 || a2) && !w2 && !p5, b8;
    return a2 ? b8 = react_default.createElement(Mo, null, react_default.createElement("span", null, react_default.createElement("b", null, "Code edits detected")), react_default.createElement("small", null, react_default.createElement("span", null, "Run tests to see what changed"))) : y10 ? b8 = react_default.createElement(Mo, null, react_default.createElement("span", null, react_default.createElement("b", null, "Build failed"), react_default.createElement(M22, null)), react_default.createElement("small", null, react_default.createElement("span", null, "An infrastructure error occured"))) : w2 ? b8 = react_default.createElement(Mo, null, react_default.createElement("span", null, react_default.createElement("b", null, "Running tests..."), react_default.createElement(Pa, null)), react_default.createElement("small", null, react_default.createElement("span", null, "Test in progress..."))) : o10 ? b8 = react_default.createElement(Mo, null, react_default.createElement("span", null, react_default.createElement("b", null, react_default.createElement(Link, { isButton: !0, onClick: i10 }, "View latest snapshot"))), react_default.createElement("span", null, "Newer test results are available for this story")) : b8 = react_default.createElement(Mo, null, react_default.createElement("span", null, react_default.createElement("b", null, f4 ? null : p5 ? `${(0, Lo.default)("change", p5, !0)}${u3 === "ACCEPTED" ? " accepted" : ""}` : "No changes", f4 ? (0, Lo.default)("error", f4, !0) : null), react_default.createElement(L22, { icon: f4 ? "failed" : u3 === "PENDING" ? "changed" : "passed" })), react_default.createElement("small", null, m8.length > 0 && react_default.createElement("span", { "data-hidden-large": !0 }, (0, Lo.default)("mode", m8.length, !0), ", ", (0, Lo.default)("browser", h2.length, !0)), m8.length > 0 && react_default.createElement("span", { "data-hidden-large": !0 }, " \u2022 "), c10 && react_default.createElement("span", null, "Test in progress..."), !c10 && r5 && react_default.createElement("span", { title: new Date(r5).toUTCString() }, "Ran ", g3))), react_default.createElement(react_default.Fragment, null, b8, C3 && react_default.createElement(h9, null, react_default.createElement(Fa, { ariaLabel: !1, onClick: d3, disabled: l2, variant: "solid" }, l2 ? react_default.createElement(Pa, { parentComponent: "Button" }) : react_default.createElement(Ir, null), v5 ? "Rerun tests" : "Run tests")));
  }, j2 = styled.div(({ theme: e10 }) => ({ display: "grid", gridTemplateAreas: `
    "info info"
    "actions actions"
    "label controls"
  `, gridTemplateColumns: "1fr fit-content(50%)", gridTemplateRows: "auto auto auto", borderBottom: `1px solid ${e10.appBorderColor}`, "@container (min-width: 300px)": { gridTemplateAreas: `
      "info actions"
      "label controls"
    `, gridTemplateColumns: "1fr auto", gridTemplateRows: "auto auto" }, "@container (min-width: 800px)": { gridTemplateAreas: '"info label controls actions"', gridTemplateColumns: "auto 1fr auto auto", gridTemplateRows: "39px" } })), U2 = styled.div({ display: "grid", gridTemplateAreas: `
    "header"
    "main"
    "footer"
  `, gridTemplateColumns: "1fr", gridTemplateRows: "auto 1fr auto", height: "100%", "&[hidden]": { display: "none" } }), $2 = styled.div(({ theme: e10 }) => ({ gridArea: "header", position: "sticky", zIndex: 1, top: 0, background: e10.background.content, "@container (min-width: 800px)": { background: e10.background.app } })), y9 = styled.div(({ theme: e10 }) => ({ gridArea: "main", overflowY: "auto", maxHeight: "100%", background: e10.background.content })), W22 = styled.div({ gridArea: "footer", position: "sticky", zIndex: 1, bottom: 0 }), w9 = styled.div(({ children: e10, theme: t5 }) => ({ display: "flex", alignItems: "center", border: `0px solid ${t5.appBorderColor}`, borderTopWidth: 1, borderBottomWidth: e10 ? 1 : 0, height: e10 ? 40 : 0, padding: e10 ? "0 15px" : 0 })), b9 = styled.div(({ theme: e10 }) => ({ fontFamily: e10.typography.fonts.mono, fontSize: e10.typography.size.s1, color: e10.color.defaultText, lineHeight: "18px", padding: 15, whiteSpace: "pre-wrap", wordBreak: "break-word" })), is = styled.div(({ theme: e10 }) => ({ background: e10.background.hoverable, padding: "10px 15px", lineHeight: "18px", position: "relative", borderBottom: `1px solid ${e10.appBorderColor}` })), q2 = ({ isOutdated: e10, isStarting: t5, isBuildFailed: r5, shouldSwitchToLastBuildOnBranch: n10, switchToLastBuildOnBranch: a2, hidden: o10, storyId: i10 }) => {
    let { baselineImageVisible: l2, diffVisible: d3, focusVisible: u3 } = Gn(), { toggleBaselineImage: c10 } = Xt(), p5 = Ki(), f4 = "startedAt" in p5 && p5.startedAt, m8 = pt(), { tests: h2 } = m8, g3 = react_default.useRef(i10), w2 = react_default.useRef(m8.selectedComparison?.id), y10 = react_default.useRef(p5.id), { selectedTest: v5, selectedComparison: C3 } = m8, b8 = h2.every(({ result: lt, status: ft }) => lt === "ADDED" && ft !== "ACCEPTED"), I = !b8 && v5?.result === "ADDED" && v5?.status !== "ACCEPTED", x2 = !b8 && C3?.result === "ADDED" && v5?.result !== "ADDED" && v5?.status !== "ACCEPTED";
    useEffect(() => {
      (g3.current !== i10 || w2.current !== m8.selectedComparison?.id || y10.current !== p5.id || b8 || I || x2) && c10(!1), w2.current = m8.selectedComparison?.id, g3.current = i10, y10.current = p5.id;
    }, [p5.id, i10, m8, c10, b8, I, x2]);
    let D = react_default.createElement(Z2, { tests: h2, startedAt: f4, isStarting: t5, isBuildFailed: r5, isOutdated: e10, shouldSwitchToLastBuildOnBranch: n10, switchToLastBuildOnBranch: a2 });
    if (t5 || !h2.length) return react_default.createElement(U2, { hidden: o10 }, react_default.createElement($2, null, react_default.createElement(j2, null, D)), react_default.createElement(W22, null, react_default.createElement(X0, null)));
    let le = Ba(h2), { isInProgress: Te } = le, we = C3?.headCapture?.captureError && "error" in C3?.headCapture?.captureError && C3?.headCapture?.captureError?.error;
    return react_default.createElement(U2, { hidden: o10 }, react_default.createElement($2, null, react_default.createElement(j2, null, D, react_default.createElement(E2, { isOutdated: e10 }))), react_default.createElement(y9, null, Te && react_default.createElement(Loader, null), !Te && b8 && react_default.createElement(is, null, react_default.createElement(L2, null, "New story found. Accept this snapshot as a test baseline.", " ", react_default.createElement(ye, { withArrow: !0, href: "https://www.chromatic.com/docs/branching-and-baselines", target: "_blank" }, "Learn more"))), !Te && I && react_default.createElement(is, null, react_default.createElement(L2, null, "New mode found. Accept this snapshot as a test baseline.", " ", react_default.createElement(ye, { withArrow: !0, href: "https://www.chromatic.com/docs/branching-and-baselines", target: "_blank" }, "Learn more"))), !Te && x2 && react_default.createElement(is, null, react_default.createElement(L2, null, "New browser found. Accept this snapshot as a test baseline.", " ", react_default.createElement(ye, { withArrow: !0, href: "https://www.chromatic.com/docs/branching-and-baselines", target: "_blank" }, "Learn more"))), !Te && C3 && react_default.createElement(f2, { key: C3.id, componentName: v5?.story?.component?.name, storyName: v5?.story?.name, testUrl: v5?.webUrl, comparisonResult: C3.result ?? void 0, latestImage: C3.headCapture?.captureImage ?? void 0, baselineImage: C3.baseCapture?.captureImage ?? void 0, baselineImageVisible: l2, diffImage: C3.captureDiff?.diffImage ?? void 0, focusImage: C3.captureDiff?.focusImage ?? void 0, diffVisible: d3, focusVisible: u3 }), !Te && we && react_default.createElement(react_default.Fragment, null, react_default.createElement(w9, null, react_default.createElement("b", null, "Error stack trace")), react_default.createElement(b9, null, we.stack || we.message))), react_default.createElement(W22, null, react_default.createElement(X0, null)));
  };
  styled.div(({ theme: e10 }) => ({ color: e10.color.warning, background: e10.background.warning, padding: 10, lineHeight: "18px", position: "relative" }));
  var G2 = ({ branch: e10, dismissBuildError: t5, isOutdated: r5, localBuildProgress: n10, switchToLastBuildOnBranch: a2, storyId: o10 }) => {
    let { isRunning: i10, startBuild: l2, stopBuild: d3 } = sr(), { lastBuildOnBranch: u3, lastBuildOnBranchIsReady: c10, lastBuildOnBranchIsSelectable: p5 } = Rc(), f4 = Ki(), m8 = pt(), { buildIsReviewable: h2, userCanReview: g3 } = o1(), w2 = !!(!h2 && c10 && p5 && a2), y10 = u3?.status === "IN_PROGRESS", v5 = i10 || !h2 && !w2, C3 = n10 && n10?.buildId === u3?.id, b8 = v5 && react_default.createElement(s2, { branch: e10, dismissBuildError: t5, localBuildProgress: C3 || i10 ? n10 : void 0, lastBuildOnBranchInProgress: y10, switchToLastBuildOnBranch: a2 }), I = m8?.hasTests && m8?.tests.length === 0, x2 = f4.id !== `Build:${n10?.buildId}`;
    if (I) return react_default.createElement(K, null, react_default.createElement(Q, null, n10 && x2 ? react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Snapshotting new story"), react_default.createElement(L2, { center: !0, muted: !0 }, 'A new snapshot is being created in a standardized cloud browser to save its "last known good state" as a test baseline.')), react_default.createElement(Wr, { localBuildProgress: n10 })) : react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "New story found"), react_default.createElement(L2, { center: !0, muted: !0 }, 'Take an image snapshot of this story to save its "last known good state" as a test baseline. This unlocks visual regression testing so you can see exactly what has changed down to the pixel.')), react_default.createElement(J, { ariaLabel: !1, belowText: !0, size: "medium", variant: "solid", onClick: i10 ? d3 : l2 }, i10 ? "Cancel build" : "Create visual test"))));
    if (m8?.tests?.find((ft) => ft.result === "SKIPPED")) return react_default.createElement(K, null, b8, react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "This story was skipped"), react_default.createElement(L2, { center: !0, muted: !0 }, "If you would like to resume testing it, comment out or remove", react_default.createElement(Fe, null, "disableSnapshot = true"), " from the CSF file.")), react_default.createElement(J, { ariaLabel: !1, asChild: !0, size: "medium", variant: "outline" }, react_default.createElement("a", { href: "https://www.chromatic.com/docs/disable-snapshots#with-storybook", target: "_new" }, react_default.createElement(ws, null), "View docs")))));
    let { status: le } = f4, Te = ["ANNOUNCED", "PUBLISHED", "PREPARED"].includes(le), we = le === "FAILED", lt = le === "PENDING" && (!g3 || !h2);
    return react_default.createElement(K, { footer: null }, react_default.createElement(s5, null, b8, !b8 && lt && react_default.createElement(n2, null, g3 ? react_default.createElement(react_default.Fragment, null, "Reviewing is disabled because there's a newer build on ", react_default.createElement(Fe, null, e10), ".") : react_default.createElement(react_default.Fragment, null, "You don't have permission to accept changes.", " ", react_default.createElement(Link, { href: "https://www.chromatic.com/docs/collaborators#roles", target: "_blank", withArrow: !0 }, "Learn about roles"))), react_default.createElement(qa, { grow: !0 }, react_default.createElement(q2, { isOutdated: r5, isStarting: Te, isBuildFailed: we, shouldSwitchToLastBuildOnBranch: w2, switchToLastBuildOnBranch: a2, selectedBuild: f4, storyId: o10 }))));
  }, ss = styled(ye)(() => ({ marginTop: 5 })), Q2 = ({ queryError: e10, hasData: t5, hasProject: r5, hasSelectedBuild: n10, localBuildProgress: a2, branch: o10 }) => {
    let { setAccessToken: i10 } = zn(), { isRunning: l2, startBuild: d3 } = sr(), { disable: u3, disableSnapshot: c10, docsOnly: p5 } = useParameter("chromatic", {}), f4 = () => {
      let h2 = react_default.createElement(J, { ariaLabel: !1, disabled: l2, size: "medium", variant: "solid", onClick: d3 }, react_default.createElement(Ir, null), "Take snapshots");
      return a2 ? a2.currentStep === "error" ? react_default.createElement(react_default.Fragment, null, react_default.createElement(G0, { localBuildProgress: a2, title: "Build failed" }), h2) : react_default.createElement(Wr, { localBuildProgress: a2 }) : h2;
    };
    return react_default.createElement(K, { footer: react_default.createElement(Kr, null, react_default.createElement(Ue, null, t5 && !e10 && r5 && react_default.createElement(L2, { muted: !0, style: { marginLeft: 5 } }, "Waiting for build on ", o10)), react_default.createElement(Ue, { push: !0 }, react_default.createElement(Br, null))) }, e10?.networkError ? react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Network error"), react_default.createElement(L2, null, e10.networkError.message)), react_default.createElement(J, { ariaLabel: !1, size: "medium", variant: "solid", onClick: () => i10(null) }, "Log out"))) : e10?.graphQLErrors?.length ? react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, e10.graphQLErrors[0].message), react_default.createElement(L2, { center: !0, muted: !0 }, e10.graphQLErrors[0].extensions.code === "FORBIDDEN" ? "You may have insufficient permissions. Try logging out and back in again." : "Try logging out or clear your browser's local storage.")), react_default.createElement($e, null, react_default.createElement(J, { ariaLabel: !1, size: "medium", variant: "solid", onClick: () => i10(null) }, "Log out"), react_default.createElement(ss, { withArrow: !0, href: `${Do}#troubleshooting`, target: "_blank" }, "Troubleshoot")))) : t5 ? r5 ? u3 || c10 || p5 ? react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Visual tests disabled for this story"), react_default.createElement(L2, { center: !0, muted: !0 }, "Update ", react_default.createElement("code", null, "parameters.chromatic.", u3 ? "disable" : c10 ? "disableSnapshot" : "docsOnly"), " to enable snapshots for this story.")), react_default.createElement(ss, { withArrow: !0, href: "https://www.chromatic.com/docs/disable-snapshots#with-storybook", target: "_blank" }, "Read more"))) : n10 ? null : react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Create a test baseline"), react_default.createElement(L2, { center: !0, muted: !0 }, 'Take an image snapshot of your stories to save their "last known good state" as test baselines.')), f4())) : react_default.createElement(Q, null, react_default.createElement(U, null, react_default.createElement("div", null, react_default.createElement(W2, null, "Project not found"), react_default.createElement(L2, { center: !0, muted: !0 }, "You may not have access to this project or it may not exist.")), react_default.createElement(ss, { isButton: !0, onClick: () => i10(null), withArrow: !0 }, "Switch account"))) : react_default.createElement(Loader, null));
  }, M9 = ({ buildIsReviewable: e10, userCanReview: t5, onReviewSuccess: r5, onReviewError: n10 }) => {
    let [{ fetching: a2 }, o10] = t0(Bc), i10 = useCallback(async (u3) => {
      try {
        if (!e10) throw new Error("Build is not reviewable");
        if (!t5) throw new Error("No permission to review tests");
        let { error: c10 } = await o10({ input: u3 });
        if (c10) throw c10;
        r5?.(u3);
      } catch (c10) {
        n10?.(c10, u3);
      }
    }, [r5, n10, o10, e10, t5]), l2 = useCallback((u3, c10 = "SPEC") => i10({ status: "ACCEPTED", testId: u3, batch: c10 }), [i10]), d3 = useCallback((u3, c10 = "SPEC") => i10({ status: "PENDING", testId: u3, batch: c10 }), [i10]);
    return { isReviewing: a2, acceptTest: l2, unacceptTest: d3, buildIsReviewable: e10, userCanReview: t5 };
  }, L9 = Je(`
  mutation UpdateUserPreferences($input: UserPreferencesInput!) {
    updateUserPreferences(input: $input) {
      updatedPreferences {
        vtaOnboarding
      }
    }
  }
`), A9 = ({ lastBuildOnBranch: e10, vtaOnboarding: t5 }) => {
    let r5 = useStorybookApi(), { notifications: n10, storyId: a2 } = useStorybookState(), [o10, i10] = react_default.useState(!1), l2 = react_default.useCallback(() => {
      i10(!0), n10.forEach(({ id: v5 }) => r5.clearNotification(v5));
    }, [r5, n10]), [d3, u3] = react_default.useState(!1), c10 = react_default.useCallback(() => u3(!0), []), [p5, f4] = react_default.useState(!0);
    react_default.useEffect(() => {
      if (r5?.getUrlState?.().queryParams.vtaOnboarding === "true") {
        f4(!1);
        return;
      }
      t5 && f4(t5 === "COMPLETED" || t5 === "DISMISSED");
    }, [r5, t5]);
    let [{ fetching: m8 }, h2] = t0(L9), g3 = react_default.useCallback(async (v5) => {
      await h2({ input: { vtaOnboarding: v5 ? "COMPLETED" : "DISMISSED" } }), f4(!0), u3(!1);
      let b8 = new URL(window.location.href);
      b8.searchParams.has("vtaOnboarding") && (b8.searchParams.delete("vtaOnboarding"), window.history.replaceState({}, "", b8.href));
    }, [h2]), w2 = react_default.useMemo(() => (e10 && "testsForStatus" in e10 && e10.testsForStatus?.nodes && Nr($0, e10.testsForStatus.nodes) || []).some((C3) => C3?.status === "PENDING" && C3?.result === "CHANGED" && C3?.story?.storyId === a2), [e10, a2]), y10 = !o10 && !p5 && !d3;
    return { showOnboarding: y10, showGuidedTour: !y10 && !p5, completeOnboarding: l2, skipOnboarding: react_default.useCallback(() => g3(!1), [g3]), completeWalkthrough: react_default.useCallback(() => g3(!0), [g3]), skipWalkthrough: react_default.useCallback(() => g3(!1), [g3]), startWalkthrough: c10, lastBuildHasChangesForStory: w2, isUpdating: m8 };
  }, B9 = ({ isOutdated: e10, selectedBuildInfo: t5, setSelectedBuildInfo: r5, dismissBuildError: n10, localBuildProgress: a2, setOutdated: o10, updateBuildStatus: i10, projectId: l2, gitInfo: d3, storyId: u3 }) => {
    let c10 = useStorybookApi(), { addNotification: p5, setOptions: f4, togglePanel: m8 } = c10, h2 = Oc({ projectId: l2, storyId: u3, gitInfo: d3, selectedBuildInfo: t5 }), { account: g3, features: w2, manageUrl: y10, hasData: v5, hasProject: C3, hasSelectedBuild: b8, lastBuildOnBranch: I, lastBuildOnBranchIsReady: x2, lastBuildOnBranchIsSelectable: D, selectedBuild: le, selectedBuildMatchesGit: Te, queryError: we, rerunQuery: lt, userCanReview: ft } = h2, At = useCallback(({ onDismiss: Nn }) => {
      Nn(), f4({ selectedPanel: _t }), m8(!0);
    }, [f4, m8]), rt = M9({ buildIsReviewable: !!le && le.id === I?.id, userCanReview: ft, onReviewSuccess: lt, onReviewError: (Nn, fp) => {
      Nn instanceof Error && p5({ id: `${z}/errorAccepting/${Date.now()}`, content: { headline: `Failed to ${fp.status === "ACCEPTED" ? "accept" : "unaccept"} changes`, subHeadline: Nn.message }, icon: react_default.createElement(Bt, { color: color.negative }), duration: 8e3, onClick: At });
    } });
    useEffect(() => o10(!Te), [Te, o10]);
    let mt = I && "testsForStatus" in I && I.testsForStatus?.nodes && Nr($0, I.testsForStatus.nodes), On = D ? Ud(mt || []) : [];
    useEffect(() => {
      i10(On);
    }, [JSON.stringify(On), i10]), useEffect(() => {
      r5((Nn) => $d(Nn, { shouldSwitchToLastBuildOnBranch: D && x2, lastBuildOnBranchId: I?.id, storyId: u3 }));
    }, [D, x2, I?.id, r5, u3]);
    let Ye = useCallback(() => I?.id && D && r5({ buildId: I.id, storyId: u3 }), [r5, D, I?.id, u3]), { showOnboarding: Ra, showGuidedTour: Yt, completeOnboarding: sp, completeWalkthrough: lp, skipOnboarding: dp, skipWalkthrough: up, startWalkthrough: cp, lastBuildHasChangesForStory: pp } = A9(h2);
    return w2 && !w2.uiTests ? react_default.createElement(qd, { manageUrl: y10 }) : g3?.suspensionReason ? react_default.createElement(Oi, { billingUrl: g3.billingUrl, suspensionReason: g3.suspensionReason }) : Ra && C3 ? react_default.createElement(react_default.Fragment, null, !v5 || we ? react_default.createElement(react_default.Fragment, null) : react_default.createElement(Xi, { watchState: h2 }, react_default.createElement(r2, { gitInfo: d3, projectId: l2, updateBuildStatus: i10, dismissBuildError: n10, localBuildProgress: a2, showInitialBuildScreen: !le, onComplete: sp, onSkip: dp, lastBuildHasChangesForStory: pp }))) : react_default.createElement(react_default.Fragment, null, !le || !b8 || !v5 || we ? react_default.createElement(Q2, { queryError: we, hasData: v5, hasProject: C3, hasSelectedBuild: b8, branch: d3.branch, dismissBuildError: n10, localBuildProgress: a2, ...D && { switchToLastBuildOnBranch: Ye } }) : react_default.createElement(c2, { watchState: rt }, react_default.createElement(Xi, { watchState: h2 }, react_default.createElement(G2, { branch: d3.branch, dismissBuildError: n10, isOutdated: e10, localBuildProgress: a2, ...I && { lastBuildOnBranch: I }, ...D && { switchToLastBuildOnBranch: Ye }, userCanReview: ft, storyId: u3 }))), Yt && react_default.createElement(Xi, { watchState: { selectedBuild: le } }, react_default.createElement(zc, { managerApi: c10, skipWalkthrough: up, startWalkthrough: cp, completeWalkthrough: lp })));
  }, J2 = (e10) => {
    let [t5, r5] = Oe("selectedBuildInfo");
    return react_default.createElement(B9, { selectedBuildInfo: t5, setSelectedBuildInfo: r5, ...e10 });
  }, w1 = ({ localBuildProgress: e10, accessToken: t5 }) => {
    let r5 = useChannel({}), n10 = useContext(Wn), [a2, o10] = useState(!1), [i10, l2] = useState(!1), d3 = e10 ? ["initialize", "build", "upload"].includes(e10?.currentStep) : !1, u3 = e10 ? !["aborted", "complete", "error", "limited"].includes(e10.currentStep) : a2, c10 = useMemo(() => Wa("startBuild", () => {
      l2(!1), o10(!0), r5(js, { accessToken: t5 }), n10?.({ action: "startBuild" });
    }, 1e3, !1), [t5, r5, n10]), p5 = useMemo(() => Wa("startBuild", () => {
      d3 ? (o10(!1), r5(Us), n10?.({ action: "stopBuild" })) : l2(!0);
    }, 1e3, !1), [d3, r5, n10]);
    return useEffect(() => {
      let f4 = a2 && setTimeout(() => o10(!1), 5e3);
      return () => {
        f4 && clearTimeout(f4);
      };
    }, [a2]), { isDisallowed: i10, isRunning: u3, startBuild: c10, stopBuild: p5 };
  }, Na = /* @__PURE__ */ new Map(), ep = () => {
    let e10 = useChannel({ [el]: (t5) => {
      let r5 = Na.get(t5.requestId);
      if (r5) if (Na.delete(t5.requestId), "error" in t5) r5.reject(new Error(t5.error));
      else {
        let { body: n10, headers: a2, status: o10, statusText: i10 } = t5.response, l2 = new Response(n10, { headers: a2, status: o10, statusText: i10 });
        r5.resolve(l2);
      }
    } });
    return async (t5, { signal: r5, ...n10 } = {}) => {
      if (r5?.aborted) return Promise.reject(r5.reason);
      let a2 = Math.random().toString(36).slice(2);
      return r5?.addEventListener("abort", () => {
        e10(Ks, { requestId: a2 }), Na.get(a2)?.reject(r5.reason), Na.delete(a2);
      }), e10(Xs, { requestId: a2, input: t5, init: n10 }), new Promise((o10, i10) => {
        Na.set(a2, { resolve: o10, reject: i10 }), setTimeout(() => {
          i10(new Error("Request timed out")), Na.delete(a2);
        }, 3e4);
      });
    };
  }, b1 = () => {
    let [e10, t5] = Ce(Oo), { projectId: r5, written: n10, dismissed: a2, configFile: o10 } = e10 || {};
    return { loading: !e10, projectId: r5, configFile: o10, updateProject: useCallback((i10) => t5({ ...e10, projectId: i10, dismissed: !1 }), [e10, t5]), projectUpdatingFailed: !a2 && n10 === !1, projectIdUpdated: !a2 && n10 === !0, clearProjectIdUpdated: useCallback(() => t5({ ...e10, dismissed: !0 }), [e10, t5]) };
  }, rp = experimental_getStatusStore(z), np = ({ active: e10 }) => {
    let [t5, r5] = Ci(), n10 = useCallback((Yt) => {
      r5(Yt), Yt || Rl("authenticationScreen", "exchangeParameters");
    }, [r5]), { storyId: a2 } = useStorybookState(), [o10] = Ce(Zs), [i10] = Ce(Po), [l2] = Ce(No), [d3] = Ce(Da), [u3, c10] = Ce(Ro), [, p5] = Ce(Da), f4 = useChannel({}), m8 = useCallback((Yt) => {
      rp.unset(), rp.set(Yt);
    }, []), { loading: h2, projectId: g3, configFile: w2, updateProject: y10, projectUpdatingFailed: v5, projectIdUpdated: C3, clearProjectIdUpdated: b8 } = b1(), [I, x2] = Oe("createdProjectId"), [D, le] = Ce(Ho), [Te, we] = Oe("subdomain", "www"), lt = useCallback((Yt) => f4(qs, Yt), [f4]), { isRunning: ft, startBuild: At, stopBuild: rt } = w1({ localBuildProgress: u3, accessToken: t5 }), mt = ep(), On = globalThis.LOGLEVEL === "debug" ? globalThis.fetch : mt, Ye = (Yt) => react_default.createElement(ld, { value: l0({ fetch: On }) }, react_default.createElement(Pl, { value: lt }, react_default.createElement(al, { value: { accessToken: t5, setAccessToken: n10, subdomain: Te, setSubdomain: we } }, react_default.createElement(Dl, { addonUninstalled: D, setAddonUninstalled: le }, react_default.createElement(i5, null, react_default.createElement(jd, { watchState: { isRunning: ft, startBuild: At, stopBuild: rt } }, react_default.createElement("div", { hidden: !e10, style: { containerType: "size", height: "100%" } }, Yt)))))));
    if (!e10) return Ye(null);
    if (globalThis.CONFIG_TYPE !== "DEVELOPMENT") return Ye(react_default.createElement(Hd, null));
    if (D) return Ye(react_default.createElement(Vd, null));
    if (l2) return Ye(react_default.createElement(Dd, { offline: l2 }));
    if (!t5) return Ye(react_default.createElement(kd, { setAccessToken: n10, setCreatedProjectId: x2, hasProjectId: !!g3 }));
    if (i10 || !o10) return Ye(react_default.createElement(Ld, { gitInfoError: i10 }));
    if (h2) return e10 ? react_default.createElement(ja, null) : null;
    if (!g3) return Ye(react_default.createElement(Rd, { createdProjectId: I, setCreatedProjectId: x2, onUpdateProject: y10 }));
    if (v5) {
      if (!w2) throw new Error("Missing config file after configuration failure");
      return Ye(react_default.createElement(Fd, { projectId: g3, configFile: w2 }));
    }
    if (C3) {
      if (!w2) throw new Error("Missing config file after configuration success");
      return Ye(react_default.createElement(Bd, { projectId: g3, configFile: w2, goToNext: b8 }));
    }
    let Ra = o10.branch === u3?.branch;
    return Ye(react_default.createElement(J2, { dismissBuildError: () => c10(void 0), isOutdated: !!d3, localBuildProgress: Ra ? u3 : void 0, setOutdated: p5, updateBuildStatus: m8, projectId: g3, gitInfo: o10, storyId: a2 }));
  }, x1 = Jt(ti()), G9 = styled.div({ display: "flex", justifyContent: "space-between", padding: "8px 0" }), Q9 = styled.div({ display: "flex", flexDirection: "column", marginLeft: 8 }), Y9 = styled.div({ display: "flex", gap: 4 }), J9 = styled.div(({ crashed: e10, theme: t5 }) => ({ fontSize: t5.typography.size.s1, fontWeight: e10 ? "bold" : "normal", color: e10 ? t5.color.negativeText : t5.color.defaultText })), K9 = styled.div(({ theme: e10 }) => ({ fontSize: e10.typography.size.s1, color: e10.textMutedColor })), X9 = styled(ProgressSpinner)({ margin: 4 }), ev = styled(gs)({ width: 10 }), ip = () => {
    let { addNotification: e10, selectStory: t5, setOptions: r5, togglePanel: n10 } = useStorybookApi(), a2 = experimental_useStatusStore((rt) => Object.values(rt).map((mt) => mt[z]?.value).filter((mt) => mt === "status-value:warning").length), o10 = useContext(Wn), { projectId: i10 } = b1(), [l2] = Ci(), d3 = !!l2, [u3, c10] = Ce(No), [p5] = Ce(Da), [f4] = Ce(Ro), [m8] = Ce(Dn), h2 = Object.keys(m8?.problems || {}).length > 0, [g3] = Ce(Po), w2 = useRef(f4?.currentStep), { index: y10, storyId: v5, viewMode: C3 } = useStorybookState(), b8 = experimental_useTestProviderStore((rt) => rt[Ha] ?? "test-provider-state:pending"), { startBuild: I, stopBuild: x2 } = w1({ localBuildProgress: f4, accessToken: l2 }), D;
    u3 && (D = "Not available offline"), h2 && (D = "Configuration problem"), g3 && (D = "Git synchronization problem"), d3 || (D = "Login required"), i10 || (D = "Set up visual tests");
    let le = !D && b8 !== "test-provider-state:crashed", Te = useCallback(() => {
      le && I();
    }, [le, I]);
    useEffect(() => experimental_getTestProviderStore(Ha).onRunAll(Te), [Te]);
    let we = useCallback((rt) => {
      if (r5({ selectedPanel: _t }), n10(!0), y10 && C3 !== "story") {
        let mt = Object.keys(y10).indexOf(v5), On = Object.entries(y10).slice(mt > 0 ? mt : 0), [Ye] = On.find(([, { type: Ra }]) => Ra === "story") || [];
        Ye && t5(Ye);
      }
      rt && o10?.({ action: "openWarning", warning: rt });
    }, [r5, n10, o10, y10, t5, v5, C3]), lt = useCallback(({ onDismiss: rt }) => {
      rt(), we();
    }, [we]);
    useEffect(() => {
      let rt = () => c10(!0), mt = () => c10(!1);
      return window.addEventListener("offline", rt), window.addEventListener("online", mt), () => {
        window.removeEventListener("offline", rt), window.removeEventListener("online", mt);
      };
    }, [c10]), useEffect(() => {
      f4?.currentStep !== w2.current && (w2.current = f4?.currentStep, f4?.currentStep === "error" && e10({ id: `${z}/build-error/${Date.now()}`, content: { headline: "Build error", subHeadline: "Check the Storybook process on the command line for more details." }, icon: react_default.createElement(Bt, { color: color.negative }), onClick: lt }), f4?.currentStep === "limited" && e10({ id: `${z}/build-limited/${Date.now()}`, content: { headline: "Build limited", subHeadline: "Your account has insufficient snapshots remaining to run this build. Visit your billing page to find out more." }, icon: react_default.createElement(Bt, { color: color.negative }), onClick: lt }));
    }, [e10, lt, f4?.currentStep]);
    let ft = useCallback(() => we(D), [we, D]), At;
    switch (!0) {
      case !!D:
        At = react_default.createElement(Link, { onClick: ft }, D);
        break;
      case b8 === "test-provider-state:running":
        At = f4 ? _a[f4.currentStep].renderProgress(f4) : "Starting...";
        break;
      case !!p5:
        At = "Test results outdated";
        break;
      case f4?.currentStep === "aborted":
        At = "Aborted by user";
        break;
      case f4?.currentStep === "complete":
        At = f4.errorCount ? `Encountered ${(0, x1.default)("component error", f4.errorCount, !0)}` : a2 ? `Found ${(0, x1.default)("story", a2, !0)} with ${(0, x1.default)("change", a2)}` : "No visual changes detected";
        break;
      default:
        At = "Not run";
    }
    return react_default.createElement(G9, null, react_default.createElement(Q9, null, react_default.createElement(J9, { crashed: b8 === "test-provider-state:crashed" }, f4?.currentStep === "error" || f4?.currentStep === "limited" ? "Visual tests didn't complete" : "Visual tests"), react_default.createElement(K9, null, At)), react_default.createElement(Y9, null, D ? null : b8 === "test-provider-state:running" ? react_default.createElement(Button, { ariaLabel: "Stop visual tests", size: "medium", variant: "ghost", padding: "none", onClick: x2, disabled: !["initialize", "build", "upload"].includes(f4?.currentStep ?? "") }, react_default.createElement(X9, { percentage: f4?.buildProgressPercentage }, react_default.createElement(ev, null))) : react_default.createElement(Button, { ariaLabel: "Start visual tests", size: "medium", variant: "ghost", padding: "small", disabled: !le, onClick: Te }, react_default.createElement(vs, null))));
  };
  addons.register(z, (e10) => {
    if (e10.on(Ys, (r5, n10) => {
      let a2 = Js.includes(n10.selectors[0]);
      window.open(a2 ? "https://www.chromatic.com/docs/ignoring-elements/#ignoring-elements-inline" : "https://www.chromatic.com/docs/ignoring-elements/#ignoring-elements-via-test-configuration", "_blank");
    }), addons.add(`${z}/ignore-highlight-tool`, { type: Addon_TypesEnum.TOOL, title: "Highlight ignored areas", match: ({ viewMode: r5 }) => r5 === "story", render: () => react_default.createElement(rl, null) }), addons.add(_t, { type: Addon_TypesEnum.PANEL, title: "Visual tests", paramKey: Gs, match: ({ viewMode: r5 }) => r5 === "story", render: ({ active: r5 }) => react_default.createElement(np, { active: !!r5, api: e10 }) }), globalThis.CONFIG_TYPE !== "DEVELOPMENT") return;
    let t5 = experimental_getStatusStore(z);
    t5.onSelect(() => {
      e10.setSelectedPanel(_t), e10.togglePanel(!0);
    }), addons.add(Ha, { type: Addon_TypesEnum.experimental_TEST_PROVIDER, clear: () => {
      t5.unset();
    }, render: () => react_default.createElement(ip, null) });
  });
})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
