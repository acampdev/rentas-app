import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results', '**/.DS_Store', '**/._*'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: [
            'mapDetallesToGlobalItems', 'NotificationService', 'useAuthContext',
            'useCommands', 'useModuleCommands', 'useSidebar', 'useTheme'
          ]
        },
      ],
       // Volver a habilitar advertencias para mantener el código limpio
       "@typescript-eslint/no-explicit-any": "warn",
       "@typescript-eslint/no-unused-vars": ["warn", {
         "argsIgnorePattern": "^_",
         "varsIgnorePattern": "^_",
         "caughtErrorsIgnorePattern": "^_",
         "destructuredArrayIgnorePattern": "^_"
       }],
       "no-console": "error",
    },
  },
  {
    files: ['src/utils/logger.ts', 'vite.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
)
