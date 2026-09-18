/* One-time repair for the baseline originally marked applied as an empty file.
 * Compare its table definitions against production before updating metadata.
 * No resume, user, or payment rows are changed. */
require('dotenv').config({quiet:true});
const { Client }=require('pg');
const fs=require('node:fs');
const crypto=require('node:crypto');
(async()=>{
  const client=new Client({connectionString:process.env.DATABASE_URL}); await client.connect();
  try {
    await client.query('BEGIN');
    const {rows}=await client.query("SELECT checksum FROM resumeforge._prisma_migrations WHERE migration_name='00000000000000_baseline' AND finished_at IS NOT NULL FOR UPDATE");
    const sql=fs.readFileSync('prisma/migrations/00000000000000_baseline/migration.sql','utf8');
    const checksum=crypto.createHash('sha256').update(sql).digest('hex');
    if(rows[0]?.checksum===checksum) { await client.query('ROLLBACK'); console.log('Baseline already matches.'); return; }
    if(rows[0]?.checksum!==crypto.createHash('sha256').update('').digest('hex')) throw new Error('Unexpected baseline checksum; manual audit required');
    await client.query('SAVEPOINT validate_baseline');
    const temporary='baseline_check_'+crypto.randomBytes(6).toString('hex');
    await client.query(sql.replaceAll('"resumeforge"',`"${temporary}"`));
    const columns=await client.query("SELECT table_schema,table_name,column_name,data_type,udt_name,is_nullable FROM information_schema.columns WHERE table_schema IN ($1,'resumeforge') AND table_name IN ('User','Resume')",[temporary]);
    const expected=columns.rows.filter(r=>r.table_schema===temporary);
    for(const col of expected) {
      const actual=columns.rows.find(r=>r.table_schema==='resumeforge'&&r.table_name===col.table_name&&r.column_name===col.column_name);
      if(!actual || ['data_type','udt_name','is_nullable'].some(k=>actual[k]!==col[k])) throw new Error(`Baseline differs at ${col.table_name}.${col.column_name}`);
    }
    const labels=await client.query("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid=pg_type.oid JOIN pg_namespace n ON pg_type.typnamespace=n.oid WHERE n.nspname='resumeforge' AND pg_type.typname='Plan' ORDER BY enumsortorder");
    if(JSON.stringify(labels.rows.map(r=>r.enumlabel))!==JSON.stringify(['FREE','PRO'])) throw new Error('Plan enum differs');
    await client.query('ROLLBACK TO SAVEPOINT validate_baseline');
    if(process.argv.includes('--repair')) {
      await client.query("UPDATE resumeforge._prisma_migrations SET checksum=$1 WHERE migration_name='00000000000000_baseline'",[checksum]);
      await client.query('COMMIT'); console.log(`Verified ${expected.length} baseline columns and Plan enum; repaired only the baseline checksum.`);
    } else { await client.query('ROLLBACK'); console.log(`Verified ${expected.length} baseline columns and Plan enum. Run with --repair to reconcile metadata.`); }
  } catch(e) { await client.query('ROLLBACK'); throw e; } finally { await client.end(); }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
