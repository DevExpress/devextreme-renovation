import { getImageSourceType } from "../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/icon";
import { combineClasses } from "../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/combine_classes";
import {Fragment} from 'inferno'
import { useCallback } from "@devextreme/runtime/inferno-hooks/hooks";
import { getTemplate } from "@devextreme/runtime/react";
import { createElement } from "inferno-create-element";
var h = createElement;


export declare type IconPropsType = {
  position?: string;
  source?: string;
  iconTemplate?: (props) => any;
  iconRender?: (props) => any;
  iconComponent?: (props) => any;
};
export const IconProps: IconPropsType = {
  position: "left",
  source: "",
};

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Icon {
  props: typeof IconProps & RestProps;
  sourceType: string | false;
  cssClass: string;
  iconClassName: string;
  restAttributes: RestProps;
}

export const viewFunction = ({
    iconClassName,
    props: { iconTemplate: IconTemplate, source },
    sourceType,
  }: Icon): any => (
    <Fragment>
      {sourceType === "dxIcon" && <i className={iconClassName} />}
  
      {sourceType === "fontIcon" && <i className={iconClassName} />}
  
      {sourceType === "image" && (
        <img className={iconClassName} alt="" src={source} />
      )}
  
      {IconTemplate && <i className={iconClassName}>{IconTemplate({})}</i>}
    </Fragment>
  );

function Icon(props: typeof IconProps & RestProps) {
  const __sourceType = useCallback(
    function __sourceType(): string | false {
      return getImageSourceType(props.source);
    },
    [props.source]
  );
  const __cssClass = useCallback(
    function __cssClass(): string {
      return props.position !== "left" ? "dx-icon-right" : "";
    },
    [props.position]
  );
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const {
        iconComponent,
        iconRender,
        iconTemplate,
        position,
        source,
        ...restProps
      } = props;
      return restProps;
    },
    [props]
  );
  const __iconClassName = useCallback(
    function __iconClassName(): string {
      const generalClasses = {
        "dx-icon": true,
        [__cssClass()]: !!__cssClass(),
      };
      const { source } = props;
      if (__sourceType() === "dxIcon") {
        return combineClasses({
          ...generalClasses,
          [`dx-icon-${source}`]: true,
        });
      }
      if (__sourceType() === "fontIcon") {
        return combineClasses({
          ...generalClasses,
          [String(source)]: !!source,
        });
      }
      if (__sourceType() === "image") {
        return combineClasses(generalClasses);
      }
      if (__sourceType() === "svg") {
        return combineClasses({ ...generalClasses, "dx-svg-icon": true });
      }
      return "";
    },
    [__cssClass, props.source, __sourceType]
  );

  return viewFunction({
    props: {
      ...props,
      iconTemplate: getTemplate(
        props.iconTemplate,
        props.iconRender,
        props.iconComponent
      ),
    },
    sourceType: __sourceType(),
    cssClass: __cssClass(),
    iconClassName: __iconClassName(),
    restAttributes: __restAttributes(),
  });
}

export { Icon } 
export default Icon;

Icon.defaultProps = IconProps;
