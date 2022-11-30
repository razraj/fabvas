import { fabric } from 'fabric'
import Svg, { SvgOption } from './objects/Svg'
import { FabricObject } from './utils'

export interface ObjectSchema {
  create: (...option: any) => fabric.Object
}

export interface CanvasObjectSchema {
  [key: string]: ObjectSchema
}

export const createCanvasObject = (objectSchema: CanvasObjectSchema) => objectSchema

const CanvasObject: CanvasObjectSchema = {
  group: {
    create: ({ objects, ...option }: { objects: FabricObject[] }) => new fabric.Group(objects, option),
  },
  'i-text': {
    create: ({ text, ...option }: { text: string }) => new fabric.IText(text, option),
  },
  textbox: {
    create: ({ text, ...option }: { text: string }) => new fabric.Textbox(text, option),
  },
  circle: {
    create: (option: any) => new fabric.Circle(option),
  },
  rect: {
    create: (option: any) => new fabric.Rect(option),
  },
  image: {
    create: ({ element = new Image(), ...option }) =>
      new fabric.Image(element, {
        ...option,
        crossOrigin: 'anonymous',
      }),
  },
  svg: {
    create: (option: SvgOption) => new Svg(option),
  },
}

export default CanvasObject
