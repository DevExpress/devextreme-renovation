import { COMPONENT_INPUT_CLASS } from "./component-input";
import ExternalComponent from "./counter";
export const PREFIX = "dx";
export const CLASS_NAME = PREFIX + "c1" + "c2" + COMPONENT_INPUT_CLASS;
export type Item = { text: string; key: number };
const getKey = (item: Item) => item.key;

import { createElement as h } from "inferno-compat";
import {
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from "@devextreme/runtime/inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class WidgetWithGlobals extends BaseInfernoComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
  }

  render() {
    const { items = [] } = this.props;

    return (
      <div className={CLASS_NAME}>
        <span className={CLASS_NAME}></span>

        <ExternalComponent />

        {items.map((item) => (
          <div key={getKey(item)}></div>
        ))}
      </div>
    );
  }
}
