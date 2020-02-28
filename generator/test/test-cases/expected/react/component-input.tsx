function view() { }
function viewModel() { }

declare type WidgetProps={
    height?: number;
}

export const WidgetProps: WidgetProps = {
    height: 10
};

import React, { useCallback } from "react";

interface Widget {
    props: {
        height?: number;
    },
    onClick:()=>any
}

export default function Widget(props: { 
    height?: number
}) {
    const onClick = useCallback(() => {
        const v = props.height
    }, [props.height]);

    return view(viewModel({
        props: { ...props },
        onClick
    }));
}

Widget.defaultProps = {
    ...WidgetProps
};
