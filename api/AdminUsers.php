<?php

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM User WHERE Role = 'Admin'");
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $adminUsers = array();
        while ($row = $result->fetch_assoc()) {
            $adminUsers[] = $row;
        }
        returnWithInfo($adminUsers);
    } else {
        returnWithError("No Admin users found.");
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
