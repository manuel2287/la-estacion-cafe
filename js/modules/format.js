export const parsePriceText = (value) => {
    if (!value) {
        return 0;
    }

    const normalized = value.toString().replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};

export const formatCurrency = (value) => `$${Number(value).toLocaleString("es-AR")}`;

export const slugify = (value) =>
    value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export const normalizeText = (value) =>
    value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

export const escapeHtml = (value) =>
    value
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
