function view(viewModel: Widget) { return (<div ref={viewModel.divRef as any}></div>);}

export declare type WidgetInputType = {
    prop1?: number;
    prop2?: number
}
const WidgetInput: WidgetInputType = { };

import React, { useCallback, useRef, useImperativeHandle, forwardRef } from "react";

export type WidgetRef = {
    getHeight: (p:number,p1:any)=>string,
    getSize: () => string
}
interface Widget {
    props: WidgetInputType;
    divRef: any;
    restAttributes: any;
}

const Widget = forwardRef<WidgetRef, WidgetInputType>((props: WidgetInputType, ref) => {
    const divRef = useRef<HTMLDivElement>();

    useImperativeHandle(ref, () => ({
        getHeight: (p:number=10, p1: any) => {
            return `${props.prop1} + ${props.prop2} + ${divRef.current!.innerHTML} + ${p}`;
        },
        getSize: () => {
            return `${props.prop1} + ${divRef.current!.innerHTML}`;
        }
    }), [props.prop1, props.prop2]);
    const restAttributes=useCallback(function restAttributes(){
        const { prop1, prop2, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        divRef,
        restAttributes: restAttributes()
    }));
});

export default Widget;

Widget.defaultProps = {
    ...WidgetInput
}
