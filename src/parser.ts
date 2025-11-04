import MarkdownIt from 'markdown-it';

// Token type from markdown-it
type Token = ReturnType<MarkdownIt['parse']>[0];

export interface DecorationRange {
  startPos: number;
  endPos: number;
  type: 'hide' | 'bold' | 'italic' | 'boldItalic' | 'strikethrough' | 'code' | 'heading' | 'heading1' | 'heading2' | 'heading3' | 'link' | 'image';
  level?: number; // For headings
}

export class MarkdownParser {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      breaks: false,
    });
  }

  /**
   * Parse markdown and extract all decoration ranges
   */
  extractDecorations(text: string): DecorationRange[] {
    const tokens = this.md.parse(text, {});
    const decorations: DecorationRange[] = [];
    
    this.visitTokens(tokens, text, decorations);
    
    return decorations;
  }

  /**
   * Recursively visit tokens and extract decoration ranges
   */
  private visitTokens(
    tokens: Token[],
    text: string,
    decorations: DecorationRange[]
  ): void {
    for (const token of tokens) {
      this.processToken(token, text, decorations);
      
      // Process children recursively
      if (token.children && token.children.length > 0) {
        this.visitTokens(token.children, text, decorations);
      }
    }
  }

  /**
   * Process a single token and extract its decoration ranges
   */
  private processToken(
    token: Token,
    text: string,
    decorations: DecorationRange[]
  ): void {
    // Handle inline formatting
    if (token.type === 'strong_open') {
      const marker = token.markup || '**';
      const range = this.findTokenRange(text, marker, token);
      if (range) {
        decorations.push({
          startPos: range.start,
          endPos: range.start + marker.length,
          type: 'hide',
        });
        // Find content range
        const contentRange = this.findContentRange(text, token, marker);
        if (contentRange) {
          const hasEm = this.hasNestedEm(token);
          decorations.push({
            startPos: contentRange.start,
            endPos: contentRange.end,
            type: hasEm ? 'boldItalic' : 'bold',
          });
        }
      }
    } else if (token.type === 'strong_close') {
      const marker = token.markup || '**';
      const range = this.findTokenRange(text, marker, token);
      if (range) {
        decorations.push({
          startPos: range.start,
          endPos: range.start + marker.length,
          type: 'hide',
        });
      }
    } else if (token.type === 'em_open') {
      const marker = token.markup || '*';
      const range = this.findTokenRange(text, marker, token);
      if (range) {
        decorations.push({
          startPos: range.start,
          endPos: range.start + marker.length,
          type: 'hide',
        });
        // Find content range
        const contentRange = this.findContentRange(text, token, marker);
        if (contentRange && !this.isInStrong(token)) {
          decorations.push({
            startPos: contentRange.start,
            endPos: contentRange.end,
            type: 'italic',
          });
        }
      }
    } else if (token.type === 'em_close') {
      const marker = token.markup || '*';
      const range = this.findTokenRange(text, marker, token);
      if (range) {
        decorations.push({
          startPos: range.start,
          endPos: range.start + marker.length,
          type: 'hide',
        });
      }
    } else if (token.type === 's_open') {
      const marker = token.markup || '~~';
      const range = this.findTokenRange(text, marker, token);
      if (range) {
        decorations.push({
          startPos: range.start,
          endPos: range.start + marker.length,
          type: 'hide',
        });
        const contentRange = this.findContentRange(text, token, marker);
        if (contentRange) {
          decorations.push({
            startPos: contentRange.start,
            endPos: contentRange.end,
            type: 'strikethrough',
          });
        }
      }
    } else if (token.type === 's_close') {
      const marker = token.markup || '~~';
      const range = this.findTokenRange(text, marker, token);
      if (range) {
        decorations.push({
          startPos: range.start,
          endPos: range.start + marker.length,
          type: 'hide',
        });
      }
    } else if (token.type === 'code_inline') {
      const marker = '`';
      const range = this.findTokenRange(text, marker, token);
      if (range) {
        // Hide opening backtick
        decorations.push({
          startPos: range.start,
          endPos: range.start + 1,
          type: 'hide',
        });
        // Hide closing backtick
        const closePos = text.indexOf(marker, range.start + 1);
        if (closePos !== -1) {
          decorations.push({
            startPos: closePos,
            endPos: closePos + 1,
            type: 'hide',
          });
          // Style content
          decorations.push({
            startPos: range.start + 1,
            endPos: closePos,
            type: 'code',
          });
        }
      }
    } else if (token.type === 'heading_open') {
      const level = parseInt(token.tag.substring(1), 10);
      if (token.map && token.map.length >= 2) {
        const [startLine] = token.map;
        const lines = text.split('\n');
        if (startLine >= lines.length) return;
        
        // Calculate the start position of the line
        let lineStart = 0;
        for (let i = 0; i < startLine; i++) {
          const prevLine = lines[i];
          if (prevLine !== undefined) {
            lineStart += prevLine.length + 1; // +1 for newline
          }
        }
        
        const line = lines[startLine];
        if (!line) return;
        
        // Find the marker - it might have leading whitespace
        const marker = '#'.repeat(level);
        // Find marker at start of line (after optional whitespace)
        const trimmedLine = line.trimStart();
        const markerPos = trimmedLine.indexOf(marker);
        
        if (markerPos === 0) {
          // Marker is at the start (after whitespace)
          const leadingWhitespace = line.length - trimmedLine.length;
          const markerStart = lineStart + leadingWhitespace;
          
          // Hide the marker
          decorations.push({
            startPos: markerStart,
            endPos: markerStart + marker.length,
            type: 'hide',
          });
          
          // Calculate content range - end of line (without newline)
          const lineEnd = lineStart + line.length;
          const contentStart = markerStart + marker.length;
          
          // Trim leading whitespace after marker
          const afterMarker = trimmedLine.substring(marker.length);
          const whitespaceMatch = afterMarker.match(/^\s+/);
          const whitespaceLength = whitespaceMatch ? whitespaceMatch[0].length : 0;
          const contentStartTrimmed = contentStart + whitespaceLength;
          
          // Style the heading content (from after marker+whitespace to end of line)
          if (contentStartTrimmed < lineEnd) {
            decorations.push({
              startPos: contentStartTrimmed,
              endPos: lineEnd,
              type: level === 1 ? 'heading1' : level === 2 ? 'heading2' : level === 3 ? 'heading3' : 'heading',
              level,
            });
          }
        }
      }
    } else if (token.type === 'link_open') {
      if (token.map && token.map.length >= 1) {
        const [startLine] = token.map;
        const lines = text.split('\n');
        if (startLine >= lines.length) return;
        let lineStart = 0;
        for (let i = 0; i < startLine; i++) {
          const line = lines[i];
          if (line) {
            lineStart += line.length + 1;
          }
        }
        const searchText = text.substring(lineStart);
        const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/;
        const match = searchText.match(linkPattern);
        if (match && match.index !== undefined && match[1] && match[0]) {
          const fullStart = lineStart + match.index;
          // Hide delimiters
          decorations.push({
            startPos: fullStart,
            endPos: fullStart + 1,
            type: 'hide', // [
          });
          decorations.push({
            startPos: fullStart + 1 + match[1].length,
            endPos: fullStart + 2 + match[1].length,
            type: 'hide', // ]
          });
          decorations.push({
            startPos: fullStart + 2 + match[1].length,
            endPos: fullStart + 3 + match[1].length,
            type: 'hide', // (
          });
          decorations.push({
            startPos: fullStart + match[0].length - 1,
            endPos: fullStart + match[0].length,
            type: 'hide', // )
          });
          // Style link text
          decorations.push({
            startPos: fullStart + 1,
            endPos: fullStart + 1 + match[1].length,
            type: 'link',
          });
        }
      }
    } else if (token.type === 'image') {
      if (token.map && token.map.length >= 1) {
        const [startLine] = token.map;
        const lines = text.split('\n');
        if (startLine >= lines.length) return;
        let lineStart = 0;
        for (let i = 0; i < startLine; i++) {
          const line = lines[i];
          if (line) {
            lineStart += line.length + 1;
          }
        }
        const searchText = text.substring(lineStart);
        const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/;
        const match = searchText.match(imagePattern);
        if (match && match.index !== undefined && match[1] !== undefined && match[0]) {
          const fullStart = lineStart + match.index;
          // Hide delimiters
          decorations.push({
            startPos: fullStart,
            endPos: fullStart + 2,
            type: 'hide', // ![
          });
          decorations.push({
            startPos: fullStart + 2 + match[1].length,
            endPos: fullStart + 3 + match[1].length,
            type: 'hide', // ]
          });
          decorations.push({
            startPos: fullStart + 3 + match[1].length,
            endPos: fullStart + 4 + match[1].length,
            type: 'hide', // (
          });
          decorations.push({
            startPos: fullStart + match[0].length - 1,
            endPos: fullStart + match[0].length,
            type: 'hide', // )
          });
          // Style image (could add special styling)
          decorations.push({
            startPos: fullStart + 2,
            endPos: fullStart + 2 + match[1].length,
            type: 'image',
          });
        }
      }
    } else if (token.type === 'fence') {
      // Code blocks
      if (token.map && token.map.length >= 2) {
        const [startLine, endLine] = token.map;
        const lines = text.split('\n');
        if (startLine >= lines.length) return;
        let lineStart = 0;
        for (let i = 0; i < startLine; i++) {
          const line = lines[i];
          if (line) {
            lineStart += line.length + 1;
          }
        }
        const startLineText = lines[startLine];
        if (!startLineText) return;
        const marker = token.markup || '```';
        const markerPos = startLineText.indexOf(marker);
        if (markerPos !== -1) {
          const markerStart = lineStart + markerPos;
          const infoLength = token.info ? token.info.length + 1 : 0;
          // Hide opening fence
          decorations.push({
            startPos: markerStart,
            endPos: markerStart + marker.length + infoLength,
            type: 'hide',
          });
          // Hide closing fence
          let fenceEnd = lineStart;
          for (let i = startLine; i < endLine && i < lines.length; i++) {
            const line = lines[i];
            if (line) {
              fenceEnd += line.length + 1;
            }
          }
          if (endLine > 0 && endLine - 1 < lines.length) {
            const endLineText = lines[endLine - 1];
            if (endLineText) {
              const endMarkerPos = endLineText.lastIndexOf(marker);
              if (endMarkerPos !== -1) {
                const endMarkerStart = fenceEnd - (endLineText.length - endMarkerPos);
                decorations.push({
                  startPos: endMarkerStart,
                  endPos: fenceEnd,
                  type: 'hide',
                });
              }
            }
          }
        }
      }
    }
  }

  /**
   * Find the range of a token in the source text
   */
  private findTokenRange(text: string, marker: string, token: Token): { start: number; end: number } | null {
    if (token.map && token.map.length >= 2) {
      const [startLine] = token.map;
      const lines = text.split('\n');
      if (startLine >= lines.length) return null;
      let lineStart = 0;
      for (let i = 0; i < startLine; i++) {
        const line = lines[i];
        if (line) {
          lineStart += line.length + 1;
        }
      }
      const line = lines[startLine];
      if (!line) return null;
      const pos = line.indexOf(marker);
      if (pos !== -1) {
        return {
          start: lineStart + pos,
          end: lineStart + pos + marker.length,
        };
      }
    } else if (token.content) {
      // For inline tokens without map, search for content
      const pos = text.indexOf(token.content);
      if (pos !== -1) {
        const markerPos = text.lastIndexOf(marker, pos);
        if (markerPos !== -1 && markerPos < pos) {
          return {
            start: markerPos,
            end: markerPos + marker.length,
          };
        }
      }
    }
    return null;
  }

  /**
   * Find the content range between opening and closing markers
   */
  private findContentRange(text: string, token: Token, marker: string): { start: number; end: number } | null {
    if (token.map && token.map.length >= 2) {
      const [startLine, endLine] = token.map;
      const lines = text.split('\n');
      if (startLine >= lines.length) return null;
      let lineStart = 0;
      for (let i = 0; i < startLine; i++) {
        const line = lines[i];
        if (line) {
          lineStart += line.length + 1;
        }
      }
      const line = lines[startLine];
      if (!line) return null;
      const markerPos = line.indexOf(marker);
      if (markerPos !== -1) {
        const contentStart = lineStart + markerPos + marker.length;
        let contentEnd = lineStart;
        for (let i = startLine; i < endLine && i < lines.length; i++) {
          const currentLine = lines[i];
          if (currentLine) {
            contentEnd += currentLine.length + 1;
          }
        }
        // Find closing marker
        if (endLine > 0 && endLine - 1 < lines.length) {
          const endLineText = lines[endLine - 1];
          if (endLineText) {
            const closeMarkerPos = endLineText.lastIndexOf(marker);
            if (closeMarkerPos !== -1) {
              const contentEndPos = (endLine > startLine ? contentEnd - endLineText.length : lineStart) + closeMarkerPos;
              if (contentEndPos > contentStart) {
                return {
                  start: contentStart,
                  end: contentEndPos,
                };
              }
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Check if token has nested emphasis (for bold-italic)
   */
  private hasNestedEm(token: Token): boolean {
    if (!token.children) return false;
    return token.children.some((t: Token) => t.type === 'em_open' || t.type === 'em_close');
  }

  /**
   * Check if token is nested in strong (for bold-italic)
   */
  private isInStrong(token: Token): boolean {
    // This is a simplified check - in a full implementation,
    // we'd need to track parent context
    return false;
  }
}