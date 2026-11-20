import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores(['**/dist', '**/node_modules', '**/coverage']),
    js.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    jsxA11y.flatConfigs.recommended,
    reactHooks.configs.flat.recommended,
    {
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        // Pulling a prop out of a rest spread (`{ context, ...attributes }`) is intentional.
        rules: { '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }] },
    },
    {
        // Code style (decision 29): a blank line before every `return`.
        rules: {
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' },
            ],
        },
    },
    {
        files: ['.claude/**/*.mjs'],
        languageOptions: { globals: { ...globals.node } },
    },
    {
        files: ['**/*.js', '**/*.mjs'],
        extends: [tseslint.configs.disableTypeChecked],
    },
    prettier,
])
