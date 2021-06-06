<template>
  <div class="container-sm mt-20 mx-auto">
    <div class="mx-5">
      <div class="message" v-for="{ id, text, userPhotoURL, userName, userId,imgurl } in messages" :key="id">
        <span v-if="!userId === user?.uid">{{ userName }}</span>
        <div class="flex" :class="userId === user?.uid ? 'flex-row-reverse' : ''">
          <img class="avatar mt-1" :src="userPhotoURL" />
          <div v-if="!imgurl" class="text sm:w-2/4" :class="userId === user?.uid ? 'bg-green-800' : 'bg-gray-700'">
            {{text}}
          </div>
          <div v-else class="showpic w-2/4">
            <img class="float-right mr-2" :src="imgurl" alt="">
          </div>
        </div>
      </div>
      <div v-show="loading" class="update flex justify-items-center items-center float-right mt-3 mx-10">
        <div class="progress mr-2">
          <div class="progressBar"></div>
        </div>
        <span class="text-white text-sm">{{ progress }}%</span>
      </div>
    </div>
  </div>

<!-- ref="bottom" 要留著，bottom.value?.scrollIntoView({ behavior: 'smooth' })
視窗才可移到最底部 -->
  <div ref="bottom" class="mt-20 w-100 h-20"/>

  <div class="bottom">
    <div class="container-sm mx-auto">
      <form v-if="isLogin" @submit.prevent="send">
        <input v-model="message" placeholder="Message" required />
        <button type="submit">
          <SendIcon />
        </button>
        <label style="cursor: pointer;">
          <input type="file" accept="image/*" @change="sendImgs($event)" style="display:none;">
          <img src="../assets/tools_file.png" alt="" style="width:40px;height:40px;margin-top:7px;">
        </label>
      </form>
    </div>
  </div>
</template>
<script>
import firebase from 'firebase/app'
import { ref, watch, nextTick } from 'vue'
import { useAuth, useChat } from '@/firebase'
import SendIcon from './SendIcon.vue'
// import Message from './Message.vue'
import 'firebase/storage'
const storageRef = firebase.storage().ref('/images/');
export default {
  components: { SendIcon },
  setup() {
    const { user, isLogin } = useAuth()
    const { messages, sendMessage, sendImg} = useChat()
    const bottom = ref(null)
    watch(
      messages,
      () => {
        nextTick(() => {
          bottom.value?.scrollIntoView({ behavior: 'smooth' })
        })
      },
      { deep: true }
    )
    const message = ref('')
    const loading = ref(false)
    const progress = ref('0')
    const send = () => {
      sendMessage(message.value)
      message.value = ''
    }
    const sendImgs= (t)=>{
      if (!isLogin.value) return
      console.log(t.target.files[0])
      var file = t.target.files[0];
      var fileName = Math.floor(Date.now() / 1000) + `_${file.name}`;
        const metadata = {
          contentType: 'image/*'
        };
      // 上傳資訊設定
      var uploadTaskto = storageRef.child(fileName).put(file, metadata);
      loading.value = true
      sendImg(uploadTaskto)
      getProgress(uploadTaskto)
    }
    const getProgress = (uploadTask) => {
      
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var num = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          progress.value = num
          let progressBar = document.querySelector('.progressBar')
          if(num === 100){loading.value = false}
          progressBar.setAttribute('style', `width:${progress.value}%`);
        })
        console.log(progress.value)
    }
    return { user, isLogin, messages, bottom, message,loading,progress , send,sendImgs,getProgress }
  }
}
</script>
<style scoped>
.showpic{
  max-height: 150px;
  min-width: 200px;
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
  height: 100%;
  background: rgb(21, 192, 15);
  border-radius: 12px;
}
</style>