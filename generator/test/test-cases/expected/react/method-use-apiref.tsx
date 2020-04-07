import BaseWidget from "./method";

function view(viewModel: WidgetWithApiRef) { return <BaseWidget ref={viewModel.baseRef} prop1={viewModel.props.prop1}></BaseWidget>;}

declare type WidgetWithApiRefInput = {
    prop1?: number
}
const WidgetWithApiRefInput: WidgetWithApiRefInput = { };

import { WidgetRef as BaseWidgetRef } from "./method";
import React, { useCallback, useRef, useImperativeHandle, forwardRef } from "react";

export type WidgetWithApiRefRef = {
    getSomething: () => string
};

interface WidgetWithApiRef {
    props: WidgetWithApiRefInput;
    baseRef: any;
    customAttributes:()=>any;
}

const WidgetWithApiRef = forwardRef<WidgetWithApiRefRef, WidgetWithApiRefInput>((props: WidgetWithApiRefInput, ref) => {
    const baseRef = useRef<BaseWidgetRef>();

    useImperativeHandle(ref, () => ({
        getSomething: () => { 
            return `${props.prop1} + ${baseRef.current?.getHeight()}`;
        }
    }), [props.prop1]);
    const customAttributes=useCallback(function customAttributes(){
        const { prop1, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        baseRef,
        customAttributes
    }));
});

export default WidgetWithApiRef;

WidgetWithApiRef.defaultProps = {
    ...WidgetWithApiRefInput
}
