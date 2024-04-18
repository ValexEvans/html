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
