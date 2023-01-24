let supportOrientations = document.querySelectorAll('#support-orientation');
let clothOrientations = document.querySelectorAll('#cloth-orientation');
let commands = document.querySelectorAll('#command');
let quantities = document.querySelectorAll('#quantity');
let observations = document.querySelectorAll('#observations');
let btnOrdenGenerate = document.getElementById('btn-orderGenerate');
let systems = document.querySelectorAll('#system');
let accordions = document.querySelectorAll('#accordion-button')

let dataOrder = {
  supportOrientations: [],
  clothOrientations: [],
  commands: [],
  observations: []
};

let sendForm = false;



window.addEventListener('load', () => {

  if (sessionStorage.getItem('orderInProcess')) {
    btnOrdenGenerate.textContent = 'Continuar'
  }

  if (!localStorage.getItem('dataOrder')) {
    localStorage.setItem('dataOrder', JSON.stringify(dataOrder))
  } else {
    dataOrder = JSON.parse(localStorage.getItem('dataOrder'))
  }

  for (let i = 0; i < supportOrientations.length; i++) {
    supportOrientations[i].value = dataOrder.supportOrientations[i]
  }

  for (let i = 0; i < clothOrientations.length; i++) {
    clothOrientations[i].value = dataOrder.clothOrientations[i]
  }

  for (let i = 0; i < commands.length; i++) {
    if(quantities[i].value > 1){
      document.getElementById('command' + quantities[i].getAttribute('data-id')).hidden = false;
    }
    commands[i].value = dataOrder.commands[i]
  }

  for (let i = 0; i < observations.length; i++) {
    observations[i].value = observations[i].value ? dataOrder.observations[i] : null
  }

})

const updateTotal = (id,amount,event) => {
  const commandOption = document.getElementById("command" + id)
  const commandSelect = document.querySelector(".command" + id)
  const observation = document.querySelector('.observations' + id)
  if(+event.target.value > 0){
    event.target.classList.remove('is-invalid');
    $('amount'+id).value = +event.target.value * +amount;
    //console.log(id, amount,+event.target.value);
    if(+event.target.value === 2){
      commandOption.hidden = false
      observation.classList.remove('is-invalid')
      showErroObservation(true, id)
    }else if(+event.target.value >= 3 ){
      commandOption.hidden = false
      showErroObservation(false, id)
    }else{
      commandSelect.value = null;
      commandOption.hidden = true;
      observation.classList.remove('is-invalid');
      showErroObservation(true, id)
    }

    if(+event.target.value >= 3 && (commandSelect.value === "IZQ/DER" || !commandSelect.value)){
      showErroObservation(false, id)
    }else{
      showErroObservation(true, id)

    }
  }else{
    event.target.classList.add('is-invalid');
  }
}

const verifyErrors = () => {
  for (let i = 0; i < accordions.length; i++) {
    if(
    commands[i].classList.contains('is-invalid') ||
    supportOrientations[i].classList.contains('is-invalid') ||
    clothOrientations[i].classList.contains('is-invalid') ||
    quantities[i].classList.contains('is-invalid') ||
    observations[i].classList.contains('is-invalid')
    ){
      accordions[i].classList.add('bg-danger');
      $('msg-error').hidden = false;

    }else{
      accordions[i].classList.remove('bg-danger');
      $('msg-error').hidden = true;
    }
  }
};

$('form-generate-order').addEventListener('submit', (e) => {
  e.preventDefault();
  let empty = false;



  for (let i = 0; i < supportOrientations.length; i++) {
    if (supportOrientations[i].value === "") {
      empty = true
      supportOrientations[i].classList.add('is-invalid')
    }
  }

  for (let i = 0; i < clothOrientations.length; i++) {
    if (clothOrientations[i].value === "") {
      empty = true
      clothOrientations[i].classList.add('is-invalid')
    }
  }

  for (let i = 0; i < commands.length; i++) {
    if (commands[i].value === "") {
      empty = true
      commands[i].classList.add('is-invalid');
    }

    if(commands[i].value === 'IZQ/DER' && observations[i].value.trim()==="" && quantities[i].value > 2){
      empty = true
      observations[i].classList.add('is-invalid');
    }
  }

  for (let i = 0; i < quantities.length; i++) {
    if (quantities[i].value < 1) {
      empty = true
      quantities[i].classList.add('is-invalid');
    }
  };


  for (let i = 0; i < observations.length; i++) {

    if(commands[i].value === 'IZQ/DER' && observations[i].value.trim()==="" && quantities[i].value > 2){
      empty = true
      observations[i].classList.add('is-invalid');
    }
  }

  for (let i = 0; i < quantities.length; i++) {
    if (quantities[i].value < 1) {
      empty = true
      quantities[i].classList.add('is-invalid');
    }
  };

 
 verifyErrors();

  if (!empty) {
   /*  $('btn-backQuotations').classList.add('disabled');
    $('btn-orderGenerate').classList.add('disabled'); */
    let dataOrder = {
      supportOrientations: [],
      clothOrientations: [],
      commands: [],
      observations: []
    };

    sessionStorage.setItem('orderInProcess', true);
    localStorage.setItem('dataOrder', JSON.stringify(dataOrder));

    for (let i = 0; i < supportOrientations.length; i++) {
    
        dataOrder = {
          ...dataOrder,
          supportOrientations: [...dataOrder.supportOrientations, supportOrientations[i].value]
        }
      
  
    }
    for (let i = 0; i < clothOrientations.length; i++) {
  
        dataOrder = {
          ...dataOrder,
          clothOrientations: [...dataOrder.clothOrientations, clothOrientations[i].value]
        }
      
    }

    for (let i = 0; i < commands.length; i++) {
   
        dataOrder = {
          ...dataOrder,
          commands: [...dataOrder.commands, commands[i].value]
        }
  
    }
  
    for (let i = 0; i < observations.length; i++) {
  
        dataOrder = {
          ...dataOrder,
          observations: [...dataOrder.observations, observations[i].value]
        }
      
    }

    localStorage.setItem('dataOrder', JSON.stringify(dataOrder));
    sendForm = true
    e.target.submit()
  }

 
});

const showObservation = ({target},id) => {
 
  if(target.value === "IZQ/DER" && document.querySelector('.quantity' + id).value > 2){
   /*  Swal.fire({
      icon: 'warning',
      title:'Aclarar en las observaciones',
      text: 'Ejemplo: 2 der / 1 izq',
      confirmButtonText : 'Entendido',
      confirmButtonColor : '#990000'
    }) */
    showErroObservation(false, id);
  }
  else{
    showErroObservation(true, id);
    document.querySelector('.observations' + id).classList.remove('is-invalid')
  }
}

const showErroObservation = (show, id) => {

  document.getElementById('observationError' + id).hidden = show;

}