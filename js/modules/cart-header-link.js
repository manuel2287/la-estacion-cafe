import { readCart } from "./cart-store.js";

const getCartQuantity = () => readCart().reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    return total + Math.max(0, quantity);
}, 0);

const updateCartHeaderLink = () => {
    const link = document.querySelector(".js-cart-header-link");
    const count = document.querySelector(".js-cart-header-count");

    if (!link || !count) {
        return;
    }

    const quantity = getCartQuantity();
    link.classList.toggle("d-none", quantity <= 0);
    count.textContent = String(quantity);
    link.setAttribute("aria-label", `Ver detalle del pedido, ${quantity} producto${quantity === 1 ? "" : "s"} en el carrito`);
};

export const initCartHeaderLink = () => {
    updateCartHeaderLink();
    window.addEventListener("cart:updated", updateCartHeaderLink);
};
