// Get the columns
var column1 = document.querySelector(".column1");
var column2 = document.querySelector(".column2");
var toggleText = document.querySelector(".toggle-text");

// Update the height of the columns
function resize() {
    column1.style.height = window.innerHeight + "px";
    column2.style.height = window.innerHeight + "px";
}
// Show or hide the column
function toggleColumn() {
    column1.classList.toggle("hidden");
    toggleText.textContent = column1.classList.contains("hidden") ? "\u2771" : "\u2770";

    // Update the height of the columns after the animation is complete
    setTimeout(function() {
        resize();
    }, 1000);
}
// Hide the column when the page is loaded
toggleColumn()

// Set the initial height of the columns
column1.style.height = window.innerHeight + "px";
column2.style.height = window.innerHeight + "px";

// Show or hide the column when is hovered
column1.addEventListener("mouseenter", toggleColumn) 
column1.addEventListener("mouseleave", toggleColumn) 
// Update the height of the columns when the window is resized
window.addEventListener("resize", resize);