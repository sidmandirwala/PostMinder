<template>
  <div class="d-flex justify-center align-center my-5">
    <h3>Your Scheduled Posts :</h3>
  </div>
  <ScheduledCard v-for="post in posts" :key="post.jobid" :post="post" :color="color" />
</template>

<script>
import axios from 'axios';

import io from 'socket.io-client';

import ScheduledCard from '@/components/ScheduledCard.vue';

export default {
  components: { ScheduledCard },
  async mounted() {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/insta/scheduled`, { withCredentials: true })
    this.posts = res.data
  },
  created() {
    const socket = io('//localhost:3000');
    socket.on('scheduled_posts_changes', (payload) => {
      this.posts = payload;
    });
  },
  data() {
    return {
      posts: [],
      username: '',
      color: '',
    }
  },
}
</script>
