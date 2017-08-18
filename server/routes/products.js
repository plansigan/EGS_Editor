var express         = require('express'),
    router          = express.Router(),
    helperFunction  = require('../config/helperFunction.js');

 //MANI PAGE ROUTE
router.get("/",(req,res)=>{
  res.render('products/index')
})

//View ONE PRODUCT
router.get("/:code/view",(req,res)=>{
  var query = `select * from EgswProduct where Code = ${req.params.code}
  select * from egswClient C
  inner join EgswProductPrice PP on C.code = PP.ClientCode
  where pp.Productcode = ${req.params.code}`;
  helperFunction.executeAndRenderQuery(res,query,"products/show")
})

//EDIT ONE PRODUCT
router.get("/:code/edit",(req,res)=>{
  var query = `select * from EgswProduct where Code = ${req.params.code}
     select * from egswClient C
     inner join EgswProductPrice PP on C.code = PP.ClientCode
     where pp.Productcode = ${req.params.code}`;
  helperFunction.executeAndRenderQuery(res,query,"products/edit")
})

//SAVE EDITED PRODUCT
router.put("/:code",(req,res)=>{
  console.log(req.body)
   var query = `UPDATE EgswProduct set Name = N'${req.body.product.name}',
   --Number = '${req.body.product.number}',
   Supplier = '${req.body.product.supplier}',
   Category = '${req.body.product.category}',
   Brand = '${req.body.product.brand}',
   [Description] = '${req.body.product.description}',
   Declaration = '${req.body.product.declaration}',
   Ingredients = '${req.body.product.ingredients}',
   Preparation = '${req.body.product.preparation}',
   CookingTip = '${req.body.product.cookingTip}',
   Refinement = '${req.body.product.refinement}',
   Storage = '${req.body.product.storage}',
   Productivity = '${req.body.product.productivity}',
   CountryOrigin = '${req.body.product.countryOfOrigin}',
   Attachment = '${req.body.product.attachment}'  ,
   SpecificDetermination = '${req.body.product.specificDetermination}',
   Allergens = '${req.body.product.allergens}',
   Barcode = ${req.body.product.barcode}
   where Code  = ${req.params.code}
   `
   if(req.body.price != undefined){
     for (i = 0; i < req.body.price.ClientCode.length; i++){
       query += `
       update EgswProductPrice
        set Price1 = ${req.body.price.price1[i]},
        Unit1 = 'kg',
        Price2 = ${req.body.price.price2[i]},
        Unit2 = 'kg',
        Price3 = ${req.body.price.price3[i]},
        Unit3 = '',
        Price4 = ${req.body.price.price4[i]},
        Unit4 = '',
        Ratio1 = 1,
        Ratio2 = 0,
        Ratio3 = 0
        where ProductCode = ${req.params.code}
        and ClientCode = ${req.body.price.ClientCode[i]}
       `
     }
   }
   //console.log(query)
   helperFunction.executeandRedirect(req,res,query,`/products`)
})


module.exports = router;
