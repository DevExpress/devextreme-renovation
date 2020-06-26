import Child from "./forward-ref-child"
function view({ child, props: { nullableRef } }: RefOnChildrenParent) {
    return <Child childRef={child}
        nullableRef={nullableRef} />;
}
export declare type PropsType = {
    nullableRef?: RefObject<HTMLDivElement>
}
const Props: PropsType = {

};


import React, { useCallback, useEffect, useRef, RefObject } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties;[x: string]: any }
interface RefOnChildrenParent {
    props: typeof Props & RestProps;
    child: any;
    restAttributes: RestProps;

}

export default function RefOnChildrenParent(props: typeof Props & RestProps) {
    const child = useRef<HTMLDivElement>()

    const __restAttributes = useCallback(function __restAttributes() {
        const { nullableRef, ...restProps } = props
        return restProps;
    }, [props]);
    useEffect(() => {
        child.current!.innerHTML = "Ref from child"
        const html = props.nullableRef?.current?.innerHTML
    }, [props.nullableRef?.current])
    return view(
        ({
            props: { ...props },
            child,
            restAttributes: __restAttributes()
        })
    );
}

RefOnChildrenParent.defaultProps = {
    ...Props
}
