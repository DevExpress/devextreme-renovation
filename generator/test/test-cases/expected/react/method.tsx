function view(viewModel: Widget) { return (<div ref={viewModel.divRef as any}></div>);}

declare type WidgetInput = {
    prop1?: number;
    prop2?: number
}
const WidgetInput: WidgetInput = { };

import React, { useRef, useImperativeHandle, forwardRef } from "react";

export type WidgetRef = {
    getHeight: () => string,
    getSize: () => string
}
interface Widget {
    props: WidgetInput;
    divRef: any;
}

const Widget = forwardRef<WidgetRef, WidgetInput>((props: WidgetInput, ref) => {
    const divRef = useRef<HTMLDivElement>();

    useImperativeHandle(ref, () => ({
        getHeight: () => {
            return `${props.prop1} + ${props.prop2} + ${divRef.current!.innerHTML}`;
        },
        getSize: () => {
            return `${props.prop1} + ${divRef.current!.innerHTML}`;
        }
    }), [props.prop1, props.prop2]);

    return view(({
        props: { ...props },
        divRef
    }));
});

export default Widget;

Widget.defaultProps = {
    ...WidgetInput
}
