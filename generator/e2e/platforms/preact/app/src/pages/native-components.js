import * as Preact from "preact";
import { useState } from "preact/hooks";

import ButtonWithTemplate from "../../../../../components/button-with-template";
import Counter from "../../../../../components/counter";

import Nested from "../../../../../components/nested";

const buttonTemplate = ({ text }) => (
  <div style={{ border: "1px solid blue" }}>{text + "!"}</div>
);

export default () => {
  const [counterValue, counterValueChange] = useState(15);
  return (
    <div>
      <ButtonWithTemplate
        text={"With Template"}
        template={buttonTemplate}
      ></ButtonWithTemplate>

      <ButtonWithTemplate text={"Without Template"}></ButtonWithTemplate>

      <form>
        <Counter
          id="counter-control"
          value={counterValue}
          valueChange={counterValueChange}
        ></Counter>
      </form>
      <div id="counter-form-value">{counterValue}</div>

      <Nested
        rows={[
          { cells: [{ gridData: "cell11" }, "cell12"] },
          { cells: ["cell21", "cell22"] },
        ]}
      ></Nested>
      <Nested rows={[{ cells: ["cell31", { gridData: "cell32" }] }]}></Nested>
      <Nested
        rows={[{ cells: [{ gridData: "cell41" }, { gridData: "cell42" }] }]}
      ></Nested>
      <Nested
        rows={[
          { cells: [{ gridData: "defaultValue" }, { gridData: "notDefault" }] },
        ]}
      ></Nested>
      <Nested rows={[]}></Nested>
      <Nested></Nested>
    </div>
  );
};
