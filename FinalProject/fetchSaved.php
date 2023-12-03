<?php
// Establish a connection to your database
$servername = "localhost"; // Replace with your database server name
$username = "upes9gi8al11d"; // Replace with your database username
$password = "PixelPioneers123"; // Replace with your database password
$dbname = "dbbbizvl4rivjn"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the user ID from the query string parameter
$userID = $_GET['user_id']; // Assuming it's passed via GET request

// Prepare and execute the SQL query to retrieve OrderIDs for the given user_id
$sql = "SELECT recipeID FROM recipes WHERE userID = ?"; // Assuming 'orders' is your table name
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userID); // Assuming user_id is an integer
$stmt->execute();
$result = $stmt->get_result();

// Fetch OrderIDs and store in an array
$recipeIDs = array();
while ($row = $result->fetch_assoc()) {
    $recipeIDs[] = $row['recipeID'];
}

// Close statement and database connection
$stmt->close();
$conn->close();

// Return OrderIDs as a JSON response
header('Content-Type: application/json');
echo json_encode($recipeIDs);
?>
