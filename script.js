// ==========================================
// 3D MODEL VIEWER & SMART ZOOM LOGIC
// ==========================================

const viewer = document.getElementById("modelViewer");
const image = document.getElementById("modelImage");
const lens = document.getElementById("lens");
const zoomContainer = document.querySelector(".zoom-container");

let idleTimer;
let zoom = 3;
let isMoving = false;

// 1. فتح الموديل وتحديد قوة التكبير
function openModel(src) {
    viewer.style.display = "flex";
    image.src = src;
    
    const gallery = document.querySelector(".model-gallery");
    if(gallery) gallery.classList.add("blur-gallery");

    image.onload = () => {
        lens.style.backgroundImage = `url(${image.src})`;
        
        // حساب التكبير الذكي بناءً على دقة الصورة
        const pixels = image.naturalWidth * image.naturalHeight;
        
        if (pixels < 2000000) zoom = 2;
        else if (pixels < 6000000) zoom = 3;
        else if (pixels < 12000000) zoom = 4;
        else zoom = 5;

        showZoomLabel();
    };
}

// 2. إغلاق الموديل
function closeModel() {
    viewer.style.display = "none";
    
    const gallery = document.querySelector(".model-gallery");
    if(gallery) gallery.classList.remove("blur-gallery");
    
    lens.classList.remove("focus");
    lens.style.opacity = "0";
}

// 3. عرض علامة التكبير (Zoom Label)
function showZoomLabel() {
    let label = document.getElementById("zoomLabel");

    // إنشاء العنصر إذا لم يكن موجوداً
    if (!label) {
        label = document.createElement("div");
        label.id = "zoomLabel";
        label.classList.add("smart-zoom-label"); // سيتم تنسيقه في الـ CSS
        zoomContainer.appendChild(label);
    }

    label.innerHTML = `🔍 Smart Zoom ×${zoom}`;
    
    // إظهار وإخفاء ناعم
    requestAnimationFrame(() => {
        label.style.opacity = "1";
    });

    clearTimeout(label.timer);
    label.timer = setTimeout(() => {
        label.style.opacity = "0";
    }, 2000);
}

// 4. دالة حركة العدسة (مع منع الخروج عن الحدود)
function updateLensPosition(clientX, clientY) {
    const rect = image.getBoundingClientRect();
    
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // منع العدسة من الخروج خارج حواف الصورة
    if (x < 0) x = 0;
    if (x > image.width) x = image.width;
    if (y < 0) y = 0;
    if (y > image.height) y = image.height;

    lens.style.left = x + "px";
    lens.style.top = y + "px";

    const bgX = -(x * zoom - lens.offsetWidth / 2);
    const bgY = -(y * zoom - lens.offsetHeight / 2);

    lens.style.backgroundSize = `${image.width * zoom}px ${image.height * zoom}px`;
    lens.style.backgroundPosition = `${bgX}px ${bgY}px`;

    // تأثير التركيز (Focus) عند التوقف
    clearTimeout(idleTimer);
    lens.classList.remove("focus");
    
    idleTimer = setTimeout(() => {
        lens.classList.add("focus");
    }, 800);

    isMoving = false;
}

// 5. إدارة الأحداث (Events) للماوس واللمس (للموبايل)
function handleMove(e) {
    e.preventDefault(); // لمنع تحرك الشاشة أثناء التكبير على الموبايل
    
    if (!isMoving) {
        isMoving = true;
        // استخدام requestAnimationFrame لحركة فائقة السلاسة بدون تقطيع
        requestAnimationFrame(() => {
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (clientX !== undefined && clientY !== undefined) {
                updateLensPosition(clientX, clientY);
            }
        });
    }
}

// أحداث الماوس
image.addEventListener("mousemove", handleMove);
image.addEventListener("mouseenter", () => lens.style.opacity = "1");
image.addEventListener("mouseleave", () => {
    lens.style.opacity = "0";
    lens.classList.remove("focus");
    clearTimeout(idleTimer);
});

// أحداث الموبايل (Touch)
image.addEventListener("touchmove", handleMove, { passive: false });
image.addEventListener("touchstart", () => lens.style.opacity = "1", { passive: true });
image.addEventListener("touchend", () => {
    lens.style.opacity = "0";
    lens.classList.remove("focus");
    clearTimeout(idleTimer);
});
