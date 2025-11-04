import { Range, TextEditor } from 'vscode';
import {
  HideDecorationType,
  BoldDecorationType,
  ItalicDecorationType,
  BoldItalicDecorationType,
  StrikethroughDecorationType,
  CodeDecorationType,
  HeadingDecorationType,
  Heading1DecorationType,
  Heading2DecorationType,
  Heading3DecorationType,
  LinkDecorationType,
  ImageDecorationType,
} from './decorations';
import { MarkdownParser, DecorationRange } from './parser';

export class Decorator {
  activeEditor: TextEditor | undefined;

  private parser = new MarkdownParser();

  private hideDecorationType = HideDecorationType();
  private boldDecorationType = BoldDecorationType();
  private italicDecorationType = ItalicDecorationType();
  private boldItalicDecorationType = BoldItalicDecorationType();
  private strikethroughDecorationType = StrikethroughDecorationType();
  private codeDecorationType = CodeDecorationType();
  private headingDecorationType = HeadingDecorationType();
  private heading1DecorationType = Heading1DecorationType();
  private heading2DecorationType = Heading2DecorationType();
  private heading3DecorationType = Heading3DecorationType();
  private linkDecorationType = LinkDecorationType();
  private imageDecorationType = ImageDecorationType();

  setActiveEditor(textEditor: TextEditor | undefined) {
    if (!textEditor) {
      return;
    }
    this.activeEditor = textEditor;
    this.updateDecorations();
  }

  updateDecorations() {
    if (!this.activeEditor) {
      return;
    }
    if (!['markdown', 'md', 'mdx'].includes(this.activeEditor.document.languageId)) {
      return;
    }

    const documentText = this.activeEditor.document.getText();
    const decorations = this.parser.extractDecorations(documentText);

    // Separate decorations by type
    const hideRanges: Range[] = [];
    const boldRanges: Range[] = [];
    const italicRanges: Range[] = [];
    const boldItalicRanges: Range[] = [];
    const strikethroughRanges: Range[] = [];
    const codeRanges: Range[] = [];
    const headingRanges: Range[] = [];
    const heading1Ranges: Range[] = [];
    const heading2Ranges: Range[] = [];
    const heading3Ranges: Range[] = [];
    const linkRanges: Range[] = [];
    const imageRanges: Range[] = [];

    for (const decoration of decorations) {
      const range = this.createRange(decoration.startPos, decoration.endPos);
      if (!range) continue;

      // Skip all decorations if the line is selected (show raw markdown when clicking on a line)
      if (this.isLineOfRangeSelected(range)) {
        continue;
      }

      switch (decoration.type) {
        case 'hide':
          hideRanges.push(range);
          break;
        case 'bold':
          boldRanges.push(range);
          break;
        case 'italic':
          italicRanges.push(range);
          break;
        case 'boldItalic':
          boldItalicRanges.push(range);
          break;
        case 'strikethrough':
          strikethroughRanges.push(range);
          break;
        case 'code':
          codeRanges.push(range);
          break;
        case 'heading':
          headingRanges.push(range);
          break;
        case 'heading1':
          heading1Ranges.push(range);
          break;
        case 'heading2':
          heading2Ranges.push(range);
          break;
        case 'heading3':
          heading3Ranges.push(range);
          break;
        case 'link':
          linkRanges.push(range);
          break;
        case 'image':
          imageRanges.push(range);
          break;
      }
    }

    // Apply all decorations
    this.activeEditor.setDecorations(this.hideDecorationType, hideRanges);
    this.activeEditor.setDecorations(this.boldDecorationType, boldRanges);
    this.activeEditor.setDecorations(this.italicDecorationType, italicRanges);
    this.activeEditor.setDecorations(this.boldItalicDecorationType, boldItalicRanges);
    this.activeEditor.setDecorations(this.strikethroughDecorationType, strikethroughRanges);
    this.activeEditor.setDecorations(this.codeDecorationType, codeRanges);
    this.activeEditor.setDecorations(this.headingDecorationType, headingRanges);
    this.activeEditor.setDecorations(this.heading1DecorationType, heading1Ranges);
    this.activeEditor.setDecorations(this.heading2DecorationType, heading2Ranges);
    this.activeEditor.setDecorations(this.heading3DecorationType, heading3Ranges);
    this.activeEditor.setDecorations(this.linkDecorationType, linkRanges);
    this.activeEditor.setDecorations(this.imageDecorationType, imageRanges);
  }

  /**
   * Convert character positions to VS Code Range
   */
  private createRange(startPos: number, endPos: number): Range | null {
    if (!this.activeEditor) return null;

    try {
      const start = this.activeEditor.document.positionAt(startPos);
      const end = this.activeEditor.document.positionAt(endPos);
      return new Range(start, end);
    } catch (error) {
      // Invalid position
      return null;
    }
  }

  /**
   * Check if a range is currently selected
   */
  private isRangeSelected(range: Range): boolean {
    return !!(this.activeEditor?.selections.find((s) => range.intersection(s)));
  }

  /**
   * Check if any part of a range's line is selected
   */
  private isLineOfRangeSelected(range: Range): boolean {
    return !!(this.activeEditor?.selections.find(
      (s) => !(range.end.line < s.start.line || range.start.line > s.end.line)
    ));
  }
}