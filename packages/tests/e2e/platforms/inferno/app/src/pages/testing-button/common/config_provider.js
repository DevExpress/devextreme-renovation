"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
var widget_js_1 = require("./widget.js");
var inferno_create_element_1 = require("inferno-create-element");
var h = inferno_create_element_1.createElement;
exports.viewFunction = function (viewModel) {
    return viewModel.props.children;
};
exports.ConfigProviderProps = {};
// import * as React from "react";
var hooks_1 = require("@devextreme/runtime/inferno-hooks/hooks");
function ConfigProvider(props) {
    return <hooks_1.HookContainer renderFn={function () {
        var __config = hooks_1.useCallback(function __config() {
            return { rtlEnabled: props.rtlEnabled };
        }, [props.rtlEnabled]);
        var __restAttributes = hooks_1.useCallback(function __restAttributes() {
            var children = props.children, rtlEnabled = props.rtlEnabled, restProps = __rest(props, ["children", "rtlEnabled"]);
            return restProps;
        }, [props]);
        return (<widget_js_1.ConfigContext.Provider value={__config()}>
          {exports.viewFunction({
            props: __assign({}, props),
            config: __config(),
            restAttributes: __restAttributes()
        })}
        </widget_js_1.ConfigContext.Provider>);
    }}/>;
}
exports.ConfigProvider = ConfigProvider;
ConfigProvider.defaultProps = exports.ConfigProviderProps;
