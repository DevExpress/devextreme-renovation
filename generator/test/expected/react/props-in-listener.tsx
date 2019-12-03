function viewModel() { }

function view() { }

import React, { useCallback } from 'react';

export function Component(props: {
  type?: string,
  onClick?: () => void
}) {
  const clickHandler = useCallback(() => {
    props.onClick!({
      type: props.type
    })
  }, null);

  return view(viewModel({
    ...props,
    clickHandler
  }));
}