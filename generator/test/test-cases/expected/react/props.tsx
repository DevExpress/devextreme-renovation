function view() { }
function viewModel() { }

import React, { useCallback } from "react";

interface Widget {
    height: number,
    onClick: (a: number) => null;
    getHeight:()=>number;
}

export default function Widget(props: { 
    height: number,
    onClick: (a: number) => null
}) {
    const getHeight = useCallback(function getHeight() {
        props.onClick(10);
        return props.height;
    }, [props.onClick, props.height]);

    return view(viewModel({
        ...props,
        getHeight
    }));
}

Widget.defaultProps = {
    height: 10,
    onClick: () => null
};
