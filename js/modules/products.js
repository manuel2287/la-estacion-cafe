import { parsePriceText, slugify } from "./format.js";

export const getProductFromButton = (button) => {
    const explicitPrice = Number(button.dataset.cartPrice || 0);
    if (button.dataset.cartId && button.dataset.cartTitle && explicitPrice > 0) {
        return {
            id: button.dataset.cartId,
            title: button.dataset.cartTitle,
            description: button.dataset.cartDescription || "",
            unitPrice: explicitPrice,
            image: button.dataset.cartImage || "",
            quantity: 1,
        };
    }

    const itemContainer = button.closest(".js-filter-item");
    const card = itemContainer || button.closest(".card") || button.closest("article") || button.parentElement;
    if (!card) {
        return null;
    }

    const titleEl = card.querySelector("h2, h3, h4, .card-title");
    const descriptionEl = card.querySelector("p.small, .card-text, p");
    const imageEl = card.querySelector("img");
    const priceEl = card.querySelector(".menu-price, .tienda-price, .price, [class*='price']");

    const title = titleEl?.textContent?.trim() || "Producto";
    const description = descriptionEl?.textContent?.trim() || "";
    const unitPrice = Number(itemContainer?.dataset.price || card.dataset.price) || parsePriceText(priceEl?.textContent) || 0;
    const image = imageEl?.getAttribute("src") || "";
    const id = `${slugify(title)}-${unitPrice}`;

    return {
        id,
        title,
        description,
        unitPrice,
        image,
        quantity: 1,
    };
};
