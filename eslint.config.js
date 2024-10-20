import globals from "globals"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import typescriptESLintParser from "@typescript-eslint/parser"

export default [
    {
        ignores: [
            "vite.config.ts",
            "client/",
            "built/",
            "node_modules/"
        ]
    },
    {
        files: ["**/*.js", "**/*.ts"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            parser: typescriptESLintParser,
            globals: {
                ...globals.browser,
                ...globals.node
            },
            parserOptions: {
                "sourceType": "module",
                "project": "./tsconfig.json",
            }
        },
        plugins: {
            typescriptEslint
        },
        rules: {
            "no-unused-vars": "off",
            "no-undef": "error",
            "indent": ["error", 4],
            "quotes": ["error", "double"],
            "semi": ["error", "never"]
        },
        ignores: ["client/*"]
    }
]
