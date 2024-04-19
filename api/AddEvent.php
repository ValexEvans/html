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
$EventType = "";

$conn = new mysqli("localhost", "PHPUSER", "Val21212@S1n2o3w4w", "DB01");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {

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

    // Depending on EventType, insert into respective table
    switch ($EventType) {
        case 'Public':
            $sql = "INSERT INTO Public_Events (EventID, SuperAdminID, UniversityID) 
                    VALUES ('".$EventID."', 1, 1)"; // Assuming SuperAdminID and UniversityID
            break;
        case 'Private':
            $sql = "INSERT INTO Private_Events (EventID, AdminID, UniversityID) 
                    VALUES ('".$EventID."', 1, 1)"; // Assuming AdminID and UniversityID
            break;
        case 'RSO':
            $sql = "INSERT INTO RSO_Events (EventID, RSOID, AdminID, UniversityID) 
                    VALUES ('".$EventID."', 1, 1, 1)"; // Assuming RSOID, AdminID, and UniversityID
            break;
        default:
            echo "Invalid EventType";
    }

    // Execute the respective SQL statement
    if ($conn->query($sql) === TRUE) {
        returnWithInfo("Event added successfully", $EventID);
    } else {
        returnWithError($conn->error);
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

function returnWithInfo($info, $eventID)
{
    $retValue = array("info" => $info, "EventID" => $eventID);
    sendResultInfoAsJson($retValue);
}

?>
