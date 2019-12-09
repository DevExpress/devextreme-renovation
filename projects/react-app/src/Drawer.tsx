import React, { useCallback, useState } from "react";
import './Drawer.css';

const Drawer = (props: { 
  height?: string,
  hint?: string,
  opened?: boolean,
  defaultOpened?: boolean,
  openedChange?: (e: boolean) => void,
  width?: string,
  drawer?: React.ReactNode,
  children?: React.ReactNode
}) => {
  const [opened, setOpened] = useState(() => (props.opened !== undefined) ? props.opened : props.defaultOpened);

  const onClickHandler = useCallback(() => {
    setOpened(false);
    props.openedChange!(false);
  }, [opened, props.opened, props.openedChange]);

  return view(viewModel({
    // state
    ...props,
    // state
    opened: props.opened !== undefined ? props.opened : opened,
    // internal state
    // listeners
    onClickHandler
  }));
}

Drawer.defaultProps = {
  openedChange: () => {}
};

function viewModel(model: any) {
  return {
    drawerCSS: ["dx-drawer-panel"]
      .concat(model.opened ? "dx-state-visible" : "dx-state-hidden")
      .join(" "),
    style: {
      width: model.width,
      height: model.height
    },
    ...model
  };
}

function view(viewModel: any) {
  return (
    <div
      className="dx-drawer"
      title={viewModel.hint}
      style={viewModel.style}>
      <div className={viewModel.drawerCSS}>
        { viewModel.drawer }
      </div>
      <div
        className="dx-drawer-content"
        onClick={viewModel.onClickHandler}>
        { viewModel.children }
      </div>
    </div>
  );
}

export default Drawer;
