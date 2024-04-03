<?php

$inData = getRequestInfo();

$OrganizerID = 0;
$EventID = 0;
$EventName = "";
$Category = "";
$Description = "";
$Time = "";
$Date = "";
$Location = "";
$ContactPhone = "";
$Visibility = "";

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Assuming the organizer is already logged in and their UserID is available
    $OrganizerID = $inData["organizer_id"];
    $EventName = $inData["event_name"];
    $Category = $inData["category"];
    $Description = $inData["description"];
    $Time = $inData["time"];
    $Date = $inData["date"];
    $Location = $inData["location"];
    $ContactPhone = $inData["contact_phone"];
    $Visibility = $inData["visibility"];

    $stmt = $conn->prepare("INSERT INTO Events (Name, Category, Description, Time, Date, Location, ContactPhone, Visibility, OrganizerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssi", $EventName, $Category, $Description, $Time, $Date, $Location, $ContactPhone, $Visibility, $OrganizerID);
    $stmt->execute();

    // Get the EventID of the newly added event
    $EventID = $stmt->insert_id;

    $stmt->close();
    $conn->close();

    returnWithInfo("Event added successfully", $EventID);
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

function returnWithInfo($info, $eventID)
{
    $retValue = array("info" => $info, "event_id" => $eventID);
    sendResultInfoAsJson($retValue);
}

?>
