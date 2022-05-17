import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { WidgetWithProps } from './dx-widget-with-props';
export const viewFunction = (model: TemplateDefaultValue) => (
  <div>
    TemplateDefaultValue
    {model.props.defaultCompTemplate({
      optionalValue: model.props.stringToRender,
      value: 'twdComp',
      onClick: () => {},
    })}
    {model.props.defaultCompTemplate({ value: model.props.stringToRender })}
    {model.props.defaultFuncTemplate({ value: model.props.stringToRender })}
  </div>
);

interface TemplateDefaultValuePropsType {
  defaultCompTemplate?: React.FunctionComponent<
    GetPropsType<{
      optionalValue?: string | undefined;
      onClick?: (e: any) => void;
      value: string;
    }>
  >;
  defaultFuncTemplate?: React.FunctionComponent<
    GetPropsType<{ optionalValue?: string | undefined; value: string }>
  >;
  stringToRender?: string;
  defaultCompRender?: React.FunctionComponent<
    GetPropsType<{
      optionalValue?: string | undefined;
      onClick?: (e: any) => void;
      value: string;
    }>
  >;
  defaultCompComponent?: React.JSXElementConstructor<
    GetPropsType<{
      optionalValue?: string | undefined;
      onClick?: (e: any) => void;
      value: string;
    }>
  >;
  defaultFuncRender?: React.FunctionComponent<
    GetPropsType<{ optionalValue?: string | undefined; value: string }>
  >;
  defaultFuncComponent?: React.JSXElementConstructor<
    GetPropsType<{ optionalValue?: string | undefined; value: string }>
  >;
}
export const TemplateDefaultValueProps = {
  defaultCompTemplate: WidgetWithProps,
  defaultFuncTemplate: (props) => (
    <div>
      !DefaultFunc:
      {props.value || 'ftwdCompDefault'}
      {props.optionalValue}
    </div>
  ),
  stringToRender: 'strCompDefault',
} as Partial<TemplateDefaultValuePropsType>;
import * as React from 'react';
import { useCallback } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type TemplateDefaultValuePropsModel = Required<
  Omit<
    GetPropsType<typeof TemplateDefaultValueProps>,
    | 'defaultCompRender'
    | 'defaultCompComponent'
    | 'defaultFuncRender'
    | 'defaultFuncComponent'
  >
> &
  Partial<
    Pick<
      GetPropsType<typeof TemplateDefaultValueProps>,
      | 'defaultCompRender'
      | 'defaultCompComponent'
      | 'defaultFuncRender'
      | 'defaultFuncComponent'
    >
  >;
interface TemplateDefaultValue {
  props: TemplateDefaultValuePropsModel & RestProps;
  restAttributes: RestProps;
}
export default function TemplateDefaultValue(
  inProps: typeof TemplateDefaultValueProps & RestProps
) {
  const props = combineWithDefaultProps<TemplateDefaultValuePropsModel>(
    TemplateDefaultValueProps,
    inProps
  );

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        defaultCompComponent,
        defaultCompRender,
        defaultCompTemplate,
        defaultFuncComponent,
        defaultFuncRender,
        defaultFuncTemplate,
        stringToRender,
        ...restProps
      } = props;
      return restProps as RestProps;
    },
    [props]
  );

  return viewFunction({
    props: {
      ...props,
      defaultCompTemplate: getTemplate(
        props.defaultCompTemplate,
        props.defaultCompRender,
        props.defaultCompComponent
      ),
      defaultFuncTemplate: getTemplate(
        props.defaultFuncTemplate,
        props.defaultFuncRender,
        props.defaultFuncComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
}
