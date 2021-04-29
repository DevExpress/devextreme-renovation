import WidgetWithRefProp from "./dx-widget-with-ref-prop";
function view(viewModel: Widget) {
  return (
    <div ref={viewModel.divRef}>
      <WidgetWithRefProp
        parentRef={viewModel.divRef}
        nullableRef={viewModel.props.nullableRef}
      />
    </div>
  );
}

export declare type WidgetInputType = {
  nullableRef?: MutableRefObject<HTMLDivElement | null>;
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
  getDirectly: () => any;
  getDestructed: () => any;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof WidgetInput & RestProps> = (props) => {
  const __divRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(
    null
  );

  const __getDirectly = useCallback(
    function __getDirectly(): any {
      const divRefOuter = __divRef.current?.outerHTML ?? "";
      const nullableRefOuter = props.nullableRef?.current?.outerHTML ?? "";
      return divRefOuter + nullableRefOuter;
    },
    [props.nullableRef]
  );
  const __getDestructed = useCallback(
    function __getDestructed(): any {
      const { nullableRef } = props;
      const divRefOuter = __divRef.current?.outerHTML ?? "";
      const nullableRefOuter = nullableRef?.current?.outerHTML ?? "";
      return divRefOuter + nullableRefOuter;
    },
    [props.nullableRef]
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
    divRef: __divRef,
    getDirectly: __getDirectly,
    getDestructed: __getDestructed,
    restAttributes: __restAttributes(),
  });
};
Widget.defaultProps = {
  ...WidgetInput,
};

export default Widget;
