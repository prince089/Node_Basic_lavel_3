const express = require('express')
const mg = require('mongoose')
const app = express()

app.use(express.json())

app.use(express.static(__dirname))
mg.connect('mongodb://127.0.0.1:27017/admin')

const conn = mg.connection
conn.on('connected',()=>{
    console.log("Connected")
})

const taskSchema = new mg.Schema({
    TaskId:Number,
    TaskName:String,
    TaskStatus:String
})

const Task = mg.model('tasks', taskSchema);

app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/index.html')
})  
app.get('/api/tasks',(req,res)=>{
    Task.find().then((data)=>{
        res.json(data)
    })
})
  
  
app.post('/api/tasks',(req,res)=>{
    Task.create({
        TaskId:req.body.TaskId,
        
        TaskName:req.body.TaskName,
        
        TaskStatus:req.body.TaskStatus,
    }).then((newData)=>{
        res.json(newData)
    })
})
  
//   app.put('/api/tasks/:taskId', (req, res) => {
//     let id = req.params.taskId
//     const updatedItem = req.body
//     Task.findByIdAndUpdate({TaskId:id}).then((err,data)=>{
//        res.json(data)
//     })
// })

app.put('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { TaskId, TaskName, TaskStatus} = req.body;
  
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        { TaskId, TaskName, TaskStatus },
        { new: true } // Return the updated task
      );
  
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
    
      
  
  app.delete('/api/tasks/:taskId', (req, res) => {
    const { taskId } = req.params;
    
    Task.deleteOne({_id: taskId}).then((err,data)=>{
    res.json(data)
    })
  });

  
  
  app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });