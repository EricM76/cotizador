document.getElementById('form-sendOrder').addEventListener('submit', () => {
    sessionStorage.removeItem('orderInProcess');
    localStorage.removeItem('selected');
    localStorage.removeItem('dataOrder');
})