document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 4;
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const restartButton = document.getElementById('restart-button');
    let tiles = [];
    let score = 0;

    function createBoard() {
        for (let i = 0; i < boardSize * boardSize; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.top = `${Math.floor(i / boardSize) * 110}px`;
            tile.style.left = `${(i % boardSize) * 110}px`;
            board.appendChild(tile);
            tiles.push(tile);
        }
        addNewTile();
        addNewTile();
    }

    function addNewTile() {
        let emptyTiles = tiles.filter(tile => tile.innerHTML === '');
        if (emptyTiles.length === 0) return;
        let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        randomTile.innerHTML = Math.random() > 0.1 ? 2 : 4;
        randomTile.classList.add(`tile-${randomTile.innerHTML}`);
    }

    function moveTiles(direction) {
        let moved = false;
        const directionVectors = {
            'up': { row: -1, col: 0 },
            'down': { row: 1, col: 0 },
            'left': { row: 0, col: -1 },
            'right': { row: 0, col: 1 }
        };
        const vector = directionVectors[direction];

        function traverseGrid() {
            let positions = [];
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    positions.push({ row, col });
                }
            }
            if (direction === 'right' || direction === 'down') {
                positions.reverse();
            }
            return positions;
        }

        function moveTile(tile, newRow, newCol) {
            const oldRow = tile.row;
            const oldCol = tile.col;
            const newTile = tiles[newRow * boardSize + newCol];
            if (newTile.innerHTML === '') {
                newTile.innerHTML = tile.innerHTML;
                newTile.classList.add(`tile-${tile.innerHTML}`);
                tile.innerHTML = '';
                tile.classList.remove(`tile-${tile.innerHTML}`);
                moved = true;
            }
        }

        traverseGrid().forEach(position => {
            const { row, col } = position;
            const tile = tiles[row * boardSize + col];
            if (tile.innerHTML !== '') {
                let newRow = row;
                let newCol = col;
                while (true) {
                    const nextRow = newRow + vector.row;
                    const nextCol = newCol + vector.col;
                    if (nextRow < 0 || nextRow >= boardSize || nextCol < 0 || nextCol >= boardSize) break;
                    const nextTile = tiles[nextRow * boardSize + nextCol];
                    if (nextTile.innerHTML !== '') break;
                    newRow = nextRow;
                    newCol = nextCol;
                }
                if (newRow !== row || newCol !== col) {
                    tile.style.transform = `translate(${(newCol - col) * 110}px, ${(newRow - row) * 110}px)`;
                    requestAnimationFrame(() => {
                        moveTile(tile, newRow, newCol);
                        tile.style.transform = '';
                    });
                }
            }
        });

        return moved;
    }

    function mergeTiles(direction) {
        let merged = false;
        const directionVectors = {
            'up': { row: -1, col: 0 },
            'down': { row: 1, col: 0 },
            'left': { row: 0, col: -1 },
            'right': { row: 0, col: 1 }
        };
        const vector = directionVectors[direction];

        function traverseGrid() {
            let positions = [];
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    positions.push({ row, col });
                }
            }
            if (direction === 'right' || direction === 'down') {
                positions.reverse();
            }
            return positions;
        }

        traverseGrid().forEach(position => {
            const { row, col } = position;
            const tile = tiles[row * boardSize + col];
            if (tile.innerHTML !== '') {
                const nextRow = row + vector.row;
                const nextCol = col + vector.col;
                if (nextRow >= 0 && nextRow < boardSize && nextCol >= 0 && nextCol < boardSize) {
                    const nextTile = tiles[nextRow * boardSize + nextCol];
                    if (nextTile.innerHTML === tile.innerHTML) {
                        const newValue = parseInt(tile.innerHTML) * 2;
                        tile.innerHTML = newValue;
                        tile.classList.add(`tile-${newValue}`);
                        tile.classList.remove(`tile-${tile.innerHTML}`);
                        nextTile.innerHTML = '';
                        nextTile.classList.remove(`tile-${nextTile.innerHTML}`);
                        score += newValue;
                        scoreDisplay.innerHTML = score;
                        merged = true;
                    }
                }
            }
        });

        return merged;
    }

    function checkGameOver() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const tile = tiles[row * boardSize + col];
                if (tile.innerHTML === '') {
                    return;
                }
                const directions = [
                    { row: -1, col: 0 },
                    { row: 1, col: 0 },
                    { row: 0, col: -1 },
                    { row: 0, col: 1 }
                ];
                for (const direction of directions) {
                    const nextRow = row + direction.row;
                    const nextCol = col + direction.col;
                    if (nextRow >= 0 && nextRow < boardSize && nextCol >= 0 && nextCol < boardSize) {
                        const nextTile = tiles[nextRow * boardSize + nextCol];
                        if (nextTile.innerHTML === tile.innerHTML) {
                            return;
                        }
                    }
                }
            }
        }
        restartButton.style.display = 'block';
        alert('Game Over!');
    }

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
                moveTiles('up');
                mergeTiles('up');
                moveTiles('up');
                break;
            case 'ArrowDown':
                moveTiles('down');
                mergeTiles('down');
                moveTiles('down');
                break;
            case 'ArrowLeft':
                moveTiles('left');
                mergeTiles('left');
                moveTiles('left');
                break;
            case 'ArrowRight':
                moveTiles('right');
                mergeTiles('right');
                moveTiles('right');
                break;
        }
        addNewTile();
        checkGameOver();
    });

    restartButton.addEventListener('click', () => {
        score = 0;
        scoreDisplay.innerHTML = score;
        restartButton.style.display = 'none';
        createBoard();
    });

    createBoard();

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#000000', '#FF5733', '#FF8C00', '#FFD700', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF', '#9370DB', '#FF1493', '#000000'];
    let colorIndex = 0;

    setInterval(() => {
        document.body.style.backgroundColor = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
    }, 5000);

});