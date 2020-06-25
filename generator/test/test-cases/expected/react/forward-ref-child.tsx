function view({ props: { childRef } }: RefOnChildrenChild) {
    return <div ref={childRef as any}></div>;
}
export declare type PropsType = {
    childRef: HTMLDivElement
}
const Props: PropsType = {

} as PropsType;


import React, { useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties;[x: string]: any }
interface RefOnChildrenChild {
    props: typeof Props & RestProps;
    restAttributes: RestProps;
}

export default function RefOnChildrenChild(props: typeof Props & RestProps) {
    const __restAttributes = useCallback(function __restAttributes() {
        const { childRef, ...restProps } = props
        return restProps;
    }, [props]);

    return view(
        ({
            props: { ...props },
            restAttributes: __restAttributes()
        })
    );
}

RefOnChildrenChild.defaultProps = {
    ...Props
}