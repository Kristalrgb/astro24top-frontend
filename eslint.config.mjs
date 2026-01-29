// import { dirname } from 'path'
// import { fileURLToPath } from 'url'
// import { FlatCompat } from '@eslint/eslintrc'
//
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
//
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// })
//
// const eslintConfig = [
//   ...compat.extends('next/core-web-vitals', 'next/typescript'),
//   {
//     rules: {
//       '@typescript-eslint/ban-ts-comment': 'warn',
//       '@typescript-eslint/no-empty-object-type': 'warn',
//       '@typescript-eslint/no-explicit-any': 'warn',
//       '@typescript-eslint/no-unused-vars': [
//         'warn',
//         {
//           vars: 'all',
//           args: 'after-used',
//           ignoreRestSiblings: false,
//           argsIgnorePattern: '^_',
//           varsIgnorePattern: '^_',
//           destructuredArrayIgnorePattern: '^_',
//           caughtErrorsIgnorePattern: '^(_|ignore)',
//         },
//       ],
//     },
//   },
//   {
//     ignores: ['.next/'],
//   },
// ]
//
// export default eslintConfig
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // 1. Turned these specific rules OFF
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // 2. To turn off unused vars, just set it to 'off'.
      // You don't need the options object if the rule is disabled.
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    ignores: ['.next/'],
  },
]

export default eslintConfig