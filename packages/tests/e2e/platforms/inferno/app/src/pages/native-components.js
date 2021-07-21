import { createElement as h } from "inferno-create-element";
import { Component } from "inferno";

import ButtonWithTemplate from "../../../../../components/button-with-template";
import Counter from "../../../../../components/counter";

import Nested from "../../../../../components/nested";
import UndefWidget from "../../../../../components/nested-undefined-component";
const buttonTemplate = ({ text }) => (
  <div style={{ border: "1px solid blue" }}>{text + "!"}</div>
);

export default class NativeComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counterValue: 15,
    };

    this.counterValueChange = this.counterValueChange.bind(this);
  }

  counterValueChange(e) {
    this.setState({
      counterValue: e,
    });
  }

  render() {
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
            value={this.state.counterValue}
            valueChange={this.counterValueChange}
          ></Counter>
        </form>
        <div id="counter-form-value">{this.state.counterValue}</div>
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
        <Nested rows={[]}></Nested>
        <br />
        Default values:
        <div style={{ border: "1px solid" }}>
          Just nested:
          <Nested rows={[{ cells: ["defaultValue"] }]}></Nested>
          <br />
          Nested Row:
          <Nested rows={[{ cells: ["defaultValue"] }]}></Nested>
          <br />
          Nested Row with not default Row:
          <Nested
            rows={[
              { cells: ["defaultValue"] },
              { cells: ["cell11", "cell12"] },
            ]}
          ></Nested>
          <br />
          Nested Cell:
          <Nested rows={[{ cells: ["defaultValue"] }]}></Nested>
          <br />
          Nested Cell with not default Cell:
          <Nested rows={[{ cells: ["defaultValue", "notDefault"] }]}></Nested>
        </div>
        hasOwnProperty tests<br/>
        All is not defined
        <UndefWidget/>
        All is defined by a prop
        <UndefWidget oneWayProp={2} twoWayProp={2} someRef={null} 
          someForwardRef={null} nestedProp={[{numberProp: 2}]} 
          anotherNestedPropInit={[{numberProp: 2}]}>
        </UndefWidget>
        Nested defined by a config component, OneWay and TwoWay set to undefined
        <UndefWidget oneWayProp={undefined} twoWayProp={undefined} nestedProp={[{numberProp: 2}]}>
        </UndefWidget>
      </div>
    );
  }
}
