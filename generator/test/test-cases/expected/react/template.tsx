import React from "react";

interface Component {
    render: () => HTMLDivElement,
    contentRender: (a: string) => HTMLDivElement
}

export default function Component(props: {
    render: () => HTMLDivElement,
    contentRender: (a: string) => HTMLDivElement
}) {

    return view(viewModel({
        ...props
    }));
}

Component.defaultProps = {
    contentRender: (a: string) => (<div>{a}</div>)
}

function viewModel(model: Component) {
    return model;
}


function view(viewModel: Component) {
    return (<div>
        {viewModel.contentRender("1")}
        {viewModel.render()}
    </div>)
}
