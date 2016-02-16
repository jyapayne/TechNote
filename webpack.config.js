var path = require('path');

module.exports = {
        entry: './app/main.jsx',
        output: {
            path: __dirname + "/dist",
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
                path.resolve('./app/modules')
            ]
        }
};
