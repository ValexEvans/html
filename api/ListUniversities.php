<?php

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $result = $conn->query("SELECT * FROM University");

    if ($result->num_rows > 0) {
        $universities = array();
        while ($row = $result->fetch_assoc()) {
            $universities[] = $row;
        }
        returnWithInfo($universities);
    } else {
        returnWithError("No universities found.");
    }

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
