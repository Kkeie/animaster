addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });
}

function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = this.getTransform(translation, null);
        },
        
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = this.getTransform(null, ratio);
        },
        
        getTransform(translation, ratio) {
            const result = [];
            if (translation) {
                result.push(`translate(${translation.x}px,${translation.y}px)`);
            }
            if (ratio) {
                result.push(`scale(${ratio})`);
            }
            return result.join(' ');
        },
        
        moveAndHide(element, duration) {
            const moveDuration = duration * 0.4;
            const fadeDuration = duration * 0.6;
            
            this.move(element, moveDuration, {x: 100, y: 20});
            setTimeout(() => {
                this.fadeOut(element, fadeDuration);
            }, moveDuration);
        },
        
        showAndHide(element, duration) {
            const stepDuration = duration / 3;
            this.fadeIn(element, stepDuration);
            setTimeout(() => {
                this.fadeOut(element, stepDuration);
            }, stepDuration * 2);
        },
        
        heartBeating(element) {
            const animate = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1);
                }, 500);
            };
            animate();
            setInterval(animate, 1000);
        }
    };
}
