// Select the counter element
const counter = document.getElementById('counter');

// Select the buttons
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const resetBtn = document.getElementById('reset');

// Initialize counter value
let count = 0;

// Function to update the counter display
function updateCounter() {
    counter.textContent = count;
    // Change the color based on the value
    if (count > 0) {
        counter.style.color = 'green';
    } else if (count < 0) {
        counter.style.color = 'purple';
    } else {
        counter.style.color = '#4CAF50';
    }
}

// Add event listeners to buttons
increaseBtn.addEventListener('click', () => {
    count++;
    updateCounter();
});

decreaseBtn.addEventListener('click', () => {
    count--;
    updateCounter();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateCounter();
});
