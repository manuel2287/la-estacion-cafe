import { formatCurrency, normalizeText } from "./format.js";

const createFilterBadge = (label, type, value) => {
    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "badge filter-tag js-remove-filter";
    badge.dataset.filterType = type;
    badge.dataset.filterValue = value;
    badge.textContent = `${label} ×`;
    return badge;
};

const initFilterPanel = (panel) => {
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
            activeFilters.appendChild(createFilterBadge(`${formatCurrency(min)} - ${formatCurrency(max)}`, "price", "price"));
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
};

export const initFilters = () => {
    const filterPanels = document.querySelectorAll(".js-filter-panel");
    filterPanels.forEach(initFilterPanel);
};
