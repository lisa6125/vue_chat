import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// import Filter from 'bad-words'
import { ref, onUnmounted, computed } from 'vue'

firebase.initializeApp({
  apiKey: process.env.VUE_APP_API,
  authDomain: "vue-chat-app-46e0c.firebaseapp.com",
  projectId: "vue-chat-app-46e0c",
  storageBucket: "vue-chat-app-46e0c.appspot.com",
  messagingSenderId: "497658400074",
  appId: "1:497658400074:web:56a8007df52efaa73585b3"
})
  
const auth = firebase.auth()

export function useAuth() {
  const user = ref(null)
  const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
  onUnmounted(unsubscribe)
  const isLogin = computed(() => user.value !== null)

  const signIn = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(googleProvider)
  }
  const signOut = () => auth.signOut()

  return { user, isLogin, signIn, signOut }
}
// const storageRef = firebase.storage().ref('/images/');
const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)  //生成日期降序排列，限制100筆(使輸入訊息在最底層)
// const filter = new Filter()

export function useChat() {
  const messages = ref([])
  const unsubscribe = messagesQuery.onSnapshot(snapshot => {  //使用 onSnapshot() 方法监听某个文档。对您提供的回调函数的初始调用将使用相应文档的当前内容立即创建一份文档快照。之后，每次内容发生更改时，另一个调用将更新文档快照。
    messages.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .reverse()
    console.log(messages.value)
  })
  onUnmounted(unsubscribe)

  const { user, isLogin } = useAuth()
  const sendMessage = text => {
    if (!isLogin.value) return
    const { photoURL, uid, displayName } = user.value
    messagesCollection.add({
      userName: displayName,
      userId: uid,
      userPhotoURL: photoURL,
      text: text,
      imagurl:'',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }
  const sendImg = (uploadTask) => {

    uploadTask.then((snapshot) => {
    snapshot.ref.getDownloadURL().then((url) => {
        const { photoURL, uid, displayName } = user.value
        messagesCollection.add({
          userName: displayName,
          userId: uid,
          userPhotoURL: photoURL,
          text: '',
          imgurl:url,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    });
});


  }
  // const getProgress = (uploadTask) => {
  //   uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  //     (snapshot) => {
  //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //       var progress = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       // console.log('Upload is ' + progress + '% done');
        
  //     })
  // }

  return { messages, sendMessage,sendImg}
}
// 參考文件  https://www.oxxostudio.tw/articles/201905/firebase-firestore.html
// https://medium.com/@erickuo801204/firebase%E7%AD%86%E8%A8%98-2-storage-%E5%84%B2%E5%AD%98-647ad5aed741