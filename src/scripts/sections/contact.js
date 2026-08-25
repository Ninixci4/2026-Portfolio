(function () {
    function initContactMotion() {
        document.querySelectorAll('#contact .input-wrap input, #contact .input-wrap textarea').forEach((field) => {
            field.addEventListener('focus', () => field.parentElement.classList.add('is-focus'));
            field.addEventListener('blur', () => field.parentElement.classList.remove('is-focus'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactMotion);
    } else {
        initContactMotion();
    }
})();
