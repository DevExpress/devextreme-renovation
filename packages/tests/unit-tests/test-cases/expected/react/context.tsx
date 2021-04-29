import { createContext } from "react";
function view(model: Widget): any {
  return <span></span>;
}
const P1Context = createContext(5);
const GetterContext = createContext("default");

export declare type PropsType = {
  p1: number;
};
const Props: PropsType = {
  p1: 10,
};
import * as React from "react";
import { useState, useContext, useCallback, HTMLAttributes } from "react";

declare type RestProps = Omit<HTMLAttributes<HTMLElement>, keyof typeof Props>;
interface Widget {
  props: typeof Props & RestProps;
  contextConsumer: number;
  provider: number;
  sum: any;
  contextProvider: any;
  restAttributes: RestProps;
}

const Widget: React.FC<typeof Props & RestProps> = (props) => {
  const contextConsumer = useContext(P1Context);
  const [provider] = useState(10);
  const __sum = useCallback(
    function __sum(): any {
      return provider + contextConsumer;
    },
    [provider, contextConsumer]
  );
  const __contextProvider = useCallback(function __contextProvider(): any {
    return "provide";
  }, []);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { p1, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return (
    <GetterContext.Provider value={__contextProvider()}>
      <P1Context.Provider value={provider}>
        {view({
          props: { ...props },
          contextConsumer,
          provider,
          sum: __sum(),
          contextProvider: __contextProvider(),
          restAttributes: __restAttributes(),
        })}
      </P1Context.Provider>
    </GetterContext.Provider>
  );
};

Widget.defaultProps = {
  ...Props,
};

export default Widget;
