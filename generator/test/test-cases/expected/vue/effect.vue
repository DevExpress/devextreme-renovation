     
<script>
function view(model) {}
function subscribe(p, s, i) {
  return 1;
}
function unsubscribe(id) {
  return undefined;
}
export const WidgetInput = {
  p: {
    type: String,
    default() {
      return "10";
    }
  },
  s: {
    type: Number,
    default: undefined
  }
};

export default {
  props: WidgetInput,
  data() {
    return {
      i: 10,
      s_state: this.s !== undefined ? this.s : 10
    };
  },
  methods: {
    __restAttributes() {
      return {};
    },
    setupData() {
      const id = subscribe(
        this.p,
        (this.s !== undefined ? this.s : this.s_state),
        this.i
      );
      this.i = 15;
      return () => unsubscribe(id);
    }
  },
  created() {
    this.__destroyEffects = [];
  },
  mounted() {
    this.__destroyEffects[0] = this.setupData();
  }
};
</script>
