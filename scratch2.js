const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://neondb_owner:npg_SxA34gJTotbu@ep-little-wind-avanluy7.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require' });
client.connect().then(() => {
  client.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'User';")
    .then(res => { console.log("Public Columns:", res.rows); client.end(); })
    .catch(err => { console.error(err); client.end(); });
});
