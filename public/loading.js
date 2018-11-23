let loading = document.querySelector('#system-loading');
let appWrapper = document.querySelector('#app-wrapper');

window.onload = function() {
loading.style.opacity = 0;
appWrapper.classList.remove('app-wrapper-hide');
    setTimeout(() => {
        loading.classList.remove('system-loading--show');
    }, 1000);
}