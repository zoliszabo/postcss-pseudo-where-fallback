# postcss-pseudo-where-fallback

A PostCSS plugin that provides fallbacks for the `:where()` CSS pseudo-class selector.

## Why?

The `:where()` pseudo-class is a modern CSS feature that allows grouping selectors with zero specificity. However, older browsers don't support it. This plugin automatically generates fallback selectors for better browser compatibility.

## Installation

```bash
npm install postcss-pseudo-where-fallback --save-dev
```

## Usage

### PostCSS Config

```js
// postcss.config.js
import postcssPseudoWhereFallback from 'postcss-pseudo-where-fallback';

export default {
  plugins: [
    postcssPseudoWhereFallback()
  ]
};
```

**Note:** This plugin currently does not accept any options. Simply use it without arguments: `postcssPluginPseudoWhereFallback()`.

### With PostCSS CLI

```js
// postcss.config.cjs
module.exports = {
  plugins: [
    require('postcss-pseudo-where-fallback')()
  ]
};
```

### Programmatic Usage

```js
import postcss from 'postcss';
import postcssPseudoWhereFallback from 'postcss-pseudo-where-fallback';

const result = await postcss([
  postcssPseudoWhereFallback()
]).process(css, { from: 'input.css', to: 'output.css' });
```

## Example

### Input

```css
:where(.foo, .bar) {
  color: red;
}

h1:where(.title, .heading) {
  font-size: 2rem;
}
```

### Output

```css
:where(.foo, .bar) {
  color: red;
}
@supports not selector(:where(*)) {
  .foo, .bar {
    color: red;
  }
}

h1:where(.title, .heading) {
  font-size: 2rem;
}
@supports not selector(:where(*)) {
  h1.title, h1.heading {
    font-size: 2rem;
  }
}
```

The plugin keeps the original `:where()` selector for modern browsers (which will use it with zero specificity), and adds a fallback wrapped in `@supports not selector(:where(*))` for older browsers that don't support `:where()`. This ensures:

- **Modern browsers**: Use the `:where()` selector with zero specificity
- **Older browsers with `@supports`**: Ignore the invalid `:where()` selector and use the fallback with normal specificity
- **Very old browsers** (no `@supports` support): Ignore both the `:where()` and `@supports` blocks, resulting in no styles (these are pre-2013 browsers)

## Important Note on Specificity

The key feature of `:where()` is that it has **zero specificity**, while the fallback selectors have **normal specificity**. This can result in different behavior in legacy browsers when combined with other selectors:

```css
/* Your CSS */
.sidebar :where(.button) {
  background: blue;
}

.button {
  background: red;
}
```

**In modern browsers:**
```css
/* .sidebar :where(.button) = 0,1,0 specificity (only .sidebar counts) */
/* .button = 0,1,0 specificity */
/* Result: red background (last rule wins due to equal specificity) ✓ */
```

**In legacy browsers with the fallback:**
```css
.sidebar :where(.button) { background: blue; }
@supports not selector(:where(*)) {
  .sidebar .button { background: blue; }  /* 0,2,0 specificity! */
}

.button { background: red; }  /* 0,1,0 specificity */
/* Result: blue background (fallback wins due to higher specificity) ✗ */
```

The fallback `.sidebar .button` has **higher specificity** (0,2,0) than the intended override `.button` (0,1,0), causing different behavior in legacy browsers.

**Recommendation:** If you're using `:where()` specifically for its zero-specificity behavior in complex cascade scenarios, test thoroughly in legacy browsers or consider using more specific overrides.

## More Examples

### Selector Lists with Mixed Types

Input:
```css
a, :where(b) {
  color: red;
}
```

Output:
```css
a, :where(b) {
  color: red;
}
@supports not selector(:where(*)) {
  b {
    color: red;
  }
}
```

Note: The fallback only includes expanded `:where()` selectors. Regular selectors like `a` are already valid and don't need to be repeated.

### Attribute Selectors

Input:
```css
input:where([type='button'], [type='submit'], [type='reset']) {
  cursor: pointer;
}
```

Output:
```css
input:where([type='button'], [type='submit'], [type='reset']) {
  cursor: pointer;
}
@supports not selector(:where(*)) {
  input[type='button'], input[type='submit'], input[type='reset'] {
    cursor: pointer;
  }
}
```

### Complex Selectors

Input:
```css
.container :where(.foo, .bar) .item {
  padding: 10px;
}
```

Output:
```css
.container :where(.foo, .bar) .item {
  padding: 10px;
}
@supports not selector(:where(*)) {
  .container .foo .item, .container .bar .item {
    padding: 10px;
  }
}
```

## Browser Support

This plugin helps support browsers that don't have native `:where()` support, including:

- Internet Explorer 11
- Edge < 88
- Firefox < 78
- Chrome < 88
- Safari < 14

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](./LICENSE)
