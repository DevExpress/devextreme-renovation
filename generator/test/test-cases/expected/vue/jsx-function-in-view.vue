<template>
    <div >
        <template v-if="loading">{{loadingJSX(__loadingProps())}}</template>
        <template v-else>{{infoJSX(greetings)}}</template>
    </div>
</template>

<script>
    export const WidgetInput = {
        loading: {
            type: Boolean,
            default(){
                return true
            }
        },
        greetings: {
            type: String,
            default(){
                return "Hello"
            }
        }
    }

    export default {
        props: WidgetInput,
        methods: {
            __loadingProps(){
                return {text:"Loading..."};
            },
            __restAttributes(){
                return {}
            }
        }
    }
</script>