// Task 4 AR/VR Prototype JavaScript
// Simulates spatial interactions, gaze-like hover behaviors, gesture activation,
// and 3D menu responsiveness for a virtual shopping HUD.

const productContainer = document.getElementById('productContainer');
const contextualMenu = document.getElementById('contextualMenu');
const feedbackLabel = document.getElementById('interactionFeedback').querySelector('.feedback-label');
const furnitureItem = document.getElementById('furnitureItem');
const productInfo = document.getElementById('productInfo');

const panels = {
    size: document.getElementById('sizePanel'),
    color: document.getElementById('colorPanel'),
    info: document.getElementById('infoPanel'),
    placement: document.getElementById('placementPanel')
};

const menuOptions = document.querySelectorAll('.menu-option');
const gestureButtons = {
    gaze: document.getElementById('gazeBtn'),
    palm: document.getElementById('palmBtn'),
    point: document.getElementById('pointBtn'),
    grab: document.getElementById('grabBtn'),
    reset: document.getElementById('resetBtn')
};

const sliders = {
    width: document.getElementById('widthSlider'),
    depth: document.getElementById('depthSlider'),
    height: document.getElementById('heightSlider')
};

const values = {
    width: document.getElementById('widthValue'),
    depth: document.getElementById('depthValue'),
    height: document.getElementById('heightValue')
};

const colorSwatches = document.querySelectorAll('.color-swatch');
const placementButtons = document.querySelectorAll('.placement-preset');
const furniturePreview = document.getElementById('furniturePreview');
const applySizeBtn = document.getElementById('applySizeBtn');
const applyColorBtn = document.getElementById('applyColorBtn');
const applyPlacementBtn = document.getElementById('applyPlacementBtn');
const closeInfoBtn = document.getElementById('closeInfoBtn');

const initialDimensions = {
    width: parseInt(sliders.width.value, 10),
    depth: parseInt(sliders.depth.value, 10),
    height: parseInt(sliders.height.value, 10)
};

let activeColor = 'charcoal';
let activePlacement = 'a';

const placementMap = {
    a: { x: '48%', y: '52%' },
    b: { x: '30%', y: '40%' },
    c: { x: '60%', y: '32%' }
};

function setFeedback(message) {
    // In a real AR HUD, this text would be rendered as a floating status bubble.
    feedbackLabel.textContent = message;
}

function closeAllPanels() {
    Object.values(panels).forEach(panel => {
        panel.classList.remove('active');
    });
    menuOptions.forEach(option => option.classList.remove('active'));
}

function updateMenuAction(action) {
    closeAllPanels();
    const activeOption = Array.from(menuOptions).find(opt => opt.dataset.action === action);
    if (activeOption) {
        activeOption.classList.add('active');
    }
    switch (action) {
        case 'size':
            panels.size.classList.add('active');
            setFeedback('Size controls opened. Use gestures or sliders to resize the object.');
            break;
        case 'color':
            panels.color.classList.add('active');
            setFeedback('Color selection open. In AR, gaze would highlight swatches.');
            break;
        case 'material':
            setFeedback('Material selection simulated. In AR, this would change fabric texture.');
            break;
        case 'info':
            panels.info.classList.add('active');
            setFeedback('Information overlay displayed for product details.');
            break;
        case 'placement':
            panels.placement.classList.add('active');
            setFeedback('Placement panel open. Drag or point to move the furniture.');
            break;
        case 'cart':
            setFeedback('Item added to cart. Haptic confirmation would trigger in a headset.');
            break;
        default:
            setFeedback('Ready for interaction');
            break;
    }
}

function updateProductTransform() {
    // Convert physical dimension values into relative scaling factors.
    const scaleX = sliders.width.value / initialDimensions.width;
    const scaleZ = sliders.depth.value / initialDimensions.depth;
    const scaleY = sliders.height.value / initialDimensions.height;

    furnitureItem.style.transform = `rotateX(20deg) rotateY(-24deg) translateZ(0) scale3d(${scaleX}, ${scaleY}, ${scaleZ})`;
}

function updateDimensionLabels() {
    values.width.textContent = sliders.width.value;
    values.depth.textContent = sliders.depth.value;
    values.height.textContent = sliders.height.value;
}

function applySelectedColor() {
    const colorMap = {
        charcoal: 'linear-gradient(180deg, rgba(96,214,255,0.38), rgba(14, 20, 34, 0.9))',
        white: 'linear-gradient(180deg, rgba(255,255,255,0.76), rgba(220,228,242,0.92))',
        navy: 'linear-gradient(180deg, rgba(24,72,112,0.68), rgba(12,18,34,0.98))',
        cream: 'linear-gradient(180deg, rgba(236,219,183,0.82), rgba(186,166,137,0.92))',
        teal: 'linear-gradient(180deg, rgba(52,153,163,0.72), rgba(14,25,38,0.95))'
    };

    const surfaceStyle = colorMap[activeColor] || colorMap.charcoal;
    furnitureItem.querySelectorAll('div').forEach(surface => {
        surface.style.background = surfaceStyle;
    });

    productInfo.querySelector('.product-name').textContent = activeColor.charAt(0).toUpperCase() + activeColor.slice(1) + ' Sofa';
}

function applyPlacement(positionKey) {
    const coords = placementMap[positionKey];
    furniturePreview.style.left = coords.x;
    furniturePreview.style.top = coords.y;
    placementButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.position === positionKey);
    });
    setFeedback(`Selected placement ${positionKey.toUpperCase()}. In a headset, the object would snap to spatial anchors.`);
}

function resetPrototype() {
    closeAllPanels();
    sliders.width.value = initialDimensions.width;
    sliders.depth.value = initialDimensions.depth;
    sliders.height.value = initialDimensions.height;
    updateDimensionLabels();
    updateProductTransform();
    activeColor = 'charcoal';
    colorSwatches.forEach(swatch => swatch.classList.toggle('active', swatch.dataset.color === activeColor));
    applySelectedColor();
    applyPlacement('a');
    setFeedback('Prototype reset. Ready for new spatial interaction.');
}

function activateGesture(label) {
    setFeedback(`${label} gesture detected. In AR, this triggers the corresponding action.`);
}

productContainer.addEventListener('mousemove', event => {
    const bounds = productContainer.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    productContainer.style.transform = `translateZ(0) rotateX(${y * 10}deg) rotateY(${x * 18}deg)`;
    contextualMenu.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0)`;
});

productContainer.addEventListener('mouseleave', () => {
    productContainer.style.transform = 'translateZ(0) rotateX(0deg) rotateY(0deg)';
    contextualMenu.style.transform = 'translate3d(0,0,0)';
});

menuOptions.forEach(option => {
    option.addEventListener('mouseenter', () => {
        setFeedback(`Gaze focus on ${option.dataset.action}. Hold to activate.`);
        option.classList.add('active');
    });
    option.addEventListener('mouseleave', () => {
        option.classList.remove('active');
        setFeedback('Ready for interaction');
    });
    option.addEventListener('click', () => {
        updateMenuAction(option.dataset.action);
    });
});

Object.entries(gestureButtons).forEach(([gesture, button]) => {
    button.addEventListener('click', () => {
        if (gesture === 'reset') {
            resetPrototype();
            return;
        }
        activateGesture(`${button.textContent.trim()} (${gesture})`);
    });
});

sliders.width.addEventListener('input', () => {
    updateDimensionLabels();
    updateProductTransform();
});
sliders.depth.addEventListener('input', () => {
    updateDimensionLabels();
    updateProductTransform();
});
sliders.height.addEventListener('input', () => {
    updateDimensionLabels();
    updateProductTransform();
});

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        activeColor = swatch.dataset.color;
        colorSwatches.forEach(button => button.classList.toggle('active', button === swatch));
        applySelectedColor();
        setFeedback(`Color set to ${activeColor}. In AR, this would update the material preview instantly.`);
    });
});

placementButtons.forEach(button => {
    button.addEventListener('click', () => {
        activePlacement = button.dataset.position;
        applyPlacement(activePlacement);
    });
});

applySizeBtn.addEventListener('click', () => {
    updateProductTransform();
    setFeedback('Size adjustment applied. The object scale is updated in the spatial preview.');
});

applyColorBtn.addEventListener('click', () => {
    setFeedback('Color selection confirmed. The material preview is now active.');
});

applyPlacementBtn.addEventListener('click', () => {
    setFeedback('Placement confirmed. In AR, this would create a spatial anchor at the selected position.');
});

closeInfoBtn.addEventListener('click', () => {
    panels.info.classList.remove('active');
    setFeedback('Product information panel closed.');
});

// Initialize state for the prototype.
updateDimensionLabels();
updateProductTransform();
applySelectedColor();
applyPlacement('a');
setFeedback('Ready for interaction');
