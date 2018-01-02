const path = require('path');

const config = {

    entry: './lyts_core/ly.ts',

    output: {
        path: path.resolve(__dirname, 'build_core'),
        filename: 'lyts.js'
    },

    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};

const config_tests = {

    entry: './tests/index.ts',

    output: {
        path: path.resolve(__dirname, 'build_tests'),
        filename: 'bundle.js'
    },

    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};

const config_gui_materialize = {

    entry: './lyts_materialize/index.ts',

    output: {
        path: path.resolve(__dirname, 'build_gui'),
        filename: 'lyts_materialize.js'
    },

    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};


module.exports = [config, config_tests, config_gui_materialize];