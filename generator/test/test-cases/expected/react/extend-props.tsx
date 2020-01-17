import Base from "./empty-component"

import React from "react";

interface Component {
    height: number,
    width: number,
    size: number
}

export default function Component(props: {
    height: number,
    width: number,
    size: number
}) {
    return view1(viewModel1({
        ...props
    }));
}

function viewModel1(model: Component) {
    return {
        height: model.height
    }
}

function view1(viewModel: Component) {
    return <div style={{ height: viewModel.height }}>
        <span></span>
        <span></span>
        <Base height={viewModel.height}></Base>
    </div>
}
