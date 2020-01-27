const express = require('express');

const projectDB = require('../data/helpers/projectModel.js');
const actionsDB = require('../data/helpers/actionModel.js'); 

const router = express.Router();



// get all projects √√ 
router.get('/', (req, res) => {
    projectDB
    .get()
    .then(projects => {
        res.status(200).json(projects);   
    })
    .catch(error => {
    console.log(error);
    res.status(500).json({
        message: 'The projects could not be retreived.' 
    });
    });
});

//get a specific project (id)  √√ 

router.get('/:id', (req, res) => {
    const id = req.params.id; 

    projectDB
    .get(id)
    .then(project => {
        if (id) {
            res.status(200).json(project);
        } else {
            res.status(404).json({
                message: ' No project found with that ID'
            }); 
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: " The project information couldn't be found. "
            });
    });
});


// get project actions   //√√ 

router.get('/:id/actions', (req, res) => {
    const project_id = req.params.id;

    projectDB.getProjectActions(project_id)
        .then(actions => {
            if (project_id) {
                res.status(200).json(actions);
            } else {
                res.status(404).json({
                    message: 'The project with the specific ID does not exist.'
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                message: 'The actions information for the project could not be found.'
            });
        });
}); 


// add a new project   second one good! √√ 

// router.post('/', (res, req) => {
//     const newProject = req.body; 

//     projectDB
//         .insert(newProject)
//         .then(project => {
//             if (newProject.name || newProject.description) {
//                 res.status(201).json(project);
//             } else {
//                 res.status(400).json({
//                     message: 'Please provide name and description for a new project'
//                 });
//             }
//         })
//         .catch(error => {
//             console.log(error);
//             res.status(500).json({
//                 message: 'There was an error while saving the new project.'
//             });
//         }); 
// });

router.post('/', (req, res) => {
    const project = req.body;
    projectDB.insert(project)
    .then(project => {
        if(project) {
            res.status(201).json(project);
        } else {
            res.status(400).json({
                message: ' Please provide a name and description for a new project.'
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json(" There wasn an error while saving your project to the database.");
    });
});


// update a project   √√ 
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;

    projectDB.update(id, body)
    .then(updatedProject => {
        if (!id) {
            res.status(404).json({
                message: ' The project with the specificed ID does not exist.'
            });
        } else if (!updatedProject.name || !updatedProject.description) {
            res.status(400).json({
                message: ' Please provide a name and description for the updated project.'
            });
        } else {
            res.status(200).json({updatedProject});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: ' The project information could not be updated.'
        });
    });
});


//delete  √√ 
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    projectDB.remove(id)
    .then(deletedProject => {
        if (!id) {
            res.status(404).json({
                message: ' The project with the specified ID does not exist.'
            });
        } else {
            res.status(200).json({deletedProject});
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            message: 'The project could not be removed.'
        });
    });
});


// from actionsRouter.js  posting a new action to a project. √√ 
router.post('/:id/actions', validatePost, (req, res) => {
    const actionInfo = req.body;
    actionInfo.project_id = req.params.id; 

    actionsDB.insert(actionInfo)
        .then(action => {
        if(action) {
            res.status(201).json({ action});
        } else {
            res.status(400).json({
                message: ' Please provide a description and note for the new action.'
            });
            }
        })
        .catch(error => {
            console.log(error); 
            res.status(500).json({
                message: ' There was an error while saving the new action.'
            }); 
        });
});

function validatePost(req, res, next) {
    console.log(`req.body: `, req.body);
    if (Object.keys(req.body).length > 0) {
        if (req.body) {
        next();
        } else {
        res
            .status(400)
            .json({ success: false, message: "Missing required text field" });
        }
    } else {
        res.status(400).json({ success: false, message: "Missing post data." });
    }
}; 

module.exports = router; 