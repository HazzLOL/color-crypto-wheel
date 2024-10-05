const colorWheel = document.getElementById('colorWheelContainer');
const colorDot = document.getElementById('colorDot');
const resultDiv = document.getElementById('result');
let dragging = false;

// Random color generator
function randomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Convert RGB to a number
function rgbToNumber(rgb) {
  const components = rgb.match(/\d+/g).map(Number);
  return components[0] * 65536 + components[1] * 256 + components[2];
}

// Get angle of the dot relative to the center
function getAngle(x, y, cx, cy) {
  return Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 180;
}

// Get color based on the angle
function angleToColor(angle) {
  const section = Math.floor(angle / 60); // Divide 360° into 6 sections (Red, Yellow, Green, etc.)
  const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];
  return colors[section];
}

// Draggable dot logic
colorDot.addEventListener('mousedown', () => { dragging = true; });
document.addEventListener('mouseup', () => { dragging = false; });
document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  
  const rect = colorWheel.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  
  const angle = getAngle(e.clientX, e.clientY, cx, cy);
  const distance = Math.hypot(e.clientX - cx, e.clientY - cy);
  
  if (distance < rect.width / 2) {
    const x = rect.width / 2 + Math.cos((angle - 90) * Math.PI / 180) * distance;
    const y = rect.height / 2 + Math.sin((angle - 90) * Math.PI / 180) * distance;
    
    colorDot.style.left = `${x}px`;
    colorDot.style.top = `${y}px`;
    
    const selectedColor = angleToColor(angle);
    resultDiv.textContent = `Your Color: ${selectedColor}`;
  }
});

// Picking a random color and calculating the winner
function checkWinner() {
  const randomColorValue = randomColor();
  resultDiv.textContent += ` Random Color: ${randomColorValue}`;
  
  const selectedColorValue = rgbToNumber(colorDot.style.backgroundColor);
  const randomColorNum = rgbToNumber(randomColorValue);

  // Compare the guessed and random color values
  if (Math.abs(selectedColorValue - randomColorNum) < 5000) {  // Example threshold
    resultDiv.textContent += ' You Win! You get 5% of the prize.';
  } else {
    resultDiv.textContent += ' Try Again.';
  }
}

// Check winner every time you move the dot
document.addEventListener('mouseup', checkWinner);
