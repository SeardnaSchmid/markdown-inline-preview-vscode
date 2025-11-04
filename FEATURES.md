# Markdown Features Checklist

This document tracks the implementation status of all markdown features in the parser-based extension.

## Inline Formatting

### Text Emphasis
- [x] **Bold** (`**text**` or `__text__`)
- [x] *Italic* (`*text*` or `_text_`)
- [x] ***Bold-Italic*** (`***text***` or `___text___`)
- [x] ~~Strikethrough~~ (`~~text~~`)
- [ ] Highlighted text (not standard markdown, but some parsers support `==text==`)

### Code
- [x] Inline code (`` `code` ``)
- [x] Code blocks (``` ``` ```)
- [ ] Code blocks with language (```language```)
- [ ] Code blocks with tildes (~~~ ~~~)

### Links and Images
- [x] Inline links (`[text](url)`)
- [x] Images (`![alt](url)`)
- [ ] Reference-style links (`[text][ref]`)
- [ ] Reference-style images (`![alt][ref]`)
- [ ] Auto-links (`<https://example.com>`)
- [ ] Link titles (`[text](url "title")`)

## Block Elements

### Headings
- [x] H1 (`# Heading`)
- [x] H2 (`## Heading`)
- [x] H3 (`### Heading`)
- [x] H4 (`#### Heading`)
- [x] H5 (`##### Heading`)
- [x] H6 (`###### Heading`)
- [x] Headings with leading whitespace
- [x] Headings with trailing whitespace

### Lists
- [ ] Unordered lists (`- item`, `* item`, `+ item`)
- [ ] Ordered lists (`1. item`, `2. item`)
- [ ] Nested lists
- [ ] Task lists (`- [ ] task`, `- [x] done`)
- [ ] List items with multiple paragraphs
- [ ] List items with code blocks
- [ ] List items with blockquotes

### Blockquotes
- [ ] Basic blockquotes (`> quote`)
- [ ] Nested blockquotes (`>> quote`)
- [ ] Blockquotes with multiple paragraphs
- [ ] Blockquotes with lists
- [ ] Blockquotes with code blocks

### Horizontal Rules
- [ ] `---`
- [ ] `***`
- [ ] `___`

### Tables
- [ ] Basic tables (`| col1 | col2 |`)
- [ ] Table alignment (`|:---|:---:|---:|`)
- [ ] Table with headers
- [ ] Table with formatting in cells

### HTML
- [ ] HTML tags (if enabled in parser)
- [ ] HTML comments (`<!-- comment -->`)

## Special Features

### Escaping
- [ ] Escaped characters (`\*`, `\#`, etc.)
- [ ] Escaped backticks

### Line Breaks
- [ ] Hard line breaks (`  ` - two spaces at end of line)
- [ ] Soft line breaks (newline in paragraph)

### Nested Formatting
- [x] Bold containing italic (`**bold *italic* bold**`)
- [x] Italic containing bold (`*italic **bold** italic*`)
- [ ] Code with formatting (`` `code` `` - formatting inside code is ignored)
- [ ] Links with formatting (`[**bold** link](url)`)
- [ ] Images with formatting in alt text

### Typography
- [ ] Smart quotes (if typographer enabled)
- [ ] Em dashes (—)
- [ ] En dashes (–)
- [ ] Ellipsis (…)

## GFM (GitHub Flavored Markdown)

- [ ] Strikethrough (`~~text~~`) - ✅ Already implemented
- [ ] Task lists (`- [ ] task`) - Not implemented
- [ ] Tables - Not implemented
- [ ] Autolinks - Not implemented
- [ ] Fenced code blocks with language - ✅ Partially (language parsing not used)
- [ ] Fenced code blocks with info strings

## Edge Cases

- [x] Multiple headings in same document
- [x] Headings at start/end of document
- [x] Headings with special characters
- [ ] Empty headings
- [ ] Headings with only whitespace
- [x] Bold/italic at word boundaries
- [ ] Bold/italic with punctuation
- [ ] Code blocks with empty content
- [ ] Code blocks with only whitespace
- [ ] Links with empty text
- [ ] Images with empty alt text
- [ ] Nested formatting edge cases
- [ ] Mixed formatting (e.g., `**bold** and *italic*`)

## Visual Features

### Decoration Types
- [x] Hide delimiters (markers, brackets, etc.)
- [x] Bold text styling
- [x] Italic text styling
- [x] Bold-italic text styling
- [x] Strikethrough text styling
- [x] Code block styling (background, border)
- [x] Heading styling (font-size, weight)
- [x] Link styling (color, underline)
- [x] Image styling (color, italic)

### Interaction Features
- [x] Show raw markdown when clicking on line
- [ ] Show raw markdown when selecting range
- [ ] Toggle decorations on/off
- [ ] Configuration options for decoration styles

## Parser Features

- [x] AST-based parsing (no regex)
- [x] Position tracking for decorations
- [x] Token hierarchy handling
- [x] Nested token processing
- [ ] Error handling for malformed markdown
- [ ] Performance optimization for large documents

## Testing

- [x] Jest test framework setup
- [x] Heading tests (all levels)
- [ ] Bold tests
- [ ] Italic tests
- [ ] Strikethrough tests
- [ ] Code tests
- [ ] Link tests
- [ ] Image tests
- [ ] Integration tests
- [ ] Edge case tests
- [ ] Performance tests

---

**Status Summary:**
- ✅ Implemented: 20 features
- ⏳ In Progress: 0 features
- ❌ Not Implemented: ~50+ features

**Priority:**
1. Core inline formatting (bold, italic, code) - ✅ Done
2. Headings - ✅ Done
3. Links and images - ✅ Done
4. Lists - High priority
5. Blockquotes - Medium priority
6. Tables - Medium priority
7. Advanced features - Low priority

