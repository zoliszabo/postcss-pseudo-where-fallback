import { postcssTape } from '@csstools/postcss-tape';
import plugin from '../src/index.mjs';

postcssTape(plugin)({
	basic: {
		message: "transforms :where() to fallback with @supports wrapper"
	},
	complex: {
		message: "handles complex selectors with :where()"
	},
	'no-where': {
		message: "leaves selectors without :where() unchanged"
	}
});
