
/* obtener información */
$('cloths').disabled = true;
$('colors').disabled = true;
$('supports').disabled = true;
$('patterns').disabled = true;
$('chains').disabled = true;
$('width').disabled = true;
$('heigth').disabled = true;
$('referenceQuoter').disabled = true;

window.addEventListener('load', async () => {

    try {

        let response = await fetch('/systems/api/get-all');
        let result = await response.json();

        $('systems').innerHTML = null;
        $('systems').innerHTML += `<option value="" selected hidden>Seleccione...</option>`
        result.data.forEach(item => {
            $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>`
        })

    } catch (error) {
        console.error(error)
    }

})

const getData = async (target) => {
    $('amountQuoter-box').setAttribute('hidden', true)


    try {
      
        $('spinner').hidden = false;


        const response = await fetch(`/quoters/api/load/${target.value}`);
        const result = await response.json();

        $('cloths').disabled = false;
        $('colors').disabled = false;
        $('supports').disabled = false;
        $('patterns').disabled = false;
        $('chains').disabled = false;
        $('width').disabled = false;
        $('heigth').disabled = false;
        $('referenceQuoter').disabled = false;
        $('spinner').hidden = true;

        const { cloths, colors, supports, patterns, chains } = result.data;

        $('cloths').innerHTML = `<option value = "" selected hidden>Seleccione...</option>`;
        cloths.forEach(cloth => {
            $('cloths').innerHTML += `<option value="${cloth.id}">${cloth.name}</option>`
        })

        $('colors').innerHTML = `<option value = "" selected hidden>Seleccione...</option>`;
        colors.forEach(color => {
            $('colors').innerHTML += `<option value="${color.id}">${color.name}</option>`
        })

        $('supports').innerHTML = `<option value = "" selected hidden>Seleccione...</option>`;
        supports.forEach(support => {
            $('supports').innerHTML += `<option value="${support.id}">${support.name}</option>`
        })

        $('patterns').innerHTML = `<option value = "" selected hidden>Seleccione...</option>`;
        patterns.forEach(pattern => {
            $('patterns').innerHTML += `<option value="${pattern.id}">${pattern.name}</option>`
        })

        if (chains.length > 0) {
            $('chains').innerHTML = `<option value = "" selected hidden>Seleccione...</option>`;
            chains.forEach(chain => {
                $('chains').innerHTML += `<option value="${chain.id}">${chain.name}</option>`
            })
        } else {
            $('chains').innerHTML = `<option value="0">0</option>`;

        }
        $('width').value = null;
        $('heigth').value = null;
        $('referenceQuoter').value = null;
    } catch (error) {
        console.error(error)
    }
}

$('systems').addEventListener('change', async ({ target }) => {

    getData(target);

    if(target.value == 112 || target.value == 179){
        $('width-box').classList.add('box-hidden')
        $('railWidth-box').classList.remove('box-hidden')
    }else{
        $('width-box').classList.remove('box-hidden')
        $('railWidth-box').classList.add('box-hidden')
    }

});

$('systems').addEventListener('focus', async (e) => {

    let elements = e.path[3].elements;

    for (let index = 0; index < elements.length; index++) {
        elements[index].classList.remove('is-invalid')   
    }
 

})

/* validar datos */
$('systems').addEventListener('focus', ({target}) => {

    target.classList.remove('is-invalid')

})

$('cloths').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})
$('colors').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})
$('supports').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})
$('patterns').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})
$('chains').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})
$('width').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})
$('railWidth').addEventListener('focus', ({target}) => {

    target.classList.remove('is-invalid')

})
$('heigth').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})
$('referenceQuoter').addEventListener('focus', ({target}) => {

     target.classList.remove('is-invalid')

})

$('cloths').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('colors').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('supports').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('patterns').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('chains').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('width').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('railWidth').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('heigth').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })
   $('referenceQuoter').addEventListener('blur', ({target}) => {
    if(!target.value){
        target.classList.add('is-invalid')
    }else{
        target.classList.remove('is-invalid')
    }
   })

/* enviar formulario */

$('form-quoter').addEventListener('submit', async (e) => {
    e.preventDefault();
    let elements = e.target.elements
    let error = false;

    if($('railWidth-box').classList.contains('box-hidden')){
        $('railWidth').value = "none"
    }
    if($('width-box').classList.contains('box-hidden')){
        $('width').value = "none"
    }

    for (let i = 0; i < elements.length - 1; i++) {

        if (!elements[i].value) {
            error = true;
            elements[i].classList.add('is-invalid');
          
        }
    }
    if (!error) {
        try {
            const response = await fetch(`/quoters/api/quote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    system: $('systems').value,
                    cloth: $('cloths').value,
                    color: $('colors').value,
                    support: $('supports').value,
                    pattern: $('patterns').value,
                    chain: $('chains').value,
                    width: $('width').value.trim(),
                    heigth: $('heigth').value.trim(),
                    reference: $('referenceQuoter').value.trim()
                })
            });
            const result = await response.json();
            console.log(result)
            if (result.ok) {
                $('amountQuoter-box').classList.add('alert-success')
                $('amountQuoter-box').classList.remove('alert-danger')
                $('amountQuoter-box').removeAttribute('hidden', false)
                $('amountQuoter').classList.remove('h6')
                $('amountQuoter').classList.add('h4')
                $('amountQuoter').innerHTML = `Monto: $ ${result.data}`;

                if(window.location.pathname === '/quoters'){
                    window.location.reload()
                }else{
                    let query = new URLSearchParams(window.location.search);
                    let ids = JSON.parse(query.get('quoters'));
                    ids.push(result.id)
                    localStorage.setItem('selected', JSON.stringify(ids))
                    console.log(ids)
                    window.location.href = `/orders/add?quoters=[${ids}]`
                }

            } else {
                $('amountQuoter-box').classList.remove('alert-success')
                $('amountQuoter-box').classList.add('alert-danger')
                $('amountQuoter-box').removeAttribute('hidden', false)
                $('amountQuoter').classList.add('h6')
                $('amountQuoter').classList.remove('h4')
                $('amountQuoter').innerHTML = `El producto no se encuentra en la lista de precios`
            }

        } catch (error) {
            console.error(error)
        }
    }
})
