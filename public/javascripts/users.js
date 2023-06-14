
const changeEnable = async (id, enable) => {

    try {


        let response = await fetch(`/users/api/enable`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                enable
            })
        });

        let result = await response.json()

        console.log(result)

    } catch (error) {
        console.error(error)
    }
}


const changeViewOrders = async (id, enable) => {

    try {


        let response = await fetch(`/users/api/change-view-orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                enable
            })
        });

        let result = await response.json()

        console.log(result)

    } catch (error) {
        console.error(error)
    }
}

const changeAllViewOrders = async () => {

    try {

        let response = await fetch(`/users/api/view-all-orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                viewAllOrders: $('viewAllOrders').checked
            })
        });

        let result = await response.json()

        console.log(result)
        $('viewAllOrders').checked = result.viewAllOrders

    } catch (error) {
        console.error(error)
    }
}

const changeActive = (id) => {

    sessionStorage.setItem('active', id)
    $('active').value = id;
}

const blockPagesNext = (pages) => {

    const block = +pages + 4
    sessionStorage.setItem('pages', block)
    $('pages').value = block;
    changeActive(block)
}

const blockPagesPrevious = (pages) => {

    const block = +pages - 4;
    console.log(block)
    sessionStorage.setItem('pages', block)
    $('pages').value = block;
    changeActive(block)
}

const setValues = () => {
    $('active').value = sessionStorage.getItem('active');
    $('pages').value = sessionStorage.getItem('pages');
    document.getElementById('form-items').submit()
}

const resetValues = () => {
    sessionStorage.setItem('active', 1);
    sessionStorage.setItem('pages', 1);
    sessionStorage.removeItem('keywords');

    $('active').value = 1;
    $('pages').value = 1;
    $('keywords').value = "";
    document.getElementById('form-items').submit()
}

const handlerSearch = () => {
    sessionStorage.setItem('keywords', $('search').value)
    $('keywords').value = $('search').value;
    console.log($('active').value);
    console.log($('filter').value);
}

const getKeywords = () => {
    $('keywords').value = sessionStorage.getItem('keywords');
}

const sendDeleteUser = (e, name, surname) => {
    e.preventDefault()

    Swal.fire({
        title: `¿Está seguro que quiere eliminar la cuenta de <b>${name} ${surname}</b>?`,
        text: "Se eliminaran las cotizaciones y ordenes generadas por este usuario.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8B0000',
        cancelButtonColor: '#C0C0C0',
        confirmButtonText: 'Sí, eliminalo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            setTimeout(() => {
                e.target.submit()

            }, 1500);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'El usuario ha sido eliminado',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })

}

window.onload = function () {

    if (sessionStorage.getItem('pathname') !== window.location.pathname) {
        sessionStorage.setItem('active', 1);
        sessionStorage.setItem('pages', 1);
        sessionStorage.removeItem('keywords');
    }

    let query = new URLSearchParams(window.location.search);

    switch (query.get('order')) {
        case 'name':
            $('name').selected = "selected"
            break;
        case 'surname':
            $('surname').selected = "selected"
            break;
        case 'id':
            $('default').selected = "selected"
            break;
    }
    switch (query.get('filter')) {
        case '1':
            $('visible').selected = "selected"
            break;
        case '0':
            $('hidden').selected = "selected"
            break
        case 'all':
            $('all').selected = "selected"
            break;
    }


    document.getElementById('form-items').addEventListener('submit', (e) => {
        e.preventDefault();
        getKeywords();
        e.target.submit()

    })
}

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('pathname', window.location.pathname)
})

