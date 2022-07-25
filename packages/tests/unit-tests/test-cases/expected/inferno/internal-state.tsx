import {
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';
function view(model: Widget) {
  return <span></span>;
}

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};

export default class Widget extends BaseInfernoComponent<any> {
  state: { _hovered: Boolean };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      _hovered: false,
    };
    this.updateState = this.updateState.bind(this);
  }

  _hovered!: Boolean;

  updateState(): any {
    this.setState((__state_argument: any) => ({
      _hovered: !__state_argument._hovered,
    }));
  }
  get restAttributes(): RestProps {
    const { ...restProps } = this.props as any;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      ...props,
      _hovered: this.state._hovered,
      updateState: this.updateState,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}
