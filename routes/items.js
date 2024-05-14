const { Router } = require("express");
const router = Router();

const tokenDAO = require('../daos/token');
const userDAO = require('../daos/user');
const itemDAO = require('../daos/items')
const isAdmin = require('../middleware/authorization')
const isLoggedIn = require('../middleware/logged_in')


// authentication


router.post("/",isLoggedIn,isAdmin, async (req, res, next) => {
    const items = req.body;
    if ( JSON.stringify(items) === '{}') {
        res.status(400).send('item is required');
    } else {
        try {
            const itemrecord = await itemDAO.createItem(items);
            res.status(200).json(itemrecord);
            }
         catch (error) {
            if (error instanceof userDAO.BadDataError) {
                // Handle specific error types
                return res.status(409).send(error.message); // 409 for duplicate key error
            } else {
                // Handle other errors
                next(error);
            }
            next(error);
        }
    }
});


// update
router.put("/:id",isLoggedIn,isAdmin, async (req, res, next) => {
    const itemid = req.params.id;
    const newitemobject = req.body
    try {
        const updateditem = await itemDAO.updateItem(itemid,newitemobject);
        return res.status(200).json(updateditem);
        
    } catch(error) {
        if (error instanceof userDAO.BadDataError) {
            // Handle specific error types
            return res.status(409).send(error.message); // 409 for duplicate key error
        } else {
            // Handle other errors
            next(error);
        }
    }
});

// get all items

router.get("/",isLoggedIn, async (req, res, next) => {
 
    try {
        const allitems = await itemDAO.getItems();
        return res.status(200).json( allitems);
        
    } catch(error) {
        if (error instanceof userDAO.BadDataError) {
            // Handle specific error types
            return res.status(409).send(error.message); // 409 for duplicate key error
        } else {
            // Handle other errors
            next(error);
        }
    }
});

router.get("/:id",isLoggedIn, async (req, res, next) => {
    const itemid = req.params.id
    try {
        const item = await itemDAO.getItemsbyId(itemid);
        return res.status(200).json(item);
        
    } catch(error) {
        if (error instanceof userDAO.BadDataError) {
            // Handle specific error types
            return res.status(409).send(error.message); // 409 for duplicate key error
        } else {
            // Handle other errors
            next(error);
        }
    }
});

module.exports = router;