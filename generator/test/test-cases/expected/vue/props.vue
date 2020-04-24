<script>
function view(model) {}
const WidgetInput = {
  height: {
    type: Number,
    default() {
      return 10;
    }
  }
};
export default {
  props: WidgetInput,
  methods: {
    getHeight() {
      this.$emit("on-click", 10);
      this.$emit("on-click", 11);
      return this.height;
    },
    __restAttributes() {
      return {};
    }
  }
};
</script>
