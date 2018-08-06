const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
const courses = [
    {id:1, name: 'course1'},
    {id:2, name:'course2'},
    {id:3, name: 'course3'}
];

app.get('/', (req,res) =>{
    res.send('Helllo artic!!')
});

app.get('/api/course', (req,res) =>{
    res.send(courses);
});

app.get('/api/course/:id',(req,res) =>{
    let course = courses.find(course => course.id == parseInt(req.params.id));
    if(!course) return res.status(404).send('id given not found to show')

    res.send(course)
});

app.post('/api/course', (req,res) =>{
    const schema = {
        name: Joi.string().min(3).required()
    };
    // let result = Joi.validate({name:'abc'} , {name:'abc'})   dia cocokkan apa sama-sama object yg entriesnya sama juga
    let result = Joi.validate(req.body, schema)

        // if result valid:
            //   { error: null,
            // value: { name: 'artic' },
            // then: [Function: then],
            // catch: [Function: catch] }

        // if result invalid:
            // error in obj above will be not null, so we can cek if error/invalid result
    if(result.error) return res.status(400).send(result.error.details[0].message);

    let course = {
        id:courses.length+Math.floor(Math.random()*10+1),
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// put == update in vuejs
app.put('/api/course/:id', (req,res)  =>{
    //find course id
    let course = courses.find(course => course.id == parseInt(req.params.id));
    if(!course) return res.status(404).send('course id not found to update/put');

    // if course id find, check vallidate req.body
    let {error} = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    // if course id find and validate is valid
    // make update course
    course.name = req.body.name;
    res.send(course);
});
app.delete('/api/course/:id', (req,res) =>{
    let course = courses.find(course => course.id == req.params.id);
    if(!course) return res.status(404).send('course id not found to delete')

    let courseDelete = courses.splice(courses.indexOf(course),1);
    res.send(courseDelete);
})

function validateCourse(course){
    let schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

// let result = validateCourse(req.body)
// let error = result.error;
// or
// let {error} = validateCourse(req.body)


const port = process.env.PORT || 3000
app.listen(port, () =>{ console.log(`running in port ${port}`);})
