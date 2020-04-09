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
    onClick: () => any,
    restAttributes:any;
}

export default function Widget(props: WidgetProps) {
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
