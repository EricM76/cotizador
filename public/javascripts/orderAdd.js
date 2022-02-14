let supportOrientations = document.querySelectorAll('#support-orientation');
let clothOrientations = document.querySelectorAll('#cloth-orientation');
let commands = document.querySelectorAll('#command');

$('form-generate-order').addEventListener('submit', (e) => {
  e.preventDefault();
  let empty = false;
  for (let i = 0; i < supportOrientations.length; i++) {
    if(supportOrientations[i].value === ""){
      empty = true
      supportOrientations[i].classList.add('is-invalid')
    }
  }
  for (let i = 0; i < clothOrientations.length; i++) {
    if(clothOrientations[i].value === ""){
      empty = true
      clothOrientations[i].classList.add('is-invalid')
    }    }
  for (let i = 0; i < commands.length; i++) {
    if(commands[i].value === ""){
      empty = true
      commands[i].classList.add('is-invalid')
    }    }
  !empty && e.target.submit()
})