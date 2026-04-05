
import express from 'express';
const app = express();
app.get('/api/health',(req,res)=>res.json({status:'ok', day:5}));
app.listen(5000,()=>console.log('Server running'));
