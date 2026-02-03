import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

const plugin = () => {
    return {
        postcssPlugin: 'postcss-pseudo-where-fallback',

        Once(root) {
            // Collect all rules with :where() first to avoid processing cloned rules
            const rulesToProcess = [];

            root.walkRules((rule) => {
                if (rule.selector && rule.selector.includes(':where(')) {
                    rulesToProcess.push(rule);
                }
            });

            // Process collected rules
            rulesToProcess.forEach((rule) => {
                // Transform selector: expand :where() for fallback
                const fallbackSelectors = [];

                selectorParser((selectors) => {
                    selectors.each((selector) => {
                        selector.walkPseudos((pseudo) => {
                            if (pseudo.value === ':where' && pseudo.nodes) {
                                // Get nodes before and after :where() in the same selector
                                const parent = pseudo.parent;
                                const index = parent.index(pseudo);
                                const prefix = parent.nodes.slice(0, index);
                                const suffix = parent.nodes.slice(index + 1);

                                // For each selector inside :where(), create: prefix + selector + suffix
                                pseudo.nodes.forEach((whereSelector) => {
                                    let selectorString = '';

                                    // Build prefix string
                                    prefix.forEach((node) => {
                                        selectorString += node.toString();
                                    });

                                    // Build where content string, removing leading spaces
                                    whereSelector.nodes.forEach((node, i) => {
                                        const nodeStr = node.toString();
                                        if (i === 0) {
                                            // Remove leading spaces from first node
                                            selectorString += nodeStr.trimStart();
                                        } else {
                                            selectorString += nodeStr;
                                        }
                                    });

                                    // Build suffix string
                                    suffix.forEach((node) => {
                                        selectorString += node.toString();
                                    });

                                    fallbackSelectors.push(selectorString);
                                });
                            }
                        });
                    });
                }).processSync(rule.selector);

                // Clone fallback rule (normal specificity)
                const fallbackRule = rule.clone({
                    selector: fallbackSelectors.join(', '),
                });

                // Create @supports wrapper
                const supportsAtRule = postcss.atRule({
                    name: 'supports',
                    params: 'selector(:where(*))',
                    source: rule.source,
                });

                // Clone original rule into @supports
                const modernRule = rule.clone();

                supportsAtRule.append(modernRule);

                // Insert fallback + supports block before original
                rule.before(fallbackRule);
                rule.before(supportsAtRule);

                // Remove original rule
                rule.remove();
            });
        }
    }
}

plugin.postcss = true

export default plugin
