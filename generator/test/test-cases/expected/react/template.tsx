declare type WidgetInput = {
    render: () => any;
    contentRender: (data: { p1: string }) => any
}
export const WidgetInput: WidgetInput = {
    render: () => <div ></div>,
    contentRender: (data) => (<div >{data.p1}</div>)
};

import React from 'react'
interface Widget {
    props: WidgetInput;
}

export default function Widget(props: WidgetInput) {
    return view(({
        props: { ...props }
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}

function view(viewModel: Widget) {
    return (<div >
        <viewModel.props.contentRender p1={"value"} />
        <viewModel.props.render />
    </div>);
}