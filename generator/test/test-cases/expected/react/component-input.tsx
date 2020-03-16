function view() { }

declare type WidgetProps = {
    height?: number;
    children?: React.ReactNode
}

export const WidgetProps: WidgetProps = {
    height: 10
};

import React, { useCallback } from "react";

interface Widget {
    props: WidgetProps,
    onClick: () => any
}

export default function Widget(props: WidgetProps) {
    const onClick = useCallback(function onClick() {
        const v = props.height
    }, [props.height]);

    return view(({
        props: { ...props },
        onClick
    }));
}

Widget.defaultProps = {
    ...WidgetProps
};
