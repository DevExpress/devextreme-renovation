import React, {useCallback} from "react";

interface Widget {
  height: number;
  width: number;
  customAttributes: () => any;
}

export default function Widget(props: {
  height: number,
  width: number
}) {
  const customAttributes=useCallback(function customAttributes(){
    const { height, width, ...restProps } = props;
    return restProps;
}, [props]);
  return view1(viewModel1({
    ...props,
    customAttributes
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
