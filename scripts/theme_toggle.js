let themeTogglerBack = document.querySelector('.settings-menu__theme-toggler');
let themeToggler = document.querySelector('.settings-menu__toggler');
let styleLink = document.querySelector('#main_style');

if (localStorage.currentTheme === 'dark') {
    themeToggler.style.left = '18px';
    setTimeout(() => themeTogglerBack.style.background = 'linear-gradient(to right, rgb(41, 223, 71) 70%, white 70%)', 30);
    styleLink.href = "style/dark_theme/dist/main.css";
}

themeToggler.addEventListener('click', themeToggle);

function themeToggle() {
    if (themeToggler.style.left === '-2px') {
        themeToggler.style.left = '18px';
        setTimeout(() => themeTogglerBack.style.background = 'linear-gradient(to right, rgb(41, 223, 71) 70%, white 70%)', 30);
        styleLink.href = "style/dark_theme/dist/main.css";
        localStorage.currentTheme = 'dark';
    } else {
        themeToggler.style.left = '-2px';
        styleLink.href = "style/light_theme/dist/main.css";
        setTimeout(() => themeTogglerBack.style.background = 'linear-gradient(to right, rgb(41, 223, 71) 30%, white 30%)', 30);
        localStorage.currentTheme = 'light';
    }
}