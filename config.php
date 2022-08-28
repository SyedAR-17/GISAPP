<?php

$host = "localhost";
$user = "postgres";
$password = "157";
$dbname = "Practice";
$port="5433";
$con = pg_connect("host=$host dbname=$dbname user=$user password=$password port=$port");

if (!$con) {
   die('Connection failed.');
}
?>