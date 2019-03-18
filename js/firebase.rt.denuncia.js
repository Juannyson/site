
inicializarFirebase();

var paramsBusca = new URLSearchParams(location.search);
if(paramsBusca.has("dncId") && paramsBusca.get("dncId") != ""){
    buscarDenuncia(paramsBusca.get("dncId"));
}else{
    window.location.href = "index.html";
}

firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        headDenuncia = document.getElementById('headDenuncia');
        oprsAdm = document.getElementById('oprsAdm');
        headDenuncia.innerHTML = 
        '<a class="nav-link" href="index.html">Pesquisar</a>'+
        '<a class="nav-link active" href="adm.html">ADM</a>'+
        '<a class="nav-link text-danger" href="#" onclick="deslogar()">Sair</a>';
        oprsAdm.innerHTML = 
        '<div class="container bg-white border shadow-sm rounded mb-3 pt-2 pb-2 pl-4 pr-4">'+
        '<div class="row border-bottom mb-2">'+
          '<h6 class="col-sm-12 text-left font-weight-light text-secondary">Operações de administrador:</h6>'+
        '</div>'+
        '<div class="row">'+
          '<div class="col-sm-6">'+
            '<button class="btn btn-link" data-toggle="modal" data-target="#protocoloModal">Associar protocolo</button>'+
          '</div>'+
          '<div class="col-sm-6">'+
            '<div class="btn-group dropright">'+
              '<button class="btn btn-link  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                'Alterar situação'+
              '</button>'+
              '<div class="dropdown-menu">'+
                '<a class="dropdown-item" onclick="alterarSituacao(\'Em espera\')">Em espera</a>'+
                '<a class="dropdown-item" onclick="alterarSituacao(\'Averiguada\')">Averiguada</a>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
        '<!-- Modal associar protocolo -->'+
        '<div class="modal fade" id="protocoloModal" tabindex="-1" role="dialog" aria-labelledby="protocoloModalLabel" aria-hidden="true">'+
          '<div class="modal-dialog" role="document">'+
            '<div class="modal-content">'+
              '<div class="modal-header">'+
                '<h5 class="modal-title" id="protocoloModalLabel">Associar protocolo</h5>'+
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                  '<span aria-hidden="true">&times;</span>'+
                '</button>'+
              '</div>'+
              '<form>'+
                '<div class="modal-body">'+
                  '<input type="text" class="form-control" id="protocoloDnc" placeholder="Protocolo da denúncia" required="">'+
                '</div>'+
                '<div class="modal-footer">'+
                  '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>'+
                  '<button type="button" class="btn btn-outline-success" onclick="associarProtocolo()">Salvar</button>'+
                '</div>'+
              '</form>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    }else{
        //nao logado
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

function inicializarFirebase(){
    const config = {
        apiKey: "AIzaSyBC5-3eBE-m8pyHottWBaL0hqZ3QeiHJrI",
        authDomain: "animalsavior-9f67e.firebaseapp.com",
        databaseURL: "https://animalsavior-9f67e.firebaseio.com",
        projectId: "animalsavior-9f67e",
        storageBucket: "animalsavior-9f67e.appspot.com",
        messagingSenderId: "585074364087"
    };
    firebase.initializeApp(config);
}

function buscarDenuncia(dncId){
    firebase.database().ref('/denuncias/' + dncId).once('value').then(function(snapshot) {
        if(snapshot.val() != null){
            preencherDados(dncId, snapshot.val());
        }else{
            document.getElementById('main').innerHTML = 
            '<div class="alert alert-warning" role="alert">'+
            'Denúncia não encontrada. '+
            '<a class="text-muted" href="index.html">Tente novamente</a></div>';
        }
    });
}

function preencherDados(dncId, dnc){
    id_dnc = document.getElementById('id_dnc');
    situacao_dnc = document.getElementById('situacao_dnc');
    protocolo_dnc = document.getElementById('protocolo_dnc');
    data_dnc = document.getElementById('data_dnc');
    endereco_dnc = document.getElementById('endereco_dnc');
    mapa_dnc = document.getElementById('mapa_dnc');
    especies_dnc = document.getElementById('especies_dnc');
    atividades_dnc = document.getElementById('atividades_dnc');
    descricao_dnc = document.getElementById('descricao_dnc');

    id_dnc.innerHTML = "ID: "+dncId;
    situacao_dnc.innerHTML = "Situação: "+dnc.situacao;
    protocolo_dnc.innerHTML = dnc.protocolo;
    data_dnc.innerHTML = getDate(dnc.data);
    endereco_dnc.innerHTML = dnc.endereco;
    mapa_dnc.href = "https://www.google.com/maps/search/?api=1&query="+dnc.latitude+","+dnc.longitude;
    especies_dnc.innerHTML = dnc.animais.replace('[', '').replace(']', '');
    atividades_dnc.innerHTML = dnc.atividades.replace('[', '').replace(']', '');;
    descricao_dnc.innerHTML = (dnc.descricao != '') ? dnc.descricao : "Não informado";
    carregarImagens(dnc.countImgs);
}

function getDate(timestamp){
    var date = new Date(timestamp);
    return date.toLocaleDateString("pt-BR");
}

function associarProtocolo(){
    dncId = paramsBusca.get("dncId");
    protocoloDnc = document.getElementById('protocoloDnc').value;
    firebase.database().ref('/denuncias/' + dncId).child('protocolo').set(protocoloDnc);
    $('#protocoloModal').modal('hide');
    location.reload();
}

function alterarSituacao(situacao){
    dncId = paramsBusca.get("dncId");
    firebase.database().ref('/denuncias/' + dncId).child('situacao').set(situacao);
    location.reload();
}

function carregarImagens(countImgs){
    listImgs = document.getElementById('listImgs');
    indicatorsImgs = document.getElementById('indicatorsImgs');
    document.getElementById('imgsModalLabel').innerHTML = countImgs+' Imagens enviadas'
    dncId = paramsBusca.get("dncId");
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var spaceRef = storageRef.child('fotos_denuncias/'+dncId);
    listHtmlImgs = '';
    htmlIndicators = '';
    for(var i = 0; i < countImgs; i++){
        listHtmlImgs += '<div class="carousel-item'+(i == 0 ? ' active' : '')+'">'+
            '<img id="img'+i+'" src="#" class="d-block w-100" alt="Carregando imagem">'+
            '</div>';
        htmlIndicators += '<li data-target="#carouselImgsIndicators" data-slide-to="'+i+'" '+(i == 0 ? 'class="active"' : '')+'></li>';
    }
    indicatorsImgs.innerHTML = htmlIndicators;
    listImgs.innerHTML = listHtmlImgs;
    for(var i = 0; i < countImgs; i++){
        downloadImg(spaceRef.child(''+i), document.getElementById('img'+i));
    }
}

function downloadImg(ref, img){
    ref.getDownloadURL().then(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
            var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        // Or inserted into an <img> element:
        img.src = url;
    }).catch(function(error) {
        // Handle any errors
    });
}



    



