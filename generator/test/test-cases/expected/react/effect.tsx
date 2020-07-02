function view(model: Widget) {
    return <div></div>
}
function subscribe(p: string, s: number, i: number) {
    return 1;
}
function unsubscribe(id: number) {
    return undefined;
}
export declare type WidgetInputType = {
    p: string;
    r: string;
    s: number;
    defaultS?:number;
    sChange?:(s:number)=>void
}
export const WidgetInput: WidgetInputType = {
    p: "10",
    r: "20",
    s: 10,
    defaultS: 10,
    sChange:()=>{}
};

import React, { useState, useCallback, useEffect } from 'react';
declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface Widget {
    props: typeof WidgetInput & RestProps;
    i: number;
    j: number;
    getP: () => any;
    restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
    const [__state_s, __state_setS] = useState(() => props.s !== undefined ? props.s : props.defaultS!);
    const [__state_i, __state_setI] = useState(10)
    const [__state_j, __state_setJ] = useState(20)

    const getP = useCallback(function getP(): any {
        return props.p;
    }, [props.p]);

    const __restAttributes=useCallback(function __restAttributes(): RestProps{
        const { defaultS, p, r, s, sChange, ...restProps } = {
            ...props,
            s: (props.s !== undefined ? props.s : __state_s)
        }
        return restProps;
    }, [props, __state_s]);

    useEffect(() => {
        const id = subscribe(getP(), (props.s !== undefined ? props.s : __state_s), __state_i)
        __state_setI(__state_i => 15)
        return () => unsubscribe(id);
    }, [props.p, props.s, __state_s, __state_i]);

    useEffect(() => {
        const id = subscribe(getP(), (props.s !== undefined ? props.s : __state_s), __state_i);
        __state_setI(__state_i => 15)
        return () => unsubscribe(id);
    }, []);

    useEffect(() => {
        const id = subscribe(getP(), 1, 2);
        return () => unsubscribe(id);
    }, [__state_i, __state_j, props.p, props.r, props.s, __state_s, props.defaultS, props.sChange]);
    
    return view(({
        props: {
            ...props,
            s: (props.s !== undefined ? props.s : __state_s)
        },
        i: __state_i,
        j: __state_j,
        getP,
        restAttributes: __restAttributes()
    }));
}

Widget.defaultProps = {
    ...WidgetInput
}