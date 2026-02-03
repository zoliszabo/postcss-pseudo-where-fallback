import postcss from 'postcss';

const plugin = () => {
    return {
        postcssPlugin: 'postcss-pseudo-where-fallback',

        Rule(rule) {
            if (!rule.selector || !rule.selector.includes(':where(')) {
                return;
            }

            // Strip :where(...) → fallback selector
            const fallbackSelector = rule.selector.replace(/:where\(([^)]+)\)/g, '$1');

            // Clone fallback rule (normal specificity)
            const fallbackRule = rule.clone({
                selector: fallbackSelector,
            });

            // Create @supports wrapper
            const supportsAtRule = postcss.atRule({
                name: 'supports',
                params: 'selector(:where(*))',
            });

            // Clone original rule into @supports
            const modernRule = rule.clone();

            supportsAtRule.append(modernRule);

            // Insert fallback + supports block before original
            rule.before(fallbackRule);
            rule.before(supportsAtRule);

            // Remove original rule
            rule.remove();
        }
    }
}

plugin.postcss = true

export default plugin
