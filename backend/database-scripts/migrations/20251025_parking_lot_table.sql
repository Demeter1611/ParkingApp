if OBJECT_ID('ParkingLots') is NULL
BEGIN
    CREATE TABLE ParkingLots(
        id INT PRIMARY KEY IDENTITY(1, 1),
        name VARCHAR(100) NOT NULL,
        address VARCHAR(300) NOT NULL,
        
        userId INT FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE
    );
 END