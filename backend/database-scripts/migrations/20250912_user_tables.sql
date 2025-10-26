if OBJECT_ID('Roles') is NULL
BEGIN
    CREATE TABLE Roles(
        id INT PRIMARY KEY IDENTITY(1,1),
        name varchar(50) NOT NULL UNIQUE CHECK(name IN ('admin', 'user', 'parking'))
    );
    insert into Roles(name) values('admin'), ('user'), ('parking')
END

if OBJECT_ID('Users') is NULL
CREATE TABLE Users(
    id INT PRIMARY KEY IDENTITY (1,1),
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    roleId INT FOREIGN KEY REFERENCES Roles(id)
)