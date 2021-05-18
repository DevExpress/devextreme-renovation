import DynamicComponent, { WidgetInput } from "./props";
function view({ Components, onComponentClick }: DynamicComponentCreator): any {
  return (
    <div>
      {Components.map((C, index) => (
        <C key={index} onClick={onComponentClick} />
      ))}
    </div>
  );
}

export declare type PropsType = {
  height: number;
};
const Props: PropsType = {
  height: 10,
};
import * as React from "react";
import { useCallback } from "react";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface DynamicComponentCreator {
  props: typeof Props & RestProps;
  Components: React.FunctionComponent<Partial<typeof WidgetInput>>[];
  onComponentClick: () => any;
  restAttributes: RestProps;
}

export default function DynamicComponentCreator(
  props: typeof Props & RestProps
) {
  const __Components = useCallback(
    function __Components(): React.FunctionComponent<
      Partial<typeof WidgetInput>
    >[] {
      return [DynamicComponent] as React.FunctionComponent<
        Partial<typeof WidgetInput>
      >[];
    },
    []
  );
  const __onComponentClick = useCallback(function __onComponentClick(): any {},
  []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { height, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    Components: __Components(),
    onComponentClick: __onComponentClick,
    restAttributes: __restAttributes(),
  });
}

DynamicComponentCreator.defaultProps = {
  ...Props,
};
