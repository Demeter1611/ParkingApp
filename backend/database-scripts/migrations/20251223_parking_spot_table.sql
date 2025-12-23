if OBJECT_ID('ParkingSpots') is NULL
BEGIN
    CREATE TABLE ParkingSpots(
        id INT PRIMARY KEY IDENTITY(1, 1),
        name VARCHAR(100) NOT NULL,
        parkingLotId INT FOREIGN KEY REFERENCES ParkingLots(id) ON DELETE CASCADE
        CONSTRAINT UQ_ParkingLot_Name UNIQUE (parkingLotId, name)
    );
END

