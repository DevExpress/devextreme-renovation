export declare type WidgetWithRefPropInputType = {
    parentRef?: RefObject<any>;
    nullableRef?: RefObject<any>
};

export const WidgetWithRefPropInput: WidgetWithRefPropInputType = {

};

import React, { useCallback, RefObject } from 'react';

interface WidgetWithRefProp {
    props: typeof WidgetWithRefPropInput;
    restAttributes: any;

}

export default function WidgetWithRefProp(props: typeof WidgetWithRefPropInput) {
    const __restAttributes = useCallback(function __restAttributes() {
        const { nullableRef, parentRef, ...restProps } = props
        return restProps;
    }, [props]);

    return view(
        ({
            props: { ...props },
            restAttributes: __restAttributes()
        })
    );
}

WidgetWithRefProp.defaultProps = {
    ...WidgetWithRefPropInput
}

function view(viewModel: WidgetWithRefProp) {
    return (<div ></div>);
}
