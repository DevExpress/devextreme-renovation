const path = require('path');
const reactConfig = require('./webpack.config');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const reactDevServer = new WebpackDevServer(webpack(reactConfig), {
    contentBase: path.resolve('./test/functional/platforms/react/app/dist/'),
    hot: true
}).listen(3000, '0.0.0.0', (err) => console.log(err || 'React server is up on port 3000'));

['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
        reactDevServer.close();
        process.exit();
    });
});
