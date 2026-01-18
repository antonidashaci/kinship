const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.yhltmeogiqnqtmdptrxz:EmreRael072507*-@aws-1-eu-west-3.pooler.supabase.com:5432/postgres';

async function applySchema() {
    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to Supabase database.');

        const sqlFile = path.join(__dirname, '004-feature-schema.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('Applying schema...');
        await client.query(sql);
        console.log('Schema applied successfully!');
    } catch (err) {
        console.error('Error applying schema:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

applySchema();
