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
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
    ],
  },
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
    },
  },
  plugins: [new HtmlWebpackPlugin({
    template: './src/index.html',
  })],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
};