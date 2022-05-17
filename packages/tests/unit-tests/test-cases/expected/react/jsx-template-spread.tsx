import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import {
  InterfaceTemplateInput,
  ClassTemplateInput,
  TypeTemplateInput,
} from './types.d';

interface TemplateInput {
  inputInt: number;
}

interface PropsType {
  PropFromClass?: ClassTemplateInput;
  PropFromInterface?: TemplateInput;
  PropFromImportedInterface?: InterfaceTemplateInput;
  PropFromImportedType?: TypeTemplateInput;
  template?: React.FunctionComponent<
    GetPropsType<{ width: string; height: string }>
  >;
  template2?: React.FunctionComponent<GetPropsType<TemplateInput>>;
  render?: React.FunctionComponent<
    GetPropsType<{ width: string; height: string }>
  >;
  component?: React.JSXElementConstructor<
    GetPropsType<{ width: string; height: string }>
  >;
  render2?: React.FunctionComponent<GetPropsType<TemplateInput>>;
  component2?: React.JSXElementConstructor<GetPropsType<TemplateInput>>;
}

const Props = {
  template: () => <div></div>,
  template2: (props: TemplateInput) => <div>{props.inputInt}</div>,
} as Partial<PropsType>;
function view(model: Widget) {
  return (
    <div>
      {model.props.template({ ...model.spreadGetter })}

      {model.props.template2({ ...model.props.PropFromClass })}

      {model.props.template2({ ...model.props.PropFromInterface })}

      {model.props.template2({ ...model.props.PropFromImportedInterface })}

      {model.props.template2({ ...model.props.PropFromImportedType })}
    </div>
  );
}

import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type PropsModel = Required<
  Omit<
    GetPropsType<typeof Props>,
    'render' | 'component' | 'render2' | 'component2'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof Props>,
      'render' | 'component' | 'render2' | 'component2'
    >
  >;
interface Widget {
  props: PropsModel & RestProps;
  spreadGetter: { width: string; height: string };
  restAttributes: RestProps;
}
export default function Widget(inProps: typeof Props & RestProps) {
  const props = combineWithDefaultProps<PropsModel>(Props, inProps);

  const __spreadGetter = useMemo(function __spreadGetter(): {
    width: string;
    height: string;
  } {
    return { width: '40px', height: '30px' };
  },
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        PropFromClass,
        PropFromImportedInterface,
        PropFromImportedType,
        PropFromInterface,
        component,
        component2,
        render,
        render2,
        template,
        template2,
        ...restProps
      } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return view({
    props: {
      ...props,
      template: getTemplate(props.template, props.render, props.component),
      template2: getTemplate(props.template2, props.render2, props.component2),
    },
    spreadGetter: __spreadGetter,
    restAttributes: __restAttributes(),
  });
}
