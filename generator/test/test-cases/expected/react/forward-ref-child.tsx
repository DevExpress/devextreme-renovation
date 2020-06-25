
function view({ props: { childRef, nullableRef } }: RefOnChildrenChild) {
    return <div ref={childRef as any}>
        <div ref={nullableRef as any}></div>
    </div>;
}
export declare type PropsType = {
    childRef: RefObject<HTMLDivElement>;
    nullableRef?: RefObject<HTMLDivElement>
}
const Props: PropsType = {

} as PropsType;


import React, { useCallback, RefObject } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties;[x: string]: any }
interface RefOnChildrenChild {
    props: typeof Props & RestProps;
    restAttributes: RestProps;
}

export default function RefOnChildrenChild(props: typeof Props & RestProps) {
    const __restAttributes = useCallback(function __restAttributes() {
        const { childRef, nullableRef, ...restProps } = props
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
