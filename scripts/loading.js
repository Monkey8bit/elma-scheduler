window.onload = () => {
    let logoImage = document.querySelector(".loading__img");
    let logoName = document.querySelector(".loading__name");
    let logo = document.querySelector(".loading");
    let cheatBlock = document.querySelector(".cheat_block");
    let container = document.querySelector(".container");
    setTimeout(() => {
        logoImage.style.opacity = 1;
        setTimeout(() => {
            logoName.style.opacity = 1;
            logoName.style.marginBottom = "40px";
        }, 400);
    }, 1000);

    setTimeout(() => {
        cheatBlock.style.display = "block";
        logo.style.opacity = 0;
    }, 5000);

    setTimeout(() => {
        document.body.removeChild(logo);
    }, 6000);

    setTimeout(() => {
        container.style.opacity = 1;
    }, 6500)
}