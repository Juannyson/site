
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
        headIndex = document.getElementById('headIndex');
        headIndex.innerHTML = 
        '<a class="nav-link active" href="#">Pesquisar</a>'+
        '<a class="nav-link" href="adm.html">ADM</a>'+
        '<a class="nav-link text-danger" href="#" onclick="deslogar()">Sair</a>';
    }else{
        //não logado
    }
});

function deslogar(){
    firebase.auth().signOut().then(function() {
        window.location.href = "sign-in.html";
    }).catch(function(error) {
        alert('Erro ao deslogar!');
        // An error happened.
    });
}