import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const Port =process.env.Port||5000;

app.listen(Port,()=>{
console.log("server is running on port 5000")
});