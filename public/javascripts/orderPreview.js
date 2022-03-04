const observations = $('observations');

window.addEventListener('load', () => {

    if (sessionStorage.getItem('observations')) {
        observations.value = sessionStorage.getItem('observations')
    }
})

observations.addEventListener('keyup', ({ target }) => {
    console.log(target.value)
    sessionStorage.setItem('observations', target.value);

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
            e.target.submit()
        }
    })

})