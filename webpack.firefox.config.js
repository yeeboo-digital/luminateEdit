import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './firefox/src/background.js',
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'dist/firefox'),
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'firefox/manifest.json', to: 'manifest.json' },
        { from: 'firefox/logo*.png', to: '[name][ext]' },
      ],
    }),
  ],
};
