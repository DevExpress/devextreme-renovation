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

declare type WidgetInput = {
    namedSlot?: React.ReactNode;
    children?: React.ReactNode;
}
const WidgetInput: WidgetInput = {
   
};

import React, {useCallback} from "react";

interface Widget {
    props: WidgetInput;
    restAttributes: any;
}

export default function Widget(props: WidgetInput) {
    const __restAttributes=useCallback(function __restAttributes(){
        const { children, namedSlot, ...restProps } = props;
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
