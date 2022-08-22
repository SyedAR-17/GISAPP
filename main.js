// import province  from "./database.js";
// console.log(province);

var mapView = new ol.View({
    center: ol.proj.fromLonLat([69.3451,30.3753]),
    zoom:5,
});


var map = new ol.Map({
    target: 'map',
    view: mapView,
    controls:[]
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
    title: "Pakistan Districts",
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/Pakadm/wms',
        params:{'LAYERS':'Pakadm:pak_adm2', 'TILED':true},
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

var layerSwitch = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'children'
});
map.addControl(layerSwitch);

var baseGroup = new ol.layer.Group({
    title:"Base Map",
    fold: true,
    layers:[WB, PAK]
});
map.addLayer(baseGroup);

var overlayGroup = new ol.layer.Group({
    title:"Overlays",
    fold: true,
    layers:[PAKADM, KK]
});
map.addLayer(overlayGroup)

var mousePosition = new ol.control.MousePosition({
    className: "mousePos",
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate, '{y} , {x}', 6);}
});
map.addControl(mousePosition);

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
homeButton.innerHTML = '<img src="../../Images/home.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
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


// start : full screen Control

var fsButton = document.createElement('button');
fsButton.innerHTML = '<img src="../../Images/maximize.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
fsButton.className = 'myButton';

var fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

var fsControl = new ol.control.Control({
    element: fsElement
})

fsButton.addEventListener("click", () => {
    var mapEle = document.getElementById("map");
    if (mapEle.requestFullscreen) {
        mapEle.requestFullscreen();
    } else if (mapEle.msRequestFullscreen) {
        mapEle.msRequestFullscreen();
    } else if (mapEle.mozRequestFullscreen) {
        mapEle.mozRequestFullscreen();
    } else if (mapEle.webkitRequestFullscreen) {
        mapEle.webkitRequestFullscreen();
    }
})

map.addControl(fsControl);

// end : full screen Control

// start : FeatureInfo Control
// start : FeatureInfo Control

var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML = '<img src="../../Images/information.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
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
    console.log(featureInfoFlag, "green")
})

map.addControl(featureInfoControl);

map.on('singleclick', function (evt) {
    console.log(featureInfoFlag);
    if (featureInfoFlag) {
        // console.log("red");
        content.innerHTML = '';
        var resolution = mapView.getResolution();

        var url = PAKADM.getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
            'INFO_FORMAT': 'application/json',
            'propertyName': 'name_1,name_2'
        });
        if (url) {
            // console.log("blue");
            $.getJSON(url, function (data) {
                var feature = data.features[0];
                var props = feature.properties;
                content.innerHTML = "<h3> Province : </h3> <p>" + props.name_1.toUpperCase() + "</p> <br> <h3> District : </h3> <p>" +
                    props.name_2.toUpperCase() + "</p>";
                popup.setPosition(evt.coordinate);
            })
        } else {
            popup.setPosition(undefined);
        }
    }
});





// start : Length and Area Measurement Control

var lengthButton = document.createElement('button');
lengthButton.innerHTML = '<img src="../../Images/arrows.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:20px;height:20px;vertical-align:middle border-radius: 10px;"></img>';
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
areaButton.innerHTML = '<img src="../../Images/area.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:20px;height:20px;vertical-align:middle border-radius: 10px;"></img>';
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
             // if (geom instanceof ol.geom.Polygon) {
             //   helpMsg = continuePolygonMsg;
             // } else if (geom instanceof ol.geom.LineString) {
             //   helpMsg = continueLineMsg;
             // }
         }
 
         //helpTooltipElement.innerHTML = helpMsg;
         //helpTooltip.setPosition(evt.coordinate);
 
         //helpTooltipElement.classList.remove('hidden');
     };
 
     map.on('pointermove', pointerMoveHandler);
 
     // var listener;
     draw.on('drawstart', function (evt) {
         // set sketch
         sketch = evt.feature;
 
         /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
         var tooltipCoord = evt.coordinate;
 
         //listener = sketch.getGeometry().on('change', function (evt) {
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
 
 
// map.getViewport().addEventListener('mouseout', function () {
//     helpTooltipElement.classList.add('hidden');
// });

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
ziButton.innerHTML = '<img src="../../Images/zoom-in.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
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
zoButton.innerHTML = '<img src="../../Images/zoom-out.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
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











// start : attribute query

var geojson;
var featureOverlay;

var qryButton = document.createElement('button');
qryButton.innerHTML = '<img src="../../Images/database.png" alt="" style="text-align:center;margin: 2px;padding:5px; width:18px;height:18px;vertical-align:middle border-radius: 10px;"></img>';
qryButton.className = 'myButton';
qryButton.id = 'qryButton';

var qryElement = document.createElement('div');
qryElement.className = 'myButtonDiv';
qryElement.appendChild(qryButton);

var qryControl = new ol.control.Control({
    element: qryElement
})

var qryFlag = false;
qryButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    // qryButton.classList.toggle('clicked');
    qryFlag = !qryFlag;
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

})

map.addControl(qryControl);

function addMapLayerList() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/geoserver/wfs?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                var select = $('#selectLayer');
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
    document.getElementById("selectLayer").onchange = function () {
        var select = document.getElementById("selectAttribute");
        while (select.options.length > 0) {
            select.remove(0);
        }
        var value_layer = $(this).val();
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/geoserver/Practice/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + value_layer,
                dataType: "xml",
                // success: function (xml) {

                //     var select = $('#selectAttribute');
                //     //var title = $(xml).find('xsd\\:complexType').attr('name');
                //     //	alert(title);
                //     select.append("<option class='ddindent' value=''></option>");
                //     $(xml).find('xsd\\:sequence').each(function () {

                //         $(this).find('xsd\\:element').each(function () {
                //             var value = $(this).attr('name');
                //             //alert(value);
                //             var type = $(this).attr('type');
                //             //alert(type);
                //             if (value != 'geom' && value != 'the_geom') {
                //                 select.append("<option class='ddindent' value='" + type + "'>" + value + "</option>");
                //             }
                //         });

                //     });
                // }
            });
        });
    }
    // document.getElementById("selectAttribute").onchange = function () {
        // var operator = document.getElementById("selectOperator");
        // while (operator.options.length > 0) {
        //     operator.remove(0);
        // }

        // var value_type = $(this).val();
        // // alert(value_type);
        // var value_attribute = $('#selectAttribute option:selected').text();
        // operator.options[0] = new Option('Select operator', "");

        // if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double') {
        //     var operator1 = document.getElementById("selectOperator");
        //     operator1.options[1] = new Option('Greater than', '>');
        //     operator1.options[2] = new Option('Less than', '<');
        //     operator1.options[3] = new Option('Equal to', '=');
        // }
        // else if (value_type == 'xsd:string') {
        //     var operator1 = document.getElementById("selectOperator");
        //     operator1.options[1] = new Option('Like', 'Like');
        //     operator1.options[2] = new Option('Equal to', '=');
        // }
    //}

    document.getElementById('attQryRun').onclick = function () {
        map.set("isLoading", 'YES');

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }

        var layer = document.getElementById("selectLayer");
        var attribute = document.getElementById("selectAttribute");
        var operator = document.getElementById("selectOperator");
        var txt = document.getElementById("enterValue");

        if (layer.options.selectedIndex == 0) {
            alert("Select Layer");
        }
        // } else if (attribute.options.selectedIndex == -1) {
        //     alert("Select Attribute");
        // } else if (operator.options.selectedIndex <= 0) {
        //     alert("Select Operator");
        // } else if (txt.value.length <= 0) {
        //     alert("Enter Value");
         else {
            var value_layer = "Practice:pakistan_with_kashmir"}
            console.log(typeof(value_layer));
        //     var value_attribute = attribute.options[attribute.selectedIndex].text;
        //     var value_operator = operator.options[operator.selectedIndex].value;
        //     var value_txt = txt.value;
        //     if (value_operator == 'Like') {
        //         value_txt = "%25" + value_txt + "%25";
        //     }
        //     else {
        //         value_txt = value_txt;
        //     }
            var url = "http://localhost:8080/geoserver/Pakadm/wfs?service=WfS&version=1.1.0&request=GetFeature&typeName=" + "Pakadm:pak_adm2&" + "&CQL_FILTER=name_1='Punjab' AND name_2='Multan'" + "&outputFormat=application/json"
            // console.log(url);
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () { newaddRowHandlers(url); }, 300);
            map.set("isLoading", 'NO');
    }
});

function newaddGeoJsonToMap(url) {

    if (geojson) {
        geojson.getSource().clear();
        map.removeLayer(geojson);
    }

    var style = new ol.style.Style({
        // fill: new ol.style.Fill({
        //   color: 'rgba(0, 255, 255, 0.7)'
        // }),
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
            { duration: 1590, size: map.getSize(), maxZoom: 21 }
        );
    });
    map.addLayer(geojson);
};

function newpopulateQueryTable(url) {
    if (typeof attributePanel !== 'undefined') {
        if (attributePanel.parentElement !== null) {
            attributePanel.close();
        }
    }
    $.getJSON(url, function (data) {
        var col = [];
        for (var i = 0; i < data.features.length; i++) {

            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        // var z=0
        col.push('id');
        var table = document.createElement("table");

        table.setAttribute("class", "table table-bordered table-hover table-condensed");
        table.setAttribute("id", "attQryTable");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.
        var z =0;
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
            if(col[i]=='id'){
                console.log(i);
                z = i;
            }
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.features.length; i++) {
            tr = table.insertRow(-1);
            // console.log(data.feature.length);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == z) { tabCell.innerHTML = data.features[i]['id']; }
                else {
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            }
        }

        // var tabDiv = document.createElement("div");
        var tabDiv = document.getElementById('attListDiv');

        var delTab = document.getElementById('attQryTable');
        if (delTab) {
            tabDiv.removeChild(delTab);
        }

        tabDiv.appendChild(table);

        document.getElementById("attListDiv").style.display = "block";
    });

};

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
            console.log(rows[i]);
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
    document.getElementById("attQueryDiv").style.display = "none";
   
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













//JUNK CODE






// map.on('singleclick', event => {
//     // get the feature you clicked
//     const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
//      return feature
//      console.log(feature)
//     })
//     if(feature instanceof ol.Feature){
//       // Fit the feature geometry or extent based on the given map
//       map.getView().fit(feature.getGeometry())
//       // map.getView().fit(feature.getGeometry().getExtent())
//     }
//    })


// var myLayer = new ol.layer.Tile({
//     title: "New Layer",
//     source: new ol.source.TileWMS({
//         url:'http://localhost:8080/geoserver/Practice/wms',
//         params:{'LAYERS':'Practice:world-country-boundaries', 'TILED':true},
//         serverType: 'geoserver',
//         visible: true
//     })
// });
// map.addLayer(myLayer);



// var Karachi = new ol.layer.Tile({
//     title: "New Layer",
//     source: new ol.source.TileWMS({
//         url:'http://localhost:8080/geoserver/Space/wms',
//         params:{'LAYERS':'Space:geotools_coverage', 'TILED':true},
//         serverType: 'geoserver',
//         visible: true
//     })
// });
// map.addLayer(Karachi);


