function viewModel() { }

function view() { }

import React, { useCallback } from 'react';

interface Component {
  type?: string,
  onClick?: () => void,
  clickHandler: () => any
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