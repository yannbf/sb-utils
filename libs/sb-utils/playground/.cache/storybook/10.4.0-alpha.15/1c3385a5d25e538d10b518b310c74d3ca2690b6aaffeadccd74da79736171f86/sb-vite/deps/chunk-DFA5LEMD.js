import {
  require_react
} from "./chunk-2BSE6OYG.js";
import {
  __toESM
} from "./chunk-MTI3AIJG.js";

// node_modules/@storybook/addon-docs/node_modules/@mdx-js/react/lib/index.js
var import_react = __toESM(require_react(), 1);
var emptyComponents = {};
var MDXContext = import_react.default.createContext(emptyComponents);
function useMDXComponents(components) {
  const contextComponents = import_react.default.useContext(MDXContext);
  return import_react.default.useMemo(
    function() {
      if (typeof components === "function") {
        return components(contextComponents);
      }
      return { ...contextComponents, ...components };
    },
    [contextComponents, components]
  );
}
function MDXProvider(properties) {
  let allComponents;
  if (properties.disableParentContext) {
    allComponents = typeof properties.components === "function" ? properties.components(emptyComponents) : properties.components || emptyComponents;
  } else {
    allComponents = useMDXComponents(properties.components);
  }
  return import_react.default.createElement(
    MDXContext.Provider,
    { value: allComponents },
    properties.children
  );
}

export {
  useMDXComponents,
  MDXProvider
};
//# sourceMappingURL=chunk-DFA5LEMD.js.map
