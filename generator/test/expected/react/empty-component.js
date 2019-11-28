export default function Component({
  height,
  width
}) {
  return view1(viewModel1({
    height,
    width
  }));
}


function viewModel1(model) {
  return {
    height: model.height
  }
}

function view1(viewModel) {
  return <div style={{ height: viewModel.height }}>
    <span></span>
    <span></span>
  </div>
}
