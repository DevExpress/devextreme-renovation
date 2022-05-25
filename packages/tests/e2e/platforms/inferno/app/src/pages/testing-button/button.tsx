import {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useImperativeHandle,
  HookContainer
} from '@devextreme/runtime/inferno-hooks/hooks';

import { createElement } from "inferno-create-element";
var h = createElement;
import {forwardRef} from "inferno";
import {RefObject as MutableRefObject} from '../../../../../../../../runtime/inferno-hooks'
import { getTemplate } from '@devextreme/runtime/react';
import {
  createDefaultOptionRules,
  convertRulesToOptions,
  DefaultOptionsRule,
} from '../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/options/utils';
import devices from '../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/devices';
import { isMaterial, current } from '../../../../../../../../../../DevExtreme/artifacts/react-typescript/ui/themes';
import { click } from '../../../../../../../../../../DevExtreme/artifacts/react-typescript/events/short';
import { combineClasses } from '../../../../../../../../../../DevExtreme/artifacts/react-typescript/renovation/utils/combine_classes';
import { getImageSourceType } from '../../../../../../../../../../DevExtreme/artifacts/react-typescript/core/utils/icon';
import {Icon}  from "./common/icon";
import { InkRipple, InkRippleConfig, InkRippleRef } from './common/ink_ripple';
import { InfernoWidgetFR as Widget, WidgetRef } from './common/widget';
import { BaseWidgetProps } from './common/base_props';

const stylingModes = ['outlined', 'text', 'contained'];
const getCssClasses = (model: typeof ButtonProps): string => {
  const {
    icon, iconPosition, stylingMode, text, type,
  } = model;
  const isValidStylingMode = stylingMode && stylingModes.includes(stylingMode);
  const classesMap = {
    'dx-button': true,
    [`dx-button-mode-${isValidStylingMode ? stylingMode : 'contained'}`]: true,
    [`dx-button-${type ?? 'normal'}`]: true,
    'dx-button-has-text': !!text,
    'dx-button-has-icon': !!icon,
    'dx-button-icon-right': iconPosition !== 'left',
  };
  return combineClasses(classesMap);
};
export const viewFunction = (viewModel: Button): any => {
  const {
    children,
    iconPosition,
    iconTemplate: IconTemplate,
    template: ButtonTemplate,
    text,
  } = viewModel.props;
  const renderText = !viewModel.props.template && !children && text !== '';
  const isIconLeft = iconPosition === 'left';
  const iconComponent = !viewModel.props.template
    && !children
    && (viewModel.iconSource || viewModel.props.iconTemplate) && (
      <Icon
        source={viewModel.iconSource}
        position={iconPosition}
        iconTemplate={IconTemplate}
      />
  );
  return (
    <Widget
      ref={viewModel.widgetRef}
      accessKey={viewModel.props.accessKey}
      activeStateEnabled={viewModel.props.activeStateEnabled}
      aria={viewModel.aria}
      className={viewModel.props.className}
      classes={viewModel.cssClasses}
      disabled={viewModel.props.disabled}
      focusStateEnabled={viewModel.props.focusStateEnabled}
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      hoverStateEnabled={viewModel.props.hoverStateEnabled}
      onActive={viewModel.onActive}
      onClick={viewModel.onWidgetClick}
      onInactive={viewModel.onInactive}
      onKeyDown={viewModel.keyDown}
      rtlEnabled={viewModel.props.rtlEnabled}
      tabIndex={viewModel.props.tabIndex}
      visible={viewModel.props.visible}
      width={viewModel.props.width}
      {...viewModel.restAttributes}
    >
      <div className="dx-button-content" ref={viewModel.contentRef}>
        {viewModel.props.template
          && ButtonTemplate({ data: viewModel.buttonTemplateData })}

        {!viewModel.props.template && children}

        {isIconLeft && iconComponent}

        {renderText && <span className="dx-button-text">{text}</span>}

        {!isIconLeft && iconComponent}

        {viewModel.props.useSubmitBehavior && (
          <input
            ref={viewModel.submitInputRef}
            type="submit"
            tabIndex={-1}
            className="dx-button-submit-input"
          />
        )}

        {viewModel.props.useInkRipple && (
          <InkRipple
            config={viewModel.inkRippleConfig}
            ref={viewModel.inkRippleRef}
          />
        )}
      </div>
    </Widget>
  );
};

export declare type ButtonPropsType = typeof BaseWidgetProps & {
  activeStateEnabled: boolean;
  hoverStateEnabled: boolean;
  icon: string;
  iconPosition?: string;
  onClick?: (e: { event: Event }) => void;
  onSubmit?: (e: {
    event: Event;
    submitInput: HTMLInputElement | null;
  }) => void;
  pressed?: boolean;
  stylingMode: 'outlined' | 'text' | 'contained';
  template?: (props: { data: { icon?: string; text?: string } }) => any;
  iconTemplate?: (props) => any;
  children?: any;
  text: string;
  type: 'back' | 'danger' | 'default' | 'normal' | 'success';
  useInkRipple: boolean;
  useSubmitBehavior: boolean;
  templateData?: Record<string, unknown>;
  render?: (props: { data: { icon?: string; text?: string } }) => any;
  component?: (props: { data: { icon?: string; text?: string } }) => any;
  iconRender?: (props) => any;
  iconComponent?: (props) => any;
};
export const ButtonProps: ButtonPropsType = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(BaseWidgetProps),
    Object.getOwnPropertyDescriptors({
      activeStateEnabled: true,
      hoverStateEnabled: true,
      icon: '',
      iconPosition: 'left',
      stylingMode: 'contained',
      text: '',
      type: 'normal',
      useInkRipple: false,
      useSubmitBehavior: false,
      templateData: Object.freeze({}) as any,
    }),
  ),
);
export const defaultOptionRules = createDefaultOptionRules<typeof ButtonProps>([
  {
    device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
    options: { focusStateEnabled: true },
  },
  {
    device: (): boolean => isMaterial(current()),
    options: { useInkRipple: true },
  },
]);

export type ButtonRef = {
  focus: () => void;
  activate: () => void;
  deactivate: () => void;
};
declare type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface Button {
  props: typeof ButtonProps & RestProps;
  contentRef: any;
  inkRippleRef: any;
  submitInputRef: any;
  widgetRef: any;
  onActive: (event: Event) => void;
  onInactive: (event: Event) => void;
  onWidgetClick: (event: Event) => void;
  keyDown: (e: {
    originalEvent: Event & { cancel: boolean };
    keyName: string;
    which: string;
  }) => Event | undefined;
  aria: Record<string, string>;
  cssClasses: string;
  iconSource: string;
  inkRippleConfig: InkRippleConfig;
  buttonTemplateData: Record<string, unknown>;
  restAttributes: RestProps;
}

const Button = (ref)=>(props: typeof ButtonProps & RestProps) => {
  const __contentRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const __submitInputRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const __inkRippleRef: MutableRefObject<InkRippleRef | null> = useRef<InkRippleRef>(null);
  const __widgetRef: MutableRefObject<WidgetRef | null> = useRef<WidgetRef>(null);

  const __onActive = useCallback(
    (event: Event): void => {
      const { useInkRipple } = props;
      useInkRipple
        && __inkRippleRef.current!.showWave({
          element: __contentRef.current!,
          event,
        });
    },
    [props.useInkRipple],
  );
  const __onInactive = useCallback(
    (event: Event): void => {
      const { useInkRipple } = props;
      useInkRipple
        && __inkRippleRef.current!.hideWave({
          element: __contentRef.current!,
          event,
        });
    },
    [props.useInkRipple],
  );
  const __onWidgetClick = useCallback(
    (event: Event): void => {
      const { onClick, useSubmitBehavior } = props;
      onClick?.({ event });
      useSubmitBehavior && __submitInputRef.current!.click();
    },
    [props.onClick, props.useSubmitBehavior],
  );
  const __aria = useCallback(
    (): Record<string, string> => {
      const { icon, text } = props;
      let label = (text ?? '') || icon;
      if (!text && icon && getImageSourceType(icon) === 'image') {
        label = !icon.includes('base64')
          ? icon.replace(/.+\/([^.]+)\..+$/, '$1')
          : 'Base64';
      }
      return { role: 'button', ...(label ? { label } : {}) };
    },
    [props.icon, props.text],
  );
  const __cssClasses = useCallback(
    (): string => getCssClasses(props),
    [props],
  );
  const __iconSource = useCallback(
    (): string => {
      const { icon, type } = props;
      if (icon || type === 'back') {
        return (icon ?? '') || 'back';
      }
      return '';
    },
    [props.icon, props.type],
  );
  const __inkRippleConfig = useMemo(
    (): InkRippleConfig => {
      const { icon, text, type } = props;
      return (!text && icon) || type === 'back'
        ? {
          isCentered: true,
          useHoldAnimation: false,
          waveSizeCoefficient: 1,
        }
        : {};
    },
    [props.icon, props.text, props.type],
  );
  const __buttonTemplateData = useCallback(
    (): Record<string, unknown> => {
      const { icon, templateData, text } = props;
      return { icon, text, ...templateData };
    },
    [props.icon, props.templateData, props.text],
  );
  const __restAttributes = useCallback(
    (): RestProps => {
      const {
        accessKey,
        activeStateEnabled,
        children,
        className,
        component,
        disabled,
        focusStateEnabled,
        height,
        hint,
        hoverStateEnabled,
        icon,
        iconComponent,
        iconPosition,
        iconRender,
        iconTemplate,
        onClick,
        onKeyDown,
        onSubmit,
        pressed,
        render,
        rtlEnabled,
        stylingMode,
        tabIndex,
        template,
        templateData,
        text,
        type,
        useInkRipple,
        useSubmitBehavior,
        visible,
        width,
        ...restProps
      } = props;
      return restProps;
    },
    [props],
  );
  const __focus = useCallback((): void => {
    __widgetRef.current!.focus();
  }, []);
  const __activate = useCallback((): void => {
    __widgetRef.current!.activate();
  }, []);
  const __deactivate = useCallback((): void => {
    __widgetRef.current!.deactivate();
  }, []);
  const __keyDown = useCallback(
    (e: {
      originalEvent: Event & { cancel: boolean };
      keyName: string;
      which: string;
    }): Event | undefined => {
      const { onKeyDown } = props;
      const { keyName, originalEvent, which } = e;
      const result: Event & { cancel: boolean } = onKeyDown?.(e);
      if (result?.cancel) {
        return result;
      }
      if (
        keyName === 'space'
        || which === 'space'
        || keyName === 'enter'
        || which === 'enter'
      ) {
        (originalEvent as Event).preventDefault();
        __onWidgetClick(originalEvent as Event);
      }
      return undefined;
    },
    [props.onKeyDown, __onWidgetClick],
  );
  useEffect(() => {
    const namespace = 'UIFeedback';
    const { onSubmit, useSubmitBehavior } = props;
    if (useSubmitBehavior && onSubmit) {
      click.on(
        __submitInputRef.current,
        (event) => onSubmit({ event, submitInput: __submitInputRef.current }),
        { namespace },
      );
      return (): void => click.off(__submitInputRef.current, { namespace });
    }
    return undefined;
  }, [props.onSubmit, props.useSubmitBehavior]);
  useImperativeHandle(
    ref,
    () => ({
      focus: __focus,
      activate: __activate,
      deactivate: __deactivate,
    }),
    [__focus, __activate, __deactivate],
  );
  return viewFunction({
    props: {
      ...props,
      template: getTemplate(props.template, props.render, props.component),
      iconTemplate: getTemplate(
        props.iconTemplate,
        props.iconRender,
        props.iconComponent,
      ),
    },
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
    restAttributes: __restAttributes(),
  });
}
let refs = new Map();
const ButtonFn = (ref)=>{
  if(!refs.has(ref)){
    refs.set(ref, Button(ref));
  }
  
 return refs.get(ref)
}
// const ButtonFn2 = Button(ref1)
function InfernoButton(props, ref) {
  // const ButtonFn2 = ButtonFn(ref)
  return <HookContainer renderFn={
    ButtonFn(ref)
  } renderProps={props}></HookContainer>
}

// forwardRef(
  
// );
const InfernoButtonFR = forwardRef(InfernoButton)
export { Button, InfernoButton, InfernoButtonFR };

export default InfernoButtonFR;

Button.defaultProps = Object.create(
  Object.prototype,
  Object.assign(
    Object.getOwnPropertyDescriptors(ButtonProps),
    Object.getOwnPropertyDescriptors({
      ...convertRulesToOptions<typeof ButtonProps>(defaultOptionRules),
    }),
  ),
);

type ButtonOptionRule = DefaultOptionsRule<typeof ButtonProps>;

const __defaultOptionRules: ButtonOptionRule[] = [];
export function defaultOptions(rule: ButtonOptionRule) {
  __defaultOptionRules.push(rule);
  Button.defaultProps = Object.create(
    Object.prototype,
    Object.assign(
      Object.getOwnPropertyDescriptors(Button.defaultProps),
      Object.getOwnPropertyDescriptors(
        convertRulesToOptions<typeof ButtonProps>(defaultOptionRules),
      ),
      Object.getOwnPropertyDescriptors(
        convertRulesToOptions<typeof ButtonProps>(__defaultOptionRules),
      ),
    ),
  );
}
