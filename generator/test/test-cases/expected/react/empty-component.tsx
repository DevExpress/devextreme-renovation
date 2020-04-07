import React, {useCallback} from "react";

interface Widget {
  height: number;
  width: number;
  getRestProps: () => any;
}

export default function Widget(props: {
  height: number,
  width: number
}) {
  const getRestProps=useCallback(function getRestProps(){
    const { height, width, ...restProps } = props;
    return restProps;
}, [props]);
  return view1(viewModel1({
    ...props,
    getRestProps
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
