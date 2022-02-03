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

export default class Counter extends BaseInfernoComponent<any> {
  state: { value: number };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      value: 1,
    };
    this.setValue = this.setValue.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  value!: number;

  setValue(__val__: any): void {
    this.setState((__state_argument: any) => ({ value: __val__ }));
  }
  onClick(): any {
    this.setValue(this.state.value + 1);
  }

  render() {
    const { id = "default" } = this.props;
    const { value } = this.state;
    const { setValue, onClick } = this;
    return (
      <button id={id} onClick={onClick}>
        {value}
      </button>
    );
  }
}
