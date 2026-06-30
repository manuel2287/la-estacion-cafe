export const initBootstrapUi = () => {
    const tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipList.forEach((el) => new bootstrap.Tooltip(el));

    const popoverList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverList.forEach((el) => new bootstrap.Popover(el));
};
