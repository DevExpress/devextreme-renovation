   <template>
  <div ref="childRef"></div>
</template>
            <script>
const Props = {
  childRef: {
    type: Function,
    required: true
  }
};

export default {
  props: Props,
  methods: {
    __restAttributes() {
      return {};
    },
    props() {
      return { childRef: this.$refs.childRef };
    },
    __forwardRef() {
      this.childRef(this.$refs.childRef);
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
