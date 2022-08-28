<?php
include "config.php";

$sql = "select distinct name_1,id_1 from pak_adm3";
$result = pg_query($con, $sql);

$sql1 = "select distinct name_2,id_2 from pak_adm3 order by name_2";
$result1 = pg_query($con, $sql1);

$sql2 = "select distinct name_3,id_3 from pak_adm3 order by name_3";
$result2 = pg_query($con, $sql2);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="https://cdn.rawgit.com/Viglino/ol-ext/master/dist/ol-ext.min.css" />
  <link rel="stylesheet" href="./resources/openlayers/ol/ol.css" >
  <link rel="stylesheet" href="./resources/layerswitcher/ol-layerswitcher.css">
  <link rel="stylesheet" href="main.css">
</head>
<body>
  <div style="background-color: red; z-index: -1;">
    <p id="content"></p>
  </div>
  <div id="map"></div>






  <div id="popup" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content" style="font-style: italic;"><h1>PROVINCE</h1></div>
  </div>
  
  <div class="attQueryDiv" id="attQueryDiv">
    <div class="headerDiv" id="headerDiv">
        <label for="">Attribute Query</label>
    </div><br>
    <!-- <label style="display: none;" for="">Select Layer</label>
    <select style="display: none;" name="selectLayer" id="selectLayer">
    </select><br><br> -->
    <label for="">Cantonment</label>
    <select name="selectCantonment" id="selectCantonment">
      <option disabled selected value> -- select an option -- </option>
      <?php
            while ($row = pg_fetch_assoc($result) ){

               $id = $row['id_1'];
               $name = $row['name_1'];

               echo "<option value='".$id."' >".$name."</option>";
            }
            ?>
    </select>
  <br><br>
  <label class="selection" for="">Land Category</label>
    <select disabled="true" name="selectLandCategory" id="selectLandCategory">
      <option disabled selected value> -- select an option -- </option>
      <?php
            while ($row = pg_fetch_assoc($result1) ){

               $id = $row['id_2'];
               $name = $row['name_2'];

               echo "<option value='".$id."' >".$name."</option>";
            }
            ?>
    </select>
  <br><br>
  <label class="selection" for="">Survey Number</label>
    <select disabled="true" name="selectSurveyNumber" id="selectSurveyNumber">
      <option disabled selected value> -- select an option -- </option>
      <?php
            while ($row = pg_fetch_assoc($result2) ){

               $id = $row['id_3'];
               $name = $row['name_3'];

               echo "<option value='".$id."' >".$name."</option>";
            }
            ?>
    </select>
  <br><br>
  </div>

  <div class="attListDiv" id="attListDiv">
  </div>
  <div class="layerInfocard" id="layerInfocard">
    <h3></h3>
    <p></p>
  </div>
  <button style="position: fixed;" id="legend-button" class="myButton" onclick="myFunction()"><img style="text-align:center;margin: 2px;padding:5px; width:20px;height:20px;vertical-align:middle; border-radius: 10px;" src="./Images/map.png"/></button>
  <div id="legend">
      <img class="legendIMG" src="./Images/Legend.png" alt="Legend"/>
  </div>
  <link rel="stylesheet" href="./ol-ext-master/dist/ol-ext.min.css" /> 
  


  <script> 
    function myFunction() {
    var x = document.getElementById("legend");
    if (x.style.display === "none" || x.style.display === ""){
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  </script>
  
  <!-- <script type="module" src="./database.js"></script> -->
  <script src="./resources/openlayers/ol/ol.js"></script>  
  <script type="text/javascript" src="./ol-ext-master/dist/ol-ext.min.js"></script>
  <script src="./jquery-3.6.0.min.js"></script>
  <script src="./resources/layerswitcher/ol-layerswitcher.js"></script>
  <script type="module" src="./main.js"></script>
  


</body>
</html>
