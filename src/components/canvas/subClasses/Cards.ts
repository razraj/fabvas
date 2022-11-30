import fabric from 'fabric/fabric-impl'
// import { FabricCanvas } from '../utils/ObjectUtil'

export const MyRect = () =>
  fabric.util.createClass(fabric.Rect, {
    initialize(options) {
      this.callSuper('initialize', options)
      const def = {
        width: 100,
        height: 100,
        text: 'NONO',
        textColor: 'white',
      }
      Object.assign(this, def, options)
    },
    // 更改原有的 _render 方法
    _render(ctx) {
      this.callSuper('_render', ctx)
      ctx.font = '30px Arial'
      ctx.fillStyle = this.textColor
      ctx.textAlign = 'center'
      ctx.fillText(this.text, 0, 10)
    },
  })
/////////////////////////image
//   fabric.Object.prototype.transparentCorners = false;

// var canvas = this.__canvas = new fabric.Canvas('c', {
//   backgroundColor: '#333',
//   HOVER_CURSOR: 'pointer'
// });

// var src = 'https://www.google.com/images/srpr/logo3w.png';
// var src2 = 'http://www.google.com/logos/2012/Santos_Dumont-2012-hp.jpg';

// fabric.CustomImage = fabric.util.createClass(fabric.Image, {
//   type: 'custom-image',
//   initialize: function(element, options) {
//     this.callSuper('initialize', element, options);
//     options && this.set('name', options.name);
//   },
//   toObject: function() {
//     return fabric.util.object.extend(this.callSuper('toObject'), {
//       name: this.name
//     });
//   }
// });
// fabric.CustomImage.fromObject = function(object, callback) {
//   fabric.util.loadImage(object.src, function(img) {
//     callback && callback(new fabric.CustomImage(img, object));
//   });
// };
// fabric.CustomImage.async = true;
// fabric.util.loadImage(src2, function(img) {
//   var customImage = new fabric.CustomImage(img, {
//     name: 'foobar'
//   });
//   customImage.top = 0;
//   customImage.left = 0;
//   canvas.add(customImage);
//   canvas.renderAll();
// });

///////////////////////// text
// var canvas = new fabric.Canvas('c');

// fabric.Tag = fabric.util.createClass(fabric.Group, {
// 	type: 'PItag',

// initialize: function() {

//     options = {};
//     options.left = 0;
//     options.top=0;

//     var defaults    = {
//         width:  100,
//         height: 40,
//         originX: 'center',
//         originY: 'center'
//     };

//     var defaults1    = {
//         width:  100,
//         height: 20,
//         originX: 'center',
//         originY: 'top',
//         top: -20,
//         backgroundColor: 'red'
//     };

//     var defaults2    = {
//         width:  100,
//         height: 20,
//         originX: 'center',
//         originY: 'top',
//         top: 0
//     };

//     var items   = [];

//     items[0]    = new fabric.Rect($.extend({}, defaults, {
//         fill: '#77AAFF',
//     }));

//     items[1]    = new fabric.Textbox('PI tag name', $.extend({}, defaults1, {
//         textAlign: 'center',
//         fontSize: 14
//     }));

//     items[2]    = new fabric.IText('####', $.extend({}, defaults2, {
//         textAlign: 'center',
//         fontSize: 16
//     }));

//     this.callSuper('initialize', items, options);

// },

// getTagName: function () {
//     return this._objects[1].text;
// },

// setTagName: function (value) {
//     this._objects[1].text = value;
// },

// getValue: function () {
//     return this._objects[2].text;
// },

// setValue: function (value) {
//     this._objects[2].set({ text: value });
//     this.canvas.renderAll();
// },

// _render: function(ctx,noTransform) {

// console.log('xs')
//     this.callSuper('_render', ctx);
//     //ctx._objects[1].text = this._objects[1].text;

// }

// });
// var pi = new fabric.Tag();
// // canvas.pi.async = true;
// pi.setTagName("Unix time");

//   canvas.add(pi);
// setInterval(function() {

// 	pi.setValue(Math.floor((new Date()).getTime() / 1000).toString());
//   canvas.renderAll();
// }, 1000);
