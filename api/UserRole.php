<?php

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $requestData = json_decode(file_get_contents('php://input'), true);
    $UserID = $requestData["UserID"];

    $stmt = $conn->prepare("SELECT Role FROM User WHERE UserID = ?");
    $stmt->bind_param("i", $UserID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $Role = $row["Role"];
        returnWithInfo($Role);
    } else {
        returnWithError("User not found.");
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
    $retValue = array("error" => $err);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info)
{
    $retValue = array("Role" => $info);
    sendResultInfoAsJson($retValue);
}

?>
