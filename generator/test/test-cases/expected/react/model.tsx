function view(model: ModelWidget) {
    return <div >{model.props.baseStateProp}</div>;
}
export declare type ModelWidgetInputType = {
    baseStateProp?: boolean;
    baseStatePropChange?: (stateProp: boolean) => void;
    modelStateProp?: boolean;
    value?: boolean;
    defaultBaseStateProp?: boolean;
    defaultModelStateProp?: boolean;
    modelStatePropChange?: (modelStateProp: boolean) => void;
    defaultValue?: boolean;
    valueChange?: (value: boolean) => void
}
const ModelWidgetInput: ModelWidgetInputType = {
    modelStatePropChange: () => { },
    valueChange: () => { }
};

import React, { useState, useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface ModelWidget {
    props: typeof ModelWidgetInput & RestProps;
    restAttributes: RestProps;
}

export default function ModelWidget(props: typeof ModelWidgetInput & RestProps) {

    const [__state_baseStateProp, __state_setBaseStateProp] = useState(() => props.baseStateProp !== undefined ? props.baseStateProp : props.defaultBaseStateProp);
    const [__state_modelStateProp, __state_setModelStateProp] = useState(() => props.modelStateProp !== undefined ? props.modelStateProp : props.defaultModelStateProp);
    const [__state_value, __state_setValue] = useState(() => props.value !== undefined ? props.value : props.defaultValue)

    const __restAttributes = useCallback(function __restAttributes() {
        const {
            baseStateProp,
            baseStatePropChange,
            defaultBaseStateProp,
            defaultModelStateProp,
            defaultValue,
            modelStateProp,
            modelStatePropChange,
            value,
            valueChange,
            ...restProps
        } = {
            ...props,
            baseStateProp:(props.baseStateProp!==undefined?props.baseStateProp:__state_baseStateProp),
            modelStateProp:(props.modelStateProp!==undefined?props.modelStateProp:__state_modelStateProp),
            value:(props.value!==undefined?props.value:__state_value)
        }
      return restProps;
    }, [props]);

    return view(
        ({
            props: {
                ...props,
                baseStateProp: (props.baseStateProp !== undefined ? props.baseStateProp : __state_baseStateProp),
                modelStateProp: (props.modelStateProp !== undefined ? props.modelStateProp : __state_modelStateProp),
                value: (props.value !== undefined ? props.value : __state_value)
            },
            restAttributes: __restAttributes()
        })
    );
}

ModelWidget.defaultProps = {
    ...ModelWidgetInput
}
