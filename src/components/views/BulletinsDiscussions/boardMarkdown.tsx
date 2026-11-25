import React from "react";
import { MarkdownToJSX } from "markdown-to-jsx/react";

const heading = { component: "h5" as const, props: {} };

export const boardMarkdownOptions = {
  overrides: {
    h1: heading,
    h2: heading,
    h3: heading,
    h4: heading,
    h5: heading,
    h6: heading,
  },
};

const INLINE_TAGS =
  "a abbr b code del em i ins kbd mark s small span strong sub sup u".split(
    " "
  );

export const boardPreviewOptions: MarkdownToJSX.Options = {
  createElement: (tag, props, ...children) => (
    <React.Fragment key={props.key}>
      {INLINE_TAGS.includes(String(tag)) ? children : [" ", ...children, " "]}
    </React.Fragment>
  ),
};
