const userService = require('../services/userService');

const createUser = async (req,res) => {
    
    try{

      const createdUser = await userService.createUser(req.body);

      res.status(201).json({
        status: "sucess",
        data:{
            createdUser
        }
      });

    }catch(err){

        res.status(500).json({
          status:"error",
          data: err.message
        });

    }

};

const findUser = async (req,res) => {
    
    try{

        const user = await userService.findUser(req.params.id); 

        res.status(200).json({
          status: "sucess",
          data:{
             user
          }
        });

    }catch(err){

        res.status(500).json({
          status:"error",
          data: err.message
        });

    }

};

const updateUser = async (req,res) => {
    
    try{

        const userId = req.params.id
        const updates = req.body
        const updatedUser = await userService.updateUser(userId, updates); 

        res.status(200).json({
          status: "sucess",
          data:{
             user: updatedUser
          }
        });

    }catch(err){

        res.status(500).json({
          status:"error",
          data: err.message
        });

    }

};

const deleteUser = async (req,res) =>{

    try{

        const userId = req.params.id;
        await userService.deleteUser(userId);

        res.status(200).json({
            status:"sucess",
            data: null
        })

    }catch(err){

        res.status(500).json({
          status:"error",
          data: err.message
        });

    }

};

module.exports = {
    createUser,
    findUser,
    updateUser,
    deleteUser
};