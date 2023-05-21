function getRandomColor() {
  return [
    "#000000",
    "#0000FF",
    "#00FF00",
    "#00FFFF",
    "#FF0000",
    "#FF00FF",
    "#FFFF00",
    "#FFFFFF",
    "#C0C0C0",
    "#808080",
    "#000080",
    "#008000",
    "#008080",
    "#800000",
    "#800080",
    "#808000",
  ][Math.floor(Math.random() * 16)];
}

//
let free_numbers = [true, true, true, true, true, true, true, true, true, true];
function getIndex(i) {
  if (free_numbers[i]) {
    free_numbers[i] = false;
    return i;
  } else {
    for (let j = 0; j < free_numbers.length; j++) {
      if (free_numbers[j]) {
        free_numbers[j] = false;
        return j;
      }
    }
  }
}
// check if clicked on color button and change the color
function handleColorButtonClick(event) {
  const button = event.target;
  const [i, j] = button.id.split("-");
  const selectedColor = button.value;
  points_groups_colors[i][j] = selectedColor;
  button.style.backgroundColor = selectedColor;
  draw();
}

// check if the user has chosen any object
function checkChoosens(objects) {
  let choosen_objects = [];
  objects.forEach(function (divElement) {
    if (divElement.style.backgroundColor !== "") {
      // Extract the ID and read the first number
      const id = divElement.id;
      const num = parseInt(id.split("-")[0]);
      choosen_objects.push(num);
    }
  });
  return choosen_objects;
}

// function to create and append to container div object for each group of points
function appendChuldrenToControlDiv(controldiv, i) {
  const curves_object_curves_color = document.createElement("input");
  curves_object_curves_color.type = "color";
  curves_object_curves_color.id = i + "-0-button";
  curves_object_curves_color.value = points_groups_colors[i][0];
  curves_object_curves_color.style.backgroundColor = points_groups_colors[i][0];
  curves_object_curves_color.addEventListener("change", handleColorButtonClick);

  const curves_object_points_color = document.createElement("input");
  curves_object_points_color.type = "color";
  curves_object_points_color.id = i + "-1-button";
  curves_object_points_color.value = points_groups_colors[i][1];
  curves_object_points_color.style.backgroundColor = points_groups_colors[i][1];
  curves_object_points_color.addEventListener("change", handleColorButtonClick);

  controldiv.appendChild(curves_object_curves_color);
  controldiv.appendChild(curves_object_points_color);
}
function appendObjectBoxToMainDiv(maindiv, i) {
  const curves_object_num = document.createElement("div");
  curves_object_num.className = "curves_object_num";
  curves_object_num.innerHTML = i + 1;
  const controldiv = document.createElement("div");
  controldiv.className = "curves_object_control";
  appendChuldrenToControlDiv(controldiv, i);

  const curves_object_points_counter = document.createElement("div");
  curves_object_points_counter.className = "curves_object_points_counter";
  curves_object_points_counter.id = i + "-points-counter";
  curves_object_points_counter.innerHTML = points_groups[i].length;

  maindiv.appendChild(curves_object_num);
  maindiv.appendChild(controldiv);
  maindiv.appendChild(curves_object_points_counter);
}
function addMainToBox(box, i) {
  const maindiv = document.createElement("div");
  maindiv.className = "curves_object";
  maindiv.id = i + "-curves_object";
  appendObjectBoxToMainDiv(maindiv, i);

  // add event listener to object boxes to choose them
  maindiv.addEventListener("click", function (event) {
    if (event.target !== maindiv) {
      return; // Ignore the click event if the user clicked not on the div itself
    }
    if (maindiv.style.backgroundColor === "rgb(96, 198, 137)") {
      maindiv.style.backgroundColor = ""; // Reset to default color
    } else {
      maindiv.style.backgroundColor = "rgb(96, 198, 137)";
    }
  });

  const remove_button = document.createElement("button");
  remove_button.className = "remove_button";
  remove_button.id = i + "-remove_button";
  remove_button.innerHTML = "-";
  remove_button.addEventListener("click", function (event) {
    const i = remove_button.id.split("-")[0];
    if (points_groups.length > 1) {
      points_groups.splice(i, 1);
      points_groups_colors.splice(i, 1);
    } else {
      points_groups = [];
      points_groups_colors = [];
    }
    document
      .getElementById("objects_vault")
      .removeChild(document.getElementById(i + "-curves_box"));
    free_numbers[i] = true;
    draw();
    toggleColumn();
    if (document.getElementById("add_button").style.display === "none") {
      document.getElementById("add_button").style.display = "block"; // or 'inline' or any other suitable display value
    }
  });

  box.appendChild(maindiv);
  box.appendChild(remove_button);
}
function addAllToBox(i) {
  const box = document.createElement("div");
  box.className = "curves_box";
  box.id = i + "-curves_box";
  addMainToBox(box, i);
  document.getElementById("objects_vault").appendChild(box);
}
function addAllToContainer() {
  for (let i = 0; i < points_groups.length; i++) {
    addAllToBox(getIndex(i));
  }
  const add_button = document.createElement("button");
  add_button.className = "add_button";
  add_button.id = "add_button";
  add_button.innerHTML = "+";
  document.getElementById("container").appendChild(add_button);
}
addAllToContainer();

// add event listener to color buttons to change the color
const colorbuttons = document.querySelectorAll(
  '.curves_object_control input[type="color"]'
);
colorbuttons.forEach(function (button) {
  button.addEventListener("change", handleColorButtonClick);
});

// add event listener to add button to add new object
const add_button = document.getElementById("add_button");
add_button.addEventListener("click", function (event) {
  const new_points_group = [];
  const new_points_group_color = [getRandomColor(), getRandomColor()];
  points_groups.push(new_points_group);
  points_groups_colors.push(new_points_group_color);
  const i = points_groups.length - 1;
  addAllToBox(getIndex(i));

  if (points_groups.length >= 10) {
    add_button.style.display = "none";
  }
});

