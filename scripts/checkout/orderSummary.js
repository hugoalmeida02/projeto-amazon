import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { productInfo } from "../../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions, optionInfo, calculateDeliveryDate } from "../../data/deliveryOptions.js";
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
  cart.forEach((cartItem) => {
    let product = productInfo(cartItem.productId);
    let deliveryOption = optionInfo(cartItem.deliveryOptionId);

    const deliveryDate = calculateDeliveryDate(deliveryOption);

    carSummaryHtml += `
    <div class="cart-item-container js-cart-item-container js-container-${product.id}">
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
                  $${formatCurrency(product.priceCents)}
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
                  </span>
                  <span class="update-quantity-link link-primary js-update" data-product-id="${
                    product.id
                  }">
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
      removeFromCart(productId);

      document.querySelector(`.js-container-${productId}`).remove();

      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId, deliveryOptionId } = link.dataset;
      updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      let container = document.querySelector(`.js-quantity-${productId}`);
      container.innerHTML = `
      <input type="number" class="input-update js-quantity-update-${productId}" value="1">
      <span class="update-quantity-link link-primary js-save" data-product-id="${productId}">
                    Save
                  </span>`;
      link.innerHTML = ``;

      document.querySelectorAll(".js-save").forEach((link1) => {
        link1.addEventListener("click", () => {
          const productId = link1.dataset.productId;

          const input = document.querySelector(
            `.js-quantity-update-${productId}`
          );
          let quantity = input.value;

          quantity = Math.round(quantity);
          if (quantity === 0) {
            removeFromCart(productId);

            document.querySelector(`.js-container-${productId}`).remove();

            renderPaymentSummary();
          } else if (quantity < 0) {
            window.alert(`Not a valid quantity`);
          } else {
            cart.forEach((cartItem) => {
              if (cartItem.productId === productId) {
                cartItem.quantity = quantity;

                container.innerHTML = `${cartItem.quantity}`;

                link.innerHTML = `Update`;
                renderPaymentSummary();
                localStorage.setItem("cart", JSON.stringify(cart));
              }
            });
          }
        });
      });
    });
  });
}
