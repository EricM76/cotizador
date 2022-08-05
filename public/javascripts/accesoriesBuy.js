const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
let quantities = document.querySelectorAll(".quantity");
let subtotales = document.querySelectorAll(".subtotal");
let total = document.getElementById("total");
let packaging = +document.getElementById("packaging").innerText;
const btnSubmit = $('btn-submit');
const btnBack = $('btn-back');
const formData = new FormData()
let accessories = [];
let accessoriesUpdated = [];

function updateSubotal(id) {
    if(+document.getElementById("input" + id).value <= +document.getElementById('limit'+id).value){
    let accessory = {};

    document.getElementById("subtotal" + id).innerHTML = !isNaN(+document.getElementById("subtotal" + id).innerHTML) ?
        +document.getElementById("input" + id).value *
        +document.getElementById("price" + id).innerText : "-";
    let noFound = true;

    accessoriesUpdated = accessories.map((element) => {
        if (
            element.name === document.getElementById("accessory" + id).innerText
        ) {
            element = {
                id: id,
                name: document.getElementById("accessory" + id).innerText,
                price: +document.getElementById("price" + id).innerText,
                quantity: +document.getElementById("input" + id).value,
                subtotal: +document.getElementById("subtotal" + id).innerText,
            };
            noFound = false;
            return element;
        }
        return element;
    });

    accessoriesUpdated = accessoriesUpdated.filter(
        (element) => element.quantity !== 0
    );

    accessories = accessories !== accessoriesUpdated && accessoriesUpdated;

    if (noFound && +document.getElementById("input" + id).value !== 0) {
        Object.defineProperty(accessory, "id", {
            value: +id,
        });
        Object.defineProperty(accessory, "name", {
            value: document.getElementById("accessory" + id).innerText,
        });
        Object.defineProperty(accessory, "quantity", {
            value: +document.getElementById("input" + id).value,
        });
        Object.defineProperty(accessory, "price", {
            value: +document.getElementById("price" + id).innerText,
        });
        Object.defineProperty(accessory, "subtotal", {
            value: +document.getElementById("subtotal" + id).innerText,
        });
        accessories.push(accessory);
    }
    document.getElementById('error'+id).hidden = true;
    document.getElementById("input" + id).classList.remove('is-invalid')
    updateTotal();
}else{
    document.getElementById('error'+id).hidden = false;
    document.getElementById("input" + id).classList.add('is-invalid')
}
}

function updateTotal() {
    let prices = [];
    let unities = [];

    for (let i = 0; i < subtotales.length; i++) {
        prices.push(+subtotales[i].innerHTML);
    }
    for (let i = 0; i < quantities.length; i++) {
        unities.push(+quantities[i].value);
    }
    let totalFinal = prices.reduce((acum, sum) => acum + sum) + packaging
    console.log(unities.reduce((acum, sum) => acum + sum));
    total.innerHTML = !isNaN(totalFinal) ? toThousand(totalFinal) : "-";
    btnSubmit.disabled =  (unities.reduce((acum, sum) => acum + sum)) > 0 ? false : true;
}

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

$('form-sendOrder').addEventListener('submit', (e) => {
    e.preventDefault()

    Swal.fire({
        title: '¿Confirma los datos?',
        text: "Revise la información antes de ser enviada",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8B0000',
        cancelButtonColor: '#C0C0C0',
        confirmButtonText: 'Enviar pedido'
    }).then( async (result) => {
        if (result.isConfirmed) {

            btnSubmit.disabled = true;
            btnBack.disabled = true;
            $('btnTicket') && $('btnTicket').classList.add('disabled');

            e.target.submit()
                Swal.fire(
                    {
                        title: 'Enviando...',
                        icon: 'info',
                        showConfirmButton: false,
                        timer: 3000
                    }
                )

          
        }
    })

})

$('ticket') && $('ticket').addEventListener('change', (e) => {
    const files = e.target.files
    formData.append('ticket', files[0])
}) 