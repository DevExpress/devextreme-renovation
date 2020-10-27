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
  nullableRef?: MutableRefObject<HTMLDivElement>;
};
const WidgetInput: WidgetInputType = {};
import * as React from "react";
import { useCallback, useRef, MutableRefObject, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetInput
>;
interface Widget {
  props: typeof WidgetInput & RestProps;
  divRef: any;
  getSize: () => any;
  getNullable: () => any;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __divRef = useRef<HTMLDivElement>();

  const __getSize = useCallback(
    function __getSize(): any {
      return (
        __divRef.current!.outerHTML + props.nullableRef?.current?.outerHTML
      );
    },
    [props.nullableRef?.current]
  );
  const __getNullable = useCallback(
    function __getNullable(): any {
      return props.nullableRef?.current?.outerHTML;
    },
    [props.nullableRef?.current]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { nullableRef, ...restProps } = {
        ...props,
        nullableRef: props.nullableRef?.current!,
      };
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    divRef: __divRef,
    getSize: __getSize,
    getNullable: __getNullable,
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...WidgetInput,
};
