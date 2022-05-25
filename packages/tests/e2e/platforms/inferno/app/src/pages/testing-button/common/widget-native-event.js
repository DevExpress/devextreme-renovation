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
var inferno_create_element_1 = require("inferno-create-element");
var h = inferno_create_element_1.createElement;
var hooks_1 = require("@devextreme/runtime/inferno-hooks/hooks");
var create_context_1 = require("../../../../../../../../../runtime/inferno-hooks/create_context");
var inferno_1 = require("inferno");
require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/click");
require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/hover");
// import * as React from 'react';
var type_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/type");
var short_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/short");
var combine_classes_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/combine_classes");
var extend_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/extend");
var selectors_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/ui/widget/selectors");
var style_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/style");
var base_props_1 = require("./base_props");
// import { ConfigContextValue, ConfigContext } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/common/config_context';
var config_provider_js_1 = require("./config_provider.js");
var resolve_rtl_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/resolve_rtl");
var resize_callbacks_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/resize_callbacks");
var errors_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/errors");
var dom_adapter_1 = require("../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/dom_adapter");
var DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
var DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;
var getAria = function (args) { return Object.keys(args).reduce(function (r, key) {
    var _a;
    if (args[key]) {
        return __assign(__assign({}, r), (_a = {}, _a[key === 'role' || key === 'id' ? key : "aria-" + key] = String(args[key]), _a));
    }
    return r;
}, {}); };
exports.ConfigContext = create_context_1.createContext(undefined);
exports.viewFunction = function (viewModel) {
    var widget = (<div ref={viewModel.widgetElementRef} {...viewModel.attributes}       onClick={viewModel.props.onClick}
        onKeyDown={viewModel.props.onKeyDown}
  tabIndex={viewModel.tabIndex} title={viewModel.props.hint} hidden={!viewModel.props.visible} className={viewModel.cssClasses} style={normalizeStyles(viewModel.styles) }>
      {viewModel.props.children}
    </div>);
    return viewModel.shouldRenderConfigProvider ? (<config_provider_js_1.ConfigProvider rtlEnabled={viewModel.rtlEnabled}>
      {widget}
    </config_provider_js_1.ConfigProvider>) : (widget);
};
exports.WidgetProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(base_props_1.BaseWidgetProps), Object.getOwnPropertyDescriptors({
    _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
    _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
    cssText: '',
    aria: Object.freeze({}),
    classes: '',
    name: '',
    addWidgetClass: true
})));
var NUMBER_STYLES = new Set([
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
var isNumeric = function (value) {
    if (typeof value === 'number')
        return true;
    return !isNaN(Number(value));
};
var getNumberStyleValue = function (style, value) { return (NUMBER_STYLES.has(style) ? value : value + "px"); };
var normalizeStyles = function (styles) {
    if (!(styles instanceof Object))
        return undefined;
    return Object.entries(styles).reduce(function (result, _a) {
        var key = _a[0], value = _a[1];
        result[key] = isNumeric(value) ? getNumberStyleValue(key, value) : value;
        return result;
    }, {});
};
var Widget = function (ref) { return function (props) {
    var __widgetElementRef = hooks_1.useRef(null);
    var _a = hooks_1.useState(false), __state_active = _a[0], __state_setActive = _a[1];
    var _b = hooks_1.useState(false), __state_focused = _b[0], __state_setFocused = _b[1];
    var _c = hooks_1.useState(false), __state_hovered = _c[0], __state_setHovered = _c[1];
    var config = hooks_1.useContext(exports.ConfigContext);
    var __shouldRenderConfigProvider = hooks_1.useCallback(function () {
        var rtlEnabled = props.rtlEnabled;
        return resolve_rtl_1.resolveRtlEnabledDefinition(rtlEnabled, config);
    }, [props.rtlEnabled, config]);
    var __rtlEnabled = hooks_1.useCallback(function () {
        var rtlEnabled = props.rtlEnabled;
        return resolve_rtl_1.resolveRtlEnabled(rtlEnabled, config);
    }, [props.rtlEnabled, config]);
    var __tabIndex = hooks_1.useCallback(function () {
        var disabled = props.disabled, focusStateEnabled = props.focusStateEnabled, tabIndex = props.tabIndex;
        var isFocusable = focusStateEnabled && !disabled;
        return isFocusable ? tabIndex : undefined;
    }, [props.disabled, props.focusStateEnabled, props.tabIndex]);
    var __restAttributes = hooks_1.useCallback(function () {
        var _feedbackHideTimeout = props._feedbackHideTimeout, _feedbackShowTimeout = props._feedbackShowTimeout, accessKey = props.accessKey, activeStateEnabled = props.activeStateEnabled, activeStateUnit = props.activeStateUnit, addWidgetClass = props.addWidgetClass, aria = props.aria, children = props.children, className = props.className, classes = props.classes, cssText = props.cssText, disabled = props.disabled, focusStateEnabled = props.focusStateEnabled, height = props.height, hint = props.hint, hoverStateEnabled = props.hoverStateEnabled, name = props.name, onActive = props.onActive, onClick = props.onClick, onDimensionChanged = props.onDimensionChanged, onFocusIn = props.onFocusIn, onFocusOut = props.onFocusOut, onHoverEnd = props.onHoverEnd, onHoverStart = props.onHoverStart, onInactive = props.onInactive, onKeyDown = props.onKeyDown, onRootElementRendered = props.onRootElementRendered, onVisibilityChange = props.onVisibilityChange, rootElementRef = props.rootElementRef, rtlEnabled = props.rtlEnabled, tabIndex = props.tabIndex, visible = props.visible, width = props.width, restProps = __rest(props, ["_feedbackHideTimeout", "_feedbackShowTimeout", "accessKey", "activeStateEnabled", "activeStateUnit", "addWidgetClass", "aria", "children", "className", "classes", "cssText", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "name", "onActive", "onClick", "onDimensionChanged", "onFocusIn", "onFocusOut", "onHoverEnd", "onHoverStart", "onInactive", "onKeyDown", "onRootElementRendered", "onVisibilityChange", "rootElementRef", "rtlEnabled", "tabIndex", "visible", "width"]);
        return restProps;
    }, [props]);
    var __focus = hooks_1.useCallback(function () {
        short_1.focus.trigger(__widgetElementRef.current);
    }, []);
    var __blur = hooks_1.useCallback(function () {
        var activeElement = dom_adapter_1["default"].getActiveElement();
        if (__widgetElementRef.current === activeElement) {
            activeElement.blur();
        }
    }, []);
    var __activate = hooks_1.useCallback(function () {
        __state_setActive(function (__state_active) { return true; });
    }, []);
    var __deactivate = hooks_1.useCallback(function () {
        __state_setActive(function (__state_active) { return false; });
    }, []);
    var __attributes = hooks_1.useCallback(function () {
        var aria = props.aria, disabled = props.disabled, focusStateEnabled = props.focusStateEnabled, visible = props.visible;
        var accessKey = focusStateEnabled && !disabled && props.accessKey;
        return __assign(__assign({}, extend_1.extend({}, __restAttributes(), accessKey && { accessKey: accessKey })), getAria(__assign(__assign({}, aria), { disabled: disabled, hidden: !visible })));
    }, [
        props.aria,
        props.disabled,
        props.focusStateEnabled,
        props.visible,
        props.accessKey,
        __restAttributes,
    ]);
    var __styles = hooks_1.useCallback(function () {
        var height = props.height, width = props.width;
        var style = __restAttributes().style || {};
        var computedWidth = style_1.normalizeStyleProp('width', type_1.isFunction(width) ? width() : width);
        var computedHeight = style_1.normalizeStyleProp('height', type_1.isFunction(height) ? height() : height);
        return __assign(__assign({}, style), { height: computedHeight !== null && computedHeight !== void 0 ? computedHeight : style.height, width: computedWidth !== null && computedWidth !== void 0 ? computedWidth : style.width });
    }, [props.height, props.width, __restAttributes]);
    var __cssClasses = hooks_1.useCallback(function () {
        var _a;
        var activeStateEnabled = props.activeStateEnabled, addWidgetClass = props.addWidgetClass, className = props.className, classes = props.classes, disabled = props.disabled, focusStateEnabled = props.focusStateEnabled, hoverStateEnabled = props.hoverStateEnabled, onVisibilityChange = props.onVisibilityChange, visible = props.visible;
        var isFocusable = !!focusStateEnabled && !disabled;
        var isHoverable = !!hoverStateEnabled && !disabled;
        var canBeActive = !!activeStateEnabled && !disabled;
        var classesMap = (_a = {
                'dx-widget': !!addWidgetClass
            },
            _a[String(classes)] = !!classes,
            _a[String(className)] = !!className,
            _a['dx-state-disabled'] = !!disabled,
            _a['dx-state-invisible'] = !visible,
            _a['dx-state-focused'] = !!__state_focused && isFocusable,
            _a['dx-state-active'] = !!__state_active && canBeActive,
            _a['dx-state-hover'] = !!__state_hovered && isHoverable && !__state_active,
            _a['dx-rtl'] = !!__rtlEnabled(),
            _a['dx-visibility-change-handler'] = !!onVisibilityChange,
            _a);
        return combine_classes_1.combineClasses(classesMap);
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
    hooks_1.useEffect(function () {
        var onRootElementRendered = props.onRootElementRendered, rootElementRef = props.rootElementRef;
        if (rootElementRef) {
            rootElementRef.current = __widgetElementRef.current;
        }
        onRootElementRendered === null || onRootElementRendered === void 0 ? void 0 : onRootElementRendered(__widgetElementRef.current);
    }, []);
    hooks_1.useEffect(function () {
        var _feedbackHideTimeout = props._feedbackHideTimeout, _feedbackShowTimeout = props._feedbackShowTimeout, activeStateEnabled = props.activeStateEnabled, activeStateUnit = props.activeStateUnit, disabled = props.disabled, onActive = props.onActive, onInactive = props.onInactive;
        var namespace = 'UIFeedback';
        var selector = activeStateUnit;
        if (activeStateEnabled) {
            if (disabled) {
                __state_setActive(function (__state_active) { return false; });
            }
            else {
                short_1.active.on(__widgetElementRef.current, function (_a) {
                    var event = _a.event;
                    __state_setActive(function (__state_active) { return true; });
                    onActive === null || onActive === void 0 ? void 0 : onActive(event);
                }, function (_a) {
                    var event = _a.event;
                    __state_setActive(function (__state_active) { return false; });
                    onInactive === null || onInactive === void 0 ? void 0 : onInactive(event);
                }, {
                    hideTimeout: _feedbackHideTimeout,
                    namespace: namespace,
                    selector: selector,
                    showTimeout: _feedbackShowTimeout
                });
                return function () { return short_1.active.off(__widgetElementRef.current, { selector: selector, namespace: namespace }); };
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
    // hooks_1.useEffect(function () {
    //     var disabled = props.disabled, name = props.name, onClick = props.onClick;
    //     var namespace = name;
    //     if (onClick && !disabled) {
    //         short_1.dxClick.on(__widgetElementRef.current, onClick, { namespace: namespace });
    //         return function () { return short_1.dxClick.off(__widgetElementRef.current, { namespace: namespace }); };
    //     }
    //     return undefined;
    // }, [props.disabled, props.name, props.onClick]);
    hooks_1.useEffect(function () {
        var disabled = props.disabled, focusStateEnabled = props.focusStateEnabled, name = props.name, onFocusIn = props.onFocusIn, onFocusOut = props.onFocusOut;
        var namespace = name + "Focus";
        if (focusStateEnabled) {
            if (disabled) {
                __state_setFocused(function (__state_focused) { return false; });
            }
            else {
                short_1.focus.on(__widgetElementRef.current, function (e) {
                    if (!e.isDefaultPrevented()) {
                        __state_setFocused(function (__state_focused) { return true; });
                        onFocusIn === null || onFocusIn === void 0 ? void 0 : onFocusIn(e);
                    }
                }, function (e) {
                    if (!e.isDefaultPrevented()) {
                        __state_setFocused(function (__state_focused) { return false; });
                        onFocusOut === null || onFocusOut === void 0 ? void 0 : onFocusOut(e);
                    }
                }, { isFocusable: selectors_1.focusable, namespace: namespace });
                return function () { return short_1.focus.off(__widgetElementRef.current, { namespace: namespace }); };
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
    hooks_1.useEffect(function () {
        var activeStateUnit = props.activeStateUnit, disabled = props.disabled, hoverStateEnabled = props.hoverStateEnabled, onHoverEnd = props.onHoverEnd, onHoverStart = props.onHoverStart;
        var namespace = 'UIFeedback';
        var selector = activeStateUnit;
        if (hoverStateEnabled) {
            if (disabled) {
                __state_setHovered(function (__state_hovered) { return false; });
            }
            else {
                short_1.hover.on(__widgetElementRef.current, function (_a) {
                    var event = _a.event;
                    !__state_active && __state_setHovered(function (__state_hovered) { return true; });
                    onHoverStart === null || onHoverStart === void 0 ? void 0 : onHoverStart(event);
                }, function (event) {
                    __state_setHovered(function (__state_hovered) { return false; });
                    onHoverEnd === null || onHoverEnd === void 0 ? void 0 : onHoverEnd(event);
                }, { selector: selector, namespace: namespace });
                return function () { return short_1.hover.off(__widgetElementRef.current, { selector: selector, namespace: namespace }); };
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
    // hooks_1.useEffect(function () {
    //     var focusStateEnabled = props.focusStateEnabled, onKeyDown = props.onKeyDown;
    //     if (focusStateEnabled && onKeyDown) {
    //         var id_1 = short_1.keyboard.on(__widgetElementRef.current, __widgetElementRef.current, function (e) { return onKeyDown(e); });
    //         return function () { return short_1.keyboard.off(id_1); };
    //     }
    //     return undefined;
    // }, [props.focusStateEnabled, props.onKeyDown]);
    hooks_1.useEffect(function () {
        var namespace = props.name + "VisibilityChange";
        var onDimensionChanged = props.onDimensionChanged;
        if (onDimensionChanged) {
            short_1.resize.on(__widgetElementRef.current, onDimensionChanged, {
                namespace: namespace
            });
            return function () { return short_1.resize.off(__widgetElementRef.current, { namespace: namespace }); };
        }
        return undefined;
    }, [props.name, props.onDimensionChanged]);
    hooks_1.useEffect(function () {
        var onDimensionChanged = props.onDimensionChanged;
        if (onDimensionChanged) {
            resize_callbacks_1["default"].add(onDimensionChanged);
            return function () {
                resize_callbacks_1["default"].remove(onDimensionChanged);
            };
        }
        return undefined;
    }, [props.onDimensionChanged]);
    hooks_1.useEffect(function () {
        var name = props.name, onVisibilityChange = props.onVisibilityChange;
        var namespace = name + "VisibilityChange";
        if (onVisibilityChange) {
            short_1.visibility.on(__widgetElementRef.current, function () { return onVisibilityChange(true); }, function () { return onVisibilityChange(false); }, { namespace: namespace });
            return function () { return short_1.visibility.off(__widgetElementRef.current, { namespace: namespace }); };
        }
        return undefined;
    }, [props.name, props.onVisibilityChange]);
    hooks_1.useEffect(function () {
        var height = props.height, width = props.width;
        if (type_1.isFunction(width)) {
            errors_1["default"].log('W0017', 'width');
        }
        if (type_1.isFunction(height)) {
            errors_1["default"].log('W0017', 'height');
        }
    }, [props.height, props.width]);
    hooks_1.useEffect(function () {
        var cssText = props.cssText;
        if (cssText !== '' && __widgetElementRef.current) {
            __widgetElementRef.current.style.cssText = cssText;
        }
    }, [props.cssText]);
    hooks_1.useImperativeHandle(ref, function () { return ({
        focus: __focus,
        blur: __blur,
        activate: __activate,
        deactivate: __deactivate
    }); }, [__focus, __blur, __activate, __deactivate]);
    return exports.viewFunction({
        props: __assign({}, props),
        active: __state_active,
        focused: __state_focused,
        hovered: __state_hovered,
        widgetElementRef: __widgetElementRef,
        config: config,
        shouldRenderConfigProvider: __shouldRenderConfigProvider(),
        rtlEnabled: __rtlEnabled(),
        attributes: __attributes(),
        styles: __styles(),
        cssClasses: __cssClasses(),
        tabIndex: __tabIndex(),
        restAttributes: __restAttributes()
    });
}; };
var refs = new Map();
var WidgetFn = function (ref) {
    if (!refs.has(ref)) {
        refs.set(ref, Widget(ref));
    }
    return refs.get(ref);
};
function InfernoWidget(props, ref) {
    return <hooks_1.HookContainer renderFn={WidgetFn(ref)} childProps={props}></hooks_1.HookContainer>;
}
var InfernoWidgetFR = inferno_1.forwardRef(InfernoWidget);
exports.InfernoWidgetFR = InfernoWidgetFR;
exports["default"] = InfernoWidgetFR;
Widget.defaultProps = exports.WidgetProps;
