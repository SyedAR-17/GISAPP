/*	Copyright (c) 2021 Jean-Marc VIGLINO, 
  released under the CeCILL-B license (French BSD license)
*/
import ol_ext_inherits from '../util/ext'
import ol_source_ImageCanvas from 'ol/source/ImageCanvas'

/** Inverse distance weighting interpolated source - Shepard's method
 * @see https://en.wikipedia.org/wiki/Inverse_distance_weighting
 * @constructor 
 * @extends {ol_source_ImageCanvas}
 * @fire drawstart
 * @fire drawend
 * @param {*} [options]
 *  @param {ol.source.vector} options.source a source to interpolate
 *  @param {boolean} [options.useWorker=false] use worker to calculate the distance map (may cause flickering on small data sets). Source will fire drawstart, drawend while calculating
 *  @param {number} [options.scale=4] scale factor, use large factor to enhance performances (but minor accuracy)
 *  @param {string|function} options.weight The feature attribute to use for the weight or a function that returns a weight from a feature. Weight values should range from 0 to 100. Default use the weight attribute of the feature.
 */
var ol_source_IDW = function(options) {
  options = options || {};

  // Draw image on canvas
  options.canvasFunction = this.calculateImage;

  this._source = options.source;
  this._canvas = document.createElement('CANVAS');
  this._source.on(['addfeature','removefeature','clear','removefeature'], function() {
    this.changed();
  }.bind(this));

  ol_source_ImageCanvas.call (this, options);

  if (options.useWorker) {
    this.worker = new ol_ext_Worker(this.computeImage, {
      onMessage:  this.onImageData.bind(this)
    })
  }
  this._position = { extent: [], resolution: 0 }
  this.set('scale', options.scale || 4);
  this._weight = typeof(options.weight) === 'function' ? options.weight : function(f) { return f.get(options.weight||'weight'); }
};
ol_ext_inherits(ol_source_IDW, ol_source_ImageCanvas);

/** Get the source
 */
ol_source_IDW.prototype.getSource = function() {
  return this._source;
};

/** Apply the value to the map RGB. Overwrite this function to set your own colors.
 * @param {number} v value
 * @param {Uint8ClampedArray} data RGBA array
 * @param {number} i index in the RGBA array
 * @api
 */
ol_source_IDW.prototype.setData = function(v, data, i) {
  // Get color
  var color = this.getColor(v)
  // Convert to RGB
  data[i] = color[0];
  data[i+1] = color[1];
  data[i+2] = color[2];
  data[i+3] = color[3];
};

/** Get image value at coord (RGBA)
 * @param {l.coordinate} coord
 * @return {Uint8ClampedArray}
 */
ol_source_IDW.prototype.getValue = function(coord) {
  if (!this._canvas) return null
  var pt = this.transform(coord);
  var v = this._canvas.getContext('2d').getImageData(Math.round(pt[0]), Math.round(pt[1]), 1, 1).data;
  return (v);
};

/** Compute image data */
ol_source_IDW.prototype.computeImage = function(e) {
  /** Convert hue to rgb factor
   * @param {number} h
   * @return {number}
   * @private
   */
  var hue2rgb = function(h) {
    h = (h + 6) % 6;
    if (h < 1) return Math.round(h * 255);
    if (h < 3) return 255;
    if (h < 4) return Math.round((4 - h) * 255);
    return 0;
  };

  /** Get color for a value. Return an array of RGBA values.
   * @param {number} v value
   * @returns {Array<number>} 
   * @api
   */
  var getColor = function(v) {
    // Get hue
    var h = 4 - (0.04 * v);
    // Convert to RGB
    return [
      hue2rgb(h + 2), 
      hue2rgb(h),
      hue2rgb(h - 2),
      255
    ]
  };
  
  var pts = e.data.pts;
  var width = e.data.width;
  var height = e.data.height;
  var imageData = new Uint8ClampedArray(width*height*4);
  // Compute image
  var x, y;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      var t = 0, b = 0;
      for(var i = 0; i < pts.length; ++i) {
        var dx = x -  pts[i][0];
        var dy = y -  pts[i][1];
        var d = dx*dx + dy*dy;

        // Inverse distance weighting - Shepard's method
        if (d === 0) {
          b = 1; 
          t = pts[i][2];
          break;
        }
        var inv = 1 / (d*d);
        t += inv * pts[i][2];
        b += inv;
      }
      // Set color
      var color = getColor(t/b);
      // Convert to RGB
      var pos = (y*width + x)*4;
      imageData[pos] = color[0];
      imageData[pos+1] = color[1];
      imageData[pos+2] = color[2];
      imageData[pos+3] = color[3];
    }
  }
  return { type: 'image', data: imageData, width: width, height: height };
}

/** Calculate IDW at extent / resolution
 * @param {ol/extent/Extent} extent
 * @param {number} resolution
 * @param {number} pixelRatio
 * @param {ol/size/Size} size
 * @return {HTMLCanvasElement}
 * @private
 */
ol_source_IDW.prototype.calculateImage = function(extent, resolution, pixelRatio, size) {
  if (!this._source) return this._canvas;
  if (this._updated) {
    this._updated = false;
    return this._canvas
  }

  // Calculation canvas at small resolution
  var width =  Math.round(size[0] / (this.get('scale')*pixelRatio));
  var height = Math.round(size[1] / (this.get('scale')*pixelRatio));

  // Transform coords to pixel / value
  var pts = [];
  var dw = width / (extent[2]-extent[0]);
  var dh = height / (extent[1]-extent[3]);
  var tr = this.transform = function(xy, v) {
    return [
      (xy[0]-extent[0]) * dw,
      (xy[1]-extent[3]) * dh,
      v
    ];
  }
  // Get features / weight
  this._source.getFeatures().forEach(function(f) {
    pts.push(tr(f.getGeometry().getFirstCoordinate(), this._weight(f)));
  }.bind(this));

  if (this.worker) {
    // kill old worker and star new one
    this.worker.postMessage({ pts: pts, width: width, height: height }, true);
    this.dispatchEvent({ type: 'drawstart' })
    // Move the canvas position meanwhile
    if (this._canvas.width !== Math.round(size[0]) 
      || this._canvas.height !== Math.round(size[1])
      || this._position.resolution !== resolution 
      || this._position.extent[0] !== extent[0]
      || this._position.extent[1] !== extent[1]
    ) {
      this._canvas.width = Math.round(size[0])
      this._canvas.height = Math.round(size[1]);
    }
    this._position.extent = extent;
    this._position.resolution = resolution;
  } else {
    this._canvas.width = Math.round(size[0]);
    this._canvas.height = Math.round(size[1]);
    var imageData = this.computeImage({ data: { pts: pts, width: width, height: height } })
    this.onImageData(imageData);
  }

  return this._canvas;
}

/** Display data when ready
 * @private
 */
ol_source_IDW.prototype.onImageData = function(imageData) {
  // Calculation canvas at small resolution
  var canvas = this._internal = document.createElement('CANVAS');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  var ctx = canvas.getContext('2d');
  ctx.putImageData(new ImageData(imageData.data, imageData.width, imageData.height), 0, 0);
  
  // Draw full resolution canvas
  this._canvas.getContext('2d').drawImage(canvas, 0, 0, this._canvas.width, this._canvas.height);
  // Force redraw
  if (this.worker) {
    this.dispatchEvent({ type: 'drawend' })
    this._updated = true;
    this.changed();
  }
}

export default ol_source_IDW
