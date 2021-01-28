import { Portal } from "../../../../modules/inferno/portal";
import { InfernoEffect } from "../../../../modules/inferno/effect";
import { RefObject } from "../../../../modules/inferno/ref_object";
import { InfernoComponent } from "../../../../modules/inferno/base_component";
function view(model: Widget) {
  return (
    <div>
      {model.rendered && (
        <Portal container={document.body}>
          <span></span>
        </Portal>
      )}

      <Portal container={model.props.someRef?.current}>
        <span></span>
      </Portal>
    </div>
  );
}

export declare type WidgetPropsType = {
  someRef?: any;
};
export const WidgetProps: WidgetPropsType = {};
import { createElement as h } from "inferno-compat";
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
  _currentState: {
    rendered: boolean;
  } | null = null;

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
    const state = this._currentState || this.state;
    return state.rendered;
  }
  set_rendered(value: () => boolean): any {
    this.setState((state: any) => {
      this._currentState = state;
      const newValue = value();
      this._currentState = null;
      return { rendered: newValue };
    });
  }

  onInit(): any {
    this.set_rendered(() => true);
  }
  get restAttributes(): RestProps {
    const { someRef, ...restProps } = this.props;
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
