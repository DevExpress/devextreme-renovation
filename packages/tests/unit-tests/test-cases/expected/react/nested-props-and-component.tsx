function view(model: undefWidget) {
  return (
    <div>
      <div>
        Nested:
        {model.nested}
      </div>
    </div>
  );
}

export declare type FakeNestedType = {
  numberProp: number;
};
export const FakeNested: FakeNestedType = {
  numberProp: 2,
};
export declare type WidgetPropsType = {
  nestedProp?: typeof FakeNested[];
  anotherNestedPropInit?: typeof FakeNested[];
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const WidgetProps: WidgetPropsType = {
  __defaultNestedValues: { anotherNestedPropInit: [FakeNested] },
};
import * as React from "react";
import { useCallback } from "react";

function __collectChildren<T>(children: React.ReactNode): T[] {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).map((child) => {
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

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface undefWidget {
  props: typeof WidgetProps & RestProps;
  nested: any;
  nestedinit: any;
  restAttributes: RestProps;
  nestedChildren: <T>() => T[];
  __getNestedNestedProp: typeof FakeNested[] | undefined;
  __getNestedAnotherNestedPropInit: typeof FakeNested[];
}

export default function undefWidget(props: typeof WidgetProps & RestProps) {
  const __nested = useCallback(function __nested(): any {
    return {
      ...props,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    }.hasOwnProperty("nestedProp");
  }, []);
  const __nestedinit = useCallback(function __nestedinit(): any {
    return {
      ...props,
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    }.hasOwnProperty("anotherNestedPropInit");
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        anotherNestedPropInit,
        children,
        nestedProp,
        ...restProps
      } = {
        ...props,
        nestedProp: __getNestedNestedProp(),
        anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
      };
      return restProps;
    },
    [props]
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
    function __getNestedAnotherNestedPropInit(): typeof FakeNested[] {
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
      nestedProp: __getNestedNestedProp(),
      anotherNestedPropInit: __getNestedAnotherNestedPropInit(),
    },
    nested: __nested(),
    nestedinit: __nestedinit(),
    restAttributes: __restAttributes(),
    nestedChildren: __nestedChildren,
    __getNestedNestedProp: __getNestedNestedProp(),
    __getNestedAnotherNestedPropInit: __getNestedAnotherNestedPropInit(),
  });
}

undefWidget.defaultProps = {
  ...WidgetProps,
};
