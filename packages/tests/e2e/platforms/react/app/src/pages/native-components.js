import React, { useState } from "react";

import Counter from "../../../../../components/counter";
import ButtonWithTemplate from "../../../../../components/button-with-template";
import Nested, { Row, RowCell } from "../../../../../components/nested";

const buttonTemplate = ({ text }) => (
  <div style={{ border: "1px solid blue" }}>{text + "!"}</div>
);

export default () => {
  const [counterValue, counterValueChange] = useState(15);
  return (
    <div>
      <ButtonWithTemplate
        text={"With Template"}
        render={buttonTemplate}
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
      <Nested>
        <Row cells={["cell31", { gridData: "cell32" }]} />
      </Nested>
      <Nested>
        <Row>
          <RowCell gridData="cell41" />
          <RowCell gridData="cell42" />
        </Row>
      </Nested>
      <Nested rows={[]}></Nested>
      <br></br>
      Default values:
      <div style={{ border: "1px solid" }}>
        Just nested:
        <Nested></Nested>
        <br />
        Nested Row:
        <Nested>
          <Row></Row>
        </Nested>
        <br />
        Nested Row with not default Row:
        <Nested>
          <Row></Row>
          <Row cells={[{ gridData: "cell11" }, "cell12"]}></Row>
        </Nested>
        <br />
        Nested Cell:
        <Nested>
          <Row>
            <RowCell></RowCell>
          </Row>
        </Nested>
        <br />
        Nested Cell with not default Cell:
        <Nested>
          <Row>
            <RowCell />
            <RowCell gridData="notDefault" />
          </Row>
        </Nested>
      </div>
    </div>
  );
};
