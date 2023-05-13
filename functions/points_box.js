const circleButtons = document.querySelectorAll(".circle-button");
const pointsLength = document.querySelector("#points-length");

// Add event listener to each circle button to change its color
circleButtons.forEach(button => {
  button.addEventListener("click", () => {
    button.style.backgroundColor = getRandomColor();
  });
});

// Function to delete the last point from the points array
function deleteLastPoint() {
  if (points.length > 0) {
    points.pop();
    updatePointsLength();
  }
}

// Function to add a new point to the points array
function addNewPoint() {
  const newPoint = {
    x: getRandomNumber(0, window.innerWidth),
    y: getRandomNumber(0, window.innerHeight)
  };
  points.push(newPoint);
  updatePointsLength();
}

// Function to update the length of the points array in the HTML
function updatePointsLength() {
  pointsLength.textContent = `Points Length: ${points.length}`;
}

// Helper function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Helper function to generate a random number within a given range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
