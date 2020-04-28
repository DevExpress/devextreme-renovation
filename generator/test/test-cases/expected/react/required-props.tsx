function view(model: Widget) {

}
export declare type WidgetInputType = {
    size?: { width: number, height: number }
}
const WidgetInput: WidgetInputType = {
    size: {
        width: 10,
        height: 20
    }
};

import React, { useCallback } from 'react';

interface Widget {
    props: Required<typeof WidgetInput>;
    getHeight: number;
    restAttributes: any;
}

export default function Widget(props: Required<typeof WidgetInput>) {
    const __getHeight = useCallback(function __getHeight() {
        return props.size.height;
    }, [props.size]);
    const __restAttributes = useCallback(function __restAttributes() {
        const { size, ...restProps } = props
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        getHeight: __getHeight(),
        restAttributes: __restAttributes()
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}