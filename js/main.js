import { initAddCartButtons } from "./modules/add-cart-buttons.js";
import { initBootstrapUi } from "./modules/bootstrap-ui.js";
import { initFilters } from "./modules/filters.js";
import { initOrderDetail } from "./modules/order-detail.js";
import { initReservationForm } from "./modules/reservations.js";
import { initToastButtons } from "./modules/toasts.js";

document.addEventListener("DOMContentLoaded", () => {
    initBootstrapUi();
    initToastButtons();
    initAddCartButtons();
    initReservationForm();
    initFilters();
    initOrderDetail();
});
