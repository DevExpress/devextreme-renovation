const f = () => null;
function view() { 
    return (
        <div
            pointerover={f}
            pointerout={f}
            pointerdown={f}
            click={f}
            unknown={f}
        >
    </div>)
}