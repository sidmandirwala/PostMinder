<template>
    <v-dialog v-model="showDialog" width="auto">
        <v-card>
            <v-card-text> Incorrect Username / Password </v-card-text>
            <v-card-actions>
                <v-btn color="red" variant="elevated" block @click.stop="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    computed: {
        showDialog: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit("update:modelValue", value)
            }
        }
    },
    methods: {
        closeDialog() {
            this.showDialog = false;

        },
    },
};
</script>
