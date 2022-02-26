const observations = $('observations');

window.addEventListener('load', () => {

    if(sessionStorage.getItem('observations')){
        observations.value = sessionStorage.getItem('observations')
    }
})

observations.addEventListener('keyup', ({target}) => {
    console.log(target.value)
    sessionStorage.setItem('observations', target.value);

})

document.getElementById('form-sendOrder').addEventListener('submit', () => {
    sessionStorage.removeItem('orderInProcess');
    sessionStorage.removeItem('observations');
    localStorage.removeItem('selected');
    localStorage.removeItem('dataOrder');
})