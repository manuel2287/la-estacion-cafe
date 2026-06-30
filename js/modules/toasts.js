const ensureGlobalToast = () => {
    let toastEl = document.getElementById("mainToast");

    if (!toastEl) {
        const toastHost = document.createElement("div");
        toastHost.className = "position-fixed bottom-0 end-0 p-3";
        toastHost.style.zIndex = "1080";
        toastHost.innerHTML = `
            <div id="mainToast" class="toast" role="status" aria-live="polite" aria-atomic="true" data-bs-delay="1800">
                <div class="toast-body">Producto agregado</div>
            </div>
        `;
        document.body.appendChild(toastHost);
        toastEl = toastHost.querySelector("#mainToast");
    }

    return toastEl;
};

export const showAddToCartMessage = (message = "Producto agregado") => {
    const toastEl = ensureGlobalToast();
    const toastBody = toastEl?.querySelector(".toast-body");

    if (toastBody) {
        toastBody.textContent = message;
    }

    if (toastEl && typeof bootstrap !== "undefined" && bootstrap.Toast) {
        bootstrap.Toast.getOrCreateInstance(toastEl).show();
    }
};

export const initToastButtons = () => {
    const toastButtons = document.querySelectorAll(".js-show-toast");

    toastButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            showAddToCartMessage(btn.dataset.toastMessage || "Producto agregado");
        });
    });
};
