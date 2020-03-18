import BaseWidget from "./method";

function view(viewModel: Widget) { return <BaseWidget ref={viewModel.baseRef} prop1={viewModel.props.prop1}></BaseWidget>;}

declare type WidgetInput = {
    prop1?: number
}
const WidgetInput: WidgetInput = { };

import { WidgetRef as BaseWidgetRef } from "./method";
import React, { useRef, useImperativeHandle, forwardRef } from "react";

export type WidgetRef = {
    getSomething: () => string
};

interface Widget {
    props: WidgetInput;
    baseRef: any;
}

const Widget = forwardRef<WidgetRef, WidgetInput>((props: WidgetInput, ref) => {
    const baseRef = useRef<BaseWidgetRef>();

    useImperativeHandle(ref, () => ({
        getSomething: () => { 
            return `${props.prop1} + ${baseRef.current!.getHeight()}`;
        }
    }), [props.prop1]);

    return view(({
        props: { ...props },
        baseRef
    }));
});

export default Widget;

Widget.defaultProps = {
    ...WidgetInput
}
