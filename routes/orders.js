const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();

const orderDAO = require('../daos/order');
const isLoggedIn = require('../middleware/logged_in')


router.post("/", isLoggedIn, async (req, res, next) => {
    const items_values = req.body;
    if (JSON.stringify(items_values) === '{}') {
      res.status(400).send('no items in body');
    } 
    else {
      try {
        const orderrecord = await orderDAO.createItem(items_values, req.user._id);
        res.json(orderrecord);
      } catch (error) {
          if (error.message.startsWith("Item not found for itemId")) {
            res.status(400).send(error.message); // Send 400 error with custom error message
          } else{
            res.status(500).send("Internal Server Error"); // Send a generic error message for other types of errors
          }
          }
    }
  });


// get
router.get("/",isLoggedIn, async (req, res, next) => {
    let user;
    let orders;
    try {
           
            if (req.user.roles.includes('admin')) {
                orders = await orderDAO.getOrders(user);
            } else {
                orders = await orderDAO.getOrders(req.user._id);
            }
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
});


//get
router.get("/:id",isLoggedIn, async (req, res, next) => {
    const orderid = req.params.id;
    const user = req.user
    let order;
    try {
            order = await orderDAO.getOrdersbyId(orderid, user)
            if(order){
                return res.status(200).json(order);
            }
    } catch(error) {
      if (error.message.startsWith("The user with someone else's order")) {
        res.status(404).send(error.message); // Send 400 error with custom error message
      }
        next(error)
    }

});



module.exports = router;