const confirmDelete = (e) => {
    e.preventDefault();
    Swal.fire({
        title: '¿Está seguro que desea eliminar?',
        text: "No podrá revertir los cambios",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8B0000',
        cancelButtonColor: '#C0C0C0',
        confirmButtonText: 'Confirmar'
    }).then( async (result) => {
        if (result.isConfirmed) {
            e.target.submit()
            Swal.fire(
                {
                    title: 'Eliminado...',
                    icon: 'info',
                    showConfirmButton: false,
                    timer: 2000
                }
            )
        }
    })
}

const changeVisibility = async (id, visibility,item) => {
    try {

        let response = await fetch(`/${item}/api/visibility/${id}/${visibility}`, {
            method: 'POST'
        });
        let result = await response.json()
        if(result.ok){
            window.location.href = `/${item}`
        }

    } catch (error) {
        console.error(error)
    }
}

const changeActive = (id) => {

    sessionStorage.setItem('active',id)
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
    sessionStorage.setItem('keywords',$('search').value)    
    $('keywords').value = $('search').value;
    console.log($('active').value);
    console.log($('filter').value);
}

const getKeywords = () => {
    $('keywords').value = sessionStorage.getItem('keywords');
}

window.onload = function () {

    if(sessionStorage.getItem('pathname') !== window.location.pathname){
        sessionStorage.setItem('active', 1);
        sessionStorage.setItem('pages', 1);
        sessionStorage.removeItem('keywords');
    }

    let query = new URLSearchParams(window.location.search);

    switch (query.get('order')) {
        case 'name':
            $('name').selected = "selected"
            break;
        case 'price':
            $('price').selected = "selected"
            break
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
    sessionStorage.setItem('pathname',window.location.pathname)
})

