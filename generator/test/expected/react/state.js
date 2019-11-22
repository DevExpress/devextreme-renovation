
export class Component {
    get pressed() {
        return "pressed" in this.props ? this.props.pressed : this.state.pressed;
    }
    
    set pressed(pressed) {
        this.setState({ pressed });
        this.pressedChange(pressed);
    }
    
    get pressedChange() {
        return this.props.pressedChange || (() => { });
    }
}

