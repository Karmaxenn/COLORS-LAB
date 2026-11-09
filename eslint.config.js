const js = require("@eslint/js");
const globals = require("globals");

module.exports = 
[   {ignores: ["**/node_modules/**", "**/md5.js", "eslint.config.js"]},
    js.configs.recommended,
    {
        files: ["public/js/**/*.js"],
        languageOptions: 
        {
            sourceType: "script",
            globals: {...globals.browser, md5: "readonly"}
        },
        rules: 
        {
            "no-unused-vars": ["error", {vars: "local"}],
        },
    },
];