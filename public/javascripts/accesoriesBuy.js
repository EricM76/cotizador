const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
let quantities = document.querySelectorAll(".quantity");
let subtotales = document.querySelectorAll(".subtotal");
let total = document.getElementById("total");
let packaging = +document.getElementById("packaging").innerText;
const btnSubmit = $('btn-submit');
const btnBack = $('btn-back');
const formData = new FormData()
let accessories = [];

function updateSubotal(id) {
    if(+document.getElementById("input" + id).value <= 5){
    let accessory = {};

    document.getElementById("subtotal" + id).innerHTML =
        +document.getElementById("input" + id).value *
        +document.getElementById("price" + id).innerText;
    let noFound = true;

    let accessoriesUpdated = accessories.map((element) => {
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
    for (let i = 0; i < subtotales.length; i++) {
        prices.push(+subtotales[i].innerHTML);
    }
    total.innerHTML = toThousand((prices.reduce((acum, sum) => acum + sum)) + packaging);
    btnSubmit.disabled = total.innerHTML != packaging ? false : true;
}

$('ticket') && $('ticket').addEventListener('change', e => {
    let regExExt = /(.jpg|.jpeg|.png|.gif|.webp)$/i;

    switch (true) {
        case $('ticket').value !== "" && !regExExt.exec($('ticket').value):
            $('ticketError').innerHTML = "El comprobante debe ser una imagen (jpg, jpeg, png, gif, webp)"
            vistaPrevia.src = ""
            break;

        default:
            $('ticketError').innerHTML = "";
            $('btnTicket').innerHTML = "Reemplar comprobante"
            $('btnDeletePreview').innerHTML = "<i class='fas fa-times-circle bg-white rounded-circle'></i>"
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onload = () => {
                $('vistaPrevia').src = reader.result
            }
            break;
    }
});

$('btnDeletePreview').addEventListener('click', (e) => {
    e.preventDefault();
    $('ticket').files[0] = null;
    $('vistaPrevia').src = null;
    $('btnDeletePreview').innerHTML = null;
    $('btnTicket').innerHTML = "Comprobante depósito"

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
            e.target.submit()
                Swal.fire(
                    {
                        title: 'Enviando...',
                        icon: 'info',
                        showConfirmButton: false,
                        timer: 2000
                    }
                )

          
        }
    })

})

$('ticket').addEventListener('change', (e) => {
    const files = e.target.files
    formData.append('ticket', files[0])
}) 