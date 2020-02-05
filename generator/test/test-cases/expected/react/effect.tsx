function view() { }
function viewModel() { }

function subscribe(p: string, s: number, i: number) {
    return 1;
}

function unsubscribe(id: number) {
    return undefined;
}

import React, { useState, useEffect } from "react";

interface Widget {
    p: string;
    s: number;
    defaultS?: number;
    sChange?: (s: number) => void;
    i: number;
}

export default function Widget(props: {
    p: string,
    s: number,
    defaultS?: number,
    sChange?: (s: number) => void
}) {
    const [__state_s, __state_setS] = useState(() => (props.s !== undefined ? props.s : props.defaultS) || undefined);;
    const [__state_i, __state_setI] = useState(undefined);


    useEffect(() => {
        const id = subscribe(props.p, (props.s !== undefined ? props.s : __state_s), __state_i)
        return () => unsubscribe(id);
    },
        [props.p, props.s, __state_s, props.sChange, __state_i])

    return view(viewModel({
        ...props,
        i: __state_i,
        s: props.s !== undefined ? props.s : __state_s
    }));
}

Widget.defaultProps = {
    p: "10",
    sChange: () => { }
}
