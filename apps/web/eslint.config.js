import js from "@eslint/js"
import globals from "globals"

import eslintParserTypescript from "@typescript-eslint/parser"

import eslintPLuginTypescript from "@typescript-eslint/eslint-plugin"
import eslintPluginReactHooks from "eslint-plugin-react-hooks"
import eslintPluginReactRefresh from "eslint-plugin-react-refresh"

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    js.configs.recommended,
    eslintPLuginTypescript.configs["recommended-type-checked"],
    eslintPLuginTypescript.configs["strict-type-checked"],
    eslintPluginReactHooks.configs.recommended,
    {
        files: ["src/**/*.ts", "src/**/*.tsx"],
        root: true,
        ignores: ["**/*.config.js", "dist", "node_modules"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
            },
            parser: eslintParserTypescript,
        },
        plugins: {
            eslintPluginReactRefresh,
        },
        rules: {
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    },
]
