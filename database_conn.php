<?php
session_start();

$server = 'localhost'; 
$userid = 'udvsa9n5dpmls';
$pw = 'zsgsdb7yvwhh';
$dbname = 'dbx3g3atq5hdmo';

$conn = new mysqli($server, $userid, $pw, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); 
}

$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$email = $_POST['email'];

$sql = "INSERT INTO user_info (firstname, lastname, email)
        VALUES ('$firstname', '$lastname', '$email')";


if ($conn->query($sql) === TRUE) {
    echo "Data inserted successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}


$conn->close();
?>