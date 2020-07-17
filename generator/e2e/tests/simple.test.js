import { Selector } from "testcafe";
import cloneTest from "./utils/check-all-platforms";
import screenshotTest from "./utils/screenshot-test";

fixture`Simple component`;

cloneTest("Check default render", async (t) => {
  await t.expect(await screenshotTest(t, "body", "simple.png")).eql(true);
});

cloneTest("Check element style", async (t) => {
  const el = Selector("#simple");

  await t
    .expect(el.clientWidth)
    .eql(25)
    .expect(el.clientHeight)
    .eql(25)
    .expect((await el.style)["background-color"])
    .eql("rgb(255, 0, 0)");
});

cloneTest("Button: Slot, Event, InternalState", async (t) => {
  const el = Selector("#button-1");

  await t.click(el);
  await t.click(el);

  const counter = Selector("#button-1-click-counter");

  await t.expect(counter.textContent).eql("2");
});

cloneTest("ButtonWithState(unmanaged): State, StateChangeEvent", async (t) => {
  const el = Selector("#button-2");
  const state = Selector("#button-with-state-pressed");

  await t
    .expect(state.textContent)
    .eql("false")
    .expect(el.textContent)
    .eql("Unpressed");

  await t.click(el);

  await t
    .expect(state.textContent)
    .eql("true")
    .expect(el.textContent)
    .eql("Pressed");
});

cloneTest("SpreadAttributes", async (t) => {
  await t.click(Selector("#button-3"));

  const el = Selector("#component-with-spread");

  await t
    .expect(await el.getAttribute("id"))
    .eql("component-with-spread")
    .expect(await el.getAttribute("aria"))
    .eql("changed");
});

cloneTest("ChangeVisibility: Effect depends on InternalState", async (t) => {
  await t.click(Selector("#change-visibility-open-element"));

  const el = Selector("#change-visibility-hide-element");
  await t.expect((await el.style)["background-color"]).eql("rgb(0, 128, 0)");

  await t.click(el);

  await t.expect(Selector("#change-visibility-hide-element").exists).notOk();
});

cloneTest("ChangeVisibilityProp: Effect depends on Prop", async (t) => {
  await t.click(Selector("#button-4"));
  const el = Selector("#change-visibility-prop-element");
  await t.click(el);

  await t
    .expect(Selector("#change-visibility-prop-element").textContent)
    .eql("1");
});

cloneTest("Check rest attributes", async (t) => {
  const el = Selector("#component-with-rest-attributes");

  await t
    .expect(await el.getAttribute("id"))
    .eql("component-with-rest-attributes")
    .expect(await el.getAttribute("label"))
    .eql("rest-attributes");
});

cloneTest("Can call method inside a getter", async (t) => {
  const el = Selector("#call-method-in-getter-widget");

  await t.expect(await el.textContent).eql("2");

  await t.click(Selector("#button-5"));

  await t.expect(await el.textContent).eql("20");
});

cloneTest("Click on component with default options", async (t) => {
  const el = Selector("#component-with-default-options");

  await t.click(await el.child(0));

  await t.expect(await el.textContent).eql("ab164");
});

cloneTest("Click on list item", async (t) => {
  const el = await Selector("#list-1 .list-item");

  const count = await el.count;

  await t.click(el);

  const changedElements = await Selector("#list-1 .list-item");
  const changedCount = await changedElements.count;

  await t.expect(changedCount).eql(count);

  await t.expect((await el.style)["background-color"]).eql("rgb(0, 0, 0)");
  await t
    .expect((await el.nth(1).style)["background-color"])
    .eql("rgb(255, 0, 0)");

  const readyCounter = await Selector("#list-1 .ready-counter");

  await t.expect(await readyCounter.textContent).eql("6");
});

cloneTest("Can spread props", async (t) => {
  const el = Selector("#spread-props");

  await t.click(el);
  await t.click(el);

  const counter = Selector("#button-1-click-counter");

  await t.expect(counter.textContent).eql("2");
});

cloneTest("Check Effects on DOM update", async (t) => {
  const el = Selector("#button-effects");
  const effects = Selector("#effects-dom-update");

  await t.expect(effects.textContent).eql("(no deps)(A deps)(always)(once)");

  await t.click(el);

  await t
    .expect(effects.textContent)
    .eql("(no deps)(A deps)(always)(once)(B deps)(always)");
});

cloneTest("Check Effects on State update", async (t) => {
  const el = Selector("#button-effects-state");
  const effects = Selector("#effects-state-update");

  await t.expect(effects.textContent).eql("(0 deps)(always)(0 once)");

  await t.click(el);

  await t
    .expect(effects.textContent)
    .eql("(0 deps)(always)(0 once)(1 deps)(always)");
});

cloneTest("Dom Events should not lead to render", async (t) => {
  const el = Selector("#button-effects-state");

  await t.click(el);

  await t.expect(Selector("#sum-array .update-count").textContent).eql("1");
});

cloneTest("Check form values binding", async (t) => {
  const el = Selector("#counter-form-value");

  await t.expect(await el.textContent).eql("15");

  await t.click(Selector("#counter-control"));

  await t.expect(await el.textContent).eql("16");
});

cloneTest("Forward refs", async (t) => {
  const el = Selector(".forward-ref-child");

  await t.expect(await el.count).eql(3);

  await t.expect(await el.nth(0).textContent).eql("childText");
  await t
    .expect((await el.nth(0).style)["background-color"])
    .eql("rgb(120, 120, 120)");
  await t
    .expect(await el.nth(0).getStyleProperty("border-bottom-color"))
    .eql("rgb(0, 0, 0)");

  await t.expect(await el.nth(1).textContent).eql("childText");
  await t
    .expect((await el.nth(1).style)["background-color"])
    .eql("rgb(120, 120, 120)");
  await t
    .expect(await el.nth(1).getStyleProperty("border-bottom-color"))
    .eql("rgb(0, 0, 0)");

  await t.expect(await el.nth(1).textContent).eql("childText");
  await t
    .expect((await el.nth(1).style)["background-color"])
    .eql("rgb(120, 120, 120)");
  await t
    .expect(await el.nth(2).getStyleProperty("border-bottom-color"))
    .eql("rgb(0, 0, 128)");
});

cloneTest("Check templates passing with events binding", async (t) => {
  const el = Selector("#template-app-clicks");

  await t.expect(await el.textContent).eql("");

  await t.click(Selector("#header-component-button"));

  await t.expect(await el.textContent).eql("_header");

  await t.click(Selector("#body-component-button"));

  await t.expect(await el.textContent).eql("_header_body");
});