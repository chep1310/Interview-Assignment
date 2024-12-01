let undoStack = [];
let redoStack = [];
let selectedTextBox = null;

document.getElementById('addTextBox')
  .addEventListener('click', addTextBox);

document.getElementById('fontSelect')
  .addEventListener('change', changeFont);

document.getElementById('fontSizeIncrease')
  .addEventListener('click', changeFontSize.bind(null, 1));

document.getElementById('fontSizeDecrease')
  .addEventListener('click', changeFontSize.bind(null, -1));

document.getElementById('bold')
  .addEventListener('click', toggleStyle.bind(null, 'fontWeight', 'bold', 'normal'));

document.getElementById('italic')
  .addEventListener('click', toggleStyle.bind(null, 'fontStyle', 'italic', 'normal'));

document.getElementById('underline')
  .addEventListener('click', toggleStyle.bind(null, 'textDecoration', 'underline', 'none'));

document.getElementById('justify')
  .addEventListener('click', toggleStyle.bind(null, 'textAlign', 'justify', 'left'));

document.getElementById('undo')
  .addEventListener('click', undo);

document.getElementById('redo')
  .addEventListener('click', redo);

  
function addTextBox() {
  const textBox = document.createElement('div');
  textBox.contentEditable = true;
  textBox.classList.add('text-box');
  textBox.style.fontSize = '16px';
  textBox.style.fontFamily = 'Arial'; // Default font
  textBox.tabIndex = 0; // Make the text box focusable

  document.getElementById('canvas').appendChild(textBox);

  textBox.addEventListener('focus', () => {
    selectedTextBox = textBox;
    updateUIWithCurrentStyles(textBox);
  });

  makeDraggable(textBox);
  saveState();
}

function changeFont() {
  if (selectedTextBox) {
    selectedTextBox.style.fontFamily = this.value;
    saveState();
  }
}

function changeFontSize(step) {
  if (selectedTextBox) {
    let fontSize = parseInt(selectedTextBox.style.fontSize, 10);
    fontSize = Math.max(1, fontSize + step); // Minimum size 1px
    selectedTextBox.style.fontSize = `${fontSize}px`;
    document.getElementById('fontSizeDisplay').textContent = fontSize;
    saveState();
  }
}

function toggleStyle(style, value, defaultValue) {
  if (selectedTextBox) {
    selectedTextBox.style[style] = selectedTextBox.style[style] === value ? defaultValue : value;
    saveState();
  }
}

function makeDraggable(element) {
  let offsetX, offsetY;

  element.addEventListener('mousedown', (e) => {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    element.style.left = `${e.pageX - offsetX}px`;
    element.style.top = `${e.pageY - offsetY}px`;
    element.style.position = 'absolute';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveState();
  }
}

function saveState() {
  undoStack.push(document.getElementById('canvas').innerHTML);
  redoStack = [];
}

function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    document.getElementById('canvas').innerHTML = undoStack[undoStack.length - 1];
    restoreDraggable();
  }
}

function redo() {
  if (redoStack.length > 0) {
    undoStack.push(redoStack.pop());
    document.getElementById('canvas').innerHTML = undoStack[undoStack.length - 1];
    restoreDraggable();
  }
}

function restoreDraggable() {
  const textBoxes = document.querySelectorAll('.text-box');
  textBoxes.forEach((textBox) => {
    makeDraggable(textBox);
    textBox.addEventListener('focus', () => {
      selectedTextBox = textBox;
      updateUIWithCurrentStyles(textBox);
    });
  });
}

function updateUIWithCurrentStyles(textBox) {
  document.getElementById('fontSelect').value = textBox.style.fontFamily || 'Arial';
  document.getElementById('fontSizeDisplay').textContent = parseInt(textBox.style.fontSize, 10) || 16;
}
