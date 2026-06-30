const CART_STORAGE_KEY = "la-estacion-cart";
let memoryCart = [];

const hasLocalStorage = (() => {
    try {
        const testKey = "la-estacion-cart-test";
        localStorage.setItem(testKey, "1");
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
})();

export const readCart = () => {
    if (!hasLocalStorage) {
        return [...memoryCart];
    }

    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

export const writeCart = (cart) => {
    if (!Array.isArray(cart)) {
        return;
    }

    if (!hasLocalStorage) {
        memoryCart = [...cart];
        return;
    }

    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        memoryCart = [...cart];
    }
};

export const addToCart = (product) => {
    if (!product || !product.id || product.unitPrice <= 0) {
        return;
    }

    const cart = readCart();
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
        cart[existingIndex].quantity = Math.max(1, Number(cart[existingIndex].quantity) || 1) + 1;
    } else {
        cart.push(product);
    }

    writeCart(cart);
};
