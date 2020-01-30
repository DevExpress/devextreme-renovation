function view() { }
function viewModel() { }

import React, { useCallback } from "react";

interface Widget {
    height?: number;
    onClick:()=>void
}

export default function Widget(props: { 
    height?: number
}) {
    const onClick = useCallback(() => {
        const v = props.height
    }, [props.height]);

    return view(viewModel({
        props: { ...props },
        onClick
    }));
}

Widget.defaultProps = {
    height: 10
};
