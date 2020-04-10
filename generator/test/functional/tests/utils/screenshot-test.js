import looksSame from 'looks-same';
import path from 'path';
import fs from 'fs';

/**
 * 
 * @param {TestController} t 
 * @param {string | Selector | NodeSnapshot | SelectorPromise | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)} selector 
 * @param {string} ethalonName 
 */
const screenshotTest = async (t, selector, ethalonName) => { 
    if (t.browser.headless) { 
        return Promise.resolve(true);
    }
    const screenshotPath = path.resolve(__dirname, `../temp/${ethalonName}`);
    if (fs.existsSync(screenshotPath)) { 
        fs.unlinkSync(screenshotPath);
    }
    await t.resizeWindow(600, 600);
    await t.takeElementScreenshot(selector, ethalonName);
    return new Promise((resolve, fail) => {
        looksSame(
            path.resolve(__dirname, `../etalon/${ethalonName}`),
            screenshotPath, 
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
