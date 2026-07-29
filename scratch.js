const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_SxA34gJTotbu@ep-little-wind-avanluy7.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require&options=-c%20search_path=resumeforge' });
client.connect().then(() => {
  client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'resumeforge' AND table_name = 'User';")
    .then(res => { console.log("Columns:", res.rows); client.end(); })
    .catch(err => { console.error(err); client.end(); });
});
