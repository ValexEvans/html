<?php

$inData = getRequestInfo();

$UserID = $inData["UserID"];
$RSOID = $inData["RsoID"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    // Check if UserID and RSOID are provided
    if (empty($UserID) || empty($RSOID)) {
        returnWithError("UserID and RSOID are required.");
    } else {
        // Check if UserID and RSOID exist in their respective tables
        if (!recordExists($conn, 'User', 'UserID', $UserID) || !recordExists($conn, 'RSOs', 'RSOID', $RSOID)) {
            returnWithError("UserID or RSOID not found.");
        } else {
            // Insert entry into Register table
            if (insertRegister($conn, $UserID, $RSOID)) {
                returnWithInfo("Registration successful.");
            } else {
                returnWithError("Failed to register.");
            }
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

function insertRegister($conn, $UserID, $RSOID) {
    $stmt = $conn->prepare("INSERT INTO Register (UserID, RSOID) VALUES (?, ?)");
    $stmt->bind_param("ii", $UserID, $RSOID);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}

function recordExists($conn, $table, $column, $value) {
    $stmt = $conn->prepare("SELECT COUNT(*) FROM $table WHERE $column = ?");
    $stmt->bind_param("i", $value);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count > 0;
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
