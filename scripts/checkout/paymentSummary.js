import { cart } from "../../data/cart-class.js";
import { productInfo } from "../../data/products.js";
import { optionInfo } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { addOrder } from "../../data/order.js";

export function renderPaymentSummary() {
  let paymentHTML = ``;

  let totalPrice = itemsPriceAndShipping();
  let taxPrice = (totalPrice.shippingPrice + totalPrice.itemsPrice) * 0.1;
  paymentHTML += `
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${totalPrice.quantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalPrice.itemsPrice
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalPrice.shippingPrice
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalPrice.shippingPrice + totalPrice.itemsPrice
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
              taxPrice
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
              taxPrice + (totalPrice.shippingPrice + totalPrice.itemsPrice)
            )}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
       `;

  document.querySelector(".js-payment-summary").innerHTML = paymentHTML;

  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      try {
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
          }),
        });
        const order = await response.json();
        addOrder(order);
      } catch (error) {
        console.log("Unexpected error. Please try again later.");
      }

      window.location.href = "orders.html"
    });
}

function itemsPriceAndShipping() {
  let totalPrice = {
    itemsPrice: 0,
    shippingPrice: 0,
    quantity: 0,
  };

  cart.cartItems.forEach((cartItem) => {
    const product = productInfo(cartItem.productId);
    totalPrice.itemsPrice += product.priceCents * cartItem.quantity;

    const option = optionInfo(cartItem.deliveryOptionId);
    totalPrice.shippingPrice += option.priceCents;
    totalPrice.quantity += cartItem.quantity;
  });

  return totalPrice;
}
