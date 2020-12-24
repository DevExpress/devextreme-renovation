import { createPortal } from "inferno";
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
import { Component as InfernoComponent, RefObject } from "inferno";
import { createElement as h } from "inferno-compat";

declare type PortalProps = {
  container?: HTMLElement | null;
  children: any;
};
const Portal = ({ container, children }: PortalProps): any => {
  if (container) {
    return createPortal(children, container);
  }
  return null;
};
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

class InfernoEffect {
  private destroy?: () => void;
  private timeout = 0;
  constructor(
    private effect: () => () => void,
    private dependency: Array<any>
  ) {
    this.timeout = setTimeout(() => (this.destroy = effect()));
  }

  update(dependency?: Array<any>) {
    if (!dependency || dependency.some((d, i) => this.dependency[i] !== d)) {
      this.destroy?.();
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => (this.destroy = this.effect()));
    }
    if (dependency) {
      this.dependency = dependency;
    }
  }

  dispose() {
    this.destroy?.();
  }
}
export default class Widget extends InfernoComponent<
  typeof WidgetProps & RestProps
> {
  state: {
    rendered: boolean;
  };
  refs: any;

  _effects: InfernoEffect[] = [];
  constructor(props: typeof WidgetProps & RestProps) {
    super(props);
    this.state = {
      rendered: false,
    };
    this.onInit = this.onInit.bind(this);
  }

  get rendered(): boolean {
    return this.state.rendered;
  }
  set rendered(value: boolean) {
    this.setState({ rendered: value });
  }

  componentDidMount() {
    this._effects = [new InfernoEffect(this.onInit, [])];
  }
  componentDidUpdate() {}
  componentWillUnmount() {
    this._effects.forEach((e) => e.dispose());
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
