import React, { useCallback, useEffect, useState, useMemo } from "react";
import './Button.css';

// import convertRulesToOptions from 'core/options/utils';
const convertRulesToOptions = (rules: { device: () => boolean, options: any }[]) => {
  return rules.reduce((options, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {})
    };
  }, {});
};

export const defaultOptionsRules: { device: () => boolean, options: any }[] = [{
  device: function() {
    return true;
  },
  options: {
    text: "Push me!"
  }
}];

const Button = (props: {
  classNames?: Array<string>,
  elementAttr?: { [name: string]: any },
  height?: string,
  hint?: string,
  onClick?: (e: any) => void,
  pressed?: boolean,
  stylingMode?: string,
  text?: string,
  type?: string,
  width?: string
}) => {
  const [_hovered, _setHovered] = useState(false);
  const [_active, _setActive] = useState(false);

  const onPointerOver = useCallback(() => _setHovered(true), []);
  const onPointerOut = useCallback(() => _setHovered(false), []);
  const onPointerDown = useCallback(() => _setActive(true), []);
  const onPointerUp = useCallback(() => _setActive(false), []);

  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    return function cleanup() {
      document.removeEventListener("pointerup", onPointerUp);
    };
  });

  const onClickHandler = useCallback(function(e: any) {
    props.onClick!({ type: props.type, text: props.text });
  }, [props.type, props.text, props.onClick]);

  const style = useMemo(function() {
    return {
      width: props.width
    };
  }, [props.width]);

  const cssClasses = useMemo(function() {
    const classNames = ['dx-button'];

    if(props.stylingMode === 'outlined') {
      classNames.push('dx-button-mode-outlined');
    } else if(props.stylingMode === 'text') {
      classNames.push('dx-button-mode-text');
    } else {
      classNames.push('dx-button-mode-contained');
    }

    if(props.type === 'danger') {
      classNames.push('dx-button-danger');
    } else if(props.type === 'default') {
      classNames.push('dx-button-default');
    } else if(props.type === 'success') {
      classNames.push('dx-button-success');
    } else {
      classNames.push('dx-button-normal');
    }

    if(props.text) {
      classNames.push('dx-button-has-text');
    }

    if(_hovered) {
      classNames.push("dx-state-hover");
    }

    if(props.pressed || _active) {
      classNames.push("dx-state-active");
    }
    return classNames.concat(props.classNames || []).join(" ");
  }, [props.classNames, props.pressed, props.text, props.type, props.stylingMode, _hovered, _active]);

  return view({
    // props
    props,
    // state
    // internal state
    _hovered,
    _active,
    // listeners
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onClickHandler,
    // viewModel
    style,
    cssClasses
  });
};

Button.defaultProps = {
  onClick: () => {},
  ...convertRulesToOptions(defaultOptionsRules)
};

function view(viewModel: any) {
  return (
    <div
      className={viewModel.cssClasses}
      title={viewModel.props.hint}
      style={viewModel.style}
      {...viewModel.props.elementAttr}
      onPointerOver={viewModel.onPointerOver}
      onPointerOut={viewModel.onPointerOut}
      onPointerDown={viewModel.onPointerDown}
      onClick={viewModel.onClickHandler}>
      <div className="dx-button-content">
        <span className="dx-button-text">{viewModel.props.text}</span>
      </div>
    </div>
  );
}

export default Button;
