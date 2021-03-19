import { Selector } from "testcafe";
import cloneTest from "./utils/check-all-platforms";
import screenshotTest from "./utils/screenshot-test";

fixture`Index Page`;

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

  await t.expect(await el.textContent).eql("ab164abcobjfunc");
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

cloneTest("Click on template list item", async (t) => {
  const el = await Selector("#list-2 .list-item");

  const count = await el.count;

  await t.click(el);

  const changedElements = await Selector("#list-2 .list-item");
  const changedCount = await changedElements.count;

  await t.expect(changedCount).eql(count);

  await t.expect((await el.style)["background-color"]).eql("rgb(0, 0, 0)");
  await t
    .expect((await el.nth(1).style)["background-color"])
    .eql("rgb(255, 0, 0)");

  const readyCounter = await Selector("#list-2 .ready-counter");

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

cloneTest("Effect subscription/un-subscription", async (t) => {
  const el = Selector("#effect-subscribe-unsubscribe-button");

  await t.click(el);
  await t.click(el);
  await t.click(el);

  await t
    .expect(
      Selector("#effect-subscribe-unsubscribe-button-content").textContent
    )
    .eql("2");
});

cloneTest("Forward refs", async (t) => {
  const el = Selector(".forward-ref-child");

  await t.expect(await el.count).eql(4);

  await t.expect(await el.nth(0).textContent).eql("childText");
  await t
    .expect((await el.nth(0).style)["background-color"])
    .eql("rgb(120, 120, 120)");
  await t
    .expect(await el.nth(0).getStyleProperty("border-bottom-color"))
    .eql("rgb(0, 0, 0)");

  await t.expect(await el.nth(1).textContent).eql("assignChildText");
  await t
    .expect((await el.nth(1).style)["background-color"])
    .eql("rgb(200, 200, 200)");
  await t
    .expect(await el.nth(1).getStyleProperty("border-bottom-color"))
    .eql("rgb(0, 0, 0)");

  await t.expect(await el.nth(2).textContent).eql("childText");
  await t
    .expect((await el.nth(2).style)["background-color"])
    .eql("rgb(120, 120, 120)");
  await t
    .expect(await el.nth(2).getStyleProperty("border-bottom-color"))
    .eql("rgb(0, 0, 0)");

  await t.expect(await el.nth(3).textContent).eql("childText");
  await t
    .expect((await el.nth(3).style)["background-color"])
    .eql("rgb(120, 120, 120)");
  await t
    .expect(await el.nth(3).getStyleProperty("border-bottom-color"))
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

cloneTest("Context - share object", async (t) => {
  const checkValue = async (expected) => {
    const pagerValueEl = await Selector("#pager span.value");
    const pagingEl = await Selector("#context-paging-value");
    const appEl = await Selector("#context-page-selector span.value");
    const getterContext = await Selector("#context-getter-provider");

    await t.expect(await pagerValueEl.textContent).eql(expected);
    await t
      .expect((await pagingEl.textContent).trim())
      .eql(`paging:${expected}`);
    await t.expect(await appEl.textContent).eql(expected);
    await t
      .expect(await getterContext.textContent)
      .eql(`Consumer Value:${expected}`);
  };

  await t.click("#context-page-selector span.add");
  await t.click("#context-page-selector span.add");
  await checkValue("3");

  await t.click("#pager span.sub");
  await checkValue("2");
});

cloneTest("Property access chain in view", async (t) => {
  const el = await Selector("#test-property-access-chain");

  await t.expect((await el.textContent).trim()).eql(`undefinedundefinedvalue`);
});

cloneTest("Render slot conditionally", async (t) => {
  const switchButton = await Selector("#render-slot-condition-switch");

  const assert = async (button = false) => {
    const content = await Selector("#render-slot-condition-content");
    await t.expect((await content.textContent).trim()).eql("content");
    const buttonEl = Selector("#render-slot-condition-in-button").exists;
    if (button) {
      await t.expect(buttonEl).ok();
    } else {
      await t.expect(buttonEl).notOk();
    }
  };

  await assert(false);
  await t.click(switchButton);

  await assert(true);
  await t.click(switchButton);
  await assert(false);
});

cloneTest("Default props", async (t) => {
  const assert = async (selector, value) => {
    const content = await Selector(`.${selector}`);
    await t.expect((await content.textContent).trim()).eql(value);
  };

  await assert("default-props-optional-boolean", "undefined");
  await assert("default-props-boolean-with-default", "false");

  await assert("default-props-optional-number", "undefined");
  await assert("default-props-number-with-default", "1");

  await assert("default-props-optional-boolean-or-number", "undefined");
  await assert("default-props-optional-boolean-in-rest", "false");
});

cloneTest("Set forward ref", async (t) => {
  const content = await Selector("#set-ref");

  await t
    .expect((await content.textContent).trim())
    .eql(
      "non-object-ref-value: 10content in forwardRefcontent in forwardRefDeepconsumer is rendered:element passed"
    );
});

cloneTest("Dynamic components", async (t) => {
  const dynamicComponent = await Selector("#dynamic-component");
  const dynamicComponentCondition = await Selector(
    "#dynamic-component-condition"
  );
  const dynamicComponentArray = await Selector(".dynamic-component-array");
  const dynamicComponentSlot = await Selector("#dynamic-component-slot");
  const dynamicComponentWithTemplate = await Selector(
    "#dynamic-component-button-with-template"
  );

  const checkContent = async (value, conditionIsVisible) => {
    await t.expect((await dynamicComponent.textContent).trim()).eql(`${value}`);

    if (conditionIsVisible) {
      await t
        .expect((await dynamicComponentCondition.textContent).trim())
        .eql(`${value + 1}`);
    } else {
      await t.expect(dynamicComponentCondition.exists).notOk();
    }

    await t
      .expect((await dynamicComponentArray.nth(0).textContent).trim())
      .eql(`${value}`);

    await t
      .expect((await dynamicComponentArray.nth(1).textContent).trim())
      .eql(`${value}`);

    await t
      .expect((await dynamicComponentSlot.textContent).trim())
      .eql(`Slot:${value}`);

    await t
      .expect((await dynamicComponentWithTemplate.textContent).trim())
      .eql(`Template:${value}`);
  };

  await checkContent(1, false);

  await t.click(dynamicComponent);

  await checkContent(4, true);

  await t.click(dynamicComponentCondition);

  await checkContent(12, true);

  await t.click(dynamicComponentArray.nth(0));

  await checkContent(26, false);
});

cloneTest("Styles unification", async (t) => {
  const stylesComponent = Selector("#styles-unification");

  await t
    .expect(await stylesComponent.getStyleProperty("background-color"))
    .eql("rgb(0, 128, 0)");

  await t.expect(await stylesComponent.getStyleProperty("z-index")).eql("100");

  await t.expect(await stylesComponent.getStyleProperty("width")).eql("100px");

  await t.expect(await stylesComponent.getStyleProperty("height")).eql("100px");

  await t.expect(await stylesComponent.getStyleProperty("opacity")).eql("0.5");

  await t
    .expect(await stylesComponent.getStyleProperty("padding-left"))
    .eql("10px");
});
