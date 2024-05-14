const Item = require('../models/item');

module.exports = {};



module.exports.createItem = async(item) => {
  try{
    const itemrecord =  await Item.create(item)
    return itemrecord 
  } catch(e){
    throw(e)
  }
 
}


module.exports.updateItem = async (itemId, item) => {
  
  return await Item.updateOne({ _id:itemId }, item);
}

module.exports.getItems = async() => {
    const allitems = await Item.find({ }); 
    return allitems;
   
}

module.exports.getItemsbyId = async(id) => {
    const item = await Item.findOne({_id:id }).lean(); 
    return item; 
}

