function viewModel() {}

function view() {}

export default function Component({
  height
}) {
  return view(viewModel({
    height
  }));
}
