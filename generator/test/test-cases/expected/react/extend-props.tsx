import Base from "./empty-component"

import React from "react";

interface Widget {
    size: number,
    height: number,
    width: number
}

export default function Widget(props: {
    size: number,
    height: number,
    width: number
}) {
    return view1(viewModel1({
        ...props
    }));
}

function viewModel1(model: Widget) {
    return {
        height: model.height
    }
}

function view1(viewModel: Widget) {
    return <div style={{ height: viewModel.height }}>
        <span></span>
        <span></span>
        <Base height={viewModel.height}></Base>
    </div>
}
