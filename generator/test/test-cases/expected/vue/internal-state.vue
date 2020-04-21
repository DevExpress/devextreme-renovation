<script>
function view() {}

export default {
  data(){
      return {
        _hovered: false
      };
  },
  methods: {
    updateState(){
        this._hovered=!this._hovered;
    },
    restAttributes() {
      return {};
    }
  }
};
</script>
