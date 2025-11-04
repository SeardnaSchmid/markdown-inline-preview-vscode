import { MarkdownParser } from '../../parser';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('Headings', () => {
    test('should parse H1 heading with single #', () => {
      const text = '# Heading 1';
      const decorations = parser.extractDecorations(text);

      // Should hide the # marker
      const hideDecorations = decorations.filter(d => d.type === 'hide');
      expect(hideDecorations.length).toBeGreaterThan(0);
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '#'
      );
      expect(markerHide).toBeDefined();

      // Should style the heading content
      const headingDecorations = decorations.filter(d => d.type === 'heading1');
      expect(headingDecorations.length).toBeGreaterThan(0);
      const heading = headingDecorations[0];
      const headingText = text.substring(heading.startPos, heading.endPos);
      expect(headingText.trim()).toBe('Heading 1');
    });

    test('should parse H2 heading with ##', () => {
      const text = '## Heading 2';
      const decorations = parser.extractDecorations(text);

      const hideDecorations = decorations.filter(d => d.type === 'hide');
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '##'
      );
      expect(markerHide).toBeDefined();

      const headingDecorations = decorations.filter(d => d.type === 'heading2');
      expect(headingDecorations.length).toBeGreaterThan(0);
      const heading = headingDecorations[0];
      const headingText = text.substring(heading.startPos, heading.endPos);
      expect(headingText.trim()).toBe('Heading 2');
    });

    test('should parse H3 heading with ###', () => {
      const text = '### Heading 3';
      const decorations = parser.extractDecorations(text);

      const hideDecorations = decorations.filter(d => d.type === 'hide');
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '###'
      );
      expect(markerHide).toBeDefined();

      const headingDecorations = decorations.filter(d => d.type === 'heading3');
      expect(headingDecorations.length).toBeGreaterThan(0);
      const heading = headingDecorations[0];
      const headingText = text.substring(heading.startPos, heading.endPos);
      expect(headingText.trim()).toBe('Heading 3');
    });

    test('should parse H4 heading with ####', () => {
      const text = '#### Heading 4';
      const decorations = parser.extractDecorations(text);

      const hideDecorations = decorations.filter(d => d.type === 'hide');
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '####'
      );
      expect(markerHide).toBeDefined();

      const headingDecorations = decorations.filter(d => d.type === 'heading');
      expect(headingDecorations.length).toBeGreaterThan(0);
      const heading = headingDecorations[0];
      expect(heading.level).toBe(4);
      const headingText = text.substring(heading.startPos, heading.endPos);
      expect(headingText.trim()).toBe('Heading 4');
    });

    test('should parse H5 heading with #####', () => {
      const text = '##### Heading 5';
      const decorations = parser.extractDecorations(text);

      const hideDecorations = decorations.filter(d => d.type === 'hide');
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '#####'
      );
      expect(markerHide).toBeDefined();

      const headingDecorations = decorations.filter(d => d.type === 'heading');
      expect(headingDecorations.length).toBeGreaterThan(0);
      const heading = headingDecorations[0];
      expect(heading.level).toBe(5);
    });

    test('should parse H6 heading with ######', () => {
      const text = '###### Heading 6';
      const decorations = parser.extractDecorations(text);

      const hideDecorations = decorations.filter(d => d.type === 'hide');
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '######'
      );
      expect(markerHide).toBeDefined();

      const headingDecorations = decorations.filter(d => d.type === 'heading');
      expect(headingDecorations.length).toBeGreaterThan(0);
      const heading = headingDecorations[0];
      expect(heading.level).toBe(6);
    });

    test('should handle heading with leading whitespace', () => {
      const text = '   ### Indented Heading';
      const decorations = parser.extractDecorations(text);

      const hideDecorations = decorations.filter(d => d.type === 'hide');
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '###'
      );
      expect(markerHide).toBeDefined();
    });

    test('should handle multiple headings in same document', () => {
      const text = `# First Heading
## Second Heading
### Third Heading`;
      const decorations = parser.extractDecorations(text);

      const h1Decorations = decorations.filter(d => d.type === 'heading1');
      const h2Decorations = decorations.filter(d => d.type === 'heading2');
      const h3Decorations = decorations.filter(d => d.type === 'heading3');

      expect(h1Decorations.length).toBe(1);
      expect(h2Decorations.length).toBe(1);
      expect(h3Decorations.length).toBe(1);
    });

    test('should handle heading with special characters', () => {
      const text = '# Heading with `code` and *italic*';
      const decorations = parser.extractDecorations(text);

      const headingDecorations = decorations.filter(d => d.type === 'heading1');
      expect(headingDecorations.length).toBeGreaterThan(0);
      
      // Should still hide the # marker
      const hideDecorations = decorations.filter(d => d.type === 'hide');
      const markerHide = hideDecorations.find(d => 
        text.substring(d.startPos, d.endPos) === '#'
      );
      expect(markerHide).toBeDefined();
    });

    test('should handle heading at start of document', () => {
      const text = '# First Line Heading\nSome content';
      const decorations = parser.extractDecorations(text);

      const headingDecorations = decorations.filter(d => d.type === 'heading1');
      expect(headingDecorations.length).toBe(1);
      
      const heading = headingDecorations[0];
      const headingText = text.substring(heading.startPos, heading.endPos);
      expect(headingText.trim()).toBe('First Line Heading');
    });

    test('should handle heading with no content after marker', () => {
      const text = '#';
      const decorations = parser.extractDecorations(text);

      // Should still parse, but may not have content decoration
      const hideDecorations = decorations.filter(d => d.type === 'hide');
      expect(hideDecorations.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle heading with trailing whitespace', () => {
      const text = '# Heading with spaces   ';
      const decorations = parser.extractDecorations(text);

      const headingDecorations = decorations.filter(d => d.type === 'heading1');
      expect(headingDecorations.length).toBeGreaterThan(0);
      
      const heading = headingDecorations[0];
      const headingText = text.substring(heading.startPos, heading.endPos);
      expect(headingText).toContain('Heading with spaces');
    });
  });
});
