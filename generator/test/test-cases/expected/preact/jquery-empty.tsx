import * as Preact from "preact";
import { useCallback } from "preact/hooks";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import Component from "../../../../../component_declaration/jquery_base_component"

interface Widget {
  height: number;
  width: number;
  restAttributes: any;
}

export default function Widget(props: {
  height: number,
  width: number
}) {
  const restAttributes=useCallback(function restAttributes(){
    const { height, width, ...restProps } = props;
    return restProps;
}, [props]);
  return view1(viewModel1({
    ...props,
    restAttributes: restAttributes()
  }));
}

export class DxWidget extends Component {
  get _viewComponent() {
      return Widget;
  }
}

registerComponent('Widget', DxWidget);

function viewModel1(model: Widget) {
  return {
    height: model.height
  }
}

function view1(viewModel) {
  return <div style={{ height: viewModel.height }}>
    <span></span>
    <span></span>
  </div>
}
