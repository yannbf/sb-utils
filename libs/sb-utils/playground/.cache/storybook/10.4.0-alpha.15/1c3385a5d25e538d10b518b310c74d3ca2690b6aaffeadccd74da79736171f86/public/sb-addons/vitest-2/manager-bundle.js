try{
(() => {
  // node_modules/@storybook/addon-vitest/dist/_browser-chunks/chunk-OHAJYSSA.js
  var ADDON_ID = "storybook/interactions", PANEL_ID = `${ADDON_ID}/panel`, DOCUMENTATION_LINK = "writing-tests/integrations/vitest-addon", DOCUMENTATION_DISCREPANCY_LINK = `${DOCUMENTATION_LINK}#what-happens-when-there-are-different-test-results-in-multiple-environments`, ADDON_ID2 = "storybook/a11y", PANEL_ID2 = `${ADDON_ID2}/panel`, UI_STATE_ID = `${ADDON_ID2}/ui`, RESULT = `${ADDON_ID2}/result`, REQUEST = `${ADDON_ID2}/request`, RUNNING = `${ADDON_ID2}/running`, ERROR = `${ADDON_ID2}/error`, MANUAL = `${ADDON_ID2}/manual`, SELECT = `${ADDON_ID2}/select`, DOCUMENTATION_LINK2 = "writing-tests/accessibility-testing", DOCUMENTATION_DISCREPANCY_LINK2 = `${DOCUMENTATION_LINK2}#why-are-my-tests-failing-in-different-environments`, ADDON_ID3 = "storybook/test", TEST_PROVIDER_ID = `${ADDON_ID3}/test-provider`, STORYBOOK_ADDON_TEST_CHANNEL = `${ADDON_ID3}/channel`, DOCUMENTATION_LINK3 = "writing-tests/integrations/vitest-addon", DOCUMENTATION_FATAL_ERROR_LINK = `${DOCUMENTATION_LINK3}#what-happens-if-vitest-itself-has-an-error`, storeOptions = {
    id: ADDON_ID3,
    initialState: {
      config: {
        coverage: !1,
        a11y: !1
      },
      watching: !1,
      cancelling: !1,
      fatalError: void 0,
      index: { entries: {}, v: 5 },
      previewAnnotations: [],
      currentRun: {
        triggeredBy: void 0,
        config: {
          coverage: !1,
          a11y: !1
        },
        componentTestStatuses: [],
        a11yStatuses: [],
        a11yReports: {},
        reports: {},
        componentTestCount: {
          success: 0,
          error: 0
        },
        a11yCount: {
          success: 0,
          warning: 0,
          error: 0
        },
        storyIds: void 0,
        totalTestCount: void 0,
        startedAt: void 0,
        finishedAt: void 0,
        unhandledErrors: [],
        coverageSummary: void 0
      }
    }
  }, FULL_RUN_TRIGGERS = ["global", "run-all"], STORE_CHANNEL_EVENT_NAME = `UNIVERSAL_STORE:${storeOptions.id}`, STATUS_TYPE_ID_COMPONENT_TEST = "storybook/component-test", STATUS_TYPE_ID_A11Y = "storybook/a11y";
  var TRIGGER_TEST_RUN_REQUEST = `${ADDON_ID3}/trigger-test-run-request`, TRIGGER_TEST_RUN_RESPONSE = `${ADDON_ID3}/trigger-test-run-response`;

  // global-externals:react
  var react_default = __REACT__, { Children, Component, Fragment, Profiler, PureComponent, StrictMode, Suspense, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, act, cloneElement, createContext, createElement, createFactory, createRef, forwardRef, isValidElement, lazy, memo, startTransition, unstable_act, useCallback, useContext, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore, useTransition, version } = __REACT__;

  // global-externals:storybook/internal/types
  var types_default = __STORYBOOK_TYPES__, { Addon_TypesEnum, CHANGE_DETECTION_STATUS_TYPE_ID, CoreWebpackCompiler, Feature, SupportedBuilder, SupportedLanguage, SupportedRenderer } = __STORYBOOK_TYPES__;

  // global-externals:storybook/manager-api
  var manager_api_default = __STORYBOOK_API__, { ActiveTabs, Consumer, ManagerContext, Provider, RequestResponseError, Tag, addons, combineParameters, controlOrMetaKey, controlOrMetaSymbol, eventMatchesShortcut, eventToShortcut, experimental_MockUniversalStore, experimental_UniversalStore, experimental_getStatusStore, experimental_getTestProviderStore, experimental_requestResponse, experimental_useStatusStore, experimental_useTestProviderStore, experimental_useUniversalStore, internal_checklistStore, internal_fullStatusStore, internal_fullTestProviderStore, internal_universalChecklistStore, internal_universalStatusStore, internal_universalTestProviderStore, isMacLike, isShortcutTaken, keyToSymbol, merge, mockChannel, optionOrAltSymbol, shortcutMatchesShortcut, shortcutToAriaKeyshortcuts, shortcutToHumanString, types, useAddonState, useArgTypes, useArgs, useChannel, useGlobalTypes, useGlobals, useParameter, useSharedState, useStoryPrepared, useStorybookApi, useStorybookState } = __STORYBOOK_API__;

  // global-externals:storybook/internal/components
  var components_default = __STORYBOOK_COMPONENTS__, { A, AbstractToolbar, ActionBar, ActionList, AddonPanel, Badge, Bar, Blockquote, Button, Card, ClipboardCode, Code, Collapsible, DL, Div, DocumentWrapper, EmptyTabContent, ErrorFormatter, FlexBar, Form, H1, H2, H3, H4, H5, H6, HR, IconButton, Img, LI, Link, ListItem, Loader, Modal, ModalDecorator, OL, P, Placeholder, Popover, PopoverProvider, Pre, ProgressSpinner, ResetWrapper, ScrollArea, Select, Separator, Spaced, Span, StatelessTab, StatelessTabList, StatelessTabPanel, StatelessTabsView, StorybookIcon, StorybookLogo, SyntaxHighlighter, TT, TabBar, TabButton, TabList, TabPanel, TabWrapper, Table, Tabs, TabsState, TabsView, ToggleButton, Toolbar, Tooltip, TooltipLinkList, TooltipMessage, TooltipNote, TooltipProvider, UL, WithTooltip, WithTooltipPure, Zoom, codeCommon, components, convertToReactAriaPlacement, createCopyToClipboardFunction, getStoryHref, interleaveSeparators, nameSpaceClassNames, resetComponents, useTabsState, withReset } = __STORYBOOK_COMPONENTS__;

  // global-externals:@storybook/icons
  var icons_default = __STORYBOOK_ICONS__, { AccessibilityAltIcon, AccessibilityIcon, AccessibilityIgnoredIcon, AddIcon, AdminIcon, AlertAltIcon, AlertIcon, AlignLeftIcon, AlignRightIcon, AppleIcon, ArrowBottomLeftIcon, ArrowBottomRightIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowSolidDownIcon, ArrowSolidLeftIcon, ArrowSolidRightIcon, ArrowSolidUpIcon, ArrowTopLeftIcon, ArrowTopRightIcon, ArrowUpIcon, AzureDevOpsIcon, BackIcon, BasketIcon, BatchAcceptIcon, BatchDenyIcon, BeakerIcon, BellIcon, BitbucketIcon, BoldIcon, BookIcon, BookmarkHollowIcon, BookmarkIcon, BottomBarIcon, BottomBarToggleIcon, BoxIcon, BranchIcon, BrowserIcon, BugIcon, ButtonIcon, CPUIcon, CalendarIcon, CameraIcon, CameraStabilizeIcon, CategoryIcon, CertificateIcon, ChangedIcon, ChatIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronSmallDownIcon, ChevronSmallLeftIcon, ChevronSmallRightIcon, ChevronSmallUpIcon, ChevronUpIcon, ChromaticIcon, ChromeIcon, CircleHollowIcon, CircleIcon, ClearIcon, CloseAltIcon, CloseIcon, CloudHollowIcon, CloudIcon, CogIcon, CollapseIcon, CommandIcon, CommentAddIcon, CommentIcon, CommentsIcon, CommitIcon, CompassIcon, ComponentDrivenIcon, ComponentIcon, ContrastIcon, ContrastIgnoredIcon, ControlsIcon, CopyIcon, CreditIcon, CrossIcon, DashboardIcon, DatabaseIcon, DeleteIcon, DiamondIcon, DirectionIcon, DiscordIcon, DocChartIcon, DocListIcon, DocumentIcon, DownloadIcon, DragIcon, EditIcon, EditorIcon, EllipsisIcon, EmailIcon, ExpandAltIcon, ExpandIcon, EyeCloseIcon, EyeIcon, FaceHappyIcon, FaceNeutralIcon, FaceSadIcon, FacebookIcon, FailedIcon, FastForwardIcon, FigmaIcon, FilterIcon, FlagIcon, FolderIcon, FormIcon, GDriveIcon, GiftIcon, GithubIcon, GitlabIcon, GlobeIcon, GoogleIcon, GraphBarIcon, GraphLineIcon, GraphqlIcon, GridAltIcon, GridIcon, GrowIcon, HeartHollowIcon, HeartIcon, HomeIcon, HourglassIcon, InfoIcon, ItalicIcon, JumpToIcon, KeyIcon, LightningIcon, LightningOffIcon, LinkBrokenIcon, LinkIcon, LinkedinIcon, LinuxIcon, ListOrderedIcon, ListUnorderedIcon, LocationIcon, LockIcon, MarkdownIcon, MarkupIcon, MediumIcon, MemoryIcon, MenuIcon, MergeIcon, MirrorIcon, MobileIcon, MoonIcon, NutIcon, OutboxIcon, OutlineIcon, PaintBrushAltIcon, PaintBrushIcon, PaperClipIcon, ParagraphIcon, PassedIcon, PhoneIcon, PhotoDragIcon, PhotoIcon, PhotoStabilizeIcon, PinAltIcon, PinIcon, PlayAllHollowIcon, PlayBackIcon, PlayHollowIcon, PlayIcon, PlayNextIcon, PlusIcon, PointerDefaultIcon, PointerHandIcon, PowerIcon, PrintIcon, ProceedIcon, ProfileIcon, PullRequestIcon, QuestionIcon, RSSIcon, RedirectIcon, ReduxIcon, RefreshIcon, ReplyIcon, RepoIcon, RequestChangeIcon, RewindIcon, RulerIcon, SaveIcon, SearchIcon, ShareAltIcon, ShareIcon, ShieldIcon, SideBySideIcon, SidebarAltIcon, SidebarAltToggleIcon, SidebarIcon, SidebarToggleIcon, SortDownIcon, SortUpIcon, SpeakerIcon, StackedIcon, StarHollowIcon, StarIcon, StatusFailIcon, StatusIcon, StatusPassIcon, StatusWarnIcon, StickerIcon, StopAltHollowIcon, StopAltIcon, StopIcon, StorybookIcon: StorybookIcon2, StructureIcon, SubtractIcon, SunIcon, SupportIcon, SweepIcon, SwitchAltIcon, SyncIcon, TabletIcon, ThumbsUpIcon, TimeIcon, TimerIcon, TransferIcon, TrashIcon, TwitterIcon, TypeIcon, UbuntuIcon, UndoIcon, UnfoldIcon, UnlockIcon, UnpinIcon, UploadIcon, UserAddIcon, UserAltIcon, UserIcon, UsersIcon, VSCodeIcon, VerifiedIcon, VideoIcon, WandIcon, WatchIcon, WindowsIcon, WrenchIcon, XIcon, YoutubeIcon, ZoomIcon, ZoomOutIcon, ZoomResetIcon, iconList } = __STORYBOOK_ICONS__;

  // global-externals:storybook/theming
  var theming_default = __STORYBOOK_THEMING__, { CacheProvider, ClassNames, Global, ThemeProvider, background, color, convert, create, createCache, createGlobal, createReset, css, darken, ensure, getPreferredColorScheme, ignoreSsrWarning, isPropValid, jsx, keyframes, lighten, srOnlyStyles, styled, themes, tokens, typography, useTheme, withTheme } = __STORYBOOK_THEMING__;

  // node_modules/@storybook/addon-vitest/dist/manager.js
  var store = experimental_UniversalStore.create({
    ...storeOptions,
    leader: globalThis.CONFIG_TYPE === "PRODUCTION"
  }), componentTestStatusStore = experimental_getStatusStore(STATUS_TYPE_ID_COMPONENT_TEST), a11yStatusStore = experimental_getStatusStore(STATUS_TYPE_ID_A11Y), testProviderStore = experimental_getTestProviderStore(ADDON_ID3), ModalBar = styled.div({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 6px 6px 20px"
  }), ModalActionBar = styled.div({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }), ModalTitle = styled(Modal.Title)(({ theme: { typography: typography2 } }) => ({
    fontSize: typography2.size.s2,
    fontWeight: typography2.weight.bold
  })), ModalStackTrace = styled.pre(({ theme }) => ({
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    userSelect: "text",
    overflow: "auto",
    maxHeight: "60vh",
    margin: 0,
    padding: "20px",
    fontFamily: theme.typography.fonts.mono,
    fontSize: "12px",
    borderTop: `1px solid ${theme.appBorderColor}`,
    borderRadius: 0
  })), TroubleshootLink = styled.a(({ theme }) => ({
    color: theme.color.defaultText
  })), GlobalErrorContext = react_default.createContext({
    isModalOpen: !1,
    setModalOpen: void 0
  });
  function ErrorCause({ error }) {
    return error ? react_default.createElement("div", null, react_default.createElement("h4", null, "Caused by: ", error.name || "Error", ": ", error.message), error.stack && react_default.createElement("pre", null, error.stack), error.cause && react_default.createElement(ErrorCause, { error: error.cause })) : null;
  }
  function GlobalErrorModal({ onRerun, storeState }) {
    let api = useStorybookApi(), { isModalOpen, setModalOpen } = useContext(GlobalErrorContext), troubleshootURL = api.getDocsUrl({
      subpath: DOCUMENTATION_FATAL_ERROR_LINK,
      versioned: !0,
      renderer: !0
    }), {
      fatalError,
      currentRun: { unhandledErrors }
    } = storeState, content = fatalError ? react_default.createElement(react_default.Fragment, null, react_default.createElement("p", null, fatalError.error.name || "Error"), fatalError.message && react_default.createElement("p", null, fatalError.message), fatalError.error.message && react_default.createElement("p", null, fatalError.error.message), fatalError.error.stack && react_default.createElement("p", null, fatalError.error.stack), fatalError.error.cause && react_default.createElement(ErrorCause, { error: fatalError.error.cause })) : unhandledErrors.length > 0 ? react_default.createElement("ol", null, unhandledErrors.map((error) => react_default.createElement("li", { key: error.name + error.message }, react_default.createElement("p", null, error.name, ": ", error.message), error.VITEST_TEST_PATH && react_default.createElement("p", null, 'This error originated in "', react_default.createElement("b", null, error.VITEST_TEST_PATH), `". It doesn't mean the error was thrown inside the file itself, but while it was running.`), error.VITEST_TEST_NAME && react_default.createElement(react_default.Fragment, null, react_default.createElement("p", null, `The latest test that might've caused the error is "`, react_default.createElement("b", null, error.VITEST_TEST_NAME), '". It might mean one of the following:'), react_default.createElement("ul", null, react_default.createElement("li", null, "The error was thrown, while Vitest was running this test."), react_default.createElement("li", null, "If the error occurred after the test had been completed, this was the last documented test before it was thrown."))), error.stacks && react_default.createElement(react_default.Fragment, null, react_default.createElement("p", null, react_default.createElement("b", null, "Stacks:")), react_default.createElement("ul", null, error.stacks.map((stack) => react_default.createElement("li", { key: stack.file + stack.line + stack.column }, stack.file, ":", stack.line, ":", stack.column, " - ", stack.method || "unknown method")))), error.stack && react_default.createElement("p", null, error.stack), error.cause ? react_default.createElement(ErrorCause, { error: error.cause }) : null))) : null;
    return react_default.createElement(Modal, { ariaLabel: "Storybook Test Error Details", onOpenChange: setModalOpen, open: isModalOpen }, react_default.createElement(ModalBar, null, react_default.createElement(ModalTitle, null, "Storybook Test Error Details"), react_default.createElement(ModalActionBar, null, react_default.createElement(Button, { onClick: onRerun, variant: "ghost", ariaLabel: !1 }, react_default.createElement(SyncIcon, null), "Rerun"), react_default.createElement(Button, { variant: "ghost", ariaLabel: !1, asChild: !0 }, react_default.createElement("a", { target: "_blank", href: troubleshootURL, rel: "noreferrer" }, "Troubleshoot")), react_default.createElement(Modal.Close, null))), react_default.createElement(ModalStackTrace, null, content, react_default.createElement("br", null), react_default.createElement("br", null), "Troubleshoot:", " ", react_default.createElement(TroubleshootLink, { target: "_blank", href: troubleshootURL }, troubleshootURL)));
  }
  function isPlainObject(value) {
    if (!value || typeof value != "object")
      return !1;
    let proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null ? Object.prototype.toString.call(value) === "[object Object]" : !1;
  }
  function getSymbols(object) {
    return Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
  }
  function getTag(value) {
    return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
  }
  var regexpTag = "[object RegExp]", stringTag = "[object String]", numberTag = "[object Number]", booleanTag = "[object Boolean]", argumentsTag = "[object Arguments]", symbolTag = "[object Symbol]", dateTag = "[object Date]", mapTag = "[object Map]", setTag = "[object Set]", arrayTag = "[object Array]", functionTag = "[object Function]", arrayBufferTag = "[object ArrayBuffer]", objectTag = "[object Object]", errorTag = "[object Error]", dataViewTag = "[object DataView]", uint8ArrayTag = "[object Uint8Array]", uint8ClampedArrayTag = "[object Uint8ClampedArray]", uint16ArrayTag = "[object Uint16Array]", uint32ArrayTag = "[object Uint32Array]", bigUint64ArrayTag = "[object BigUint64Array]", int8ArrayTag = "[object Int8Array]", int16ArrayTag = "[object Int16Array]", int32ArrayTag = "[object Int32Array]", bigInt64ArrayTag = "[object BigInt64Array]", float32ArrayTag = "[object Float32Array]", float64ArrayTag = "[object Float64Array]";
  function eq(value, other) {
    return value === other || Number.isNaN(value) && Number.isNaN(other);
  }
  function isEqualWith(a, b, areValuesEqual) {
    return isEqualWithImpl(a, b, void 0, void 0, void 0, void 0, areValuesEqual);
  }
  function isEqualWithImpl(a, b, property, aParent, bParent, stack, areValuesEqual) {
    let result = areValuesEqual(a, b, property, aParent, bParent, stack);
    if (result !== void 0)
      return result;
    if (typeof a == typeof b)
      switch (typeof a) {
        case "bigint":
        case "string":
        case "boolean":
        case "symbol":
        case "undefined":
          return a === b;
        case "number":
          return a === b || Object.is(a, b);
        case "function":
          return a === b;
        case "object":
          return areObjectsEqual(a, b, stack, areValuesEqual);
      }
    return areObjectsEqual(a, b, stack, areValuesEqual);
  }
  function areObjectsEqual(a, b, stack, areValuesEqual) {
    if (Object.is(a, b))
      return !0;
    let aTag = getTag(a), bTag = getTag(b);
    if (aTag === argumentsTag && (aTag = objectTag), bTag === argumentsTag && (bTag = objectTag), aTag !== bTag)
      return !1;
    switch (aTag) {
      case stringTag:
        return a.toString() === b.toString();
      case numberTag: {
        let x = a.valueOf(), y = b.valueOf();
        return eq(x, y);
      }
      case booleanTag:
      case dateTag:
      case symbolTag:
        return Object.is(a.valueOf(), b.valueOf());
      case regexpTag:
        return a.source === b.source && a.flags === b.flags;
      case functionTag:
        return a === b;
    }
    stack = stack ?? /* @__PURE__ */ new Map();
    let aStack = stack.get(a), bStack = stack.get(b);
    if (aStack != null && bStack != null)
      return aStack === b;
    stack.set(a, b), stack.set(b, a);
    try {
      switch (aTag) {
        case mapTag: {
          if (a.size !== b.size)
            return !1;
          for (let [key, value] of a.entries())
            if (!b.has(key) || !isEqualWithImpl(value, b.get(key), key, a, b, stack, areValuesEqual))
              return !1;
          return !0;
        }
        case setTag: {
          if (a.size !== b.size)
            return !1;
          let aValues = Array.from(a.values()), bValues = Array.from(b.values());
          for (let i = 0; i < aValues.length; i++) {
            let aValue = aValues[i], index = bValues.findIndex((bValue) => isEqualWithImpl(aValue, bValue, void 0, a, b, stack, areValuesEqual));
            if (index === -1)
              return !1;
            bValues.splice(index, 1);
          }
          return !0;
        }
        case arrayTag:
        case uint8ArrayTag:
        case uint8ClampedArrayTag:
        case uint16ArrayTag:
        case uint32ArrayTag:
        case bigUint64ArrayTag:
        case int8ArrayTag:
        case int16ArrayTag:
        case int32ArrayTag:
        case bigInt64ArrayTag:
        case float32ArrayTag:
        case float64ArrayTag: {
          if (typeof Buffer < "u" && Buffer.isBuffer(a) !== Buffer.isBuffer(b) || a.length !== b.length)
            return !1;
          for (let i = 0; i < a.length; i++)
            if (!isEqualWithImpl(a[i], b[i], i, a, b, stack, areValuesEqual))
              return !1;
          return !0;
        }
        case arrayBufferTag:
          return a.byteLength !== b.byteLength ? !1 : areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
        case dataViewTag:
          return a.byteLength !== b.byteLength || a.byteOffset !== b.byteOffset ? !1 : areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
        case errorTag:
          return a.name === b.name && a.message === b.message;
        case objectTag: {
          if (!(areObjectsEqual(a.constructor, b.constructor, stack, areValuesEqual) || isPlainObject(a) && isPlainObject(b)))
            return !1;
          let aKeys = [...Object.keys(a), ...getSymbols(a)], bKeys = [...Object.keys(b), ...getSymbols(b)];
          if (aKeys.length !== bKeys.length)
            return !1;
          for (let i = 0; i < aKeys.length; i++) {
            let propKey = aKeys[i], aProp = a[propKey];
            if (!Object.hasOwn(b, propKey))
              return !1;
            let bProp = b[propKey];
            if (!isEqualWithImpl(aProp, bProp, propKey, a, b, stack, areValuesEqual))
              return !1;
          }
          return !0;
        }
        default:
          return !1;
      }
    } finally {
      stack.delete(a), stack.delete(b);
    }
  }
  function noop() {
  }
  function isEqual(a, b) {
    return isEqualWith(a, b, noop);
  }
  var statusValueToStoryIds = (allStatuses, typeId, storyIds) => {
    let statusValueToStoryIdsMap = {
      "status-value:pending": [],
      "status-value:success": [],
      "status-value:error": [],
      "status-value:warning": [],
      "status-value:unknown": []
    };
    return (storyIds ? storyIds.map((storyId) => allStatuses[storyId]).filter(Boolean) : Object.values(allStatuses)).forEach((statusByTypeId) => {
      let status = statusByTypeId[typeId];
      status && statusValueToStoryIdsMap[status.value].push(status.storyId);
    }), statusValueToStoryIdsMap;
  }, useTestProvider = (api, entryId) => {
    let testProviderState = experimental_useTestProviderStore((s) => s[ADDON_ID3]), [storeState, setStoreState] = experimental_useUniversalStore(store), [isSettingsUpdated, setIsSettingsUpdated] = useState(!1), settingsUpdatedTimeoutRef = useRef();
    useEffect(() => {
      let unsubscribe = store.onStateChange((state, previousState) => {
        isEqual(state.config, previousState.config) || (testProviderStore.settingsChanged(), setIsSettingsUpdated(!0), clearTimeout(settingsUpdatedTimeoutRef.current), settingsUpdatedTimeoutRef.current = setTimeout(() => {
          setIsSettingsUpdated(!1);
        }, 1e3));
      });
      return () => {
        unsubscribe(), clearTimeout(settingsUpdatedTimeoutRef.current);
      };
    }, []);
    let storyIds = useMemo(
      () => entryId ? api.findAllLeafStoryIds(entryId) : void 0,
      [entryId, api]
    ), componentTestStatusSelector = useCallback(
      (allStatuses) => statusValueToStoryIds(allStatuses, STATUS_TYPE_ID_COMPONENT_TEST, storyIds),
      [storyIds]
    ), componentTestStatusValueToStoryIds = experimental_useStatusStore(
      componentTestStatusSelector
    ), a11yStatusValueToStoryIdsSelector = useCallback(
      (allStatuses) => statusValueToStoryIds(allStatuses, STATUS_TYPE_ID_A11Y, storyIds),
      [storyIds]
    ), a11yStatusValueToStoryIds = experimental_useStatusStore(a11yStatusValueToStoryIdsSelector);
    return {
      storeState,
      setStoreState,
      testProviderState,
      componentTestStatusValueToStoryIds,
      a11yStatusValueToStoryIds,
      isSettingsUpdated
    };
  }, $319e236875307eab$var$liveAnnouncer = null;
  function $319e236875307eab$export$a9b970dcc4ae71a9(message, assertiveness = "assertive", timeout = 7e3) {
    $319e236875307eab$var$liveAnnouncer ? $319e236875307eab$var$liveAnnouncer.announce(message, assertiveness, timeout) : ($319e236875307eab$var$liveAnnouncer = new $319e236875307eab$var$LiveAnnouncer(), (typeof IS_REACT_ACT_ENVIRONMENT == "boolean" ? IS_REACT_ACT_ENVIRONMENT : typeof jest < "u") ? $319e236875307eab$var$liveAnnouncer.announce(message, assertiveness, timeout) : setTimeout(() => {
      $319e236875307eab$var$liveAnnouncer?.isAttached() && $319e236875307eab$var$liveAnnouncer?.announce(message, assertiveness, timeout);
    }, 100));
  }
  var $319e236875307eab$var$LiveAnnouncer = class {
    isAttached() {
      var _this_node;
      return (_this_node = this.node) === null || _this_node === void 0 ? void 0 : _this_node.isConnected;
    }
    createLog(ariaLive) {
      let node = document.createElement("div");
      return node.setAttribute("role", "log"), node.setAttribute("aria-live", ariaLive), node.setAttribute("aria-relevant", "additions"), node;
    }
    destroy() {
      this.node && (document.body.removeChild(this.node), this.node = null);
    }
    announce(message, assertiveness = "assertive", timeout = 7e3) {
      var _this_assertiveLog, _this_politeLog;
      if (!this.node) return;
      let node = document.createElement("div");
      typeof message == "object" ? (node.setAttribute("role", "img"), node.setAttribute("aria-labelledby", message["aria-labelledby"])) : node.textContent = message, assertiveness === "assertive" ? (_this_assertiveLog = this.assertiveLog) === null || _this_assertiveLog === void 0 || _this_assertiveLog.appendChild(node) : (_this_politeLog = this.politeLog) === null || _this_politeLog === void 0 || _this_politeLog.appendChild(node), message !== "" && setTimeout(() => {
        node.remove();
      }, timeout);
    }
    clear(assertiveness) {
      this.node && ((!assertiveness || assertiveness === "assertive") && this.assertiveLog && (this.assertiveLog.innerHTML = ""), (!assertiveness || assertiveness === "polite") && this.politeLog && (this.politeLog.innerHTML = ""));
    }
    constructor() {
      this.node = null, this.assertiveLog = null, this.politeLog = null, typeof document < "u" && (this.node = document.createElement("div"), this.node.dataset.liveAnnouncer = "true", Object.assign(this.node.style, {
        border: 0,
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap"
      }), this.assertiveLog = this.createLog("assertive"), this.node.appendChild(this.assertiveLog), this.politeLog = this.createLog("polite"), this.node.appendChild(this.politeLog), document.body.prepend(this.node));
    }
  }, RelativeTime = ({ timestamp }) => {
    let [timeAgo, setTimeAgo] = useState(null);
    if (useEffect(() => {
      if (timestamp) {
        setTimeAgo(Date.now() - timestamp);
        let interval = setInterval(() => setTimeAgo(Date.now() - timestamp), 1e4);
        return () => clearInterval(interval);
      }
    }, [timestamp]), timeAgo === null)
      return null;
    let seconds = Math.round(timeAgo / 1e3);
    if (seconds < 60)
      return "just now";
    let minutes = Math.floor(seconds / 60);
    if (minutes < 60)
      return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
    let hours = Math.floor(minutes / 60);
    if (hours < 24)
      return hours === 1 ? "an hour ago" : `${hours} hours ago`;
    let days = Math.floor(hours / 24);
    return days === 1 ? "yesterday" : `${days} days ago`;
  }, Wrapper = styled.div(({ theme }) => ({
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontSize: theme.typography.size.s1,
    color: theme.textMutedColor
  })), PositiveText = styled.span(({ theme }) => ({
    color: theme.color.positiveText
  }));
  function Description({
    entryId,
    storeState,
    testProviderState,
    isSettingsUpdated,
    ...props
  }) {
    let { setModalOpen } = react_default.useContext(GlobalErrorContext), { componentTestCount, totalTestCount, unhandledErrors, finishedAt } = storeState.currentRun, finishedTestCount = componentTestCount.success + componentTestCount.error, description = "Not run";
    if (!entryId && isSettingsUpdated)
      description = react_default.createElement(PositiveText, null, "Settings updated");
    else if (testProviderState === "test-provider-state:running")
      description = (finishedTestCount ?? 0) === 0 ? "Starting..." : `Testing... ${finishedTestCount}/${totalTestCount}`;
    else if (!entryId && testProviderState === "test-provider-state:crashed")
      description = setModalOpen ? react_default.createElement(Link, { onClick: () => setModalOpen(!0) }, "View full error") : "Crashed";
    else if (!entryId && unhandledErrors.length > 0) {
      let unhandledErrorDescription = `View ${unhandledErrors.length} unhandled error${unhandledErrors?.length > 1 ? "s" : ""}`;
      description = setModalOpen ? react_default.createElement(Link, { onClick: () => setModalOpen(!0) }, unhandledErrorDescription) : unhandledErrorDescription;
    } else entryId && totalTestCount ? description = `Ran ${totalTestCount} ${totalTestCount === 1 ? "test" : "tests"}` : finishedAt ? description = react_default.createElement(react_default.Fragment, null, "Ran ", totalTestCount, " ", totalTestCount === 1 ? "test" : "tests", " ", react_default.createElement(RelativeTime, { timestamp: finishedAt })) : storeState.watching && (description = "Watching for file changes");
    return react_default.createElement(Wrapper, { ...props }, description);
  }
  var TestStatusIcon = styled.div(
    ({ percentage }) => ({
      width: percentage ? 12 : 6,
      height: percentage ? 12 : 6,
      margin: percentage ? 1 : 4,
      background: percentage ? `conic-gradient(var(--status-color) ${percentage}%, var(--status-background) ${percentage + 1}%)` : "var(--status-color)",
      borderRadius: "50%"
    }),
    ({ isRunning, theme }) => isRunning && {
      animation: `${theme.animation.glow} 1.5s ease-in-out infinite`
    },
    ({ status, theme }) => status === "positive" && {
      "--status-color": theme.color.positive,
      "--status-background": `${theme.color.positive}66`
    },
    ({ status, theme }) => status === "warning" && {
      "--status-color": theme.color.gold,
      "--status-background": `${theme.color.gold}66`
    },
    ({ status, theme }) => status === "negative" && {
      "--status-color": theme.color.negative,
      "--status-background": `${theme.color.negative}66`
    },
    ({ status, theme }) => status === "critical" && {
      "--status-color": theme.color.defaultText,
      "--status-background": `${theme.color.defaultText}66`
    },
    ({ status, theme }) => status === "unknown" && {
      "--status-color": theme.textMutedColor,
      "--status-background": `${theme.textMutedColor}66`
    }
  ), Container = styled.div(({ inContextMenu }) => ({
    display: "flex",
    flexDirection: "column",
    paddingBottom: inContextMenu ? 0 : 1
  })), Heading = styled.div({
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    gap: 12
  }), Info = styled.div({
    display: "flex",
    flexDirection: "column",
    marginLeft: 8,
    minWidth: 0
  }), Title = styled.div(({ crashed, theme }) => ({
    fontSize: theme.typography.size.s1,
    fontWeight: crashed ? "bold" : "normal",
    color: crashed ? theme.color.negativeText : theme.color.defaultText
  })), Actions = styled.div({
    display: "flex",
    gap: 4
  }), StyledActionList = styled(ActionList)({
    padding: 0
  }), Muted = styled.span(({ theme }) => ({
    color: theme.textMutedColor
  })), Progress = styled(ProgressSpinner)({
    margin: 4
  }), StopIcon2 = styled(StopAltIcon)({
    width: 10
  }), openPanel = ({ api, panelId, entryId }) => {
    let story = entryId ? api.findAllLeafStoryIds(entryId)[0] : void 0;
    story && api.selectStory(story), api.setSelectedPanel(panelId), api.togglePanel(!0);
  }, TestProviderRender = ({
    api,
    entry,
    testProviderState,
    storeState,
    setStoreState,
    componentTestStatusValueToStoryIds,
    a11yStatusValueToStoryIds,
    isSettingsUpdated,
    ...props
  }) => {
    let { config, watching, cancelling, currentRun, fatalError } = storeState, finishedTestCount = currentRun.componentTestCount.success + currentRun.componentTestCount.error, hasA11yAddon = addons.experimental_getRegisteredAddons().includes(ADDON_ID2), isRunning = testProviderState === "test-provider-state:running", isStarting = isRunning && finishedTestCount === 0, [componentTestStatusIcon, componentTestStatusLabel] = fatalError ? ["critical", "Component tests crashed"] : componentTestStatusValueToStoryIds["status-value:error"].length > 0 ? ["negative", "Component tests failed"] : isRunning ? ["unknown", "Testing in progress"] : componentTestStatusValueToStoryIds["status-value:success"].length > 0 ? ["positive", "Component tests passed"] : ["unknown", "Run tests to see results"], [a11yStatusIcon, a11yStatusLabel] = fatalError ? ["critical", "Component tests crashed"] : a11yStatusValueToStoryIds["status-value:error"].length > 0 ? ["negative", "Accessibility tests failed"] : a11yStatusValueToStoryIds["status-value:warning"].length > 0 ? ["warning", "Accessibility tests failed"] : isRunning ? ["unknown", "Testing in progress"] : a11yStatusValueToStoryIds["status-value:success"].length > 0 ? ["positive", "Accessibility tests passed"] : ["unknown", "Run tests to see accessibility results"], prevTestProviderStateRef = useRef(testProviderState);
    return useEffect(() => {
      let prevState = prevTestProviderStateRef.current;
      if (prevTestProviderStateRef.current = testProviderState, prevState !== testProviderState) {
        if (testProviderState === "test-provider-state:running")
          $319e236875307eab$export$a9b970dcc4ae71a9("Test run started.", "polite");
        else if (testProviderState === "test-provider-state:crashed")
          $319e236875307eab$export$a9b970dcc4ae71a9("Test run crashed.", "assertive");
        else if (testProviderState === "test-provider-state:succeeded" && prevState === "test-provider-state:running") {
          let parts = [], errorCount = componentTestStatusValueToStoryIds["status-value:error"].length, warningCount = componentTestStatusValueToStoryIds["status-value:warning"].length, passedCount = componentTestStatusValueToStoryIds["status-value:success"].length;
          errorCount > 0 && parts.push(`${errorCount} ${errorCount === 1 ? "component" : "components"} errored`), warningCount > 0 && parts.push(
            `${warningCount} ${warningCount === 1 ? "component" : "components"} with warnings`
          ), passedCount > 0 && parts.push(`${passedCount} ${passedCount === 1 ? "component" : "components"} passed`);
          let a11yErrorCount = 0;
          if (hasA11yAddon) {
            a11yErrorCount = a11yStatusValueToStoryIds["status-value:error"].length;
            let a11yWarningCount = a11yStatusValueToStoryIds["status-value:warning"].length;
            a11yErrorCount > 0 && parts.push(
              `${a11yErrorCount} accessibility ${a11yErrorCount === 1 ? "error" : "errors"}`
            ), a11yWarningCount > 0 && parts.push(
              `${a11yWarningCount} accessibility ${a11yWarningCount === 1 ? "warning" : "warnings"}`
            );
          }
          let message = parts.length > 0 ? `Test run finished. ${parts.join(", ")}.` : "Test run finished. No results.", hasErrors = errorCount > 0 || hasA11yAddon && a11yErrorCount > 0;
          $319e236875307eab$export$a9b970dcc4ae71a9(message, hasErrors ? "assertive" : "polite");
        }
      }
    }, [
      testProviderState,
      componentTestStatusValueToStoryIds,
      a11yStatusValueToStoryIds,
      hasA11yAddon
    ]), react_default.createElement(Container, { ...props, inContextMenu: !!entry }, react_default.createElement(Heading, null, react_default.createElement(Info, null, entry ? react_default.createElement(Title, { id: "testing-module-title" }, "Run component tests") : react_default.createElement(
      Title,
      {
        id: "testing-module-title",
        crashed: testProviderState === "test-provider-state:crashed" || fatalError !== void 0 || currentRun.unhandledErrors.length > 0
      },
      currentRun.unhandledErrors.length === 1 ? "Component tests completed with an error" : currentRun.unhandledErrors.length > 1 ? "Component tests completed with errors" : fatalError ? "Component tests didn\u2019t complete" : "Run component tests"
    ), react_default.createElement(
      Description,
      {
        id: "testing-module-description",
        storeState,
        testProviderState,
        entryId: entry?.id,
        isSettingsUpdated
      }
    )), react_default.createElement(Actions, null, !entry && react_default.createElement(
      ToggleButton,
      {
        ariaLabel: isRunning ? "Watch mode (cannot toggle while running)" : "Watch mode",
        tooltip: isRunning ? "Watch mode unavailable while running" : `Watch mode is ${watching ? "enabled" : "disabled"}`,
        padding: "small",
        size: "medium",
        variant: "ghost",
        pressed: watching,
        onClick: () => store.send({
          type: "TOGGLE_WATCHING",
          payload: {
            to: !watching
          }
        }),
        disabled: isRunning
      },
      react_default.createElement(EyeIcon, null)
    ), isRunning ? react_default.createElement(
      Button,
      {
        ariaLabel: cancelling ? "Stop test run (already stopping...)" : "Stop test run",
        padding: "none",
        size: "medium",
        variant: "ghost",
        onClick: () => store.send({
          type: "CANCEL_RUN"
        }),
        disabled: cancelling || isStarting
      },
      react_default.createElement(
        Progress,
        {
          percentage: finishedTestCount && storeState.currentRun.totalTestCount ? finishedTestCount / storeState.currentRun.totalTestCount * 100 : void 0
        },
        react_default.createElement(StopIcon2, null)
      )
    ) : react_default.createElement(
      Button,
      {
        ariaLabel: "Start test run",
        padding: "small",
        size: "medium",
        variant: "ghost",
        onClick: () => {
          let storyIds;
          entry && (storyIds = entry.type === "story" ? [entry.id] : api.findAllLeafStoryIds(entry.id)), store.send({
            type: "TRIGGER_RUN",
            payload: { storyIds, triggeredBy: entry?.type ?? "global" }
          });
        }
      },
      react_default.createElement(PlayHollowIcon, null)
    ))), react_default.createElement(StyledActionList, null, react_default.createElement(ActionList.Item, null, entry ? react_default.createElement(ActionList.Text, null, "Interactions") : react_default.createElement(ActionList.Action, { as: "label", readOnly: !0 }, react_default.createElement(ActionList.Icon, null, react_default.createElement(Form.Checkbox, { name: "Interactions", checked: !0, disabled: !0 })), react_default.createElement(ActionList.Text, null, "Interactions")), react_default.createElement(
      ActionList.Button,
      {
        ariaLabel: `${componentTestStatusLabel}${componentTestStatusValueToStoryIds["status-value:error"].length + componentTestStatusValueToStoryIds["status-value:warning"].length > 0 ? ` (${componentTestStatusValueToStoryIds["status-value:error"].length + componentTestStatusValueToStoryIds["status-value:warning"].length} errors or warnings so far)` : ""}`,
        tooltip: componentTestStatusLabel,
        disabled: componentTestStatusValueToStoryIds["status-value:error"].length === 0 && componentTestStatusValueToStoryIds["status-value:warning"].length === 0 && componentTestStatusValueToStoryIds["status-value:success"].length === 0,
        onClick: () => {
          openPanel({
            api,
            panelId: PANEL_ID,
            entryId: componentTestStatusValueToStoryIds["status-value:error"][0] ?? componentTestStatusValueToStoryIds["status-value:warning"][0] ?? componentTestStatusValueToStoryIds["status-value:success"][0] ?? entry?.id
          });
        }
      },
      componentTestStatusValueToStoryIds["status-value:error"].length + componentTestStatusValueToStoryIds["status-value:warning"].length || null,
      react_default.createElement(TestStatusIcon, { status: componentTestStatusIcon, isRunning })
    )), !entry && react_default.createElement(ActionList.Item, null, react_default.createElement(ActionList.Action, { as: "label", readOnly: isRunning, ariaLabel: !1 }, react_default.createElement(ActionList.Icon, null, react_default.createElement(
      Form.Checkbox,
      {
        name: "Coverage",
        checked: config.coverage,
        disabled: isRunning,
        onChange: () => setStoreState((s) => ({
          ...s,
          config: { ...s.config, coverage: !config.coverage }
        }))
      }
    )), react_default.createElement(ActionList.Text, null, watching ? react_default.createElement(Muted, null, "Coverage (unavailable)") : "Coverage")), watching || currentRun.triggeredBy && !FULL_RUN_TRIGGERS.includes(currentRun.triggeredBy) ? react_default.createElement(
      ActionList.Button,
      {
        disabled: !0,
        ariaLabel: watching ? "Coverage unavailable in watch mode" : "Coverage only available after running all tests"
      },
      react_default.createElement(InfoIcon, null)
    ) : currentRun.coverageSummary ? react_default.createElement(
      ActionList.Button,
      {
        asChild: !0,
        ariaLabel: isRunning ? "Open coverage report (testing still in progress)" : `Open coverage report (${currentRun.coverageSummary.percentage}% coverage)`
      },
      react_default.createElement("a", { href: "/coverage/index.html", target: "_blank" }, currentRun.coverageSummary.percentage, "%", react_default.createElement(
        TestStatusIcon,
        {
          isRunning,
          percentage: currentRun.coverageSummary.percentage,
          status: currentRun.coverageSummary.status
        }
      ))
    ) : react_default.createElement(
      ActionList.Button,
      {
        disabled: !0,
        ariaLabel: isRunning ? "Coverage unavailable, testing still in progress" : fatalError ? "Coverage unavailable, component tests crashed" : "Coverage unavailable, run tests first"
      },
      react_default.createElement(
        TestStatusIcon,
        {
          isRunning,
          status: fatalError ? "critical" : "unknown"
        }
      )
    )), hasA11yAddon && react_default.createElement(ActionList.Item, null, entry ? react_default.createElement(ActionList.Text, null, "Accessibility") : react_default.createElement(ActionList.Action, { as: "label", readOnly: isRunning, ariaLabel: !1 }, react_default.createElement(ActionList.Icon, null, react_default.createElement(
      Form.Checkbox,
      {
        name: "Accessibility",
        checked: config.a11y,
        disabled: isRunning,
        onChange: () => setStoreState((s) => ({
          ...s,
          config: { ...s.config, a11y: !config.a11y }
        }))
      }
    )), react_default.createElement(ActionList.Text, null, "Accessibility")), react_default.createElement(
      ActionList.Button,
      {
        ariaLabel: a11yStatusLabel,
        disabled: a11yStatusValueToStoryIds["status-value:error"].length === 0 && a11yStatusValueToStoryIds["status-value:warning"].length === 0 && a11yStatusValueToStoryIds["status-value:success"].length === 0,
        onClick: () => {
          openPanel({
            api,
            entryId: a11yStatusValueToStoryIds["status-value:error"][0] ?? a11yStatusValueToStoryIds["status-value:warning"][0] ?? a11yStatusValueToStoryIds["status-value:success"][0] ?? entry?.id,
            panelId: PANEL_ID2
          });
        }
      },
      a11yStatusValueToStoryIds["status-value:error"].length + a11yStatusValueToStoryIds["status-value:warning"].length || null,
      react_default.createElement(TestStatusIcon, { status: a11yStatusIcon, isRunning })
    ))));
  }, SidebarContextMenu = ({ context, api }) => {
    let {
      testProviderState,
      componentTestStatusValueToStoryIds,
      a11yStatusValueToStoryIds,
      storeState,
      setStoreState
    } = useTestProvider(api, context.id);
    return react_default.createElement(
      TestProviderRender,
      {
        api,
        entry: context,
        style: { minWidth: 240 },
        testProviderState,
        componentTestStatusValueToStoryIds,
        a11yStatusValueToStoryIds,
        storeState,
        setStoreState,
        isSettingsUpdated: !1
      }
    );
  };
  addons.register(ADDON_ID3, (api) => {
    if (globalThis.STORYBOOK_BUILDER === SupportedBuilder.VITE) {
      let openPanel2 = (panelId) => {
        api.setSelectedPanel(panelId), api.togglePanel(!0);
      };
      componentTestStatusStore.onSelect(() => {
        openPanel2(PANEL_ID);
      }), a11yStatusStore.onSelect(() => {
        openPanel2(PANEL_ID2);
      }), testProviderStore.onRunAll(() => {
        store.send({
          type: "TRIGGER_RUN",
          payload: {
            triggeredBy: "run-all"
          }
        });
      }), store.subscribe("TEST_RUN_COMPLETED", ({ payload }) => {
        api.emit(STORYBOOK_ADDON_TEST_CHANNEL, { type: "test-run-completed", payload });
      }), addons.add(TEST_PROVIDER_ID, {
        type: Addon_TypesEnum.experimental_TEST_PROVIDER,
        clear: () => {
          componentTestStatusStore.unset(), a11yStatusStore.unset();
        },
        render: () => {
          let [isModalOpen, setModalOpen] = useState(!1), {
            storeState,
            setStoreState,
            testProviderState,
            componentTestStatusValueToStoryIds,
            a11yStatusValueToStoryIds,
            isSettingsUpdated
          } = useTestProvider(api);
          return react_default.createElement(GlobalErrorContext.Provider, { value: { isModalOpen, setModalOpen } }, react_default.createElement(
            TestProviderRender,
            {
              api,
              storeState,
              setStoreState,
              isSettingsUpdated,
              testProviderState,
              componentTestStatusValueToStoryIds,
              a11yStatusValueToStoryIds
            }
          ), react_default.createElement(
            GlobalErrorModal,
            {
              storeState,
              onRerun: () => {
                setModalOpen(!1), store.send({
                  type: "TRIGGER_RUN",
                  payload: {
                    triggeredBy: "global"
                  }
                });
              }
            }
          ));
        },
        sidebarContextMenu: ({ context }) => context.type === "docs" || context.type === "story" && !context.tags.includes(Tag.TEST) ? null : react_default.createElement(SidebarContextMenu, { context, api })
      });
    }
  });
})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
