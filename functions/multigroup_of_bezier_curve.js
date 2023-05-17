// Define the canvas element and get its context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas width and height to the window width and height
canvas.width = window.innerWidth - canvas.offsetLeft * 2;
canvas.height = window.innerHeight - canvas.offsetTop * 2;

// 
let points_groups = [[{ x: 50, y: 150 }, { x: 150, y: 50 }, { x: 250, y: 150 }, { x: 250, y: 350}], [{ x: 150, y: 150 }, { x: 150, y: 250 }]];
//                   curve color, point color
let groups_colors = [[ "#9400D3", "#FF1493"], ["#FF1493", "#9400D3"]]

// Define the initial control points
let isDragging = false;
let dragIndex = {group: null, point: null};

// Define the colors
canvas.style.backgroundColor = "#222"; // DeepSkyBlue

// Fill the container with boxes for points groups. Settins for each group to add points and delete points, change colors
const container = document.getElementById("container");

for (let j = 0; j < points_groups.length; j++) {
    const mainDiv = document.createElement("div");
    mainDiv.className = `${j}-main-div`;

    const groups_num = document.createElement("span");
    groups_num.id = `${j}-points-group`;
    groups_num.textContent = `Gruops: ${j+1}`;

    const middleDiv1 = document.createElement("div");
    middleDiv1.className = "middle-div";
  
    const button1 = document.createElement("div");
    button1.className = "circle-button";
    button1.id = `${j}g-button-1`;
  
    const button2 = document.createElement("div");
    button2.className = "circle-button";
    button2.id = `${j}g-button-2`;
  
    const pointsLengthSpan = document.createElement("span");
    pointsLengthSpan.id = `${j}g-points-length`;
    pointsLengthSpan.textContent = points_groups[j].length;
  
    middleDiv1.appendChild(button1);
    middleDiv1.appendChild(button2);
    middleDiv1.appendChild(pointsLengthSpan);

    mainDiv.appendChild(groups_num);
    mainDiv.appendChild(middleDiv1);
  
    container.appendChild(mainDiv);
}
  
  
// Set the canvas dimensions to the window dimensions
function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

// Delete or Add points based on double-click event
function handleDoubleClick(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;
  
    let indexToDelete = null;
    for (let j = 0; j < points_groups.length; j++) {
      // Check if the mouse is over any of the control points
      for (let i = 0; i < points_groups[j].length; i++) {
        if (
          Math.abs(mouseX - points_groups[j][i].x) <= 5 &&
          Math.abs(mouseY - points_groups[j][i].y) <= 5
        ) {
          indexToDelete = i;
          break;
        }
      }
    
      if (indexToDelete !== null) {
        // Delete the point from the array
        points_groups[j].splice(indexToDelete, 1);
      } else {
        // Add the new point to the array
        points_groups[j].push({ x: mouseX, y: mouseY });
      }
    }
    // Redraw the curve
    draw();
}

// draw the Bezier curve
function bezierCurve(points_groups, ctx) {
  for (let j = 0; j < points_groups.length; j++) {
    const n = points_groups[j].length - 1;
    
    // Calculate the binomial coefficients
    const binomials = [1];
    for (let i = 1; i <= n; i++) {
      binomials[i] = binomials[i - 1] * (n - i + 1) / i;
    }

    // Draw the Bezier curve
    ctx.beginPath();
    ctx.moveTo(points_groups[j][0].x, points_groups[j][0].y);
    
    for (let t = 0; t <= 1; t += 0.001) {
      let x = 0;
      let y = 0;
      
      for (let i = 0; i <= n; i++) {
        const b = binomials[i] * Math.pow(t, i) * Math.pow(1 - t, n - i);
        x += points_groups[j][i].x * b;
        y += points_groups[j][i].y * b;
      }
      
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = groups_colors[j][0];
    ctx.stroke();
  }
}


// Draw the control points and the Bezier curve
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let j = 0; j < points_groups.length; j++) {
    // Draw the control points
    ctx.fillStyle = groups_colors[j][1];
    for (let i = 0; i < points_groups[j].length; i++) {
      ctx.beginPath();
      ctx.arc(points_groups[j][i].x, points_groups[j][i].y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  
  bezierCurve(points_groups, ctx)
}

draw();

// Handle mouse events on the canvas
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;

  // Check if the mouse is over any of the control points
  for (let j = 0; j < points_groups.length; j++) {
    for (let i = 0; i < points_groups[j].length; i++) {
      if (
        Math.abs(mouseX - points_groups[j][i].x) <= 5 &&
        Math.abs(mouseY - points_groups[j][i].y) <= 5
      ) {
        isDragging = true;
        dragIndex = {group: j, point: i};
        break;
      }
    }
  }
});
// Handle mousemove event on the canvas
canvas.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    // Update the position of the selected control point
    points_groups[dragIndex.group][dragIndex.point] = { x: mouseX, y: mouseY };
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
  