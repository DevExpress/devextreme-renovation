const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const servers = [{
    platform: 'Angular',
    port: 3000,
    contentBase: path.resolve('./test/functional/platforms/angular/app/dist/'),
    config: require('./platforms/angular/webpack.config'),
    instance: null
}, {
    platform: 'React',
    port: 3001,
    contentBase: path.resolve('./test/functional/platforms/react/app/dist/'),
    config: require('./platforms/react/webpack.config'),
    instance: null
}];

servers.forEach(server => {
    const { port, contentBase, platform, config } = server;
    const errMsg = platform + ' server is up on port ' + port; 

    console.log(config);

    server.instance = new WebpackDevServer(webpack(config), { contentBase, hot: true })
        .listen(port, '0.0.0.0', err => console.log(err || errMsg));
});

['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
        servers.forEach(({ instance }) => instance.close());
        process.exit();
    });
});
