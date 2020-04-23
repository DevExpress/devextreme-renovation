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
const WidgetInput: WidgetInputType = {
   
};

import React, {useCallback} from "react";

interface Widget {
    props: WidgetInputType;
    restAttributes: any;
}

export default function Widget(props: WidgetInputType) {
    const restAttributes=useCallback(function restAttributes(){
        const { children, namedSlot, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        restAttributes: restAttributes()
    }));
}

Widget.defaultProps = {
    ...WidgetInput
}
