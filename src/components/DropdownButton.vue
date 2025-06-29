<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-account" color="indigo" v-bind="props" />
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item :title="username" subtitle="User">
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item>
            <v-tooltip text="Sign out of the application only">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="signOut" color="red">Sign Out</v-btn>
              </template>
            </v-tooltip>
          </v-list-item>
          <v-list-item>
            <v-tooltip text="Sign out of application as well as facebook">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" @click="signOutAll" color="red">Sign Out Everywhere</v-btn>
              </template>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import axios from 'axios';
import { getCookieValue } from '@/helpers/cookie_helper.js'
import { parseJwt } from '@/helpers/jwt_helper';


export default {
  data: () => ({
    menu: false,
    username: '',
  }),
  mounted() {
    const accessToken = getCookieValue('POSTMINDER_ACCESS_TOKEN')
    const payload = parseJwt(accessToken)
    this.username = payload.username

  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async signOut() {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, { withCredentials: true })
      if (res.status === 200) this.$router.push({ name: "login" });
      else window.location.reload()
    },
    async signOutAll() {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fb/logout`, { withCredentials: true })
      if (res.status === 200) {
        const res2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, { withCredentials: true });
        if (res2.status == 200) {
          this.$router.push({ name: "login" });
        }
        else window.location.reload()
      }
      else window.location.reload()
    },
  },
}
</script>