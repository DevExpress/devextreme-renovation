import {
  InfernoEffect,
  RefObject,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno';
import { normalizeStyles } from '@devextreme/runtime/inferno';
function view(model: EffectsDOMUpdate) {
  return (
    <div>
      <span>{model.props.text}</span>

      <div
        id={model.props.name}
        ref={model.divRef}
        style={normalizeStyles({ backgroundColor: '#b3b3b3' })}
      ></div>
    </div>
  );
}

export type PropsType = {
  name?: string;
  text: string;
};
const Props: PropsType = {} as any as PropsType;
import { createReRenderEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class EffectsDOMUpdate extends InfernoWrapperComponent<any> {
  state = {};
  refs: any;
  divRef: RefObject<HTMLDivElement> = infernoCreateRef<HTMLDivElement>();

  constructor(props: any) {
    super(props);

    this.noDepsEffect = this.noDepsEffect.bind(this);
    this.depsEffect = this.depsEffect.bind(this);
    this.alwaysEffect = this.alwaysEffect.bind(this);
    this.onceEffect = this.onceEffect.bind(this);
  }

  createEffects() {
    return [
      new InfernoEffect(this.noDepsEffect, []),
      new InfernoEffect(this.depsEffect, [this.props.text]),
      new InfernoEffect(this.alwaysEffect, [
        this.props,
        this.props.name,
        this.props.text,
      ]),
      new InfernoEffect(this.onceEffect, []),
      createReRenderEffect(),
    ];
  }
  updateEffects() {
    this._effects[0]?.update([]);
    this._effects[1]?.update([this.props.text]);
    this._effects[2]?.update([this.props, this.props.name, this.props.text]);
  }

  noDepsEffect(): any {
    this.divRef.current?.insertAdjacentText('beforeend', `(no deps)`);
  }
  depsEffect(): any {
    this.divRef.current?.insertAdjacentText(
      'beforeend',
      `(${this.props.text} deps)`
    );
  }
  alwaysEffect(): any {
    this.divRef.current?.insertAdjacentText('beforeend', '(always)');
  }
  onceEffect(): any {
    this.divRef.current?.insertAdjacentText('beforeend', `(once)`);
  }
  get restAttributes(): RestProps {
    const { name, text, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      divRef: this.divRef,
      restAttributes: this.restAttributes,
    } as EffectsDOMUpdate);
  }
}

EffectsDOMUpdate.defaultProps = Props;
