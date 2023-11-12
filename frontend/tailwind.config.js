module.exports = {
  prefix: '',
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'base': '"Manrope", sans-serif'
      },
      boxShadow: {
        '2sm': '0px 3px 4px rgb(227 227 227 / 29%)',
      },
      colors: {
        primary: "#FF6B00",
        'primary-light': "rgba(255, 107, 0, 0.1)",
        secondary: "#3B3551",
        "grey-light": "#A0A0A0",
        "grey-50": "#EBEBEB",
        "blue-50": "#6F7F95",
        "grey-100": "rgba(198, 198, 198, 0.13);",
        "grey-500": "#6B6B6B",
        green: "#90D272",
        'green-light': "rgba(144, 210, 114, 0.13)",
        red: "#EB6A6A",
        'red-light': "rgba(235, 106, 106, 0.08)",
        'main': "#FAFAFA"
      },
      screens: {
        '2md': '960px',
        'xs': '480px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
