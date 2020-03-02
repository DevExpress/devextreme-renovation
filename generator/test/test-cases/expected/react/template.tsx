declare type WidgetInput = {
    render?: () => HTMLDivElement;
    contentRender: (a: string) => any
}

export const WidgetInput: WidgetInput = {
    contentRender: (a: string) => (<div >{a}</div>)
};

import React from "react";
interface Widget {
    props: {
        render?: () => HTMLDivElement;
        contentRender: (a: string) => any;
    };
}

export default function Widget(props: {
    render?: () => HTMLDivElement,
    contentRender: (a: string) => any
}) {

    return view(({
        props: { ...props }
    }));
}

Widget.defaultProps = {
    ...WidgetInput
}


function view(viewModel: Widget) {
    return (<div>
        {viewModel.props.contentRender("1")}
        {viewModel.props.render?.()}
    </div>)
}
