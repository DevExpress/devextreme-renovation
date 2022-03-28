import { createElement } from "inferno-create-element";
var h = createElement;
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useCallback,
  useContext,
  HookComponent,
} from '@devextreme/runtime/inferno-hooks/hooks';
import {
  RefObject as MutableRefObject,
} from '../../../../../../../../../runtime/inferno-hooks/ref_object'

import {createContext} from '../../../../../../../../../runtime/inferno-hooks/create_context';

import {forwardRef} from 'inferno';
import '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/click';
import '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/hover';
import { isFunction } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/type';
import {
  active,
  dxClick,
  focus,
  hover,
  keyboard,
  resize,
  visibility,
} from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/short';
import { combineClasses } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/combine_classes';
import { extend } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/extend';
import { focusable } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/ui/widget/selectors';
import { normalizeStyleProp } from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/style';
import { BaseWidgetProps } from './base_props';
import { ConfigProvider } from './config_provider.js';
import {
  resolveRtlEnabled,
  resolveRtlEnabledDefinition,
} from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/resolve_rtl';
import resizeCallbacks from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/resize_callbacks';
import errors from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/errors';
import domAdapter from '../../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/dom_adapter';

const DEFAULT_FEEDBACK_HIDE_TIMEOUT = 400;
const DEFAULT_FEEDBACK_SHOW_TIMEOUT = 30;
const getAria = (args: Record<string, unknown>): Record<string, string> => Object.keys(args).reduce((r, key) => {
  if (args[key]) {
    return {
      ...r,
      [key === 'role' || key === 'id' ? key : `aria-${key}`]: String(
        args[key],
      ),
    };
  }
  return r;
}, {});

export interface ConfigContextValue {
  rtlEnabled?: boolean;
}
export const ConfigContext = createContext<ConfigContextValue | undefined>(
  undefined
);

export const viewFunction = (viewModel: Widget): any => {
  const widget = (
    <div
      ref={viewModel.widgetElementRef}
      {...viewModel.attributes}
      tabIndex={viewModel.tabIndex}
      title={viewModel.props.hint}
      hidden={!viewModel.props.visible}
      className={viewModel.cssClasses}
      style={normalizeStyles(viewModel.styles)}
      onClick={viewModel.props.onClick}
      onKeyDown={viewModel.props.onKeyDown}
    >
      {viewModel.props.children}
    </div>
  );
  return viewModel.shouldRenderConfigProvider ? (
    <ConfigProvider rtlEnabled={viewModel.rtlEnabled}>
      {widget}
    </ConfigProvider>
  ) : (
    widget
  );
};

export declare type WidgetPropsType = typeof BaseWidgetProps & {
  rootElementRef?: MutableRefObject<HTMLDivElement | null>;
  _feedbackHideTimeout?: number;
  _feedbackShowTimeout?: number;
  activeStateUnit?: string;
  cssText: string;
  aria?: Record<string, string>;
  children?: any;
  classes?: string | undefined;
  name?: string;
  addWidgetClass?: boolean;
  onActive?: (e: Event) => void;
  onDimensionChanged?: () => void;
  onInactive?: (e: Event) => void;
  onVisibilityChange?: (args: boolean) => void;
  onFocusIn?: (e: Event) => void;
  onFocusOut?: (e: Event) => void;
  onHoverStart?: (e: Event) => void;
  onHoverEnd?: (e: Event) => void;
  onRootElementRendered?: (rootElement: HTMLDivElement) => void;
};
export const WidgetProps: WidgetPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseWidgetProps),
    Object.getOwnPropertyDescriptors({
      _feedbackHideTimeout: DEFAULT_FEEDBACK_HIDE_TIMEOUT,
      _feedbackShowTimeout: DEFAULT_FEEDBACK_SHOW_TIMEOUT,
      cssText: '',
      aria: Object.freeze({}) as any,
      classes: '',
      name: '',
      addWidgetClass: true,
    }),
  ),
);

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

const isNumeric = (value: string | number) => {
  if (typeof value === 'number') return true;
  return !isNaN(Number(value));
};

const getNumberStyleValue = (style: string, value: string | number) => (NUMBER_STYLES.has(style) ? value : `${value}px`);

const normalizeStyles = (styles: unknown) => {
  if (!(styles instanceof Object)) return undefined;

  return Object.entries(styles).reduce(
    (result: Record<string, string | number>, [key, value]) => {
      result[key] = isNumeric(value) ? getNumberStyleValue(key, value) : value;
      return result;
    },
    {} as Record<string, string | number>,
  );
};

export type WidgetRef = {
  focus: () => void;
  blur: () => void;
  activate: () => void;
  deactivate: () => void;
};
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Widget {
  props: typeof WidgetProps & RestProps;
  active: boolean;
  focused: boolean;
  hovered: boolean;
  widgetElementRef: any;
  config?: ConfigContextValue;
  shouldRenderConfigProvider: boolean;
  rtlEnabled: boolean | undefined;
  attributes: Record<string, string>;
  styles: Record<string, string | number>;
  cssClasses: string;
  tabIndex: undefined | number;
  restAttributes: RestProps;
}
 
const Widget = (ref)=>(props: typeof WidgetProps & RestProps) => {
  const __widgetElementRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const [__state_active, __state_setActive] = useState<boolean>(false);
  const [__state_focused, __state_setFocused] = useState<boolean>(false);
  const [__state_hovered, __state_setHovered] = useState<boolean>(false);
  const config = useContext(ConfigContext);
  const __shouldRenderConfigProvider = useCallback(
    (): boolean => {
      const { rtlEnabled } = props;
      return resolveRtlEnabledDefinition(rtlEnabled, config);
    },
    [props.rtlEnabled, config],
  );
  const __rtlEnabled = useCallback(
    (): boolean | undefined => {
      const { rtlEnabled } = props;
      return resolveRtlEnabled(rtlEnabled, config);
    },
    [props.rtlEnabled, config],
  );
  const __tabIndex = useCallback(
    (): undefined | number => {
      const { disabled, focusStateEnabled, tabIndex } = props;
      const isFocusable = focusStateEnabled && !disabled;
      return isFocusable ? tabIndex : undefined;
    },
    [props.disabled, props.focusStateEnabled, props.tabIndex],
  );
  const __restAttributes = useCallback(
    (): RestProps => {
      const {
        _feedbackHideTimeout,
        _feedbackShowTimeout,
        accessKey,
        activeStateEnabled,
        activeStateUnit,
        addWidgetClass,
        aria,
        children,
        className,
        classes,
        cssText,
        disabled,
        focusStateEnabled,
        height,
        hint,
        hoverStateEnabled,
        name,
        onActive,
        onClick,
        onDimensionChanged,
        onFocusIn,
        onFocusOut,
        onHoverEnd,
        onHoverStart,
        onInactive,
        onKeyDown,
        onRootElementRendered,
        onVisibilityChange,
        rootElementRef,
        rtlEnabled,
        tabIndex,
        visible,
        width,
        ...restProps
      } = props;
      return restProps;
    },
    [props],
  );
  const __focus = useCallback((): void => {
    focus.trigger(__widgetElementRef.current);
  }, []);
  const __blur = useCallback((): void => {
    const activeElement = domAdapter.getActiveElement();
    if (__widgetElementRef.current === activeElement) {
      activeElement.blur();
    }
  }, []);
  const __activate = useCallback((): void => {
    __state_setActive((__state_active) => true);
  }, []);
  const __deactivate = useCallback((): void => {
    __state_setActive((__state_active) => false);
  }, []);
  const __attributes = useCallback(
    (): Record<string, string> => {
      const {
        aria, disabled, focusStateEnabled, visible,
      } = props;
      const accessKey = focusStateEnabled && !disabled && props.accessKey;
      return {
        ...(extend(
          {},
          __restAttributes(),
          accessKey && { accessKey },
        ) as Record<string, string>),
        ...getAria({ ...aria, disabled, hidden: !visible }),
      };
    },
    [
      props.aria,
      props.disabled,
      props.focusStateEnabled,
      props.visible,
      props.accessKey,
      __restAttributes,
    ],
  );
  const __styles = useCallback(
    (): Record<string, string | number> => {
      const { height, width } = props;
      const style = (__restAttributes().style as Record<string, string | number>) || {};
      const computedWidth = normalizeStyleProp(
        'width',
        isFunction(width) ? width() : width,
      );
      const computedHeight = normalizeStyleProp(
        'height',
        isFunction(height) ? height() : height,
      );
      return {
        ...style,
        height: computedHeight ?? style.height,
        width: computedWidth ?? style.width,
      };
    },
    [props.height, props.width, __restAttributes],
  );
  const __cssClasses = useCallback(
    (): string => {
      const {
        activeStateEnabled,
        addWidgetClass,
        className,
        classes,
        disabled,
        focusStateEnabled,
        hoverStateEnabled,
        onVisibilityChange,
        visible,
      } = props;
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
    },
    [
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
    ],
  );
  useEffect(() => {
    const { onRootElementRendered, rootElementRef } = props;
    if (rootElementRef) {
      rootElementRef.current = __widgetElementRef.current;
    }
    onRootElementRendered?.(__widgetElementRef.current!);
  }, []);
  useEffect(() => {
    const {
      _feedbackHideTimeout,
      _feedbackShowTimeout,
      activeStateEnabled,
      activeStateUnit,
      disabled,
      onActive,
      onInactive,
    } = props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (activeStateEnabled) {
      if (disabled) {
        __state_setActive((__state_active) => false);
      } else {
        active.on(
          __widgetElementRef.current,
          ({ event }: { event: Event }) => {
            __state_setActive((__state_active) => true);
            onActive?.(event);
          },
          ({ event }: { event: Event }) => {
            __state_setActive((__state_active) => false);
            onInactive?.(event);
          },
          {
            hideTimeout: _feedbackHideTimeout,
            namespace,
            selector,
            showTimeout: _feedbackShowTimeout,
          },
        );
        return (): void => active.off(__widgetElementRef.current, { selector, namespace });
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
      return (): void => dxClick.off(__widgetElementRef.current, { namespace });
    }
    return undefined;
  }, [props.disabled, props.name, props.onClick]);
  useEffect(() => {
    const {
      disabled, focusStateEnabled, name, onFocusIn, onFocusOut,
    } = props;
    const namespace = `${name}Focus`;
    if (focusStateEnabled) {
      if (disabled) {
        __state_setFocused((__state_focused) => false);
      } else {
        focus.on(
          __widgetElementRef.current,
          (e: Event & { isDefaultPrevented: () => boolean }) => {
            if (!e.isDefaultPrevented()) {
              __state_setFocused((__state_focused) => true);
              onFocusIn?.(e);
            }
          },
          (e: Event & { isDefaultPrevented: () => boolean }) => {
            if (!e.isDefaultPrevented()) {
              __state_setFocused((__state_focused) => false);
              onFocusOut?.(e);
            }
          },
          { isFocusable: focusable, namespace },
        );
        return (): void => focus.off(__widgetElementRef.current, { namespace });
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
    const {
      activeStateUnit,
      disabled,
      hoverStateEnabled,
      onHoverEnd,
      onHoverStart,
    } = props;
    const namespace = 'UIFeedback';
    const selector = activeStateUnit;
    if (hoverStateEnabled) {
      if (disabled) {
        __state_setHovered((__state_hovered) => false);
      } else {
        hover.on(
          __widgetElementRef.current,
          ({ event }: { event: Event }) => {
            !__state_active && __state_setHovered((__state_hovered) => true);
            onHoverStart?.(event);
          },
          (event: Event) => {
            __state_setHovered((__state_hovered) => false);
            onHoverEnd?.(event);
          },
          { selector, namespace },
        );
        return (): void => hover.off(__widgetElementRef.current, { selector, namespace });
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
  // useEffect(() => {
  //   const { focusStateEnabled, onKeyDown } = props;
  //   if (focusStateEnabled && onKeyDown) {
  //     const id = keyboard.on(
  //       __widgetElementRef.current,
  //       __widgetElementRef.current,
  //       (e: Event): void => onKeyDown(e) as undefined,
  //     );
  //     return (): void => keyboard.off(id);
  //   }
  //   return undefined;
  // }, [props.focusStateEnabled, props.onKeyDown]);
  useEffect(() => {
    const namespace = `${props.name}VisibilityChange`;
    const { onDimensionChanged } = props;
    if (onDimensionChanged) {
      resize.on(__widgetElementRef.current, onDimensionChanged, {
        namespace,
      });
      return (): void => resize.off(__widgetElementRef.current, { namespace });
    }
    return undefined;
  }, [props.name, props.onDimensionChanged]);
  useEffect(() => {
    const { onDimensionChanged } = props;
    if (onDimensionChanged) {
      resizeCallbacks.add(onDimensionChanged);
      return (): void => {
        resizeCallbacks.remove(onDimensionChanged);
      };
    }
    return undefined;
  }, [props.onDimensionChanged]);
  useEffect(() => {
    const { name, onVisibilityChange } = props;
    const namespace = `${name}VisibilityChange`;
    if (onVisibilityChange) {
      visibility.on(
        __widgetElementRef.current,
        (): void => onVisibilityChange(true),
        (): void => onVisibilityChange(false),
        { namespace },
      );
      return (): void => visibility.off(__widgetElementRef.current, { namespace });
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
    if (cssText !== '' && __widgetElementRef.current) {
      __widgetElementRef.current!.style.cssText = cssText;
    }
  }, [props.cssText]);
  useImperativeHandle(
    ref,
    () => ({
      focus: __focus,
      blur: __blur,
      activate: __activate,
      deactivate: __deactivate,
    }),
    [__focus, __blur, __activate, __deactivate],
  );
  return viewFunction({
    props: { ...props },
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
}
let refs = new Map();
const WidgetFn = (ref)=>{
  if(!refs.has(ref)){
    refs.set(ref, Widget(ref));
  }
  
 return refs.get(ref)
}
function InfernoWidget(props, ref) {
  return <HookComponent renderFn={
    WidgetFn(ref)
  } renderProps={props} ></HookComponent>
}
const InfernoWidgetFR = forwardRef(InfernoWidget)


export { InfernoWidgetFR };

export default InfernoWidgetFR;

Widget.defaultProps = WidgetProps;
