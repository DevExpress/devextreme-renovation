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
import { useState, useEffect, useRef, useImperativeHandle, useCallback, useContext, } from '@devextreme/runtime/inferno-hooks/hooks';
import { createContext } from '../../../../../../../../../runtime/inferno-hooks/create_context';
import '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/click';
import '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/hover';
// import * as React from 'react';
import { isFunction } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/type';
import { active, dxClick, focus, hover, keyboard, resize, visibility, } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/short';
import { combineClasses } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/combine_classes';
import { extend } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/extend';
import { focusable } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/ui/widget/selectors';
import { normalizeStyleProp } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/style';
import { BaseWidgetProps } from './base_props';
// import { ConfigContextValue, ConfigContext } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/common/config_context';
import { ConfigProvider } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/common/config_provider';
import { resolveRtlEnabled, resolveRtlEnabledDefinition, } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/resolve_rtl';
import resizeCallbacks from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/resize_callbacks';
import errors from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/errors';
import domAdapter from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/dom_adapter';
const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;
const getAria = (args) => Object.keys(args).reduce((r, key) => {
    if (args[key]) {
        return Object.assign(Object.assign({}, r), { [key === 'role' || key === 'id' ? key : `aria-${key}`]: String(args[key]) });
    }
    return r;
}, {});
export const ConfigContext = createContext(undefined);
export const viewFunction = (viewModel) => {
    const widget = (React.createElement("div", Object.assign({ ref: viewModel.widgetElementRef }, viewModel.attributes, { tabIndex: viewModel.tabIndex, title: viewModel.props.hint, hidden: !viewModel.props.visible, className: viewModel.cssClasses, style: normalizeStyles(viewModel.styles) }), viewModel.props.children));
    return viewModel.shouldRenderConfigProvider ? (React.createElement(ConfigProvider, { rtlEnabled: viewModel.rtlEnabled }, widget)) : (widget);
};
export const WidgetProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(BaseWidgetProps), Object.getOwnPropertyDescriptors({
    _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
    _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
    cssText: '',
    aria: Object.freeze({}),
    classes: '',
    name: '',
    addWidgetClass: true,
})));
const NUMBER_STYLES = new Set([
    'animationIterationCount',
    'borderImageOutset',
    'borderImageSlice',
    'border-imageWidth',
    'boxFlex',
    'boxFlexGroup',
    'boxOrdinalGroup',
    'columnCount',
    'fillOpacity',
    'flex',
    'flexGrow',
    'flexNegative',
    'flexOrder',
    'flexPositive',
    'flexShrink',
    'floodOpacity',
    'fontWeight',
    'gridColumn',
    'gridRow',
    'lineClamp',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'stopOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeMiterlimit',
    'strokeOpacity',
    'strokeWidth',
    'tabSize',
    'widows',
    'zIndex',
    'zoom',
]);
const isNumeric = (value) => {
    if (typeof value === 'number')
        return true;
    return !isNaN(Number(value));
};
const getNumberStyleValue = (style, value) => (NUMBER_STYLES.has(style) ? value : `${value}px`);
const normalizeStyles = (styles) => {
    if (!(styles instanceof Object))
        return undefined;
    return Object.entries(styles).reduce((result, [key, value]) => {
        result[key] = isNumeric(value) ? getNumberStyleValue(key, value) : value;
        return result;
    }, {});
};
const Widget = 
// forwardRef(
(props, ref) => {
    const __widgetElementRef = useRef(null);
    const [__state_active, __state_setActive] = useState(false);
    const [__state_focused, __state_setFocused] = useState(false);
    const [__state_hovered, __state_setHovered] = useState(false);
    const config = useContext(ConfigContext);
    const __shouldRenderConfigProvider = useCallback(() => {
        const { rtlEnabled } = props;
        return resolveRtlEnabledDefinition(rtlEnabled, config);
    }, [props.rtlEnabled, config]);
    const __rtlEnabled = useCallback(() => {
        const { rtlEnabled } = props;
        return resolveRtlEnabled(rtlEnabled, config);
    }, [props.rtlEnabled, config]);
    const __tabIndex = useCallback(() => {
        const { disabled, focusStateEnabled, tabIndex } = props;
        const isFocusable = focusStateEnabled && !disabled;
        return isFocusable ? tabIndex : undefined;
    }, [props.disabled, props.focusStateEnabled, props.tabIndex]);
    const __restAttributes = useCallback(() => {
        const { _feedbackHideTimeout, _feedbackShowTimeout, accessKey, activeStateEnabled, activeStateUnit, addWidgetClass, aria, children, className, classes, cssText, disabled, focusStateEnabled, height, hint, hoverStateEnabled, name, onActive, onClick, onDimensionChanged, onFocusIn, onFocusOut, onHoverEnd, onHoverStart, onInactive, onKeyDown, onRootElementRendered, onVisibilityChange, rootElementRef, rtlEnabled, tabIndex, visible, width } = props, restProps = __rest(props, ["_feedbackHideTimeout", "_feedbackShowTimeout", "accessKey", "activeStateEnabled", "activeStateUnit", "addWidgetClass", "aria", "children", "className", "classes", "cssText", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "name", "onActive", "onClick", "onDimensionChanged", "onFocusIn", "onFocusOut", "onHoverEnd", "onHoverStart", "onInactive", "onKeyDown", "onRootElementRendered", "onVisibilityChange", "rootElementRef", "rtlEnabled", "tabIndex", "visible", "width"]);
        return restProps;
    }, [props]);
    const __focus = useCallback(() => {
        focus.trigger(__widgetElementRef.current);
    }, []);
    const __blur = useCallback(() => {
        const activeElement = domAdapter.getActiveElement();
        if (__widgetElementRef.current === activeElement) {
            activeElement.blur();
        }
    }, []);
    const __activate = useCallback(() => {
        __state_setActive((__state_active) => true);
    }, []);
    const __deactivate = useCallback(() => {
        __state_setActive((__state_active) => false);
    }, []);
    const __attributes = useCallback(() => {
        const { aria, disabled, focusStateEnabled, visible, } = props;
        const accessKey = focusStateEnabled && !disabled && props.accessKey;
        return Object.assign(Object.assign({}, extend({}, __restAttributes(), accessKey && { accessKey })), getAria(Object.assign(Object.assign({}, aria), { disabled, hidden: !visible })));
    }, [
        props.aria,
        props.disabled,
        props.focusStateEnabled,
        props.visible,
        props.accessKey,
        __restAttributes,
    ]);
    const __styles = useCallback(() => {
        const { height, width } = props;
        const style = __restAttributes().style || {};
        const computedWidth = normalizeStyleProp('width', isFunction(width) ? width() : width);
        const computedHeight = normalizeStyleProp('height', isFunction(height) ? height() : height);
        return Object.assign(Object.assign({}, style), { height: computedHeight !== null && computedHeight !== void 0 ? computedHeight : style.height, width: computedWidth !== null && computedWidth !== void 0 ? computedWidth : style.width });
    }, [props.height, props.width, __restAttributes]);
    const __cssClasses = useCallback(() => {
        const { activeStateEnabled, addWidgetClass, className, classes, disabled, focusStateEnabled, hoverStateEnabled, onVisibilityChange, visible, } = props;
        const isFocusable = !!focusStateEnabled && !disabled;
        const isHoverable = !!hoverStateEnabled && !disabled;
        const canBeActive = !!activeStateEnabled && !disabled;
        const classesMap = {
            'dx-widget': !!addWidgetClass,
            [String(classes)]: !!classes,
            [String(className)]: !!className,
            'dx-state-disabled': !!disabled,
            'dx-state-invisible': !visible,
            'dx-state-focused': !!__state_focused && isFocusable,
            'dx-state-active': !!__state_active && canBeActive,
            'dx-state-hover': !!__state_hovered && isHoverable && !__state_active,
            'dx-rtl': !!__rtlEnabled(),
            'dx-visibility-change-handler': !!onVisibilityChange,
        };
        return combineClasses(classesMap);
    }, [
        props.activeStateEnabled,
        props.addWidgetClass,
        props.className,
        props.classes,
        props.disabled,
        props.focusStateEnabled,
        props.hoverStateEnabled,
        props.onVisibilityChange,
        props.visible,
        __state_focused,
        __state_active,
        __state_hovered,
        __rtlEnabled,
    ]);
    useEffect(() => {
        const { onRootElementRendered, rootElementRef } = props;
        if (rootElementRef) {
            rootElementRef.current = __widgetElementRef.current;
        }
        onRootElementRendered === null || onRootElementRendered === void 0 ? void 0 : onRootElementRendered(__widgetElementRef.current);
    }, []);
    useEffect(() => {
        const { _feedbackHideTimeout, _feedbackShowTimeout, activeStateEnabled, activeStateUnit, disabled, onActive, onInactive, } = props;
        const namespace = 'UIFeedback';
        const selector = activeStateUnit;
        if (activeStateEnabled) {
            if (disabled) {
                __state_setActive((__state_active) => false);
            }
            else {
                active.on(__widgetElementRef.current, ({ event }) => {
                    __state_setActive((__state_active) => true);
                    onActive === null || onActive === void 0 ? void 0 : onActive(event);
                }, ({ event }) => {
                    __state_setActive((__state_active) => false);
                    onInactive === null || onInactive === void 0 ? void 0 : onInactive(event);
                }, {
                    hideTimeout: _feedbackHideTimeout,
                    namespace,
                    selector,
                    showTimeout: _feedbackShowTimeout,
                });
                return () => active.off(__widgetElementRef.current, { selector, namespace });
            }
        }
        return undefined;
    }, [
        props._feedbackHideTimeout,
        props._feedbackShowTimeout,
        props.activeStateEnabled,
        props.activeStateUnit,
        props.disabled,
        props.onActive,
        props.onInactive,
    ]);
    useEffect(() => {
        const { disabled, name, onClick } = props;
        const namespace = name;
        if (onClick && !disabled) {
            dxClick.on(__widgetElementRef.current, onClick, { namespace });
            return () => dxClick.off(__widgetElementRef.current, { namespace });
        }
        return undefined;
    }, [props.disabled, props.name, props.onClick]);
    useEffect(() => {
        const { disabled, focusStateEnabled, name, onFocusIn, onFocusOut, } = props;
        const namespace = `${name}Focus`;
        if (focusStateEnabled) {
            if (disabled) {
                __state_setFocused((__state_focused) => false);
            }
            else {
                focus.on(__widgetElementRef.current, (e) => {
                    if (!e.isDefaultPrevented()) {
                        __state_setFocused((__state_focused) => true);
                        onFocusIn === null || onFocusIn === void 0 ? void 0 : onFocusIn(e);
                    }
                }, (e) => {
                    if (!e.isDefaultPrevented()) {
                        __state_setFocused((__state_focused) => false);
                        onFocusOut === null || onFocusOut === void 0 ? void 0 : onFocusOut(e);
                    }
                }, { isFocusable: focusable, namespace });
                return () => focus.off(__widgetElementRef.current, { namespace });
            }
        }
        return undefined;
    }, [
        props.disabled,
        props.focusStateEnabled,
        props.name,
        props.onFocusIn,
        props.onFocusOut,
    ]);
    useEffect(() => {
        const { activeStateUnit, disabled, hoverStateEnabled, onHoverEnd, onHoverStart, } = props;
        const namespace = 'UIFeedback';
        const selector = activeStateUnit;
        if (hoverStateEnabled) {
            if (disabled) {
                __state_setHovered((__state_hovered) => false);
            }
            else {
                hover.on(__widgetElementRef.current, ({ event }) => {
                    !__state_active && __state_setHovered((__state_hovered) => true);
                    onHoverStart === null || onHoverStart === void 0 ? void 0 : onHoverStart(event);
                }, (event) => {
                    __state_setHovered((__state_hovered) => false);
                    onHoverEnd === null || onHoverEnd === void 0 ? void 0 : onHoverEnd(event);
                }, { selector, namespace });
                return () => hover.off(__widgetElementRef.current, { selector, namespace });
            }
        }
        return undefined;
    }, [
        props.activeStateUnit,
        props.disabled,
        props.hoverStateEnabled,
        props.onHoverEnd,
        props.onHoverStart,
        __state_active,
    ]);
    useEffect(() => {
        const { focusStateEnabled, onKeyDown } = props;
        if (focusStateEnabled && onKeyDown) {
            const id = keyboard.on(__widgetElementRef.current, __widgetElementRef.current, (e) => onKeyDown(e));
            return () => keyboard.off(id);
        }
        return undefined;
    }, [props.focusStateEnabled, props.onKeyDown]);
    useEffect(() => {
        const namespace = `${props.name}VisibilityChange`;
        const { onDimensionChanged } = props;
        if (onDimensionChanged) {
            resize.on(__widgetElementRef.current, onDimensionChanged, {
                namespace,
            });
            return () => resize.off(__widgetElementRef.current, { namespace });
        }
        return undefined;
    }, [props.name, props.onDimensionChanged]);
    useEffect(() => {
        const { onDimensionChanged } = props;
        if (onDimensionChanged) {
            resizeCallbacks.add(onDimensionChanged);
            return () => {
                resizeCallbacks.remove(onDimensionChanged);
            };
        }
        return undefined;
    }, [props.onDimensionChanged]);
    useEffect(() => {
        const { name, onVisibilityChange } = props;
        const namespace = `${name}VisibilityChange`;
        if (onVisibilityChange) {
            visibility.on(__widgetElementRef.current, () => onVisibilityChange(true), () => onVisibilityChange(false), { namespace });
            return () => visibility.off(__widgetElementRef.current, { namespace });
        }
        return undefined;
    }, [props.name, props.onVisibilityChange]);
    useEffect(() => {
        const { height, width } = props;
        if (isFunction(width)) {
            errors.log('W0017', 'width');
        }
        if (isFunction(height)) {
            errors.log('W0017', 'height');
        }
    }, [props.height, props.width]);
    useEffect(() => {
        const { cssText } = props;
        if (cssText !== '') {
            __widgetElementRef.current.style.cssText = cssText;
        }
    }, [props.cssText]);
    useImperativeHandle(ref, () => ({
        focus: __focus,
        blur: __blur,
        activate: __activate,
        deactivate: __deactivate,
    }), [__focus, __blur, __activate, __deactivate]);
    return viewFunction({
        props: Object.assign({}, props),
        active: __state_active,
        focused: __state_focused,
        hovered: __state_hovered,
        widgetElementRef: __widgetElementRef,
        config,
        shouldRenderConfigProvider: __shouldRenderConfigProvider(),
        rtlEnabled: __rtlEnabled(),
        attributes: __attributes(),
        styles: __styles(),
        cssClasses: __cssClasses(),
        tabIndex: __tabIndex(),
        restAttributes: __restAttributes(),
    });
};
// );
// export { Widget };
export default Widget;
Widget.defaultProps = WidgetProps;
