<?php

$inData = getRequestInfo();

$UserID = $inData["UserID"];
$RSOID = $inData["RsoID"];
$Request = $inData["Request"];

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO Register (UserID, RSOID, Request) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $UserID, $RSOID, $Request);

    if ($stmt->execute()) {
        returnWithSuccess("Registration added successfully.");
    } else {
        returnWithError("Failed to add registration.");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($err)
{
    $retValue = array('error' => $err);
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($msg)
{
    $retValue = array('success' => $msg);
    sendResultInfoAsJson($retValue);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo json_encode($obj);
}

?>
