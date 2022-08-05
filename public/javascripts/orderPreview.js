const observations = $('observations');
const btnSubmit = $('btn-submit');
const btnBack = $('btn-back');
const btnAccessory = $('btn-accessory');
const btnTicket = $('btnTicket');

window.addEventListener('load', () => {

    if (sessionStorage.getItem('observations')) {
        observations.value = sessionStorage.getItem('observations')
    }
})

observations.addEventListener('keyup', ({ target }) => {
    console.log(target.value)
    sessionStorage.setItem('observations', target.value);

});


$('ticket') && $('ticket').addEventListener('change', e => {
    let regExExt = /(.pdf|.jpg|.jpeg|.png|.gif|.webp)$/i;

    switch (true) {
        case $('ticket').value !== "" && !regExExt.exec($('ticket').value):
            $('ticketError').innerHTML = "El comprobante debe ser una imagen (jpg, jpeg, png, gif, webp) o un PDF"
            vistaPrevia.hidden = true;
            /* vistaPrevia.src = ""; */
            Swal.fire(
                {
                    title: 'Upss... hubo un problema en la carga del comprobante',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000
                }
            )
            break;

        default:
            $('ticketError').innerHTML = "";
             $('btnTicket').innerHTML = "Reemplazar comprobante"
             $('btnDeletePreview').innerHTML = "<i class='fas fa-times-circle bg-white rounded-circle'></i>"
           /* let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onload = () => {
                $('vistaPrevia').src = reader.result
            } */
            vistaPrevia.hidden = false
            Swal.fire(
                {
                    title: 'Comprobante agregado',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                }
            )
            break;
    }
});

$('btnDeletePreview').addEventListener('click', (e) => {
    e.preventDefault();
    $('ticket').value = null;
    $('vistaPrevia').hidden = true;
    $('btnDeletePreview').innerHTML = null;
    $('btnTicket').innerHTML = "Comprobante depósito";
    Swal.fire(
        {
            title: 'Comprobante eliminado',
            icon: 'warning',
            showConfirmButton: false,
            timer: 2000
        }
    )

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
           
            $('btn-submit').classList.add('disabled');
            $('btnTicket') && $('btnTicket').classList.add('disabled');
            $('btn-accessory').classList.add('disabled');
            $('btn-back').classList.add('disabled');

            sessionStorage.removeItem('orderInProcess');
            sessionStorage.removeItem('observations');
            localStorage.removeItem('selected');
            localStorage.removeItem('dataOrder');
            btnSubmit.disabled = true;
            btnBack.disabled = true;
            btnAccessory.disabled = true;
            btnTicket && btnTicket.classList.add('disabled');
            Swal.fire(
                {
                    title : 'Enviando...',
                    icon :'info',
                    showConfirmButton: false,
                    timer: 3000
                }
               
              )
            e.target.submit();
        }
    })

})