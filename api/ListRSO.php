<?php

// Create connection
$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to select all RSOs
$sql = "SELECT RSOID, Name, AdminID, UniversityID FROM RSOs";

$result = $conn->query($sql);

$rsos = array(); // Initialize an empty array to store RSO data

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        // Add each RSO data to the array
        $rsos[] = array(
            "RSOID" => $row["RSOID"],
            "Name" => $row["Name"],
            "AdminID" => $row["AdminID"],
            "UniversityID" => $row["UniversityID"]
        );
    }
} else {
    echo "0 results";
}

// Close the connection
$conn->close();

// Encode the array into JSON format
$json_rsos = json_encode($rsos);

// Output the JSON data
header('Content-Type: application/json');
echo $json_rsos;

?>
