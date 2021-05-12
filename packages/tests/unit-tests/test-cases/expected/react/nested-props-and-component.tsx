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
  __defaultNestedValues: { anotherNestedPropInit: [FakeNested] },
  twoWayPropChange: () => {},
};
import * as React from "react";
import { useState, useCallback, MutableRefObject, HTMLAttributes } from "react";

function __collectChildren<T>(children: React.ReactNode): T[] {
  return (React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && typeof child.type !== "string"
  ) as (React.ReactElement & { type: { propName: string } })[]).map((child) => {
    const { children: childChildren, ...childProps } = child.props;
    const collectedChildren = {} as any;
    __collectChildren(childChildren).forEach(
      ({ __name, ...restProps }: any) => {
        if (__name) {
          if (!collectedChildren[__name]) {
            collectedChildren[__name] = [];
          }
          collectedChildren[__name].push(restProps);
        }
      }
    );
    return {
      ...collectedChildren,
      ...childProps,
      __name: child.type.propName,
    };
  });
}
export const NestedProp: React.FunctionComponent<typeof FakeNested> & {
  propName: string;
} = () => null;
NestedProp.propName = "nestedProp";
NestedProp.defaultProps = FakeNested;

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetProps
>;
interface UndefWidget {
  props: typeof WidgetProps & RestProps;
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
  nestedChildren: <T>() => T[];
  __getNestedNestedProp: typeof FakeNested[] | undefined;
  __getNestedAnotherNestedPropInit: typeof FakeNested[] | undefined;
}

const getTemplate = (TemplateProp: any, RenderProp: any, ComponentProp: any) =>
  (TemplateProp &&
    (TemplateProp.defaultProps
      ? (props: any) => <TemplateProp {...props} />
      : TemplateProp)) ||
  (RenderProp &&
    ((props: any) =>
      RenderProp(
        ...("data" in props ? [props.data, props.index] : [props])
      ))) ||
  (ComponentProp && ((props: any) => <ComponentProp {...props} />));

export default function UndefWidget(props: typeof WidgetProps & RestProps) {
  const [__state_twoWayProp, __state_setTwoWayProp] = useState<
    number | undefined
  >(() =>
    props.twoWayProp !== undefined ? props.twoWayProp : props.defaultTwoWayProp
  );

  const __oneway = useCallback(function __oneway(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
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
        nestedProp: __getNestedNestedProp(),
        anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
      }.twoWayProp !== undefined || props.hasOwnProperty("twoWayProp")
    );
  }, []);
  const __someevent = useCallback(function __someevent(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    }.hasOwnProperty("someEvent");
  }, []);
  const __someref = useCallback(function __someref(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    }.hasOwnProperty("someRef");
  }, []);
  const __someforwardref = useCallback(function __someforwardref(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    }.hasOwnProperty("someForwardRef");
  }, []);
  const __someslot = useCallback(function __someslot(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    }.hasOwnProperty("slotProp");
  }, []);
  const __sometemplate = useCallback(function __sometemplate(): any {
    return {
      ...props,
      twoWayProp:
        props.twoWayProp !== undefined ? props.twoWayProp : __state_twoWayProp,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
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
        nestedProp: __getNestedNestedProp(),
        anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
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
        nestedProp: __getNestedNestedProp(),
        anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
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
        nestedProp: __getNestedNestedProp(),
        anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
      };
      return restProps;
    },
    [props, __state_twoWayProp]
  );
  const __nestedChildren = useCallback(
    function __nestedChildren<T>(): T[] {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedNestedProp = useCallback(
    function __getNestedNestedProp(): typeof FakeNested[] | undefined {
      const nested = __nestedChildren<
        typeof FakeNested & { __name: string }
      >().filter((child) => child.__name === "nestedProp");
      return props.nestedProp
        ? props.nestedProp
        : nested.length
        ? nested
        : undefined;
    },
    [props.nestedProp, props.children]
  );
  const __getNestedAnotherNestedPropInit = useCallback(
    function __getNestedAnotherNestedPropInit():
      | typeof FakeNested[]
      | undefined {
      const nested = __nestedChildren<typeof FakeNested & { __name: string }>()
        .filter((child) => child.__name === "anotherNestedPropInit")
        .map((n) => {
          if (
            !Object.keys(n).some(
              (k) => k !== "__name" && k !== "__defaultNestedValues"
            )
          ) {
            return (n as any)?.__defaultNestedValues || n;
          }
          return n;
        });
      return props.anotherNestedPropInit
        ? props.anotherNestedPropInit
        : nested.length
        ? nested
        : props?.__defaultNestedValues?.anotherNestedPropInit;
    },
    [props.anotherNestedPropInit, props.children]
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
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    },
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
    nestedChildren: __nestedChildren,
    __getNestedNestedProp: __getNestedNestedProp(),
    __getNestedAnotherNestedPropInit: __getNestedAnotherNestedPropInit(),
  });
}

UndefWidget.defaultProps = {
  ...WidgetProps,
};
