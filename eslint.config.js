import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'src'] },
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
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off", // 关闭未使用变量的警告
      "react/jsx-uses-react": "error", // 确保 React 导入在 JSX 中被识别为已使用
      "react/react-in-jsx-scope": "off", // 如果你用 React 17+ 的新 JSX 转换，可以关闭
    },
    "compilerOptions": {
      "noUnusedLocals": false, // 关闭未使用本地变量的检查
      "noUnusedParameters": false // 关闭未使用参数的检查
    }
  },
)
