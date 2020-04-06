import { Selector } from 'testcafe';
import cloneTest from './utils/check-all-platforms';
import screenshotTest from "./utils/screenshot-test";

fixture`Simple component`;

cloneTest('Check default render', async t => {
    await t.expect(await screenshotTest(t, "body", "simple.png")).eql(true);
});

cloneTest('Check element style', async t => {
    const el = Selector('#simple');

    await t
        .expect(el.clientWidth).eql(100)
        .expect(el.clientHeight).eql(100)
        .expect((await el.style)["background-color"]).eql('rgb(255, 0, 0)');
});
