import { Component, JSXComponent } from "../../component_declaration/common";
import { WithNestedTestInputProps } from "./my-nested-props";

function view({
  props: { parents },
  getNestedTestInputConfigs,
}: WithNestedTest) {
  return (
    <div>
      {parents ? (
        parents.length ? (
          parents?.map((_, index) => (
            <span key={index}>
              {getNestedTestInputConfigs(index)}
              <br />
            </span>
          ))
        ) : (
          <span>{"Empty Array"}</span>
        )
      ) : (
        <span>{"No Data"}</span>
      )}
    </div>
  );
}

@Component({
  view,
})
export default class WithNestedTest extends JSXComponent(
  WithNestedTestInputProps
) {
  getNestedTestInputConfigs(index: number) {
    return `Prop1: ${this.props.parents?.[index].prop1}
    Prop2: ${this.props.parents?.[index].prop2}`;
  }
}
