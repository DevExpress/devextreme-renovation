function view(model: Widget) {

}
const WidgetInput = {
    height: {
        type: Number,
        default() {
            return 10
        }
    }
}
export default {
    props: WidgetInput,
    methods: {
        getHeight(): number {
            this.$emit("on-click", 10);
            return this.height;
        },
        restAttributes(): any {
            return {}
        }
    }
}