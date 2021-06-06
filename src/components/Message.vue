<template>
  <div class="message">
    <span v-if="!sender">{{ name }}</span>
    <div class="flex" :class="sender ? 'flex-row-reverse' : ''">
      <Avatar class="mt-1" :src="photoUrl" />
      <div v-if="!pic" class="text sm:w-2/4" :class="sender ? 'bg-green-800' : 'bg-gray-700'">
        <slot />
      </div>
      <div v-else class="showpic sm:w-2/4">
        <img :src="pic" alt="">
      </div>
      <div v-if="loading" class="update">
        <div class="progress">
          <div class="progressBar"></div>
        </div>
        <span>{{progress}}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from './Avatar.vue'
export default {
  components: { Avatar },
  props: {
    name: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    sender: { type: Boolean, default: false },
    pic:{ type: String, default: '' },
    loading: { type: Boolean, default: false },
    progress:{ type: String, default: '' },
  }
}
</script>
<style scoped>
.showpic{
  max-height: 150px;
}
.showpic img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.progress{
  width: 150px;
  height: 10px;
  border: 3px solid rgba(255, 255, 255, 0.774);
  border-radius: 12px;
}
.progressBar{
  width: 50%;
  height: 100%;
  background: rgb(21, 192, 15);
  border-radius: 12px;
}
</style>