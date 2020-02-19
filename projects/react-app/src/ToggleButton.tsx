import React, { useCallback, useState } from "react";
import Button, { defaultOptionsRules as buttonRules } from "./Button";

// import convertRulesToOptions from 'core/options/utils';
const convertRulesToOptions = (rules: { device: () => boolean, options: any }[]) => {
  return rules.reduce((options, rule) => {
    return {
      ...options,
      ...(rule.device() ? rule.options : {})
    };
  }, {});
};

export const defaultOptionsRules = buttonRules.concat([{
  device: function() {
    return true;
  },
  options: {
    hint: "Toggle button"
  }
}]);

const ToggleButton = (props: {
  height?: string,
  hint?: string,
  pressed?: boolean,
  defaultPressed?: boolean,
  pressedChange?: (e: boolean) => void,
  stylingMode?: string,
  text?: string,
  type?: string,
  width?: string
}) => {
  const [pressed, setPressed] = useState(() => ((props.pressed !== undefined) ? props.pressed : props.defaultPressed) || false);

  const onClickHandler = useCallback(function(e: any) {
    const newPressed = !(props.pressed !== undefined ? props.pressed : pressed);
    setPressed(newPressed);
    props.pressedChange!(newPressed);
  }, [pressed, props.pressed, props.pressedChange]);

  return view({
    // props
    props: {
      ...props,
      // state
      pressed: props.pressed !== undefined ? props.pressed : pressed
    },
    // internal state
    // listeners
    onClickHandler
  });
}

ToggleButton.defaultProps = {
  pressedChange: () => {},
  ...convertRulesToOptions(defaultOptionsRules)
};

function view(viewModel: any) {
  return (
    <Button
      height={viewModel.props.height}
      hint={viewModel.props.hint}
      stylingMode={viewModel.props.stylingMode}
      text={viewModel.props.text}
      type={viewModel.props.type}
      width={viewModel.props.width}
      pressed={viewModel.props.pressed}
      onClick={viewModel.onClickHandler} />
  );
}

export default ToggleButton;
