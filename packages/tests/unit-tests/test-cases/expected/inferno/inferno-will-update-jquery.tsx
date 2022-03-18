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
import { createReRenderEffect } from '@devextreme/runtime/inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export class InheritedFromInfernoWrapperComponent extends InfernoWrapperComponent<any> {
  state: { _hovered: Boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      _hovered: false,
    };
  }

  _hovered!: Boolean;

  createEffects() {
    return [createReRenderEffect()];
  }

  get someGetter(): any {
    return this.state._hovered;
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

InheritedFromInfernoWrapperComponent.defaultProps = SomeProps;
