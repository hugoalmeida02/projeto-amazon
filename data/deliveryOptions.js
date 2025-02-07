import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export function optionInfo(cartItemdeliveryOptionId) {
  let matchingOption;
  deliveryOptions.forEach((option) => {
    if (option.id === cartItemdeliveryOptionId) {
      matchingOption = option;
    }
  });
  return matchingOption;
}

export function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  const deliveryDateFormat = deliveryDate.format("dddd, MMMM DD");

  return deliveryDateFormat;
}

export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];
