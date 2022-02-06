let query = new URLSearchParams(location.search);


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

const handleSearch = (e) => {
    e.preventDefault();
    console.log(e.target);
    if(query.has('filter')){
        $('input-filter').value= query.get('filter')
    }
    e.target.submit()
}

window.onload = function () {

    if (sessionStorage.getItem('pathname') !== window.location.pathname) {
        sessionStorage.setItem('active', 1);
        sessionStorage.setItem('pages', 1);
        sessionStorage.removeItem('keywords');
    }


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

    if (query.get('filter') === 'all') {
        $('all').selected = "selected"
    }


    const getUsers = async () => {

        try {
            let response = await fetch('/quoters/api/users', {
                method: 'POST'
            });
            let {data} = await response.json();
            
            data.forEach(({ userId }) => {
                if (userId == query.get('filter')) {
                    $(`user${userId}`).selected = "selected"
                }
            });
        

        } catch (error) {
            console.warn(error);
        }

    }
   getUsers();


}

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('pathname', window.location.pathname)
})

