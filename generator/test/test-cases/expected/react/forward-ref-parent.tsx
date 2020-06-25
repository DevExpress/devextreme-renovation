import Child from "./forward-ref-child"
function view({ child }: RefOnChildrenParent) {
    return <Child childRef={child} />;
}
export declare type PropsType = {

}
const Props: PropsType = {

};

import React, { useCallback, useEffect, useRef } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties;[x: string]: any }
interface RefOnChildrenParent {
    props: typeof Props & RestProps;
    child: any;
    restAttributes: RestProps;
}

export default function RefOnChildrenParent(props: typeof Props & RestProps) {
    const child = useRef<HTMLDivElement>()

    const __restAttributes = useCallback(function __restAttributes() {
        const { ...restProps } = props
        return restProps;
    }, [props]);
    useEffect(() => {
        child.current!.innerHTML = "Ref from child"
    }, [])
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
