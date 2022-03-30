import {
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno';
import { normalizeStyles } from '@devextreme/runtime/inferno';

export type PropsType = {
  height?: number;
  width?: number;
};
const Props: PropsType = {};
import { createReRenderEffect } from '@devextreme/runtime/inferno';
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoWrapperComponent<any> {
  state = {};
  refs: any;

  constructor(props: any) {
    super(props);
  }

  createEffects() {
    return [createReRenderEffect()];
  }

  get restAttributes(): RestProps {
    const { height, width, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view1({
      props: { ...props },
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = Props;
function view1(viewModel: Widget) {
  return (
    <div style={normalizeStyles({ height: viewModel.props.height })}>
      <span></span>

      <span></span>
    </div>
  );
}
