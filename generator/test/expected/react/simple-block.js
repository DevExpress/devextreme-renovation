function viewModel() {}

function view() {}

export function Component({}) {
  function method(a) { 
    return 10 + a;
  }

  return view(viewModel({
  }));
}
