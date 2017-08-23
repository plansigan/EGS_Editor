var express         = require('express'),
    router          = express.Router(),
    helperFunction  = require('../config/helperFunction.js');

 //MAIN PAGE ROUTE
router.get("/",(req,res)=>{
  res.render('products/index')
})

//SAVE EDITED PRODUCT
router.post("/:code",(req,res)=>{
   var query = `UPDATE EgswProduct set Name = N'${req.body[0][0].Name}',
   --Number = '${req.body[0][0].Number}',
   Supplier = '${req.body[0][0].Supplier}',
   Category = '${req.body[0][0].Category}',
   Brand = '${req.body[0][0].Brand}',
   [Description] = '${req.body[0][0].Description}',
   Declaration = '${req.body[0][0].Declaration}',
   Ingredients = '${req.body[0][0].Ingredients}',
   Preparation = '${req.body[0][0].Preparation}',
   CookingTip = '${req.body[0][0].CookingTip}',
   Refinement = '${req.body[0][0].Refinement}',
   Storage = '${req.body[0][0].Storage}',
   Productivity = '${req.body[0][0].Productivity}',
   CountryOrigin = '${req.body[0][0].CountryOfOrigin}',
   Attachment = '${req.body[0][0].Attachment}'  ,
   SpecificDetermination = '${req.body[0][0].SpecificDetermination}',
   Allergens = '${req.body[0][0].Allergens}',
   Barcode = ${req.body[0][0].Barcode}
   where Code  = ${req.params.code}
   `
   if(req.body[1] != undefined){
     for (i = 0; i < req.body[1].length; i++){
       query += `
       update EgswProductPrice
        set Price1 = ${req.body[1][i].Price1},
        Unit1 = 'kg',
        Price2 = ${req.body[1][i].Price2},
        Unit2 = 'kg',
        Price3 = ${req.body[1][i].Price3},
        Unit3 = '',
        Price4 = ${req.body[1][i].Price4},
        Unit4 = '',
        Ratio1 = 1,
        Ratio2 = 0,
        Ratio3 = 0
        where ProductCode = ${req.params.code}
        and ClientCode = ${req.body[1][i].ClientCode}
       `
     }
   }
  //  console.log(query)
   helperFunction.executeQuery(req,res,query,`/products`)
})


module.exports = router;
