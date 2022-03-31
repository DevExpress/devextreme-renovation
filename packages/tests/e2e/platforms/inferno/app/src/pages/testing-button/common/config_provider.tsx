import { ConfigContextValue, ConfigContext } from "./widget.js";
import { createElement } from "inferno-create-element";
var h = createElement;
export const viewFunction = (viewModel: ConfigProvider): any =>
  viewModel.props.children;

export declare type ConfigProviderPropsType = {
  rtlEnabled: boolean;
  children: any;
};
export const ConfigProviderProps: ConfigProviderPropsType =
  {} as any as ConfigProviderPropsType;
// import * as React from "react";
import { useState, useCallback, HookComponent } from "@devextreme/runtime/inferno-hooks/hooks";

declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface ConfigProvider {
  props: typeof ConfigProviderProps & RestProps;
  config: ConfigContextValue;
  restAttributes: RestProps;
}

export function ConfigProvider(props: typeof ConfigProviderProps & RestProps) {
  return <HookComponent renderFn={
    ()=>{
      const __config = useCallback(
        function __config(): ConfigContextValue {
          return { rtlEnabled: props.rtlEnabled };
        },
        [props.rtlEnabled]
      );
      const __restAttributes = useCallback(
        function __restAttributes(): RestProps {
          const { children, rtlEnabled, ...restProps } = props;
          return restProps;
        },
        [props]
      );
    
      return (
        <ConfigContext.Provider value={__config()}>
          {viewFunction({
            props: { ...props },
            config: __config(),
            restAttributes: __restAttributes(),
          })}
        </ConfigContext.Provider>
      );
    }
  }/>
  
}

export default ConfigProvider;

ConfigProvider.defaultProps = ConfigProviderProps;
