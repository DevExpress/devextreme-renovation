const sites = [
    { port: 3000, platform: 'React' }, 
    { port: 3001, platform: 'Angular' }
];

/**
 * 
 * @param {string} testName 
 * @param {(t:TestController)=>Promise<any>} testBody 
 * @param {string} page 
 */
const cloneTest = (testName, testBody, page = '') =>
    sites.forEach(({ port, platform }) =>
        test.page`http://localhost:${port}/${page}`(`${platform}: ${testName}`, testBody)
    );
export default cloneTest;
