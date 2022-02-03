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

export class Widget extends BaseInfernoComponent<any> {
  state: { hovered: boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      hovered: false,
    };
    this.setHovered = this.setHovered.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  hovered!: boolean;

  setHovered(__val__: any): void {
    this.setState((__state_argument: any) => ({ hovered: __val__ }));
  }
  updateState(): any {
    this.setHovered(!this.state.hovered);
  }

  render() {
    const { hovered } = this.state;
    const { setHovered, updateState } = this;
    return <span></span>;
  }
}
