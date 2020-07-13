<template>
  <Child
    :childRef="forwardRef_child"
    :nullableRef="forwardRef_nullableRef"
    :state="state"
  />
</template>
<script>
import Child from "./forward-ref-child";

const Props = {
  nullableRef: {
    type: Function,
  },
};

export default {
  components: {
    Child,
  },
  props: Props,
  data() {
    return {
      state: 10,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { nullableRef: this.$refs.nullableRef };
    },
  },
  watch: {
    nullableRef: ["__schedule_effect"],
  },
  methods: {
    forwardRef_child(ref) {
      this.$refs.child = ref;
    },
    forwardRef_nullableRef(ref) {
      this.$refs.nullableRef = ref;
    },
    __effect() {
      this.$refs.child.innerHTML = "Ref from child";
      const html = this.$refs.nullableRef?.innerHTML;
    },
    __forwardRef() {
      this.nullableRef(this.$refs.nullableRef);
    },
    __schedule_effect() {
      this.__scheduleEffect(0, "__effect");
    },
    __scheduleEffect(index, name) {
      if (!this.__scheduleEffects[index]) {
        this.__scheduleEffects[index] = () => {
          this.__destroyEffects[index] && this.__destroyEffects[index]();
          this.__destroyEffects[index] = this[name]();
          this.__scheduleEffects[index] = null;
        };
        this.$nextTick(
          () => this.__scheduleEffects[index] && this.__scheduleEffects[index]()
        );
      }
    },
  },
  created() {
    this.__destroyEffects = [];
    this.__scheduleEffects = [];
  },
  mounted() {
    this.__forwardRef();
    this.__destroyEffects[0] = this.__effect();
  },
  updated() {
    this.__forwardRef();

    this.__scheduleEffects.forEach((_, i) => {
      this.__scheduleEffects[i] && this.__scheduleEffects[i]();
    });
  },
  destroyed() {
    this.__destroyEffects.forEach((_, i) => {
      this.__destroyEffects[i] && this.__destroyEffects[i]();
    });
    this.__destroyEffects = null;
  },
};
</script>
