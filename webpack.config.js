const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    VillageNoteTemplates: './src/VillageNoteTemplates/userscript.js',
    VillageDistanceCalculator2: './src/VillageDistanceCalculator2/src/index.ts'
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        type: "asset/source",
      },
      {
        test: /\.css$/i,
        type: "asset/source",
      },
    ],
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },
};