addListeners();

function addListeners() {
    const master = animaster();
    let heartAnim, moveAndHideAnim;
    let customAnimation;

    document.getElementById('fadeInPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        master.fadeIn(block, 5000);
    });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        master.move(block, 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        master.scale(block, 1000, 1.25);
    });

    document.getElementById('moveAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        moveAndHideAnim = master.moveAndHide(block, 2000);
    });

    document.getElementById('moveAndHideReset').addEventListener('click', function () {
        if (moveAndHideAnim) {
            moveAndHideAnim.reset();
        }
    });

    document.getElementById('showAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        master.showAndHide(block, 3000);
    });

    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        heartAnim = master.heartBeating(block);
    });

    document.getElementById('heartBeatingStop').addEventListener('click', function () {
        if (heartAnim) {
            heartAnim.stop();
        }
    });

    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document.getElementById('worryAnimationBlock').addEventListener('click', worryAnimationHandler);
}

function animaster() {
    let _steps = [];

    function _fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function _fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function _move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function _scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function addMove(duration, translation) {
        _steps.push({ type: 'move', duration, translation });
        return api;
    }

    function addScale(duration, ratio) {
        _steps.push({ type: 'scale', duration, ratio });
        return api;
    }

    function addFadeIn(duration) {
        _steps.push({ type: 'fadeIn', duration });
        return api;
    }

    function addFadeOut(duration) {
        _steps.push({ type: 'fadeOut', duration });
        return api;
    }

    function addDelay(duration) {
        _steps.push({ type: 'delay', duration });
        return api;
    }

    function play(element, cycled = false) {
        let timerIds = [];
        let totalDuration = 0;
        const initialHidden = element.classList.contains('hide');

        _steps.forEach(step => {
            timerIds.push(setTimeout(() => {
                executeStep(step, element);
            }, totalDuration));
            totalDuration += step.duration;
        });

        let intervalId = null;
        if (cycled) {
            intervalId = setInterval(() => {
                let t = 0;
                _steps.forEach(step => {
                    timerIds.push(setTimeout(() => {
                        executeStep(step, element);
                    }, t));
                    t += step.duration;
                });
            }, totalDuration);
        }

        return {
            stop() {
                timerIds.forEach(timerId => clearTimeout(timerId));
                if (intervalId) clearInterval(intervalId);
            },
            reset() {
                this.stop();
                element.style.transitionDuration = null;
                element.style.transform = null;
                if (initialHidden) {
                    element.classList.remove('show');
                    element.classList.add('hide');
                } else {
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            }
        };
    }

    function buildHandler() {
        return function () {
            play(this);
        };
    }

    function executeStep(step, element) {
        switch (step.type) {
            case 'fadeIn': _fadeIn(element, step.duration); break;
            case 'fadeOut': _fadeOut(element, step.duration); break;
            case 'move': _move(element, step.duration, step.translation); break;
            case 'scale': _scale(element, step.duration, step.ratio); break;
            case 'delay': break;
        }
    }

    function fadeIn(element, duration) {
        return animaster().addFadeIn(duration).play(element);
    }

    function fadeOut(element, duration) {
        return animaster().addFadeOut(duration).play(element);
    }

    function move(element, duration, translation) {
        return animaster().addMove(duration, translation).play(element);
    }

    function scale(element, duration, ratio) {
        return animaster().addScale(duration, ratio).play(element);
    }

    function moveAndHide(element, duration) {
        return animaster()
            .addMove(duration * 0.4, { x: 100, y: 20 })
            .addFadeOut(duration * 0.6)
            .play(element);
    }

    function showAndHide(element, duration) {
        return animaster()
            .addFadeIn(duration / 3)
            .addDelay(duration / 3)
            .addFadeOut(duration / 3)
            .play(element);
    }

    function heartBeating(element) {
        return animaster()
            .addScale(500, 1.4)
            .addScale(500, 1)
            .play(element, true);
    }

    const api = {
        _steps,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        play,
        buildHandler,
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating
    };

    return api;
}
