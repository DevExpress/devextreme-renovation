function viewModel() {}

function view() {}

export default function Component({}) {
  function method(a) { 
    return 10 + a;
  }

  return view(viewModel({
    _state
  }));
}
