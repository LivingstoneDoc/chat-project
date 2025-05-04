const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
        { 
            test: /\.ts$/, 
            use: 'ts-loader',
            exclude: /node_modules/ 
        }
    ],
  },
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
  },
  plugins: [new HtmlWebpackPlugin()],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
};