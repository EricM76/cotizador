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