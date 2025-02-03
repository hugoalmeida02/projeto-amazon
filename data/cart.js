export const cart = []

export function addToCart(productId) {
    let matchingProduct;
  
    cart.forEach((product) => {
      if (product.productId === productId) {
        matchingProduct = product;
      }
    });
  
    if (matchingProduct) {
      matchingProduct.quantity++;
    } else {
      cart.push({
        productId,
        quantity: 1,
      });
    }
  }


