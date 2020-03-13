function view(model: Widget) {

}
function subscribe(p: string, s: number, i: number) {
    return 1;
}
function unsubscribe(id: number) {
    return undefined;
}
declare type WidgetInput = {
    p: string;
    s: number
}
export const WidgetInput: WidgetInput = {
    p: "10",
    s: 10
};

import React, { useState, useEffect } from 'react';
interface Widget {
    props: WidgetInput;
    i: number;

}

export default function Widget(props: WidgetInput) {
    const [__state_s, __state_setS] = useState(() => (props.s !== undefined ? props.s : props.defaultS) || 10);;
    const [__state_i, __state_setI] = useState(10);

    useEffect(() => {
        const id = subscribe(props.p, (props.s !== undefined ? props.s : __state_s), __state_i)
        __state_setI(15)
        return () => unsubscribe(id);
    },
        [props.p, props.s, __state_s, props.sChange, __state_i])

    return view(({
        props: {
            ...props,
            s: props.s !== undefined ? props.s : __state_s
        },
        i: __state_i
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput,
    sChange: () => { }
}