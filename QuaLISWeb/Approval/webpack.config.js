const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
    mode: "development",
  //  entry:'index.js',
    output: {
         publicPath: "http://localhost:3009/" 
        },
    devServer: {
        port: 3009,
        historyApiFallback: {
            index: 'index.html',
          },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime'],
                  },
                },
              },
              {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime'],
                  },
                },
              },
            {
                test: /\.jpe?g|png$/,
                exclude: /node_modules/,
                use: ["url-loader", "file-loader"]
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: ["url-loader", "file-loader"]
            },
                // {
                //     test: /\.(js|jsx)$/,
                //     exclude: /node_modules/,
                //     loader: "babel-loader"
                // },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "approval",
            filename: "remoteEntry.js",
            exposes: {
              './ApprovalApp': './src/bootstrap.js',
            },
          //  shared: ['react', 'react-dom']
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            manifest: "./public/manifest.json",
           // QualisLIMS: "./public/manifest.json"
        })
    ]
}