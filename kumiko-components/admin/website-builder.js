// KUMIKO VISUAL WEBSITE BUILDER - JAVASCRIPT

// Global state
let draggedSection = null;
let draggedLayer = null;
let nextSectionId = 3;

// ============================================================================
// DEVICE TOGGLE
// ============================================================================
document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const canvas = document.getElementById('canvas');
        const device = btn.dataset.device;
        
        canvas.classList.remove('desktop', 'tablet', 'mobile');
        canvas.classList.add(device);
    });
});

// ============================================================================
// SECTION SELECTION
// ============================================================================
document.querySelectorAll('.canvas-section').forEach(section => {
    section.addEventListener('click', (e) => {
        // Don't select if clicking on editable content
        if (e.target.hasAttribute('contenteditable')) return;
        
        selectSection(section);
    });
});

function selectSection(section) {
    // Update canvas selection
    document.querySelectorAll('.canvas-section').forEach(s => s.classList.remove('selected'));
    section.classList.add('selected');
    
    // Update layer selection
    const sectionId = section.dataset.sectionId;
    document.querySelectorAll('.layer-item').forEach(l => l.classList.remove('active'));
    const layer = document.querySelector(`.layer-item[data-section-id="${sectionId}"]`);
    if (layer) layer.classList.add('active');
}

// ============================================================================
// LAYER SELECTION
// ============================================================================
document.querySelectorAll('.layer-item').forEach(layer => {
    layer.addEventListener('click', () => {
        document.querySelectorAll('.layer-item').forEach(l => l.classList.remove('active'));
        layer.classList.add('active');
        
        // Highlight corresponding section
        const sectionId = layer.dataset.sectionId;
        const section = document.querySelector(`.canvas-section[data-section-id="${sectionId}"]`);
        if (section) {
            selectSection(section);
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// ============================================================================
// DRAG & DROP - CANVAS SECTIONS
// ============================================================================
document.querySelectorAll('.canvas-section').forEach(section => {
    section.addEventListener('dragstart', (e) => {
        draggedSection = section;
        section.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    section.addEventListener('dragend', () => {
        section.classList.remove('dragging');
        document.querySelectorAll('.canvas-section').forEach(s => {
            s.classList.remove('drag-over-top', 'drag-over-bottom');
        });
        draggedSection = null;
    });
    
    section.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggedSection || draggedSection === section) return;
        
        const rect = section.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        section.classList.remove('drag-over-top', 'drag-over-bottom');
        
        if (e.clientY < midpoint) {
            section.classList.add('drag-over-top');
        } else {
            section.classList.add('drag-over-bottom');
        }
    });
    
    section.addEventListener('dragleave', () => {
        section.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    
    section.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedSection || draggedSection === section) return;
        
        const rect = section.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        if (e.clientY < midpoint) {
            section.parentNode.insertBefore(draggedSection, section);
        } else {
            section.parentNode.insertBefore(draggedSection, section.nextSibling);
        }
        
        section.classList.remove('drag-over-top', 'drag-over-bottom');
        
        // Update layers list to match
        updateLayersOrder();
    });
});

// ============================================================================
// DRAG & DROP - LAYERS LIST
// ============================================================================
document.querySelectorAll('.layer-item').forEach(layer => {
    layer.addEventListener('dragstart', (e) => {
        draggedLayer = layer;
        layer.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    layer.addEventListener('dragend', () => {
        layer.classList.remove('dragging');
        document.querySelectorAll('.layer-item').forEach(l => l.classList.remove('drag-over'));
        draggedLayer = null;
    });
    
    layer.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggedLayer || draggedLayer === layer) return;
        
        layer.classList.add('drag-over');
    });
    
    layer.addEventListener('dragleave', () => {
        layer.classList.remove('drag-over');
    });
    
    layer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedLayer || draggedLayer === layer) return;
        
        layer.parentNode.insertBefore(draggedLayer, layer);
        layer.classList.remove('drag-over');
        
        // Update canvas sections to match
        updateCanvasOrder();
    });
});

function updateLayersOrder() {
    const canvas = document.getElementById('canvas');
    const sections = canvas.querySelectorAll('.canvas-section');
    const layersList = document.getElementById('layers-list');
    
    // Clear layers list
    layersList.innerHTML = '';
    
    // Recreate layers in order
    sections.forEach(section => {
        const sectionId = section.dataset.sectionId;
        const existingLayer = document.querySelector(`.layer-item[data-section-id="${sectionId}"]`);
        
        if (existingLayer) {
            layersList.appendChild(existingLayer.cloneNode(true));
        }
    });
    
    // Reattach event listeners
    attachLayerEventListeners();
}

function updateCanvasOrder() {
    const canvas = document.getElementById('canvas');
    const layersList = document.getElementById('layers-list');
    const layers = layersList.querySelectorAll('.layer-item');
    
    layers.forEach(layer => {
        const sectionId = layer.dataset.sectionId;
        const section = document.querySelector(`.canvas-section[data-section-id="${sectionId}"]`);
        
        if (section) {
            canvas.appendChild(section);
        }
    });
}

function attachLayerEventListeners() {
    document.querySelectorAll('.layer-item').forEach(layer => {
        // Selection
        layer.addEventListener('click', () => {
            document.querySelectorAll('.layer-item').forEach(l => l.classList.remove('active'));
            layer.classList.add('active');
            
            const sectionId = layer.dataset.sectionId;
            const section = document.querySelector(`.canvas-section[data-section-id="${sectionId}"]`);
            if (section) {
                selectSection(section);
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        // Drag events
        layer.addEventListener('dragstart', (e) => {
            draggedLayer = layer;
            layer.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        layer.addEventListener('dragend', () => {
            layer.classList.remove('dragging');
            document.querySelectorAll('.layer-item').forEach(l => l.classList.remove('drag-over'));
            draggedLayer = null;
        });
        
        layer.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedLayer || draggedLayer === layer) return;
            layer.classList.add('drag-over');
        });
        
        layer.addEventListener('dragleave', () => {
            layer.classList.remove('drag-over');
        });
        
        layer.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedLayer || draggedLayer === layer) return;
            
            layer.parentNode.insertBefore(draggedLayer, layer);
            layer.classList.remove('drag-over');
            updateCanvasOrder();
        });
    });
}

// ============================================================================
// DUPLICATE & DELETE SECTIONS
// ============================================================================
document.addEventListener('click', (e) => {
    // Duplicate button
    if (e.target.classList.contains('duplicate-btn')) {
        e.stopPropagation();
        const section = e.target.closest('.canvas-section');
        duplicateSection(section);
    }
    
    // Delete button
    if (e.target.classList.contains('delete-btn')) {
        e.stopPropagation();
        const section = e.target.closest('.canvas-section');
        if (confirm('Delete this section?')) {
            deleteSection(section);
        }
    }
});

function duplicateSection(section) {
    const clone = section.cloneNode(true);
    nextSectionId++;
    const newId = `${section.dataset.sectionId}-copy-${nextSectionId}`;
    clone.dataset.sectionId = newId;
    clone.classList.remove('selected');
    
    // Insert after original
    section.parentNode.insertBefore(clone, section.nextSibling);
    
    // Add to layers list
    const layerClone = document.querySelector(`.layer-item[data-section-id="${section.dataset.sectionId}"]`).cloneNode(true);
    layerClone.dataset.sectionId = newId;
    layerClone.classList.remove('active');
    
    const layersList = document.getElementById('layers-list');
    const originalLayer = document.querySelector(`.layer-item[data-section-id="${section.dataset.sectionId}"]`);
    layersList.insertBefore(layerClone, originalLayer.nextSibling);
    
    // Reattach all event listeners
    attachAllEventListeners();
    
    // Select the new section
    selectSection(clone);
}

function deleteSection(section) {
    const sectionId = section.dataset.sectionId;
    
    // Remove from canvas
    section.remove();
    
    // Remove from layers
    const layer = document.querySelector(`.layer-item[data-section-id="${sectionId}"]`);
    if (layer) layer.remove();
    
    // Select another section if available
    const remainingSections = document.querySelectorAll('.canvas-section');
    if (remainingSections.length > 0) {
        selectSection(remainingSections[0]);
    }
}

// ============================================================================
// SECTION LIBRARY MODAL
// ============================================================================
const addSectionBtn = document.getElementById('add-section-btn');
const sectionLibrary = document.getElementById('section-library');
const closeModal = document.getElementById('close-modal');

addSectionBtn.addEventListener('click', () => {
    sectionLibrary.classList.add('active');
});

closeModal.addEventListener('click', () => {
    sectionLibrary.classList.remove('active');
});

sectionLibrary.addEventListener('click', (e) => {
    if (e.target === sectionLibrary) {
        sectionLibrary.classList.remove('active');
    }
});

// Add section from template
document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
        const template = card.dataset.template;
        addSectionFromTemplate(template);
        sectionLibrary.classList.remove('active');
    });
});

function addSectionFromTemplate(template) {
    nextSectionId++;
    const newId = `${template}-${nextSectionId}`;
    
    let sectionHTML = '';
    let layerName = '';
    let layerPreview = '';
    
    if (template === 'hero') {
        sectionHTML = `
            <div class="canvas-section demo-hero" data-section-id="${newId}" draggable="true">
                <div class="section-overlay">
                    <span class="section-label">
                        <span class="drag-handle">⋮⋮</span>
                        Hero Section
                    </span>
                    <div class="section-controls">
                        <button class="section-btn duplicate-btn">⎘</button>
                        <button class="section-btn delete-btn">×</button>
                    </div>
                </div>
                <h1 class="demo-hero-title" contenteditable="true">Your Title Here</h1>
                <p class="demo-hero-description" contenteditable="true">Your description goes here. Click to edit.</p>
            </div>
        `;
        layerName = 'Hero Section';
        layerPreview = 'Your Title Here';
    } else if (template === 'text') {
        sectionHTML = `
            <div class="canvas-section demo-text" data-section-id="${newId}" draggable="true">
                <div class="section-overlay">
                    <span class="section-label">
                        <span class="drag-handle">⋮⋮</span>
                        Text Section
                    </span>
                    <div class="section-controls">
                        <button class="section-btn duplicate-btn">⎘</button>
                        <button class="section-btn delete-btn">×</button>
                    </div>
                </div>
                <div class="demo-text-content">
                    <h2 class="demo-text-title" contenteditable="true">Section Title</h2>
                    <div class="demo-text-body" contenteditable="true">
                        <p>Your content goes here. Click to edit this text.</p>
                    </div>
                </div>
            </div>
        `;
        layerName = 'Text Section';
        layerPreview = 'Section Title';
    } else if (template === 'menu') {
        sectionHTML = `
            <div class="canvas-section demo-text" data-section-id="${newId}" draggable="true" style="background: #fafafa;">
                <div class="section-overlay">
                    <span class="section-label">
                        <span class="drag-handle">⋮⋮</span>
                        Menu Section
                    </span>
                    <div class="section-controls">
                        <button class="section-btn duplicate-btn">⎘</button>
                        <button class="section-btn delete-btn">×</button>
                    </div>
                </div>
                <div class="demo-text-content">
                    <h2 class="demo-text-title" contenteditable="true">Our Menu</h2>
                    <div class="demo-text-body" contenteditable="true">
                        <p>Your menu will be displayed here. Select a menu from the properties panel.</p>
                    </div>
                </div>
            </div>
        `;
        layerName = 'Menu Section';
        layerPreview = 'Our Menu';
    } else if (template === 'contact') {
        sectionHTML = `
            <div class="canvas-section demo-text" data-section-id="${newId}" draggable="true">
                <div class="section-overlay">
                    <span class="section-label">
                        <span class="drag-handle">⋮⋮</span>
                        Contact Section
                    </span>
                    <div class="section-controls">
                        <button class="section-btn duplicate-btn">⎘</button>
                        <button class="section-btn delete-btn">×</button>
                    </div>
                </div>
                <div class="demo-text-content">
                    <h2 class="demo-text-title" contenteditable="true">Contact Us</h2>
                    <div class="demo-text-body" contenteditable="true">
                        <p>Get in touch with us. Your contact information and form will appear here.</p>
                    </div>
                </div>
            </div>
        `;
        layerName = 'Contact Section';
        layerPreview = 'Contact Us';
    }
    
    // Add to canvas
    const canvas = document.getElementById('canvas');
    canvas.insertAdjacentHTML('beforeend', sectionHTML);
    
    // Add to layers
    const layerHTML = `
        <div class="layer-item" draggable="true" data-section-id="${newId}">
            <span class="layer-drag-handle">⋮⋮</span>
            <div class="layer-info">
                <div class="layer-type">${layerName}</div>
                <div class="layer-preview">${layerPreview}</div>
            </div>
        </div>
    `;
    const layersList = document.getElementById('layers-list');
    layersList.insertAdjacentHTML('beforeend', layerHTML);
    
    // Reattach all event listeners
    attachAllEventListeners();
    
    // Select the new section
    const newSection = document.querySelector(`.canvas-section[data-section-id="${newId}"]`);
    selectSection(newSection);
    newSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================================================
// TOGGLE SWITCHES
// ============================================================================
document.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
    });
});

// ============================================================================
// CONTENTEDITABLE - SAVE ON BLUR
// ============================================================================
document.addEventListener('blur', (e) => {
    if (e.target.hasAttribute('contenteditable')) {
        console.log('Content saved:', e.target.textContent);
        // In production: save to backend
    }
}, true);

// ============================================================================
// HELPER: REATTACH ALL EVENT LISTENERS
// ============================================================================
function attachAllEventListeners() {
    // Section events
    document.querySelectorAll('.canvas-section').forEach(section => {
        section.removeEventListener('click', () => {});
        section.addEventListener('click', (e) => {
            if (e.target.hasAttribute('contenteditable')) return;
            selectSection(section);
        });
        
        // Drag events (simplified - in production use proper event listener management)
    });
    
    // Layer events
    attachLayerEventListeners();
}

// ============================================================================
// INITIALIZATION
// ============================================================================
console.log('Kumiko Visual Website Builder loaded');
console.log('✓ Drag & drop sections on canvas');
console.log('✓ Drag & drop layers in sidebar');
console.log('✓ Click text to edit inline');
console.log('✓ Click + Add Section for templates');
