document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let currentIndex = 0;
    let animationID;
    let startTime;
    const cardWidth = document.querySelector('.card').offsetWidth;

    // Touch events
    cardContainer.addEventListener('touchstart', dragStart);
    cardContainer.addEventListener('touchmove', drag);
    cardContainer.addEventListener('touchend', dragEnd);

    // Mouse events
    cardContainer.addEventListener('mousedown', dragStart);
    cardContainer.addEventListener('mousemove', drag);
    cardContainer.addEventListener('mouseup', dragEnd);
    cardContainer.addEventListener('mouseleave', dragEnd);

    // Prevent context menu
    window.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    function dragStart(event) {
        startTime = new Date().getTime();
        isDragging = true;
        
        const point = event.type.includes('mouse') 
            ? event.pageX 
            : event.touches[0].clientX;
        
        startPos = point - cardContainer.offsetLeft;
        
        animationID = requestAnimationFrame(animation);
        cardContainer.style.cursor = 'grabbing';
    }

    function drag(event) {
        if (!isDragging) return;
        
        event.preventDefault();
        const currentPosition = event.type.includes('mouse') 
            ? event.pageX 
            : event.touches[0].clientX;
        
        const currentMove = currentPosition - startPos;
        currentTranslate = prevTranslate + currentMove;
    }

    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        
        const endTime = new Date().getTime();
        const swipeTime = endTime - startTime;
        
        const movedBy = currentTranslate - prevTranslate;
        
        if (swipeTime < 300 && Math.abs(movedBy) > 50) {
            // Quick swipe
            if (movedBy < 0) {
                currentIndex = Math.min(currentIndex + 1, 4);
            } else {
                currentIndex = Math.max(currentIndex - 1, 0);
            }
        } else {
            // Snap to closest card
            currentIndex = Math.round(-currentTranslate / cardWidth);
            currentIndex = Math.max(0, Math.min(currentIndex, 4));
        }
        
        currentTranslate = -currentIndex * cardWidth;
        prevTranslate = currentTranslate;
        
        cardContainer.style.transition = 'transform 0.3s ease-out';
        cardContainer.style.transform = `translateX(${currentTranslate}px)`;
        cardContainer.style.cursor = 'grab';
    }

    function animation() {
        if (isDragging) {
            setSliderPosition();
            requestAnimationFrame(animation);
        }
    }

    function setSliderPosition() {
        cardContainer.style.transform = `translateX(${currentTranslate}px)`;
    }
}); 
