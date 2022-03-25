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
import { initConfig, showWave, hideWave, } from "../../../../../../../../../../../DevExtreme/artifacts/react-typescript/ui/widget/utils.ink_ripple";
export const viewFunction = (model) => (React.createElement("div", Object.assign({ className: "dx-inkripple" }, model.restAttributes)));
export const InkRippleProps = {
    config: Object.freeze({}),
};
import * as React from "react";
import { useCallback, useMemo, useImperativeHandle, forwardRef } from "react";
const InkRipple = forwardRef(function inkRipple(props, ref) {
    const __getConfig = useMemo(function __getConfig() {
        const { config } = props;
        return initConfig(config);
    }, [props.config]);
    const __restAttributes = useCallback(function __restAttributes() {
        const { config } = props, restProps = __rest(props, ["config"]);
        return restProps;
    }, [props]);
    const __hideWave = useCallback(function __hideWave(opts) {
        hideWave(__getConfig, opts);
    }, [__getConfig]);
    const __showWave = useCallback(function __showWave(opts) {
        showWave(__getConfig, opts);
    }, [__getConfig]);
    useImperativeHandle(ref, () => ({ hideWave: __hideWave, showWave: __showWave }), [__hideWave, __showWave]);
    return viewFunction({
        props: Object.assign({}, props),
        getConfig: __getConfig,
        restAttributes: __restAttributes(),
    });
});
export { InkRipple };
export default InkRipple;
InkRipple.defaultProps = InkRippleProps;
