<template>
    <v-card id="main">
        <br />
        <h3>Log in with Facebook</h3>
        <div>
            <br />
            <div id="center">
                <v-btn v-if="facebookUserAccessToken" @click="logOutOfFB" color="success">Log out of
                    Facebook</v-btn>
                <v-btn v-else @click="logInToFB" color="success">Login with Facebook</v-btn>
            </div>
            <br />
            <div v-if="facebookUserAccessToken">
                <h3>Post to Instagram</h3>

                <v-form v-model="valid">
                    <v-row>
                        <v-col cols="10" class="ml-5">
                            <v-file-input :rules="[fileRule]" show-size counter clearable accept="image/jpg, image/jpeg"
                                label="File input" variant="outlined" ref="file" @change="handleFileUpload()"
                                class="imageurl"></v-file-input>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="10" class="ml-5">
                            <v-text-field prepend-icon="mdi-format-text" variant="outlined" required label="Caption"
                                v-model="caption"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="ml-5">
                            <v-text-field prepend-icon="mdi-calendar" type="datetime-local" v-model="dateTime"
                                variant="outlined" class="caption" />

                        </v-col>
                    </v-row>

                    <v-btn :disabled="loading || !valid" :loading="loading" class="ml-15 my-5 px-10" color="success"
                        size="large" @click="shareInstagramPost">Schedule</v-btn>
                    <br />
                </v-form>
            </div>
        </div>
    </v-card>
</template>

<script>
import axios from "axios";

export default {
    computed: {
        fileRule() {
            return () => !!(this.$refs.file.files[0]) || 'File is Required'
        }
    },
    data() {
        return {
            valid: false,
            file: '',
            facebookUserAccessToken: false,
            inputValue: "",
            caption: "",
            tab: null,
            numberValue: 1,
            dateTime: '',
            loading: false,
            rules: {
                required: value => !!value || 'Field is required',
            }
        };
    },
    async mounted() {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fb/isLogin`, { withCredentials: true })
        if (res.status === 200) { this.facebookUserAccessToken = true }
        else if (res.status === 202) { this.facebookUserAccessToken = false }
    },
    methods: {
        async logInToFB() {
            await window.FB.login((response) => {
                this.facebookUserAccessToken = true
                axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/fb/login`, {
                    short_lived_token: response.authResponse?.accessToken
                }, { withCredentials: true })
            }, {
                scope: "email,pages_show_list,business_management,instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,instagram_manage_messages,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts",
            })
        },
        async logOutOfFB() {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fb/logout`, { withCredentials: true })
            if (res.status === 200) this.facebookUserAccessToken = false;
        },
        handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },
        async shareInstagramPost() {
            this.loading = !this.loading

            const formData = new FormData();
            formData.append("image", this.file)
            formData.append("caption", this.caption)
            formData.append("timestamp", this.dateTime)
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/insta/schedule`, formData,
                { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true })

            this.loading = !this.loading
            this.$refs.file.reset()
            this.caption = ''
        },
    },
}
</script>

<style scoped>
#center {
    display: flex;
    justify-content: center;
}

h3 {
    margin: 10px;
}

#schedule {
    margin: 10px;
    width: 200px;
}
</style>

<!-- <div id="posts">
    <h4>Number of posts:</h4>
    <button id="minus" @click="decreaseValue">-</button>
    <input id="inputno" type="number" disabled min="1" max="10" v-model="numberValue" />
    <button id="plus" @click="increaseValue">+</button>
</div> -->

<!-- // increaseValue() {
    //     if (this.numberValue < 10) this.numberValue++;
    // },
    // decreaseValue() {
    //     if (this.numberValue > 1) {
    //         this.numberValue--;
    //     }
    // }, -->

<!-- /* #minus,
#plus {
    padding: 10px;
    margin: 10px;
    border-radius: 30px;
    background-color: black;
    border: 2px rgba(255, 255, 255, 0.463) solid;
} */

/* #inputno {
    width: 45px;
    color: aliceblue;
    padding: 10px;
    border-radius: 10px;
    border: 2px white solid;
} */

/* #posts {
    border: 2px rgb(88, 87, 87) solid;
    border-radius: 20px;
    padding: 20px;
    width: 200px;
    margin-bottom: 20px;
    margin-left: 20px;
} */ -->