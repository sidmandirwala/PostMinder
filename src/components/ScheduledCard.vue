<template>
    <v-container>
        <v-card :color="post.is_posted ? 'green-darken-4' : 'grey-darken-3'" class="px-5 py-5">
            <v-row>
                <v-col cols="1">
                    <label for="">Image :</label>
                </v-col>
                <v-col cols="5">
                    <v-btn variant="flat" :disabled="post.is_posted" @click="viewImage">Click Here to view Image</v-btn>
                </v-col>
                <v-col cols="1">
                    <label for="">Time :</label>
                </v-col>
                <v-col cols="3">
                    <v-text-field :disabled="!textFieldEnabled" v-model="this.time" variant="solo" />
                </v-col>
                <v-col cols="2">
                    <v-btn :disabled="post.is_posted" icon="mdi-pencil" class="ml-10 mr-4" @click="enableEditing"></v-btn>
                    <v-btn :disabled="textFieldEnabled" icon="mdi-delete" @click.stop="deleteBtn"></v-btn>
                    <DeletePopup v-model="showdeletedialog" @deletePost="deletepost" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="1">
                    <label for="">Caption :</label>
                </v-col>
                <v-col cols="9">
                    <v-textarea :disabled="!textFieldEnabled" height="auto" width="700" class="overflow-auto" variant="solo"
                        v-model="this.caption" />
                </v-col>
                <v-col cols="2">
                    <v-row><v-btn class="mb-5 mt-4 w-75" v-show="textFieldEnabled" @click="newdata">Save</v-btn></v-row>
                    <v-row><v-btn class="w-75" v-show="textFieldEnabled" @click="editingDisable">Cancel</v-btn></v-row>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
  
<script>
import axios from "axios";

import DeletePopup from "@/components/DeletePopup.vue";
export default {
    components: { DeletePopup },
    props: ["post"],
    data() {
        return {
            showdeletedialog: false,
            textFieldEnabled: false,
            time: this.formatDateTime(this.post.time),
            jobid: this.post.jobid,
            caption: this.post.caption,
        };
    },
    methods: {
        async deleteBtn() {
            if (this.post.is_posted)
                await this.deletepost()
            else
                this.showdeletedialog = true
        },
        async newdata() {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/insta/scheduled/update`, {
                jobid: this.post.jobid,
                imageurl: this.post.imageurl,
                caption: this.caption,
                time: this.reverseFormatDateTime(this.time),
            }, { withCredentials: true });
            this.textFieldEnabled = false;
        },
        async deletepost() {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/insta/scheduled/delete`, {
                jobid: this.post.jobid,
            }, { withCredentials: true });
        },
        editingDisable() {
            this.caption = this.post.caption;
            this.time = this.formatDateTime(this.post.time);
            this.textFieldEnabled = false;
        },
        enableEditing() {
            this.textFieldEnabled = true;
        },
        viewImage() {
            window.open(this.post.imageurl, "_blank").focus();
        },
        formatDateTime(value) {
            if (value) {
                const date = new Date(value);
                const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                };
                return date.toLocaleString("en-US", options);
            }
            return "";
        },
        reverseFormatDateTime(value) {
            if (value) {
                const dateRegex = /(\w+\s\d{1,2},\s\d{4})\sat\s(\d{1,2}):(\d{2})/;
                const [, dateString, hours, minutes] = value.match(dateRegex);

                const monthNames = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ];
                const [month, day, year] = dateString.split(" ");

                const utcDate = new Date(
                    Date.UTC(
                        parseInt(year),
                        monthNames.indexOf(month),
                        parseInt(day),
                        parseInt(hours),
                        parseInt(minutes)
                    )
                );
                const adjustedUTCDate = new Date(
                    utcDate.getTime() - (5 * 60 + 30) * 60000
                );
                return adjustedUTCDate.toISOString();
            }
            return "";
        },
    },
};
</script>
  