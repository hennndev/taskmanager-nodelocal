const express = require('express')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const router = express.Router()
const uuidV4 = uuid.v4

router.get('/', (req, res) => {
    const tasksData = fs.readFileSync('./data/tasks.json', 'utf-8')
    const parseData = JSON.parse(tasksData)
    res.render('home', { title: 'Homepage', data: parseData})
})
router.post('/api/tasks', (req, res) => {
    try {
        const tasksJSON = fs.readFileSync('./data/tasks.json', 'utf-8')
        const parseTasks = JSON.parse(tasksJSON)
        parseTasks.push({
            id: uuidV4(),
            tasks: [],
            ...req.body
        })
        fs.writeFile('./data/tasks.json', JSON.stringify(parseTasks), (err) => {
            if(err) {
                console.log(err)
            } else {
                console.log('Success create new tasks')
            }
        })
        res.status(201).json({
            message: 'Success create new tasks'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: 'Failed create new tasks'
        })
    }
})
router.delete('/api/tasks/:tasksId', (req, res) => {
    try {
        const tasksJSON = fs.readFileSync('./data/tasks.json', 'utf-8')
        const parseTasks = JSON.parse(tasksJSON)
        const filteredTasks = parseTasks.filter(tasks => tasks.id !== req.params.tasksId)
        fs.writeFileSync('./data/tasks.json', JSON.stringify(filteredTasks))
        res.status(201).json({
            message: 'Success delete tasks'
        })
    } catch (error) {
        res.status(400).json({
            error: 'Failed delete tasks'
        })
    }
})
router.post(`/api/tasks/:tasksId`, (req, res) => {
    try {
        const tasksJSON = fs.readFileSync('./data/tasks.json', 'utf-8')
        const parseTasks = JSON.parse(tasksJSON)
        const getTasks = parseTasks.findIndex(tasks => tasks.id === req.params.tasksId)
        parseTasks[getTasks].tasks.push({
            id: uuidV4(),
            task: req.body.task,
            date: new Date()
        })
        fs.writeFileSync('./data/tasks.json', JSON.stringify(parseTasks))
        res.status(201).json({
            message: 'Success create new task'
        })
    } catch (error) {
        res.status(400).json({
            error: 'Failed create new task'
        })
    }
})
router.delete('/api/tasks/:tasksId/:taskId', (req, res) => {
    try {
        const tasksJSON = fs.readFileSync('./data/tasks.json', 'utf-8')
        let parseTasks = JSON.parse(tasksJSON)
        let filteredTasks = parseTasks.map(tasks => {
            if(tasks.id === req.params.tasksId) {
                return {
                    ...tasks,
                    tasks: tasks.tasks.filter(task => task.id !== req.params.taskId)
                }
            } else {
                return tasks
            }
        })

        fs.writeFileSync('./data/tasks.json', JSON.stringify(filteredTasks))
        res.status(200).json({
            message: 'Success delete task'
        })
    } catch (error) {
        res.status(400).json({
            error: 'Failed delete task'
        })
    }
})

module.exports = router