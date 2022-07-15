window.addEventListener('load', () => {
    $('idLocal').value != 0 && sessionStorage.setItem('idLocal', $('idLocal').value);
})

$('idLocal').addEventListener('keydown', async ({ target }) => {
    try {

        let response = await fetch('/cloths/api/get-ids-local');
        let result = await response.json();

        if ((result.ids).includes(+target.value) && target.value != sessionStorage.getItem('idLocal')) {
            $('msg-error').hidden = false;
            target.classList.add('is-invalid');
        } else {
            $('msg-error').hidden = true;
            target.classList.remove('is-invalid');
        }

    } catch (error) {
        console.error(error)
    }
})

$('form-cloth').addEventListener('submit', (e) => {
    e.preventDefault();
    let error = false;
    let elements = e.target.elements;

    if(!$('idLocal').value){
        $('idLocal').classList.add('is-invalid');
    }

    for (let i = 1; i < elements.length - 1; i++) {
        if(!elements[i].value){
            error = true
        }
    }
    
    if($('idLocal').classList.contains('is-invalid')){
        error = true
    }
    
    if (!error) {
        sessionStorage.removeItem('idLocal')
        e.target.submit();
    }
})