# Markdown Features Example

This document demonstrates all features supported (or planned) by the extension.

---

## Inline Formatting

- **Bold**: `**bold**` → **bold**
- __Bold__ (alt): `__bold__` → __bold__
- *Italic*: `*italic*` → *italic*
- _Italic_ (alt): `_italic_` → _italic_
- ***Bold-Italic***: `***bold italic***` → ***bold italic***
- ___Bold-Italic___ (alt): `___bold italic___` → ___bold italic___
- ~~Strikethrough~~: `~~strike~~` → ~~strike~~
- ==Highlighted== (not always supported): `==highlight==` → ==highlight==
- Escaped \*asterisk\*: `\*asterisk\*` → \*asterisk\*
- Escaped backticks: ``\`not code\``` → \`not code\`
- Nested formatting: **Bold inside *italic***, *Italic inside **bold***, _**Bold/italic _nested_** and `inline code`_
- Formatting with punctuation: *italic!*, **bold?**, ***combo***, _italic_, etc.

## Code

Inline code: ``This is `inline code` in text``

```
Code block (fenced, no language)
```

```js
// Code block (javascript)
console.log("Hello, world!");
```

~~~python
# Code block (tildes, python)
print("Hello with tildes")
~~~

## Links and Images

- Inline link: [Example](https://example.com)
- Link with title: [with title](https://example.com "title here")
- Reference link: [Google][g]
- Auto-link: <https://github.com>
- ![alt text for image](https://via.placeholder.com/80)
- Reference image: ![Ref image][img1]

[g]: https://google.com
[img1]: https://via.placeholder.com/40

## Block Elements

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

  # Heading with leading whitespace  
# Heading with trailing whitespace  

Unordered list:
- Item one
* Item two
+ Item three

Ordered list:
1. First
2. Second
3. Third

Nested lists:
- Top
  - Nested
    - Deep nested

Task lists:
- [ ] Todo item
- [x] Done item

List item with multiple paragraphs:
- First paragraph.

  Second paragraph in the same item.

List item with code block:
- List + code:

      let x = 1;

List item with blockquote:
- List + quote:

    > Nested quote

Blockquotes:
> Just a quote  
>> Double nested

> Quote  
>
> With two paragraphs

> Quote  
> - With a list  
> - More

> Quote with code block:
>
>     console.log("Inside quote");

Horizontal rules:

---
***
___

## Tables

| Name  | Desc     | Right |
|:----- |:--------:| ----:|
| foo   | bar      |   10 |
| bold  | **yes**  |   20 |

## HTML

<div>Raw HTML block</div>

<!-- This is an HTML comment -->

## Special Features

Line breaks:  
This line ends with two spaces.<br>
This is a new line.

Soft line
break example.

## Nested Formatting, Typography, Edge Cases

- **Bold with *italic inside bold***  
- *Italic with **bold inside italic***  
- `*Formatting inside code block*`  
- [**Bold Link**](https://bold.com)  
- ![Alt with _italic_](https://via.placeholder.com/20)

"Smart quotes" — em dash — en dash – ellipsis …

## Visual Features Demo

- **Bold**
- *Italic*
- ***Bold-Italic***
- ~~Strikethrough~~
- `Inline code`
- [Link](#)
- ![Image](https://via.placeholder.com/10)
- > Quoted text
- 1. Ordered
    - Unordered

---

**Raw markdown:**  
Click this line to show the raw markdown under extension.

---

## Malformed & Edge/Crazy Cases

# 
Empty heading above

#

**Bold**, *italic*, **bold*\* not closed

---

# The End