function view(viewModel) {
    return (
        <div>
            <div>
                {viewModel.namedSlot}
            </div>
            <div>
                {viewModel.children}
            </div>
        </div>
    );
}
function viewModel() { }

import React from "react";

interface Widget {
    namedSlot?: React.ReactNode,
    children?: React.ReactNode
}

export default function Widget(props: {
    namedSlot?: React.ReactNode,
    children?: React.ReactNode
}) {
    return view(viewModel({
        ...props
    }));
}
