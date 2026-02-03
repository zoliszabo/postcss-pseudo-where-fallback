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
import postcssPluginPseudoWhereFallback from 'postcss-pseudo-where-fallback';

export default {
  plugins: [
    postcssPluginPseudoWhereFallback({
      // options
    })
  ]
};
```

### With PostCSS CLI

```js
// postcss.config.cjs
module.exports = {
  plugins: [
    require('postcss-pseudo-where-fallback')({
      // options
    })
  ]
};
```

### Programmatic Usage

```js
import postcss from 'postcss';
import postcssPluginPseudoWhereFallback from 'postcss-pseudo-where-fallback';

const result = await postcss([
  postcssPluginPseudoWhereFallback()
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
/* Fallback for browsers without :where() support */
.foo, .bar {
  color: red;
}

/* Modern browsers with :where() support */
@supports selector(:where(*)) {
  :where(.foo, .bar) {
    color: red;
  }
}

/* Fallback */
h1.title, h1.heading {
  font-size: 2rem;
}

/* Modern */
@supports selector(:where(*)) {
  h1:where(.title, .heading) {
    font-size: 2rem;
  }
}
```

The plugin creates a fallback selector with normal specificity for older browsers, then wraps the original `:where()` selector in an `@supports` rule so modern browsers can use the zero-specificity version.

## Options

```js
postcssPluginPseudoWhereFallback({
  // Plugin options here
})
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
