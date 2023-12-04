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

// Check if the userID and recipeID pair already exists in the database
$checkQuery = "SELECT * FROM recipes WHERE userID = ? AND recipeID = ?";
$checkStmt = $conn->prepare($checkQuery);
$checkStmt->bind_param("ii", $userID, $recipeID); // Assuming both IDs are integers
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo "Recipe already saved for this user.";
} else {
    // Prepare and execute the SQL query to insert the recipe ID and user ID
    $insertQuery = "INSERT INTO recipes (userID, recipeID) VALUES (?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("ii", $userID, $recipeID); // Assuming both IDs are integers
    $insertStmt->execute();

    if ($insertStmt->affected_rows > 0) {
        echo "Recipe saved successfully. User ID: ".$userID." Recipe ID: ". $recipeID;
    } else {
        echo "Error saving recipe";
    }
    $insertStmt->close();
}

$checkStmt->close();

$conn->close();
?>
