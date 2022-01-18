$('systems').addEventListener('change', async ({target}) => {
    
    $('amount-box').setAttribute('hidden',true)


    try {
        $('cloths').disabled = true;
        $('colors').disabled = true;
        $('supports').disabled = true;
        $('patterns').disabled = true;
        $('chains').disabled = true;
        $('width').disabled = true;
        $('heigth').disabled = true;
        $('reference').disabled = true;
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
        $('reference').disabled = false;
        $('spinner').hidden = true;

        const {cloths, colors, supports, patterns, chains} = result.data;

        $('cloths').innerHTML = `<option selected hidden>Seleccione...</option>`;
        cloths.forEach(cloth => { 
            $('cloths').innerHTML += `<option value="${cloth.id}">${cloth.name}</option>`
        }) 

        $('colors').innerHTML = `<option selected hidden>Seleccione...</option>`;
        colors.forEach(color => { 
            $('colors').innerHTML += `<option value="${color.id}">${color.name}</option>`
        }) 

        $('supports').innerHTML = `<option selected hidden>Seleccione...</option>`;
        supports.forEach(support => { 
            $('supports').innerHTML += `<option value="${support.id}">${support.name}</option>`
        })

        $('patterns').innerHTML = `<option selected hidden>Seleccione...</option>`;
        patterns.forEach(pattern => { 
            $('patterns').innerHTML += `<option value="${pattern.id}">${pattern.name}</option>`
        }) 

        if(chains.length > 0){
            $('chains').innerHTML = `<option selected hidden>Seleccione...</option>`;
            chains.forEach(chain => { 
                $('chains').innerHTML += `<option value="${chain.id}">${chain.name}</option>`
            }) 
        }else{
            $('chains').innerHTML = `<option value="0">0</option>`;

        }
    } catch (error) {
        console.error(error)
    }

})

$('form-quoter').addEventListener('submit',async (e) => {
    e.preventDefault();

    //console.log(system,cloth,color)

    try {
        const response = await fetch(`/quoters/api/quote`,{
            method : 'POST',
            headers :{
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                system : $('systems').value,
                cloth : $('cloths').value,
                color : $('colors').value,
                support : $('supports').value,
                pattern : $('patterns').value,
                chain : $('chains').value,
                width : $('width').value.trim(),
                heigth : $('heigth').value.trim(),
                reference : $('reference').value.trim()
            })
        });
        const result = await response.json();
        
        if (result.data){
            $('amount-box').classList.add('alert-success')
            $('amount-box').classList.remove('alert-danger')
            $('amount-box').removeAttribute('hidden',false)
            $('amount').classList.remove('h6')
            $('amount').classList.add('h4')
            $('amount').innerHTML = `Monto: $ ${result.data}`;
        }else{
            $('amount-box').classList.remove('alert-success')
            $('amount-box').classList.add('alert-danger')
            $('amount-box').removeAttribute('hidden',false)
            $('amount').classList.add('h6')
            $('amount').classList.remove('h4')
            $('amount').innerHTML = `El producto no se encuentra en la lista de precios`
        }  

    } catch (error) {
        console.error(error)
    }

})