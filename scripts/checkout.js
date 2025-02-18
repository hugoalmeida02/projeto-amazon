import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/cart-class.js";
import { loadCart } from "../data/cart-class.js";
import { loadProductsFetch } from "../data/products.js";
//import '../data/backend-practice.js'

async function loadPage() {
  try {

    //throw 'error 1'

    await loadProductsFetch();

    await new Promise((resolve, reject) => {
      //throw 'error 2'
      loadCart(() => {
        //reject('error 3')
        resolve();
      });
    });
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();

/* Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  }),
]).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
}); */

/* new Promise((resolve) => {
  loadProducts(() => {
    resolve("value1");
  });
})
  .then((value) => {
    console.log(value);
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    renderOrderSummary();
    renderPaymentSummary();
  }); */
