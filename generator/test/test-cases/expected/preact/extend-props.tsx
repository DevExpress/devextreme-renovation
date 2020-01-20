import Base from "./empty-component.p"

import * as Preact from "preact";

interface Component {
    size: number,
    height: number,
    width: number
}

export default function Component(props: {
    size: number,
    height: number,
    width: number
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
