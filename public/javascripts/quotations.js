
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

const resetValuesFilter = () => {
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
}

const getKeywords = () => {
    $('keywords').value = sessionStorage.getItem('keywords');
}

const goBack = (e) => {
    e.preventDefault()

    window.location = '/quoters'
}

$('btn-generateOrder').addEventListener('click', (e) => {
    e.preventDefault();
    //console.log(JSON.parse(localStorage.getItem('selected')));

    window.location = '/orders/add?quoters=' + localStorage.getItem('selected')
})

document.querySelector('.table').addEventListener('click', ({ target }) => {

    let selected = JSON.parse(localStorage.getItem('selected')) || []
   

    if (target.name === "quotation") {
        if (target.checked) {
            selected.push(+target.value);
            localStorage.setItem('selected', JSON.stringify(selected))
        } else {
            selected = selected.filter(check => check !== +target.value)
            $('btn-generateOrder').classList.add('disabled')
            localStorage.setItem('selected', JSON.stringify(selected))
        }

    };

selectedChecks()

})

const selectedChecks = () => {
    let checks = document.querySelectorAll('.form-check-input');

    let selectedChecks = false;
    checks.forEach(check => {
        if (check.checked) {
            selectedChecks = true;
        }
    });
    selectedChecks && $('btn-generateOrder').classList.remove('disabled')
}

const checkSelected = (id) => {
    return JSON.parse(localStorage.getItem('selected')).includes(+id)
}

window.onload = function () {

    let checks = document.querySelectorAll('.form-check-input');
    checks.forEach(check => {
        if (checkSelected(check.value)) {
            check.checked = true
        }
        else {
            check.checked = false
        }
    });

    selectedChecks()

    let query = new URLSearchParams(window.location.search);

    $('search').value = null;

    if (sessionStorage.getItem('pathname') !== window.location.pathname && !query.has('keywords')) {
        sessionStorage.setItem('active', 1);
        sessionStorage.setItem('pages', 1);
        sessionStorage.removeItem('keywords');
    }



    if (query.has('keywords') && query.get('keywords') !== "") {
        $('result').innerHTML = `
        <div class="d-flex align-content-center align-items-center">
        <a class="btn btn-sm btn-danger me-2 px-1 py-0" href="#" onclick="goBack(event)"><i class="fas fa-times"></i></a>
        <p class="text-muted my-auto">resultados para "${query.get('keywords')}" </p>
        </div>
        
        ` ;
    }


    switch (query.get('order')) {
        case 'id':
            $('default').selected = "selected"
            break;
    }
    if (query.get('filter') === 'all') {
        $('all').selected = "selected"
    } else {
        if (query.has('filter') && query.get('filter') !== "") {
            $(`user${query.get('filter')}`).selected = 'selected'
        }
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
