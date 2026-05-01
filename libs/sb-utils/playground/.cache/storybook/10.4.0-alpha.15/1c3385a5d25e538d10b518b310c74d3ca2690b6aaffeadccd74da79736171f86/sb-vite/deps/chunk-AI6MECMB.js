import {
  AnchorMdx,
  CodeOrSourceMdx,
  Docs,
  HeadersMdx
} from "./chunk-MCOP56RH.js";
import {
  renderElement,
  unmountElement
} from "./chunk-DZGZJ7HU.js";
import {
  require_react
} from "./chunk-2BSE6OYG.js";
import {
  __toESM
} from "./chunk-MTI3AIJG.js";

// node_modules/@storybook/addon-docs/dist/_browser-chunks/chunk-OATZR77O.js
var import_react = __toESM(require_react(), 1);
var defaultComponents = {
  code: CodeOrSourceMdx,
  a: AnchorMdx,
  ...HeadersMdx
};
var ErrorBoundary = class extends import_react.Component {
  constructor() {
    super(...arguments);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    let { showException } = this.props;
    showException(err);
  }
  render() {
    let { hasError } = this.state, { children } = this.props;
    return hasError ? null : import_react.default.createElement(import_react.default.Fragment, null, children);
  }
};
var DocsRenderer = class {
  constructor() {
    this.render = async (context, docsParameter, element) => {
      let components = {
        ...defaultComponents,
        ...docsParameter == null ? void 0 : docsParameter.components
      }, TDocs = Docs;
      return new Promise((resolve, reject) => {
        import("./@storybook_addon-docs___@mdx-js_react.js").then(
          ({ MDXProvider }) => (
            // We use a `key={}` here to reset the `hasError` state each time we render ErrorBoundary
            renderElement(
              import_react.default.createElement(ErrorBoundary, { showException: reject, key: Math.random() }, import_react.default.createElement(MDXProvider, { components }, import_react.default.createElement(TDocs, { context, docsParameter }))),
              element
            )
          )
        ).then(() => resolve());
      });
    }, this.unmount = (element) => {
      unmountElement(element);
    };
  }
};

export {
  defaultComponents,
  DocsRenderer
};
//# sourceMappingURL=chunk-AI6MECMB.js.map
