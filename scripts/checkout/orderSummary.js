import { cart } from "../../data/cart-class.js";
import { productInfo } from "../../data/products.js";
import {
  deliveryOptions,
  optionInfo,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { renderPaymentSummary } from "./paymentSummary.js";

function deliveryOptionsHTML(cartItem, productId) {
  let deliveryHTML = ``;

  deliveryOptions.forEach((deliveryOption) => {
    const deliveryDate = calculateDeliveryDate(deliveryOption);

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${(deliveryOption.priceCents / 100).toFixed(2)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    deliveryHTML += `
  <div class="delivery-option js-delivery-option"
  data-product-id="${productId}"
  data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${isChecked ? `checked` : ``}
                  class="delivery-option-input"
                  name="delivery-option-${productId}"
                  data-product-id="">
                <div>
                  <div class="delivery-option-date">
                    ${deliveryDate}
                  </div>
                  <div class="delivery-option-price">
                    ${priceString} Shipping
                  </div>
                </div>
              </div>
  `;
  });

  return deliveryHTML;
}

export function renderOrderSummary() {
  let carSummaryHtml = ``;
  cart.cartItems.forEach((cartItem) => {
    let product = productInfo(cartItem.productId);
    let deliveryOption = optionInfo(cartItem.deliveryOptionId);

    const deliveryDate = calculateDeliveryDate(deliveryOption);

    carSummaryHtml += `
    <div class="cart-item-container js-cart-item-container js-container-${
      product.id
    }">
            <div class="delivery-date">
              Delivery date: ${deliveryDate}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${product.image}">

              <div class="cart-item-details">
                <div class="product-name">
                ${product.name}
                </div>
                <div class="product-price">
                ${product.getPrice()}
                </div>
                <div class="product-quantity js-quantity-container-${
                  product.id
                }">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-${
                      product.id
                    }">
                    ${cartItem.quantity}
                  </span>
                  <input type="number" value="1" class="input-quantity js-quantity-update-${
                    product.id
                  }" style="display: none;">
                  <span class="update-quantity-link link-primary js-save-${
                    product.id
                  }" data-product-id="${product.id}" style="display: none;">
                    Save
                  </span>
                  <span class="update-quantity-link link-primary js-update" data-product-id="${
                    product.id
                  }" style="display: inline-block;">
                    Update
                  </span>
                  <span data-product-id="${
                    product.id
                  }"class="delete-quantity-link link-primary js-delete">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(cartItem, product.id)}
              </div>
            </div>
          </div>`;

    document.querySelector(".js-order-summary").innerHTML = carSummaryHtml;
  });

  document.querySelectorAll(".js-delete").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      document.querySelector(`.js-container-${productId}`).remove();

      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId, deliveryOptionId } = link.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      let container = document.querySelector(`.js-quantity-${productId}`);
      link.style.display = "none";

      const saveBtn = document.querySelector(`.js-save-${productId}`);
      const input = document.querySelector(`.js-quantity-update-${productId}`);

      saveBtn.style.display = "inline-block";
      input.style.display = "inline-block";

      saveBtn.addEventListener("click", () => {
        const productId = saveBtn.dataset.productId;

        let quantity = input.value;

        quantity = Math.round(quantity);
        if (quantity === 0) {
          cart.removeFromCart(productId);

          document.querySelector(`.js-container-${productId}`).remove();

          renderPaymentSummary();
        } else if (quantity < 0) {
          window.alert(`Not a valid quantity`);
        } else {
          cart.cartItems.forEach((cartItem) => {

            if (cartItem.productId === productId) {
              cartItem.quantity = quantity;

              container.innerHTML = `${quantity}`;
              renderPaymentSummary();
            }
          });
          link.style.display = "inline-block";
          saveBtn.style.display = "none";
          input.style.display = "none";

          cart.saveToStorage()
        }
      });
    });
  });
}
