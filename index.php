<?php
include "main.php";
http_response_code(200);
$sql = "select distinct id_1,name_1 from pak_adm2";
$result = pg_query($db, $sql);
?>

   <table>
   <tr>
      <td>Country</td>
      <td>
        <form action="action.php">
         <select id="country">
            <option value="0" >– Select Country –</option>
            <?php
            while ($row = pg_fetch_assoc($result) ){

               $id = $row['id_1'];
               $name = $row['name_1'];

               echo "<option value='".$id."' >".$name."</option>";
               echo gettype($name);
            }
            ?>
         </select>
         <select id="state" >
            <option value="0" >– Select State –</option>
         </select>
         <button> click </button>
         </form>
      </td>
   </tr>
<!-- 
   <tr>
      <td>State</td>
      <td>
        
      </td>
   </tr> -->

   <!-- <tr>
      <td>City</td>
      <td>
         <select id="city" >
            <option value="0" >– Select City –</option>
         </select>
      </td>
   </tr> -->
</table>
<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script>
    $(document).ready(function(){

// Country
    $('#country').change(function(){
   // Country id
   var country_id = $(this).val();
   console.log(country_id);
   // Empty the dropdown
   $('#state').find('option').not(':first').remove();
   $('#city').find('option').not(':first').remove();

   // AJAX request
   $.ajax({
      url: 'action.php',
      type: 'post',  
      // dataType: 'json',   
      data: {request: 'getStates', id: country_id},
      success: function(response){

         var len = 0;
         if(response != null){
            len = response.length;
            console.log("Length: ", response.length);
         }

         if(len > 0){
            console.log("Length", response.length)
            // Read data and create <option >
            console.log("ID",response[3].id);
            for(var i=0; i<len; i++){

               var id = response[i].id;
               var name = response[i].name;
               console.log(name);
               var option = "<option value='"+id+"'>"+name+"</option>";

               $("#state").append(option);
            }
         }
      },
      error: function () {
        console.log("Error");
      },
   });
});
    });
</script>

<!-- // Country
// $('#state').change(function(){

//    // State id
//    var state_id = $(this).val();

//    // Empty the dropdown
//    $('#city').find('option').not(':first').remove();

//    // AJAX request
//    $.ajax({
//       url: 'ajaxfile.php',
//       type: 'post',
//       data: {request: 'getCities', state_id: state_id},
//       dataType: 'json',
//       success: function(response){

//          var len = 0;
//          if(response != null){
//             len = response.length;
//          }

//          if(len > 0){
//             // Read data and create <option >
//             for(var i=0; i<len; i++){

//                var id = response[i].id;
//                var name = response[i].name;

//                var option = "<option value='"+id+"'>"+name+"</option>";

//                $("#city").append(option);
//             }
//          }

//       }
//    });
// });

// }); -->

