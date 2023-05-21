// Define the canvas element and get its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas width and height to the window width and height
canvas.width = window.innerWidth - canvas.offsetLeft * 2;
canvas.height = window.innerHeight - canvas.offsetTop * 2;

// Define the initial control points
let points = [{ x: 50, y: 150 }, { x: 150, y: 50 }, { x: 250, y: 150 }, { x: 250, y: 350}];

let isDragging = false;
let dragIndex = null;

// Define the colors
let curveColor = "#9400D3"; // DarkViolet
let pointColor = "#FF1493"; // DeepPink
canvas.style.backgroundColor = "#222"; // DeepSkyBlue

// Set the canvas dimensions to the window dimensions
function setCanvasDimensions() {
    canvas.width = window.innerWidth - canvas.offsetLeft * 3;
    canvas.height = window.innerHeight - canvas.offsetTop * 2;
    draw();
  }

// Delete or Add points based on double-click event
function handleDoubleClick(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
  
    let indexToDelete = null;
  
    // Check if the mouse is over any of the control points
    for (let i = 0; i < points.length; i++) {
      if (
        Math.abs(mouseX - points[i].x) <= 5 &&
        Math.abs(mouseY - points[i].y) <= 5
      ) {
        indexToDelete = i;
        break;
      }
    }
  
    if (indexToDelete !== null) {
      // Delete the point from the array
      points.splice(indexToDelete, 1);
    } else {
      // Add the new point to the array
      points.push({ x: mouseX, y: mouseY });
    }
  
    // Redraw the curve
    draw();
}

// draw the Bezier curve
function bezierCurve(points, ctx) {
  const n = points.length - 1;
  
  // Calculate the binomial coefficients
  const binomials = [1];
  for (let i = 1; i <= n; i++) {
    binomials[i] = binomials[i - 1] * (n - i + 1) / i;
  }

  // Draw the Bezier curve
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let t = 0; t <= 1; t += 0.001) {
    let x = 0;
    let y = 0;
    
    for (let i = 0; i <= n; i++) {
      const b = binomials[i] * Math.pow(t, i) * Math.pow(1 - t, n - i);
      x += points[i].x * b;
      y += points[i].y * b;
    }
    
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = curveColor;
  ctx.stroke();
}


// Draw the control points and the Bezier curve
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the control points
  ctx.fillStyle = "red";
  for (let i = 0; i < points.length; i++) {
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = pointColor;
    ctx.fill();
  }

  bezierCurve(points, ctx)
}

draw();

// Handle mouse events on the canvas
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;

  // Check if the mouse is over any of the control points
  for (let i = 0; i < points.length; i++) {
    if (
      Math.abs(mouseX - points[i].x) <= 5 &&
      Math.abs(mouseY - points[i].y) <= 5
    ) {
      isDragging = true;
      dragIndex = i;
      break;
    }
  }
});
// Handle mousemove event on the canvas
canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    // Update the position of the selected control point
    points[dragIndex] = { x: mouseX, y: mouseY };

    // Redraw the curve
    draw();
  }
});
// Handle mouseup event on the canvas
canvas.addEventListener("mouseup", () => {
  isDragging = false;
  dragIndex = null;
});
// Listen for double-click events on the canvas
canvas.addEventListener('dblclick', handleDoubleClick);
// Listen for window resize events
window.addEventListener("resize", setCanvasDimensions);
// Listen for keyboard event
document.addEventListener("keydown", function(e) {
    // Check if Ctrl + Shift + C keys are pressed
    if (e.key === "c" && !e.ctrlKey && !e.shiftKey) {
        // Ask user for point color
        pointColor = window.prompt("Enter point color in hex format (e.g. #ff0000 for red):");

        // Ask user for curve color
        curveColor = window.prompt("Enter curve color in hex format:");

        // Ask user for canvas background color
        canvas.style.backgroundColor = window.prompt("Enter canvas background color in hex format:");

        // Redraw the canvas with the new colors
        draw();
    }
});
  