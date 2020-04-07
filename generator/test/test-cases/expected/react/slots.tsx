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
    customAttributes:()=>any;
}

export default function Widget(props: WidgetInput) {
    const customAttributes=useCallback(function customAttributes(){
        const { children, namedSlot, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        customAttributes
    }));
}

Widget.defaultProps = {
    ...WidgetInput
}
