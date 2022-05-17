import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
function view(model: ModelWidget) {
  return <div>{model.props.baseStateProp}</div>;
}

interface ModelWidgetInputType {
  baseStateProp?: boolean;
  baseStatePropChange?: (stateProp?: boolean) => void;
  modelStateProp?: boolean;
  value?: boolean;
  defaultBaseStateProp?: boolean;
  defaultModelStateProp?: boolean;
  modelStatePropChange?: (modelStateProp?: boolean) => void;
  defaultValue?: boolean;
  valueChange?: (value?: boolean) => void;
}

const ModelWidgetInput = {
  modelStatePropChange: () => {},
  valueChange: () => {},
} as Partial<ModelWidgetInputType>;
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type ModelWidgetInputModel = Required<
  Omit<
    GetPropsType<typeof ModelWidgetInput>,
    | 'baseStateProp'
    | 'baseStatePropChange'
    | 'modelStateProp'
    | 'value'
    | 'defaultBaseStateProp'
    | 'defaultModelStateProp'
    | 'defaultValue'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof ModelWidgetInput>,
      | 'baseStateProp'
      | 'baseStatePropChange'
      | 'modelStateProp'
      | 'value'
      | 'defaultBaseStateProp'
      | 'defaultModelStateProp'
      | 'defaultValue'
    >
  >;
interface ModelWidget {
  props: ModelWidgetInputModel & RestProps;
  restAttributes: RestProps;
}
export default function ModelWidget(
  inProps: typeof ModelWidgetInput & RestProps
) {
  const props = combineWithDefaultProps<ModelWidgetInputModel>(
    ModelWidgetInput,
    inProps
  );

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
      return restProps as RestProps;
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
}
