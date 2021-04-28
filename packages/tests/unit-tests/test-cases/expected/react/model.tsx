function view(model: ModelWidget) {
  return <div>{model.props.baseStateProp}</div>;
}

export declare type ModelWidgetInputType = {
  baseStateProp?: boolean;
  baseStatePropChange?: (stateProp?: boolean) => void;
  modelStateProp?: boolean;
  value?: boolean;
  defaultBaseStateProp?: boolean;
  defaultModelStateProp?: boolean;
  modelStatePropChange?: (modelStateProp?: boolean) => void;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
};
const ModelWidgetInput: ModelWidgetInputType = {
  modelStatePropChange: () => {},
  valueChange: () => {},
};
import * as React from "react";
import { useState, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof ModelWidgetInput
>;

interface ModelWidget {
  props: typeof ModelWidgetInput & RestProps;
  restAttributes: RestProps;
}

const ModelWidget: React.FC<typeof ModelWidgetInput & RestProps> = (props) => {
  const [__state_baseStateProp, __state_setBaseStateProp] = useState<
    boolean | undefined
  >(() =>
    props.baseStateProp !== undefined
      ? props.baseStateProp
      : props.defaultBaseStateProp
  );
  const [__state_modelStateProp, __state_setModelStateProp] = useState<
    boolean | undefined
  >(() =>
    props.modelStateProp !== undefined
      ? props.modelStateProp
      : props.defaultModelStateProp
  );
  const [__state_value, __state_setValue] = useState<boolean | undefined>(() =>
    props.value !== undefined ? props.value : props.defaultValue
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        baseStateProp,
        baseStatePropChange,
        defaultBaseStateProp,
        defaultModelStateProp,
        defaultValue,
        modelStateProp,
        modelStatePropChange,
        value,
        valueChange,
        ...restProps
      } = {
        ...props,
        baseStateProp:
          props.baseStateProp !== undefined
            ? props.baseStateProp
            : __state_baseStateProp,
        modelStateProp:
          props.modelStateProp !== undefined
            ? props.modelStateProp
            : __state_modelStateProp,
        value: props.value !== undefined ? props.value : __state_value,
      };
      return restProps;
    },
    [props, __state_baseStateProp, __state_modelStateProp, __state_value]
  );

  return view({
    props: {
      ...props,
      baseStateProp:
        props.baseStateProp !== undefined
          ? props.baseStateProp
          : __state_baseStateProp,
      modelStateProp:
        props.modelStateProp !== undefined
          ? props.modelStateProp
          : __state_modelStateProp,
      value: props.value !== undefined ? props.value : __state_value,
    },
    restAttributes: __restAttributes(),
  });
};

ModelWidget.defaultProps = {
  ...ModelWidgetInput,
};

export default ModelWidget;
