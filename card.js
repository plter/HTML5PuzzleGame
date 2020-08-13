const cjs = createjs

class Card extends cjs.Container{
    constructor(img, srcRect) {
        super()
        this.init(img, srcRect)
    }
    init(img, srcRect) {
        this.bitmap = new cjs.Bitmap(img)
        this.bitmap.sourceRect = srcRect
        this.addChild(this.bitmap)

        this.indexRow = 0
        this.indexCol = 0
        this.rightIndexRow = 0
        this.rightIndexCol = 0
        this.frames = 10
        this.currentFrame = 0
        this.speedX = 0
        this.speedY = 0
        this.width = srcRect.width
        this.height = srcRect.height
    }
    onRightPosition() {
        return this.indexRow === this.rightIndexRow && this.indexCol === this.rightIndexCol
    }
    resetPositionByIndexRowCol() {
        this.x = this.indexCol * this.width
        this.y = this.indexRow * this.height
    }
    moveToIndex(indexRow, indexCol, endCallback) {
        const offsetX = (indexCol - this.indexCol) * this.width
        const offsetY = (indexRow - this.indexRow) * this.height
        this.currentFrame = 0
        this.speedX = offsetX / this.frames
        this.speedY = offsetY / this.frames

        this.indexRow = indexRow
        this.indexCol = indexCol

        this.tickHandler._self = () => {
            this.tickHandler(endCallback)
        }
        cjs.Ticker.addEventListener('tick', this.tickHandler._self)
    }
    tickHandler(endCallback) {
        this.x += this.speedX
        this.y += this.speedY
        this.currentFrame++
        if (this.currentFrame >= this.frames) {
            cjs.Ticker.removeEventListener('tick', this.tickHandler._self)
            this.resetPositionByIndexRowCol()

            if (endCallback) {
                endCallback()
            }
        }
    }
    moveLeft(endCallback) {
        this.moveToIndex(this.indexRow, this.indexCol-1, endCallback)
    }
    moveRight(endCallback) {
        this.moveToIndex(this.indexRow, this.indexCol+1, endCallback)
    }
    moveUp(endCallback) {
        this.moveToIndex(this.indexRow-1, this.indexCol, endCallback)
    }
    moveDown(endCallback) {
        this.moveToIndex(this.indexRow+1, this.indexCol, endCallback)
    }
}