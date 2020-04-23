export const COMPONENT_INPUT_CLASS = "c3";

function view() { }

export declare type WidgetPropsType = {
    height?: number;
    children?: React.ReactNode
}

export const WidgetProps: WidgetPropsType = {
    height: 10
};

import React, { useCallback } from "react";

interface Widget {
    props: WidgetPropsType,
    onClick: () => any,
    restAttributes:any;
}

export default function Widget(props: WidgetPropsType) {
    const onClick = useCallback(function onClick() {
        const v = props.height
    }, [props.height]);
    const restAttributes=useCallback(function restAttributes(){
        const { children, height, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        onClick,
        restAttributes: restAttributes()
    }));
}

Widget.defaultProps = {
    ...WidgetProps
};
