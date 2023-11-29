document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for drag and drop
    setupDragAndDrop();
});

// function resizeGrid() {
//     const grid = document.querySelector('.grid-container');
//     if (grid) {
//         const viewportWidth = window.innerWidth;

//         let gridWidth = viewportWidth * 0.8; // 80% of viewport width
//         gridWidth = Math.min(gridWidth, 600); // max grid width

//         console.log("Viewport width:", viewportWidth, "Calculated grid width:", gridWidth);

//         grid.style.width = `${gridWidth}px`;
//         grid.style.height = `${gridWidth}px`;
//     }
// }


// // Run on initial load and on window resize
// window.addEventListener('load', resizeGrid);
// window.addEventListener('resize', resizeGrid);



// Default Colors
const tileColor = '#ffffff';
const badTile = '#000'

// Primary Colors
const red = '#ff0000';
const yellow = '#ffff00';
const blue = '#0000ff';

// Secondary Colors
const orange = '#ff8000'; // Red + Yellow
const green = '#00ff00'; // Blue + Yellow
const purple = '#cc00ff'; // Red + Blue

// Tertiary Colors
const slate = '#708090'; // Green + Purple
const russet = '#80461b'; // Purple + Orange
const citron = '#ddd06a'; // Orange + Green

// Quaternary Colors
const buff = '#e0ab76'; // Russet + Citron
const sage = '#bcb88a'; // Citron + Slate
const plum = '#c2938d'; // Slate + Russet

// Quinary Colors
const mocha = '#bfa78e'; // Sage + Plum
const brass = '#d1A083'; // Plum + Buff
const khaki = '#cfb482'; // Buff + Sage

const colorCombinations = {
    // Primary
    [red + '+' + '']: red,
    [red + '+' + red]: red,
    [yellow + '+' + '']: yellow,
    [yellow + '+' + yellow]: yellow,
    [blue + '+' + '']: blue,
    [blue + '+' + blue]: blue,
    // Primary to Secondary
    [red + '+' + yellow]: orange,
    [yellow + '+' + red]: orange,
    [orange + '+' + orange]: orange,
    [blue + '+' + yellow]: green,
    [yellow + '+' + blue]: green,
    [green + '+' + green]: green,
    [red + '+' + blue]: purple,
    [blue + '+' + red]: purple,
    [purple + '+' + purple]: purple,

    // Secondary to Tertiary
    [green + '+' + purple]: slate,
    [purple + '+' + green]: slate,
    [slate + '+' + slate]: slate,
    [purple + '+' + orange]: russet,
    [orange + '+' + purple]: russet,
    [russet + '+' + russet]: russet,
    [orange + '+' + green]: citron,
    [green + '+' + orange]: citron,
    [citron + '+' + citron]: citron,

    // Tertiary to Quaternary
    [russet + '+' + citron]: buff,
    [citron + '+' + russet]: buff,
    [citron + '+' + slate]: sage,
    [slate + '+' + citron]: sage,
    [slate + '+' + russet]: plum,
    [russet + '+' + slate]: plum,

    // Quaternary to Quinary
    [sage + '+' + plum]: mocha,
    [plum + '+' + sage]: mocha,
    [plum + '+' + buff]: brass,
    [buff + '+' + plum]: brass,
    [buff + '+' + sage]: khaki,
    [sage + '+' + buff]: khaki
};

const colorRecipes = {
    // Primary Colors
    [red]: "Primary: Mix me with another primary for a surprise.",
    [yellow]: "Primary: I blend with primary colors to create something new.",
    [blue]: "Primary: Combine me with a primary buddy for a vivid result.",

    // Secondary Colors
    [orange]: "Orange: Secondary<br>(Red + Yellow)",
    [green]: "Green: Secondary<br>(Blue + Yellow)",
    [purple]: "Purple: Secondary<br>(Blue + Red)",

    // Tertiary Colors
    [slate]: "Slate: Tertiary<br>(Green + Purple)",
    [russet]: "Russet: Tertiary<br>(Orange + Purple)",
    [citron]: "Citron: Tertiary<br>(Green + Orange)",

    // Quaternary Colors
    [buff]: "Buff: Quaternary<br>(Citron + Russet)",
    [sage]: "Sage: Quaternary<br>(Citron + Slate)",
    [plum]: "Plum: Quaternary<br>(Russet + Slate)",

    // Quinary Colors
    [mocha]: "Mocha: Quinary<br>(Sage + Plum)",
    [brass]: "Brass: Quinary<br>(Buff + Plum)",
    [khaki]: "Khaki: Quinary<br>(Buff + Sage)",
};

document.querySelectorAll('.grid-item').forEach(item => {
    updateTooltip(item, item.style.backgroundColor);
    item.addEventListener('mousedown', function() {
        this.querySelector('.tooltip').style.visibility = 'visible';
    });
    item.addEventListener('mouseup', function() {
        this.querySelector('.tooltip').style.visibility = 'hidden';
    });
});

function mixColors(color1, color2) {
    // Ensure hex values are in the correct case (e.g., uppercase)
    color1 = color1.toLowerCase();
    color2 = color2.toLowerCase();
    let mixKey = color1 + '+' + color2;
    let mixedColor = colorCombinations[mixKey];

    console.log('Mix key:', mixKey);
    console.log('Mixed color:', mixedColor);

    return mixedColor || badTile; // Default to brown for invalid mix
}

function setupDragAndDrop() {
    // Add dragstart event listeners to the primary color strips
    document.querySelectorAll('.Left-Primary, .Top-Primary, .Right-Primary').forEach(strip => {
        strip.setAttribute('draggable', 'true');
        strip.addEventListener('dragstart', handleDragStart);
    });

    // Add dragover and drop event listeners to the grid items
    document.querySelectorAll('.grid-item').forEach(item => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
    });
}


function handleDragStart(event) {
    if (event.target.classList.contains('Left-Primary')) {
        draggedColor = '#ff0000'; // Use the hex value
    } else if (event.target.classList.contains('Top-Primary')) {
        draggedColor = '#ffff00'; // Use the hex value
    } else if (event.target.classList.contains('Right-Primary')) {
        draggedColor = '#0000ff'; // Use the hex value
    } else if (event.target.classList.contains('grid-item')) {
        // Get the color of the grid item and set it as the dragged color
        draggedColor = rgbToHex(event.target.style.backgroundColor);
    }

    // Store the source element and type
    event.dataTransfer.setData('source', event.target.classList.contains('grid-item') ? 'grid-item' : 'color-strip');
    event.dataTransfer.setData('sourceElement', event.target);
    event.dataTransfer.setData('sourceElementId', event.target.id); // Store the id of the source element

    console.log(draggedColor, 'is being dragged from:', event.target); // Verify the source element
}

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow a drop
    event.stopPropagation(); // Stop the event from propagating
    console.log('Dragging over a grid item'); // Log when an item is dragged over a grid item
}

function rgbToHex(rgb) {
    // Convert an RGB color to Hex format
    if (!rgb || rgb.indexOf("rgb") !== 0) {
        return rgb; // Return the original value if it's not RGB format
    }

    let rgbValues = rgb.match(/\d+/g).map(Number); // Extract numerical values
    let hex = rgbValues.map(x => {
        const hexValue = x.toString(16);
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
    }).join('');

    return '#' + hex;
}

function updateTooltip(gridItem, color) {
    let tooltip = gridItem.querySelector('.tooltip');
    if (tooltip) {
        let hint = colorRecipes[color] || "No combinations available";
        tooltip.textContent = hint;
    }
}

function handleDrop(event) {
    event.preventDefault();
    let target = event.target;
    event.dataTransfer.setData('sourceElementId', event.target.id); // Store the id of the source element

    console.log('Drop target:', target); // Check what the drop target is
    
    // Ensure the target is a grid-item
    while (target && !target.classList.contains('grid-item')) {
        target = target.parentElement;
    }

    if (!target) {
        console.error('Drop target is not a grid item');
        return;
    }

    //let targetColor = rgbToHex(target.style.backgroundColor);
    let targetColor = target.style.backgroundColor;
    targetColor = rgbToHex(targetColor); // Convert to Hex format

    console.log('Dragged color:', draggedColor);
    console.log('Target color:', targetColor);

    // Mix colors
    const mixedColor = mixColors(draggedColor, targetColor) || '#663300'; // Brown for invalid mix

    if (targetColor) {
        target.style.backgroundColor = mixedColor;

        // Update the tooltip text
        updateTooltip(target, mixedColor.toLowerCase());

        // If the dragged color came from another grid item, reset that item
        if (event.dataTransfer.getData('source') === 'grid-item') {
            let sourceElement = document.getElementById(event.dataTransfer.getData('sourceElementId'));
                if (sourceElement) {
                    sourceElement.style.backgroundColor = ''; // Reset to default
                } 
        }
    } else {
        // Set new color
        target.style.backgroundColor = draggedColor;
    }

    // Check if the drag started from another grid item
    const sourceElementId = event.dataTransfer.getData('sourceElementId');
    if (sourceElementId) {
        const sourceElement = document.getElementById(sourceElementId);
        if (sourceElement && sourceElement !== event.target) {
            // Reset the source element's color
            sourceElement.style.backgroundColor = ''; // Or set to default color
            updateTooltip(sourceElement, ''); // Update tooltip for the source element
        }
    }

    let tooltip = target.querySelector('.tooltip');
    if (tooltip) {
        tooltip.innerHTML = colorRecipes[mixedColor] || 'No further combinations available';
    }
}


// Modify the mixColors function to use the colorMixMap


function calculateScore() {
    // Calculate and update the score based on color combinations
    // Implement the scoring logic based on the complexity of mixed colors
}

// Additional functions for drag-and-drop, updating grid color, validating color combinations, etc.
