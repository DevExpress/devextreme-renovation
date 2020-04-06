const sites = [
    { port: 3000, platform: 'React' }, 
    { port: 3001, platform: 'Angular' }
];

export default (testName, testBody, page = '') =>
    sites.forEach(({ port, platform }) =>
        test.page `http://localhost:${port}/${page}`(`${platform}: ${testName}`, testBody)
    );
