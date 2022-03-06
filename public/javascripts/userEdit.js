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