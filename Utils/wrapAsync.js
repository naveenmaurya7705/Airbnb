 //! <--------------Asynchronous Error handling------------------>
 
 //? With Arrow Function
 
  module.exports = (func)=>{
    return  (req, res, next) => {
     func(req, res, next).catch(next);
    };
  }
            //!--------OR --------------
   //? With normal Function
// module.exports = function AsyncWrap(funct){
//    return  function(req, res, next){
//     funct(req, res, next).catch(next);
//    };
//  }
 