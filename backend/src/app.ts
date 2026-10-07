import  express , { Application ,Request,Response } from "express";
import cors from 'cors';

const app:Application=express();

app.use(cors());
app.use(express.json());

app.get('/helth',(req:Request,res:Response)=>
    {res.status(200).json(
        {
            staus:'ok',
            message:'sever operational h'

        }
    )});

    export default app;