import Base from "./empty-component.p"

import * as Preact from "preact";

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
