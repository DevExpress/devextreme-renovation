 <script>
function view(model) {}
const WidgetInput = {
  size: {
    default() {
      return { width: 10, height: 20 };
    }
  },
  type: {
    type: String,
    default() {
      return "type";
    }
  }
};
export default {
  props: WidgetInput,
  methods: {
    __getHeight() {
      return this.size.height;
    },
    __type() {
      const { type } = this;
      return type;
    },
    __restAttributes() {
      return {};
    }
  }
};
</script>