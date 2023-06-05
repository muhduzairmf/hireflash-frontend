/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: [
                '"Public Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            ],
        },
        extend: {
            backgroundImage: {
                "company-pattern": "url('/hireflash-company.svg')",
            },
        },
    },
    plugins: [],
};
