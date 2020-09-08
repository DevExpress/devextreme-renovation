function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef as any}>
      <div ref={viewModel.explicitRef as any}>
        <div ref={viewModel.nullableRef as any}></div>
      </div>
    </div>
  );
}

import React, { useCallback, useRef, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof {}>;
interface Widget {
  divRef: any;
  nullableRef: any;
  explicitRef: any;
  clickHandler: () => any;
  getHeight: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: {} & RestProps) {
  const divRef = useRef<HTMLDivElement>();
  const nullableRef = useRef<HTMLDivElement>();
  const explicitRef = useRef<HTMLDivElement>();

  const clickHandler = useCallback(function clickHandler(): any {
    const html = divRef.current!.outerHTML + explicitRef.current!.outerHTML;
    divRef.current = explicitRef.current!;
  }, []);
  const getHeight = useCallback(
    function getHeight(): any {
      return divRef.current!.outerHTML + nullableRef.current?.outerHTML;
    },
    [nullableRef.current]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    ...props,
    divRef,
    nullableRef,
    explicitRef,
    clickHandler,
    getHeight,
    restAttributes: __restAttributes(),
  });
}
