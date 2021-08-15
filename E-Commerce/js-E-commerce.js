// variables 
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const BannerBtn =  document.querySelector(".banner-btn");
const footerYear = document.querySelector('.footer-year');
const buttonLeftSetting = document.querySelector(".menu-btn-bar-left");
const settingOverlay= document.querySelector(".overly-setting");
const settingBar = document.querySelector(".left-setting-bar");
const CloseBarSetting = document.querySelector(".btn-close")







// cart 
let cart = [ ] 

// buttons  
let buttonsDOM = [];

// getting products 
class Products  {
  async getProducts() {
    try {
        let result = await fetch("products.json"); 
        let data = await result.json(); 

        let products = data.items;
        products  = products.map(item => {
            // get the details
        const {title , price } = item.fields; 
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title , price , id , image }
      })
        return products;
    } catch (error) {
        console.log(error);
     }
    }
}

// display the products
class UI {
  displayProducts(products) {
   let result = ' ' ;
   products.forEach(product => {
  result +=`
  </div>
  <!-- single product -->
         <article class="product">
            <div class="img-container">

                <img  
                 src= ${product.image }
                 alt="product"
                  class="product-img" 
                 >

                <button class="bag-btn" data-id= ${product.id}>
                    <i class="fas fa-shopping-cart"></i> 
                    add to bag
                </button>
            </div>
            <h3> ${product.title} </h3>
            <h4> $ ${ product.price} </h4>
         </article> 
         <!-- end of single product -->
         
     </div>
 </section>
 <!--  end of products -->
  `;
   });
   productsDOM.innerHTML = result;
  } 

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")]; 

    buttonsDOM = buttons ;

    buttons.forEach(button => {
    let id = button.dataset.id;
    let inCart = cart.find(item=> item.id === id );

    if(inCart) {
      button.textContent = "in cart"; 
      button.disabled = true ;
    } 
      button.addEventListener("click" , event => {
      button.textContent = " in cart";
      button.disabled = true; 

      // get product from products  
      let cartItem =  {...Storage.getProducts(id) , amount :1 };
      // add product to the cart 
      cart = [...cart , cartItem ];
      // save card in local storage
      Storage.saveCart(cart);
      // set cart values  

      this.setCartValues (cart)
      // diplay cart item 
      this.addCartItem(cartItem);
      // show the cart 
      this.ShowCart();

      });
    }); 
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(item => {
      tempTotal +=  item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText  = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    console.log(cartTotal, cartItems);
  }
  addCartItem(item){
    const div = document.createElement("div");
    div.classList.add('cart-item');
    div.innerHTML =  `
    <img src=${item.image}>
    <div>
        <h4>${item.title}</h4>
        <h5> $ ${item.price} </h5>
        <span class="remove-item" data-id=${item.id} >remove </span>
    </div>
    <div>
        <i class="fas fa-chevron-up" data-id=${item.id} ></i>
        <p class="item-amount"> ${item.amount} </p>
        <i class="fas fa-chevron-down" data-id=${item.id} ></i>
    </div>
    ` ;
    cartContent.appendChild(div);
  }
  ShowCart () {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP() {
     cart =Storage.getCart();
     this.setCartValues(cart); 
     this.populateCart(cart);
     cartBtn.addEventListener("click" ,this.ShowCart);
     closeCartBtn.addEventListener("click" , this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  cartLogic(){ 
    clearCartBtn.addEventListener("click" , ()=> {
      this.clearCart();
      console.log(" it works not")
    });
    // cart  funcationality 
    cartContent.addEventListener("click" , event => {


      // if one : for remove item 
      // we use if condition 
      // the idea is : if you click in this element and this element has this class css > do this 

         if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        // here we used  js DOM > dealing with Childes and remove it 
       cartContent.removeChild(removeItem.parentElement.parentElement);
         }

        // if tow  :  for increacing the product 
        if(event.target.classList.contains("fa-chevron-up")) {
          let addAmount = event.target;
          let id  = addAmount.dataset.id;
          let tempItem = cart.find(item => item.id === id);
          tempItem.amount = tempItem.amount + 1;
          Storage.saveCart(cart);
          this.setCartValues(cart);
          addAmount.nextElementSibling.innerText = tempItem.amount; 
        }


        // if three  : for dicreacing the product 
           if(event.target.classList.contains("fa-chevron-down")) {
            let LowerAmount = event.target;
            let id = LowerAmount.dataset.id;
            let tempItem = cart.find(item => item.id === id);
          tempItem.amount = tempItem.amount - 1 ;
              // so when the amount will be 0 the element will be removed as you like in remove btn
              if(tempItem.amount > 0) {
                Storage.saveCart(cart);
                this.setCartValues(cart);
                LowerAmount.previousElementSibling.innerHTML =  tempItem.amount;

              }else {
                cartContent.removeChild(LowerAmount.parentElement.parentElement);
                this.removeItem(id);
              }
             
          }

    })
  }
  clearCart() {
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id)) 
    while(cartContent.children.length >0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false ;
   button.innerHTML = `<i class="fas fa-shopping-cart"> </i>add to cart `;
  } 
  getSingleButton(id) {
    return buttonsDOM.find(button=> button.dataset.id ===  id)
  }

}

// local storage                                                  
class Storage{

   static SaveProducts(products){
        localStorage.setItem("products" , JSON.stringify(products));
   } 
   static getProducts(id) {
     let products  =JSON.parse(localStorage.getItem('products')); 
     return products.find(product => product.id === id); 
   }
   static saveCart(cart) {
     localStorage.setItem('cart' , JSON.stringify(cart))
   }
   static getCart() {
     return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
   }
}

document.addEventListener("DOMContentLoaded" , ()=> {
const ui = new UI();
const products = new  Products();
// setup app 
ui.setupAPP();
// get all products
products.getProducts().then(products => {
  ui.displayProducts(products);
  Storage.SaveProducts(products);
   }).then(() => {
     ui.getBagButtons();
     ui.cartLogic();
   }); 
});

/* 
 stop in 03:15:00
*/




// more js  
BannerBtn.addEventListener("click" , function() {

  const x = window.innerHeight ;
  
  const Xbig  = x + 300;

 scroll(0 , Xbig);
});


// footer year  > get year date 


let getdate = () => {

let XDAte = new Date();
const YearDate = XDAte.getFullYear();
  footerYear.textContent =` ${YearDate}` ;

}
getdate();




// btn setting 
buttonLeftSetting.addEventListener("click" , function() {
  // add style to the elements 
  settingOverlay.classList.toggle("show-left-overlay-setting");
  settingBar.classList.toggle("show-left-setiing-bar");
});

// close the nav setting
CloseBarSetting.addEventListener("click" , function() {
  // 
  settingOverlay.classList.toggle("show-left-overlay-setting");
  settingBar.classList.toggle("show-left-setiing-bar");
});








 // 3:40:00





