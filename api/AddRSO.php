<?php

$inData = getRequestInfo();

$name = $inData["Name"];
$userID = $inData["UserID"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Fetch Admin's AdminID and UniversityID using the given UserID
    $adminInfo = fetchAdminInfo($conn, $userID);
    if (!$adminInfo) {
        returnWithError("Admin not found.");
    } else {
        $adminID = $adminInfo["AdminID"];
        $universityID = $adminInfo["UniversityID"];
        
        // Insert RSO into RSOs table
        insertRSO($conn, $name, $adminID, $universityID);

        returnWithInfo("RSO created successfully.");
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

function fetchAdminInfo($conn, $userID) {
    $stmt = $conn->prepare("SELECT AdminID, UniversityID FROM Admin WHERE UserID = ?");
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    } else {
        return null;
    }
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
