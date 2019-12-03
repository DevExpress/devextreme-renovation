function viewModel() {}

function view() {}

export function Component(props: {}) {
  function method(a:number) { 
    return 10 + a;
  }

  return view(viewModel({
    ...props
  }));
}
