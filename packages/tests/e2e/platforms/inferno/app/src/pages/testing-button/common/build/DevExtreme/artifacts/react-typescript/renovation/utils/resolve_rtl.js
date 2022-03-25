import { isDefined } from "../../core/utils/type";
import globalConfig from "../../core/config";
export function resolveRtlEnabled(rtlProp, config) {
    if (rtlProp !== undefined) {
        return rtlProp;
    }
    if ((config === null || config === void 0 ? void 0 : config.rtlEnabled) !== undefined) {
        return config.rtlEnabled;
    }
    return globalConfig().rtlEnabled;
}
export function resolveRtlEnabledDefinition(rtlProp, config) {
    const isPropDefined = isDefined(rtlProp);
    const onlyGlobalDefined = isDefined(globalConfig().rtlEnabled) &&
        !isPropDefined &&
        !isDefined(config === null || config === void 0 ? void 0 : config.rtlEnabled);
    return (isPropDefined && rtlProp !== (config === null || config === void 0 ? void 0 : config.rtlEnabled)) || onlyGlobalDefined;
}
