module.exports = {
    purge: [
        "./pages/**/*.js",
        "./pages/**/*.jsx",
        "./pages/**/*.ts",
        "./pages/**/*.tsx",
        "./components/**/*.js",
        "./components/**/*.jsx",
        "./components/**/*.ts",
        "./components/**/*.tsx",
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            minHeight: {
                32: "8rem",
            },
            maxHeight: {
                95: "95%",
            },
            maxWidth: {
                95: "95%",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
