import { createContext } from "react";
function view(model: Widget): JSX.Element {
  return <span></span>;
}
const P1Context = createContext(5);
export declare type PropsType = {
  p1: number;
};
const Props: PropsType = {
  p1: 10,
};
import React, {
  useState,
  useContext,
  useCallback,
  HtmlHTMLAttributes,
} from "react";

declare type RestProps = Omit<
  HtmlHTMLAttributes<HTMLDivElement>,
  keyof typeof Props
>;
interface Widget {
  props: typeof Props & RestProps;
  restAttributes: RestProps;
  context: number;
  provider: number;
}

export default function Widget(props: typeof Props & RestProps) {
  const context = useContext(P1Context);
  const [provider] = useState(10);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { p1, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return (
    <P1Context.Provider value={provider}>
      {view({
        props: { ...props },
        context,
        provider,
        restAttributes: __restAttributes(),
      })}
    </P1Context.Provider>
  );
}

Widget.defaultProps = {
  ...Props,
};
