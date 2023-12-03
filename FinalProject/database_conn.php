<?php
session_start();

$server = 'localhost';
$userid = 'upes9gi8al11d';
$pw = 'PixelPioneers123';
$dbname = 'dbbbizvl4rivjn';

$conn = new mysqli($server, $userid, $pw, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$email = $_POST['email'];

// Check if the email already exists in the database
$check_query = "SELECT id FROM emails_db WHERE email = '$email'";
$check_result = $conn->query($check_query);

if ($check_result->num_rows > 0) {
    // If the email exists, fetch and return its associated ID
    $row = $check_result->fetch_assoc();
    $existing_id = $row['id'];
    echo $existing_id;
} else {
    // If the email doesn't exist, insert the new record and return the inserted ID
    $insert_query = "INSERT INTO emails_db (firstname, lastname, email) VALUES ('$firstname', '$lastname', '$email')";
    if ($conn->query($insert_query) === TRUE) {
        $last_id = $conn->insert_id;
        echo $last_id;
    } else {
        echo "Error: " . $insert_query . "<br>" . $conn->error;
    }
}

$conn->close();
?>
