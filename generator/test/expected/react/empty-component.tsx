import React from "react";

export default function Component(props: {
  height: number,
  width: number
}) {
  return view1(viewModel1({
    ...props
  }));
}

function viewModel1(model: any) {
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
