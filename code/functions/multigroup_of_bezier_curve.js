// Define the canvas element and get its context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let hide_curve = false;
let hide_points = false;
// Set the canvas width and height to the window width and height
canvas.width = window.innerWidth - canvas.offsetLeft * 2;
canvas.height = window.innerHeight - canvas.offsetTop * 2;

//
let points_groups = [
  [
    { x: 250, y: 250 },
    { x: 750, y: 100 },
    { x: 750, y: 650 },
    { x: 250, y: 500 },
  ],
  [
    { x: 1050, y: 250 },
    { x: 50, y: 375 },
    { x: 1050, y: 500 },
  ],
];
//curve color, point color
let points_groups_colors = [
  ["#9400D3", "#FF1493"],
  ["#FF1493", "#9400D3"],
];

// Define the initial control points
let isDragging = false;
let dragIndex = { group: null, point: null };

// Define the colors
canvas.style.backgroundColor = "#222"; // DeepSkyBlue

// Set the canvas dimensions to the window dimensions
function setCanvasDimensions() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

function drawWave(x, y) {
  let radius = 5;
  let opacity = 1;
  let width = 20;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 24, 24, ${opacity})`;
    ctx.lineWidth = width;

    ctx.stroke();

    radius += 2;
    opacity -= opacity / width;
    width = width > 0 ? width - 15 / width : 0.1;

    if (opacity > 0) {
      requestAnimationFrame(animate);
    }
  }
  animate();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
}

// Delete or Add points based on double-click event
function handleDoubleClick(e) {
  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;

  let indexToDelete = null;
  let addPoint = false;
  let anyaction = false;
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
      indexToDelete = null;
      anyaction = true;
    } else {
      // Add the new point to the array
      addPoint = true;
    }
  }
  if (addPoint) {
    let chosens = checkChoosens(document.querySelectorAll(".curves_object"));
    for (let j = 0; j < chosens.length; j++) {
      points_groups[chosens[j]].push({ x: mouseX, y: mouseY });
      anyaction = true;
    }
  }
  // Update the points counter
  if (anyaction) {
    for (let j = 0; j < points_groups.length; j++) {
      document.getElementById(j + "-points-counter").textContent =
        points_groups[j].length;
    }
  } else {
    drawWave(mouseX, mouseY);
  }
  // Redraw the curve
  draw();
}

// draw the Bezier curve
function drawBezierCurve(points_groups, ctx) {
  for (let j = 0; j < points_groups.length; j++) {
    if (points_groups[j].length > 0) {
      const n = points_groups[j].length - 1;

      // Calculate the binomial coefficients
      const binomials = [1];
      for (let i = 1; i <= n; i++) {
        binomials[i] = (binomials[i - 1] * (n - i + 1)) / i;
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
      ctx.strokeStyle = points_groups_colors[j][0];
      ctx.stroke();
    }
  }
}

// Draw the control points and the Bezier curve
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 3;
  if (!hide_curve) {
    drawBezierCurve(points_groups, ctx);
  }
  if (!hide_points) {
    for (let j = 0; j < points_groups.length; j++) {
      // Draw the control points
      ctx.fillStyle = points_groups_colors[j][1];
      for (let i = 0; i < points_groups[j].length; i++) {
        ctx.beginPath();
        ctx.arc(
          points_groups[j][i].x,
          points_groups[j][i].y,
          5,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }
  }
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
        dragIndex = { group: j, point: i };
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
canvas.addEventListener("dblclick", handleDoubleClick);
// Listen for window resize events
window.addEventListener("resize", setCanvasDimensions);

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey) {
    toggleColumn();
  }

  if (event.shiftKey && event.key === "H") {
    document.addEventListener("keydown", function (innerEvent) {
      if (innerEvent.shiftKey && innerEvent.key === "C") {
        hide_curve = !hide_curve;
        draw();
      } else if (innerEvent.shiftKey && innerEvent.key === "P") {
        hide_points = !hide_points;
        draw();
      }
    });
  }
  if (event.shiftKey && event.key === "A") {
    document.addEventListener("keydown", function (innerEvent) {
      if (innerEvent.shiftKey && innerEvent.key === "C") {
        var curvesObjects = document.querySelectorAll(".curves_object");
        curvesObjects.forEach(function (curvesObject) {
          curvesObject.style.backgroundColor = "";
        });
        draw();
      } else {
        var curvesObjects = document.querySelectorAll(".curves_object");
        curvesObjects.forEach(function (curvesObject) {
          curvesObject.style.backgroundColor = "rgb(96, 198, 137)";
        });
        draw();
      }
    });
  }
});
