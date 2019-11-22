import React, { useCallback, useEffect, useState } from "react";
import './Button.css';

function getCssClasses(model) {
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

function viewModel(model) {
  return {
    cssClasses: getCssClasses(model),
    style: {
      width: model.width
    },
    ...model
  };
}

function view(viewModel) {
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

export default function Button({
  classNames,
  height,
  hint,
  onClick = () => {},
  pressed,
  stylingMode,
  text,
  type,
  width
}) {

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

  const onClickHandler = useCallback(() => onClick({ type, text }), [type, text, onClick]);

  return view({ 
    // listeners
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onClickHandler,
    ...viewModel({
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
      _active
    })
  });
}

export class ButtonComponent extends React.Component {
  static defaultProps = {
    onClick: () => { }
  };
  constructor(props) {
    super(props);
    this.state = {};

    this.onPointerOver = this.onPointerOver.bind(this);
    this.onPointerOut = this.onPointerOut.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);

    this.state._hovered = false;
    this.state._active = false;
  }

  get onClick() { return this.props.onClick || (() => { }); }

  get _hovered() { return this.state._hovered }
  set _hovered(_hovered) { this.setState({ _hovered }); }
  get _active() { return this.state._active }
  set _active(_active) { this.setState({ _active }); }

  onPointerOver() {
    this._hovered = true;
  }

  onPointerOut() {
    this._hovered = false;
  }

  onPointerDown() {
    this._active = true;
  }

  onPointerUp() {
    this._active = false;
  }

  onClickHandler() {
    this.onClick({ type: this.props.type, text: this.props.text });
  }

  componentDidMount() {
    document.addEventListener("pointerup", this.onPointerUp);
  }

  componentWillUnmount() {
    document.removeEventListener("pointerup", this.onPointerUp);
  }

  viewModel(model) {
    return {
      cssClasses: getCssClasses(model),
      style: {
        width: model.width
      },
      ...model
    };
  }

  view(viewModel) {
    return (
      <div
        className={viewModel.cssClasses}
        title={viewModel.hint}
        style={viewModel.style}
        onPointerOver={this.onPointerOver}
        onPointerOut={this.onPointerOut}
        onPointerDown={this.onPointerDown}
        onClick={this.onClickHandler}>
        <div className="dx-button-content">
          <span className="dx-button-text">{viewModel.text}</span>
        </div>
      </div>
    );
  }

  getModel() {
    return { ...this.props, ...this.state };
  }

  render() {
    return this.view(this.viewModel(this.getModel()));
  }
};