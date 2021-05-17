import {
  InterfaceTemplateInput,
  ClassTemplateInput,
  TypeTemplateInput,
} from "./types.d";

interface TemplateInput {
  inputInt: number;
}

export declare type PropsType = {
  PropFromClass?: ClassTemplateInput;
  PropFromInterface?: TemplateInput;
  PropFromImportedInterface?: InterfaceTemplateInput;
  PropFromImportedType?: TypeTemplateInput;
  template: React.FunctionComponent<
    Partial<Omit<{ width: string; height: string }, "width">> &
      Required<Pick<{ width: string; height: string }, "width">>
  >;
  template2: React.FunctionComponent<Partial<TemplateInput>>;
  render?: React.FunctionComponent<
    Partial<Omit<{ width: string; height: string }, "width">> &
      Required<Pick<{ width: string; height: string }, "width">>
  >;
  component?: React.JSXElementConstructor<
    Partial<Omit<{ width: string; height: string }, "width">> &
      Required<Pick<{ width: string; height: string }, "width">>
  >;
  render2?: React.FunctionComponent<Partial<TemplateInput>>;
  component2?: React.JSXElementConstructor<Partial<TemplateInput>>;
};
const Props: PropsType = {
  template: (props) => <div></div>,
  template2: () => <div></div>,
};
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

import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof Props & RestProps;
  spreadGetter: { width: string; height: string };
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

export default function Widget(props: typeof Props & RestProps) {
  const __spreadGetter = useCallback(function __spreadGetter(): {
    width: string;
    height: string;
  } {
    return { width: "40px", height: "30px" };
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
      return restProps;
    },
    [props]
  );

  return view({
    props: {
      ...props,
      template: getTemplate(props.template, props.render, props.component),
      template2: getTemplate(props.template2, props.render2, props.component2),
    },
    spreadGetter: __spreadGetter(),
    restAttributes: __restAttributes(),
  });
}

Widget.defaultProps = {
  ...Props,
};
