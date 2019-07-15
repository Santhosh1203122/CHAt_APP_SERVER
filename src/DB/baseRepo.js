"use strict";
const pool = require('./pool');

class BaseRepo {
    
    async getConnection() {
        return await pool.createConnection();
    }

    async usingConnection(fn) {
        const conn = await this.getConnection();
        try {
            return await fn(conn);
        } finally {
            // this.closeConnection(conn);
        }
    }

    async closeConnection(conn) {
        if (conn) {
            conn.close();
        }
    }

    async executeQuery(query, args) {
        return await this.usingConnection(async (conn) => {
            const [result] = await conn.query(query, args);
            return result;
        })
    }
}

module.exports = BaseRepo;