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

        const renderActiveFilters = () => {
            if (!activeFilters) {
                return;
            }

            const values = getActiveValues();
            const searchTerm = searchInput ? searchInput.value.trim() : "";
            activeFilters.innerHTML = "";

            if (!values.length && !searchTerm) {
                const emptyLabel = document.createElement("span");
                emptyLabel.className = "text-muted small";
                emptyLabel.textContent = "Sin filtros aplicados";
                activeFilters.appendChild(emptyLabel);
                return;
            }

            if (searchTerm) {
                activeFilters.appendChild(createFilterBadge(`Buscar: ${searchTerm}`, "search", searchTerm));
            }

            values.forEach((value) => {
                activeFilters.appendChild(createFilterBadge(getFilterLabel(value), "value", value));
            });
        };

        const applyFilters = () => {
            const selectedValues = getActiveValues().map(normalizeText);
            const searchTerm = searchInput ? normalizeText(searchInput.value) : "";
            let visibleCount = 0;

            items.forEach((item) => {
                const haystack = normalizeText(`${item.dataset.filterTags || ""} ${item.textContent}`);
                const matchesSearch = !searchTerm || haystack.includes(searchTerm);
                const matchesFilters = selectedValues.every((value) => haystack.includes(value));
                const isVisible = matchesSearch && matchesFilters;

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
});
