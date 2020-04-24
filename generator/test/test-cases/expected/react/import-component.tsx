import Base, { WidgetProps } from "./component-input"
function view(model: Child) {
    return <Base height={model.getProps().height} />;
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

interface Child {
    props: ChildInputType;
    getProps: () => typeof WidgetProps;
    restAttributes: any;
}

export default function Child(props: ChildInputType) {
    const getProps = useCallback(function getProps() {
        return { height: props.height };
    }, [props.height]);

    const __restAttributes = useCallback(function __restAttributes() {
        const { children, height, onClick, ...restProps } = props
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        getProps,
        restAttributes: __restAttributes()
    }));
}

Child.defaultProps = {
    ...ChildInput
}
