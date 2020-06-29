<template>
    <div />
</template>

<script>
const WidgetInput = {
    columns: {
        type: Array
    },
    someArray: {
        type: Array
    }
};

export default {
    props: WidgetInput,
    methods: {
        __getColumns() {
            return (this.columns || this.__getNestedFromChild("DxColumn"))?.map(el =>
                typeof el === "string" ? el : el.name
            );
        },
        __isEditable() {
            return (
                this.gridEditing || this.__getNestedFromChild("DxGridEditing")?.[0]
            )?.editEnabled;
        },
        __restAttributes() {
            return {};
        },
        __getNestedFromChild(typeName) {
            const children = this.$options._renderChildren || [],
                nestedComponents = children.filter(child => child.tag === typeName);
            return nestedComponents.map(child => child.data?.attrs || {});
        },
        props() {
            return {
                columns: (this.columns || this.__getNestedFromChild("DxColumn")),
                gridEditing: (this.gridEditing || this.__getNestedFromChild("DxGridEditing")?.[0]),
                someArray: (this.someArray || this.__getNestedFromChild("DxSomeArray"))
            };
        }
    }
};
</script>
