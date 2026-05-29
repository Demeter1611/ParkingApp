IF OBJECT_iD('Notifications') IS NULL
BEGIN
    CREATE TABLE Notifications (
        id INT PRIMARY KEY IDENTITY(1,1),
        userId INT NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        message VARCHAR(300) NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'info',
        isRead BIT NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END