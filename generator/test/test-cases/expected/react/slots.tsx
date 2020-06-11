function view(viewModel: Widget) {
    return (
        <div>
            <div>
                {viewModel.props.namedSlot}
            </div>
            <div>
                {viewModel.props.children}
            </div>
        </div>
    );
}
export declare type WidgetInputType = {
    namedSlot?: React.ReactNode;
    children?: React.ReactNode;
}
const WidgetInput: WidgetInputType = {};

import React, {useCallback} from "react";

interface Widget {
    props: typeof WidgetInput;
    restAttributes: any;
}

export default function Widget(props: typeof WidgetInput) {
    const __restAttributes = useCallback(function __restAttributes(){
        const { children, default: defaultSlot, namedSlot, ...restProps } = {
            ...props,
            default: props.children
        }
      return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        restAttributes: __restAttributes()
    }));
}

Widget.defaultProps = {
    ...WidgetInput
}
