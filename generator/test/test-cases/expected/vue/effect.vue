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
  },
  defaultS: {
    type: Number,
    default() {
      return 10;
    }
  }
};

export default {
  props: WidgetInput,
  model: {
    prop: "s",
    event: "update:s"
  },
  data() {
    return {
      i: 10,
      s_state: this.defaultS
    };
  },

  watch: {
    p: ["__schedule_setupData"],
    s: ["__schedule_setupData"],
    s_state: ["__schedule_setupData"],
    i: ["__schedule_setupData"]
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
    },

    sChange(...args){
      this.$emit("update:s", ...args);
    },

    __schedule_setupData() {
      this.__scheduleEffects[0] = () => {
        this.__destroyEffects[0] && this.__destroyEffects[0]();
        this.__destroyEffects[0] = this.setupData();
      };
    }
  },
  created() {
    this.__destroyEffects = [];
    this.__scheduleEffects = [];
  },
  mounted() {
    this.__destroyEffects[0] = this.setupData();
  },
  updated() {
    this.__scheduleEffects.forEach((_, i) => {
      this.__scheduleEffects[i] && this.__scheduleEffects[i]();
    });
  },
  destroyed() {
    this.__destroyEffects.forEach((_, i) => {
      this.__destroyEffects[i] && this.__destroyEffects[i]();
    });
    this.__destroyEffects = null;
  }
};
</script>
