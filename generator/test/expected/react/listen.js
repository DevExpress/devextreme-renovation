export class Component {
    constructor(props) { 
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
    }

    onClick(e) { 

    }

    onPointerMove(a="a", b=0, c = true) { }
}
  