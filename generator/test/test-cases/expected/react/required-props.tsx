function view(model: Widget) {

}
export declare type WidgetInputType = {
    size?: { width: number, height: number };
    type?: string
}
const WidgetInput: WidgetInputType = {
    size: {
        width: 10,
        height: 20
    },
    type: "type"
};

import React, { useCallback } from 'react';

interface Widget {
    props: Required<typeof WidgetInput>;
    getHeight: number;
    type: string;
    restAttributes: any;
}

export default function Widget(props: Required<typeof WidgetInput>) {
    const __getHeight = useCallback(function __getHeight() {
        return props.size.height;
    }, [props.size]);
    const __type = useCallback(function __type() {
        const { type } = props
        return type;
    }, [props.type]);
    const __restAttributes = useCallback(function __restAttributes() {
        const { size, type, ...restProps } = props
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        getHeight: __getHeight(),
        type: __type(),
        restAttributes: __restAttributes()
    })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}
