document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("premium-loader");
    if (!loader) return;

    const preloadTargets = [
        "./loader.png",
        "./portre.jpg"
    ];
    const minimumDelay = 3000;
    const startTime = Date.now();

    let remaining = preloadTargets.length;
    let finished = false;
    window.portfolioLoaderDone = false;

    function finishLoader() {
        const elapsed = Date.now() - startTime;
        const wait = Math.max(0, minimumDelay - elapsed);

        if (wait > 0 && !finished) {
            window.setTimeout(function () {
                finishLoader();
            }, wait);
            return;
        }

        if (finished) return;
        finished = true;
        window.portfolioLoaderDone = true;
        window.dispatchEvent(new CustomEvent("portfolio:loader:done"));

        loader.classList.add("hidden");
        window.setTimeout(function () {
            loader.remove();
        }, 900);
    }

    function markAssetLoaded() {
        remaining -= 1;
        if (remaining <= 0) {
            finishLoader();
        }
    }

    preloadTargets.forEach(function (src) {
        const img = new Image();
        img.onload = markAssetLoaded;
        img.onerror = markAssetLoaded;
        img.src = src;
    });

    window.addEventListener("load", function () {
        if (remaining <= 0) {
            finishLoader();
        }
    }, { once: true });

    window.setTimeout(function () {
        finishLoader();
    }, minimumDelay);
});