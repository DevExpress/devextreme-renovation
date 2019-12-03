function view() { }
function viewModel() { }

export default function Component({
    height = 10,
    onClick = () => null
}) {


    function getHeight() {
        onClick();
        return height;
    }

    return view(viewModel({
        height
    }));
}
