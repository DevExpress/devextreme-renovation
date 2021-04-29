export declare type WidgetWithTemplateInputType = {
  template?: any;
  componentTemplate?: any;
  arrowTemplate?: any;
  render?: any;
  component?: any;
  componentRender?: any;
  componentComponent?: any;
  arrowRender?: any;
  arrowComponent?: any;
};
export const WidgetWithTemplateInput: WidgetWithTemplateInputType = {};
import * as React from "react";
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof typeof WidgetWithTemplateInput
>;
interface WidgetWithTemplate {
  props: typeof WidgetWithTemplateInput & RestProps;
  restAttributes: RestProps;
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

const WidgetWithTemplate: React.FC<
  typeof WidgetWithTemplateInput & RestProps
> = (props) => {
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        arrowComponent,
        arrowRender,
        arrowTemplate,
        component,
        componentComponent,
        componentRender,
        componentTemplate,
        render,
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
      template: getTemplate(props.template, props.render, props.component),
      componentTemplate: getTemplate(
        props.componentTemplate,
        props.componentRender,
        props.componentComponent
      ),
      arrowTemplate: getTemplate(
        props.arrowTemplate,
        props.arrowRender,
        props.arrowComponent
      ),
    },
    restAttributes: __restAttributes(),
  });
};
WidgetWithTemplate.defaultProps = {
  ...WidgetWithTemplateInput,
};

export default WidgetWithTemplate;
function view(viewModel: WidgetWithTemplate) {
  return (
    <div>
      {viewModel.props.componentTemplate({})}

      {viewModel.props.template({})}

      {viewModel.props.arrowTemplate({})}
    </div>
  );
}
