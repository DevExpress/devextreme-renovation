function view(viewModel: Widget) {
    return (
        <div>
            <div>
                {viewModel.props.namedSlot}
            </div>
            <div>
                {viewModel.props.children}
            </div>
        </div>
    );
}

declare type WidgetInput = {
    namedSlot?: React.ReactNode;
    children?: React.ReactNode;
}
const WidgetInput: WidgetInput = {
   
};

import React from "react";

interface Widget {
    props: WidgetInput;
}

export default function Widget(props: WidgetInput) {
    return view(({
        props: { ...props }
    }));
}

Widget.defaultProps = {
    ...WidgetInput
}
