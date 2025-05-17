export const alertaSimple = (tipoAlerta, titulo, texto) => {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: tipoAlerta
    });
}
export const alertaConOpciones = (tipoAlerta, titulo, texto) => {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: tipoAlerta,
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
    }).then((result) => {
        if (result.isConfirmed) {
            const matricula = document.getElementById("inputMatricula").value;
            const formularioContainer = document.querySelector(".formularioContainer");
            fetch(`https://formulariobd-back.onrender.com/borrar?matricula=${matricula}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al eliminar el estudiante");
                    }
                })
                .then(data => {
                    alertaSimple("success", "Eliminado", "El estudiante ha sido eliminado correctamente.");
                    formularioContainer.innerHTML="";
                })
                .catch(error => {
                    alertaSimple("error", "Fallo", "No se pudo eliminar el estudiante.");
                    console.log(error);
                });
        }
    })
}
