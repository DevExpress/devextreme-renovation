function view(viewModel) {
    return <div ref={viewModel.divRef}></div>
}
function viewModel() { }

import React, { useCallback, useRef } from "react";

interface Component {
    divRef: any;
    clickHandler: () => void;
}

export default function Component(props: {}) {
    const divRef = useRef<HTMLDivElement>();

    const clickHandler = useCallback(() => {
        const html = divRef.current!.outerHTML;
    }, [divRef])

    const getHeight = useCallback(function getHeight() {
        return divRef.current!.outerHTML;
    }, []);

    return view(viewModel({
        ...props,
        clickHandler,
        divRef
    }));
}
