<template>
    <div class="container">
        <div class="card login">
        <div class="card-body">
            <h2 class="card-title text-center">Login</h2>
            <form @submit.prevent="login" class="text-center">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Insert New Username" name="name" v-model="name">
                <input type="password" class="form-control" placeholder="Insert Password" name="pass" v-model="pass">
                <p v-if="errorText" class="text-danger">{{ errorText }}</p>
            </div>
            </form>
            <button @click="login" class="btn btn-primary">Login</button>
            <button @click="register" class="btn btn-secondary">Register</button>
        </div>
        </div>
    </div>
</template>
<script>
import fb from "@/firebase/init.js";
export default {
    name: "home",
    data () {
        return {
        name: "",
        pass: "",
        errorText: null
        }
    },
    methods: {
        login: function() {
            if(!this.name){
                if(!this.pass){
                    this.errorText = "Please enter Username and Password";
                    return;
                }
                else{
                    this.errorText = "Please enter Username";
                    return;
                }
            }
            else{
                if(!this.pass){
                    this.errorText = "Please enter Password";
                    return
                }
            }
            let ref = fb.collection("users").doc(this.name);
            let getRef = ref.get();
            getRef.then(user=>{
                if(user.exists){
                    if(user.data().pass == this.pass){
                        this.$router.push({name: "Chat", params: {name: this.name}});
                    }
                    else{
                        this.errorText = "Password is incorrect";
                    }
                }
                else{
                    this.errorText = "User doesn't exist";
                }
            })

                
        },
        register: function(){
            this.$router.push({name: "Register"})
        }
    }
}
</script>
<style>
.login{
    max-width: 450px;
    margin-top: 50px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.form-control{
    margin-top: 10px;
}
.btn{
    margin-left: 15px;
    margin-right: 15px;
    display : inline;
}
</style>