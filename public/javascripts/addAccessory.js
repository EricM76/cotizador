  const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  let quantities = document.querySelectorAll(".quantity");
  let subtotales = document.querySelectorAll(".subtotal");
  let btnCancel = document.getElementById("btn-cancel");
  let btnAdd = document.getElementById("btn-add");
  let total = document.getElementById("total");
  let totalQuoter = document.getElementById('totalQuoter');
  let totalLast = document.getElementById('totalLast');
  let accessories = [];

  function updateSubotal(id) {
    let error = false

    if(+document.getElementById("input" + id).value <= +document.getElementById('limit'+id).value && +document.getElementById("input" + id).value >= 0){
    let accessory = {};
    
    if($('rol').innerText !== 'medidor'){
      document.getElementById("subtotal" + id).innerHTML =
      +document.getElementById("input" + id).value *
      +document.getElementById("price" + id).innerText;
    }else{
      document.getElementById("subtotal" + id).innerHTML = "-"
    }
    
  
    let noFound = true;

    let accessoriesUpdated = accessories.map((element) => {
      if (
        element.name === document.getElementById("accessory" + id).innerText
      ) {
        element = {
          id: id,
          name: document.getElementById("accessory" + id).innerText,
          price: +document.getElementById("price" + id).innerText,
          quantity: +document.getElementById("input" + id).value,
          limit: +document.getElementById("limit" + id).value,
          subtotal: +document.getElementById("subtotal" + id).innerText,
        };
        noFound = false;
        return element;
      }
      return element;
    });

    accessoriesUpdated = accessoriesUpdated.filter(
      (element) => element.quantity !== 0
    );

    accessories = accessories !== accessoriesUpdated && accessoriesUpdated;
    
    if (noFound && +document.getElementById("input" + id).value !== 0) {
      Object.defineProperty(accessory, "id", {
        value: +id,
      });
      Object.defineProperty(accessory, "name", {
        value: document.getElementById("accessory" + id).innerText,
      });
      Object.defineProperty(accessory, "quantity", {
        value: +document.getElementById("input" + id).value,
      });
      Object.defineProperty(accessory, "limit", {
        value: +document.getElementById("limit" + id).value,
      });
      Object.defineProperty(accessory, "price", {
        value: +document.getElementById("price" + id).innerText,
      });
      Object.defineProperty(accessory, "subtotal", {
        value: +document.getElementById("subtotal" + id).innerText,
      });
      accessories.push(accessory);
    }
    $('error'+id).hidden = true;
    $('input'+id).classList.remove('is-invalid');

    updateTotal();
  }else{
    if($('input'+id).value > 0){
      $('error'+id).hidden = false
    }
    $('input'+id).classList.add('is-invalid');
    for (let i = 0; i < quantities.length; i++) {
      quantities[i].classList.contains('is-invalid')
      error = true
    }
    btnAdd.disabled = error === true ? true : false
    }
  
    btnAdd.disabled = error === true ? true : false

  }
 

  function updateTotal() {
    let prices = [];
    for (let i = 0; i < subtotales.length; i++) {
      prices.push(+subtotales[i].innerHTML);
    }
    if(!isNaN(prices.reduce((acum, sum) => acum + sum))){
      total.innerHTML = toThousand(prices.reduce((acum, sum) => acum + sum));
    }else {
      total.innerHTML = "-"
    }
  }

/*   document.getElementById('accesories-table').addEventListener('click', (e) => {
    

      if(e.target.classList.contains('quantity')){
        e.target.addEventListener('blur', (e) => {
          if(+e.target.value < 0){
            e.target.classList.add('is-invalid');
          }else{
            e.target.classList.remove('is-invalid');
          }
        })
      }

  }) */

  btnCancel.addEventListener("click", () => {
    for (let i = 0; i < quantities.length; i++) {
      quantities[i].value = null;
    }
    for (let i = 0; i < subtotales.length; i++) {
      subtotales[i].innerHTML = null;
    }
    total.innerHTML = null;
    if(totalQuoter){
      totalLast.innerHTML = toThousand(totalQuoter.innerText)
    }
    accessories = [];
    $('accessories').innerHTML = null;

  });

  btnAdd.addEventListener("click", async () => {
  
    $('accessories').innerHTML = null;
    $('accessories').innerHTML = ' <tr> </tr>';

    let prices = [];
    for (let i = 0; i < subtotales.length; i++) {
      prices.push(+subtotales[i].innerHTML);
    }
    console.log(accessories)
    if(totalQuoter){

      totalLast.innerHTML = toThousand(+totalQuoter.innerText + prices.reduce((acum, sum) => acum + sum))
    accessories.forEach(({id,quantity,limit,name,price}) => {

        $('accessories').innerHTML += `
        
        <tr>
          <th scope="row">
            ${quantity}
            <input name="quantity" value="${quantity}" hidden/>
          </th>
          <td colspan="3">
            ${name}
            <input name="name" value="${name}" hidden/>
          </td>
          <td>
          <input name="id" value="${id}" hidden/>
            </td>
            <td>
            <input name="limit" value="${limit}" hidden/>
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
              
            </td>
            <td>
                <div class="d-flex justify-content-around">
                  <span>$</span><span>${toThousand(price)}</span> 
                  <input name="price" value="${price}" hidden/>
                </div>
            </td>
            <td>
              <div class="d-flex justify-content-around">
                  <span>$</span><span>${toThousand(price * quantity)}</span> 
              </div>
            </td>
        </tr>

        `
    })
  }else{

    accessories.forEach(({id,quantity,limit,name,price}) => {

      $('accessories').innerHTML += `
      
      <tr>
        <th scope="row">
          ${quantity}
          <input name="quantity" value="${quantity}" hidden/>
        </th>
        <td colspan="3">
          ${name}
          <input name="name" value="${name}" hidden/>
        </td>
        <td>
        <input name="id" value="${id}" hidden/>
          </td>
          <td>
          <input name="limit" value="${limit}" hidden/>
          </td>
          <td>
            
          </td>
          <td>
            
          </td>
          <td>
            
          </td>
          <td>
            
          </td>
          <td>
            
          </td>
          <td>
            
          </td>
          <td>
            
          </td>
          <td>
            
          </td>
          <td>
          <input name="price" value="${price}" hidden/>
          </td>

      </tr>

      `
  })
  }
  });