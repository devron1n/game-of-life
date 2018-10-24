;(() => {
    document.addEventListener('DOMContentLoaded', (e) => {
        console.log("DOM fully loaded and parsed");
        const canvas = document.querySelector('.canvas');
        canvas.width = (50 / 100) * window.innerWidth;
        canvas.height = (50 / 100) * window.innerHeight;
        const ctx = canvas.getContext('2d');
        const buttons = document.querySelectorAll('.btn-section__btn');
        const buttonRun = buttons[0];
        const buttonPause = buttons[1];
        const buttonClear = buttons[2];
        let generation = [];
        let timer;
        let isRunning = false;

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

        buttonClear.addEventListener('click', () => {
            pause();
            clearField();
            isRunning = false;
            //console.log('Cleared', isRunning);
        });

        buttonRun.addEventListener('click', () => {
            if (isRunning == false) {
                isRunning = true;
                timer = setInterval(run, 500);
                //console.log('Run', isRunning);
            } else {
                //console.log('Already running', isRunning);
            }
        });

        buttonPause.addEventListener('click', () => {
            pause();
            isRunning = false;
            //console.log('Paused', isRunning);
        });

        //INIT========
        canvas.setAttribute('width', canvas.width);
        canvas.setAttribute('height', canvas.height);

        clearField();
    })
})();