const sites = require("../../server-config");

/**
 *
 * @param {string} testName
 * @param {(t:TestController)=>Promise<any>} testBody
 * @param {string} page
 */
const cloneTest = (testName, testBody, page = "") =>
  sites.forEach(({ port, platform }) =>
    test.page`http://localhost:${port}/${page}`(
      `${platform}: ${testName}`,
      testBody
    )
  );

export default cloneTest;

/**
 *
 * @param {string} page
 */
export const createCloneTest = (page) => {
  /**
   *
   * @param {string} testName
   * @param {(t:TestController)=>Promise<any>} testBody
   */
  const test = (testName, testBody) => cloneTest(testName, testBody, page);
  return test;
};
