function view() { }
function viewModel() { }

function subscribe() {
    return 1;
}

function unsubscribe(id: number) {
    return undefined;
}

import React, { useEffect } from "react";

interface Component {
}

export default function Component(props: {}) {
    useEffect(() => {
        const id = subscribe();
        return function() {
            unsubscribe(id);
        };
    });

    return view(viewModel({
        ...props
    }));
}
