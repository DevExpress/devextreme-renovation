import BaseWidget from "./method.p";

function view(viewModel: WidgetWithApiRef) { return <BaseWidget ref={viewModel.baseRef} prop1={viewModel.props.prop1}></BaseWidget>;}

declare type WidgetWithApiRefInput = {
    prop1?: number
}
const WidgetWithApiRefInput: WidgetWithApiRefInput = { };

import { WidgetRef as BaseWidgetRef } from "./method.p";
import * as Preact from "preact";
import { useCallback, useRef, useImperativeHandle } from 'preact/hooks'
import { forwardRef } from 'preact/compat'

export type WidgetWithApiRefRef = {
    getSomething: () => string
};

interface WidgetWithApiRef {
    props: WidgetWithApiRefInput;
    baseRef: any;
    restAttributes: any;
}

const WidgetWithApiRef = forwardRef<WidgetWithApiRefRef, WidgetWithApiRefInput>((props: WidgetWithApiRefInput, ref) => {
    const baseRef = useRef<BaseWidgetRef>();

    useImperativeHandle(ref, () => ({
        getSomething: () => { 
            return `${props.prop1} + ${baseRef.current?.getHeight()}`;
        }
    }), [props.prop1]);

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
