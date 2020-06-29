 <template>
  <div ref="childRef">
    <div ref="nullableRef"></div>
  </div>
</template>
<script>
const Props = {
  childRef: {
    type: Function,
    required: true
  },
  nullableRef: {
    type: Function
  },
  state: {
    type: Number
  }
};

export default {
  props: Props,
  methods: {
    __restAttributes() {
      return {};
    },
    forwardRef_childRef(ref) {
      this.$refs.childRef = ref;
    },
    forwardRef_nullableRef(ref) {
      this.$refs.nullableRef = ref;
    },
    props() {
      return {
        childRef: this.$refs.childRef,
        nullableRef: this.$refs.nullableRef,
        state: this.state
      };
    },
    __forwardRef() {
      this.childRef(this.$refs.childRef);
      this.nullableRef(this.$refs.nullableRef);
    }
  },
  mounted() {
    this.__forwardRef();
  },
  updated() {
    this.__forwardRef();
  }
};
</script>
