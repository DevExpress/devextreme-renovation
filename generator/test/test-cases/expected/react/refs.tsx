function view(viewModel) { 
    return <div ref={viewModel.divRef}></div>
}
function viewModel() { }

import React, { useRef } from "react";

interface Component {
}

export default function Component(props: { }) {
    const divRef = useRef<HTMLDivElement>();

    function getHeight() {
        return divRef.current!.outerHTML;
    }

    return view(viewModel({
        ...props,
        divRef
    }));
}
