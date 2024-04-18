<?php

// Database connection parameters
$servername = "localhost";
$username = "username";
$password = "password";
$database = "DB01";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to select all RSOs
$sql = "SELECT RSOID, Name, AdminID, UniversityID FROM RSOs";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        echo "RSOID: " . $row["RSOID"] . "<br>";
        echo "Name: " . $row["Name"] . "<br>";
        echo "AdminID: " . $row["AdminID"] . "<br>";
        echo "UniversityID: " . $row["UniversityID"] . "<br>";
        echo "<br>";
    }
} else {
    echo "0 results";
}

$conn->close();

?>
