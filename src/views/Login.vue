<template>
    <div id="container">
        <v-card class="px-10 py-10" width="450">
            <v-form v-model="valid">
                <v-row>
                    <v-col cols="12" align="center">
                        <h1>Login</h1>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-text-field class="inp" :rules="[rules.required, rules.usernameRules]" prepend-icon="mdi-account"
                            label="username" variant="outlined" v-model="username" type="text" @keyup.enter="login" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-text-field class="inp" :rules="[rules.required, rules.validPassword]"
                            prepend-icon="mdi-form-textbox-password" label="password" variant="outlined" v-model="password"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="showPassword ? 'text' : 'password'" @click:append-inner="showPassword = !showPassword"
                            @keyup.enter="login" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-btn class="w-100" :disabled="!valid" @click="login" color="blue" size="large">Login</v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <p>Don't have a account? <a href="/signup">Sign Up</a></p>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
        <LoginError v-model="showDialog" />
    </div>
</template>

<script>
import axios from 'axios'

import LoginError from '@/components/LoginError.vue'

export default {
    components: { LoginError },
    data() {
        return {
            valid: true,
            showPassword: false,
            username: '',
            password: '',
            showDialog: false,
            rules: {
                required: value => !!value || 'Field is required',
                usernameRules: v => (v && v.length <= 20) || 'Username should be under 20 characters',
                validPassword: v => v.length >= 8 || 'Password should be a minimum of 8 characters'
            }
        }
    },
    methods: {
        async login() {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                    username: this.username,
                    password: this.password
                }, { withCredentials: true })

                if (res.status === 200)
                    this.$router.push({ name: 'home' })
                this.username = ''
                this.password = ''
            } catch (error) {
                this.showDialog = true
            }


        },
    }
}
</script>

<style scoped>
#container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>