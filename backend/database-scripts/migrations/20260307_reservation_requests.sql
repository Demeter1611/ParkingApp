if OBJECT_ID('RequestStatuses') is NULL
BEGIN
    CREATE TABLE RequestStatuses(
        id INT PRIMARY KEY IDENTITY (1,1),
        statusName VARCHAR(30) UNIQUE NOT NULL
    );
    INSERT INTO RequestStatuses(statusName) values('pending'), ('expired'), ('fulfilled')
END

if OBJECT_ID('ReservationRequests') is NULL
BEGIN
    CREATE TABLE ReservationRequests(
        id INT PRIMARY KEY IDENTITY (1,1),
        userId INT FOREIGN KEY REFERENCES Users(id),
        parkingLotId INT FOREIGN KEY REFERENCES ParkingLots(id),
        reason VARCHAR(255),
        requestedDate DATE NOT NULL,
        dateOfRequest DATETIME2 NOT NULL,
        statusId INT FOREIGN KEY REFERENCES RequestStatuses(id)
    )
END
