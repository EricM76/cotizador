const seePass = () => {
    let $inputPass = $('floatingPassword')
    $inputPass.type = $inputPass.type === "password" ? "text" : "password";
    $('icon-eye').classList.toggle('fa-eye-slash')
};

