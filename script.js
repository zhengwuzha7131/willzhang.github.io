"use strict"

//Selecting menu as well as changing active for selected nav
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navlinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
};

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}


// When at top, change to background
document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('.header');
    const offset = 10;

    function toggleHeaderAtTop() {
        if (window.scrollY <= offset) {
            header.classList.add('at-top');
        } else {
            header.classList.remove('at-top');
        }
    }

    window.addEventListener('scroll', toggleHeaderAtTop);
    toggleHeaderAtTop();
});

// Typewriter

const phrases = ['Software Engineer', 'Gamer', 'Student at U-M', 'Cat AND Dog Lover', 'Game Developer'];
const effect = document.getElementById("typewriter");
let pauseTime = 100;
let currentPhraseIndex = 0;

function pause(ms){
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const writeLoop = async () => {
    await pause(400);
    while(true) {
        let currentWord = phrases[currentPhraseIndex];

        for(let i = 0; i < currentWord.length; i++){
            effect.innerText = currentWord.substring(0, i + 1);
            await pause(pauseTime);
        }
        await pause(1000);

        for(let i = currentWord.length; i > 0; i--){
            effect.innerText = currentWord.substring(0, i - 1);
            await pause(pauseTime);
        }

        await pause(400);

        currentPhraseIndex++;
        currentPhraseIndex = currentPhraseIndex % phrases.length;
    }
}

document.addEventListener("DOMContentLoaded", writeLoop);

// Image transition

const images = ["image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg", "image.jpg"];
let currentImageIndex = 0;

function changeImage() {
    const imgElement = document.getElementById('img');
    imgElement.style.opacity = 0;

    setTimeout(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        imgElement.src = images[currentImageIndex];
        imgElement.style.opacity = 1;
    }, 2000);
}

setInterval(changeImage, 5000);

// Timeline

const boxes = document.querySelectorAll('.box');

window.addEventListener('scroll', DisplayTimeline);
DisplayTimeline();

function DisplayTimeline() {
    const TriggerBottom = (window.innerHeight/5) * 4;
    
    boxes.forEach((box)=>{
        const topBox = box.getBoundingClientRect().top;

        if(topBox < TriggerBottom){
            box.classList.add("show");
        } else {
            box.classList.remove("show");
        }
    })
}

// Carousel

const wrapper = document.querySelector('.wrapper');
const carousel = document.querySelector('.carousel');
const firstImg = carousel.querySelectorAll("img")[0];
const imgs = document.querySelectorAll(".carousel img");
const arrowIcons = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];
const dots = document.querySelector(".dots");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;
let wrapperWidth = wrapper.clientWidth + 15;
let arrowClickAllowed = true;
let scrollWidth = carousel.scrollWidth - carousel.clientWidth;

const updateDimensions = () => {
    wrapperWidth = wrapper.clientWidth + 15;
};

imgs.forEach(img =>{
    img.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
});

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        if(!arrowClickAllowed) return;
        arrowClickAllowed = false;

        carousel.scrollLeft += icon.id == "left" ? -wrapperWidth : wrapperWidth;

        setTimeout(() => {
            arrowClickAllowed = true;
        }, 500);
    })
});

const navigateToImage = (index) => {
    carousel.scrollLeft = index * wrapperWidth;
}

const updateActiveDot = () => {
    const currentIndex = Math.round(carousel.scrollLeft / wrapperWidth);
    dots.querySelectorAll('li').forEach((dot, index) => {
        dot.className = index === currentIndex ? 'active' : '';
    });

    arrowIcons[0].style.display = currentIndex === 0 ? "none" : "block";
    arrowIcons[1].style.display = currentIndex === 4 ? "none" : "block";
}

const autoSlide = () => {
    const halfway = wrapperWidth / 2;
    const currentIndex = Math.floor(carousel.scrollLeft / wrapperWidth);
    const scrollOverHalfway = (carousel.scrollLeft % wrapperWidth) > halfway;

    const targetIndex = scrollOverHalfway ? currentIndex + 1 : currentIndex;
    carousel.scrollLeft = targetIndex * wrapperWidth;

        setTimeout(() => {
            updateActiveDot();
        }, 300);
}
const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX)- prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
}

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if(!isDragging) return;
    isDragging = false;
    autoSlide();
}

window.addEventListener("resize", updateDimensions);

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateDimensions();
    }
});

carousel.addEventListener('scroll', updateActiveDot);
wrapper.addEventListener("mousedown", dragStart);
wrapper.addEventListener("touchstart", dragStart);
wrapper.addEventListener("mousemove", dragging);
wrapper.addEventListener("touchmove", dragging);
wrapper.addEventListener("mouseup", dragStop);
wrapper.addEventListener("mouseleave", dragStop);
wrapper.addEventListener("touchend", dragStop);