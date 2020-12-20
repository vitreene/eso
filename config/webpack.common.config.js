// NOTE https://hackernoon.com/lets-start-with-webpack-4-91a0f1dba02e
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: '[name].[hash:8].js',
		path: path.resolve(__dirname, '../dist'),
		sourceMapFilename: '[file].map[query]',
	},
	devtool: 'eval-cheap-module-source-map',
	// devtool: "eval-source-map",
	// devtool: "eval-cheap-source-map",

	resolve: {
		extensions: ['.js', '.ts'],
	},
	module: {
		rules: [
			{
				test: [/.js$|.ts$/],
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					// options: {
					//   presets: ['@babel/preset-env', '@babel/typescript'],
					// },
				},
			},
			{
				test: [/.css$|.scss$/],
				use: [
					{ loader: MiniCssExtractPlugin.loader, options: { hmr: true } },
					'css-loader',

					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [/* require('tailwindcss'), */ require('autoprefixer')],
						},
					},
					/*  'sass-loader', */
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '../public/images/[name].[ext]',
							outputPath: '',
							// outputPath: "assets/images"
						},
					},
				],
			},
		],
	},
	devServer: {
		contentBase: './dist',
		hot: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Eso es',
			template: './src/index.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: false,
			},
		}),
		new MiniCssExtractPlugin({
			// filename: "style.[hash].css"
			filename: 'style.css',
		}),
		new CopyWebpackPlugin([{ from: './public', to: '' }]),
		new CleanWebpackPlugin(),
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
};
