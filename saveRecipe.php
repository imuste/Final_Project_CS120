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

$userID = $_GET['userID'];
$recipeID = $_GET['recipeID'];

// Prepare and execute the SQL query to insert the recipe ID and user ID
$sql = "INSERT INTO recipes (userID, recipeID) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $userID, $recipeID); // Assuming both IDs are integers
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Recipe saved successfully";
} else {
    echo "Error saving recipe";
}

$stmt->close();
$conn->close();
?>
