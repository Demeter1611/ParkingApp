if OBJECT_ID('Allocations') is NULL
BEGIN
    CREATE TABLE Allocations(
        id INT PRIMARY KEY IDENTITY(1,1),
        spotId INT UNIQUE FOREIGN KEY REFERENCES ParkingSpots(id) ON DELETE CASCADE,
        userId INT FOREIGN KEY REFERENCES Users(id)
    )
END

IF OBJECT_ID('AvailabilityWindows') IS NULL
BEGIN
    CREATE TABLE AvailabilityWindows(
        id INT PRIMARY KEY IDENTITY(1,1),
        startDate DATE,
        endDate DATE,
        spotId INT FOREIGN KEY REFERENCES ParkingSpots(id) ON DELETE CASCADE,
        userId INT FOREIGN KEY REFERENCES Users(id)
    )
END

if OBJECT_ID('Reservations') IS NULL
BEGIN
    CREATE TABLE Reservations(
        id INT PRIMARY KEY IDENTITY(1,1),
        startDate Date,
        endDate Date,
        spotId INT FOREIGN KEY REFERENCES ParkingSpots(id) ON DELETE CASCADE,
        userId INT FOREIGN KEY REFERENCES Users(id)
    )
END