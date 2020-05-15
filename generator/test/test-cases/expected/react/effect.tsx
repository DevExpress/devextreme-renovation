function view(model: Widget) {

}
function subscribe(p: string, s: number, i: number) {
    return 1;
}
function unsubscribe(id: number) {
    return undefined;
}
export declare type WidgetInputType = {
    p: string;
    s: number;
    defaultS?:number;
    sChange?:(s:number)=>void
}
export const WidgetInput: WidgetInputType = {
    p: "10",
    s: 10,
    defaultS: 10,
    sChange:()=>{}
};

import React, { useState, useCallback, useEffect } from 'react';
interface Widget {
    props: typeof WidgetInput;
    i: number;
    restAttributes: any;
}

export default function Widget(props: typeof WidgetInput) {
    const [__state_s, __state_setS] = useState(() => props.s !== undefined ? props.s : props.defaultS);
    const [__state_i, __state_setI] = useState(10)

    const __restAttributes=useCallback(function __restAttributes(){
        const { defaultS, p, s, sChange, ...restProps } = props;
        return restProps;
    }, [props]);

    useEffect(() => {
        const id = subscribe(props.p, (props.s !== undefined ? props.s : __state_s), __state_i)
        __state_setI(15)
        return () => unsubscribe(id);
    }, [props.p, props.s, __state_s, props.sChange, __state_i]);

    return view(({
        props: {
            ...props,
            s: (props.s !== undefined ? props.s : __state_s)
        },
        i: __state_i,
        restAttributes: __restAttributes()
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}