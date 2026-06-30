export const initReservationForm = () => {
    const reservationForm = document.getElementById("reservationForm");

    if (!reservationForm) {
        return;
    }

    reservationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const modalEl = document.getElementById("reservationModal");

        if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }

        reservationForm.reset();
    });
};
