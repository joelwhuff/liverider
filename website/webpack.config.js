import { join } from 'path';
import { cwd } from 'process';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const TERSER_HTML_OPTIONS = {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
};

export default {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: '[contenthash].js',
        path: join(cwd(), 'dist'),
        clean: true,
    },
    module: {
        rules: [
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.(woff|woff2)/, type: 'asset/resource', generator: { filename: '[name][ext]' } },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
            minify: TERSER_HTML_OPTIONS,
            favicon: './src/images/favicon.ico',
        }),
        new MiniCssExtractPlugin({ filename: '[contenthash].css' }),
    ],
    optimization: { minimizer: ['...', new CssMinimizerPlugin()] },
};
