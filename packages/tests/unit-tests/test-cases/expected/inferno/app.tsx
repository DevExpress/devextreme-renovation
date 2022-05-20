import {
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno';
import { SimpleContext } from './context';
function view(model: ConsumerComponent) {
  return (
    <span id="3">
      Consumer Value:
      {model.contextConsumer}
    </span>
  );
}

export type PropsType = {};
const Props: PropsType = {};
import { createReRenderEffect } from '@devextreme/runtime/inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class ConsumerComponent extends InfernoWrapperComponent<any> {
  state = {};
  refs: any;
  get contextConsumer(): number {
    if ('SimpleContext' in this.context) {
      return this.context.SimpleContext;
    }
    return SimpleContext;
  }

  constructor(props: any) {
    super(props);
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get restAttributes(): RestProps {
    const { ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      contextConsumer: this.contextConsumer,
      restAttributes: this.restAttributes,
    } as ConsumerComponent);
  }
}

ConsumerComponent.defaultProps = Props;
