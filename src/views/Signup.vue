<template>
    <div id="container">
        <v-card class="px-10 py-5" width="450">
            <v-form v-model="valid" lazy-validation>
                <v-row>
                    <v-col align="center">
                        <h1>Sign Up</h1>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols=12>
                        <v-text-field :rules="[rules.required, rules.usernameRules]" prepend-icon="mdi-account"
                            label="username" variant="outlined" v-model="username" type="text" @keyup.enter="signup" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-text-field :rules="[rules.required, rules.validEmail]" prepend-icon="mdi-email" label="email"
                            variant="outlined" v-model="email" type="email" @keyup.enter="signup" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-text-field class="inp" :rules="[rules.required, rules.validPassword]"
                            prepend-icon="mdi-form-textbox-password" label="password" variant="outlined" v-model="password"
                            type="password" @keyup.enter="signup" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-text-field :rules="[rules.required, passwordMatchRule]" prepend-icon="mdi-form-textbox-password"
                            label="confirm password" variant="outlined" v-model="confirmPassword"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="showPassword ? 'text' : 'password'" @click:append-inner="showPassword = !showPassword"
                            @keyup.enter="signup" />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-btn class="w-100" :disabled="!valid" @click="signup" color="blue" size="large">Sign Up</v-btn>
                    </v-col>
                </v-row>

                <v-row><v-col>
                        <p>Already have a account? <a href="/login">Login</a></p>
                    </v-col></v-row>

            </v-form>
        </v-card>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    computed: {
        passwordMatchRule() {
            return () => this.password === this.confirmPassword || 'Password much match'
        }
    },
    data() {
        return {
            valid: true,
            showPassword: false,
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            rules: {
                required: v => !!v || 'Field is required',
                usernameRules: v => (v && v.length <= 20) || 'Username should be under 20 characters',
                validEmail: v => /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "E-mail must be valid",
                validPassword: v => v.length >= 8 || 'Password should be a minimum of 8 characters'
            }
        }
    },
    methods: {
        async signup() {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
                username: this.username,
                email: this.email,
                password: this.password
            }, { withCredentials: true })

            this.username = ''
            this.email = ''
            this.password = ''
            this.confirmPassword = ''
            this.$router.push({ name: "login" })
        }
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