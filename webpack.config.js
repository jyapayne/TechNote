var path = require('path');
var webpack = require('webpack');

module.exports = {
        entry: './index.jsx',
        output: {
            path: __dirname + "/app/dist",
            filename: "bundle.js",
            sourceMapFilename: 'bundle.map'
        },
        target: 'node',
        //devtool: 'source-map',
        module:{
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {presets: ['react', 'es2015', 'stage-0',
                                      'stage-1', 'stage-2', 'stage-3']}
                }
            ]
        },
        resolve:{
            extensions: ['', '.js', '.jsx'],
            root: [
                path.resolve('./app/components'),
                path.resolve('./app')
            ]
        }
};
