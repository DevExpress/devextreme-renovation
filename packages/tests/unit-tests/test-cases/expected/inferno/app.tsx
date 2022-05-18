import {
  InfernoEffect,
  RefObject,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno';
import { normalizeStyles } from '@devextreme/runtime/inferno';
function view({ buttonRef, contentRef }: EffectSubscribeUnsubscribe) {
  return (
    <div>
      <span
        ref={buttonRef}
        style={normalizeStyles({ border: '1px solid black' })}
        id="effect-subscribe-unsubscribe-button"
      >
        Update State
      </span>
      :
      <span
        ref={contentRef}
        id="effect-subscribe-unsubscribe-button-content"
      ></span>
    </div>
  );
}

export type PropsType = {};
const Props: PropsType = {};
import { createReRenderEffect } from '@devextreme/runtime/inferno';
import { createRef as infernoCreateRef } from 'inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class EffectSubscribeUnsubscribe extends InfernoWrapperComponent<any> {
  state: { state1: number };

  refs: any;
  buttonRef: RefObject<HTMLSpanElement> = infernoCreateRef<HTMLSpanElement>();
  contentRef: RefObject<HTMLSpanElement> = infernoCreateRef<HTMLSpanElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      state1: 0,
    };
    this.subscribeOnClick = this.subscribeOnClick.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  state1!: number;

  createEffects() {
    return [
      new InfernoEffect(this.subscribeOnClick, [this.state.state1]),
      createReRenderEffect(),
    ];
  }
  updateEffects() {
    this._effects[0]?.update([this.state.state1]);
  }

  subscribeOnClick(): any {
    const handler = this.onButtonClick.bind(this);
    this.buttonRef.current?.addEventListener('click', handler);
    return () => this.buttonRef.current?.removeEventListener('click', handler);
  }
  onButtonClick(): any {
    const value = this.state.state1;
    if (this.contentRef.current) {
      this.contentRef.current.innerHTML = value.toString();
    }
    this.setState((__state_argument: any) => ({
      state1: __state_argument.state1 + 1,
    }));
  }
  get restAttributes(): RestProps {
    const { ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      state1: this.state.state1,
      buttonRef: this.buttonRef,
      contentRef: this.contentRef,
      onButtonClick: this.onButtonClick,
      restAttributes: this.restAttributes,
    } as EffectSubscribeUnsubscribe);
  }
}

EffectSubscribeUnsubscribe.defaultProps = Props;
