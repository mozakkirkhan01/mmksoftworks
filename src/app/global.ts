
const menuBar = document.getElementById("menubar");
const mobileNavContent = document.getElementById("mobileavntent");
const mobileNav = document.getElementById("mobilenav");

// const menuBar = document.getElementById("menubar");
// const mobileNavContent = document.getElementById("mobileavntent");
// const mobileNav = document.getElementById("mobilenav");

const clickFunction = () => {
    if (menuBar && mobileNavContent && mobileNav) {
        menuBar.addEventListener("click", () => {
            const isOpen = mobileNavContent.classList.contains("top-0");
    
            if (isOpen) {
                // Close the menu
                mobileNavContent.classList.remove("top-0");
                mobileNavContent.classList.add("-top-96");
                mobileNav.style.height = "0vh";
            } else {
                // Open the menu
                mobileNavContent.classList.remove("-top-96");
                mobileNavContent.classList.add("top-0");
                mobileNav.style.height = "40vh";
            }
        });
    } else {
        console.error("One or more elements are missing in the DOM.");
    }
    
}

export default clickFunction