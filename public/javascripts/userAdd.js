console.log('userAdd connected success');

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

    document.getElementById('error-username').innerHTML = !result.ok ? result.msg : null 

}

document.getElementById('username').addEventListener('keyup', ({target}) => {

 verifyUsername(target.value)
})