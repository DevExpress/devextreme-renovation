import { PublicWidgetWithProps } from './dx-public-widget-with-props';
import { WidgetWithProps, WidgetWithPropsInput } from './dx-widget-with-props';

export type WidgetInputType = {
  someProp: boolean;
  headerTemplate: any;
  template: any;
  contentTemplate: any;
  footerTemplate: any;
  componentTemplate: any;
  publicComponentTemplate: any;
};
export const WidgetInput: WidgetInputType = {
  someProp: false,
  headerTemplate: () => null,
  template: () => <div></div>,
  contentTemplate: (props) => <div>{props.data.p1}</div>,
  footerTemplate: () => <div></div>,
  componentTemplate: WidgetWithProps,
  publicComponentTemplate: PublicWidgetWithProps,
};
import * as Preact from 'preact';
import { useCallback } from 'preact/hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface WidgetWithTemplate {
  props: typeof WidgetInput & RestProps;
  restAttributes: RestProps;
}
const getTemplate = (TemplateProp: any) =>
  TemplateProp &&
  (TemplateProp.defaultProps
    ? (props: any) => <TemplateProp {...props} />
    : TemplateProp);
export default function WidgetWithTemplate(
  props: typeof WidgetInput & RestProps
) {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        componentTemplate,
        contentTemplate,
        footerTemplate,
        headerTemplate,
        publicComponentTemplate,
        someProp,
        template,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: {
      ...props,
      headerTemplate: getTemplate(props.headerTemplate),
      template: getTemplate(props.template),
      contentTemplate: getTemplate(props.contentTemplate),
      footerTemplate: getTemplate(props.footerTemplate),
      componentTemplate: getTemplate(props.componentTemplate),
      publicComponentTemplate: getTemplate(props.publicComponentTemplate),
    },
    restAttributes: __restAttributes(),
  });
}

WidgetWithTemplate.defaultProps = WidgetInput;
function view(viewModel: WidgetWithTemplate) {
  const myvar = viewModel.props.someProp;
  const FooterTemplate = viewModel.props.footerTemplate;
  const ComponentTemplate = viewModel.props.componentTemplate;
  const PublicComponentTemplate = viewModel.props.publicComponentTemplate;
  return (
    <div>
      {viewModel.props.headerTemplate({})}

      {viewModel.props.contentTemplate &&
        viewModel.props.contentTemplate({ data: { p1: 'value' }, index: 10 })}

      {!viewModel.props.contentTemplate &&
        viewModel.props.template({
          textProp: 'textPropValue',
          textPropExpr: 'textPropExrpValue',
        })}

      {viewModel.props.footerTemplate && FooterTemplate({ someProp: myvar })}

      {ComponentTemplate({ value: 'Test Value' })}

      {PublicComponentTemplate({ value: 'Test Value' })}
    </div>
  );
}
