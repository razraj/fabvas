import { fabric } from 'fabric'

import Handler from './Handler'
import { FabricObject, FabricEvent } from '../utils'

/**
 * Event Handler Class
 * @class EventHandler
 */
class EventHandler {
  handler: Handler
  keyCode: number
  panning: boolean

  constructor(handler: Handler) {
    this.handler = handler
    this.initialize()
  }

  /**
   * Attch event on document
   *
   */
  public initialize() {
    if (this.handler.editable) {
      this.handler.canvas.on('object:modified', this.modified)
      this.handler.canvas.on('object:scaling', this.scaling)
      this.handler.canvas.on('object:scaled', this.scaled)
      this.handler.canvas.on('object:moving', this.moving)
      this.handler.canvas.on('object:moved', this.moved)
      this.handler.canvas.on('object:rotating', this.rotating)
      this.handler.canvas.on('object:rotated', this.rotated)
      this.handler.canvas.on('object:wheel', this.mousewheel)
      this.handler.canvas.on('object:down', this.mousedown)
      this.handler.canvas.on('object:move', this.mousemove)
      this.handler.canvas.on('object:up', this.mouseup)
      this.handler.canvas.on('object:cleared', this.selection)
      this.handler.canvas.on('object:created', this.selection)
      this.handler.canvas.on('object:updated', this.selection)
    } else {
      this.handler.canvas.on('object:down', this.mousedown)
      this.handler.canvas.on('object:move', this.mousemove)
      this.handler.canvas.on('object:up', this.mouseup)
      this.handler.canvas.on('mouse:out', this.mouseout)
      this.handler.canvas.on('object:wheel', this.mousewheel)
    }
    this.handler.canvas.wrapperEl.tabIndex = 1000
    this.handler.canvas.wrapperEl.addEventListener('keydown', this.keydown, false)
    this.handler.canvas.wrapperEl.addEventListener('keyup', this.keyup, false)
    this.handler.canvas.wrapperEl.addEventListener('mousedown', this.onmousedown, false)
    this.handler.canvas.wrapperEl.addEventListener('contextmenu', this.contextmenu, false)
    if (this.handler.keyEvent.clipboard) {
      document.addEventListener('paste', this.paste, false)
    }
  }

  /**
   * Detach event on document
   *
   */
  public destroy = () => {
    if (this.handler.editable) {
      this.handler.canvas.off({
        'object:modified': this.modified,
        'object:scaling': this.scaling,
        'object:moving': this.moving,
        'object:moved': this.moved,
        'object:rotating': this.rotating,
        'mouse:wheel': this.mousewheel,
        'mouse:down': this.mousedown,
        'mouse:move': this.mousemove,
        'mouse:up': this.mouseup,
        'selection:cleared': this.selection,
        'selection:created': this.selection,
        'selection:updated': this.selection,
      })
    } else {
      this.handler.canvas.off({
        'mouse:down': this.mousedown,
        'mouse:move': this.mousemove,
        'mouse:out': this.mouseout,
        'mouse:up': this.mouseup,
        'mouse:wheel': this.mousewheel,
      })
      this.handler.getObjects().forEach((object) => {
        object.off('mousedown', this.handler.eventHandler.object.mousedown)
      })
    }
    this.handler.canvas.wrapperEl.removeEventListener('keydown', this.keydown)
    this.handler.canvas.wrapperEl.removeEventListener('keyup', this.keyup)
    this.handler.canvas.wrapperEl.removeEventListener('mousedown', this.onmousedown)
    this.handler.canvas.wrapperEl.removeEventListener('contextmenu', this.contextmenu)
    if (this.handler.keyEvent.clipboard) {
      this.handler.canvas.wrapperEl.removeEventListener('paste', this.paste)
    }
  }

  /**
   * Individual object event
   *
   */
  public object = {
    /**
     * Mouse down event on object
     * @param {FabricEvent} opt
     */
    mousedown: (opt: FabricEvent) => {
      const { target } = opt
      if (target && target.link && target.link.enabled) {
        const { onClick } = this.handler
        if (onClick) {
          onClick(this.handler.canvas, target)
        }
      }
    },
    /**
     * Mouse double click event on object
     * @param {FabricEvent} opt
     */
    mousedblclick: (opt: FabricEvent) => {
      const { target } = opt
      if (target) {
        const { onDblClick } = this.handler
        if (onDblClick) {
          onDblClick(this.handler.canvas, target)
        }
      }
    },
  }

  /**
   * Modified event object
   *
   * @param {FabricEvent} opt
   * @returns
   */
  public modified = (opt: FabricEvent) => {
    const { target } = opt
    if (!target) {
      return
    }
    if (target.type === 'circle' && target.parentId) {
      return
    }
    const { onModified } = this.handler
    if (onModified) {
      onModified(target)
    }
  }

  /**
   * Moving event object
   *
   * @param {FabricEvent} opt
   * @returns
   */
  public moving = (opt: FabricEvent) => {
    const { target } = opt as any
    if (this.handler.interactionMode === 'crop') {
      this.handler.cropHandler.moving(opt)
    } else {
      if (this.handler.editable && this.handler.guidelineOption.enabled) {
        this.handler.guidelineHandler.movingGuidelines(target)
      }
    }
  }

  /**
   * Moved event object
   *
   * @param {FabricEvent} opt
   */
  public moved = (opt: FabricEvent) => {
    if (!this.handler.transactionHandler.active) {
      this.handler.transactionHandler.save('moved')
    }
  }

  /**
   * Scaling event object
   *
   * @param {FabricEvent} opt
   */
  public scaling = (opt: FabricEvent) => {
    if (this.handler.interactionMode === 'crop') {
      this.handler.cropHandler.resize(opt)
    }
    // TODO...this.handler.guidelineHandler.scalingGuidelines(target);
  }

  /**
   * Scaled event object
   *
   * @param {FabricEvent} opt
   */
  public scaled = (_opt: FabricEvent) => {
    if (!this.handler.transactionHandler.active) {
      this.handler.transactionHandler.save('scaled')
    }
  }

  /**
   * Rotating event object
   *
   * @param {FabricEvent} opt
   */
  public rotating = (opt: FabricEvent) => {
    // TODO
  }

  /**
   * Rotated event object
   *
   * @param {FabricEvent} opt
   */
  public rotated = (_opt: FabricEvent) => {
    if (!this.handler.transactionHandler.active) {
      this.handler.transactionHandler.save('rotated')
    }
  }

  /**
   * Moing object at keyboard arrow key down event
   *
   * @param {KeyboardEvent} e
   * @returns
   */
  public arrowmoving = (e: KeyboardEvent) => {
    const activeObject = this.handler.canvas.getActiveObject() as FabricObject
    if (!activeObject) {
      return false
    }
    if (activeObject.id === 'workarea') {
      return false
    }
    if (e.keyCode === 38) {
      activeObject.set('top', activeObject.top - 2)
      activeObject.setCoords()
      this.handler.canvas.renderAll()
      return true
    } else if (e.keyCode === 40) {
      activeObject.set('top', activeObject.top + 2)
      activeObject.setCoords()
      this.handler.canvas.renderAll()
      return true
    } else if (e.keyCode === 37) {
      activeObject.set('left', activeObject.left - 2)
      activeObject.setCoords()
      this.handler.canvas.renderAll()
      return true
    } else if (e.keyCode === 39) {
      activeObject.set('left', activeObject.left + 2)
      activeObject.setCoords()
      this.handler.canvas.renderAll()
      return true
    }
    if (this.handler.onModified) {
      this.handler.onModified(activeObject)
    }
    return true
  }

  /**
   * Zoom at mouse wheel event
   *
   * @param {FabricEvent<WheelEvent>} opt
   * @returns
   */
  public mousewheel = (opt: FabricEvent) => {
    const event = opt as FabricEvent<WheelEvent>
    const { zoomEnabled } = this.handler
    if (!zoomEnabled) {
      return
    }
    const delta = event.e.deltaY
    let zoomRatio = this.handler.canvas.getZoom()
    if (delta > 0) {
      zoomRatio -= 0.05
    } else {
      zoomRatio += 0.05
    }
    this.handler.zoomHandler.zoomToPoint(
      new fabric.Point(this.handler.canvas.getWidth() / 2, this.handler.canvas.getHeight() / 2),
      zoomRatio,
    )
    event.e.preventDefault()
    event.e.stopPropagation()
  }

  /**
   * Mouse down event on object
   *
   * @param {FabricEvent<MouseEvent>} opt
   * @returns
   */
  public mousedown = (opt: FabricEvent) => {
    const event = opt as FabricEvent<MouseEvent>
    const { editable } = this.handler
    if (event.e.altKey && editable && !this.handler.interactionHandler.isDrawingMode()) {
      this.handler.interactionHandler.grab()
      this.panning = true
      return
    }
    if (this.handler.interactionMode === 'grab') {
      this.panning = true
      return
    }
    const { target } = event
    if (editable) {
      this.handler.guidelineHandler.viewportTransform = this.handler.canvas.viewportTransform
      this.handler.guidelineHandler.zoom = this.handler.canvas.getZoom()
      if (this.handler.interactionMode === 'selection') {
        if (target && target.superType === 'link') {
          target.set({
            stroke: target.selectFill || 'green',
          })
        }
        this.handler.prevTarget = target
        return
      }
    }
  }

  /**
   * Mouse move event on canvas
   *
   * @param {FabricEvent<MouseEvent>} opt
   * @returns
   */
  public mousemove = (opt: FabricEvent) => {
    const event = opt as FabricEvent<MouseEvent>
    if (this.handler.interactionMode === 'grab' && this.panning) {
      this.handler.interactionHandler.moving(event.e)
      this.handler.canvas.requestRenderAll()
    }
    if (!this.handler.editable && event.target) {
      if (event.target.id !== 'workarea') {
        if (event.target !== this.handler.target) {
          this.handler.tooltipHandler.show(event.target)
        }
      } else {
        this.handler.tooltipHandler.hide(event.target)
      }
    }
    return
  }

  /**
   * Mouse up event on canvas
   *
   * @param {FabricEvent<MouseEvent>} opt
   * @returns
   */
  public mouseup = (opt: FabricEvent) => {
    // const event = opt as FabricEvent<MouseEvent>;
    if (this.handler.interactionMode === 'grab') {
      this.panning = false
      return
    }
    if (this.handler.editable && this.handler.guidelineOption.enabled) {
      this.handler.guidelineHandler.verticalLines.length = 0
      this.handler.guidelineHandler.horizontalLines.length = 0
    }
    this.handler.canvas.renderAll()
  }

  /**
   * Mouse out event on canvas
   *
   * @param {FabricEvent<MouseEvent>} opt
   */
  public mouseout = (opt: FabricEvent) => {
    const event = opt as FabricEvent<MouseEvent>
    if (!event.target) {
      this.handler.tooltipHandler.hide()
    }
  }

  /**
   * Selection event event on canvas
   *
   * @param {FabricEvent} opt
   */
  public selection = (opt: FabricEvent) => {
    const { onSelect, activeSelectionOption } = this.handler
    const target = opt.target as FabricObject<fabric.ActiveSelection>
    if (target && target.type === 'activeSelection') {
      target.set({
        ...activeSelectionOption,
      })
    }
    if (onSelect) {
      onSelect(target)
    }
  }

  /**
   * Called resize event on canvas
   *
   * @param {number} nextWidth
   * @param {number} nextHeight
   * @returns
   */
  public resize = (nextWidth: number, nextHeight: number) => {
    this.handler.canvas.setWidth(nextWidth).setHeight(nextHeight)
    this.handler.canvas.setBackgroundColor(
      this.handler.canvasOption.backgroundColor,
      this.handler.canvas.renderAll.bind(this.handler.canvas),
    )
    if (!this.handler.workarea) {
      return
    }
    const diffWidth = nextWidth / 2 - this.handler.width / 2
    const diffHeight = nextHeight / 2 - this.handler.height / 2
    this.handler.width = nextWidth
    this.handler.height = nextHeight
    if (this.handler.workarea.layout === 'fixed') {
      this.handler.canvas.centerObject(this.handler.workarea)
      this.handler.workarea.setCoords()
      if (this.handler.gridOption.enabled) {
        return
      }
      this.handler.canvas.getObjects().forEach((obj: FabricObject) => {
        if (obj.id !== 'workarea') {
          const left = obj.left + diffWidth
          const top = obj.top + diffHeight
          obj.set({
            left,
            top,
          })
          obj.setCoords()
        }
      })
      this.handler.canvas.requestRenderAll()
      return
    }
    if (this.handler.workarea.layout === 'responsive') {
      const { scaleX } = this.handler.workareaHandler.calculateScale()
      const center = this.handler.canvas.getCenter()
      const deltaPoint = new fabric.Point(diffWidth, diffHeight)
      this.handler.canvas.relativePan(deltaPoint)
      this.handler.zoomHandler.zoomToPoint(new fabric.Point(center.left, center.top), scaleX)
      return
    }
    const scaleX = nextWidth / this.handler.workarea.width
    const scaleY = nextHeight / this.handler.workarea.height
    const diffScaleX = nextWidth / (this.handler.workarea.width * this.handler.workarea.scaleX)
    const diffScaleY = nextHeight / (this.handler.workarea.height * this.handler.workarea.scaleY)
    this.handler.workarea.set({
      scaleX,
      scaleY,
    })
    this.handler.canvas.getObjects().forEach((obj: any) => {
      // const { id } = obj;
      if (obj.id !== 'workarea') {
        const left = obj.left * diffScaleX
        const top = obj.top * diffScaleY
        const newScaleX = obj.scaleX * diffScaleX
        const newScaleY = obj.scaleY * diffScaleY
        obj.set({
          scaleX: newScaleX,
          scaleY: newScaleY,
          left,
          top,
        })
        obj.setCoords()
      }
    })
    this.handler.canvas.renderAll()
  }

  /**
   * Paste event on canvas
   *
   * @param {ClipboardEvent} e
   * @returns
   */
  public paste = (e: ClipboardEvent) => {
    if (this.handler.canvas.wrapperEl !== document.activeElement) {
      return false
    }
    if (e.preventDefault) {
      e.preventDefault()
    }
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    const clipboardData = e.clipboardData
    if (clipboardData.types.length) {
      clipboardData.types.forEach((clipboardType: string) => {
        if (clipboardType === 'text/plain') {
          const textPlain = clipboardData.getData('text/plain')
          try {
            const objects = JSON.parse(textPlain)
            const {
              gridOption: { grid = 10 },
              isCut,
            } = this.handler
            const padding = isCut ? 0 : grid
            if (objects && Array.isArray(objects)) {
              const filteredObjects = objects.filter((obj) => obj !== null)
              if (filteredObjects.length === 1) {
                const obj = filteredObjects[0]
                if (typeof obj.cloneable !== 'undefined' && !obj.cloneable) {
                  return
                }
                obj.left = obj.properties.left + padding
                obj.top = obj.properties.top + padding
                const createdObj = this.handler.add(obj, false, true)
                this.handler.canvas.setActiveObject(createdObj as FabricObject)
                this.handler.canvas.requestRenderAll()
              } else {
                const nodes = [] as any[]
                const targets = [] as any[]
                objects.forEach((obj) => {
                  if (!obj) {
                    return
                  }
                  if (obj.superType === 'link') {
                    obj.fromNodeId = nodes[obj.fromNodeIndex].id
                    obj.toNodeId = nodes[obj.toNodeIndex].id
                  } else {
                    obj.left = obj.properties.left + padding
                    obj.top = obj.properties.top + padding
                  }
                  const createdObj = this.handler.add(obj, false, true)
                  if (obj.superType === 'node') {
                    nodes.push(createdObj)
                  } else {
                    targets.push(createdObj)
                  }
                })
                const activeSelection = new fabric.ActiveSelection(nodes.length ? nodes : targets, {
                  canvas: this.handler.canvas,
                  ...this.handler.activeSelectionOption,
                })
                this.handler.canvas.setActiveObject(activeSelection)
                this.handler.canvas.requestRenderAll()
              }
              if (!this.handler.transactionHandler.active) {
                this.handler.transactionHandler.save('paste')
              }
              this.handler.isCut = false
              this.handler.copy()
            }
          } catch (error) {
            console.error(error)
            // const item = {
            //     id: uuv4id(),
            //     type: 'textbox',
            //     text: textPlain,
            // };
            // this.handler.add(item, true);
          }
        } else if (clipboardType === 'text/html') {
          // Todo ...
          // const textHtml = clipboardData.getData('text/html');
          // console.log(textHtml);
        } else if (clipboardType === 'Files') {
          // Array.from(clipboardData.files).forEach((file) => {
          //     const { type } = file;
          //     if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
          //         const item = {
          //             id: v4(),
          //             type: 'image',
          //             file,
          //             superType: 'image',
          //         };
          //         this.handler.add(item, true);
          //     } else {
          //         console.error('Not supported file type');
          //     }
          // });
        }
      })
    }
    return true
  }

  /**
   * Keydown event on document
   *
   * @param {KeyboardEvent} e
   */
  public keydown = (e: KeyboardEvent) => {
    const { keyEvent, editable } = this.handler
    if (!Object.keys(keyEvent).length) {
      return
    }
    const { clipboard } = keyEvent
    if (this.handler.shortcutHandler.isW(e)) {
      this.keyCode = e.keyCode
      this.handler.interactionHandler.grab()
      return
    }
    if (e.altKey && editable) {
      this.handler.interactionHandler.grab()
      return
    }
    if (this.handler.shortcutHandler.isEscape(e)) {
      if (this.handler.interactionMode === 'selection') {
        this.handler.canvas.discardActiveObject()
        this.handler.canvas.renderAll()
      }
      this.handler.tooltipHandler.hide()
    }
    if (this.handler.canvas.wrapperEl !== document.activeElement) {
      return
    }
    if (editable) {
      if (this.handler.shortcutHandler.isQ(e)) {
        this.keyCode = e.keyCode
      } else if (this.handler.shortcutHandler.isDelete(e)) {
        this.handler.remove()
      } else if (this.handler.shortcutHandler.isArrow(e)) {
        this.arrowmoving(e)
      } else if (this.handler.shortcutHandler.isCtrlA(e)) {
        e.preventDefault()
        this.handler.selectAll()
      } else if (this.handler.shortcutHandler.isCtrlC(e)) {
        e.preventDefault()
        this.handler.copy()
      } else if (this.handler.shortcutHandler.isCtrlV(e) && !clipboard) {
        e.preventDefault()
        this.handler.paste()
      } else if (this.handler.shortcutHandler.isCtrlX(e)) {
        e.preventDefault()
        this.handler.cut()
      } else if (this.handler.shortcutHandler.isCtrlZ(e)) {
        e.preventDefault()
        this.handler.transactionHandler.undo()
      } else if (this.handler.shortcutHandler.isCtrlY(e)) {
        e.preventDefault()
        this.handler.transactionHandler.redo()
      } else if (this.handler.shortcutHandler.isPlus(e)) {
        e.preventDefault()
        this.handler.zoomHandler.zoomIn()
      } else if (this.handler.shortcutHandler.isMinus(e)) {
        e.preventDefault()
        this.handler.zoomHandler.zoomOut()
      } else if (this.handler.shortcutHandler.isO(e)) {
        e.preventDefault()
        this.handler.zoomHandler.zoomOneToOne()
      } else if (this.handler.shortcutHandler.isP(e)) {
        e.preventDefault()
        this.handler.zoomHandler.zoomToFit()
      }
      return
    }
    return
  }

  /**
   * Key up event on canvas
   *
   * @param {KeyboardEvent} _e
   */
  public keyup = (e: KeyboardEvent) => {
    if (this.handler.interactionHandler.isDrawingMode()) {
      return
    }
    if (!this.handler.shortcutHandler.isW(e)) {
      this.handler.interactionHandler.selection()
    }
  }

  /**
   * Context menu event on canvas
   *
   * @param {MouseEvent} e
   */
  public contextmenu = (e: MouseEvent) => {
    e.preventDefault()
    const { editable, onContext } = this.handler
    if (editable && onContext) {
      const target = this.handler.canvas.findTarget(e, false) as FabricObject
      if (target && target.type !== 'activeSelection') {
        this.handler.select(target)
      }
      this.handler.contextmenuHandler.show(e, target)
    }
  }

  /**
   * Mouse down event on canvas
   *
   * @param {MouseEvent} _e
   */
  public onmousedown = (_e: MouseEvent) => {
    this.handler.contextmenuHandler.hide()
  }
}

export default EventHandler
