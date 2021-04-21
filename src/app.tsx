
export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      // eslint-disable-next-line no-console
      console.error(err.message);
    },
  },
};

localStorage.setItem('umi_locale', 'zh-CN');

import * as monaco from 'monaco-editor';
import { registerRulesForLanguage } from 'monaco-ace-tokenizer';
import GroovyHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/groovy';

monaco.languages.register({
  id: 'groovy',
});
registerRulesForLanguage('groovy', new GroovyHighlightRules());