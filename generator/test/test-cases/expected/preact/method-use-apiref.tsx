import BaseWidget from "./method.p";

function view(viewModel: WidgetWithApiRef) { return <BaseWidget ref={viewModel.baseRef} prop1={viewModel.props.prop1}></BaseWidget>;}

export declare type WidgetWithApiRefInputType = {
    prop1?: number
}
const WidgetWithApiRefInput: WidgetWithApiRefInputType = { };

import { WidgetRef as BaseWidgetRef } from "./method.p";
import * as Preact from "preact";
import { useCallback, useRef, useImperativeHandle } from 'preact/hooks'
import { forwardRef } from 'preact/compat'

export type WidgetWithApiRefRef = {
    getSomething: () => string,
    __getProps: () => any
};

interface WidgetWithApiRef {
    props: typeof WidgetWithApiRefInput;
    baseRef: any;
    restAttributes: any;
}

const WidgetWithApiRef = forwardRef<WidgetWithApiRefRef, typeof WidgetWithApiRefInput>((props: typeof WidgetWithApiRefInput, ref) => {
    const baseRef = useRef<BaseWidgetRef>();

    useImperativeHandle(ref, () => ({
        getSomething: () => { 
            return `${props.prop1} + ${baseRef.current?.getHeight()}`;
        },
        __getProps: () => {
            return props;
        }
    }), [props.prop1, baseRef.current, props]);

    const __restAttributes=useCallback(function __restAttributes(){
        const { prop1, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        baseRef,
        restAttributes: __restAttributes()
    }));
});

export default WidgetWithApiRef;

(WidgetWithApiRef as any).defaultProps = {
    ...WidgetWithApiRefInput
}
