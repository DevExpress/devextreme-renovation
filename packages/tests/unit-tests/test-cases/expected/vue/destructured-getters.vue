<template>
  <div></div>
</template>
<script>
const WidgetProps = {
  someProp: {
    type: String,
    default() {
      return "";
    },
  },
  type: {
    type: String,
    default() {
      return "";
    },
  },
};
export const DxWidget = {
  name: "Widget",
  props: WidgetProps,
  data() {
    return {
      someState: "",
    };
  },
  computed: {
    __someObj() {
      return { stateField: this.someState, propField: this.someProp };
    },
    __objectFromDestructured() {
      const { propField, stateField } = this.__someObj;
      return { stateField, propField };
    },
    __arrayFromObj() {
      const { propField, stateField } = this.__someObj;
      return [stateField, propField];
    },
    __someObj2() {
      return {
        stateField: [this.someState, this.someProp],
        propField: this.__newGetter,
      };
    },
    __arrayFromObj2() {
      const { stateField } = this.__someObj2;
      return [stateField];
    },
    __newGetter() {
      return this.props.someProps2;
    },
    __arrayFromArr() {
      const [stateField, propField] = this.__arrayFromObj;
      return [stateField, propField];
    },
    __someMethod() {
      const { propField, stateField } = this.__objectFromDestructured;
      return { stateField, propField };
    },
    __someMethod3() {
      const something = this.__someObj;
      return something;
    },
    __emptyMethod() {
      return "";
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { someProp: this.someProp, type: this.type };
    },
  },
  methods: {
    __someMethod2() {
      const state = this.__someObj.stateField;
      const prop = this.__someObj.propField;
    },
    __getValue() {
      const { someProp } = this.props;
      return someProp;
    },
    changeState(newValue) {
      this.someState = newValue;
    },
  },
};
export default DxWidget;
</script>
