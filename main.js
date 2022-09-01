$( function() {
    $( "#accordion" ).accordion();
  } );


var layerFlag = false; 
var LandCategoryLayerflag = false;
// import province  from "./database.js";
// console.log(province);

// function myFunc(){
//     console.log("HELLO");
// }

var EleButton = document.getElementById("layer1").addEventListener("change", validate);
var EleButton = document.getElementById("layer2").addEventListener("change", validate1);
var EleButton = document.getElementById("layer3").addEventListener("change", validate2);
var EleButton = document.getElementById("layer4").addEventListener("change", validate3);


$(document).ready(function(){
    $("h6").click(function(){
      $(this).hide();
    });
  });

var mapView = new ol.View({
    center: ol.proj.fromLonLat([69.3451,30.3753]),
    zoom:5,
});


var map = new ol.Map({
    target: 'map',
    view: mapView,
    controls:[]
    //define function,
});
var i =0;
map.on('singleclick', function (vt) {
    console.log(i);
    i=i+1;
})
var WB = new ol.layer.Tile({
    title: "World Boundaries",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:world-country-boundaries', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});
// map.addLayer(WB);

var RES = new ol.layer.Tile({
    title: "Residential",
    minZoom: 10,

    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:residential', 'TILED':true},
        serverType: 'geoserver',
        visible: true,
    })
});

// map.addLayer(RES);
var COM = new ol.layer.Tile({
    title: "Commercial",
    minZoom: 10,
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:Commercial', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});
// map.addLayer(COM);
var ENC = new ol.layer.Tile({
    title: "Encroachment",
    minZoom: 10,
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:Encroach', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});
// map.addLayer(ENC);
var LIT = new ol.layer.Tile({
    title: "Litigation",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:Litigation', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});
//map.addLayer(LIT);

var PAK = new ol.layer.Tile({
    title: "Pakistan",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:pakistan_with_kashmir', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});
// map.addLayer(PAK);

var PAKADM = new ol.layer.Tile({
    title: "Pakistan Divisons",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Pakadm/wms',
        params:{'LAYERS':'Pakadm:pak_adm2', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});
// map.addLayer(PAKADM);

var PAKADM3 = new ol.layer.Tile({
    title: "Pakistan Districts",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:pak_adm3', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});
// map.addLayer(PAKADM);

var KK = new ol.layer.Tile({
    title: "Karachi Shore",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Pakadm/wms',
        params:{'LAYERS':'Pakadm:geotools_coverage', 'TILED':true},
        serverType: 'geoserver',
        visible: true
    })
});



var Waterways = new ol.layer.Tile({
    title: "Rivers",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Practice/wms',
        params:{'LAYERS':'Practice:waterways', 'TILED':true},
        serverType: 'geoserver',
        visible: true,
    })
});

var layerSwitch = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'children'
    
});
map.addControl(layerSwitch);


function validate(){
    if (document.getElementById('layer1').checked) {
        map.addLayer(LIT);
        var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "Practice:Litigation&" + "outputFormat=application/json"
        newaddGeoJsonToMap(url);
        newpopulateQueryTable(url);
        setTimeout(function () { newaddRowHandlers(url); }, 300);
        map.set("isLoading", 'NO');
    } else {
        removeLay(LIT)
    }
}

function validate1(){
    if (document.getElementById('layer2').checked) {
        map.addLayer(ENC);
        var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "	Practice:Encroach&" + "outputFormat=application/json"
        newaddGeoJsonToMap(url);
        newpopulateQueryTable(url);
        setTimeout(function () { newaddRowHandlers(url); }, 300);
        map.set("isLoading", 'NO');
    } else {
        removeLay(ENC)
    }
}

function validate2(){
    if (document.getElementById('layer3').checked) {
        map.addLayer(COM);
        var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "Practice:Commercial&" + "outputFormat=application/json"
        newaddGeoJsonToMap(url);
        newpopulateQueryTable(url);
        setTimeout(function () { newaddRowHandlers(url); }, 300);
        map.set("isLoading", 'NO');
    } else {
        removeLay(COM)
    }
}

function validate3(){
    if (document.getElementById('layer4').checked) {
        map.addLayer(RES);
       RES.displayInLayerSwitcher = false;
       // map.RES.setVisibility(false);
        var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "Practice:residential&" + "outputFormat=application/json"
        newaddGeoJsonToMap(url);
        newpopulateQueryTable(url);
        setTimeout(function () { newaddRowHandlers(url); }, 300);
        map.set("isLoading", 'NO');
        
    } else {
        removeLay(RES)
    }
}

function removeLay(X)
{
    map.removeLayer(X);
    geojson.getSource().clear();
    map.removeLayer(geojson);
}


var baseGroup = new ol.layer.Group({
    title:"Base Map",
    fold: true,
    layers:[WB, PAK ,PAKADM3 ]
});
map.addLayer(baseGroup);

var overlayGroup = new ol.layer.Group({
    title:"Overlays",
    fold: true,
    layers:[KK, Waterways]
});
map.addLayer(overlayGroup)

// function myFunc(){
//     map.removeLayer(LIT)
// }


var mousePosition = new ol.control.MousePosition({
    className: "mousePos",
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate, '{y} , {x}', 6);}
});
map.addControl(mousePosition);

//Scale
var scaleControl = new ol.control.ScaleLine(
    {
    }
);
map.addControl(scaleControl);


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});

map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};


var homeButton = document.createElement('button');
homeButton.innerHTML = '<img src="./Images/home.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
homeButton.className = 'myButton';

var homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);

var homeControl = new ol.control.Control({
    element: homeElement
})

homeButton.addEventListener("click", () => {
    location.href = "index.html";
})

map.addControl(homeControl);



// start : FeatureInfo Control
// start : FeatureInfo Control

var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML = '<img src="./Images/information.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
featureInfoButton.className = 'myButton';
featureInfoButton.id = 'featureInfoButton';

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'featureInfoDiv';
featureInfoElement.appendChild(featureInfoButton);

var featureInfoControl = new ol.control.Control({
    element: featureInfoElement
})

var featureInfoFlag = false;
featureInfoButton.addEventListener("click", () => {
    featureInfoButton.classList.toggle('clicked');
    featureInfoFlag = !featureInfoFlag;
    // console.log(featureInfoFlag, "green")
})

map.addControl(featureInfoControl);

var overlayControl = new ol.control.Overlay({
    className: "slide-left menu",
    hideOnClick: true
  });
map.addControl(overlayControl);var overlayControl = new ol.control.Overlay({
  className: "slide-left menu",
  hideOnClick: true
});
map.addControl(overlayControl);

map.on('singleclick', function (evt) {
    const coordinate = evt.coordinate;
    const hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));  
    // overlayControl.show('<p>You clicked this point:</p><code>' + hdms + '</code>');
  });

map.on('pointermove', function (evt) {
    // console.log(featureInfoFlag);
   
    if (featureInfoFlag) {
        // console.log("red");
        content.innerHTML = '';
        var resolution = mapView.getResolution();

        var url = PAKADM3.getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
            'INFO_FORMAT': 'application/json',
            'propertyName': 'name_1,name_2,id_3'
        });
        if (url) {
            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#FFFF00',
                    width: 3
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#FFFF00'
                    })
                })
            });
            var feature;
            var props;
            $.getJSON(url, function (data) {
                console.log(map.getView().getZoom())
                feature = data.features[0];
                props = feature.properties;
                overlayControl.show("<h3> Cantonment : </h3> <p>" + props.name_1.toUpperCase()
                + "</p> <br> <br> <h3> Land Category : </h3> <p>" +
                    props.name_2.toUpperCase() + "</p> <br> <br> <h3> Survey Number : </h3> <p>" +
                    props.id_3 + "</p>"
                );
            })
  
        } else {
            popup.setPosition(undefined);
        }
    }
});

var baseTextStyle = {
    font: '12px Calibri,sans-serif',
    textAlign: 'center',
    offsetY: -15,
    fill: new ol.style.Fill({
      color: [0,0,0,1]
    }),
    stroke: new ol.style.Stroke({
      color: [255,255,255,0.5],
      width: 4
    })
  };

  // when we move the mouse over a feature, we can change its style to
  // highlight it temporarily
  var highlightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [255,0,0,0.6],
      width: 2
    }),
    fill: new ol.style.Fill({
      color: [255,0,0,0.2]
    }),
    zIndex: 1
  });

  // the style function for the feature overlay returns
  // a text style for point features and the highlight
  // style for other features (polygons in this case)
  function styleFunction(feature, resolution) {
    var style;
    var geom = feature.getGeometry();
    if (geom.getType() == 'Point') {
      var text = feature.get('text');
      baseTextStyle.text = text;
      // this is inefficient as it could create new style objects for the
      // same text.
      // A good exercise to see if you understand would be to add caching
      // of this text style
      var isoCode = feature.get('isoCode').toLowerCase();
      style = new ol.style.Style({
        text: new ol.style.Text(baseTextStyle),
        image: new ol.style.Icon({
          src: '../assets/img/flags/'+isoCode+'.png'
        }),
        zIndex: 2
      });
    } else {
      style = highlightStyle;
    }

    return [style];
  }

  var featureOverlay = new ol.layer.Vector({
    map: map,
    style: styleFunction
  });

  // when the mouse moves over the map, we get an event that we can use
  // to create a new feature overlay from
  map.on('pointermove', function(browserEvent) {
    // first clear any existing features in the overlay
    // featureOverlay.getFeatures().clear();
    var coordinate = browserEvent.coordinate;
    var pixel = browserEvent.pixel;
    // then for each feature at the mouse position ...
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      // check the layer property, if it is not set then it means we
      // are over an OverlayFeature and we can ignore this feature
      if (!layer) {
        return;
      }
      // test the feature's geometry type and compute a reasonable point
      // at which to display the text.
      var geometry = feature.getGeometry();
      var point;
      switch (geometry.getType()) {
      case 'MultiPolygon':
        var poly = geometry.getPolygons().reduce(function(left, right) {
          return left.getArea() > right.getArea() ? left : right;
        });
        point = poly.getInteriorPoint().getCoordinates();
        break;
      case 'Polygon':
        point = geometry.getInteriorPoint().getCoordinates();
        break;
      default:
        point = geometry.getClosestPoint(coordinate);
      }
      // create a new feature to display the text
      textFeature = new ol.Feature({
        geometry: new ol.geom.Point(point),
        text: feature.get('name'),
        isoCode: feature.get('iso_a2').toLowerCase()
      });
      // and add it to the featureOverlay.  Also add the feature itself
      // so the country gets outlined
      featureOverlay.addFeature(textFeature);
      featureOverlay.addFeature(feature);
    });
  });




// start : Length and Area Measurement Control

var lengthButton = document.createElement('button');
lengthButton.innerHTML = '<img src="./Images/arrows.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:20px;height:20px;vertical-align:middle border-radius: 10px;"></img>';
lengthButton.className = 'myButton';
lengthButton.id = 'lengthButton';

var lengthElement = document.createElement('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendChild(lengthButton);

var lengthControl = new ol.control.Control({
    element: lengthElement
})

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    lengthButton.classList.toggle('clicked');
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if (lengthFlag) {
        map.removeInteraction(draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }

})

map.addControl(lengthControl);

var areaButton = document.createElement('button');
areaButton.innerHTML = '<img src="./Images/area.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:20px;height:20px;vertical-align:middle border-radius: 10px;"></img>';
areaButton.className = 'myButton';
areaButton.id = 'areaButton';


var areaElement = document.createElement('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendChild(areaButton);

var areaControl = new ol.control.Control({
    element: areaElement
})

var areaFlag = false;
areaButton.addEventListener("click", () => {
    // disableOtherInteraction('areaButton');
    areaButton.classList.toggle('clicked');
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if (areaFlag) {
        map.removeInteraction(draw);
        addInteraction('Polygon');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})

map.addControl(areaControl);


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
 var continuePolygonMsg = 'Click to continue polygon, Double click to complete';

 /**
  * Message to show when the user is drawing a line.
  * @type {string}
  */
 var continueLineMsg = 'Click to continue line, Double click to complete';
 
 var draw; // global so we can remove it later
 
 var source = new ol.source.Vector();
 var vector = new ol.layer.Vector({
     source: source,
     style: new ol.style.Style({
         fill: new ol.style.Fill({
             color: 'rgba(255, 255, 255, 0.2)',
         }),
         stroke: new ol.style.Stroke({
             color: '#5d6b67',
             width: 2,
         }),
         image: new ol.style.Circle({
             radius: 7,
             fill: new ol.style.Fill({
                 color: '#ffcc33',
             }),
         }),
     }),
 });
 
 map.addLayer(vector);
 
 function addInteraction(intType) {
 
     draw = new ol.interaction.Draw({
         source: source,
         type: intType,
         style: new ol.style.Style({
             fill: new ol.style.Fill({
                 color: 'rgba(0, 0, 0, 0.5)',
             }),
             stroke: new ol.style.Stroke({
                 color: 'rgba(0, 0, 0, 0.5)',
                 lineDash: [10, 10],
                 width: 2,
             }),
             image: new ol.style.Circle({
                 radius: 5,
                 stroke: new ol.style.Stroke({
                     color: 'rgba(0, 0, 0, 0.7)',
                 }),
                 fill: new ol.style.Fill({
                     color: 'rgba(255, 255, 255, 0.2)',
                 }),
             }),
         }),
     });
     map.addInteraction(draw);
 
     createMeasureTooltip();
     createHelpTooltip();
 
     /**
      * Currently drawn feature.
      * @type {import("../src/ol/Feature.js").default}
      */
     var sketch;
 
     /**
      * Handle pointer move.
      * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
      */
     var pointerMoveHandler = function (evt) {
         if (evt.dragging) {
             return;
         }
         /** @type {string} */
         var helpMsg = 'Click to start drawing';
 
         if (sketch) {
             var geom = sketch.getGeometry();
         }
 
     };
 
     map.on('pointermove', pointerMoveHandler);
 
     // var listener;
     draw.on('drawstart', function (evt) {
         // set sketch
         sketch = evt.feature;
 
         /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
         var tooltipCoord = evt.coordinate;
 
         sketch.getGeometry().on('change', function (evt) {
             var geom = evt.target;
             var output;
             if (geom instanceof ol.geom.Polygon) {
                 output = formatArea(geom);
                 tooltipCoord = geom.getInteriorPoint().getCoordinates();
             } else if (geom instanceof ol.geom.LineString) {
                 output = formatLength(geom);
                 tooltipCoord = geom.getLastCoordinate();
             }
             measureTooltipElement.innerHTML = output;
             measureTooltip.setPosition(tooltipCoord);
         });
     });
 
     draw.on('drawend', function () {
         measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
         measureTooltip.setOffset([0, -7]);
         // unset sketch
         sketch = null;
         // unset tooltip so that a new one can be created
         measureTooltipElement = null;
         createMeasureTooltip();
         //ol.Observable.unByKey(listener);
     });
 }
 

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
 var helpTooltipElement;

 /**
  * Overlay to show the help messages.
  * @type {Overlay}
  */
 var helpTooltip;
 
 /**
  * Creates a new help tooltip
  */
 function createHelpTooltip() {
     if (helpTooltipElement) {
         helpTooltipElement.parentNode.removeChild(helpTooltipElement);
     }
     helpTooltipElement = document.createElement('div');
     helpTooltipElement.className = 'ol-tooltip hidden';
     helpTooltip = new ol.Overlay({
         element: helpTooltipElement,
         offset: [15, 0],
         positioning: 'center-left',
     });
     map.addOverlay(helpTooltip);
 }
 
 
/**
* The measure tooltip element.
* @type {HTMLElement}
*/
var measureTooltipElement;


/**
* Overlay to show the measurement.
* @type {Overlay}
*/
var measureTooltip;

/**
 * Creates a new measure tooltip
 */

function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
    });
    map.addOverlay(measureTooltip);
}





/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
    var length = ol.sphere.getLength(line);
    var output;
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
    var area = ol.sphere.getArea(polygon);
    var output;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
};

// end : Length and Area Measurement Control

// // start : zoomIn Control

var zoomInInteraction = new ol.interaction.DragBox();

zoomInInteraction.on('boxend', function () {
    var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
    map.getView().fit(zoomInExtent);
});

var ziButton = document.createElement('button');
ziButton.innerHTML = '<img src="./Images/zoom-in.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
ziButton.className = 'myButton';
ziButton.id = 'ziButton';

var ziElement = document.createElement('div');
ziElement.className = 'ziButtonDiv';
ziElement.appendChild(ziButton);

var ziControl = new ol.control.Control({
    element: ziElement
})

var zoomInFlag = false;
ziButton.addEventListener("click", () => {
    ziButton.classList.toggle('clicked');
    zoomInFlag = !zoomInFlag;
    if (zoomInFlag) {
        document.getElementById("map").style.cursor = "zoom-in";
        map.addInteraction(zoomInInteraction);
    } else {
        map.removeInteraction(zoomInInteraction);
        document.getElementById("map").style.cursor = "default";
    }
})

map.addControl(ziControl);

// end : zoomIn Control

// start : zoomOut Control

var zoomOutInteraction = new ol.interaction.DragBox();

zoomOutInteraction.on('boxend', function () {
    var zoomOutExtent = zoomOutInteraction.getGeometry().getExtent();
    map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));

    mapView.setZoom(mapView.getZoom() - 1)
});

var zoButton = document.createElement('button');
zoButton.innerHTML = '<img src="./Images/zoom-out.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle; border-radius: 10px;"></img>';
zoButton.className = 'myButton';
zoButton.id = 'zoButton';

var zoElement = document.createElement('div');
zoElement.className = 'zoButtonDiv';
zoElement.appendChild(zoButton);

var zoControl = new ol.control.Control({
    element: zoElement
})

var zoomOutFlag = false;
zoButton.addEventListener("click", () => {
    zoButton.classList.toggle('clicked');
    zoomOutFlag = !zoomOutFlag;
    if (zoomOutFlag) {
        document.getElementById("map").style.cursor = "zoom-out";
        map.addInteraction(zoomOutInteraction);
    } else {
        map.removeInteraction(zoomOutInteraction);
        document.getElementById("map").style.cursor = "default";
    }
})

map.addControl(zoControl);

// end : zoomOut Control



var select1 = document.getElementById("selectCantonment");
const cantonment = ["MALIR", "MANGLA", "PESHAWAR", "GILGIT", "LAHORE"];

for(var i = 0; i < cantonment.length; i++) {
    var opt = cantonment[i];
    var el1 = document.createElement("option");
    el1.textContent = opt;
    el1.value = opt;
    select1.appendChild(el1);
}
var e = document.getElementById("selectCantonment");
var value = e.options[e.selectedIndex].value;


var select2 = document.getElementById("selectLandCategory");

var e1 = document.getElementById("selectLandCategory");
var value = e1.options[e1.selectedIndex].value;


var select3 = document.getElementById("selectSurveyNumber");


var e2 = document.getElementById("selectSurveyNumber");
var value = e2.options[e2.selectedIndex].value;





// start : attribute query

var geojson;
var featureOverlay;

var qryButton = document.getElementById('QButton');
//qryButton.innerHTML = '<img alt="" style="text-align:center;margin: 1px;padding:5px; width:22px;height:22px;vertical-align:middle; "></img>';
// qryButton.className = 'myButton';
// qryButton.id = 'qryButton';

var qryElement = document.createElement('div');
// qryElement.className = 'myButtonDiv';
qryElement.appendChild(qryButton);

var qryControl = new ol.control.Control({
    element: qryButton
})

var qryFlag = true;
qryButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    // qryButton.classList.toggle('clicked');
    qryFlag = qryFlag;
    document.getElementById("map").style.cursor = "default";
    if (qryFlag) {
        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
        document.getElementById("attQueryDiv").style.display = "block";

        bolIdentify = false;

        addMapLayerList();
    } else {
        document.getElementById("attQueryDiv").style.display = "none";
        document.getElementById("attListDiv").style.display = "none";

        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
    }
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").style.width = "0";

})

map.addControl(qryControl);

function addMapLayerList() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/geoserver/wfs?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                var select = $('#selectCantonment');
                select.append("<option class='ddindent' value=''></option>");
                $(xml).find('FeatureType').each(function () {
                    $(this).find('Name').each(function () {
                        var value = $(this).text();
                        select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                    });
                });
            }
        });
    });

};

$(function () {
    var text = e.options[e.selectedIndex].text; 
    console.log(text)
    var text1 = e1.options[e1.selectedIndex].text; 
    var text2 = e2.options[e2.selectedIndex].text; 
    document.getElementById("selectCantonment").onchange = function () {
        // var select = document.getElementById("selectAttribute");
        // while (select.options.length > 0) {
        //     select.remove(0);
        // }
        text = e.options[e.selectedIndex].text; 
        if (e.options[e.selectedIndex].text != "-- select an option --") {
            // alert("Select Cantonement");
            
            var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "Practice:pak_adm3&" + "CQL_FILTER=name_1='" + text + "'&outputFormat=application/json"
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () { newaddRowHandlers(url); }, 300);
            map.set("isLoading", 'NO');
            document.getElementById("selectLandCategory").disabled=false;
            LandCategoryLayerflag = true;
            
        }
    document.getElementById("selectLandCategory").onchange = function () {
            text = e.options[e.selectedIndex].text; 
            text1 = e1.options[e1.selectedIndex].text;
            console.log(text, text1)
            if (e.options[e.selectedIndex].text1 != "-- select an option --") {
                // alert("Select Cantonement");
                
                var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "Practice:pak_adm3&" + "CQL_FILTER=name_1='" + text + "'AND name_2='" + text1 + "'&outputFormat=application/json"
                newaddGeoJsonToMap(url);
                newpopulateQueryTable(url);
                setTimeout(function () { newaddRowHandlers(url); }, 300);
                map.set("isLoading", 'NO');
                document.getElementById("selectSurveyNumber").disabled=false;
                layerFlag = true;
                $('#selectSurveyNumber').empty();
                $('#selectSurveyNumber').append($('<option>', {
                    value: 0,
                    text: '-- select an option --'
                }));
            }
    }
    document.getElementById("selectSurveyNumber").onchange = function () {
        text = e.options[e.selectedIndex].text; 
        text1 = e1.options[e1.selectedIndex].text;
        text2 = e2.options[e2.selectedIndex].text;
        console.log(text, text1);
        if (e.options[e.selectedIndex].text != "-- select an option --") {
            //var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "Practice:pak_adm3&" + "CQL_FILTER=name_1='" + text + "'AND name_2='" + text1 + "'AND name_3='" + text2 +"'&outputFormat=application/json"
            var url = "http://localhost:8080/geoserver/Practice/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName="+ "Practice:pak_adm3&" + "CQL_FILTER=name_1='" + text + "'AND name_2='" + text1 + "'AND id_3='" + text2 +"'&outputFormat=application/json"
            console.log(url)
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () { newaddRowHandlers(url); }, 300);
            map.set("isLoading", 'NO');

        }
}
     
    }
});




function newaddGeoJsonToMap(url) {
    console.log(url)
    if (geojson) {
        geojson.getSource().clear();
        map.removeLayer(geojson);
    }

    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#FFFF00',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#FFFF00'
            })
        })
    });

    geojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
        style: style,

    });

    geojson.getSource().on('addfeature', function () {
        map.getView().fit(
            geojson.getSource().getExtent(),
            { duration: 1590, size: map.getSize(), maxZoom: 12 }
        );
    });
    map.addLayer(geojson);
};
var arra = [];
var arraa = [];
function newpopulateQueryTable(url) {
    console.log(url)
    console.log("in")
    if (typeof attributePanel !== 'undefined') {
        if (attributePanel.parentElement !== null) {
            attributePanel.close();
        }
    }
    $.getJSON(url, function (data) {

        if(data.features.length == 0){
            alert("No Data Exist");
        }
        else{
      
        var col = [];
        console.log(data)
        for (var i = 0; i < data.features.length; i++) {

            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);
                    console.log(data.features.length)
                }
                if(LandCategoryLayerflag==true)
                {
                    arra[i]=data.features[i].properties.name_2;
                }
                if(layerFlag==true)
                {
                    arraa[i] = data.features[i].properties.id_3;
                }
                else{
                    console.log("");
                }
                
            
            }
        }
     
       
        // var z=0
        col.push(data);
        var table = document.createElement("table");

        table.setAttribute("class", "table table-bordered table-hover table-condensed");
        table.setAttribute("id", "attQryTable");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.
        var z =0;
        for (var i = 3; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            if(col[i]=='id'){
                console.log(i);
                z = i;
            }
        }
        var leng=data.features.length;
       


        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.features.length; i++) {
            tr = table.insertRow(-1);
            // console.log("in",data.features.length);
            for (var j = 3; j < col.length; j++){
                var tabCell = tr.insertCell(-1);
               
                if (j == z) { tabCell.innerHTML = data.features[i]['id']; }
                else {
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            }
        }

        var tabDiv = document.createElement("div");


        var delTab = document.getElementById('attQryTable');
        if (delTab) {
            tabDiv.removeChild(delTab);
        }

        tabDiv.appendChild(table);
        document.getElementById("attListDiv").style.display = "none";
        }

        var levelOneArray = [];
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }
          
        var levelOneArray = arra.filter(onlyUnique)
        if(LandCategoryLayerflag==true){
            for(var i = 0; i < levelOneArray.length; i++) {
                var opt = levelOneArray[i];
                var el2 = document.createElement("option");
                el2.textContent = opt;
                el2.value = opt;
                select2.appendChild(el2);
                }
        }
        
        if(layerFlag==true){
        for(var i = 0; i < arraa.length; i++) {
            var opt = arraa[i];
            var el3 = document.createElement("option");
            el3.textContent = opt;
            el3.value = opt;
            select3.appendChild(el3);
            }
            arraa = [];
       }
        LandCategoryLayerflag=false;
        layerFlag=false;
        console.log("Survey Number Array: ", arraa);
      
        

    });

};


function loadprops(layername) {
    selectedLayer = layername;
    fetch(
      geoserver_ip+ ':'+geoserver_port+"/geoserver/wfs?service=wfs&version=2.0.0&request=DescribeFeatureType&typeNames=" + 
        layername +
        "&outputFormat=application/json",
      {
        method: "GET",
        headers: MyHeaders,
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
          var allprops = json.featureTypes[0].properties;
        var ColumnnamesSelect = document.getElementById("Columnnames");
            ColumnnamesSelect.innerHTML = ''
          for (i = 0; i < allprops.length; i++){
              if (allprops[i].name != 'the_geom') {
                  ColumnnamesSelect.innerHTML +=
                    '<option value="' +
                    allprops[i].name +
                    '"> ' +
                    allprops[i].name +
                    "</option>";
              }

          }
      });
}







var highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,0,255,0.3)',
    }),
    stroke: new ol.style.Stroke({
        color: '#FF00FF',
        width: 3,
    }),
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: '#FF00FF'
        })
    })
});


var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: highlightStyle
});

function newaddRowHandlers() {
    var table = document.getElementById("attQryTable");
    var rows = document.getElementById("attQryTable").rows;
    var heads = table.getElementsByTagName('th');
    var col_no;
    for (var i = 0; i < heads.length; i++) {
        // Take each cell
        var head = heads[i];
        if (head.innerHTML == 'id') {
            col_no = i + 1;
        }

    }
    for (i = 0; i < rows.length; i++) {
        rows[i].onclick = function () {
            // console.log(rows[i]);
            return function () {
                featureOverlay.getSource().clear();

                $(function () {
                    $("#attQryTable td").each(function () {
                        $(this).parent("tr").css("background-color", "white");
                    });
                });
                var cell = this.cells[col_no - 1];
                var id = cell.innerHTML;
                $(document).ready(function () {
                    $("#attQryTable td:nth-child(" + col_no + ")").each(function () {
                        if ($(this).text() == id) {
                            $(this).parent("tr").css("background-color", "#d1d8e2");
                        }
                    });
                });

                var features = geojson.getSource().getFeatures();

                for (i = 0; i < features.length; i++) {
                    if (features[i].getId() == id) {
                        console.log(features[i])
                        featureOverlay.getSource().addFeature(features[i]);

                        featureOverlay.getSource().on('addfeature', function () {
                            map.getView().fit(
                                featureOverlay.getSource().getExtent(),
                                { duration: 1500, size: map.getSize(), maxZoom: 24 }
                            );
                        });

                    }
                }
            };
        }(rows[i]);
    }
    // document.getElementById("attQueryDiv").style.display = "none";
   
}

// end : attribute query

// Make the DIV element draggable:
dragElement(document.getElementById("legend"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}



function myFunction() {
    var x = document.getElementById("legend");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
