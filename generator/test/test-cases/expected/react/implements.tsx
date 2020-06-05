import BaseProps from "./component-bindings-only"
const view = (model: Widget) => <span />

interface PropsI {
    p: string
}

interface WidgetI {
    onClick(): void
}
export declare type WidgetInputType = typeof BaseProps & {
    p: string
}
const WidgetInput: WidgetInputType = {
    ...BaseProps,
    p: "10"
};


import React, { useCallback } from 'react';

interface Widget {
    props: typeof WidgetInput;
    onClick: () => void;
    restAttributes: any;
}

export default function Widget(props: typeof WidgetInput) {
    const onClick = useCallback(function onClick() {

    }, []);
    const __restAttributes = useCallback(function __restAttributes() {
        const { height, p, ...restProps } = props
        return restProps;
    }, [props]);

    return view(
        ({
            props: { ...props },
            onClick,
            restAttributes: __restAttributes()
        })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}
