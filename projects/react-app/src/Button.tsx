import React, { useCallback, useEffect, useState } from "react";
import './Button.css';

const Button = ({
  classNames,
  height,
  hint,
  onClick = () => {},
  pressed,
  stylingMode,
  text,
  type,
  width
}: {
  classNames?: Array<string>,
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

  const onClickHandler = useCallback(() => onClick({ type: type, text: text }), [type, text, onClick]);

  return view(viewModel({
    // props
    classNames,
    height,
    hint,
    pressed,
    stylingMode,
    text,
    type,
    width,
    // state
    // internal state
    _hovered,
    _active,
    // listeners
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onClickHandler
  }));
};

function getCssClasses(model: any) {
  const classNames = ['dx-button'];

  if (model.stylingMode === 'outlined') {
    classNames.push('dx-button-mode-outlined');
  } else if (model.stylingMode === 'text') {
    classNames.push('dx-button-mode-text');
  } else {
    classNames.push('dx-button-mode-contained');
  }

  if (model.type === 'danger') {
    classNames.push('dx-button-danger');
  } else if (model.type === 'default') {
    classNames.push('dx-button-default');
  } else if (model.type === 'success') {
    classNames.push('dx-button-success');
  } else {
    classNames.push('dx-button-normal');
  }

  if (model.text) {
    classNames.push('dx-button-has-text');
  }

  if (model._hovered) {
    classNames.push("dx-state-hover");
  }

  if (model.pressed || model._active) {
    classNames.push("dx-state-active");
  }
  return classNames.concat(model.classNames).join(' ');
}

function viewModel(model: any) {
  return {
    cssClasses: getCssClasses(model),
    style: {
      width: model.width
    },
    ...model
  };
}

function view(viewModel: any) {
  return (
    <div
      className={viewModel.cssClasses}
      title={viewModel.hint}
      style={viewModel.style}
      onPointerOver={viewModel.onPointerOver}
      onPointerOut={viewModel.onPointerOut}
      onPointerDown={viewModel.onPointerDown}
      onClick={viewModel.onClickHandler}>
      <div className="dx-button-content">
        <span className="dx-button-text">{viewModel.text}</span>
      </div>
    </div>
  );
}

export default Button;
