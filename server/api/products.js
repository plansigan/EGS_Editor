var express         = require('express'),
    router          = express.Router(),
    helperFunction  = require('../config/helperFunction.js');

//Since we don't have any SP for EGS PIM (for Nodejs) I just created one here.

//GET All item in json
router.get("/:skip/:take/filter/all",(req,res)=>{
  var query = ` SELECT TOP (ISNULL(${req.params.skip},10)) *
                FROM (
                  SELECT RowNum = ROW_NUMBER() OVER (ORDER BY Name),Code,Number,Name,Supplier,Category,LastUpdated
                  FROM egswProduct ) P
                WHERE RowNum > (ISNULL(${req.params.skip},10)-1) * ISNULL(${req.params.take},10)
                ORDER BY Name`;
  helperFunction.executeAndResponseQueryToJSON(res,query);
})

//GET SEARCHED item in json
router.get("/:skip/:take/filter/:name?",(req,res)=>{
if(req.params.name == ''){
  var query = ` SELECT TOP (ISNULL(${req.params.skip},10)) *
                FROM (
                	SELECT RowNum = ROW_NUMBER() OVER (ORDER BY Name),Code,Number,Name,Supplier,Category,LastUpdated
                	FROM egswProduct ) P
                WHERE RowNum > (ISNULL(${req.params.skip},10)-1) * ISNULL(${req.params.take},10)
                ORDER BY Name`;
} else {

  var query = ` SELECT TOP (${req.params.skip}) *
                FROM (
                  SELECT RowNum = ROW_NUMBER() OVER (ORDER BY Name),Code,Number,Name,Supplier,Category,LastUpdated
                  FROM egswProduct ) P
                WHERE Name LIKE '%${req.params.name}%'
                OR Number LIKE '%${req.params.name}%'
                OR Supplier LIKE '%${req.params.name}%'
                OR Category LIKE '%${req.params.name}%'
                ORDER BY Name`;
}
  helperFunction.executeAndResponseQueryToJSON(res,query);
})

//View ONE PRODUCT in json
router.get("/:code/json/view",(req,res)=>{
  var query = `select * from EgswProduct where Code = ${req.params.code}
  select * from egswClient C
  inner join EgswProductPrice PP on C.code = PP.ClientCode
  where pp.Productcode = ${req.params.code}`;
  helperFunction.executeAndResponseQueryToJSON(res,query)
})

//EDIT ONE PRODUCT in json
router.get("/:code/json/edit",(req,res)=>{
  var query = `select * from EgswProduct where Code = ${req.params.code}
  select * from egswClient C
  inner join EgswProductPrice PP on C.code = PP.ClientCode
  where pp.Productcode = ${req.params.code}`;
  helperFunction.executeAndResponseQueryToJSON(res,query)
})


module.exports = router;
