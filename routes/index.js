const { Router } = require("express");
const router = Router();

router.use((err,req,res,next) => {
    if(err.message.includes("Cast to ObjectId failed")){
        res.status(400).send("Invalid id provided")
    } else{
        console.error(err)
        res.status(500).send("Something broke!")
    }
});
router.use("/auth", require('./auth'));
router.use("/items", require('./items'));
router.use("/orders", require('./orders'));


module.exports = router;
