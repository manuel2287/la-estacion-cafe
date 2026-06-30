import { addToCart } from "./cart-store.js";
import { getProductFromButton } from "./products.js";
import { showAddToCartMessage } from "./toasts.js";

export const initAddCartButtons = () => {
    const addCartButtons = document.querySelectorAll(".js-add-cart");

    addCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const product = getProductFromButton(button);
            addToCart(product);
            showAddToCartMessage("Producto agregado");
        });
    });
};
