const container = document.getElementById("container");

for (let j = 0; j < points_groups.length; j++) {
    const mainDiv = document.createElement("div");
    mainDiv.className = "main-div";
  
    const middleDiv1 = document.createElement("div");
    middleDiv1.className = "middle-div";
  
    const button1 = document.createElement("div");
    button1.className = "circle-button";
    button1.id = `${j}-button-1`;
    button1.appendChild(document.createTextNode("~"));
    
    const button2 = document.createElement("div");
    button2.className = "circle-button";
    button2.id = `${j}-button-2`;
  
    middleDiv1.appendChild(button1);
    middleDiv1.appendChild(button2);
  
    const middleDiv2 = document.createElement("div");
    middleDiv2.className = "middle-div";
  
    const pointsLengthSpan = document.createElement("span");
    pointsLengthSpan.id = "points-length";
    pointsLengthSpan.textContent = points_groups[j].length;

    middleDiv2.appendChild(deleteButton);
    middleDiv2.appendChild(pointsLengthSpan);
    middleDiv2.appendChild(addButton);
  
    mainDiv.appendChild(middleDiv1);
    mainDiv.appendChild(middleDiv2);
  
    container.appendChild(mainDiv);
}
  