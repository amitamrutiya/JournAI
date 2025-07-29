import { type Editor } from '@tiptap/core';

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME =
  'node-handles-selected-style';

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export const duplicateContent = (editor: Editor) => {
  const { view } = editor;
  const { state } = view;
  const { selection } = state;

  editor
    .chain()
    .insertContentAt(
      selection.to,
      // @ts-nocheck
      selection.content().content.firstChild?.toJSON(),
      {
        updateSelection: true,
      },
    )
    .focus(selection.to)
    .run();
};

export function getUrlFromString(string_: string) {
  if (isValidUrl(string_)) {
    return string_;
  }
  try {
    if (string_.includes('.') && !string_.includes(' ')) {
      return new URL(`https://${string_}`).toString();
    }
  } catch {
    return;
  }
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}
