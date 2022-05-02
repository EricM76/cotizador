window.addEventListener('load', () => {
    $('inputIDLocal').value != 0 && sessionStorage.setItem('inputIDLocal', $('inputIDLocal').value);

})

$('inputIDLocal') && $('inputIDLocal').addEventListener('keydown', async ({target}) => {
    try {
      
      let response = await fetch('/prices/api/get-ids-local');
      let result = await response.json();
      console.log('====================================');
      console.log(result.ids);
      console.log('====================================');
     
      if((result.ids).includes(+target.value) && target.value != sessionStorage.getItem('inputIDLocal')){
        $('msg-error').hidden = false;
        target.classList.add('is-invalid');
      }else{
        $('msg-error').hidden = true;
        target.classList.remove('is-invalid');
      }
  
    } catch (error) {
      console.error(error)
    }
  });
  
  $('form-priceItem') && $('form-priceItem').addEventListener('submit', (e) => {
    e.preventDefault();
    if(!$('inputIDLocal').classList.contains('is-invalid')){
      e.target.submit();
    }
  })