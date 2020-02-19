import React, { useCallback, useState, useMemo } from "react";
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

  const drawerCSS = useMemo(function() {
    return ["dx-drawer-panel"].concat((props.opened !== undefined ? props.opened : opened) ? "dx-state-visible" : "dx-state-hidden").join(" ");
  }, [opened, props.opened]);
  
  const style = useMemo(function() {
    return {
      width: props.width,
      height: props.height
    };
  }, [props.width, props.height]);

  return view({
    // state
    props: {
      ...props,
      // state
      opened: props.opened !== undefined ? props.opened : opened
    },
    // internal state
    // listeners
    onClickHandler,
    // viewModel
    drawerCSS,
    style
  });
}

Drawer.defaultProps = {
  openedChange: () => {}
};

function view(viewModel: any) {
  return (
    <div
      className="dx-drawer"
      title={viewModel.props.hint}
      style={viewModel.style}>
      <div className={viewModel.drawerCSS}>
        { viewModel.props.drawer }
      </div>
      <div
        className="dx-drawer-content"
        onClick={viewModel.onClickHandler}>
        { viewModel.props.children }
      </div>
    </div>
  );
}

export default Drawer;
