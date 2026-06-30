import { readCart, writeCart } from "./cart-store.js";
import { escapeHtml, formatCurrency } from "./format.js";

export const initOrderDetail = () => {
    const orderDetailPage = document.querySelector(".js-order-detail");

    if (!orderDetailPage) {
        return;
    }

    const rowsContainer = orderDetailPage.querySelector(".js-order-rows");
    const totalLabel = orderDetailPage.querySelector(".js-order-total");
    const emptyState = orderDetailPage.querySelector("#detalle-empty");
    const confirmButton = orderDetailPage.querySelector("#confirmOrderBtn");
    const feedback = orderDetailPage.querySelector("#detalle-feedback");
    const promoButton = orderDetailPage.querySelector(".js-apply-promo");
    const promoMessage = orderDetailPage.querySelector(".js-promo-message");

    let cart = readCart();

    const saveCart = () => {
        writeCart(cart);
    };

    const updateTotal = () => {
        const total = cart.reduce((sum, item) => {
            const unitPrice = Number(item.unitPrice) || 0;
            const quantity = Math.max(1, Number(item.quantity) || 1);
            return sum + unitPrice * quantity;
        }, 0);

        if (totalLabel) {
            totalLabel.textContent = formatCurrency(total);
        }

        const hasRows = cart.length > 0;
        emptyState?.classList.toggle("d-none", hasRows);

        if (confirmButton) {
            confirmButton.disabled = !hasRows;
        }
    };

    const renderRows = () => {
        if (!rowsContainer) {
            return;
        }

        rowsContainer.innerHTML = "";

        cart.forEach((item) => {
            const quantity = Math.max(1, Number(item.quantity) || 1);
            const subtotal = (Number(item.unitPrice) || 0) * quantity;
            const row = document.createElement("tr");
            row.className = "js-order-row";
            row.dataset.itemId = item.id;
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center gap-3 pedido-item-info">
                        <img src="${escapeHtml(item.image || "img/productos-cafe/cafe-caliente.png")}" alt="${escapeHtml(item.title)}" class="pedido-item-img">
                        <div>
                            <h2 class="h6 mb-1">${escapeHtml(item.title)}</h2>
                            <p class="small text-muted mb-0">${escapeHtml(item.description || "Producto agregado al pedido.")}</p>
                        </div>
                    </div>
                </td>
                <td class="text-center fw-bold">${formatCurrency(item.unitPrice)}</td>
                <td>
                    <div class="qty-control mx-auto" role="group" aria-label="Cantidad de ${escapeHtml(item.title)}">
                        <button type="button" class="btn btn-qty js-qty-decrease" aria-label="Disminuir cantidad de ${escapeHtml(item.title)}">-</button>
                        <span class="qty-value js-qty-value">${quantity}</span>
                        <button type="button" class="btn btn-qty js-qty-increase" aria-label="Aumentar cantidad de ${escapeHtml(item.title)}">+</button>
                    </div>
                </td>
                <td class="text-center fw-bold js-row-subtotal">${formatCurrency(subtotal)}</td>
                <td class="text-end"><button type="button" class="btn btn-link p-0 pedido-delete js-remove-row"><span class="delete-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7H20" stroke-width="1.6" stroke-linecap="round"/><path d="M9 4H15" stroke-width="1.6" stroke-linecap="round"/><path d="M8 7V19C8 20.1 8.9 21 10 21H14C15.1 21 16 20.1 16 19V7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 10.5V17" stroke-width="1.6" stroke-linecap="round"/><path d="M13.5 10.5V17" stroke-width="1.6" stroke-linecap="round"/></svg></span><span>Eliminar</span></button></td>
            `;
            rowsContainer.appendChild(row);
        });

        updateTotal();
    };

    rowsContainer?.addEventListener("click", (event) => {
        const row = event.target.closest(".js-order-row");
        if (!row) {
            return;
        }

        const itemId = row.dataset.itemId;
        const index = cart.findIndex((item) => item.id === itemId);
        if (index === -1) {
            return;
        }

        if (event.target.closest(".js-qty-increase")) {
            cart[index].quantity = Math.max(1, Number(cart[index].quantity) || 1) + 1;
            saveCart();
            renderRows();
            return;
        }

        if (event.target.closest(".js-qty-decrease")) {
            cart[index].quantity = Math.max(1, (Number(cart[index].quantity) || 1) - 1);
            saveCart();
            renderRows();
            return;
        }

        if (event.target.closest(".js-remove-row")) {
            cart = cart.filter((item) => item.id !== itemId);
            saveCart();
            renderRows();
        }
    });

    promoButton?.addEventListener("click", () => {
        if (promoMessage) {
            promoMessage.textContent = "Codigo valido o invalido segun disponibilidad. La promo se valida al confirmar.";
        }
    });

    confirmButton?.addEventListener("click", () => {
        feedback?.classList.remove("d-none");
        cart = [];
        saveCart();
        renderRows();
    });

    renderRows();
};
