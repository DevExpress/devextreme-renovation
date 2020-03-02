function view() { }
function viewModel() { }

declare type WidgetProps={
    height?: number;
    children?: React.ReactNode
}

export const WidgetProps: WidgetProps = {
    height: 10
};

import React, { useCallback } from "react";

interface Widget {
    props: {
        height?: number;
        children?: React.ReactNode;
    },
    onClick:()=>any
}

export default function Widget(props: { 
    height?: number;
    children?: React.ReactNode;
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
