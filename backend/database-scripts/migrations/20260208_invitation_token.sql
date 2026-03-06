if OBJECT_ID('InvitationTokens') is NULL
BEGIN
    CREATE TABLE InvitationTokens(
        id INT PRIMARY KEY IDENTITY (1,1),
        token VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL,
        parkingLotId INT FOREIGN KEY REFERENCES ParkingLots(id),
        expiresAt DATETIME2,
        used BIT NOT NULL DEFAULT 0
    )
END