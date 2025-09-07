const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "bundle.js",
        clean: true,
        publicPath: "/",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[name][ext]",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "public"),
                publicPath: "/",
            },
        ],
        compress: true,
        port: 3000,
        host: "0.0.0.0",
        open: true,
        hot: true,
        liveReload: true,
        watchFiles: {
            paths: ["src/**/*", "public/**/*"],
            options: {
                usePolling: true,
                interval: 300,
                ignored: /node_modules/,
            },
        },
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
            webSocketURL: "auto://0.0.0.0:0/ws",
        },
        devMiddleware: {
            writeToDisk: false,
        },
    },
    watchOptions: {
        poll: 1000,
        ignored: /node_modules/,
    },
};
