// funciones js para el modelo de usuario 

const urlApi = "http://localhost:9000";//colocar la url con el puerto

async function login(){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi+"/auth/login",settings);
    //console.log(await request.text());
    if(request.ok){
        
        const respuesta = await request.text();
        localStorage.token = respuesta;

        //localStorage.token = respuesta;
        localStorage.correo = jsonData.correo;      
        location.href= "dashboard.html";
    }
}
/*async function login(){
    let correo = document.querySelector('#myForm #correo').value;
    let contraseña = document.querySelector('#myForm #password').value;
    var jsonData = {
        "correo":correo,
        "password":contraseña,
     
        };
    /*var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }*/
    /*console.log(jsonData);

    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi+"/auth/login",settings);
    //console.log(await request.text());
    if(request.ok){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'logeado exitosamente',
            showConfirmButton: false,
            timer: 1500
          })
        const respuesta = await request.text();
       
        localStorage.token = respuesta;
        
        //localStorage.token = respuesta;
        localStorage.correo = jsonData.correo; 
        setTimeout(function () {
            location.href= "dashboard.html";
        }, 2000);     
        
       
    }else{
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            text: 'los datos del usuario no son validos',
            showConfirmButton: false,
            timer: 3000
          });
    }
}*/

function listarUsuarios(){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuarios",settings)
    .then(response => response.json())
    .then(function(data){
        
            var usuarios = '';
            for(const usuario of data){
                console.log(usuario.correo)
                usuarios += `
                <tr>
                    <th scope="row">${usuario.id}</th>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.documento}</td>
                    <td>${usuario.correo}</td>
                    <td>
                    <button type="button" class="btn btn-outline-danger" 
                    onclick="eliminaUsuario('${usuario.id}')">
                        <i class="fa-solid fa-user-minus"></i>
                    </button>
                    <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    '</td>
                    <br/>
                </tr>`;
                
            }
            document.getElementById("datos").innerHTML = usuarios;
    })
}

function eliminaUsuario(id){
    validaToken();
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then(response => response.text())
    .then(function(data){
        listarUsuarios();
        alertas("Se ha eliminado el usuario exitosamente!",2)
    })
}

function verModificarUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>
                </div>
              
                <form action="" method="post" id="myForm2">
                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="nombre" class="form-label">First Name</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" required value="${usuario.nombre}"> <br>
                    <label for="apellidos"  class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="apellidos" id="apellidos" required value="${usuario.apellidos}"> <br>
                    <label for="documento" class="form-label">docuemnto</label>
                    <input type="text" class="form-control" name="documento" id="documento" required value="${usuario.documento}"> <br>
                    <label for="correo" class="form-label">correo</label>
                    <input type="correo" class="form-control" name="correo" id="correo" required value="${usuario.correo}"> <br>
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${usuario.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarUsuario(id){
    validaToken();
    var myForm = document.getElementById("myForm2");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/usuario/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarUsuarios();
    alertas("Se ha modificado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Nombre: ${usuario.nombre}</li>
                    <li class="list-group-item">Apellido: ${usuario.apellidos}</li>
                    <li class="list-group-item">Correo: ${usuario.correo}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

function alertas(mensaje,tipo){
    var color ="";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-'+color+' alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("alerta").innerHTML = alerta;
}


function registerForm(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Usuario</h1>
            </div>
              
            <form action="" method="post" id="myForm1">
                <input type="hidden" name="id" id="id">
                <label for="nombre" class="form-label">First Name</label>
                <input type="text" class="form-control" name="nombre" id="nombre" required> <br>
                <label for="apellidos"  class="form-label">Last Name</label>
                <input type="text" class="form-control" name="apellidos" id="apellidos" required> <br>
                <label for="documento"  class="form-label">documento</label>
                <input type="text" class="form-control" name="documento" id="documento" required> <br>
                <label for="correo" class="form-label">correo</label>
                <input type="text" class="form-control" name="correo" id="correo" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarUsuario()">Registrar</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}

async function registrarUsuario(){
    var myForm = document.getElementById("myForm1");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/usuario", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    //listarUsuarios();
    //alertas("Se ha registrado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function salir(){
    localStorage.clear();
    location.href = "index.html";
}

function validaToken(){
    if(localStorage.token == undefined){
        salir();
    }
}