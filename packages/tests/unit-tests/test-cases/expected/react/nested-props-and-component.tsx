import { MutableRefObject } from "react";
function view(model: UndefWidget) {
  return <div></div>;
}

export declare type FakeNestedType = {
  numberProp: number;
};
export const FakeNested: FakeNestedType = {
  numberProp: 2,
};
export declare type WidgetPropsType = {
  oneWayProp?: number;
  twoWayProp?: number;
  someEvent?: () => void;
  someRef?: MutableRefObject<any>;
  someForwardRef?: MutableRefObject<any>;
  slotProp?: React.ReactNode;
  templateProp?: React.FunctionComponent<any>;
  nestedProp?: typeof FakeNested[];
  anotherNestedPropInit?: typeof FakeNested[];
  __defaultNestedValues?: any;
  defaultTwoWayProp?: number;
  twoWayPropChange?: (twoWayProp?: number) => void;
  renderProp?: React.FunctionComponent<any>;
  componentProp?: React.JSXElementConstructor<any>;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {
  get __defaultNestedValues() {
    return { anotherNestedPropInit: [FakeNested] };
  },
  twoWayPropChange: () => {},
};
import { __collectChildren, equalByValue } from "@devextreme/runtime/react";
import * as React from "react";
import { useState, useCallback, useMemo, useRef } from "react";
import { getTemplate } from "@devextreme/runtime/react";

export const NestedProp: React.FunctionComponent<typeof FakeNested> & {
  propName: string;
} = () => null;
NestedProp.propName = "nestedProp";
NestedProp.defaultProps = FakeNested;

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface UndefWidget {
  props: typeof WidgetProps & RestProps;
  __getNestedAnotherNestedPropInit: typeof FakeNested[];
  __getNestedNestedProp: typeof FakeNested[] | undefined;
  oneway: any;
  twoway: any;
  someevent: any;
  someref: any;
  someforwardref: any;
  someslot: any;
  sometemplate: any;
  nested: any;
  nestedinit: any;
  restAttributes: RestProps;
}

export default function UndefWidget(props: typeof WidgetProps & RestProps) {
  const [__state_twoWayProp, __state_setTwoWayProp] = useState<
    number | undefined
  >(() =>
    props.twoWayProp !== undefined ? props.twoWayProp : props.defaultTwoWayProp
  );
  const cachedNested = useRef<any>(__collectChildren(props.children));

  const __getNestedAnotherNestedPropInit = useMemo(
    function __getNestedAnotherNestedPropInit(): typeof FakeNested[] {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.anotherNestedPropInit
        ? props.anotherNestedPropInit
        : cachedNested.current.anotherNestedPropInit
        ? cachedNested.current.anotherNestedPropInit
        : props?.__defaultNestedValues?.anotherNestedPropInit;
    },
    [props.anotherNestedPropInit, props.children]
  );
  const __getNestedNestedProp = useMemo(
    function __getNestedNestedProp(): typeof FakeNested[] | undefined {
      const nested = __collectChildren(props.children);
      if (!equalByValue(cachedNested.current, nested))
        cachedNested.current = nested;
      return props.nestedProp
        ? props.nestedProp
        : cachedNested.current.nestedProp
        ? cachedNested.current.nestedProp
        : undefined;
    },
    [props.nestedProp, props.children]
  );
  const __oneway = useCallback(function __oneway(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp,
      anotherNestedPropInit: __getNestedAnotherNestedPropInit,
    }.hasOwnProperty("oneWayProp");
  }, []);
  const __twoway = useCallback(function __twoway(): any {
    return (
      {
        ...props,
        twoWayProp:
          props.twoWayProp !== undefined
            ? props.twoWayProp
            : __state_twoWayProp,
        nestedProp: __getNestedNestedProp,
        anotherNestedPropInit: __getNestedAnotherNestedPropInit,
      }.twoWayProp !== undefined || props.hasOwnProperty("twoWayProp")
    );
  }, []);
  const __someevent = useCallback(function __someevent(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp,
      anotherNestedPropInit: __getNestedAnotherNestedPropInit,
    }.hasOwnProperty("someEvent");
  }, []);
  const __someref = useCallback(function __someref(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp,
      anotherNestedPropInit: __getNestedAnotherNestedPropInit,
    }.hasOwnProperty("someRef");
  }, []);
  const __someforwardref = useCallback(function __someforwardref(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp,
      anotherNestedPropInit: __getNestedAnotherNestedPropInit,
    }.hasOwnProperty("someForwardRef");
  }, []);
  const __someslot = useCallback(function __someslot(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp,
      anotherNestedPropInit: __getNestedAnotherNestedPropInit,
    }.hasOwnProperty("slotProp");
  }, []);
  const __sometemplate = useCallback(function __sometemplate(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp,
      anotherNestedPropInit: __getNestedAnotherNestedPropInit,
    }.hasOwnProperty("templateProp");
  }, []);
  const __nested = useCallback(function __nested(): any {
    return (
      {
        ...props,
        twoWayProp:
          props.twoWayProp !== undefined
            ? props.twoWayProp
            : __state_twoWayProp,
        nestedProp: __getNestedNestedProp,
        anotherNestedPropInit: __getNestedAnotherNestedPropInit,
      }.nestedProp !== undefined || props.hasOwnProperty("nestedProp")
    );
  }, []);
  const __nestedinit = useCallback(function __nestedinit(): any {
    return (
      {
        ...props,
        twoWayProp:
          props.twoWayProp !== undefined
            ? props.twoWayProp
            : __state_twoWayProp,
        nestedProp: __getNestedNestedProp,
        anotherNestedPropInit: __getNestedAnotherNestedPropInit,
      }.anotherNestedPropInit !== undefined ||
      props.hasOwnProperty("anotherNestedPropInit")
    );
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        anotherNestedPropInit,
        children,
        componentProp,
        defaultTwoWayProp,
        nestedProp,
        oneWayProp,
        renderProp,
        slotProp,
        someEvent,
        someForwardRef,
        someRef,
        templateProp,
        twoWayProp,
        twoWayPropChange,
        ...restProps
      } = {
        ...props,
        twoWayProp:
          props.twoWayProp !== undefined
            ? props.twoWayProp
            : __state_twoWayProp,
        nestedProp: __getNestedNestedProp,
        anotherNestedPropInit: __getNestedAnotherNestedPropInit,
      };
      return restProps;
    },
    [props, __state_twoWayProp]
  );

  return view({
    props: {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      templateProp: getTemplate(
        props.templateProp,
        props.renderProp,
        props.componentProp
      ),
      nestedProp: __getNestedNestedProp,
      anotherNestedPropInit: __getNestedAnotherNestedPropInit,
    },
    __getNestedAnotherNestedPropInit,
    __getNestedNestedProp,
    oneway: __oneway(),
    twoway: __twoway(),
    someevent: __someevent(),
    someref: __someref(),
    someforwardref: __someforwardref(),
    someslot: __someslot(),
    sometemplate: __sometemplate(),
    nested: __nested(),
    nestedinit: __nestedinit(),
    restAttributes: __restAttributes(),
  });
}

UndefWidget.defaultProps = WidgetProps;
