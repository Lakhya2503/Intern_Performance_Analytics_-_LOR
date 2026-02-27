import { config } from 'dotenv';
import app from "./app.js";
import { connectDB } from "./db/index.js";

config({path : './.env'})


const PORT = process.env.PORT || 5002
console.log(process.env.PORT);


connectDB().then(()=>{
      app.listen(PORT, ()=>{
          console.log(`app listen on ${PORT}`)
      })
}).catch((error)=>{
      console.log(error.message || ` Something wen't wrong when mongoose server is starting `);
})
