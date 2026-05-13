/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default {
  code: 'editor-code',
  heading: {
    h1: "mb-2 text-3xl font-bold",
    h2: "mb-2 text-2xl font-bold",
    h3: "mb-1 text-xl font-semibold",
    h4: "mb-1 text-lg font-semibold",
    h5: "mb-1 text-md font-semibold",
  },
  image: 'editor-image',
  link: 'editor-link',
  list: {
    ul: "list-disc ml-6 my-3 space-y-1",
    ol: "list-decimal ml-6 my-3 space-y-1",
    listitem: "leading-relaxed",
    nested: {
      list: "mt-1",
    },
  },
  paragraph: 'not-last:mb-3',
  placeholder: 'editor-placeholder',
  quote: "my-2 ml-8 border-l-4 border-zinc-300 pl-4 italic text-zinc-500 dark:border-zinc-600 dark:text-indigo-600",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    code: 'editor-text-code',
    hashtag: 'editor-text-hashtag',
    overflowed: 'editor-text-overflowed',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underlineStrikethrough',
  },
};
