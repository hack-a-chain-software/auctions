module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  rules: [
    {
      test: /\.less$/i,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              strictMath: true,
              javascriptEnabled: true
            },
          },
        },
      ],
    }
  ]
};
