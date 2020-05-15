<template>
 <div>
    <dx-app/>
   
   <button-with-template
      text="With Template"
    >
    <template #template="data">
        <div v-bind:style="{border: '1px solid blue'}">
          {{data.text+"!"}}
        </div>
    </template>

   </button-with-template><button-with-template
      text="Without Template"
    />
 </div>
</template>
<script>

import DxApp from "../../../../components/app.tsx";
import ButtonWithTemplate from "../../../../components/button-with-template.tsx"

export default {
  components: {
    DxApp,
    ButtonWithTemplate
  },

  data() {
   return {};
  },
  methods: {
   
  }
};
</script>
