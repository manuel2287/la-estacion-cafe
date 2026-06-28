document.addEventListener("DOMContentLoaded", () => {
    const tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipList.forEach((el) => new bootstrap.Tooltip(el));

    const popoverList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverList.forEach((el) => new bootstrap.Popover(el));

    const toastEl = document.getElementById("mainToast");
    const toast = toastEl ? new bootstrap.Toast(toastEl) : null;

    const toastButtons = document.querySelectorAll(".js-show-toast, .js-add-cart");
    toastButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (toast) {
                toast.show();
            }
        });
    });

    const reservationForm = document.getElementById("reservationForm");
    if (reservationForm) {
        reservationForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const modalEl = document.getElementById("reservationModal");
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
            reservationForm.reset();
        });
    }
});
