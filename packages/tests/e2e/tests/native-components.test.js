import { Selector } from "testcafe";
import { createCloneTest } from "./utils/check-all-platforms";
import screenshotTest from "./utils/screenshot-test";
const cloneTest = createCloneTest("native-components.html");

fixture`Native Components`;

cloneTest("Render", async (t) => {
  await t
    .expect(await screenshotTest(t, "body", "native-components.png"))
    .eql(true);
});

cloneTest("Check form values binding", async (t) => {
  const el = Selector("#counter-form-value");

  await t.expect(await el.textContent).eql("15");

  await t.click(Selector("#counter-control"));

  await t.expect(await el.textContent).eql("16");
});
