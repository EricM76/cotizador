
/* obtener información */
$('cloths').disabled = true;
$('colors').disabled = true;
$('supports').disabled = true;
$('patterns').disabled = true;
$('chains').disabled = true;
$('width').disabled = true;
$('heigth').disabled = true;
$('reference').disabled = true;

sessionStorage.getItem('orderInProcess') && sessionStorage.removeItem('orderInProcess');
sessionStorage.getItem('observations') && sessionStorage.removeItem('observations');
localStorage.getItem('selected') && localStorage.removeItem('selected');
localStorage.getItem('dataOrder') && localStorage.removeItem('dataOrder');

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
    $('amount-box').setAttribute('hidden', true)
    $('errorHeigth').innerHTML = null;
    $('errorWidth').innerHTML = null


    try {

        $('spinner').hidden = false;


        const response = await fetch(`/quoters/api/load/${target.value}`);
        const result = await response.json();
        console.log(result)

        $('cloths').disabled = false;
        $('colors').disabled = false;
        $('supports').disabled = false;
        $('patterns').disabled = false;
        $('chains').disabled = false;
        $('width').disabled = false;
        $('heigth').disabled = false;
        $('reference').disabled = false;
        $('spinner').hidden = true;

        let { cloths, colors, supports, patterns, chains } = result.data;

        cloths = cloths.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        colors = colors.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        supports = supports.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        patterns = patterns.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        chains = chains.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);

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
        $('reference').value = null;
    } catch (error) {
        console.error(error)
    }
}

$('systems').addEventListener('change', async ({ target }) => {

    getData(target);

    /* 114: GUIAS */
    if (target.value == 114) {
        $('large-box').classList.remove('box-hidden');
        $('colors-box').classList.remove('box-hidden');

        $('railWidth-box').classList.add('box-hidden');
        $('width-box').classList.add('box-hidden');
        $('cloths-box').classList.add('box-hidden');
        $('supports-box').classList.add('box-hidden');
        $('patterns-box').classList.add('box-hidden');
        $('chains-box').classList.add('box-hidden');
        $('heigth-box').classList.add('box-hidden');

        $('large').value = null;

        /* 127: CENEFA */
    } else if (target.value == 127) {
        $('large-box').classList.remove('box-hidden');
        $('colors-box').classList.remove('box-hidden');
        $('supports-box').classList.remove('box-hidden');

        $('railWidth-box').classList.add('box-hidden');
        $('width-box').classList.add('box-hidden');
        $('cloths-box').classList.add('box-hidden');
        $('patterns-box').classList.add('box-hidden');
        $('chains-box').classList.add('box-hidden');
        $('heigth-box').classList.add('box-hidden');

        $('large').value = null;

        /* 179: BANDAS */
    } else if (target.value == 179) {
        $('railWidth-box').classList.remove('box-hidden');
        $('large-box').classList.remove('box-hidden');
        $('cloths-box').classList.remove('box-hidden');
        $('colors-box').classList.remove('box-hidden');
        $('heigth-box').classList.remove('box-hidden');
        $('supports-box').classList.remove('box-hidden');
        $('patterns-box').classList.remove('box-hidden');
        $('chains-box').classList.remove('box-hidden');

        $('width-box').classList.add('box-hidden');
        $('large-box').classList.add('box-hidden');

        $('heigth').value = null;
        $('railWidth').value = null;

    } else if (target.value == 112 || target.value == 116 || target.value == 129 || target.value == 130) {
        $('width-box').classList.remove('box-hidden');
        $('cloths-box').classList.remove('box-hidden');
        $('colors-box').classList.remove('box-hidden');
        $('supports-box').classList.remove('box-hidden');
        $('patterns-box').classList.remove('box-hidden');
        $('heigth-box').classList.remove('box-hidden');

        $('railWidth-box').classList.add('box-hidden');
        $('large-box').classList.add('box-hidden');
        $('chains-box').classList.add('box-hidden');

    } else {
        $('width-box').classList.remove('box-hidden');
        $('cloths-box').classList.remove('box-hidden');
        $('colors-box').classList.remove('box-hidden');
        $('supports-box').classList.remove('box-hidden');
        $('patterns-box').classList.remove('box-hidden');
        $('chains-box').classList.remove('box-hidden');
        $('heigth-box').classList.remove('box-hidden');

        $('railWidth-box').classList.add('box-hidden');
        $('large-box').classList.add('box-hidden');
    }

});

$('systems').addEventListener('focus', async (e) => {

    let elements = e.path[3].elements;

    for (let index = 0; index < elements.length; index++) {
        elements[index].classList.remove('is-invalid')
    }


})

/* validar datos */
$('systems').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})

$('cloths').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('colors').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('supports').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('patterns').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('chains').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('width').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('railWidth').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('heigth').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})
$('reference').addEventListener('focus', ({ target }) => {

    target.classList.remove('is-invalid')

})

$('cloths').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})
$('colors').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})
$('supports').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})
$('patterns').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})
$('chains').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})
$('width').addEventListener('blur', ({ target }) => {
    switch ($('systems').value) {
        case '113': //roller
            if (+target.value > 270) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 270 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                target.classList.remove('is-invalid')
                $('errorWidth').innerHTML = null
            }
            break;
        case '111': //romanas
            if (+target.value > 170) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 170 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null
                target.classList.remove('is-invalid')
            }
            break;
        case '112': //paneles orientales
            if (+target.value > 350) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 350 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;
        case '127': //cenefa
            if (+target.value > 280) {
                $('errorHeigth').innerHTML = `El ancho máximo permitido es de 280 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        case '114': //guias (laterales)
            if (+target.value > 280) {
                $('errorHeigth').innerHTML = `El ancho máximo permitido es de 280 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        case '179': //bandas verticales
            if (+target.value > 300) {
                $('errorHeigth').innerHTML = `El ancho máximo permitido es de 300 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        default:
            break;
    }

})
//guias (laterales)
$('large').addEventListener('blur', ({ target }) => {
    if (+target.value > 280) {
        target.classList.add('is-invalid')
    } else if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})

$('railWidth').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})
$('heigth').addEventListener('blur', ({ target }) => {
    switch ($('systems').value) {
        case '113': //roller
            if (+target.value > 300) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 300 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;
        case '111': //romanas
            if (+target.value > 260) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 260 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;
        case '112': //paneles orientales
            if (+target.value > 310) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 310 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;
        case '116': //triple pellizco
        case '129': //pellizco simple
        case '130': //pellizco doble
            if (+target.value > 250) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 250 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;
        case '179': //bandas verticales
            if (+target.value > 250) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 250 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        default:
            break;
    }
})
$('reference').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})

$('rol') && $('rol').addEventListener('change', async () => {
    
    if ($('systems').value) {

        await sendForm()

    } 
})

/* enviar formulario */

$('form-quoter').addEventListener('submit', async (e) => {
   
    e.preventDefault();
    await sendForm();

})

const sendForm = async () => {
    let elements = $('form-quoter').elements;
    let error = false;

    if ($('systems').value == 114) {
        $('cloths').value = 626; //tela: ninguno
        $('supports').value = 18 //soporte: ninguno;
        $('patterns').value = 6; //modelo: ninguno
        $('chains').value = 6; //cadena: 0.0
        $('heigth').value = 0;
        $('width').value = 0;
        $('railWidth').value = 0;

    } else if ($('systems').value == 127) {
        $('cloths').value = 626; //tela: ninguno
        $('patterns').value = 6; //modelo: ninguno
        $('chains').value = 6; //cadena: 0.0
        $('heigth').value = 0;
        $('width').value = 0;
        $('railWidth').value = 0;

    } else if ($('systems').value == 179) {
        $('large').value = 0;
        $('width').value = 0;
    } else if($('systems').value == 112){
        $('large').value = 0;
        $('railWidth').value = 0;
        $('chains').value = 6; //cadena: 0.0
    } else if($('systems').value == 116 || $('systems').value == 129 || $('systems').value == 130){
        $('chains').value = 6; //cadena: 0.0
        $('large').value = 0;
        $('railWidth').value = 0;
    } else {
        $('large').value = 0;
        $('railWidth').value = 0;
    }

    for (let i = 0; i < elements.length - 1; i++) {

        if (!elements[i].value || elements[i].classList.contains('is-invalid')) {
            error = true;
            elements[i].classList.add('is-invalid');
        
            $('amount-box').setAttribute('hidden', true)
        }
        console.log(elements[i].name, elements[i].value)

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
                    railWidth: $('railWidth').value.trim(),
                    heigth: $('heigth').value.trim(),
                    reference: $('reference').value.trim(),
                    rol: $('rol') ? $('rol').value : 1,
                    large: $('large').value
                })
            });
            const result = await response.json();
            if (result.ok) {
                console.log('====================================');
                console.log('RESPUESTA DE LA API',result.ok);
                console.log('====================================');

                $('amount-box').classList.add('alert-success')
                $('amount-box').classList.remove('alert-danger')
                $('amount-box').removeAttribute('hidden', false)
                $('amount').classList.remove('h6')
                $('amount').classList.add('h4')
                $('amount').innerHTML = result.rol !== 3 ? `Monto: $ ${result.data}` : 'Producto encontrado';
            } else {
                $('amount-box').classList.remove('alert-success')
                $('amount-box').classList.add('alert-danger')
                $('amount-box').removeAttribute('hidden', false)
                $('amount').classList.add('h6')
                $('amount').classList.remove('h4')
                $('amount').innerHTML = `El producto no se encuentra en la lista de precios`
            }

        } catch (error) {
            console.error(error)
        }
    }
}
