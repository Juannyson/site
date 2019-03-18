
const config = {
    apiKey: "AIzaSyBC5-3eBE-m8pyHottWBaL0hqZ3QeiHJrI",
    authDomain: "animalsavior-9f67e.firebaseapp.com",
    databaseURL: "https://animalsavior-9f67e.firebaseio.com",
    projectId: "animalsavior-9f67e",
    storageBucket: "animalsavior-9f67e.appspot.com",
    messagingSenderId: "585074364087"
};
firebase.initializeApp(config);

//verificação de login
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
        window.location.href = "sign-in.html";
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

var listHtml = '';

var denunciasRef = firebase.database().ref('denuncias').orderByChild('data');
denunciasRef.off(); //remover listeners em caso de reentrada

denunciasRef.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        addDenuncia(childSnapshot.key, childSnapshot.val());
    });
    document.getElementById('listDnc').innerHTML = listHtml;
});

denunciasRef.on('child_added', function(data) {
    addDenuncia(data.key, data.val());
    document.getElementById('listDnc').innerHTML = listHtml; 
});

function addDenuncia(idDnc, dados){
    listHtml = '<a href="denuncia.html?dncId='+idDnc+'" id="'+idDnc+'" class="list-group-item list-group-item-action" onmouseover="activeItem(\''+idDnc+'\')" onmouseout="inactiveItem(\''+idDnc+'\')" onclick="sairListagem()">'+
        '<div class="d-flex w-100 justify-content-between">'+
        '<h6 class="mb-2 font-weight-bold">ID: '+idDnc+' / '+dados.protocolo+'</h6>'+
        '<small>'+getDate(dados.data)+'</small>'+
        '</div>'+
        '<p class="mb-1">'+(dados.descricao != '' ? dados.descricao : 'Sem descrição.')+'</p>'+
        '<small>'+dados.endereco+'</small>'+
    '</a>'.concat(listHtml);
}

function sairListagem(){
    denunciasRef.off(); //remover listeners
}

function getDate(timestamp){
    var date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR");
}

