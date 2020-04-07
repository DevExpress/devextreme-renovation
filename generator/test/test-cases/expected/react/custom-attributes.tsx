function view(model:Widget) {
    return <div></div>;
}
declare type WidgetInput={
    prop1?: any
    stateProp?: any
    defaultStateProp?: any
    statePropChange?:(stateProp:any)=>void
}
export const WidgetInput:WidgetInput={
    statePropChange:()=>{}
};
import React, {useState,useCallback} from 'react';

interface Widget {
    props: WidgetInput;
    getRestProps:()=>any;
}

export default function Widget(props: WidgetInput){
    const [__state_stateProp, __state_setStateProp] = useState(()=>(props.stateProp!==undefined?props.stateProp:props.defaultStateProp));
    const getRestProps=useCallback(function getRestProps(){
        const { defaultStateProp, prop1, stateProp, statePropChange, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
            props:{...props, stateProp:props.stateProp!==undefined?props.stateProp:__state_stateProp},
            getRestProps
        })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}