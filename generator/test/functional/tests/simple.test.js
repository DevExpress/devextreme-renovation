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

cloneTest('Button: Slot, Event, InternalState', async t => {
    const el = Selector('#button-1');

    await t.click(el);
    await t.click(el);

    const counter = Selector("#button-1-click-counter");

    await t
        .expect(counter.textContent).eql("2");
});

cloneTest('ButtonWithState(unmanaged): State, StateChangeEvent', async t => {
    const el = Selector('#button-2');
    const state = Selector("#button-with-state-pressed");

    await t
        .expect(state.textContent).eql("false")
        .expect(el.textContent).eql("Unpressed");

    await t.click(el);

    await t
        .expect(state.textContent).eql("true")
        .expect(el.textContent).eql("Pressed");
});

cloneTest('SpreadAttributes', async t => {
    await t.click(Selector('#button-3'));

    const el = Selector("#component-with-spread");

    await t
        .expect(await el.getAttribute("id")).eql("component-with-spread")
        .expect(await el.getAttribute("aria")).eql("changed");
});

cloneTest('ChangeVisibility: Effect depends on InternalState', async t => {
    await t.click(Selector('#change-visibility-open-element'));

    const el = Selector("#change-visibility-hide-element");
    await t
        .expect((await el.style)["background-color"]).eql('rgb(0, 128, 0)');
    
    await t.click(el);

    await t
        .expect(Selector("#change-visibility-hide-element").exists).notOk()
});

cloneTest('ChangeVisibilityProp: Effect depends on Prop', async t => {
    await t.click(Selector('#button-4'));
    const el = Selector("#change-visibility-prop-element");
    await t.click(el);

    await t
        .expect(Selector("#change-visibility-prop-element").textContent).eql("1");
});

cloneTest('Check rest attributes', async t => {
    const el = Selector("#component-with-rest-attributes");

    await t
        .expect(await el.getAttribute("id")).eql("component-with-rest-attributes")
        .expect(await el.getAttribute("label")).eql("rest-attributes");
});

cloneTest('Check fragment children', async t => {
    const el = Selector("#component-with-fragment");

    await t
        .expect(await el.childElementCount).eql(2);
});

cloneTest('Can call method inside a getter', async t => {
    const el = Selector("#call-method-in-getter-widget");

    await t
        .expect(await el.textContent).eql("2");
    
    await t.click(Selector('#button-5'));

    await t
        .expect(await el.textContent).eql("20");
});