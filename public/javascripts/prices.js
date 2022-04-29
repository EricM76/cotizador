console.log("prices.js connected success");

window.addEventListener("load", async () => {
  let query = new URLSearchParams(window.location.search);

  if (query.has("update")) {
    Swal.fire({
      icon: "success",
      title: "Precio actualizado",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  if (query.has("create")) {
    Swal.fire({
      icon: "success",
      title: "Precio agregado",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  if(query.has("updateAll")){
        Swal.fire({
          icon: "success",
          title: "Todos los precios fueron actualizados",
          showConfirmButton: false,
          timer: 1500,
        });
  }

  try {
    let response = await fetch("/systems/api/get-all");
    let result = await response.json();

    if($('systems')){
      $("systems").innerHTML = null;
      $(
        "systems"
      ).innerHTML += `<option value="" selected hidden>Seleccione el sistema...</option>`;
      result.data.forEach((item) => {
        $(
          "systems"
        ).innerHTML += `<option value="${item.id}">${item.name}</option>`;
      });
    }
  
  } catch (error) {
    console.error(error);
  }
});

$('systems') && $("systems").addEventListener("change", async (e) => {
  $("box-data").hidden = true;
  try {
    let response = await fetch(
      "/prices/api/get-data-by-system/" + e.target.value
    );
    let result = await response.json();

    console.log(result);

    if (result.ok) {
      const { cloths, colors } = result.data;

      $("cloths").innerHTML = null;
      $("cloths").disabled = false;
      cloths.forEach((item) => {
        $(
          "cloths"
        ).innerHTML += `<option value="" selected hidden>Seleccione la tela...</option>`;
        $(
          "cloths"
        ).innerHTML += `<option value="${item.id}">${item.name}</option>`;
      });

      $("colors").innerHTML = null;
      $("colors").disabled = false;
      $(
        "colors"
      ).innerHTML += `<option value="" selected hidden>Seleccione el color...</option>`;
      colors.forEach((item) => {
        $(
          "colors"
        ).innerHTML += `<option value="${item.id}">${item.name}</option>`;
      });
    }
  } catch (error) {
    console.error(error);
  }
});

$("cloths") && $("cloths").addEventListener("change", ({ target }) => {
  if ($("colors").value !== "" && target.value !== "") {
    $("btn-getPrice").disabled = false;
  }
  $("box-data").hidden = true;
});

$("colors") && $("colors").addEventListener("change", ({ target }) => {
  if ($("cloths").value !== "" && target.value !== "") {
    $("btn-getPrice").disabled = false;
  }
  $("box-data").hidden = true;
});

$("btn-getPrice") && $("btn-getPrice").addEventListener("click", async (e) => {
  e.preventDefault();
  sessionStorage.removeItem('idLocal');

  try {
    let response = await fetch("/prices/api/get-price", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        systemId: $("systems").value,
        clothId: $("cloths").value,
        colorId: $("colors").value,
      }),
    });
    let result = await response.json();
    console.log(result);
    $("btn-getPrice").disabled = true;

    /*  $('btn-cancel').hidden = false;
        $('btn-updatePrice').hidden = false;
        $('box-inputPrice').hidden = false;
        $('box-inputIDLocal').hidden = false; */
    $("box-data").hidden = false;

    if (result.ok) {
      $("errorPrice").hidden = true;
      $("inputPrice").value = result.data.amount;
      $("inputIDLocal").value = result.data.idLocal;
      $("enabled").checked = result.data.visible ? true : false;
      $("btn-remove").hidden = false;

      sessionStorage.setItem('idLocal',result.data.idLocal);

    } else {
      $("inputPrice").value = null;
      $("inputIDLocal").value = null;
      $("errorPrice").hidden = false;
      $("btn-updatePrice").textContent = "Guardar";
      $("btn-remove").hidden = true;
    }
  } catch (error) {
    console.error;
  }
});

$("inputPrice") && $("inputPrice").addEventListener("focus", ({ target }) => {
  $("errorPrice").hidden = true;

  target.select();
});

$("btn-cancel") && $("btn-cancel").addEventListener("click", () => {
  console.log("clean!");
  window.location.href = "/prices/edit/item";
});

$("btn-remove") && $("btn-remove").addEventListener("click", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "¿Está seguro que quiere eliminar este precio?",
    showDenyButton: true,
    confirmButtonText: "Si, eliminalo",
    confirmButtonColor : "#8B0000",
    denyButtonText: `Cancelar`,
    denyButtonColor: "#BCC6CC"
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      try {
        let response = await fetch("/prices/api/remove", {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            systemId: $("systems").value,
            clothId: $("cloths").value,
            colorId: $("colors").value,
          }),
        });
        let result = await response.json();
        if (result.ok) {
          Swal.fire({
            icon: "success",
            title: "Precio eliminado",
            showConfirmButton: false,
            timer: 1500,
          });
          window.location.href = '/prices'
        }
      } catch (error) {
        console.error;
      }
    }
  });
});

$('btn-apply') && $('btn-apply').addEventListener('blur',() => {
    $('form-updatePriceGlobal').classList.remove('was-validated')
});

$('coefficient') && $('coefficient').addEventListener('focus', () => {
  $('coefficient').classList.remove('is-invalid')

})

$('coefficient') && $('coefficient') && $('coefficient').addEventListener('change', (e) => {
  e.target.classList.add('is-valid')
})

$('form-updatePriceGlobal') && $('form-updatePriceGlobal').addEventListener('submit', (e) => {
  e.preventDefault()
  if($('coefficient').value !== ""){
    $('coefficient').classList.remove('is-invalid');
    $('btn-apply').disabled = true;
    e.target.submit()
  }else{
    $('coefficient').classList.add('is-invalid')
  }
})

$('inputIDLocal') && $('inputIDLocal').addEventListener('keydown', async ({target}) => {
  try {
    
    let response = await fetch('/prices/api/get-ids-local');
    let result = await response.json();
    console.log('====================================');
    console.log(sessionStorage.getItem('idLocal'));
    console.log('====================================');
   
    if((result.ids).includes(+target.value) && target.value != sessionStorage.getItem('idLocal')){
      $('msg-error').hidden = false;
      target.classList.add('is-invalid');
    }else{
      $('msg-error').hidden = true;
      target.classList.remove('is-invalid');
    }

  } catch (error) {
    console.error(error)
  }
})

