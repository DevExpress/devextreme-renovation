function viewModel() { }

function view() { }

import * as Preact from "preact";
import { useCallback } from "preact/hooks";

interface Component {
  type?: string,
  onClick?: () => void,
  clickHandler: () => void
}

export function Component(props: {
  type?: string,
  onClick?: () => void
}) {
  const clickHandler = useCallback(() => {
    props.onClick!({
      type: props.type
    })
  }, [props.onClick, props.type]);

  return view(viewModel({
    ...props,
    clickHandler
  }));
}