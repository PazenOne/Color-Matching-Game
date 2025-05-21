const positions = new Map();
interact('.squares').draggable({
    listeners: {
        start (event) {
            if (!positions.has(event.target)) {
                positions.set(event.target, { x: 0, y: 0 });
            }
            console.log(event.type, event.target);
        },

        move (event) {
            const pos = positions.get(event.target);

            pos.x += event.dx;
            pos.y += event.dy;

            event.target.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
        },

        end (event) {
        }
        }
    })

interact('.target').dropzone({
        accept: '.squares',
        overlap: 0.75,

        ondragenter (event) {
            event.target.classList.add('drop-target');
            event.relatedTarget.classList.add('can-drop');
        },
        ondragleave (event) {
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        },
        ondrop (event) {
            event.relatedTarget.classList.remove('can-drop');

            const draggedId = event.relatedTarget.id;
            const dropzoneId = event.target.id;

            const draggedText = event.relatedTarget.querySelector('p');

            draggedText.textContent = '';
        

            if (
                (draggedId === 'red' && dropzoneId === 'redTarget') ||
                (draggedId === 'green' && dropzoneId === 'greenTarget')
            ) {
                draggedText.textContent = 'Correct!';

                // --- Snap logic ---
                const dropzoneRect = event.target.getBoundingClientRect();
                const squareRect = event.relatedTarget.getBoundingClientRect();

                // Calculate where the top-left of the square should be
                const targetX = dropzoneRect.left + (dropzoneRect.width / 2) - (squareRect.width / 2);
                const targetY = dropzoneRect.top - squareRect.height;

                // Calculate the difference from current position
                const dx = targetX - squareRect.left;
                const dy = targetY - squareRect.top;

                // Update the stored position
                const pos = positions.get(event.relatedTarget);
                pos.x += dx;
                pos.y += dy;

                // Snap the square
                event.relatedTarget.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            }
        },
    });
// Store initial positions for reset
const initialPositions = {};
document.querySelectorAll('.squares').forEach(el => {
    initialPositions[el.id] = { x: 0, y: 0 };
});

// Reset button logic
document.getElementById('resetButton').addEventListener('click', () => {
    // Reset each square's position and text
    document.querySelectorAll('.squares').forEach(el => {
        el.style.transform = 'translate(0px, 0px)';
        if (positions.has(el)) {
            positions.set(el, { x: 0, y: 0 });
        }
        // Clear the text inside the square
        const p = el.querySelector('p');
        if (p) p.textContent = '';
        // Remove any drag/drop classes
        el.classList.remove('drop-target');
        el.classList.remove('can-drop');
    });

    // Also clear the dropzone text and classes
    document.querySelectorAll('.target').forEach(target => {
        const p = target.querySelector('p');
        if (p) p.textContent = '';
        target.classList.remove('drop-target');
        target.classList.remove('can-drop');
    });
});

