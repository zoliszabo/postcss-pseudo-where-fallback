import { postcssTape } from '@csstools/postcss-tape';
import plugin from '../src/index.mjs';

postcssTape(plugin)({
	basic: {
		message: "transforms :where() to fallback with @supports wrapper"
	},
	complex: {
		message: "handles complex selectors with :where()"
	},
	mixed: {
		message: "handles selectors with both :where() and regular selectors"
	},
	'selector-list': {
		message: "handles selector lists mixing regular and :where() selectors"
	},
	attribute: {
		message: "handles attribute selectors inside :where()"
	},
	'multiple-attributes': {
		message: "handles multiple selectors with attribute selectors in :where()"
	},
	'no-where': {
		message: "leaves selectors without :where() unchanged"
	}
});
