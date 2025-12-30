if OBJECT_ID('UserParkingAccess') is NULL
BEGIN
    CREATE TABLE UserParkingAccess(
        userId INT NOT NULL,
        parkingLotId INT NOT NULL,
        CONSTRAINT PK_UserParkingAccess PRIMARY KEY (userId, parkingLotId),

        CONSTRAINT FK_UserAccess_User FOREIGN KEY (userId)
            REFERENCES Users(id) ON DELETE CASCADE,
        
        CONSTRAINT FK_UserAccess_ParkingLot FOREIGN KEY (parkingLotId)
            REFERENCES ParkingLots(id) ON DELETE NO ACTION
    )
END