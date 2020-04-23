import Base, { WidgetProps } from "./component-input"
function view(model: Widget) {
    <Base height={model.getProps().height} />
}
export declare type ChildInputType = typeof WidgetProps & {
    height: number;
    onClick: (a: number) => null
}
const ChildInput: ChildInputType = {
    ...WidgetProps,
    height: 10,
    onClick: () => null
};

import React, { useCallback } from 'react';

interface Widget {
    props: ChildInputType;
    getProps: () => typeof WidgetProps;
    restAttributes: any;

}

export default function Widget(props: ChildInputType) {
    const getProps = useCallback(function getProps() {
        return props;
    }, [props]);

    const restAttributes = useCallback(function restAttributes() {
        const { children, height, onClick, ...restProps } = props
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        getProps,
        restAttributes: restAttributes()
    }));
}

Widget.defaultProps = {
    ...ChildInput
}
