const { sqlRequest } = require('../../db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const USER_FIELDS = `
        u.id,
        u.email,
        u.username,
        u.carplate
    `


module.exports = {
    add: async (password, email, username, carplate, role) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await sqlRequest()
        .input('password', hashedPassword)
        .input('email', email)
        .input('username', username)
        .input('carplate', carplate)
        .input('role', role)
        .query(`
            INSERT INTO Users(password, email, username, carplate, roleId)
            SELECT @password, @email, @username, @carplate, id FROM Roles WHERE name = @role;
            SELECT u.id, u.email, u.username, u.carplate, u.roleId, r.name
            FROM Users u INNER JOIN Roles r ON r.id = u.roleId WHERE u.email = @email;`);
    return result.recordset;
},

    getById : async (id)=>{
        const result = await sqlRequest()
            .input('id', id)
            .query(`SELECT 
                ${USER_FIELDS}, 
                r.name AS roleName 
                from Users u 
                inner join Roles r
                    on r.id=u.roleId where u.id=@id`);
        return result.recordset[0];
    },

    search: async (email, password) => {
        const result = await sqlRequest()
            .input('email', email)
            .input('password', password)
            .query(`SELECT 
                ${USER_FIELDS}, 
                r.name 
                from Users u 
                inner join Roles r
                    on r.id=u.roleId 
                where password like @password and email like @email ;`)
        return result.recordset;
    },

    mailExists: async(email) => {
        const result = await sqlRequest()
            .input('email', email)
            .query('select * from Users where email = @email')
        return result.recordset.length > 0;
    },

    getByMail: async(email) => {
        const result = await sqlRequest()
        .input('email', email)
        .query(`
            SELECT u.id, u.email, u.username, u.carplate, u.password, u.roleId, r.name
            FROM Users u INNER JOIN Roles r ON r.id = u.roleId WHERE u.email = @email`);
        return result.recordset[0];
    },

    update: async(newInfo) => {
        const result = await sqlRequest()
            .input('id', newInfo.id)
            .input('email', newInfo.email)
            .input('username', newInfo.username)
            .input('carplate', newInfo.carplate)
            .input('password', newInfo.password)
            .query(`
                    UPDATE Users
                    SET
                        email = ISNULL(@email, email),
                        username = ISNULL(@username, username),
                        carplate = ISNULL(@carplate, carplate),
                        password = ISNULL(@password, password)
                    WHERE id = @id
                `);
        if(result.rowsAffected[0] === 0){
            return null;
        }

        const selectResult = await sqlRequest()
            .input('id', newInfo.id)
            .query(`
                    SELECT ${USER_FIELDS},
                        u.password,
                        FROM Users u WHERE id = @id
                `);
        return selectResult.recordset[0];
    },

    getSearchSuggestions: async(searchTerm, parkingLotId = null) => {
        const result = await sqlRequest()
            .input('term', `%${searchTerm}%`)
            .input('parkingLotId', parkingLotId)
            .query(`
                    SELECT TOP 5
                        ${USER_FIELDS},
                        r.name as rolename
                    FROM Users u
                    JOIN Roles r ON u.roleId = r.id
                    WHERE (u.username LIKE @term OR u.email LIKE @term)
                    AND (@parkingLotId IS NULL OR u.id NOT IN (
                            SELECT userId
                            FROM UserParkingAccess
                            WHERE parkingLotId = @parkingLotId
                        )
                    )
                    ORDER BY u.username ASC
                `);
        return result.recordset;
    }
}