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
    // `EventID` INT AUTO_INCREMENT PRIMARY KEY,
    // `Name` VARCHAR(255) NOT NULL DEFAULT '' ,
    // `Category` VARCHAR(255) NOT NULL DEFAULT '' ,
    // `Description` TEXT,
    // `Time` TIME,
    // `Date` DATE,
    // `Location` VARCHAR(255) NOT NULL DEFAULT '' ,
    // `ContactPhone` VARCHAR(20) NOT NULL DEFAULT '' ,
    // `EventType` ENUM('Public', 'Private', 'RSO') NOT NULL,
	// `Request` BOOL,
    // `OrganizerID` INT -- not needed
    $OrganizerID = $inData["organizer_id"];
    $EventName = $inData["event_name"];
    $Category = $inData["category"];
    $Description = $inData["description"];
    $Time = $inData["time"];
    $Date = $inData["date"];
    $Location = $inData["location"];
    $ContactPhone = $inData["contact_phone"];
    $EventType = $inData["event_type"];

    $stmt = $conn->prepare("INSERT INTO Events (Name, Category, Description, Time, Date, Location, ContactPhone, EventType, OrganizerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssi", $EventName, $Category, $Description, $Time, $Date, $Location, $ContactPhone, $EventType, $OrganizerID);
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
    $retValue = array("info" => $info, "EventID" => $eventID);
    sendResultInfoAsJson($retValue);
}

?>
