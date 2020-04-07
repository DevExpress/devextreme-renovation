declare type WidgetInput = {
    render: () => any;
    contentRender: (data: { p1: string }) => any;
}
export const WidgetInput: WidgetInput = {
    render: () => <div ></div>,
    contentRender: (data) => (<div >{data.p1}</div>)
};

import React, {useCallback} from 'react'
interface Widget {
    props: WidgetInput;
    getRestProps: () => any;
}

export default function Widget(props: WidgetInput) {
    const getRestProps=useCallback(function getRestProps(){
        const { contentRender, render, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        getRestProps
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