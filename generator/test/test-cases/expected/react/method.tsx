function view() { }
function viewModel() { }

import React, { forwardRef, useImperativeHandle } from "react";

export type ComponentRef = {
    getHeight: () => string
}

type ComponentProps = {};

interface Component {
}

export default forwardRef<ComponentRef, ComponentProps>((props: ComponentProps, ref) => {

    useImperativeHandle(ref, () => ({
        getHeight: () => {
            return "";
        }
    }));

    return view(viewModel({
        ...props
    }));
}
