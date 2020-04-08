import React, {useCallback} from "react";

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
