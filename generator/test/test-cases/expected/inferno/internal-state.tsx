import { InfernoComponent } from "../../../../modules/inferno/base_component";
function view(model: Widget) {
  return <span></span>;
}

import { createElement as h } from "inferno-compat";
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};

export default class Widget extends InfernoComponent<{} & RestProps> {
  state: {
    _hovered: Boolean;
  };
  refs: any;

  constructor(props: {} & RestProps) {
    super(props);
    this.state = {
      _hovered: false,
    };
    this.updateState = this.updateState.bind(this);
  }

  get _hovered(): Boolean {
    return this.state._hovered;
  }
  set _hovered(value: Boolean) {
    this.setState({ _hovered: value });
  }

  updateState(): any {
    this._hovered = !this._hovered;
  }
  get restAttributes(): RestProps {
    const { ...restProps } = this.props;
    return restProps;
  }

  render() {
    const props = this.props;
    return view({
      ...props,
      _hovered: this._hovered,
      updateState: this.updateState,
      restAttributes: this.restAttributes,
    } as Widget);
  }
}
