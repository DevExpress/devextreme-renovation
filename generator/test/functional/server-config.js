const path = require('path');

const servers = [
    {
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
    },
    {
        platform: 'Vue',
        port: 3002,
        contentBase: path.resolve('./test/functional/platforms/vue/app/dist/'),
        config: require('./platforms/vue/webpack.config'),
        instance: null
    }
];

module.exports = servers;
