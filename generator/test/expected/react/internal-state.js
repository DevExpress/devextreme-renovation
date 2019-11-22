export class Component {
    constructor(props) { 
        super(props);
        this.state = {
            hovered: false
        }
    }
    get hovered() { return this.state.hovered; }
    set hovered(hovered) { this.state({ hovered }); }
}

