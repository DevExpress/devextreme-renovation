const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require("path");
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, "./app/src/index.js"),
    module: {
        rules: [
            {
                test: /\.tsx$/,
                loaders: [
                    {
                        loader: 'vue-loader'
                    },
                    {
                        loader: path.resolve('./test/functional/platforms/loader.js'),
                        options: {
                            platform: 'vue'
                        }
                    }
                ],

                exclude: ['/node_modules/']
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },

            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },

    resolve: { alias: { vue: 'vue/dist/vue.esm.js' } },

    plugins: [
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}
