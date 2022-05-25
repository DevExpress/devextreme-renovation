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
exports.defaultOptions = exports.InfernoButtonFR = exports.InfernoButton = exports.Button = exports.defaultOptionRules = exports.ButtonProps = exports.viewFunction = void 0;
var hooks_1 = require("@devextreme/runtime/inferno-hooks/hooks");
var inferno_create_element_1 = require("inferno-create-element");
var h = inferno_create_element_1.createElement;
var inferno_1 = require("inferno");
var react_1 = require("@devextreme/runtime/react");
var utils_1 = require("../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/options/utils");
var devices_1 = require("../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/devices");
var themes_1 = require("../../../../../../../../../../DevExtreme/artifacts/react-typescript/ui/themes");
var short_1 = require("../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/short");
var combine_classes_1 = require("../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/combine_classes");
var icon_1 = require("../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/icon");
var icon_2 = require("./common/icon");
var ink_ripple_1 = require("./common/ink_ripple");
var widget_1 = require("./common/widget");
var base_props_1 = require("./common/base_props");
var stylingModes = ['outlined', 'text', 'contained'];
var getCssClasses = function (model) {
    var _a;
    var icon = model.icon, iconPosition = model.iconPosition, stylingMode = model.stylingMode, text = model.text, type = model.type;
    var isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
    var classesMap = (_a = {
            'dx-button': true
        },
        _a["dx-button-mode-".concat(isValidStylingMode ? stylingMode : 'contained')] = true,
        _a["dx-button-".concat(type !== null && type !== void 0 ? type : 'normal')] = true,
        _a['dx-button-has-text'] = !!text,
        _a['dx-button-has-icon'] = !!icon,
        _a['dx-button-icon-right'] = iconPosition !== 'left',
        _a);
    return (0, combine_classes_1.combineClasses)(classesMap);
};
var viewFunction = function (viewModel) {
    var _a = viewModel.props, children = _a.children, iconPosition = _a.iconPosition, IconTemplate = _a.iconTemplate, ButtonTemplate = _a.template, text = _a.text;
    var renderText = !viewModel.props.template && !children && text !== '';
    var isIconLeft = iconPosition === 'left';
    var iconComponent = !viewModel.props.template
        && !children
        && (viewModel.iconSource || viewModel.props.iconTemplate) && (<icon_2.Icon source={viewModel.iconSource} position={iconPosition} iconTemplate={IconTemplate}/>);
    return (<widget_1.InfernoWidgetFR ref={viewModel.widgetRef} accessKey={viewModel.props.accessKey} activeStateEnabled={viewModel.props.activeStateEnabled} aria={viewModel.aria} className={viewModel.props.className} classes={viewModel.cssClasses} disabled={viewModel.props.disabled} focusStateEnabled={viewModel.props.focusStateEnabled} height={viewModel.props.height} hint={viewModel.props.hint} hoverStateEnabled={viewModel.props.hoverStateEnabled} onActive={viewModel.onActive} onClick={viewModel.onWidgetClick} onInactive={viewModel.onInactive} onKeyDown={viewModel.keyDown} rtlEnabled={viewModel.props.rtlEnabled} tabIndex={viewModel.props.tabIndex} visible={viewModel.props.visible} width={viewModel.props.width} {...viewModel.restAttributes}>
      <div className="dx-button-content" ref={viewModel.contentRef}>
        {viewModel.props.template
            && ButtonTemplate({ data: viewModel.buttonTemplateData })}

        {!viewModel.props.template && children}

        {isIconLeft && iconComponent}

        {renderText && <span className="dx-button-text">{text}</span>}

        {!isIconLeft && iconComponent}

        {viewModel.props.useSubmitBehavior && (<input ref={viewModel.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input"/>)}

        {viewModel.props.useInkRipple && (<ink_ripple_1.InkRipple config={viewModel.inkRippleConfig} ref={viewModel.inkRippleRef}/>)}
      </div>
    </widget_1.InfernoWidgetFR>);
};
exports.viewFunction = viewFunction;
exports.ButtonProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(base_props_1.BaseWidgetProps), Object.getOwnPropertyDescriptors({
    activeStateEnabled: true,
    hoverStateEnabled: true,
    icon: '',
    iconPosition: 'left',
    stylingMode: 'contained',
    text: '',
    type: 'normal',
    useInkRipple: false,
    useSubmitBehavior: false,
    templateData: Object.freeze({})
})));
exports.defaultOptionRules = (0, utils_1.createDefaultOptionRules)([
    {
        device: function () { return devices_1["default"].real().deviceType === 'desktop' && !devices_1["default"].isSimulator(); },
        options: { focusStateEnabled: true }
    },
    {
        device: function () { return (0, themes_1.isMaterial)((0, themes_1.current)()); },
        options: { useInkRipple: true }
    },
]);
var Button = function (ref) { return function (props) {
    var __contentRef = (0, hooks_1.useRef)(null);
    var __submitInputRef = (0, hooks_1.useRef)(null);
    var __inkRippleRef = (0, hooks_1.useRef)(null);
    var __widgetRef = (0, hooks_1.useRef)(null);
    var __onActive = (0, hooks_1.useCallback)(function (event) {
        var useInkRipple = props.useInkRipple;
        useInkRipple
            && __inkRippleRef.current.showWave({
                element: __contentRef.current,
                event: event
            });
    }, [props.useInkRipple]);
    var __onInactive = (0, hooks_1.useCallback)(function (event) {
        var useInkRipple = props.useInkRipple;
        useInkRipple
            && __inkRippleRef.current.hideWave({
                element: __contentRef.current,
                event: event
            });
    }, [props.useInkRipple]);
    var __onWidgetClick = (0, hooks_1.useCallback)(function (event) {
        var onClick = props.onClick, useSubmitBehavior = props.useSubmitBehavior;
        onClick === null || onClick === void 0 ? void 0 : onClick({ event: event });
        useSubmitBehavior && __submitInputRef.current.click();
    }, [props.onClick, props.useSubmitBehavior]);
    var __aria = (0, hooks_1.useCallback)(function () {
        var icon = props.icon, text = props.text;
        var label = (text !== null && text !== void 0 ? text : '') || icon;
        if (!text && icon && (0, icon_1.getImageSourceType)(icon) === 'image') {
            label = !icon.includes('base64')
                ? icon.replace(/.+\/([^.]+)\..+$/, '$1')
                : 'Base64';
        }
        return __assign({ role: 'button' }, (label ? { label: label } : {}));
    }, [props.icon, props.text]);
    var __cssClasses = (0, hooks_1.useCallback)(function () { return getCssClasses(props); }, [props]);
    var __iconSource = (0, hooks_1.useCallback)(function () {
        var icon = props.icon, type = props.type;
        if (icon || type === 'back') {
            return (icon !== null && icon !== void 0 ? icon : '') || 'back';
        }
        return '';
    }, [props.icon, props.type]);
    var __inkRippleConfig = (0, hooks_1.useMemo)(function () {
        var icon = props.icon, text = props.text, type = props.type;
        return (!text && icon) || type === 'back'
            ? {
                isCentered: true,
                useHoldAnimation: false,
                waveSizeCoefficient: 1
            }
            : {};
    }, [props.icon, props.text, props.type]);
    var __buttonTemplateData = (0, hooks_1.useCallback)(function () {
        var icon = props.icon, templateData = props.templateData, text = props.text;
        return __assign({ icon: icon, text: text }, templateData);
    }, [props.icon, props.templateData, props.text]);
    var __restAttributes = (0, hooks_1.useCallback)(function () {
        var accessKey = props.accessKey, activeStateEnabled = props.activeStateEnabled, children = props.children, className = props.className, component = props.component, disabled = props.disabled, focusStateEnabled = props.focusStateEnabled, height = props.height, hint = props.hint, hoverStateEnabled = props.hoverStateEnabled, icon = props.icon, iconComponent = props.iconComponent, iconPosition = props.iconPosition, iconRender = props.iconRender, iconTemplate = props.iconTemplate, onClick = props.onClick, onKeyDown = props.onKeyDown, onSubmit = props.onSubmit, pressed = props.pressed, render = props.render, rtlEnabled = props.rtlEnabled, stylingMode = props.stylingMode, tabIndex = props.tabIndex, template = props.template, templateData = props.templateData, text = props.text, type = props.type, useInkRipple = props.useInkRipple, useSubmitBehavior = props.useSubmitBehavior, visible = props.visible, width = props.width, restProps = __rest(props, ["accessKey", "activeStateEnabled", "children", "className", "component", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "icon", "iconComponent", "iconPosition", "iconRender", "iconTemplate", "onClick", "onKeyDown", "onSubmit", "pressed", "render", "rtlEnabled", "stylingMode", "tabIndex", "template", "templateData", "text", "type", "useInkRipple", "useSubmitBehavior", "visible", "width"]);
        return restProps;
    }, [props]);
    var __focus = (0, hooks_1.useCallback)(function () {
        __widgetRef.current.focus();
    }, []);
    var __activate = (0, hooks_1.useCallback)(function () {
        __widgetRef.current.activate();
    }, []);
    var __deactivate = (0, hooks_1.useCallback)(function () {
        __widgetRef.current.deactivate();
    }, []);
    var __keyDown = (0, hooks_1.useCallback)(function (e) {
        var onKeyDown = props.onKeyDown;
        var keyName = e.keyName, originalEvent = e.originalEvent, which = e.which;
        var result = onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);
        if (result === null || result === void 0 ? void 0 : result.cancel) {
            return result;
        }
        if (keyName === 'space'
            || which === 'space'
            || keyName === 'enter'
            || which === 'enter') {
            originalEvent.preventDefault();
            __onWidgetClick(originalEvent);
        }
        return undefined;
    }, [props.onKeyDown, __onWidgetClick]);
    (0, hooks_1.useEffect)(function () {
        var namespace = 'UIFeedback';
        var onSubmit = props.onSubmit, useSubmitBehavior = props.useSubmitBehavior;
        if (useSubmitBehavior && onSubmit) {
            short_1.click.on(__submitInputRef.current, function (event) { return onSubmit({ event: event, submitInput: __submitInputRef.current }); }, { namespace: namespace });
            return function () { return short_1.click.off(__submitInputRef.current, { namespace: namespace }); };
        }
        return undefined;
    }, [props.onSubmit, props.useSubmitBehavior]);
    (0, hooks_1.useImperativeHandle)(ref, function () { return ({
        focus: __focus,
        activate: __activate,
        deactivate: __deactivate
    }); }, [__focus, __activate, __deactivate]);
    return (0, exports.viewFunction)({
        props: __assign(__assign({}, props), { template: (0, react_1.getTemplate)(props.template, props.render, props.component), iconTemplate: (0, react_1.getTemplate)(props.iconTemplate, props.iconRender, props.iconComponent) }),
        contentRef: __contentRef,
        submitInputRef: __submitInputRef,
        inkRippleRef: __inkRippleRef,
        widgetRef: __widgetRef,
        onActive: __onActive,
        onInactive: __onInactive,
        onWidgetClick: __onWidgetClick,
        keyDown: __keyDown,
        aria: __aria(),
        cssClasses: __cssClasses(),
        iconSource: __iconSource(),
        inkRippleConfig: __inkRippleConfig,
        buttonTemplateData: __buttonTemplateData(),
        restAttributes: __restAttributes()
    });
}; };
exports.Button = Button;
var refs = new Map();
var ButtonFn = function (ref) {
    if (!refs.has(ref)) {
        refs.set(ref, Button(ref));
    }
    return refs.get(ref);
};
// const ButtonFn2 = Button(ref1)
function InfernoButton(props, ref) {
    // const ButtonFn2 = ButtonFn(ref)
    return <hooks_1.HookContainer renderFn={ButtonFn(ref)} renderProps={props}></hooks_1.HookContainer>;
}
exports.InfernoButton = InfernoButton;
// forwardRef(
// );
var InfernoButtonFR = (0, inferno_1.forwardRef)(InfernoButton);
exports.InfernoButtonFR = InfernoButtonFR;
exports["default"] = InfernoButtonFR;
Button.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(exports.ButtonProps), Object.getOwnPropertyDescriptors(__assign({}, (0, utils_1.convertRulesToOptions)(exports.defaultOptionRules)))));
var __defaultOptionRules = [];
function defaultOptions(rule) {
    __defaultOptionRules.push(rule);
    Button.defaultProps = Object.create(Object.prototype, Object.assign(Object.getOwnPropertyDescriptors(Button.defaultProps), Object.getOwnPropertyDescriptors((0, utils_1.convertRulesToOptions)(exports.defaultOptionRules)), Object.getOwnPropertyDescriptors((0, utils_1.convertRulesToOptions)(__defaultOptionRules))));
}
exports.defaultOptions = defaultOptions;
