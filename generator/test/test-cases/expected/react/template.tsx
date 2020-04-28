export declare type WidgetInputType = {
    render: () => any;
    contentRender: (data: { p1: string }) => any;
}
export const WidgetInput: WidgetInputType = {
    render: () => <div ></div>,
    contentRender: (data) => (<div >{data.p1}</div>)
};

import React, {useCallback} from 'react'
interface Widget {
    props: typeof WidgetInput;
    restAttributes: any;
}

export default function Widget(props: typeof WidgetInput) {
    const __restAttributes=useCallback(function __restAttributes(){
        const { contentRender, render, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        restAttributes: __restAttributes()
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}

function view(viewModel: Widget) {
    return (<div >
        <viewModel.props.contentRender p1={"value"} />
        <viewModel.props.render />
    </div>);
}