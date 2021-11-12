import DomCompoentWrapper from "./dom_component_wrapper";
function view(model: Widget): any {
  return <DomCompoentWrapper></DomCompoentWrapper>;
}

export declare type WidgetInputType = {
  prop1: number;
  prop2: string;
  templateProp?: any;
  renderProp?: any;
  componentProp?: any;
  isReactComponentWrapper: boolean;
};
export const WidgetInput: WidgetInputType = {
  prop1: 10,
  prop2: "text",
  isReactComponentWrapper: true,
};
import * as React from "react";
import { useCallback } from "react";
import { getWrapperTemplate } from "@devextreme/runtime/react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        componentProp,
        isReactComponentWrapper,
        prop1,
        prop2,
        renderProp,
        templateProp,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props, templateProp: getWrapperTemplate(props.templateProp) },
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = WidgetInput;
