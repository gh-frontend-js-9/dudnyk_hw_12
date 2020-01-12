let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebPackPlugin = require("html-webpack-plugin");
let CopyWebpackPlugin= require('copy-webpack-plugin');

let conf = {
    entry: {
        'auth': './src/pages/authorization/main.js',
        'pages/inbox/main': './src/pages/inbox/main.js'
    },
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js',
        publicPath: 'dist/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },

            {
                test: /.(png|svg|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images'
                }
            },

            {
                test: /\.html$/,
                include: path.resolve(__dirname, 'src/pages/'),
                use: ['raw-loader']
            }
        ]
    },
    devtool: 'eval-sourcemap',
    devServer: {
        openPage: './src/index.html',
        overlay: true
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new HtmlWebPackPlugin({
            filename: './index.html',
            template: path.resolve(__dirname, './src/index.html'),
            inject: false
        }),
        new HtmlWebPackPlugin({
            filename: './pages/inbox/inbox.html',
            template: path.resolve(__dirname, './src/pages/inbox/inbox.html'),
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: './src/assets/images', 
                to: './images'
            }
        ])
    ]
}

module.exports = conf;