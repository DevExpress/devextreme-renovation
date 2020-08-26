function view(model: RefOnChildrenTemplate) {
  return (
    <React.Fragment>
      {model.props.contentTemplate({ childRef: model.child })}
    </React.Fragment>
  );
}
export declare type PropsType = {
  contentTemplate: any;
  contentRender?: any;
  contentComponent?: any;
};
const Props: PropsType = ({} as any) as PropsType;
import React, { useCallback, useEffect, useRef, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface RefOnChildrenTemplate {
  props: typeof Props & RestProps;
  child: any;
  restAttributes: RestProps;
}

function getTemplate(
  props: any,
  template: string,
  render: string,
  component: string
) {
  const getRender = (render: any) => (props: any) =>
    "data" in props ? render(props.data, props.index) : render(props);
  const Component = props[component];

  return (
    props[template] ||
    (props[render] && getRender(props[render])) ||
    (Component && ((props: any) => <Component {...props} />))
  );
}

export default function RefOnChildrenTemplate(props: typeof Props & RestProps) {
  const child = useRef<HTMLDivElement>();

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        contentComponent,
        contentRender,
        contentTemplate,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    child.current!.innerHTML += "ParentText";
  }, []);

  return view({
    props: {
      ...props,
      contentTemplate: getTemplate(
        props,
        "contentTemplate",
        "contentRender",
        "contentComponent"
      ),
    },
    child,
    restAttributes: __restAttributes(),
  });
}

RefOnChildrenTemplate.defaultProps = {
  ...Props,
};
