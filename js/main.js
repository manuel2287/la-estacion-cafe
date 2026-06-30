document.addEventListener("DOMContentLoaded", () => {
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

    const parsePriceText = (value) => {
        if (!value) {
            return 0;
        }

        const normalized = value.toString().replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".");
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? Math.round(parsed) : 0;
    };

    const formatCurrency = (value) => `$${Number(value).toLocaleString("es-AR")}`;

    const readCart = () => {
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

    const writeCart = (cart) => {
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

    const slugify = (value) =>
        value
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    const getProductFromButton = (button) => {
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

    const addToCart = (product) => {
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

    const tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipList.forEach((el) => new bootstrap.Tooltip(el));

    const popoverList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverList.forEach((el) => new bootstrap.Popover(el));

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

    const showAddToCartMessage = (message = "Producto agregado") => {
        const toastEl = ensureGlobalToast();
        const toastBody = toastEl?.querySelector(".toast-body");

        if (toastBody) {
            toastBody.textContent = message;
        }

        if (toastEl && typeof bootstrap !== "undefined" && bootstrap.Toast) {
            bootstrap.Toast.getOrCreateInstance(toastEl).show();
        }
    };

    const toastButtons = document.querySelectorAll(".js-show-toast");
    toastButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            showAddToCartMessage(btn.dataset.toastMessage || "Producto agregado");
        });
    });

    const addCartButtons = document.querySelectorAll(".js-add-cart");
    addCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const product = getProductFromButton(button);
            addToCart(product);
            showAddToCartMessage("Producto agregado");
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

    const normalizeText = (value) =>
        value
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const filterPanels = document.querySelectorAll(".js-filter-panel");

    filterPanels.forEach((panel) => {
        const target = document.querySelector(panel.dataset.filterTarget);
        const emptyState = document.querySelector(panel.dataset.emptyTarget);
        const searchInput = panel.querySelector(".js-filter-search");
        const priceRange = panel.querySelector(".js-price-range");
        const priceMinInput = panel.querySelector(".js-price-min");
        const priceMaxInput = panel.querySelector(".js-price-max");
        const activeFilters = panel.querySelector(".js-active-filters");
        const checkboxes = panel.querySelectorAll(".js-filter-check");
        const categoryLinks = panel.querySelectorAll(".js-filter-category");
        const clearButtons = panel.querySelectorAll(".js-filter-clear");
        const applyButtons = panel.querySelectorAll(".js-apply-filters");

        if (!target) {
            return;
        }

        const items = target.querySelectorAll(".js-filter-item");

        const getFilterLabel = (value) => {
            const checkbox = panel.querySelector(`.js-filter-check[value="${value}"]`);
            if (checkbox) {
                return panel.querySelector(`label[for="${checkbox.id}"]`)?.textContent.trim() || value;
            }

            const category = panel.querySelector(`.js-filter-category[data-filter-value="${value}"]`);
            return category?.textContent.trim() || value;
        };

        const getActiveValues = () => {
            const selectedValues = [...checkboxes]
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.value);

            if (panel.dataset.activeCategory) {
                selectedValues.unshift(panel.dataset.activeCategory);
            }

            return selectedValues;
        };

        const formatPrice = (value) => `$${Number(value).toLocaleString("es-AR")}`;

        const getPriceBounds = () => {
            const defaultMin = priceRange ? Number(priceRange.min) : 0;
            const defaultMax = priceRange ? Number(priceRange.max) : Number.POSITIVE_INFINITY;
            let min = priceMinInput ? Number(priceMinInput.value) : defaultMin;
            let max = priceMaxInput ? Number(priceMaxInput.value) : defaultMax;

            min = Number.isFinite(min) ? min : defaultMin;
            max = Number.isFinite(max) ? max : defaultMax;

            if (min > max) {
                [min, max] = [max, min];
            }

            return { min, max, defaultMin, defaultMax };
        };

        const isPriceFilterActive = () => {
            const { min, max, defaultMin, defaultMax } = getPriceBounds();
            return min > defaultMin || max < defaultMax;
        };

        const renderActiveFilters = () => {
            if (!activeFilters) {
                return;
            }

            const values = getActiveValues();
            const searchTerm = searchInput ? searchInput.value.trim() : "";
            const { min, max } = getPriceBounds();
            const hasPriceFilter = isPriceFilterActive();
            activeFilters.innerHTML = "";

            if (!values.length && !searchTerm && !hasPriceFilter) {
                const emptyLabel = document.createElement("span");
                emptyLabel.className = "text-muted small";
                emptyLabel.textContent = "Sin filtros aplicados";
                activeFilters.appendChild(emptyLabel);
                return;
            }

            if (searchTerm) {
                activeFilters.appendChild(createFilterBadge(`Buscar: ${searchTerm}`, "search", searchTerm));
            }

            if (hasPriceFilter) {
                activeFilters.appendChild(createFilterBadge(`${formatPrice(min)} - ${formatPrice(max)}`, "price", "price"));
            }

            values.forEach((value) => {
                activeFilters.appendChild(createFilterBadge(getFilterLabel(value), "value", value));
            });
        };

        const applyFilters = () => {
            const selectedValues = getActiveValues().map(normalizeText);
            const searchTerm = searchInput ? normalizeText(searchInput.value) : "";
            const { min, max } = getPriceBounds();
            let visibleCount = 0;

            items.forEach((item) => {
                const haystack = normalizeText(`${item.dataset.filterTags || ""} ${item.textContent}`);
                const price = Number(item.dataset.price);
                const matchesSearch = !searchTerm || haystack.includes(searchTerm);
                const matchesFilters = selectedValues.every((value) => haystack.includes(value));
                const matchesPrice = !Number.isFinite(price) || (price >= min && price <= max);
                const isVisible = matchesSearch && matchesFilters && matchesPrice;

                item.classList.toggle("d-none", !isVisible);
                if (isVisible) {
                    visibleCount += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("d-none", visibleCount > 0);
            }

            renderActiveFilters();
        };

        const clearFilters = () => {
            delete panel.dataset.activeCategory;
            if (searchInput) {
                searchInput.value = "";
            }
            if (priceRange) {
                priceRange.value = priceRange.max;
            }
            if (priceMinInput) {
                priceMinInput.value = priceRange ? priceRange.min : "0";
            }
            if (priceMaxInput && priceRange) {
                priceMaxInput.value = priceRange.max;
            }
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
            categoryLinks.forEach((link) => {
                link.classList.remove("text-primary");
                link.removeAttribute("aria-current");
            });
            applyFilters();
        };

        const createFilterBadge = (label, type, value) => {
            const badge = document.createElement("button");
            badge.type = "button";
            badge.className = "badge filter-tag js-remove-filter";
            badge.dataset.filterType = type;
            badge.dataset.filterValue = value;
            badge.textContent = `${label} ×`;
            return badge;
        };

        searchInput?.addEventListener("input", applyFilters);

        priceRange?.addEventListener("input", () => {
            if (priceMaxInput) {
                priceMaxInput.value = priceRange.value;
            }
            applyFilters();
        });

        priceMinInput?.addEventListener("input", applyFilters);

        priceMaxInput?.addEventListener("input", () => {
            if (priceRange) {
                priceRange.value = priceMaxInput.value;
            }
            applyFilters();
        });

        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", applyFilters);
        });

        categoryLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                panel.dataset.activeCategory = link.dataset.filterValue;
                categoryLinks.forEach((categoryLink) => {
                    categoryLink.classList.remove("text-primary");
                    categoryLink.removeAttribute("aria-current");
                });
                link.classList.add("text-primary");
                link.setAttribute("aria-current", "true");
                applyFilters();
            });
        });

        clearButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                clearFilters();
            });
        });

        applyButtons.forEach((button) => {
            button.addEventListener("click", applyFilters);
        });

        activeFilters?.addEventListener("click", (event) => {
            const badge = event.target.closest(".js-remove-filter");
            if (!badge) {
                return;
            }

            if (badge.dataset.filterType === "search" && searchInput) {
                searchInput.value = "";
            } else if (badge.dataset.filterType === "price") {
                if (priceRange) {
                    priceRange.value = priceRange.max;
                }
                if (priceMinInput) {
                    priceMinInput.value = priceRange ? priceRange.min : "0";
                }
                if (priceMaxInput && priceRange) {
                    priceMaxInput.value = priceRange.max;
                }
            } else if (badge.dataset.filterValue === panel.dataset.activeCategory) {
                delete panel.dataset.activeCategory;
                categoryLinks.forEach((link) => {
                    link.classList.remove("text-primary");
                    link.removeAttribute("aria-current");
                });
            } else {
                const checkbox = panel.querySelector(`.js-filter-check[value="${badge.dataset.filterValue}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                }
            }

            applyFilters();
        });

        applyFilters();
    });

    const orderDetailPage = document.querySelector(".js-order-detail");

    if (orderDetailPage) {
        const rowsContainer = orderDetailPage.querySelector(".js-order-rows");
        const totalLabel = orderDetailPage.querySelector(".js-order-total");
        const emptyState = orderDetailPage.querySelector("#detalle-empty");
        const confirmButton = orderDetailPage.querySelector("#confirmOrderBtn");
        const feedback = orderDetailPage.querySelector("#detalle-feedback");
        const promoButton = orderDetailPage.querySelector(".js-apply-promo");
        const promoMessage = orderDetailPage.querySelector(".js-promo-message");

        const escapeHtml = (value) =>
            value
                .toString()
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\"/g, "&quot;")
                .replace(/'/g, "&#039;");

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
    }
});
