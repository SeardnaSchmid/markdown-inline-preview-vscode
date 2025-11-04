import { MarkdownParser } from '../../parser';

describe('MarkdownParser Overlap Detection', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  test('heading decorations should not overlap with hide decorations', () => {
    const text = '# H1 Header\n## H2 Header';
    const decorations = parser.extractDecorations(text);

    // Group decorations by type
    const hideDecorations = decorations.filter(d => d.type === 'hide');
    const headingDecorations = decorations.filter(d => d.type.startsWith('heading'));

    console.log('\n=== Hide Decorations ===');
    hideDecorations.forEach(d => {
      const snippet = text.substring(d.startPos, d.endPos);
      console.log(`  [${d.startPos}-${d.endPos}] "${snippet}"`);
    });

    console.log('\n=== Heading Decorations ===');
    headingDecorations.forEach(d => {
      const snippet = text.substring(d.startPos, d.endPos);
      console.log(`  ${d.type} [${d.startPos}-${d.endPos}] "${snippet}"`);
    });

    // Check for overlaps
    hideDecorations.forEach(hide => {
      headingDecorations.forEach(heading => {
        const overlaps = !(
          hide.endPos <= heading.startPos || 
          heading.endPos <= hide.startPos
        );
        if (overlaps) {
          console.error(`\nOVERLAP DETECTED:`);
          console.error(`  Hide: [${hide.startPos}-${hide.endPos}] "${text.substring(hide.startPos, hide.endPos)}"`);
          console.error(`  Heading: [${heading.startPos}-${heading.endPos}] "${text.substring(heading.startPos, heading.endPos)}"`);
        }
        expect(overlaps).toBe(false);
      });
    });

    // Verify they are adjacent (no gap)
    const h1Hide = hideDecorations.find(d => d.startPos === 0);
    const h1Heading = headingDecorations.find(d => d.type === 'heading1');
    expect(h1Hide).toBeDefined();
    expect(h1Heading).toBeDefined();
    expect(h1Hide!.endPos).toBe(h1Heading!.startPos - 1); // Should be adjacent (space between)
  });
});
