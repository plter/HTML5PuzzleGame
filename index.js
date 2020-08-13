Array.prototype.remove = function(obj) {
    for (let i = 0; i < this.length; i++) {
        if(this[i] === obj) {
            this.splice(i, 1)
            return
        }
    }
}

window.onload = function () {
    let breaking = false
    document.getElementById('startBreakBtn').addEventListener('click', () => {
        breaking = true
        breakCards()
    })
    document.getElementById('stopBreakBtn').addEventListener('click', () => {
        breaking = false
    })

    const cjs = createjs

    const stage = new cjs.Stage('puzzleView')

    cjs.Ticker.framerate = 50
    cjs.Ticker.addEventListener('tick', stage)

    let img = new Image()
    img.onload = function () {
        genCard()
    }
    img.src = './qiaoba.jpg'

    const ROW_NUM = 4, COL_NUM = 6, DIR_LEFT = 'left', DIR_RIGHT = 'right', DIR_UP = 'up', DIR_DOWN = 'down', DIR_NONE = 'none'
    let cardWidth, cardHeight, cardArr = [], currentNullIndexRow = 0, currentNullIndexCol = 0

    function genCard() {
        cardWidth = img.width / COL_NUM
        cardHeight = img.height / ROW_NUM

        for(let i = 0; i < ROW_NUM; i++) {
            cardArr[i] = []
            for (let j = 0; j < COL_NUM; j++) {
                if (i < ROW_NUM - 1 || j < COL_NUM - 1) {
                    let card = new Card(img, new cjs.Rectangle(cardWidth * j, cardHeight * i, cardWidth, cardHeight))
                    cardArr[i][j] = card
                    card.indexRow = i
                    card.indexCol = j
                    card.rightIndexRow = i
                    card.rightIndexCol = j
                    card.resetPositionByIndexRowCol()
                    card.addEventListener('click', cardClickHandler)
                    stage.addChild(card)
                }
            }
        }

        currentNullIndexRow = ROW_NUM - 1
        currentNullIndexCol = COL_NUM - 1
        cardArr[currentNullIndexRow][currentNullIndexCol] = null
    }

    function cardClickHandler(e) {
        const card = e.currentTarget
        const dir = getDir(card)
        moveCard(card, dir)

        checkSuccess()
    }

    function checkSuccess() {
        for (let i = 0; i < cardArr.length; i++) {
            const arr = cardArr[i]
            for (let j = 0; j < arr.length; j++) {
                const card = arr[j]
                if (card && !card.onRightPosition()) {
                    return false
                }
            }
        }

        alert('成功了')
        return true
    }

    function getDir(card) {
        if (card.indexCol > 0 && !cardArr[card.indexRow][card.indexCol-1]) {
            return DIR_LEFT
        }
        if (card.indexCol < COL_NUM - 1 && !cardArr[card.indexRow][card.indexCol+1]) {
            return DIR_RIGHT
        }
        if (card.indexRow > 0 && !cardArr[card.indexRow-1][card.indexCol]) {
            return DIR_UP
        }
        if (card.indexRow < ROW_NUM - 1 && !cardArr[card.indexRow+1][card.indexCol]) {
            return DIR_DOWN
        }

        return DIR_NONE
    }

    function moveCard(card, dir, endCallback) {
        cardArr[card.indexRow][card.indexCol] = null
        currentNullIndexRow = card.indexRow
        currentNullIndexCol = card.indexCol

        switch(dir) {
            case DIR_LEFT:
                card.moveLeft(endCallback)
                break;
            case DIR_RIGHT:
                card.moveRight(endCallback)
                break;
            case DIR_UP:
                card.moveUp(endCallback)
                break;
            case DIR_DOWN:
                card.moveDown(endCallback)
                break;
        }

        cardArr[card.indexRow][card.indexCol] = card
    }

    let lastMoveDir = DIR_NONE
    function breakCards() {
        if (!breaking) return
        
        const possibleDirs = [DIR_LEFT, DIR_RIGHT, DIR_UP, DIR_DOWN]
        possibleDirs.remove(lastMoveDir)

        if (currentNullIndexCol <= 0) {
            possibleDirs.remove(DIR_LEFT)
        }
        if (currentNullIndexCol >= COL_NUM-1) {
            possibleDirs.remove(DIR_RIGHT)
        }
        if (currentNullIndexRow <= 0) {
            possibleDirs.remove(DIR_UP)
        }
        if (currentNullIndexRow >= ROW_NUM-1) {
            possibleDirs.remove(DIR_DOWN)
        }

        const len = possibleDirs.length
        switch(possibleDirs[parseInt(len * Math.random())]) {
            case DIR_LEFT:
                moveCard(cardArr[currentNullIndexRow][currentNullIndexCol-1], DIR_RIGHT, breakCards)
                lastMoveDir = DIR_RIGHT
                break;
            case DIR_RIGHT:
                moveCard(cardArr[currentNullIndexRow][currentNullIndexCol+1], DIR_LEFT, breakCards)
                lastMoveDir = DIR_LEFT
                break;
            case DIR_UP:
                moveCard(cardArr[currentNullIndexRow-1][currentNullIndexCol], DIR_DOWN, breakCards)
                lastMoveDir = DIR_DOWN
                break;
            case DIR_DOWN:
                moveCard(cardArr[currentNullIndexRow+1][currentNullIndexCol], DIR_UP, breakCards)
                lastMoveDir = DIR_UP
                break;
        }
    }
}