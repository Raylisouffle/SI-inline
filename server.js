const http = require("http");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
let joueurs = 0;
 
// Renvoie le contenu du dossier courant de facon statique
const serve = serveStatic("./");
 
// Création du serveur
const server = http.createServer(function(req, res) {
    serve(req, res, finalhandler(req, res)); // Traitement de la requête par le middleware
});
 
// Lancement
server.listen(8080, function() {
    console.log('Lancement du serveur sur http://localhost:8080');
});
// Chargement de socket.io
let io = require('socket.io').listen(server);

// Evenements
// Connexion

io.sockets.on('connection', function(socket){

    socket.on('connection', function(message){
        socket.broadcast.emit('connection', 'Un nouveau joueur s\'est connecté !');
        console.log(message);
        joueurs ++;
        socket.emit('numero', joueurs);
        console.log('Il y  a acutellement '+joueurs+' connectés !');
    });

    socket.on('caseIn', function(touche){
        socket.broadcast.emit('caseIn', touche);
    });
   socket.on('caseOut', function(touche){
       socket.broadcast.emit('caseOut', touche);
   });
   socket.on('position', function(objet){
       socket.broadcast.emit('position', objet);
   });
   socket.on('tir1', function(){
    socket.broadcast.emit('tir1');
    
   });
   socket.on('tir2', function(){
    socket.broadcast.emit('tir2');
    
   });
   socket.on('manches', function(manche){
       socket.broadcast.emit('manches', manche);
       console.log('changement de manches');

   });

});

