const express = require('express');

const actionsDB = require('../data/helpers/actionModel.js');

const router = express.Router();

// get all actions √√ 

router.get('/', (req, res) => {
    actionsDB
    .get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(error =>{
    console.log(error);
    res.status(500).json({
        message: 'Actions could not be retrieved.'
    });
    });
});

// get specifc action √√ 
router.get('/:id', (req, res) =>{
    const id = req.params.id;

    actionsDB.get(id)
    .then(action =>{
        if (id) {
            res.status(200).json(action);
        } else {
            res.status(404).json({
                message: ' No action found with that ID.'
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: ' The action information could not be found.'
        });
    });
});

// make a new action  √√  Works in projectRouter.js but not here. 
//      taking it into the id of project #! and adding to it's actions.

// router.post('/:id/actions', (req, res) => {
//     const actionInfo = req.body;
//     actionInfo.project_id = req.params.id; 

//     actionsDB.insert(actionInfo)
//         .then(action => {
//         if(action) {
//             res.status(201).json({ action});
//         } else {
//             res.status(400).json({
//                 message: ' Please provide a description and note for the new action.'
//             });
//             }
//         })
//         .catch(error => {
//             console.log(error); 
//             res.status(500).json({
//                 message: ' There was an error while saving the new action.'
//             }); 
//         });
// });


// update an action 

// router.put(':/id', (req, res) =>{
//     const id = req.params.id;
//     const body = req.body; 

//     actionsDB.update(id, body)
//     .then(actions =>{
//         if (!id) {
//             res.status(404).json({
//                 message: 'The action with the specified ID does not exist.'
//             })
//         } else if(id) {
//         res.status(400).json({
//             message: ' Please provide a description and notes to update the action.'
//         });
//         } else {
//             res.status(200).json({ actions });
//         }
//     })
//     .catch(error =>{
//         console.log(error);
//         res.status(500).json({
//             message: ' The action information could not be updated.'
//         });
//     });
// });

router.put('/:id', (req, res) => {
    const changes = req.body;
    const {id} = req.params;
    if(!changes.name && !changes.description && !changes.completed) {
        res.status(400).json({message: 'You must specify a name, a description, or mark this action completed.'})
    } else {
        actionsDB.update(id, changes)
            .then(updated => {
                if(updated === null) {
                    res.status(404).json({message: `An action with the id#${id} was not found.`})
                } else {
                    res.status(200).json(updated);
                }
            })
            .catch(err => {
                res.status(500).json({ message: 'We were unable to update the action.', err })
            })
    }
})



// delete √√ 

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    actionsDB.remove(id)
    .then(deletedAction =>{
        if (!id) {
            res.status(404).json({
                message: ' The action with the specific ID does not exist.'
            });
        } else {
            res.status(200).json({ deletedAction });
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            message: ' The action could not be removed.'
        });
    });
});




module.exports = router; 