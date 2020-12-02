import { Selector } from "testcafe";
import { createCloneTest } from "./utils/check-all-platforms";
import screenshotTest from "./utils/screenshot-test";
const cloneTest = createCloneTest("svg-components.html");

fixture`Svg Components`;

cloneTest("Render", async (t) => {
  await t
    .expect(await screenshotTest(t, "body", "svg-components.png"))
    .eql(true);
});

cloneTest("Simple Component: Effect, InternalState update", async (t) => {
  const element = Selector("#simple-svg-component");
  const text = Selector("#simple-svg-component-text");

  await t.click(element);
  await t.click(element);

  await t.expect(await (await text.textContent).trim()).eql("2");
});
