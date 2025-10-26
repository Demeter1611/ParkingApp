if OBJECT_ID('ParkingLots') is NULL
BEGIN
    CREATE TABLE ParkingLots(
        id INT PRIMARY KEY IDENTITY(1, 1),
        name VARCHAR(100) NOT NULL,
        address VARCHAR(300) NOT NULL,

        maxCapacity INT NOT NULL,

        timeslotsEnabled BIT NOT NULL DEFAULT 0,
        sharingEnabled BIT NOT NULL DEFAULT 0,
        temporaryOnlyEnabled BIT NOT NULL DEFAULT 0,
        visitorSpotsEnabled BIT NOT NULL DEFAULT 0,
        simplifiedGridEnabled BIT NOT NULL DEFAULT 0,
        
        userId INT FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE
    );
 END