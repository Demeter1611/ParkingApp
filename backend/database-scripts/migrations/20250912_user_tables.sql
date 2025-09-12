if OBJECT_ID('Roles') is NULL
BEGIN
    CREATE TABLE ROLES(
        id INT PRIMARY KEY IDENTITY(1,1),
        name varchar(50) NOT NULL UNIQUE CHECK(name IN ('admin', 'user', 'moderator'))
    );
    insert into Roles(name) values('admin'), ('user'), ('sala')
END

if OBJECT_ID('Users') is NULL
CREATE TABLE Users(
    id INT PRIMARY KEY IDENTITY (1,1),
    parola VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    roleId INT FOREIGN KEY REFERENCES Roles(id)
)