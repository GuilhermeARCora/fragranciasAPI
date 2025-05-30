const userService = require('../services/userService');

const createOne = async (req,res) => {
    
    try{

      const created = await userService.createOne(req.body);

      res.status(201).json({
        status: "sucess",
        data:{
            created
        }
      });

    }catch(err){

        res.status(500).json({
          status:"fail",
          data: err.message
        });

    }

};

const findOne = async (req,res) => {
    
    try{

        const found = await userService.findOne(req.params.id); 

        res.status(200).json({
          status: "sucess",
          data:{
             found
          }
        });

    }catch(err){

        res.status(500).json({
          status:"fail",
          data: err.message
        });

    }

};

const findAll = async (req,res) => {

  try{

      const data = await userService.findAll(req.query);    

      res.status(200).json({
        status: 'success',
        results: data.length,
        data: {
          data
        }
      });

  }catch (err) {

    res.status(500).json({
      status: 'fail',
      message: err.message || 'Internal server error'
    });

  }

};

const updatePatch = async (req,res) => {
    
    try{

        const updated = await userService.updatePatch(req.params.id, req.body); 

        res.status(200).json({
          status: "sucess",
          data:{
              updated
          }
        });

    }catch(err){

        res.status(500).json({
          status:"fail",
          data: err.message
        });

    }

};

const deleteOne = async (req,res) =>{

    try{

        await userService.deleteOne(req.params.id);

        res.status(200).json({
            status:"sucess",
            data: null
        })

    }catch(err){

        res.status(500).json({
          status:"fail",
          data: err.message
        });

    }

};

module.exports = {
    createOne,
    updatePatch,
    deleteOne,
    findOne,
    findAll
};