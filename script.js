$(document).ready(function(){

    // Country
    $('#country').change(function(){
 
       // Country id
       var country_id = $(this).val();
 
       // Empty the dropdown
       $('#state').find('option').not(':first').remove();
       $('#city').find('option').not(':first').remove();
 
       // AJAX request
       $.ajax({
          url: 'ajax.php',
          type: 'post',
          data: {request: 'getStates', country_id: country_id},
          dataType: 'json',
          success: function(response){
 
             var len = 0;
             if(response != null){
                len = response.length;
             }
 
             if(len > 0){
                // Read data and create <option >
                for(var i=0; i<len; i++){
 
                   var id = response[i].id;
                   var name = response[i].name;
 
                   var option = "<option value='"+id+"'>"+name+"</option>";
 
                   $("#state").append(option);
                }
             }
          }
       });
    });
 
    // Country
    $('#state').change(function(){
 
       // State id
       var state_id = $(this).val();
 
       // Empty the dropdown
       $('#city').find('option').not(':first').remove();
 
       // AJAX request
       $.ajax({
          url: 'ajax.php',
          type: 'post',
          data: {request: 'getCities', state_id: state_id},
          dataType: 'json',
          success: function(response){
 
             var len = 0;
             if(response != null){
                len = response.length;
             }
 
             if(len > 0){
                // Read data and create <option >
                for(var i=0; i<len; i++){
 
                   var id = response[i].id;
                   var name = response[i].name;
 
                   var option = "<option value='"+id+"'>"+name+"</option>";
 
                   $("#city").append(option);
                }
             }
 
          }
       });
    });
 
 });