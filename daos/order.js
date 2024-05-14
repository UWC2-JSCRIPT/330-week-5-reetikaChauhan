const Order = require('../models/order');
const Item =  require('../models/item');

module.exports = {};



module.exports.createItem = async (items, userId) => {
    try {
        let total = 0;
        for (const itemId of items) {
            const item = await Item.findOne({ _id: itemId }).lean();
            if (item) {
                total += item.price;
            }
            else {
                throw new Error(`Item not found for itemId: ${itemId}`);
              }
           
        }
        const orderRecord = await Order.create({ items: items, total: total, userId: userId });
        return orderRecord;
    } catch (error) {
        throw error;
    }
};

module.exports.getOrders = async(user) => {
    let allorders
    if(user){
         allorders = await Order.find({userId:user }).lean(); 
    }
    else{
         allorders = await Order.find({ }).lean(); 
    }
   
    return allorders;
   
} 

module.exports.getOrdersbyId = async(id,user) => {
    let order = ""
    let result ;
    try{
        order = await Order.findOne({_id:id }).lean(); 
        let itemsarray = []
        let items = order.items
        const orderuserId = order.userId.toString()
        if (orderuserId === user._id || user.roles.includes("admin")){
            for (const itemid of items) {
                const item = await Item.findOne({ _id: itemid }).lean();
                if (item) {
                    itemsarray.push({title:item.title, price:item.price})
                }
            }
            result = {"items":itemsarray, "total":order.total, "userId":order.userId}
            return result ; 
        }
        else{
            throw new Error("The user with someone else's order")
        }
    }catch(e){
        throw e
    }
    
}


  