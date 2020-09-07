<template>
  <div>
    {{(viewModel.props.Test===undefined||viewModel.props.Test===null?undefined:viewModel.props.Test.value)}}
  </div>
</template>
<script>
export const ImportProps = {
  Test: {
    type: Object,
  },
};

export const DxImport = {
  props: ImportProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { Test: this.Test };
    },
  },
};
export default DxImport;
</script>
