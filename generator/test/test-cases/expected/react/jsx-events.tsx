const f = () => null;
function view() { 
    return (
        <div
            onPointerOver={f}
            onPointerOut={f}
            onPointerDown={f}
            onClick={f}
            unknown={f}
        ></div>)
}