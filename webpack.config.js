const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  const isProduction = plugin => (
    env.prod ? plugin : undefined
  );
  const removeEmpty = array => array.filter(p => Boolean(p));

  return {
    context: __dirname,
    entry: {
      app: path.join(__dirname, './src/poker_leaderboard.jsx'),
      vendor: ['react', 'react-dom']
    },
    output: {
      path: path.join(__dirname, 'app', 'assets', 'javascripts'),
      publicPath: path.join('app', 'javascripts/'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: [/\.jsx?$/, /\.js?$/],
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: ['env', 'react'],
            cacheDirectory: true
          }
        }
      ]
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '*'],
      modules: [
        path.resolve(__dirname, 'src'),
        path.resolve(__dirname, 'node_modules')
      ]
    },
    plugins: removeEmpty([
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: '[name].js'
      }),
      isProduction(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })),
      isProduction(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
          unused: true,
          dead_code: true
        },
        output: {
          comments: false
        },
        sourceMap: false
      }))
    ])
  };
};
