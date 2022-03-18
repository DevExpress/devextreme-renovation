import {
  InfernoEffect,
  BaseInfernoComponent,
  InfernoComponent,
  InfernoWrapperComponent,
  normalizeStyles,
} from '@devextreme/runtime/inferno';

export type SomePropsType = {};
const SomeProps: SomePropsType = {};
function view() {
  return <span></span>;
}

import { createElement as h } from 'inferno-compat';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class InheritedFromBaseComponent extends BaseInfernoComponent<any> {
  state: { _hovered: Boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      _hovered: false,
    };
    this.updateState = this.updateState.bind(this);
  }

  _hovered!: Boolean;

  updateState(): any {
    this.setState((__state_argument: any) => ({
      _hovered: !__state_argument._hovered,
    }));
  }
  get restAttributes(): RestProps {
    const { ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view();
  }
}

InheritedFromBaseComponent.defaultProps = SomeProps;
