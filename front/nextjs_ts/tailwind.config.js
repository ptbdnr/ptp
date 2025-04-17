module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "node_modules/@llamaindex/chat-ui/**/*.{ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#FF7043",
        },
        height: {
          "15": "60px",
        },
      },
    },
  };