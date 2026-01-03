IF COL_LENGTH('Users', 'carplate') IS NULL
BEGIN
    ALTER TABLE Users
    ADD carplate NVARCHAR(50)
END