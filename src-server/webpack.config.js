//@ts-check

"use strict";

const path = require("path");
const webpack = require("webpack");

/**@type {import('webpack').Configuration}*/
const config = {
  context: path.join(__dirname, ".."),
  entry: "./src-server/index.ts",
  output: {
    path: path.join(__dirname, "..", "build", "server"),
    filename: "server.js",
    devtoolModuleFilenameTemplate: "file://[absolute-resource-path]",
  },
  devtool: false,
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map",
      append:
        "\n//# sourceMappingURL=file://" +
        path.resolve(__dirname, "..", "build", "server") +
        "/[url]",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  target: "electron-preload",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
};

module.exports = config;
