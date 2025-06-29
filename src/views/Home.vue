<template>
    <v-card>
        <v-toolbar color="black">
            <v-toolbar-title>PostMinder</v-toolbar-title>
            <DropdownButton class="profile" />
        </v-toolbar>
        <v-tabs v-model="tab" bg-color="black">
            <v-tab value="post">Home</v-tab>
            <v-tab value="scheduled">Scheduled</v-tab>
            <v-tab value="aboutus">About Us</v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item value="post">
                <Post />
            </v-window-item>
            <v-window-item value="scheduled">
                <Scheduled />
            </v-window-item>
            <v-window-item value="aboutus">
                <AboutUs />
            </v-window-item>
        </v-window>
    </v-card>
</template>
  
<script>
import DropdownButton from "@/components/DropdownButton.vue";
import Post from "@/views/Post.vue";
import Scheduled from "@/views/Scheduled.vue";
import AboutUs from "@/views/AboutUs.vue"

export default {
    components: { DropdownButton, Post, Scheduled, AboutUs },
    data() {
        return {
            tab: null,
        };
    },
};
</script>
  
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.profile {
    border: 2px rgb(88, 87, 87) solid;
    border-radius: 50%;
    margin-top: 10px;
    margin-right: 10px;
}
</style>