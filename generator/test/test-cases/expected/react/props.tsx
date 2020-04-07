function view(model: Widget) {

}
declare type WidgetInput = {
    height: number;
    onClick: (a: number) => null
}
const WidgetInput: WidgetInput = {
    height: 10,
    onClick: () => null
};

import React, { useCallback } from 'react';
interface Widget {
    props: WidgetInput;
    getHeight: () => number;
    getRestProps: () => any;
}

export default function Widget(props: WidgetInput) {
    const getHeight = useCallback(function getHeight() {
        props.onClick(10)
        return props.height;
    }, [props.onClick, props.height]);

    const getRestProps=useCallback(function getRestProps(){
        const { height, onClick, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        getHeight,
        getRestProps
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}