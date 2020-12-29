import { Portal } from "../../../../modules/inferno/portal";
import { InfernoEffect } from "../../../../modules/inferno/effect";
import { InfernoComponent } from "../../../../modules/inferno/base_component";
function view(model: Widget) {
  return (
    <div>
      {model.rendered && (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      )}

      <Portal container={model.props.someRef?.current!}>
        <span></span>
      </Portal>
    </div>
  );
}

export declare type WidgetPropsType = {
  someRef?: RefObject<HTMLElement>;
};
export const WidgetProps: WidgetPropsType = {};
import { createElement as h } from "inferno-compat";
import { RefObject } from "inferno";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<
  typeof WidgetProps & RestProps
> {
  state: {
    rendered: boolean;
  };
  refs: any;

  constructor(props: typeof WidgetProps & RestProps) {
    super(props);
    this.state = {
      rendered: false,
    };
    this.onInit = this.onInit.bind(this);
  }

  createEffects() {
    return [new InfernoEffect(this.onInit, [])];
  }
  updateEffects() {}

  get rendered(): boolean {
    return this.state.rendered;
  }
  set rendered(value: boolean) {
    this.setState({ rendered: value });
  }

  onInit(): any {
    this.rendered = true;
  }
  get restAttributes(): RestProps {
    const { someRef, ...restProps } = {
      ...this.props,
      someRef: this.props.someRef?.current!,
    };
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      props: { ...props },
      rendered: this.rendered,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}

Widget.defaultProps = {
  ...WidgetProps,
};
