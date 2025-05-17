import { alertaSimple, alertaConOpciones } from "./alertas.js";
const btnBuscar = document.getElementById("btnBuscar");
const btnRegistrar = document.getElementById("btnRegistrar");
const inputConsultarMatricula = document.getElementById("inputConsultarMatricula");

//Funcion para verificar que el input de matricula no este vacio
const verificarInputMatricula = () => {
    let matricula = inputConsultarMatricula.value;
    if (matricula.length == 0) {
        alertaSimple("error", "Campo vacio", "Debe ingresar una matricula para ejecutar esta accion")
    }
    else {
        return matricula;
    }
}
//Funcion para consultar estudiante en la BD
const consultarEstudiante = () => {
    let matricula = verificarInputMatricula();
    if (matricula !== undefined) {
        fetch(`https://formulariobd-back.onrender.com/consulta?matricula=${matricula}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error al consultar la matrícula");
                }
                return res.json();
            })
            .then(data => crearFormulario("consulta", data))
            .catch(error => alertaSimple("error", "Consulta fallida", "Estudiante no encontrado"));
    }
};

//Funcion para registrar estudiante en la BD
const registrarEstudiante = () => {
    const estudiante = {
        nombre: inputNombre.value,
        matricula: inputMatricula.value,
        promedio: parseFloat(inputPromedio.value),
        carrera: inputCarrera.value,
        telefono: inputTelefono.value,
        direccion: inputDireccion.value
    };

    fetch("https://formulariobd-back.onrender.com/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(estudiante)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al registrar estudiante");
            }
            return response.json();
        })
        .then(data => {
            alertaSimple("success", "Éxito", "Estudiante registrado correctamente");
        })
        .catch(error => {
            alertaSimple("error", "Error", "No se pudo registrar el estudiante");
        });
};

//Funcion para crear formulario
const crearFormulario = (tipoDeFormulario, data) => {
    const formularioContainer = document.querySelector(".formularioContainer");
    formularioContainer.innerHTML = " ";
    let form = `<form class="form">
                    <div class="mb-3">
                        <label for="inputMatricula" class="form-label">Matricula</label>
                        <input type="text" class="form-control estudianteInfo" id="inputMatricula">
                    </div>
                    <div class="mb-3">
                        <label for="inputNombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control estudianteInfo" id="inputNombre">
                    </div>
                    <div class="mb-3">
                        <label for="inputPromedio" class="form-label">Promedio</label>
                        <input type="number" class="form-control estudianteInfo" id="inputPromedio">
                    </div>
                    <div class="mb-3">
                        <label for="inputCarrera" class="form-label">Carrera</label>
                        <input type="text" class="form-control estudianteInfo" id="inputCarrera">
                    </div>
                    <div class="mb-3">
                        <label for="inputTelefono" class="form-label">Telefono</label>
                        <input type="text" class="form-control estudianteInfo" id="inputTelefono">
                    </div>
                    <div class="mb-3">
                        <label for="inputDireccion" class="form-label">Direccion</label>
                        <input type="text" class="form-control estudianteInfo" id="inputDireccion">
                    </div>
                    <div class="botones">
                        <button type="button" class="btn btn-warning botonAccion" id="btnRegistrarEstudiante">Registrar estudiante</button>
                        <button type="button" class="btn btn-dark botonAccion" id="btnActualizarDatos">Actualizar datos</button>
                        <button type="button" class="btn btn-danger botonAccion" id="btnEliminarEstudiante">Eliminar estudiante</button>
                    </div>
                </form>`
    formularioContainer.innerHTML += form;
    const inputMatricula = document.getElementById("inputMatricula");
    const inputNombre = document.getElementById("inputNombre");
    const inputPromedio = document.getElementById("inputPromedio");
    const inputCarrera = document.getElementById("inputCarrera");
    const inputTelefono = document.getElementById("inputTelefono");
    const inputDireccion = document.getElementById("inputDireccion");
    const estudianteInfo = document.querySelectorAll(".estudianteInfo");
    const btnRegistrarEstudiante = document.getElementById("btnRegistrarEstudiante");
    const btnActualizarDatos = document.getElementById("btnActualizarDatos");
    const btnEliminarEstudiante = document.getElementById("btnEliminarEstudiante");
    switch (tipoDeFormulario) {
        case "consulta":
            inputMatricula.value = data.matricula;
            inputNombre.value = data.nombre;
            inputPromedio.value = data.promedio;
            inputCarrera.value = data.carrera;
            inputTelefono.value = data.telefono;
            inputDireccion.value = data.direccion;
            estudianteInfo.forEach(element => element.setAttribute("disabled", true));
            btnRegistrarEstudiante.setAttribute("disabled", true);
            btnActualizarDatos.removeAttribute("disabled");
            btnEliminarEstudiante.removeAttribute("disabled");
            break;
        case "registro":
            btnRegistrarEstudiante.removeAttribute("disabled");
            btnActualizarDatos.setAttribute("disabled", true);
            btnEliminarEstudiante.setAttribute("disabled", true);
            inputMatricula.value = inputConsultarMatricula.value;
            inputMatricula.setAttribute("disabled", true);
            btnRegistrarEstudiante.addEventListener("click", registrarEstudiante);
            break;
    }
    btnActualizarDatos.addEventListener("click", () => {
        if (btnActualizarDatos.textContent != "Guardar cambios") {
            estudianteInfo.forEach(data => data.removeAttribute("disabled"));
            inputMatricula.setAttribute("disabled", true)
            btnEliminarEstudiante.setAttribute("disabled", true);
            btnActualizarDatos.innerHTML = "Guardar cambios";
        }
        else {
            const estudiante = {
                nombre: inputNombre.value,
                matricula: inputMatricula.value,
                promedio: parseFloat(inputPromedio.value),
                carrera: inputCarrera.value,
                telefono: inputTelefono.value,
                direccion: inputDireccion.value
            };
            fetch(`https://formulariobd-back.onrender.com/actualizar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(estudiante)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al actualizar datos del estudiante");
                    }
                })
                .then(data => {
                    alertaSimple("success", "Actualizado", "Los datos del estudiante fueron actualizados correctamente.");
                })
                .catch(error => {
                    alertaSimple("error", "Fallo", "No se pudo actualizar el estudiante.");
                });
        }
    });
    btnEliminarEstudiante.addEventListener("click",()=>{
        alertaConOpciones("warning","¿Está seguro?","Está seguro de eliminar al estudiante");
    })
}
btnBuscar.addEventListener("click", consultarEstudiante);
btnRegistrar.addEventListener("click", () => {
    let matricula = verificarInputMatricula();
    if (matricula !== undefined) {
        crearFormulario("registro", {});
    }
})
