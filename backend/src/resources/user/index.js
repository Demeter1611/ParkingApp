const { sqlRequest } = require('../../db');

module.exports = {
    add: async (password, email, username, role)=>{
        const result = await sqlRequest()
            .input('password', password)
            .input('email', email)
            .input('username', username)
            .input('role', role)
            .query(`
                INSERT INTO Users(password, email, username, roleId)

                select @password as password, @email as email, @username as username, id as roleId
                from Roles
                where name like @role

                select * from Users where email like @email
                `)
        return result.recordset;
    },

    getById : async (id)=>{
        const result = await sqlRequest()
            .input('id', id)
            .query('SELECT Users.id, Users.password, Users.email, Users.username, Users.roleId, Roles.name AS roleName from Users inner join Roles on Roles.id=Users.roleId where Users.id=@id');
        return result.recordset[0];
    },

    search: async (email, password) => {
        const result = await sqlRequest()
            .input('email', email)
            .input('password', password)
            .query('SELECT Users.id, Users.password, Users.email, Users.username, Users.roleId, Roles.name from Users inner join Roles on Roles.id=Users.roleId where password like @password and email like @email ;')
        return result.recordset;
    },

    mailExists: async(email) => {
        const result = await sqlRequest()
            .input('email', email)
            .query('select * from Users where email = @email')
        return result.recordset.length > 0;
    }
}