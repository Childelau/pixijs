import * as PIXI from 'pixi.js'

let app = new PIXI.Application({width: 640, height: 360})
document.body.append(app.view)

//
let obj = new PIXI.Graphics()
obj.beginFill(0xff0000)
obj.drawRect(200, 20, 150, 100)
obj.endFill()
obj.eventMode ='static'
obj.cursor = 'move'
obj.on('pointerdown', onDragStart, obj)


app.stage.addChild(obj)
app.stage.eventMode = 'static'
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd)
app.stage.on('pointerupoutside', onDragEnd)

let dragTarget = null
let startPointX, startPointY, objX, objY, activeObject, activeObjBorder 

function clearActive() {
    if (activeObjBorder) {
        activeObjBorder.clear()
        // app.ticker.remove(updateActiveTargetBorder)

    }
}

function onDragMove(event) {
    if (dragTarget) {

        // console.log(event.x, startPointX);
        dragTarget.x = event.data.originalEvent.clientX - startPointX + objX
        dragTarget.y = event.data.originalEvent.clientY - startPointY + objY

        // addActiveTargetBorder()
    }
}

function onDragStart(event) {
    // console.log(event);
    this.alpha = 0.5
    dragTarget = this
    startPointX = event.data.originalEvent.clientX
    startPointY = event.data.originalEvent.clientY
    objX = obj.x
    objY = obj.y
    app.stage.on('pointermove', onDragMove)

    activeObject = event.target;
    
    addActiveTargetBorder()
    app.ticker.add(updateActiveTargetBorder)
    
    // addActiveTargetControlPoint(obj)
}


function onDragEnd() {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove)
        dragTarget.alpha = 1
        dragTarget = null
        startPointX = null
        startPointY = null
        app.stage.on('pointerdown', clearActive)
        app.ticker.remove(updateActiveTargetBorder)
    }
}


// border
function  getObjStageBound(obj)  {
    const localBounds = obj.getLocalBounds()
    const tl = new PIXI.Point(localBounds.x, localBounds.y)
    const tr = new PIXI.Point(localBounds.x + localBounds.width, localBounds.y)
    const br = new PIXI.Point(localBounds.x + localBounds.width, localBounds.y + localBounds.height)
    const bl = new PIXI.Point(localBounds.x, localBounds.y + localBounds.height)
    const localPoints = [tl, tr, br, bl]

    return localPoints.map(p => obj.localTransform.apply(p))
}

function addActiveTargetBorder() {
    app.stage.off('pointerdown', clearActive)
    if (activeObjBorder) {
        activeObjBorder.clear()
    }

    const bound = getObjStageBound(obj)
    const border = new PIXI.Graphics()
    border.lineStyle(2, 0x5b97fc)
    border.drawPolygon(bound)
    app.stage.addChild(border)
    activeObjBorder = border
}

function updateActiveTargetBorder() {
    if (activeObject && activeObjBorder) {
        const bound = getObjStageBound(obj)
        activeObjBorder.clear()
        activeObjBorder.lineStyle(2, 0x5b97fc);
        activeObjBorder.drawPolygon(bound); // 重新画draw border
    }
    
}


// ControlPoint
class ControlPoint extends PIXI.Graphics {
    constructor (target) {
        super()
        this.controlTarget = target
    }
}


let activeObjControlPoint
function addActiveTargetControlPoint(activeObject) {
    const controlPoint = new ControlPoint(activeObject)
    activeObjControlPoint = controlPoint
    controlPoint.eventMode = 'static'
    controlPoint.cursor = 'ns-resize' 
    app.stage.addChild(controlPoint)
    controlPoint.lineStyle(1, 0xc66965)
    const radius = 10
    controlPoint.beginFill(0xffffff)
    controlPoint.drawCircle(0, 0, radius)
    controlPoint.endFill()
    const bound = getObjStageBound(activeObject)
    const [tl, tr] = bound
    controlPoint.position.set((tl.x + tr.x) / 2, (tl.y + tr.y) / 2)
}

function updateActiveTargetControlPoint() {
    if (activeObject && activeObjControlPoint) {
        activeObjControlPoint.clear()
        activeObjControlPoint.lineStyle(1, 0xc66965)
        const radius = 4
        activeObjControlPoint.beginFill(0xffffff)
        activeObjControlPoint.drawCircle(0, 0, radius)
        activeObjControlPoint.endFill()
        const bound = getObjStageBound(activeObject)
        const [tl, tr] = bound
        activeObjControlPoint.position.set(
            (tl.x + tr.x) / 2,
            (tl.y + tr.y) / 2
        )
    }
}
app.ticker.add(updateActiveTargetControlPoint)









