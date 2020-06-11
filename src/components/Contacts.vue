<template>
    <div class="card-body">
        <h2 class="text-primary text-center">Contacts</h2>
        <div class="contacts" v-chat-scroll="{always: false, smooth: true}">
            <p class="text-secondary nocontacts" v-if="contacts.length == 0">
                 [No contacts yet!]
            </p>
            <div v-for="contact in contacts" :key="contact.id">
                <button class="contBtn btn-primary " v-on:click="$emit('switchChat', findChat(contact.name))">
                    {{contact.name}}
                </button>
            </div>
        </div>
        <form @submit.prevent="addContact" class="text-center">
            <div class="addContact form-group">
                <input type="text" class="form-control" placeholder="Add Contact" name="newContact" v-model="newContact">
                <p v-if="errorText" class="text-danger">{{ errorText }}</p>
                <button @click="addContact" class="addBtn btn-secondary"> Add </button>
            </div>
        </form>
    </div>
</template>

<script>
import fb from "@/firebase/init";

export default {
    name: "Contacts",
    props: ["name"],
    data(){
        return {
            currentChat: "",
            newContact: "",
            contacts: [],
            errorText: null
        }
    },
    created(){
        let ref = fb.collection("users").doc(this.name).collection("contacts");
        
        ref.onSnapshot(snapshot => {
            console.log(snapshot);
            snapshot.docChanges().forEach(change=> {
                
                if(change.type == "added"){
                    let doc = change.doc;
                    this.contacts.push({
                        name: doc.id
                    });
                }
                

            });
            this.contacts.sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

        });


    },
    methods:{
        addContact: function(){
            if(!this.newContact){
                this.errorText = "Please Enter Contact";
                return;
            }
            else if(this.newContact == this.name){
                this.errorText = "You can't add yourself";
                return;
            }
            let ref = fb.collection("users").doc(this.newContact);
            let getRef = ref.get();
            getRef.then(user=>{
                if(user.exists){
                    let ref = fb.collection("users").doc(this.name).collection("contacts").doc(this.newContact);
                    let getRef = ref.get();
                    getRef.then(user=>{
                        if(!user.exists){
                            fb.collection("users").doc(this.name).collection("contacts").doc(this.newContact).set({});
                            fb.collection("users").doc(this.newContact).collection("contacts").doc(this.name).set({});
                            var textA = this.name.toUpperCase();
                            var textB = this.newContact.toUpperCase();
                            var newChatName = "";
                            if(textA < textB){
                                newChatName = this.name + "_" + this.newContact;
                            }
                            else{
                                newChatName = this.newContact + "_" + this.name;
                            }
                            fb.collection("chats").doc(newChatName).set({});
                        }
                        else{
                            this.errorText = "User has already been added";
                        }
                    });
                }
                else{
                    this.errorText = "User doesn't exist";
                }
            })
        },
        findChat: function(switchContact){
            
            var textA = this.name.toUpperCase();
            var textB = switchContact.toUpperCase();
            var newChatName = "";
            if(textA < textB){
                newChatName = this.name + "_" + switchContact;
            }
            else{
                newChatName = switchContact + "_" + this.name;
            }
            this.currentContact = newChatName;
            this.errorText = newChatName;
            
            return newChatName;
        }
    }
        
}
</script>

<style>
.contBtn{
    width: 100%;
    margin-bottom: 5px;
}

.addContact{
    margin-top: 50px;
}
.addBtn{
    width: 100%;
    margin-top: 10px;
    position: sticky;
}

.contacts{
    max-height: 300px;
    overflow: auto;
}

</style>