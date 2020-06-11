<template>
    <div class="chat container-fluid">
        <h2 class="text-primary text-center">Real-Time Chat</h2>
        <h5 class="text-secondary text-center">Powered by Vue.js & Firebase</h5>
        <div class="row">
            <div class="col-3 card">
                <Contacts :name="name" v-on:switchChat="switchChat"></Contacts>
            </div>
            <div class="col-9 card">
                <div class="card-body">
                    <p class="text-secondary nomessages" v-if="messages.length == 0">
                        [No messages yet!]
                    </p>
                    <div class="messages" v-chat-scroll="{always: false, smooth: true}">
                        <div v-for="message in messages" :key="message.id">
                            <span class="text-info">[{{ message.name }}]: </span>
                            <span>{{message.message}}</span>
                            <span class="text-secondary time">{{message.timestamp}}</span>
                        </div>
                    </div>
                </div>
                <div class="card-action">
                    <CreateMessage :name="name" :chat="currentChat"/>
                </div>
            </div>
        </div>
        <p class="text-danger" v-if="errorText">{{ errorText }}</p>
    </div>
</template>

<script>
    import CreateMessage from "@/components/CreateMessage.vue";
    import Contacts from "@/components/Contacts.vue";
    import fb from "@/firebase/init.js";
    import moment from "moment";

    export default {
        name: "Chat",
        props: ["name"],
        components: {
            CreateMessage,
            Contacts
        },
        data() {
            return{
                currentSnap: null,
                currentChat: "",
                errorText: "",
                messages: []
            }
        },
        created() {
            
           
        },
        methods: {
            switchChat: function(newChat){
                if(this.currentSnap){
                    this.currentSnap();
                }
                

                this.currentChat = newChat;
                this.errorText = newChat;
                this.messages = [];
                CreateMessage.chat = newChat;
                let ref = fb.collection("chats").doc(this.currentChat).collection("messages").orderBy("timestamp");

                this.currentSnap = ref.onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type == "added") {
                            let doc = change.doc;
                            this.messages.push({
                                id: doc.id,
                                name: doc.data().name,
                                message: doc.data().message,
                                timestamp: moment(doc.data().timestamp).format("LTS")
                            });
                        }
                    });
                });
            }
            
        }
        


    }
</script>

<style>
.chat h2{
    font-size: 2.6em;
    margin-bottom: 0px;
}

.chat h5{
    margin-top: 0px;
    margin-bottom: 40px;
}

.chat span{
    font-size: 1.2em;
}

.chat .time{
    display: block;
    font-size: 0.7em;
}

.messages{
    max-height: 300px;
    overflow: auto;
}
</style>