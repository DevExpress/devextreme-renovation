import cloneTest from './utils/check-all-platforms';
import looksSame from 'looks-same';
import path from 'path';

fixture `Simple component`;

cloneTest('Check default render', async t => {
    await t.takeElementScreenshot('body', 'simple.png');

    const { equal, error } = await new Promise(resolve => {
        looksSame(
            path.resolve(__dirname, './etalon/simple.png'),
            path.resolve(__dirname, './temp/simple.png'), 
            (error, { equal }) => resolve({ equal, error })
        );
    });

    await t.expect(equal).ok(String(error));
});