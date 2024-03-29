window.addEventListener('load', () => {
    $('idLocal').value != 0 && sessionStorage.setItem('idLocal', $('idLocal').value);
})

$('idLocal').addEventListener('keydown', async ({ target }) => {
    try {

        let response = await fetch('/chains/api/get-ids-local');
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

$('name').addEventListener('keyup', ({target}) => {
    if(target.value >= 0){
        target.classList.remove('is-invalid');
    }
})


$('form-chain').addEventListener('submit', (e) => {
    e.preventDefault();

    if(!$('idLocal').value){
        $('idLocal').classList.add('is-invalid');
    }

    if($('name').value < 0 || !$('name')){
        $('name').classList.add('is-invalid');
    }
    
    if (!$('idLocal').classList.contains('is-invalid') && !$('name').classList.contains('is-invalid')) {
        sessionStorage.removeItem('idLocal')
        e.target.submit();
    }
})