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
import { getImageSourceType } from "../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/icon";
import { combineClasses } from "../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/combine_classes";
import * as React from "react";
import { useCallback } from "react";
import { getTemplate } from "@devextreme/runtime/react";
export const IconProps = {
    position: "left",
    source: "",
};
export const viewFunction = ({ iconClassName, props: { iconTemplate: IconTemplate, source }, sourceType, }) => (React.createElement(React.Fragment, null,
    sourceType === "dxIcon" && React.createElement("i", { className: iconClassName }),
    sourceType === "fontIcon" && React.createElement("i", { className: iconClassName }),
    sourceType === "image" && (React.createElement("img", { className: iconClassName, alt: "", src: source })),
    IconTemplate && React.createElement("i", { className: iconClassName }, IconTemplate({}))));
export function Icon(props) {
    const __sourceType = useCallback(function __sourceType() {
        return getImageSourceType(props.source);
    }, [props.source]);
    const __cssClass = useCallback(function __cssClass() {
        return props.position !== "left" ? "dx-icon-right" : "";
    }, [props.position]);
    const __restAttributes = useCallback(function __restAttributes() {
        const { iconComponent, iconRender, iconTemplate, position, source } = props, restProps = __rest(props, ["iconComponent", "iconRender", "iconTemplate", "position", "source"]);
        return restProps;
    }, [props]);
    const __iconClassName = useCallback(function __iconClassName() {
        const generalClasses = {
            "dx-icon": true,
            [__cssClass()]: !!__cssClass(),
        };
        const { source } = props;
        if (__sourceType() === "dxIcon") {
            return combineClasses(Object.assign(Object.assign({}, generalClasses), { [`dx-icon-${source}`]: true }));
        }
        if (__sourceType() === "fontIcon") {
            return combineClasses(Object.assign(Object.assign({}, generalClasses), { [String(source)]: !!source }));
        }
        if (__sourceType() === "image") {
            return combineClasses(generalClasses);
        }
        if (__sourceType() === "svg") {
            return combineClasses(Object.assign(Object.assign({}, generalClasses), { "dx-svg-icon": true }));
        }
        return "";
    }, [__cssClass, props.source, __sourceType]);
    return viewFunction({
        props: Object.assign(Object.assign({}, props), { iconTemplate: getTemplate(props.iconTemplate, props.iconRender, props.iconComponent) }),
        sourceType: __sourceType(),
        cssClass: __cssClass(),
        iconClassName: __iconClassName(),
        restAttributes: __restAttributes(),
    });
}
Icon.defaultProps = IconProps;
