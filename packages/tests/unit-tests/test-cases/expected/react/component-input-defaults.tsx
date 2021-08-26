function view(model: Widget) {
  return <div></div>;
}
function isMaterial() {
  return true;
}
function format(key: string) {
  return "localized_" + key;
}

export declare type BasePropsType = {
  empty?: string;
  height?: number;
  width?: number;
  baseNested?: typeof TextsProps;
  __defaultNestedValues?: any;
  children?: React.ReactNode;
};
export const BaseProps: BasePropsType = Object.defineProperties(
  { height: 10 },
  {
    width: {
      enumerable: true,
      get: function () {
        return isMaterial() ? 20 : 10;
      },
    },
    __defaultNestedValues: {
      enumerable: true,
      get: function () {
        return { baseNested: TextsProps };
      },
    },
  }
);
export declare type TextsPropsType = {
  text?: string;
};
export const TextsProps: TextsPropsType = Object.defineProperties(
  {},
  {
    text: {
      enumerable: true,
      get: function () {
        return format("text");
      },
    },
  }
);
export declare type WidgetPropsType = typeof BaseProps & {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  someTemplate?: React.FunctionComponent<Partial<void>>;
  __defaultNestedValues?: any;
  someRender?: React.FunctionComponent<Partial<void>>;
  someComponent?: React.JSXElementConstructor<Partial<void>>;
};
export const WidgetProps: WidgetPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseProps),
    Object.getOwnPropertyDescriptors(
      Object.defineProperties(
        { someTemplate: () => <div></div> },
        {
          text: {
            enumerable: true,
            get: function () {
              return format("text");
            },
          },
          texts1: {
            enumerable: true,
            get: function () {
              return { text: format("text") };
            },
          },
          __defaultNestedValues: {
            enumerable: true,
            get: function () {
              return {
                texts2: { text: format("text") },
                texts3: TextsProps,
                baseNested: BaseProps?.__defaultNestedValues.baseNested,
              };
            },
          },
        }
      )
    )
  )
);
export declare type PickedPropsType = {
  someValue?: string;
};
export const PickedProps: PickedPropsType = Object.defineProperties(
  {},
  {
    someValue: {
      enumerable: true,
      get: function () {
        return format("text");
      },
    },
  }
);
export declare type WidgetTypePropsType = {
  text?: string;
  texts1?: typeof TextsProps;
  texts2?: typeof TextsProps;
  texts3?: typeof TextsProps;
  someTemplate?: React.FunctionComponent<Partial<void>>;
  empty?: string;
  height?: number;
  width?: number;
  baseNested?: typeof TextsProps;
  children?: React.ReactNode;
  someValue?: string;
  __defaultNestedValues?: any;
  someRender?: React.FunctionComponent<Partial<void>>;
  someComponent?: React.JSXElementConstructor<Partial<void>>;
};
export const WidgetTypeProps: WidgetTypePropsType = Object.defineProperties(
  {
    text: WidgetProps.text,
    texts1: WidgetProps.texts1,
    someTemplate: WidgetProps.someTemplate,
    height: WidgetProps.height,
    width: WidgetProps.width,
    someValue: PickedProps.someValue,
  },
  {
    __defaultNestedValues: {
      enumerable: true,
      get: function () {
        return {
          texts2: WidgetProps.texts2,
          texts3: WidgetProps.texts3,
          baseNested: WidgetProps.baseNested,
        };
      },
    },
  }
);
import * as React from "react";
import { useCallback } from "react";

function __collectChildren(children: React.ReactNode): Record<string, any> {
  return (
    React.Children.toArray(children).filter(
      (child) => React.isValidElement(child) && typeof child.type !== "string"
    ) as (React.ReactElement & { type: { propName: string } })[]
  ).reduce((acc: Record<string, any>, child) => {
    const {
      children: childChildren,
      __defaultNestedValues,
      ...childProps
    } = child.props;
    const collectedChildren = __collectChildren(childChildren);
    const childPropsValue = Object.keys(childProps).length
      ? childProps
      : __defaultNestedValues;
    const allChild = { ...childPropsValue, ...collectedChildren };
    return {
      ...acc,
      [child.type.propName]: acc[child.type.propName]
        ? [...acc[child.type.propName], allChild]
        : [allChild],
    };
  }, {});
}
export const Texts2: React.FunctionComponent<typeof TextsProps> & {
  propName: string;
} = () => null;
Texts2.propName = "texts2";
Texts2.defaultProps = TextsProps;

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  restAttributes: RestProps;
  nestedChildren: () => Record<string, any>;
  __getNestedTexts2: typeof TextsProps;
  __getNestedTexts3: typeof TextsProps;
  __getNestedBaseNested: typeof TextsProps;
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

export default function Widget(props: typeof WidgetProps & RestProps) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        __defaultNestedValues,
        baseNested,
        children,
        empty,
        height,
        someComponent,
        someRender,
        someTemplate,
        text,
        texts1,
        texts2,
        texts3,
        width,
        ...restProps
      } = {
        ...props,
        texts2: __getNestedTexts2(),
        texts3: __getNestedTexts3(),
        baseNested: __getNestedBaseNested(),
      };
      return restProps;
    },
    [props]
  );
  const __nestedChildren = useCallback(
    function __nestedChildren(): Record<string, any> {
      const { children } = props;
      return __collectChildren(children);
    },
    [props.children]
  );
  const __getNestedTexts2 = useCallback(
    function __getNestedTexts2(): typeof TextsProps {
      const nested = __nestedChildren();
      return props.texts2
        ? props.texts2
        : nested.texts2
        ? nested.texts2?.[0]
        : props?.__defaultNestedValues?.texts2;
    },
    [props.texts2, props.children]
  );
  const __getNestedTexts3 = useCallback(
    function __getNestedTexts3(): typeof TextsProps {
      const nested = __nestedChildren();
      return props.texts3
        ? props.texts3
        : nested.texts3
        ? nested.texts3?.[0]
        : props?.__defaultNestedValues?.texts3;
    },
    [props.texts3, props.children]
  );
  const __getNestedBaseNested = useCallback(
    function __getNestedBaseNested(): typeof TextsProps {
      const nested = __nestedChildren();
      return props.baseNested
        ? props.baseNested
        : nested.baseNested
        ? nested.baseNested?.[0]
        : props?.__defaultNestedValues?.baseNested;
    },
    [props.baseNested, props.children]
  );

  return view({
    props: {
      ...props,
      someTemplate: getTemplate(
        props.someTemplate,
        props.someRender,
        props.someComponent
      ),
      texts2: __getNestedTexts2(),
      texts3: __getNestedTexts3(),
      baseNested: __getNestedBaseNested(),
    },
    restAttributes: __restAttributes(),
    nestedChildren: __nestedChildren,
    __getNestedTexts2: __getNestedTexts2(),
    __getNestedTexts3: __getNestedTexts3(),
    __getNestedBaseNested: __getNestedBaseNested(),
  });
}

Widget.defaultProps = WidgetProps;
