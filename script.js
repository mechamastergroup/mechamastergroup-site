
//Fot 3D modeling tab.

<script>

const viewer = document.getElementById("modelViewer");
const image = document.getElementById("modelImage");
const lens = document.getElementById("lens");

let idleTimer;
let zoom = 3;

function openModel(src){

    viewer.style.display = "flex";

    image.src = src;

    document.querySelector(".model-gallery")
    .classList.add("blur-gallery");

    image.onload = () => {

        lens.style.backgroundImage = `url(${image.src})`;

        const pixels = image.naturalWidth * image.naturalHeight;

        if(pixels < 2000000){

            zoom = 2;

        }
        else if(pixels < 6000000){

            zoom = 3;

        }
        else if(pixels < 12000000){

            zoom = 4;

        }
        else{

            zoom = 5;

        }

        showZoomLabel();

    };

}

function closeModel(){

    viewer.style.display = "none";

    document.querySelector(".model-gallery")
    .classList.remove("blur-gallery");

    lens.classList.remove("focus");

}

image.addEventListener("mousemove", moveLens);

image.addEventListener("mouseenter", () => {

    lens.style.opacity = "1";

});

image.addEventListener("mouseleave", () => {

    lens.style.opacity = "0";

    lens.classList.remove("focus");

    clearTimeout(idleTimer);

});

function showZoomLabel(){

    let label = document.getElementById("zoomLabel");

    if(!label){

        label = document.createElement("div");

        label.id = "zoomLabel";

        label.style.position = "absolute";
        label.style.top = "15px";
        label.style.left = "50%";
        label.style.transform = "translateX(-50%)";
        label.style.background = "rgba(0,0,0,.65)";
        label.style.color = "white";
        label.style.padding = "6px 14px";
        label.style.borderRadius = "25px";
        label.style.fontSize = "15px";
        label.style.fontWeight = "600";
        label.style.pointerEvents = "none";
        label.style.transition = ".35s";
        label.style.opacity = "0";

        document.querySelector(".zoom-container").appendChild(label);

    }

    label.innerHTML = `🔍 Smart Zoom ×${zoom}`;

    label.style.opacity = "1";

    clearTimeout(label.timer);

    label.timer = setTimeout(() => {

        label.style.opacity = "0";

    },1500);

}

function moveLens(e){

    const rect = image.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    lens.style.left = x + "px";

    lens.style.top = y + "px";

    const bgX = -(x * zoom - lens.offsetWidth / 2);

    const bgY = -(y * zoom - lens.offsetHeight / 2);

    lens.style.backgroundSize =
    `${image.width * zoom}px ${image.height * zoom}px`;

    lens.style.backgroundPosition =
    `${bgX}px ${bgY}px`;

    clearTimeout(idleTimer);

    lens.classList.remove("focus");

    idleTimer = setTimeout(() => {

        lens.classList.add("focus");

    },1000);

}

</script>
