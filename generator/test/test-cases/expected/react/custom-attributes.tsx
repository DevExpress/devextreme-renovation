function view(model:Widget) {
    return <div></div>;
}
declare type WidgetInput={
    prop1: any
}
export const WidgetInput:WidgetInput={
    
};
import React, {useCallback} from 'react';

interface Widget {
    props: WidgetInput;
    customAttributes:()=>any;
}

export default function Widget(props: WidgetInput){
    const customAttributes=useCallback(function customAttributes(){
        const {
            prop1,
            ...restProps
        } = props;
        return restProps;
    }, []);
    return view(({
            props:{...props},
            customAttributes
        })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}