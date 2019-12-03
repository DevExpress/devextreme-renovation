function view() { }
function viewModel() { }

import React from "react";

export default function Component(props: { 
    height: number,
    onClick: (a:number)=>null
}) {
    function getHeight() {
        props.onClick();
        return props.height;
    }

    return view(viewModel({
        ...props
    }));
}

Component.defaultProps = {
    height: 10,
    onClick: () => null
};
