const angularConfig = require('./webpack.config');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const angularDevServer = new WebpackDevServer(webpack(angularConfig), {
    contentBase: path.resolve('./test/functional/platforms/angular/app/dist/'),
    hot: true
}).listen(3001, '0.0.0.0', (err) => console.log(err || 'Angular server is up on port 3001'));

['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
        angularDevServer.close();
        process.exit();
    });
});
