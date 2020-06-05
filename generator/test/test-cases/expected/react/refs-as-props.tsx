import WidgetWithRefProp from "./dx-widget-with-ref-prop";
function view(viewModel: Widget) {
    return <div ref={viewModel.divRef}>
            <WidgetWithRefProp parentRef={viewModel.divRef} nullableRef={viewModel.props.nullableRef} />
        </div>
}
export declare type WidgetInputType = {
    nullableRef: any;
};
const WidgetInput: WidgetInputType = {};

import React, { useCallback, useRef } from 'react';

interface Widget {
    props: typeof WidgetInput;
    divRef: any;
    getSize: () => any;
    restAttributes: any;
}

export default function Widget(props: typeof WidgetInput) {
    const divRef = useRef<HTMLDivElement>();
    const nullableRef = props.nullableRef;

    const getSize = useCallback(
        function getSize() {
            return divRef.current.outerHTML + nullableRef.current?.outerHTML;
        }, [nullableRef.current]);
    const __restAttributes = useCallback(
        function __restAttributes() {
            const { nullableRef, ...restProps } = props;
            return restProps;
        }, [props]);

    return view(({
        props: { ...props },
        divRef,
        getSize,
        restAttributes: __restAttributes(),
    }));
}

Widget.defaultProps = {
    ...WidgetInput,
};
