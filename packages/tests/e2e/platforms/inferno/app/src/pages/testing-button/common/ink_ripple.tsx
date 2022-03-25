import {
    initConfig,
    showWave,
    hideWave,
  } from "../../../../../../../../../../../DevExtreme/artifacts/react-typescript/ui/widget/utils.ink_ripple";
  export const viewFunction = (model: InkRipple): any => (
    <div className="dx-inkripple" {...model.restAttributes} />
  );
  
  export interface InkRippleConfig {
    isCentered?: boolean;
    useHoldAnimation?: boolean;
    waveSizeCoefficient?: number;
    wavesNumber?: number;
    durations?: {
      showingScale: number;
      hidingScale: number;
      hidingOpacity: number;
    };
  }
  
  export declare type InkRipplePropsType = {
    config?: InkRippleConfig;
  };
  export const InkRippleProps: InkRipplePropsType = {
    config: Object.freeze({}) as any,
  };
  import * as React from "react";
  import { useCallback, useMemo, useImperativeHandle, forwardRef } from "react";
  
  export type InkRippleRef = {
    hideWave: (opts: { element?: HTMLElement; event: Event }) => void;
    showWave: (opts: {
      element?: HTMLElement;
      event: Event;
      wave?: number;
    }) => void;
  };
  declare type RestProps = {
    className?: string;
    style?: { [name: string]: any };
    key?: any;
    ref?: any;
  };
  interface InkRipple {
    props: typeof InkRippleProps & RestProps;
    getConfig: InkRippleConfig;
    restAttributes: RestProps;
  }
  
  const InkRipple = forwardRef<InkRippleRef, typeof InkRippleProps & RestProps>(
    function inkRipple(props: typeof InkRippleProps & RestProps, ref) {
      const __getConfig = useMemo(
        function __getConfig(): InkRippleConfig {
          const { config } = props;
          return initConfig(config);
        },
        [props.config]
      );
      const __restAttributes = useCallback(
        function __restAttributes(): RestProps {
          const { config, ...restProps } = props;
          return restProps;
        },
        [props]
      );
      const __hideWave = useCallback(
        function __hideWave(opts: { element?: HTMLElement; event: Event }): void {
          hideWave(__getConfig, opts);
        },
        [__getConfig]
      );
      const __showWave = useCallback(
        function __showWave(opts: {
          element?: HTMLElement;
          event: Event;
          wave?: number;
        }): void {
          showWave(__getConfig, opts);
        },
        [__getConfig]
      );
  
      useImperativeHandle(
        ref,
        () => ({ hideWave: __hideWave, showWave: __showWave }),
        [__hideWave, __showWave]
      );
      return viewFunction({
        props: { ...props },
        getConfig: __getConfig,
        restAttributes: __restAttributes(),
      });
    }
  ) as React.FC<
    typeof InkRippleProps & RestProps & { ref?: React.Ref<InkRippleRef> }
  > & { defaultProps: typeof InkRippleProps };
  export { InkRipple };
  
  export default InkRipple;
  
  InkRipple.defaultProps = InkRippleProps;
  