const path = require('path');

module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }, ],
    },
    entry: './public/js/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public/dist/js')
    },
    stats: 'errors-only'
};