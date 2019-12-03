function viewModel() {}

function view() { }

import React from "react";

export function Component(props: {}) {
  function method(a:number) { 
    return 10 + a;
  }

  return view(viewModel({
    ...props
  }));
}
