import { MarkdownParser } from '../../parser';

describe('MarkdownParser Position Calculations', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  test('should calculate correct positions for H1', () => {
    const text = '# H1 Header';
    const decorations = parser.extractDecorations(text);

    console.log('\n=== Text:', JSON.stringify(text));
    console.log('=== Positions:', text.split('').map((c, i) => `${i}:${c}`).join(' '));
    
    decorations.forEach(d => {
      const snippet = text.substring(d.startPos, d.endPos);
      console.log(`  ${d.type}: [${d.startPos}-${d.endPos}] "${snippet}"`);
    });

    // Marker should be at position 0
    const markerHide = decorations.find(d => d.type === 'hide' && d.startPos === 0);
    expect(markerHide).toBeDefined();
    expect(markerHide?.endPos).toBe(1);

    // Content should start after marker and space
    const heading1 = decorations.find(d => d.type === 'heading1');
    expect(heading1).toBeDefined();
    expect(heading1?.startPos).toBe(2); // After "# "
    expect(heading1?.endPos).toBe(11); // End of line (no newline)
    expect(text.substring(heading1!.startPos, heading1!.endPos)).toBe('H1 Header');
  });

  test('should handle multiple headings without offset', () => {
    const text = `# H1 Header
## H2 Header
### H3 Header
#### H4 Header`;
    const decorations = parser.extractDecorations(text);

    console.log('\n=== Multiple Headings ===');
    const lines = text.split('\n');
    lines.forEach((line, lineIdx) => {
      let lineStart = 0;
      for (let i = 0; i < lineIdx; i++) {
        lineStart += lines[i].length + 1;
      }
      console.log(`Line ${lineIdx} (start pos ${lineStart}): "${line}"`);
    });

    decorations.forEach(d => {
      const snippet = text.substring(d.startPos, d.endPos).replace(/\n/g, '\\n');
      console.log(`  ${d.type}: [${d.startPos}-${d.endPos}] "${snippet}"`);
    });

    // Check H1
    const h1Hide = decorations.find(d => d.type === 'hide' && d.startPos === 0);
    const h1Content = decorations.find(d => d.type === 'heading1');
    expect(h1Hide).toBeDefined();
    expect(h1Content).toBeDefined();
    expect(h1Content?.startPos).toBe(2); // After "# "
    expect(h1Content?.endPos).toBe(12); // End of "H1 Header" line

    // Check H2
    const h2Hide = decorations.find(d => d.type === 'hide' && d.startPos === 13); // After "# H1 Header\n"
    const h2Content = decorations.find(d => d.type === 'heading2');
    expect(h2Hide).toBeDefined();
    expect(h2Content).toBeDefined();
    expect(h2Content?.startPos).toBe(16); // After "## " (13 + 3)
    expect(h2Content?.endPos).toBe(26); // End of "H2 Header" line
  });
});
