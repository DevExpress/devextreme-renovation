import {
  InfernoEffect,
  InfernoComponent,
} from '@devextreme/runtime/inferno';

export type SomePropsType = {};
const SomeProps: SomePropsType = {};
function view() {
  return <span></span>;
}

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};

export class InheritedFromInfernoComponent extends InfernoComponent<any> {
  state: { _hovered: Boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      _hovered: false,
    };
    this.someEffect = this.someEffect.bind(this);
  }

  _hovered!: Boolean;

  createEffects() {
    return [new InfernoEffect(this.someEffect, [])];
  }
  updateEffects() {
    this._effects[0]?.update([]);
  }

  someEffect(): any {}
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

InheritedFromInfernoComponent.defaultProps = SomeProps;
