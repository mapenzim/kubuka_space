/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import {$setBlocksType} from '@lexical/selection';
import {$findMatchingParent, mergeRegister} from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { AlignCenterIcon, AlignJustifyIcon, AlignLeft, AlignRightIcon, Bold, ItalicIcon, RedoIcon, UnderlineIcon, Undo, UndoIcon } from 'lucide-react';
import React, {useCallback, useEffect, useRef, useState} from 'react';

const BLOCK_TYPES = [
  {label: 'Normal', value: 'paragraph'},
  {label: 'Heading 1', value: 'h1'},
  {label: 'Heading 2', value: 'h2'},
  {label: 'Heading 3', value: 'h3'},
  {label: 'Heading 4', value: 'h4'},
  {label: 'Heading 5', value: 'h5'},
  {label: 'Quote', value: 'quote'},
];

function formatParagraph(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    $setBlocksType(selection, () => $createParagraphNode());
  });
}

function formatHeading(editor: LexicalEditor, headingTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5') {
  editor.update(() => {
    const selection = $getSelection();
    $setBlocksType(selection, () => $createHeadingNode(headingTag));
  });
}

function formatQuote(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    $setBlocksType(selection, () => $createQuoteNode());
  });
}

function applyBlockType(editor: LexicalEditor, type: string) {
  if (type === 'paragraph') {
    formatParagraph(editor);
  } else if (type === 'quote') {
    formatQuote(editor);
  } else {
    formatHeading(editor, type as 'h1' | 'h2' | 'h3' | 'h4' | 'h5');
  }
}

function Divider() {
  return (
    <div className="mx-1 w-px self-stretch bg-zinc-400 dark:bg-zinc-600" />
  );
}

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let topLevelElement = $findMatchingParent(anchorNode, e => {
        const parent = e.getParent();
        return parent !== null && $isRootOrShadowRoot(parent);
      });
      if (topLevelElement === null) {
        topLevelElement = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(topLevelElement)) {
        setBlockType(topLevelElement.getTag());
      } else {
        setBlockType(topLevelElement.getType());
      }
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          {editor},
        );
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbar]);

  const btnBase =
    'group flex cursor-pointer items-center justify-center rounded-md border-0 p-1.5 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500';
  const btnInactive =
    'bg-transparent text-zinc-700 enabled:hover:bg-zinc-200 dark:text-zinc-200 dark:enabled:hover:bg-zinc-700';
  const btnActive =
    'bg-zinc-500 text-white enabled:hover:bg-zinc-600 dark:bg-zinc-600 dark:enabled:hover:bg-zinc-700';
  const iconBase =
    'flex h-[18px] w-[18px] shrink-0 bg-transparent group-hover:opacity-100';

  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 overflow-x-auto border-b [border-bottom-style:solid] border-b-black/10 bg-zinc-50 px-2 py-1.5 md:justify-start dark:border-b-white/10 dark:bg-zinc-800"
      ref={toolbarRef}>
      <select
        className="cursor-pointer appearance-none rounded-md border border-solid border-transparent bg-transparent px-2 py-1 text-sm font-medium text-zinc-700 transition-colors duration-150 hover:bg-zinc-200 focus:outline-none focus-visible:outline  focus-visible:outline-blue-500 dark:text-zinc-200 dark:hover:bg-zinc-700"
        value={blockType}
        onChange={e => applyBlockType(editor, e.target.value)}
        aria-label="Block type">
        {BLOCK_TYPES.map(({label, value}) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Divider />
      <button
        disabled={!canUndo}
        type="button"
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={`${btnBase} ${btnInactive} mr-0.5`}
        aria-label="Undo">
          <UndoIcon className={`${iconBase} w-4 h-4`} />
        </button>
      <button
        disabled={!canRedo}
        type="button"
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={`${btnBase} ${btnInactive}`}
        aria-label="Redo">
          <RedoIcon className={`${iconBase} opacity-70`} />
        </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`${btnBase} mr-0.5 ${isBold ? btnActive : btnInactive}`}
        aria-label="Format Bold"
        aria-pressed={isBold}>
          <Bold className={`${iconBase} ${isBold ? 'opacity-100' : 'opacity-70'}`} />
        </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={`${btnBase} mr-0.5 ${isItalic ? btnActive : btnInactive}`}
        aria-label="Format Italics"
        aria-pressed={isItalic}>
          <ItalicIcon className={`${iconBase} ${isItalic ? 'opacity-100' : 'opacity-70'}`} />
        </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`${btnBase} mr-0.5 ${isUnderline ? btnActive : btnInactive}`}
        aria-label="Format Underline"
        aria-pressed={isUnderline}>
          <UnderlineIcon className={`${iconBase} ${isUnderline ? 'opacity-100' : 'opacity-70'}`} />
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={`${btnBase} ${btnInactive} mr-0.5`}
        aria-label="Left Align">
          <AlignLeft className={`${iconBase} opacity-70`} />
        </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={`${btnBase} ${btnInactive} mr-0.5`}
        aria-label="Center Align">
          <AlignCenterIcon className={`${iconBase} opacity-70`} />
        </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={`${btnBase} ${btnInactive} mr-0.5`}
        aria-label="Right Align">
          <AlignRightIcon className={`${iconBase} opacity-70`} />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className={`${btnBase} ${btnInactive}`}
        aria-label="Justify Align">
          <AlignJustifyIcon className={`${iconBase} opacity-70`} />
      </button>
    </div>
  );
}
