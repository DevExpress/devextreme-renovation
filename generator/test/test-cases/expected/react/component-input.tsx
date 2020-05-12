export const COMPONENT_INPUT_CLASS = "c3";

function view() { }

export declare type WidgetPropsType = {
    height?: number;
    width?: number;
    children?: React.ReactNode
}

export const WidgetProps: WidgetPropsType = {
    height: 10,
    width: 10
};

import React, { useCallback } from "react";

interface Widget {
    props: typeof WidgetProps,
    onClick: () => any,
    restAttributes:any;
}

export default function Widget(props: typeof WidgetProps) {
    const onClick = useCallback(function onClick() {
        const v = props.height
    }, [props.height]);
    const __restAttributes=useCallback(function __restAttributes(){
        const { children, height, width, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        onClick,
        restAttributes: __restAttributes()
    }));
}

Widget.defaultProps = {
    ...WidgetProps
};
