import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import next from '@next/eslint-config-next'

export default [
  {
    files: ['**/*.{js,mjs,jsx,ts,tsx}'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  react.configs.flat.recommended,
  next,
]
