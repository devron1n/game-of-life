;(() => {
    document.addEventListener('DOMContentLoaded', (e) => {
        console.log("DOM fully loaded and parsed");
        const canvas = document.querySelector('.canvas');
        const ctx = canvas.getContext('2d');
        const buttons = document.querySelectorAll('.btn-section__btn');
        const buttonRun = buttons[0];
        const buttonPause = buttons[1];
        const buttonClear = buttons[2];
        const buttonAudio = document.querySelector('.btn-audio-section__btn');
        const inputSpeed = document.querySelector('.speed-range__input');
        const labelSpeed = document.querySelector('.speed-range__label');
        const audio = document.querySelector('.audio');
        let speed = 100;
        let generation = [];
        let timer;
        let isRunning = false;
        let isPlayingMusic = true;

        const drawPixel = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 10, 10);
        };

        const clearField = () => {
            for (let i = 0; i < canvas.width / 10; i++) {
                generation[i] = [];
                for (let j = 0; j < canvas.height / 10; j++) {
                    generation[i][j] = false;
                }
            }
            showGen(generation);
        };

        const run = () => {
            showGen(evolution());
        };

        const evolution = () => {
            let nextGeneration = [];
            for (let i = 0; i < generation.length; i++) {
                nextGeneration[i] = [];
                for (let j = 0; j < generation[i].length; j++) {
                    let neighborsAlive = 0;

                    //looking for alive neighbors
                    for(let n = i - 1; n <= i + 1; n++) {
                        for(let m = j - 1; m <= j + 1; m++) {
                            if (n == i && m == j) continue;

                            //torus surface
                            let x = (n + generation.length) % generation.length;
                            let y = (m + generation[i].length) % generation[i].length;

                            if (generation[x][y] == true) {
                                    neighborsAlive++;
                            }
                        }
                    }

                    //will change in the next generation?
                    switch (generation[i][j]) {
                        case (false):
                            if (neighborsAlive == 3) {
                                nextGeneration[i][j] = true;
                            } else {
                                nextGeneration[i][j] = generation[i][j];
                            }
                            break;
                        case (true):
                            if (neighborsAlive < 2 || neighborsAlive > 3) {
                                nextGeneration[i][j] = false;
                            } else {
                                nextGeneration[i][j] = generation[i][j];
                            }
                            break;
                    }
                }
            }
            generation = nextGeneration;
            return generation;
        };

        const showGen = (arr) => {
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].length; j++) {
                    if (arr[i][j] == true) {
                        drawPixel(10 * i, 10 * j, 'white');
                    } else {
                        drawPixel(10 * i, 10 * j, 'black');
                    }
                }
            }
            //console.log('Showed new generation');
        };

        const pause = () => {
            clearInterval(timer);
        };

        canvas.addEventListener('click', (e) => {
            let x = e.pageX - e.target.offsetLeft;
            let y = e.pageY - e.target.offsetTop;
            x = Math.floor(x / 10);
            y = Math.floor(y / 10);

            if (isRunning == false) {
                if (generation[x][y] == false) {
                    drawPixel(10 * x, 10 * y, 'white');
                    generation[x][y] = true;
                } else {
                    drawPixel(10 * x, 10 * y, 'black');
                    generation[x][y] = false;
                }
            } else {
                alert('Вы не можете рисовать, когда игра запущена');
                //console.log('Drawing is blocked while running');
            }
        });


        buttonRun.addEventListener('click', (e) => {
            buttons.forEach((item) => {
                item.classList.remove('btn-section__btn_active');
            });
            e.target.classList.add('btn-section__btn_active');
            e.target.innerHTML = 'Running';
            buttonPause.innerHTML = 'Pause';
            audio.play();

            if (isRunning == false) {
                isRunning = true;
                timer = setInterval(run, speed);
                //console.log('Run', isRunning);
            } else {
                //console.log('Already running', isRunning);
            }
        });

        buttonPause.addEventListener('click', (e) => {
            buttons.forEach((item) => {
                item.classList.remove('btn-section__btn_active');
            });
            e.target.classList.add('btn-section__btn_active');
            e.target.innerHTML = 'Paused';
            buttonRun.innerHTML = 'Run';
            audio.pause();

            pause();
            isRunning = false;
            //console.log('Paused', isRunning);
        });

        buttonClear.addEventListener('click', (e) => {
            audio.currentTime = 0;
            buttonPause.click();
            clearField();
            isRunning = false;
            //console.log('Cleared', isRunning);
        });

        inputSpeed.addEventListener('input', (e) => {
            speed = Math.abs(e.target.value);
            //console.log(`Speed = ${speed}ms`);
            labelSpeed.innerHTML = `Speed: ${speed/1000}s`;

            if (isRunning == true) {
                pause();
                timer = setInterval(run, speed);
            }
        });

        buttonAudio.addEventListener('click', (e) => {
            if (isPlayingMusic == false){
                audio.volume = 1;
                //e.target.innerHTML = 'Sound: ON';
                e.target.classList.add('btn-audio-section__btn_active');
                isPlayingMusic = true;
            } else {
                audio.volume = 0;
                //e.target.innerHTML = 'Sound: OFF';
                e.target.classList.remove('btn-audio-section__btn_active');
                isPlayingMusic = false;
            }
        });


        /* ===INIT=== */        
        //canvas size calculation
        console.log('Window size =', window.innerWidth, window.innerHeight);
        //responsive canvas width
        if (window.innerWidth <= 768) {
            canvas.width = window.innerWidth; //100%
            canvas.width -= canvas.width % 10; //rounding
        } else {
            canvas.width = (70 / 100) * window.innerWidth; //70%
            canvas.width += 10 - (canvas.width % 10); //rounding
        }
        canvas.height = (50 / 100) * window.innerHeight; //50%
        canvas.height += 10 - (canvas.height % 10); //rounding
        console.log('Canvas size =', canvas.width, canvas.height);

        //canvas size setting
        canvas.setAttribute('width', canvas.width);
        canvas.setAttribute('height', canvas.height);

        //control panel size setting
        const container = document.querySelector('.container');
        container.style.width = `${canvas.width}px`;
        const header = document.querySelector('.header');
        header.style.width = `${canvas.width}px`;

        //speed init
        labelSpeed.innerHTML = `Speed: ${speed/1000}s`;

        buttonClear.click();
        buttonAudio.click();
        inputSpeed.setAttribute('value', 100);
    })
})();