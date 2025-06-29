<template>
    <v-dialog v-model="showdeletedialog" width="auto">
        <v-card style="overflow: hidden" class="px-5 py-5">
            <v-row>
                <v-col cols="12">
                    Are You Sure, You Want to DELETE this Scheduled Post !!
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <v-btn class="w-100" color="red" variant="elevated" @click.stop="deletePost">Yes</v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn class="w-100" color="green" variant="elevated" @click.prevent="closeDialog">No</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>
  
<script>

export default {
    props: {
        job: String,
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {
        showdeletedialog: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
    methods: {
        deletePost() {
            this.$emit('deletePost', {})
            this.showdeletedialog = false;
        },
        closeDialog() {
            this.showdeletedialog = false;
        },
    },
};
</script>
  