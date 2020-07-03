import WidgetWithRefProp from "./dx-widget-with-ref-prop";
function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef as any}>
      <WidgetWithRefProp
        parentRef={viewModel.divRef}
        nullableRef={viewModel.props.nullableRef}
      />
    </div>
  );
}
export declare type WidgetInputType = {
  nullableRef?: RefObject<HTMLDivElement>;
};
const WidgetInput: WidgetInputType = {};

import React, { useCallback, useRef, RefObject } from "react";

declare type RestProps = {
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  divRef: any;
  getSize: () => any;
  getNullable: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const divRef = useRef<HTMLDivElement>();

  const getSize = useCallback(
    function getSize(): any {
      return divRef.current!.outerHTML + props.nullableRef?.current?.outerHTML;
    },
    [props.nullableRef?.current]
  );

  const getNullable = useCallback(
    function getNullable(): any {
      return props.nullableRef?.current?.outerHTML;
    },
    [props.nullableRef?.current]
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    divRef,
    getSize,
    getNullable,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
