var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ConfigContext } from "./config_context";
export const viewFunction = (viewModel) => viewModel.props.children;
export const ConfigProviderProps = {};
import * as React from "react";
import { useCallback } from "react";
export function ConfigProvider(props) {
    const __config = useCallback(function __config() {
        return { rtlEnabled: props.rtlEnabled };
    }, [props.rtlEnabled]);
    const __restAttributes = useCallback(function __restAttributes() {
        const { children, rtlEnabled } = props, restProps = __rest(props, ["children", "rtlEnabled"]);
        return restProps;
    }, [props]);
    return (React.createElement(ConfigContext.Provider, { value: __config() }, viewFunction({
        props: Object.assign({}, props),
        config: __config(),
        restAttributes: __restAttributes(),
    })));
}
ConfigProvider.defaultProps = ConfigProviderProps;
