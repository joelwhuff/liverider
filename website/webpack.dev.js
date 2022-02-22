import { join } from 'path';
import { cwd } from 'process';

import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: join(cwd(), 'dist'),
    },
    devServer: { static: './dist' },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(woff|woff2)/, type: 'asset/resource', generator: { filename: '[name][ext]' } },
        ],
    },
    plugins: [new HtmlWebpackPlugin({ template: './src/template.html', favicon: './src/images/favicon.ico' })],
};
