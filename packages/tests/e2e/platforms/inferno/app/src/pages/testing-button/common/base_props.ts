export declare type BaseWidgetPropsType = {
    className?: string;
    accessKey?: string;
    activeStateEnabled?: boolean;
    disabled?: boolean;
    focusStateEnabled?: boolean;
    height?: string | number | (() => string | number);
    hint?: string;
    hoverStateEnabled?: boolean;
    onClick?: (e: any) => void;
    onKeyDown?: (e: any) => any;
    rtlEnabled?: boolean;
    tabIndex?: number;
    visible?: boolean;
    width?: string | number | (() => string | number);
  };
  export const BaseWidgetProps: BaseWidgetPropsType = {
    className: "",
    activeStateEnabled: false,
    disabled: false,
    focusStateEnabled: false,
    hoverStateEnabled: false,
    tabIndex: 0,
    visible: true,
  };
  