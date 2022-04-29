import { createContext } from 'react';
import { Context } from './context';
import { PluginContext } from './context';
function view(model: GridComponent) {
  return <div>{model.props.children}</div>;
}
const context = createContext({});

export type PropsType = {
  children: React.ReactNode;
};
const Props: PropsType = {} as any as PropsType;
import * as React from 'react';
import { useState, useCallback } from 'react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface GridComponent {
  props: typeof Props & RestProps;
  contextProvider: PluginContext;
  restAttributes: RestProps;
}

export default function GridComponent(props: typeof Props & RestProps) {
  const [contextProvider] = useState(new PluginContext());
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { children, ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return (
    <Context.Provider value={contextProvider}>
      {view({
        props: { ...props },
        contextProvider,
        restAttributes: __restAttributes(),
      })}
    </Context.Provider>
  );
}

GridComponent.defaultProps = Props;
