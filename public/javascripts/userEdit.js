window.addEventListener('load', () => {
    $('idLocal').value != 0 && sessionStorage.setItem('idLocal', $('idLocal').value);
})

$('username').addEventListener('change', ({target}) => {
    if(target.value.trim()){
        $('btn-change').classList.remove('disabled')
    }else{
        $('btn-change').classList.add('disabled')

    }
})


$('btn-change').addEventListener('click', () => {
    $('box-password').classList.toggle('box-hidden');
    $('password').focus();
    $('box-buttons').classList.toggle('box-hidden');
    $('btn-change').classList.toggle('box-hidden');
})

$('btn-close').addEventListener('click', () => {
    $('box-password').classList.toggle('box-hidden');
    $('password').value = null;
    $('box-buttons').classList.toggle('box-hidden');
    $('btn-change').classList.toggle('box-hidden');
})

const verifyUsername = async (username) => {
  
    let response = await fetch('/users/api/verify-username',{
        method : 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            username
        })
    });
    let result = await response.json();

   $('error-username').innerHTML = !result.ok ? result.msg : null 

}

$('username').addEventListener('keyup', ({target}) => {

 verifyUsername(target.value)
})

$('idLocal').addEventListener('keydown', async ({ target }) => {
    try {

        let response = await fetch('/users/api/get-ids-local');
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

$('form-user').addEventListener('submit', (e) => {
    e.preventDefault();

    if(!$('idLocal').value){
        $('idLocal').classList.add('is-invalid');
    }
    
    if (!$('idLocal').classList.contains('is-invalid')) {
        sessionStorage.removeItem('idLocal')
        e.target.submit();
    }
})