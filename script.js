document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for drag and drop
    setupDragAndDrop();
    updateDiscoveriesList();
});

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Default Colors
const tileColor = '#ffffff';
const badTile = '#000'

const colors = {
    primary: {
        red: '#ff0000',
        yellow: '#ffff00',
        blue: '#0000ff'
    },
    secondary: {
        orange: '#ff8000',
        green: '#00ff00',
        purple: '#cc00ff'
    },
    tertiary: {
        slate: '#708090',
        russet: '#80461b',
        citron: '#ddd06a'
    },
    quaternary: {
        buff: '#e0ab76',
        sage: '#bcb88a',
        plum: '#c2938d'
    },
    quinary: {
        mocha: '#bfa78e',
        brass: '#d1A083',
        khaki: '#cfb482'
    }  
}

const colorCombinations = {
    // Primary
    [colors.primary.red + '+' + '']: colors.primary.red,
    [colors.primary.red + '+' + colors.primary.red]: colors.primary.red,
    [colors.primary.yellow + '+' + '']: colors.primary.yellow,
    [colors.primary.yellow + '+' + colors.primary.yellow]: colors.primary.yellow,
    [colors.primary.blue + '+' + '']: colors.primary.blue,
    [colors.primary.blue + '+' + colors.primary.blue]: colors.primary.blue,
    // Primary to Secondary
    [colors.primary.red + '+' + colors.primary.yellow]: colors.secondary.orange,
    [colors.primary.yellow + '+' + colors.primary.red]: colors.secondary.orange,
    [colors.secondary.orange + '+' + colors.secondary.orange]: colors.secondary.orange,
    [colors.primary.blue + '+' + colors.primary.yellow]: colors.secondary.green,
    [colors.primary.yellow + '+' + colors.primary.blue]: colors.secondary.green,
    [colors.secondary.green + '+' + colors.secondary.green]: colors.secondary.green,
    [colors.primary.red + '+' + colors.primary.blue]: colors.secondary.purple,
    [colors.primary.blue + '+' + colors.primary.red]: colors.secondary.purple,
    [colors.secondary.purple + '+' + colors.secondary.purple]: colors.secondary.purple,

    // Secondary to Tertiary
    [colors.secondary.green + '+' + colors.secondary.purple]: colors.tertiary.slate,
    [colors.secondary.purple + '+' + colors.secondary.green]: colors.tertiary.slate,
    [colors.tertiary.slate + '+' + colors.tertiary.slate]: colors.tertiary.slate,
    [colors.secondary.purple + '+' + colors.secondary.orange]: colors.tertiary.russet,
    [colors.secondary.orange + '+' + colors.secondary.purple]: colors.tertiary.russet,
    [colors.tertiary.russet + '+' + colors.tertiary.russet]: colors.tertiary.russet,
    [colors.secondary.orange + '+' + colors.secondary.green]: colors.tertiary.citron,
    [colors.secondary.green + '+' + colors.secondary.orange]: colors.tertiary.citron,
    [colors.tertiary.citron + '+' + colors.tertiary.citron]: colors.tertiary.citron,

    // Tertiary to Quaternary
    [colors.tertiary.russet + '+' + colors.tertiary.citron]: colors.quaternary.buff,
    [colors.tertiary.citron + '+' + colors.tertiary.russet]: colors.quaternary.buff,
    [colors.tertiary.citron + '+' + colors.tertiary.slate]: colors.quaternary.sage,
    [colors.tertiary.slate + '+' + colors.tertiary.citron]: colors.quaternary.sage,
    [colors.tertiary.slate + '+' + colors.tertiary.russet]: colors.quaternary.plum,
    [colors.tertiary.russet + '+' + colors.tertiary.slate]: colors.quaternary.plum,

    // Quaternary to Quinary
    [colors.quaternary.sage + '+' + colors.quaternary.plum]: colors.quinary.mocha,
    [colors.quaternary.plum + '+' + colors.quaternary.sage]: colors.quinary.mocha,
    [colors.quaternary.plum + '+' + colors.quaternary.buff]: colors.quinary.brass,
    [colors.quaternary.buff + '+' + colors.quaternary.plum]: colors.quinary.brass,
    [colors.quaternary.buff + '+' + colors.quaternary.sage]: colors.quinary.khaki,
    [colors.quaternary.sage + '+' + colors.quaternary.buff]: colors.quinary.khaki
};

const colorRecipes = {
    // Primary Colors
    [colors.primary.red]: "Primary: Red",
    [colors.primary.yellow]: "Primary: Yellow",
    [colors.primary.blue]: "Primary: Blue",

    // Secondary Colors
    [colors.secondary.orange]: "Orange: Secondary<br>(Red + Yellow)",
    [colors.secondary.green]: "Green: Secondary<br>(Blue + Yellow)",
    [colors.secondary.purple]: "Purple: Secondary<br>(Blue + Red)",

    // Tertiary Colors
    [colors.tertiary.slate]: "Slate: Tertiary<br>(Green + Purple)",
    [colors.tertiary.russet]: "Russet: Tertiary<br>(Orange + Purple)",
    [colors.tertiary.citron]: "Citron: Tertiary<br>(Green + Orange)",

    // Quaternary Colors
    [colors.quaternary.buff]: "Buff: Quaternary<br>(Citron + Russet)",
    [colors.quaternary.sage]: "Sage: Quaternary<br>(Citron + Slate)",
    [colors.quaternary.plum]: "Plum: Quaternary<br>(Russet + Slate)",

    // Quinary Colors
    [colors.quinary.mocha]: "Mocha: Quinary<br>(Sage + Plum)",
    [colors.quinary.brass]: "Brass: Quinary<br>(Buff + Plum)",
    [colors.quinary.khaki]: "Khaki: Quinary<br>(Buff + Sage)",
};

let discoveredColors = {
    [colors.primary.red]: true,
    [colors.primary.yellow]: true,
    [colors.primary.blue]: true,
    [colors.secondary.orange]: false,
    [colors.secondary.green]: false,
    [colors.secondary.purple]: false,
    [colors.tertiary.slate]: false,
    [colors.tertiary.russet]: false,
    [colors.tertiary.citron]: false,
    [colors.quaternary.buff]: false,
    [colors.quaternary.sage]: false,
    [colors.quaternary.plum]: false,
    [colors.quinary.mocha]: false,
    [colors.quinary.brass]: false,
    [colors.quinary.khaki]: false
}

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

    if (!discoveredColors[mixedColor]) {
        discoveredColors[mixedColor] = true; // Mark this color as discovered
        updateDiscoveriesList(); // Update the discoveries list
    }

    if (targetColor) {
        target.style.backgroundColor = mixedColor;

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
        }
    }
}

function updateGridItemColor(gridItem, colorHex) {
    gridItem.style.backgroundColor = colorHex;
    const colorName = getColorFromHex(colorHex); // Implement this function
    gridItem.querySelector('.color-name').textContent = colorName || '';
}

function handleColorMix(discoveredColor) {
    if (!discoveredColors[discoveredColor]) {
        discoveredColors[discoveredColor] = true;
        alert(`You've created ${discoveredColor}! Recipe added to your Discoveries.`);
        updateDiscoveriesList(); // Update the discoveries list
    }
}

function updateDiscoveriesList() {
    const list = document.getElementById('discoveriesList');
    list.innerHTML = ''; // Clear the discoveries list

    Object.keys(colorRecipes).forEach(color => {
        const colorName = getColorFromHex(color); // Implement this function
        const listItem = document.createElement('li');
        listItem.textContent = discoveredColors[color] ? colorName : 'Undiscovered';
        list.appendChild(listItem);
    })
}

function getColorFromHex(hexValue) {
    hexValue = hexValue.toLowerCase();
    for (const category in colors) {
        for (const colorName in colors[category]) {
            if (colors[category][colorName] === hexValue) {
                return capitaliseFirstLetter(colorName); // Return the color name
            }
        }
    }
    return 'Unknown Color'; // If no match found
}


// Modify the mixColors function to use the colorMixMap


function calculateScore() {
    // Calculate and update the score based on color combinations
    // Implement the scoring logic based on the complexity of mixed colors
}

// Additional functions for drag-and-drop, updating grid color, validating color combinations, etc.
