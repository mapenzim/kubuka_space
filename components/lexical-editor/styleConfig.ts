/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;

export const parseAllowedFontSize = (input: string): string => {
  const match = input.match(/^(\d+(?:\.\d+)?)px$/);
  if (match) {
    const n = Number(match[1]);
    if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
      return input;
    }
  }
  return '';
};

export function parseAllowedColor(input: string) {
  return /^rgb\(\d+, \d+, \d+\)$/.test(input) ? input : '';
}


export const editorTheme = {
  heading: {
    h1: "mb-2 text-3xl font-bold",
    h2: "mb-2 text-2xl font-bold",
    h3: "mb-1 text-xl font-semibold",
    h4: "mb-1 text-lg font-semibold",
    h5: "mb-1 text-md font-semibold",
  },

  paragraph: "my-0",

  quote:
    "my-2 ml-8 border-l-4 border-zinc-300 pl-4 italic text-zinc-500 dark:border-zinc-600 dark:text-zinc-400",

  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },

  list: {
    ul: "list-disc ml-6 my-3 space-y-1",
    ol: "list-decimal ml-6 my-3 space-y-1",
    listitem: "leading-relaxed",
    nested: {
      list: "mt-1",
    },
  },
};