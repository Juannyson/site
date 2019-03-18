
const config = {
    apiKey: "AIzaSyBC5-3eBE-m8pyHottWBaL0hqZ3QeiHJrI",
    authDomain: "animalsavior-9f67e.firebaseapp.com",
    databaseURL: "https://animalsavior-9f67e.firebaseio.com",
    projectId: "animalsavior-9f67e",
    storageBucket: "animalsavior-9f67e.appspot.com",
    messagingSenderId: "585074364087"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        window.location.href = "adm.html";
    }else{
        //não logado
    }
});

btnLogin = document.getElementById('btnLogin');
inputEmail = document.getElementById('inputEmail');
inputPassword = document.getElementById('inputPassword');
erroAuth = document.getElementById('erroAuth');

btnLogin.addEventListener('click', function(){
    firebase.auth().signInWithEmailAndPassword(inputEmail.value, inputPassword.value)
    .then(function(result){
        window.location.href = "adm.html";
    })
    .catch(function(error){
        erroAuth.className = "alert alert-danger d-block";
    });
});