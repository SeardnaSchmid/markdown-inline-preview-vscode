import { ThemeColor, window } from 'vscode';

export function HideDecorationType() {
  return window.createTextEditorDecorationType({
    // Hide the item
    textDecoration: 'none; display: none;',
    // This forces the editor to re-layout following text correctly
    after: {
      contentText: '',
    },
  });
}

export function BoldDecorationType() {
  return window.createTextEditorDecorationType({
    fontWeight: 'bold',
  });
}

export function ItalicDecorationType() {
  return window.createTextEditorDecorationType({
    fontStyle: 'italic',
  });
}

export function BoldItalicDecorationType() {
  return window.createTextEditorDecorationType({
    fontWeight: 'bold',
    fontStyle: 'italic',
  });
}

export function StrikethroughDecorationType() {
  return window.createTextEditorDecorationType({
    textDecoration: 'line-through',
  });
}

export function CodeDecorationType() {
  return window.createTextEditorDecorationType({
    backgroundColor: new ThemeColor('editor.background'),
    border: '1px solid',
    borderColor: new ThemeColor('editorWidget.border'),
    borderRadius: '3px',
  });
}

export function HeadingDecorationType() {
  return window.createTextEditorDecorationType({
    color: new ThemeColor('foreground'),
    fontWeight: 'bold',
  });
}

export function Heading1DecorationType() {
  return window.createTextEditorDecorationType({
    textDecoration: 'none; font-size: 200%;',
    fontWeight: 'bold',
  });
}

export function Heading2DecorationType() {
  return window.createTextEditorDecorationType({
    textDecoration: 'none; font-size: 150%;',
    fontWeight: 'bold',
  });
}

export function Heading3DecorationType() {
  return window.createTextEditorDecorationType({
    textDecoration: 'none; font-size: 110%;',
    fontWeight: 'bold',
  });
}

export function Heading4DecorationType() {
  return window.createTextEditorDecorationType({
    textDecoration: 'none; font-size: 100%;',
    color: new ThemeColor('descriptionForeground'),
  });
}

export function Heading5DecorationType() {
  return window.createTextEditorDecorationType({
    textDecoration: 'none; font-size: 90%;',
    color: new ThemeColor('descriptionForeground'),
  });
}

export function Heading6DecorationType() {
  return window.createTextEditorDecorationType({
    textDecoration: 'none; font-size: 80%;',
    color: new ThemeColor('descriptionForeground'),
  });
}

export function LinkDecorationType() {
  return window.createTextEditorDecorationType({
    color: new ThemeColor('textLink.foreground'),
    textDecoration: 'underline',
  });
}

export function ImageDecorationType() {
  return window.createTextEditorDecorationType({
    color: new ThemeColor('textLink.foreground'),
    fontStyle: 'italic',
  });
}
