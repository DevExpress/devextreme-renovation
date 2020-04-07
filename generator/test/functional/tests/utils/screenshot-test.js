import looksSame from 'looks-same';
import path from 'path';

/**
 * 
 * @param {TestController} t 
 * @param {string | Selector | NodeSnapshot | SelectorPromise | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)} selector 
 * @param {string} ethalonName 
 */
const screenshotTest = async (t, selector, ethalonName) => { 
    await t.takeElementScreenshot(selector, ethalonName);
    return new Promise((resolve, fail) => {
        looksSame(
            path.resolve(__dirname, '../etalon/simple.png'),
            path.resolve(__dirname, '../temp/simple.png'), 
            (error, { equal }) => {
                if (error) { 
                    fail(error);
                } else {
                    resolve(equal);
                }
            }
        );
    });
}

export default screenshotTest;
