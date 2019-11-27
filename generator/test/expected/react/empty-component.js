export default function Component({
  height
}) {
  return view1(viewModel1({
    height
  }));
}


function viewModel1(model) { 
  return {
      height: model.height
  }
}

function view1(viewModel) { 
  return <div style={{height: viewModel.height}}></div>
}