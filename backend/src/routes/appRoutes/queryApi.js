const express = require('express');
const router = express.Router();
const queryController = require('@/controllers/appControllers/queryController');
const { catchErrors } = require('@/handlers/errorHandlers');

router.get('/queries/list', catchErrors(queryController.list));
router.get('/queries/listAll', catchErrors(queryController.list));
router.get('/queries/:id', catchErrors(queryController.read));
router.get('/queries', catchErrors(queryController.list));
router.post('/queries', catchErrors(queryController.create));
router.patch('/queries/:id', catchErrors(queryController.update));
router.post('/queries/:id/notes', catchErrors(queryController.addNote));
router.delete('/queries/:id/notes/delete/:noteId', catchErrors(queryController.deleteNote));

module.exports = router;
