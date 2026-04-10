
import express from 'express';
const app = express();
app.get('/api/health',(req,res)=>res.json({status:'ok', day:12}));
app.listen(5000,()=>console.log('Server running'));
