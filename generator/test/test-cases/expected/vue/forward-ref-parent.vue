<template>
  <Child
    :childRef="forwardRef_child"
    :nullableRef="forwardRef_nullableRef"
    :state="innerState"
  />
</template>
<script>
import Child from "./forward-ref-child";
const Props = {
  nullableRef: {
    type: Function,
  },
};
export const DxRefOnChildrenParent = {
  components: {
    Child,
  },
  props: Props,
  data() {
    return {
      innerState: 10,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {};
    },
  },
  watch: {
    nullableRef: ["__schedule_effect"],
  },
  methods: {
    forwardRef_child(ref) {
      if (arguments.length) {
        this.$refs.child = ref;
      }
      return this.$refs.child;
    },
    forwardRef_nullableRef(ref) {
      if (arguments.length) {
        this.$refs.nullableRef = ref;
        this.nullableRef?.(ref);
      }
      return this.$refs.nullableRef;
    },
    __effect() {
      this.$refs.child.innerHTML = "Ref from child";
      const html = this.nullableRef?.()?.innerHTML;
    },
    __forwardRef() {},
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
  beforeDestroy() {
    this.__destroyEffects.forEach((_, i) => {
      this.__destroyEffects[i] && this.__destroyEffects[i]();
    });
    this.__destroyEffects = null;
  },
};
export default DxRefOnChildrenParent;
</script>
