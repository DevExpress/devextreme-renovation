function view(model: Widget) {
    return <span></span>
}
export declare type WidgetInputType = {
    height: number;
    onClick: (a: number) => null
}
const WidgetInput: WidgetInputType = {
    height: 10,
    onClick: () => null
};

import React, { useCallback } from 'react';
interface Widget {
    props: typeof WidgetInput;
    getHeight: () => number;
    restAttributes: any;
}

export default function Widget(props: typeof WidgetInput) {
    const getHeight = useCallback(function getHeight() {
        props.onClick(10);
        const { onClick } = props;
        onClick(11);
        return props.height;
    }, [props.onClick, props.height]);

    const __restAttributes=useCallback(function __restAttributes(){
        const { height, onClick, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        getHeight,
        restAttributes: __restAttributes()
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}
