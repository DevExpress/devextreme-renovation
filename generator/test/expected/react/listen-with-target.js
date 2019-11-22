export class Component {
    constructor(props) { 
        super(props);
        this.onPointerUp = this.onPointerUp.bind(this);
    }

    onPointerUp() {
      
    }

    componentDidMount() {
        document.addEventListener("pointerup", this.onPointerUp);
    }
}
  