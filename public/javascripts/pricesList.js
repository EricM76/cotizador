$('systems') && $("systems").addEventListener("change", async (e) => {
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

        viewData(e.target.value)
      }
    } catch (error) {
      console.error(error);
    }
  });

  $('cloths').addEventListener('change', ({target}) => {

    viewData($('systems').value, target.value)

  });

  $('colors').addEventListener('change', ({target}) => {

    viewData($('systems').value,$('cloths').value, target.value)

  })

  const viewData =  async (system,cloth,color) => {

    try {
        
        let response = await fetch(`/prices/api/filter/${system}/${cloth}/${color}`);
        let result = await response.json();

        console.log(result);

        $('table').innerHTML = null;
        if(result.ok){
        result.data.items.forEach(item => {
            $('table').innerHTML += `
            <tr>
            <th scope="row">
              ${item.id }
            </th>
            <td>
              ${ item.system.name }
            </td>
            <td>
              ${ item.cloth.name }
            </td>
            <td>
              ${ item.color.name }
            </td>
            <td>
              ${ item.idLocal }
            </td>
            <td>
              ${ item.amount }
            </td>
            <td class="d-flex">
              <a class="btn btn-sm btn-success mx-1" style="width:33px;"
                href="/prices/edit/${ item.id }"><i class="fas fa-edit"></i></a>
                <a class="btn btn-sm btn-danger mx-1" style="width:33px;" onclick="removePrice(${item.id})"><i
                    class="fas fa-trash"></i></a>
            </td>
            <td>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="visible${ item.id }"
                  ${item.visible && 'checked' } onchange="changeVisibility(${item.id})">
              </div>
            </td>
          </tr>
    
            `
        })
        $('total').innerHTML = `(${result.data.total})`
        $('head').hidden = false; 
        $('empty').hidden = true; 

        } else {
            $('total').innerHTML = null
            $('head').hidden = true; 
            $('empty').hidden = false; 

        }

    } catch (error) {
        console.error(error)
    }

      
  }

  const changeVisibility = async (id) => {
    try {

        let response = await fetch(`/prices/api/visibility/${id}`, {
            method: 'POST'
        });
        let result = await response.json()
        console.log(result)

    } catch (error) {
        console.error(error)
    }
}

const removePrice = (id) => {

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
          let response = await fetch("/prices/api/remove-item", {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              id,
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
           
            viewData("undefined","undefined","undefined")

          }
        } catch (error) {
          console.error;
        }
      }
    });
  };