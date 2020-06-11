<template>
    <div class="container">
        <div class="card login">
        <div class="card-body">
            <h2 class="card-title text-center">Register</h2>
            <form @submit.prevent="register" id="regForm" class="text-center">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Username" name="name" v-model="name">
                    <input type="password" class="form-control" placeholder="Password" name="pass" v-model="pass">
                    <p v-if="errorText" class="text-danger">{{ errorText }}</p>
                </div>
            </form>
            <p v-if="successText" class="text-success">{{ successText }}</p>
            <button @click="back" id="backBtn" class="btn btn-primary">Back</button>
            <button @click="register" id="regBtn" class="btn btn-secondary">Register</button>
        </div>
        </div>
    </div>
</template>

<script>
import fb from "@/firebase/init.js";

export default {
  name: "Register",
  data () {
    return {
      name: "",
      pass: "",
      errorText: null,
      successText: null
    }
  },
  methods: {
    back: function(){
         this.$router.push({name: "Login"});
    },
    register: function(){

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
                return;
            }
        }

        let ref = fb.collection("users").doc(this.name);
        let getRef = ref.get();
        getRef.then(user=>{
            if(!user.exists){
                this.errorText = "User Doesn't Exists";
                fb.collection("users").doc(this.name).set({
                    name: this.name,
                    pass: this.pass
                }).catch(err=> {
                    console.log("Error creating new user", err)
                });
                this.successText = "Registration Successful";
                var regBtn = document.getElementById("regBtn");
                var regForm = document.getElementById("regForm");
                var backBtn = document.getElementById("backBtn");
                regBtn.style.display = "none";
                regForm.style.display = "none";
                backBtn.innerText = "Back to Login";
            }
            else{
                this.errorText = "Username Is Taken";
            }
        })
        .catch(err=>{
            console.log("Error getting document", err);
            this.errorText = "Error Checking User";
        });
        
    }

  }
}
</script>