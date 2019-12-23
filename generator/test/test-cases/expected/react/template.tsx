function view() { }
function viewModel() { }

import React from "react";

interface Component {
    render: any,
    contentRender: any
}

export default function Component(props: { 
    render: any,
    contentRender: any;
}) {
 
    return view(viewModel({
        ...props
    }));
}
