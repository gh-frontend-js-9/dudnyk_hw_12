let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebPackPlugin = require("html-webpack-plugin");
let CopyWebpackPlugin= require('copy-webpack-plugin');

let conf = {
    entry: {
        'pages/authorization/ResetPassword/reset': './src/pages/authorization/ResetPassword/main.js',
        'pages/authorization/SignUp/signUp': './src/pages/authorization/SignUp/main.js',
        'pages/authorization/LogIn/logIn': './src/pages/authorization/LogIn/main.js',
        'pages/inbox/main': './src/pages/inbox/main.js',
        'pages/main': './src/pages/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // publicPath: '/dist/'
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
        contentBase: 'dist',
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
            filename: './pages/authorization/ResetPassword/reset.html',
            template: path.resolve(__dirname, './src/pages/authorization/ResetPassword/reset.html'),
            inject: false
        }),
        new HtmlWebPackPlugin({
            filename: './pages/authorization/SignUp/signUp.html',
            template: path.resolve(__dirname, './src/pages/authorization/SignUp/signUp.html'),
            inject: false
        }),
        new HtmlWebPackPlugin({
            filename: './pages/inbox/inbox.html',
            template: path.resolve(__dirname, './src/pages/inbox/inbox.html'),
            inject: false
        }),
        new HtmlWebPackPlugin({
            filename: './pages/dashboard.html',
            template: path.resolve(__dirname, './src/pages/dashboard.html'),
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: './src/assets/images', 
                to: './images'
            },
            {
                from: './node_modules/@fortawesome',
                to: './assets/@fortawesome'
            }
        ])
    ]
}

module.exports = conf;