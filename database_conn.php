<?php
session_start();

$server = 'localhost'; 
$userid = 'upes9gi8al11d';
$pw = 'pixelPioneers2023';
$dbname = '';

$conn = new mysqli($server, $userid, $pw, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); 
}

$sql = "";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
}

$conn->close();
?>