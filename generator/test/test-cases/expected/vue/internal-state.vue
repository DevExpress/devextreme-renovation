<script>
function view() {}

export default {
  data(){
      return {
        internal_state__hovered: false
      };
  },
  methods: {
    updateState(){
        this.internal_state__hovered=!this.internal_state__hovered;
    },
    restAttributes() {
      return {};
    }
  }
};
</script>
