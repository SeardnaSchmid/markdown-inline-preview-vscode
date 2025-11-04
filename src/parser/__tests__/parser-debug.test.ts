import { MarkdownParser } from '../../parser';

describe('MarkdownParser Debug - Headings', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  test('should correctly identify marker and content positions for H1', () => {
    const text = '# H1 Heading';
    const decorations = parser.extractDecorations(text);

    console.log('\n=== Decorations for:', text);
    decorations.forEach(d => {
      const snippet = text.substring(d.startPos, d.endPos);
      console.log(`  ${d.type}: [${d.startPos}-${d.endPos}] "${snippet}"`);
    });

    // Find hide decoration for marker
    const hideForMarker = decorations.find(d => 
      d.type === 'hide' && text.substring(d.startPos, d.endPos) === '#'
    );
    expect(hideForMarker).toBeDefined();
    expect(hideForMarker?.startPos).toBe(0);
    expect(hideForMarker?.endPos).toBe(1);

    // Find heading1 decoration
    const heading1 = decorations.find(d => d.type === 'heading1');
    expect(heading1).toBeDefined();
    expect(heading1?.startPos).toBeGreaterThan(1); // Should start after the marker
    expect(text.substring(heading1!.startPos, heading1!.endPos)).toBe('H1 Heading');
  });

  test('should correctly handle H2 with ##', () => {
    const text = '## H2 Heading';
    const decorations = parser.extractDecorations(text);

    const hideForMarker = decorations.find(d => 
      d.type === 'hide' && text.substring(d.startPos, d.endPos) === '##'
    );
    expect(hideForMarker).toBeDefined();
    expect(hideForMarker?.startPos).toBe(0);
    expect(hideForMarker?.endPos).toBe(2);

    const heading2 = decorations.find(d => d.type === 'heading2');
    expect(heading2).toBeDefined();
    expect(text.substring(heading2!.startPos, heading2!.endPos).trim()).toBe('H2 Heading');
  });

  test('should correctly handle multiple headings', () => {
    const text = `# H1
## H2
### H3`;
    const decorations = parser.extractDecorations(text);

    console.log('\n=== Decorations for multiple headings:');
    decorations.forEach(d => {
      const snippet = text.substring(d.startPos, d.endPos);
      console.log(`  ${d.type}: [${d.startPos}-${d.endPos}] "${snippet.replace(/\n/g, '\\n')}"`);
    });

    const h1Hide = decorations.find(d => 
      d.type === 'hide' && d.startPos === 0 && d.endPos === 1
    );
    const h2Hide = decorations.find(d => 
      d.type === 'hide' && text.substring(d.startPos, d.endPos) === '##'
    );
    const h3Hide = decorations.find(d => 
      d.type === 'hide' && text.substring(d.startPos, d.endPos) === '###'
    );

    expect(h1Hide).toBeDefined();
    expect(h2Hide).toBeDefined();
    expect(h3Hide).toBeDefined();

    expect(decorations.filter(d => d.type === 'heading1').length).toBe(1);
    expect(decorations.filter(d => d.type === 'heading2').length).toBe(1);
    expect(decorations.filter(d => d.type === 'heading3').length).toBe(1);
  });
});
