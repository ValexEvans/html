<?php

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $requestData = json_decode(file_get_contents('php://input'), true);
    $EventID = $requestData["EventID"];

    $stmt = $conn->prepare("SELECT * FROM Events WHERE EventID = ?");
    $stmt->bind_param("i", $EventID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $event = $result->fetch_assoc();
        returnWithInfo($event);
    } else {
        returnWithError("Event not found.");
    }

    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info)
{
    sendResultInfoAsJson($info);
}

?>
