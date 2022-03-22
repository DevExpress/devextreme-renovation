import {
  Portal,
  InfernoEffect,
  RefObject,
  InfernoComponent,
} from '@devextreme/runtime/inferno';
function view(model: Widget) {
  return (
    <div>
      {model.rendered ? (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      ) : null}

      <Portal container={model.props.someRef?.current}>
        <span></span>
      </Portal>
    </div>
  );
}

export type WidgetPropsType = {
  someRef?: RefObject<HTMLElement | null>;
};
export const WidgetProps: WidgetPropsType = {};
type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<any> {
  state: { rendered: boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      rendered: false,
    };
    this.onInit = this.onInit.bind(this);
  }

  rendered!: boolean;

  createEffects() {
    return [new InfernoEffect(this.onInit, [])];
  }

  onInit(): any {
    this.setState((__state_argument: any) => ({ rendered: true }));
  }
  get restAttributes(): RestProps {
    const { someRef, ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      rendered: this.state.rendered,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = WidgetProps;
