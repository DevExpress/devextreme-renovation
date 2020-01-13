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

interface Component {
}

export default function Component(props: {
    namedSlot?: React.ReactNode,
    children?: React.ReactNode
}) {
    return view(viewModel({
        ...props
    }));
}
