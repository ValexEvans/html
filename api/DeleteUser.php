<?php

$inData = getRequestInfo();

$UserID = $inData["UserID"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM User WHERE UserID = ?");
    $stmt->bind_param("i", $UserID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithInfo("User deleted successfully.");
    } else {
        returnWithError("User not found or failed to delete.");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info)
{
    $retValue = '{"info":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}

?>
