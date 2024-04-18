<?php

$inData = getRequestInfo();

$name = $inData["Name"];
$adminID = $inData["AdminID"];
$universityID = $inData["UniversityID"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if the admin exists
    if (!adminExists($conn, $adminID)) {
        returnWithError("Admin not found.");
    } else {
        // Check if the university exists
        if (!universityExists($conn, $universityID)) {
            returnWithError("University not found.");
        } else {
            // Insert RSO into RSOs table
            insertRSO($conn, $name, $adminID, $universityID);

            returnWithInfo("RSO created successfully.");
        }
    }
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function insertRSO($conn, $name, $adminID, $universityID) {
    $stmt = $conn->prepare("INSERT INTO RSOs (Name, AdminID, UniversityID) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $name, $adminID, $universityID);
    $stmt->execute();
    $stmt->close();
}

function adminExists($conn, $adminID) {
    $stmt = $conn->prepare("SELECT * FROM Admin WHERE AdminID = ?");
    $stmt->bind_param("i", $adminID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->num_rows > 0;
}

function universityExists($conn, $universityID) {
    $stmt = $conn->prepare("SELECT * FROM University WHERE UniversityID = ?");
    $stmt->bind_param("i", $universityID);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->num_rows > 0;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info) {
    $retValue = '{"info":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}

?>
