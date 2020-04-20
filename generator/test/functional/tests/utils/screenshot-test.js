import looksSame from 'looks-same';
import path from 'path';
import fs from 'fs';

/**
 * 
 * @param {TestController} t 
 * @param {string | Selector | NodeSnapshot | SelectorPromise | ((...args: any[]) => Node | Node[] | NodeList | HTMLCollection)} selector 
 * @param {string} etalonName 
 */
const screenshotTest = async (t, selector, etalonName) => {
    const etalonDir = path.resolve(__dirname, '../etalon');
    const etalonPath = path.resolve(__dirname, `../etalon/${etalonName}`);
    const screenshotPath = path.resolve(__dirname, `../temp/${etalonName}`);

    if (fs.existsSync(screenshotPath)) { 
        fs.unlinkSync(screenshotPath);
    }

    await t.resizeWindow(600, 600);
    await t.takeElementScreenshot(selector, etalonName);
    return new Promise((resolve, fail) => {
        if (fs.existsSync(etalonPath)) {
            looksSame(
                etalonPath,
                screenshotPath, 
                (error, { equal }) => {
                    if (error) { 
                        fail(error);
                    } else {
                        resolve(equal);
                    }
                }
            );
        } else {
            fs.mkdirSync(etalonDir);
            fs.copyFileSync(screenshotPath, etalonPath);
            resolve(true);
        }
    });
}

export default screenshotTest;
