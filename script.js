// ==========================================
// 3D MODEL VIEWER & SMART ZOOM LOGIC
// ==========================================

const viewer = document.getElementById("modelViewer");
const image = document.getElementById("modelImage");
const lens = document.getElementById("lens");
const highlight = document.getElementById("lensHighlight");


let zoom = 3;
let idleTimer;

let currentX = 0;
let currentY = 0;

let targetX = 0;
let targetY = 0;

let highlightX = 0;
let highlightY = 0;

let highlightTargetX = 0;
let highlightTargetY = 0;

const smoothness = 0.12;

// ==========================================
// OPEN MODEL
// ==========================================

function openModel(src){

    viewer.style.display = "flex";

    lens.style.opacity = "0";

    image.src = src;

    const gallery = document.querySelector(".model-gallery");

    if(gallery){
        gallery.classList.add("blur-gallery");
    }

    image.onload = () => {

        currentX = image.clientWidth / 2;
        currentY = image.clientHeight / 2;

        targetX = currentX;
        targetY = currentY;

        lens.style.backgroundImage = `url(${image.src})`;

        const pixels = image.naturalWidth * image.naturalHeight;

        if(pixels < 2000000){

            zoom = 2;

        }else if(pixels < 6000000){

            zoom = 3;

        }else if(pixels < 12000000){

            zoom = 4;

        }else{

            zoom = 5;

        }

    };

}

// ==========================================
// CLOSE MODEL
// ==========================================

function closeModel(){

    viewer.style.display = "none";

    const gallery = document.querySelector(".model-gallery");

    if(gallery){
        gallery.classList.remove("blur-gallery");
    }

    lens.style.opacity = "0";
    lens.classList.remove("focus");

}

// ==========================================
// UPDATE LENS
// ==========================================

function updateLensPosition(clientX, clientY){

    const rect = image.getBoundingClientRect();

    let x = clientX - rect.left;
    let y = clientY - rect.top;

    if(x < 0) x = 0;
    if(y < 0) y = 0;

    if(x > rect.width) x = rect.width;
    if(y > rect.height) y = rect.height;

    targetX = x;
    targetY = y;

    const dx = targetX - currentX;
const dy = targetY - currentY;

// نصف قطر الحركة داخل العدسة
const radius = 48;

// تطبيع الاتجاه
const length = Math.sqrt(dx*dx + dy*dy) || 1;

highlightTargetX = (dx / length) * radius;
highlightTargetY = (dy / length) * radius;

    lens.style.backgroundSize =
    `${rect.width * zoom}px ${rect.height * zoom}px`;

    clearTimeout(idleTimer);

    lens.classList.remove("focus");

    idleTimer = setTimeout(() => {

        lens.classList.add("focus");

    }, 800);

}

// ==========================================
// HANDLE MOVE
// ==========================================

function handleMove(e){

    e.preventDefault();

    const clientX =
    e.clientX || e.touches?.[0]?.clientX;

    const clientY =
    e.clientY || e.touches?.[0]?.clientY;

    if(clientX !== undefined && clientY !== undefined){

        updateLensPosition(clientX, clientY);

    }

}

// ==========================================
// EVENTS
// ==========================================

image.addEventListener("mousemove",handleMove);

image.addEventListener("mouseenter",()=>{

    lens.style.opacity="1";

});

image.addEventListener("mouseleave",()=>{

    lens.style.opacity="0";

    lens.classList.remove("focus");

    clearTimeout(idleTimer);

});

image.addEventListener("touchmove",handleMove,{passive:false});

image.addEventListener("touchstart",()=>{

    lens.style.opacity="1";

},{passive:true});

image.addEventListener("touchend",()=>{

    lens.style.opacity="0";

    lens.classList.remove("focus");

    clearTimeout(idleTimer);

});

function animateLens(){

    currentX += (targetX - currentX) * smoothness;
    currentY += (targetY - currentY) * smoothness;

    highlightX += (highlightTargetX - highlightX) * 0.18;
    highlightY += (highlightTargetY - highlightY) * 0.18;

    // تحريك العدسة
    lens.style.left = currentX + "px";
    lens.style.top = currentY + "px";

    // إبقاء العدسة في المنتصف
    lens.style.transform = "translate(-50%,-50%)";

    // تحريك الصورة داخل العدسة
    const bgX =
    -(currentX * zoom - lens.offsetWidth / 2);

    const bgY =
    -(currentY * zoom - lens.offsetHeight / 2);

    lens.style.backgroundPosition =
    `${bgX}px ${bgY}px`;

    highlight.style.transform =
`translate(${highlightX}px, ${highlightY}px)
 rotate(-25deg)`;

    requestAnimationFrame(animateLens);

}

animateLens();
