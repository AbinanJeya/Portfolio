// ===== CURSOR TRAIL =====
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
"#ffb56b",
"#fdaf69",
"#f89d63",
"#f59761",
"#ef865e",
"#ec805d",
"#e36e5c",
"#df685c",
"#d5585c",
"#d1525c",
"#c5415d",
"#c03b5d",
"#b22c5e",
"#ac265e",
"#9c155f",
"#950f5f",
"#830060",
"#7c0060",
"#680060",
"#60005f",
"#48005f",
"#3d005e"
];

circles.forEach(function (circle, index) {
    circle.x = 0;
    circle.y = 0;
    circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
    coords.x = e.clientX;
    coords.y = e.clientY;
});

function animateCircles() {
    let x = coords.x;
    let y = coords.y;

    circles.forEach(function (circle, index) {
        circle.style.left = x - 12 + "px";
        circle.style.top = y - 12 + "px";
        
        circle.style.scale = (circles.length - index) / circles.length;
        
        circle.x = x;
        circle.y = y;

        const nextCircle = circles[index + 1] || circles[0];
        x += (nextCircle.x - x) * 0.3;
        y += (nextCircle.y - y) * 0.3;
    });

    requestAnimationFrame(animateCircles);
}

animateCircles();


// ===== TYPED TEXT EFFECT =====
const phrases = [
    "Software Developer",
    "AI Enthusiast",
    "Problem Solver",
    "Full-Stack Engineer",
    "Computer Engineering Graduate"
];

const typedTextEl = document.getElementById("typed-text");
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
        speed = 2000; // pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500; // pause before next word
    }

    setTimeout(typeEffect, speed);
}

typeEffect();


// ===== SCROLL REVEAL (INTERSECTION OBSERVER) =====
const fadeEls = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

fadeEls.forEach(el => observer.observe(el));


// ===== CONTACT FORM HANDLER (Web3Forms) =====
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const sendBtn = document.getElementById("sendBtn");

if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        // Show loading state
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";
        formMessage.textContent = "";
        formMessage.classList.remove("form-success", "form-error");
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                formMessage.textContent = "✓ Message sent successfully!";
                formMessage.classList.add("form-success");
                contactForm.reset();
            } else {
                formMessage.textContent = "⚠ Something went wrong. Please try again.";
                formMessage.classList.add("form-error");
            }
        } catch (error) {
            formMessage.textContent = "⚠ Network error. Please try again later.";
            formMessage.classList.add("form-error");
        }
        
        // Reset button
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Message";
        
        // Remove message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = "";
            formMessage.classList.remove("form-success", "form-error");
        }, 5000);
    });
}


// ===== PROJECT MODAL LOGIC =====
const modal = document.getElementById("projectModal");
const closeModal = document.querySelector(".close-modal");
const projectCards = document.querySelectorAll(".project-card");

function openModal(card) {
    const title = card.getAttribute("data-title");
    const desc = card.getAttribute("data-description");
    const tech = card.getAttribute("data-tech");
    const features = card.getAttribute("data-features");
    const github = card.getAttribute("data-github");
    const website = card.getAttribute("data-website");

    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDesc").textContent = desc;

    // Populate Tech Stack
    const techStackEl = document.getElementById("modalTech");
    techStackEl.innerHTML = "";
    if (tech) {
        tech.split(",").forEach(item => {
            const span = document.createElement("span");
            span.classList.add("tech-pill");
            span.textContent = item.trim();
            techStackEl.appendChild(span);
        });
    }

    // Populate Features
    const featuresEl = document.getElementById("modalFeatures");
    featuresEl.innerHTML = "";
    if (features) {
        features.split(";").forEach(item => {
            if (item.trim()) {
                const li = document.createElement("li");
                li.textContent = item.trim();
                featuresEl.appendChild(li);
            }
        });
    }

    // Populate Links
    const linksEl = document.getElementById("modalLinks");
    linksEl.innerHTML = "";
    if (website && website !== "#") {
        const webLink = document.createElement("a");
        webLink.href = website;
        webLink.target = "_blank";
        webLink.classList.add("project-link");
        webLink.textContent = "View Website";
        linksEl.appendChild(webLink);
    }
    if (github && github !== "#") {
        const ghLink = document.createElement("a");
        ghLink.href = github;
        ghLink.target = "_blank";
        ghLink.classList.add("project-link");
        ghLink.textContent = "View GitHub";
        linksEl.appendChild(ghLink);
    }

    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
}

projectCards.forEach(card => {
    card.addEventListener("click", function(e) {
        // Don't open modal if a link within the card was clicked
        if (e.target.closest(".project-link")) return;
        openModal(this);
    });
});

if (closeModal) {
    closeModal.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});
