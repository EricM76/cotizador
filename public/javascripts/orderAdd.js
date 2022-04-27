let supportOrientations = document.querySelectorAll('#support-orientation');
let clothOrientations = document.querySelectorAll('#cloth-orientation');
let commands = document.querySelectorAll('#command');
let observations = document.querySelectorAll('#observations');
let btnOrdenGenerate = document.getElementById('btn-orderGenerate');
let systems = document.querySelectorAll('#system')

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
    commands[i].value = dataOrder.commands[i]
  }

  for (let i = 0; i < observations.length; i++) {
    observations[i].value = observations[i].value ? dataOrder.observations[i] : null
  }

})

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
      commands[i].classList.add('is-invalid')
    }
  }

  if (!empty) {

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