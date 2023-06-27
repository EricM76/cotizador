
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

        /*  $('systems').innerHTML = null;
         $('systems').innerHTML += `<option value="" selected hidden>Seleccione...</option>`
         $('systems').innerHTML += `<option value="113">Roller</option>`
         $('systems').innerHTML += `<option value="111">Romanas</option>`
         $('systems').innerHTML += `<option value="112">Paneles Orientales</option>`
         $('systems').innerHTML += `<option value="179">Bandas Verticales</option>`
         $('systems').innerHTML += `<option value="129">Pellizco Simple</option>`
         $('systems').innerHTML += `<option value="130">Pellizco Doble</option>`
         $('systems').innerHTML += `<option value="116">Triple Pellizco</option>`
         $('systems').innerHTML += `<option value="127">Cenefa</option>`
         $('systems').innerHTML += `<option value="114">Guías</option>` */

        $('systems').innerHTML = null;
        $('systems').innerHTML += `<option value="" selected hidden>Seleccione...</option>`
        /* result.data.forEach(item => {
            $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>`
        }) */
        result.data.forEach(item => {
            item.id == 113 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        });
        result.data.forEach(item => {
            item.id == 111 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        });
        result.data.forEach(item => {
            item.id == 112 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        });
        result.data.forEach(item => {
            item.id == 179 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        });
        result.data.forEach(item => {
            item.id == 129 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        })
        result.data.forEach(item => {
            item.id == 130 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        })
        result.data.forEach(item => {
            item.id == 116 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        })
        result.data.forEach(item => {
            item.id == 127 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        })
        result.data.forEach(item => {
            item.id == 114 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        })
        result.data.forEach(item => {
            item.id == 119 ? $('systems').innerHTML += `<option value="${item.id}">${item.name}</option>` : null
        })
        result.data.forEach(({ id, name }) => {
            id != 113 && id != 111 && id != 112 && id != 179 && id != 129 && id != 130 && id != 116 && id != 127 && id != 114 && id != 119 ? $('systems').innerHTML += `<option value="${id}">${name}</option>` : null
        })

    } catch (error) {
        console.error(error)
    }

})

const getData = async (target) => {
    $('amountQuoter-box').setAttribute('hidden', true)
    $('errorHeigth').innerHTML = null;
    $('errorWidth').innerHTML = null

    sessionStorage.removeItem('chains');

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

        let { cloths, colors, supports, patterns, chains } = result.data;

        cloths = cloths.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        colors = colors.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        supports = supports.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        patterns = patterns.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
        chains = chains.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);

        sessionStorage.setItem('chains', JSON.stringify(chains));

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
            $('patterns').innerHTML += `<option value="${pattern.id}" ${pattern.id == 3 && target.value == 111 ? 'selected' : pattern.id == 2 && target.value != 111 ? 'selected' : null}  >${pattern.name}</option>`
        })

        if (chains.length > 0) {
            /* $('chains').innerHTML = `<option value = "" selected hidden>Seleccione...</option>`; */
            chains.forEach(chain => {
                $('chains').innerHTML += `<option ${chain.id === 1 && 'selected'} value="${chain.id}">${chain.name}</option>`
            })
        } else {
            $('chains').innerHTML = `<option value="0">0</option>`;

        }
        $('width').value = null;
        $('large').value = null;
        $('heigth').value = null;
        $('referenceQuoter').value = null;

        $('suggestionHeigth').innerHTML = null;
        $('suggestionHeigth').classList.remove('alert-warning');

        $('errorLarge').innerHTML = null;


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
    
        /* 119: VISILLO */
    } else if (target.value == 119) { 
        $('heigth-box').classList.remove('box-hidden');
        $('colors-box').classList.remove('box-hidden');
        $('width-box').classList.remove('box-hidden');
        $('cloths-box').classList.remove('box-hidden');

        $('large-box').classList.add('box-hidden');
        $('railWidth-box').classList.add('box-hidden');
        $('supports-box').classList.add('box-hidden');
        $('patterns-box').classList.add('box-hidden');
        $('chains-box').classList.add('box-hidden');

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
        $('chains-box').classList.remove('box-hidden');

        $('railWidth-box').classList.add('box-hidden');
        $('large-box').classList.add('box-hidden');

        $('chains').classList.remove('is-invalid');
        $('chains').innerHTML = null;
        $('chains').disabled = true;

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
$('referenceQuoter').addEventListener('focus', ({ target }) => {

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
});

$('patterns').addEventListener('change', ({ target }) => {
    if (+target.value === 3 || +target.value === 4) {
        $('chains').disabled = true;
        $('chains').classList.remove('is-invalid');
        $('chains').innerHTML = null;
        $('chains').innerHTML = `<option value="6">0</option>`;
    } else {
        $('chains').disabled = false;
        /*  $('chains').innerHTML = `<option value = "" selected hidden>Seleccione...</option>`; */
        $('chains').innerHTML = null;
        JSON.parse(sessionStorage.getItem('chains')).forEach(chain => {
            $('chains').innerHTML += `<option ${chain.id === 1 && 'selected'} value="${chain.id}">${chain.name}</option>`
        })
    }
})
$('chains').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
})
/* 
$('large').addEventListener('change', ({ target }) => {
    switch ($('systems').value) {
        case '127': //cenefa
            if (+target.value > 280) {
                $('errorLarge').innerHTML = `El ancho máximo permitido es de 280 cm`;
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorLarge').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break

        default:
            break;
    }
}) */



const checkWidthMax = async (target) => {

    const response = await fetch(`/cloths/api/${$('cloths').value}`);
    const { ok, cloth } = await response.json();

    if (cloth.traversedCut && +target.value > cloth.width) {
        $('errorWidth').innerHTML = `Supera el ancho del rollo`;
        target.classList.add('is-invalid')
        return null
    }

    switch ($('systems').value) {
        case '113': //roller
        case '119': //visillo
            if (+target.value > 270) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 270 cm`;
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null
            }
            break;
        case '111': //romanas
            if (+target.value > 170) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 170 cm`;
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
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;

        case '114': //guias (laterales)
            if (+target.value > 280) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 280 cm`;
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        case '179': //bandas verticales
            if (+target.value > 300) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 300 cm`;
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        case '116': //triple pellizco
        case '129': //pellizco simple
        case '130': //pellizco doble
            if (+target.value > 270) {
                $('errorWidth').innerHTML = `El ancho máximo permitido es de 270 cm`;
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        default:
            break;
    }
};

const checkWidthValue = async (target) => {

    const response = await fetch(`/cloths/api/${$('cloths').value}`);
    const { ok, cloth } = await response.json();

    if (cloth.traversedCut && +target.value > cloth.width) {
        $('errorWidth').innerHTML = `Supera el ancho del rollo`;
        target.classList.add('is-invalid')
        return null
    }

    switch ($('systems').value) {
        case '113': //roller
        case '119': //visillo
            if (+target.value > 270) {
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
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;

        case '114': //guias (laterales)
            if (+target.value > 280) {
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        case '179': //bandas verticales
            if (+target.value > 300) {
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        case '116': //triple pellizco
        case '129': //pellizco simple
        case '130': //pellizco doble
            if (+target.value > 270) {
                target.classList.add('is-invalid')
            } else if (!target.value) {
                target.classList.add('is-invalid')
            } else {
                $('errorWidth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        default:
            break;
    }
}
$('width').addEventListener('keyup', ({ target }) => {
    checkWidthMax(target)
});

$('width').addEventListener('change', ({ target }) => {
    checkWidthMax(target)
})

$('width').addEventListener('blur', ({ target }) => {
    checkWidthValue(target)
})

/* GUIAS */
const checkLargeMax = (target) => {
    if (+target.value > 280) {
        target.classList.add('is-invalid')
        $('errorLarge').innerHTML = `El largo máximo permitido es de 280 cm`;
    } else {
        target.classList.remove('is-invalid');
        $('errorLarge').innerHTML = null
    }
};

const checkLargeValue = (target) => {
    if (+target.value > 280) {
        target.classList.add('is-invalid')
    } else if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid');
        $('errorLarge').innerHTML = null
    }
}
$('large').addEventListener('keyup', ({ target }) => {
   checkLargeMax(target)
});

$('large').addEventListener('change', ({ target }) => {
    checkLargeMax(target)
 });

$('large').addEventListener('blur', ({ target }) => {
  checkLargeValue(target)
});

const checkRailWidthValue = (target) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
}
$('railWidth').addEventListener('blur', ({ target }) => {
    checkRailWidthValue(target)
  });


  const checkHeigthChain = (target) => {
    let text;
    if ($('systems').value === "113") {
            switch (true) {
                case target.value > 10 && +target.value <= 200:
                    text = "Largo de cadena recomendada 2.00 mts"
                    break;
                case target.value > 10 && +target.value <= 225:
                    text = "Largo de cadena recomendada 2.50 mts"
                    break;
                case target.value > 10 && +target.value <= 250:
                    text = "Largo de cadena recomendada 3.00 mts"
                    break;
                case target.value > 10 && +target.value <= 275:
                    text = "Largo de cadena recomendada 3.50 mts"
                    break;
                case target.value > 10 && +target.value <= 300:
                    text = "Largo de cadena recomendada 4.00 mts"
                    break;
                case target.value > 10 && +target.value <= 325:
                    text = "Largo de cadena recomendada 4.50 mts"
                    break;
                case target.value > 10 && +target.value <= 350:
                    text = "Largo de cadena recomendada 5.00 mts"
                    break;
                default:
                    $('suggestionHeigth').innerHTML = null;
                    $('suggestionHeigth').classList.remove('alert-warning')
                    break;
            }
            if(text){
                $('suggestionHeigth').classList.add('alert-warning')
                $('suggestionHeigth').innerHTML = `<i class="fas fa-info-circle"></i> ${text}` ;
            }
          
    }
}

$('heigth').addEventListener('keyup', ({target}) => {
    checkHeigthChain(target)
});

const checkHeigthMax = (target) => {
    switch ($('systems').value) {
        case '113': //roller
        case '119': //visillo
            if (+target.value > 300) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 300 cm`;
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
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;
        case '112': //paneles orientales
            if (+target.value > 310) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 310 cm`;
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
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break;
        case '179': //bandas verticales
            if (+target.value > 270) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 270 cm`;
                target.classList.add('is-invalid')
            } else {
                $('errorHeigth').innerHTML = null;
                target.classList.remove('is-invalid')
            }
            break
        default:
            break;
    }
}

const checkHeigthValue = (target) => {
    switch ($('systems').value) {
        case '113': //roller
        case '119': //visillo
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
            if (+target.value > 270) {
                $('errorHeigth').innerHTML = `El alto máximo permitido es de 270 cm`;
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
}

$('heigth').addEventListener('keyup', ({ target }) => {
    checkHeigthMax(target)
});

$('heigth').addEventListener('change', ({ target }) => {
    checkHeigthMax(target)
});

$('heigth').addEventListener('blur', ({ target }) => {
    checkHeigthValue(target)
});


const checkHeigthDecimal = (target) => {
    const regex = /[,.]/g;

    let text =  $('errorHeigth').innerHTML
    if(target.value && (target.value < 10 || regex.test(target.value))) {
        $('errorHeigth').innerHTML = `La medida debe ser expresada en centímetros`;
        target.classList.add('is-invalid')
    }

    if(!target.value){
        target.classList.add('is-invalid')
        $('errorHeigth').innerHTML = null;
    }
}

$('heigth').addEventListener('blur', ({target}) => {
    checkHeigthDecimal(target)
    
}); 

$('heigth').addEventListener('change', ({target}) => {
    checkHeigthDecimal(target)
    
}); 

$('heigth').addEventListener('keyup', ({target}) => {
    checkHeigthDecimal(target)
    
}); 

const checkWidthDecimal = (target) => {
    const regex = /[,.]/g;
    if(target.value && (regex.test(target.value) || target.value < 10)) {
        target.classList.add('is-invalid')
        $('errorWidth').innerHTML = `El ancho debe ser expresado en centímetros`;
    }

    if(!target.value){
        target.classList.add('is-invalid')
        $('errorWidth').innerHTML = null;
    }
}

$('width').addEventListener('blur', ({target}) => {
    checkWidthDecimal(target)
});

$('width').addEventListener('change', ({target}) => {
    checkWidthDecimal(target)
});

$('width').addEventListener('keyup', ({target}) => {
    checkWidthDecimal(target)
});

const checkRailWidthDecimal = (target) => {
    const regex = /[,.]/g;
    if(target.value && (regex.test(target.value) || target.value < 10)) {
        target.classList.add('is-invalid')
        $('errorRailWidth').innerHTML = `El ancho debe ser expresado en centímetros`;
    }else {
        target.classList.remove('is-invalid')
        $('errorRailWidth').innerHTML = null;
    }

    if(!target.value){
        target.classList.add('is-invalid')
        $('errorRailWidth').innerHTML = null;
    }
}

$('railWidth').addEventListener('blur', ({target}) => {
    checkRailWidthDecimal(target);
});
$('railWidth').addEventListener('keyup', ({target}) => {
    checkRailWidthDecimal(target);
});
$('railWidth').addEventListener('change', ({target}) => {
    checkRailWidthDecimal(target);
});


const checkLargeDecimal = (target) => {
    const regex = /[,.]/g;

    if(!target.value){
        target.classList.add('is-invalid')
        $('errorLarge').innerHTML = null;
    }

    if(target.value && (regex.test(target.value) || target.value < 10)) {
        target.classList.add('is-invalid')
        $('errorLarge').innerHTML = `El largo debe ser expresado en centímetros`;
    } 
}

$('large').addEventListener('blur', ({target}) => {
    checkLargeDecimal(target)
});

$('large').addEventListener('keyup', ({target}) => {
    checkLargeDecimal(target)
});

$('large').addEventListener('change', ({target}) => {
    checkLargeDecimal(target)
});

$('referenceQuoter').addEventListener('blur', ({ target }) => {
    if (!target.value) {
        target.classList.add('is-invalid')
    } else {
        target.classList.remove('is-invalid')
    }
});

const setLineBlack = (state) => {
    $('lineBlack').value = state;

}

/* enviar formulario */

$('form-quoter').addEventListener('submit', async (e) => {
    e.preventDefault();
    let elements = e.target.elements
    let error = false;

    const response = await fetch(`/cloths/api/${$('cloths').value}`);
    const { ok, cloth } = await response.json();
    
    if (cloth.traversedCut) {
        if (
            +$('width').value > (cloth.width)
            || +$('width').value > (cloth.width) && +$('heigth').value >= (cloth.width - 20 + 1)
        ) {
            Swal.fire({
                title: 'Corte de tela incorrecto',
                html: `El ancho de no pude exceder el ancho del rollo. El de la tela <i>${cloth.name}</i> es de <b>${cloth.width} cm</b>. <a target="_blank" href="/information/cloth-width">Ver todos los anchos</a>`,
                icon: 'error',
                confirmButtonColor: '#8B0000',
                confirmButtonText: 'Entendido'
            })
            return null
        }
    }else if (cloth.width > 0
        && (
            +$('width').value > (cloth.width) && +$('heigth').value > cloth.width
            || +$('width').value > (cloth.width) && +$('heigth').value > (cloth.width)
            || +$('width').value > (cloth.width) && +$('heigth').value >= (cloth.width - 20 + 1))

    ) {
        Swal.fire({
            title: 'Dimensiones excedidas',
            html: `El ancho y el alto (+20) no puden exceder <b>al mismo tiempo </b> el ancho del rollo. El de la tela <i>${cloth.name}</i> es de <b>${cloth.width} cm</b>. <a target="_blank" href="/information/cloth-width">Ver todos los anchos</a>`,
            icon: 'error',
            confirmButtonColor: '#8B0000',
            confirmButtonText: 'Entendido'
        });
        return null
    }

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

    } else if ($('systems').value == 119) { //visillo
        $('supports').value = 18 //soporte: ninguno;
        $('patterns').value = 6; //modelo: ninguno
        $('chains').value = 6; //cadena: 0.0
        $('railWidth').value = 0;
        $('large').value = 0;

    } else if ($('systems').value == 179) {
        $('large').value = 0;
        $('width').value = 0;
    } else if ($('systems').value == 112) {
        $('large').value = 0;
        $('railWidth').value = 0;
        $('chains').value = 6; //cadena: 0.0
    } else if ($('systems').value == 116 || $('systems').value == 129 || $('systems').value == 130) {
        $('chains').value = 6; //cadena: 0.0
        $('large').value = 0;
        $('railWidth').value = 0;
    } else {
        $('large').value = 0;
        $('railWidth').value = 0;
    }

    for (let i = 0; i < elements.length - 2; i++) {

        if (!elements[i].value || elements[i].classList.contains('is-invalid')) {
            error = true;
            elements[i].classList.add('is-invalid');
            $('amountQuoter-box').setAttribute('hidden', true)

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
                    heigth: $('heigth').value.trim(),
                    reference: $('referenceQuoter').value.trim(),
                    rol: $('rol') ? $('rol').value : 1,
                    large: $('large').value,
                    railWidth: $('railWidth').value.trim(),
                    lineBlack: $('lineBlack').value
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
                $('amountQuoter').innerHTML = result.rol !== 3 ? `Monto: $ ${result.data}` : 'Producto encontrado';

                $('btn-cancel-formModal').classList.add('disabled');
                $('btn-send-formModal').classList.add('disabled');

                if (window.location.pathname === '/quoters' || window.location.pathname === '/quoters/filter') {

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Agregando a sus cotizaciones...',
                        showConfirmButton: false,
                        timer: 1500,
                        didClose: () => {
                            window.location.reload()
                        }
                    })

                } else {
                    let query = new URLSearchParams(window.location.search);
                    let ids = JSON.parse(query.get('quoters'));
                    ids.push(result.quotation.id)
                    localStorage.setItem('selected', JSON.stringify(ids))
                    console.log(ids)
                    window.location.href = `/orders/add?quoters=[${ids}]`
                    let timerInterval
                    Swal.fire({
                        title: 'Agregando cotización...',
                        html: 'Espere <b></b> segundos.',
                        timer: 3000,
                        timerProgressBar: true,
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading()
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                                b.textContent = Swal.getTimerLeft() / 100
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                            console.log('I was closed by the timer')
                        }
                    })
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

