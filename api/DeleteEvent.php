<?php

$inData = getRequestInfo();

$EventID = 0;

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $EventID = $inData["EventID"];

    $stmt = $conn->prepare("DELETE FROM Events WHERE EventID = ?");
    $stmt->bind_param("i", $EventID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithInfo("Event deleted successfully");
    } else {
        returnWithError("No event found with provided EventID");
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
    echo json_encode($obj);
}

function returnWithError($err)
{
    $retValue = array("error" => $err);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info)
{
    $retValue = array("info" => $info);
    sendResultInfoAsJson($retValue);
}

?>
