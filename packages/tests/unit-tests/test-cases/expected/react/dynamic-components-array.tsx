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
import { useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;

interface DynamicComponentCreator {
  props: typeof Props & RestProps;
  Components: React.FunctionComponent<Partial<typeof WidgetInput>>[];
  onComponentClick: () => any;
  restAttributes: RestProps;
}

const DynamicComponentCreator: React.FC<typeof Props & RestProps> = (props) => {
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
};

DynamicComponentCreator.defaultProps = {
  ...Props,
};

export default DynamicComponentCreator;
