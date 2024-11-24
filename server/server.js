//express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//mongodb
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017",{
    dbName : 'Sahakar'
})

.then(()=> {console.log('connected to database');})
.catch((e)=> {console.log('error in connecting to database',e);})

//cors
const cors = require('cors');
const corsOptions = {
    origin : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true, 
};
app.use(cors(corsOptions));


const loginrouter = require('./router/login');
const projectrouter = require('./router/project');
const taskrouter = require('./router/task');
app.use("/",loginrouter)
app.use("/projects",projectrouter);
app.use("/tasks",taskrouter);



// file handling
const multer = require('multer');
const storage = multer.memoryStorage();  // Store files in memory as Buffer
const upload = multer({ storage: storage }).array('files', 10); // Accepts up to 10 files




app.post('/upload', upload, async (req, res) => {
    try {
      if (!req.files) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
  
      const files = req.files;  // Files array sent from frontend
      
      // Store multiple files in the database
      const fileRecords = await Promise.all(files.map(file => {
        const fileRecord = new File({
          fileData: file.buffer,
          contentType: file.mimetype,
          originalName: file.originalname,
          size: file.size,
        });
        return fileRecord.save();
      }));
      
      console.log('files recorded successfully');
      res.status(200).json({ message: 'Files uploaded successfully', files: fileRecords });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'File upload failed', error: error.message });
    }
})




//listen
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})