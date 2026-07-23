export const initBootstrapUi = () => {
    const bootstrapLib = window.bootstrap;

    if (!bootstrapLib) {
        return;
    }

    const tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipList.forEach((el) => new bootstrapLib.Tooltip(el));

    const popoverList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverList.forEach((el) => new bootstrapLib.Popover(el));

    const carouselList = [].slice.call(document.querySelectorAll('.carousel'));
    carouselList.forEach((el) => {
        if (!el || el.dataset.bsCarouselInitialized === 'true') {
            return;
        }

        const interval = Number(el.dataset.bsInterval || 4500);
        new bootstrapLib.Carousel(el, {
            interval,
            ride: 'carousel',
        });

        el.dataset.bsCarouselInitialized = 'true';
    });
};
