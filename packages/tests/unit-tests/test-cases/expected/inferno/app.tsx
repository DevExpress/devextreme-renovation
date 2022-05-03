import {
  InfernoEffect,
  RefObject,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno';
function view(model: RefProps) {
  return <div>{'Ref Props'}</div>;
}

export type PropsType = {
  parentRef: RefObject<HTMLDivElement | null>;
};
const Props: PropsType = {} as any as PropsType;
import { createReRenderEffect } from '@devextreme/runtime/inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class RefProps extends InfernoWrapperComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);

    this.loadEffect = this.loadEffect.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.loadEffect, []), createReRenderEffect()];
  }
  updateEffects() {
    this._effects[0]?.update([]);
  }

  loadEffect(): any {
    const parentRef = this.props.parentRef;
    if (parentRef.current) {
      parentRef.current.style.backgroundColor = '#aaaaff';
      parentRef.current.innerHTML += 'childText';
    }
  }
  get restAttributes(): RestProps {
    const { parentRef, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      restAttributes: this.restAttributes,
    } as RefProps);
  }
}

RefProps.defaultProps = Props;
