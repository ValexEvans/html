<?php

$inData = getRequestInfo();

$name = $inData["Name"];
$location = $inData["Location"];
$description = $inData["Description"];
$numberOfStudents = $inData["NumberOfStudents"];
$pictures = $inData["Pictures"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO University (Name, Location, Description, NumberOfStudents, Pictures) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssis", $name, $location, $description, $numberOfStudents, $pictures);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Retrieve the UniversityID of the newly inserted university
        $universityID = $stmt->insert_id;
        returnWithInfo("University created successfully.", $universityID);
    } else {
        returnWithError("Failed to create university.");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"UniversityID":0, "error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info, $universityID) {
    $retValue = '{"UniversityID":' . $universityID . ', "info":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}

?>
