const observations = $('observations');
const btnSubmit = $('btn-submit');
const btnBack = $('btn-back');

window.addEventListener('load', () => {

    if (sessionStorage.getItem('observations')) {
        observations.value = sessionStorage.getItem('observations')
    }
})

observations.addEventListener('keyup', ({ target }) => {
    console.log(target.value)
    sessionStorage.setItem('observations', target.value);

});


$('ticket').addEventListener('change', e => {
    let regExExt = /(.jpg|.jpeg|.png|.gif|.webp)$/i;

    switch (true) {
        case !regExExt.exec($('ticket').value):
            $('ticketError').innerHTML = "Solo imágenes con extensión jpg, jpeg, png, gif, webp"
           /*  vistaPrevia.src = "" */
            break;

        default:
            $('ticketError').innerHTML = "";
            /*  $('btnTicket').innerHTML = "Reemplar comprobante"
           let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onload = () => {
                $('vistaPrevia').src = reader.result
            } */
            break;
    }
})

document.getElementById('form-sendOrder').addEventListener('submit', (e) => {
    e.preventDefault()

    Swal.fire({
        title: '¿Confirma los datos?',
        text: "Revise la información antes de ser enviada",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8B0000',
        cancelButtonColor: '#C0C0C0',
        confirmButtonText: 'Enviar pedido'
    }).then((result) => {
        if (result.isConfirmed) {
           
            sessionStorage.removeItem('orderInProcess');
            sessionStorage.removeItem('observations');
            localStorage.removeItem('selected');
            localStorage.removeItem('dataOrder');
            btnSubmit.disabled = true;
            btnBack.disabled = true;
            e.target.submit();

            Swal.fire(
                {
                    title : 'Enviando...',
                    icon :'info',
                    showConfirmButton: false,
                    timer: 2000
                }
               
              )
        }
    })

})