var helperFunction    = {},
    sql               = require('mssql'),
    _                 = require('lodash'),
    csvHeaders        = require('csv-headers'),
    parse             = require('csv-parse')
    leftpad           = require('leftpad'),
    fs                = require('fs'),
    flash             = require("connect-flash"),
    util              = require('util')
    localEnvironment  = require('./localEnvironment.js');

const async   = require('async');

helperFunction.executeandRedirect = (req,res,query,page)=>{
  sql.connect(localEnvironment.dbConfig,(err)=>{
    if(err){
      req.flash("error","Error Connecting to Database" + err)
      console.log("Error whilteconnecting to database:- " + err );
      res.send(err)
    } else {
      var request = new sql.Request();
      request.query(query,(err,result)=>{
        if(err){
          req.flash("error","Error while querying database:- " + err)
          sql.close()
          console.log("Error while querying database:- " + err);
          res.send(err);
        } else {
          req.flash('success',"Product saved!")
          res.redirect(page)
          sql.close()
        }
      })
    }
  })
}


helperFunction.executeAndRenderQuery = (res,query,page)=>{
  sql.connect(localEnvironment.dbConfig,(err)=>{
    if(err){
      console.log("Error while connecti ng database:- " + err);
      sql.close()
      res.send(err);
    } else {
      //create Request Object
      var request = new sql.Request();
      //query to the database
      request.query(query).then((err,result=>{
        if(err){
          console.log('Error while querying database- ' + err)
        } else {
          data= _.concat(result.recordsets)
          console.log(data)
          res.render(page,{data});
          sql.close()
        }
      })).catch(err=>{
          res.status(500).send({message:`${err}`})
          sql.close();
        })
    }
  })
}

helperFunction.executeAndResponseQueryToJSON = (res,query)=>{
  sql.connect(localEnvironment.dbConfig,(err)=>{
    if(err){
      console.log("Error while connecting database:- " + err);
      sql.close()
      res.send(err);
    } else {
      //create Request Object
      var request = new sql.Request();
      //query to the database
      request.query(query,(err,result)=>{
        if(err) {
          console.log("Error while querying database:- " + err);
          sql.close()
          res.send(err);
        } else {
          Datatable = _.concat(result.recordsets)
          res.json({Datatable});
          console.log(result.recordsets)
          sql.close()
        }
      })
    }
  })
}

helperFunction.csvTodb = (req,res,csvfn,dbConfig)=>{
  new Promise((resolve,reject)=>{
    csvHeaders({
      file:csvfn,
      delimiter:','
    },(err,headers)=>{
      if(err){
        console.log(err)
        reject(err);
      } else {
        resolve({headers});
      }
    });
  })
  .then(context=>{
    return new Promise((resolve,reject)=>{
      context.db = new sql.ConnectionPool(localEnvironment.dbConfig);
      context.db.connect((err)=>{
        if(err){
          console.error('error connecting:'+ err.stack);
          sql.close()
          reject(err);
        } else {
          resolve(context);
          console.log('connection successful to '+ context.db.config.database)
          //console.log(util.inspect(context.db, false, null))
        }
      });
    })
  })
  .then(context => {
      return new Promise((resolve, reject) => {
          fs.createReadStream(csvfn).pipe(parse({
              delimiter: ',',
              columns: true,
              relax_column_count: true
          }, (err, data) => {
              if (err) return reject(err);
              async.eachSeries(data, (datum, next) => {
                  //console.log(datum)
                  // console.log(`about to run INSERT INTO ${tblnm} ( ${context.fieldnms} ) VALUES ( ${context.qs} )`);
                  // var obj = JSON.stringify(datum,undefined,2)
                  const Code = new sql.ConnectionPool(context.db.config,err=>{
                    Code.request()
                      .query(`select code from EgswProduct where Number = ${datum.Number}`,(err,result)=>{
                        //declare selected product code
                        datum.code = result.recordset[0].code;
                        //console.log(datum.code);

                        const UpdateQuery = new sql.ConnectionPool(context.db.config,err=>{
                          UpdateQuery.request()
                            .query(`UPDATE EgswProduct set Name = N'${datum.Name}',
                            Supplier      = '${datum.Supplier}',
                            Category      = '${datum.Category}',
                            Description   = '${datum.Description}',
                            Ingredients   = '${datum.Ingredients}',
                            Preparation   = '${datum.Preparation}',
                            Refinement    = '${datum.Refinement}',
                            Storage       = '${datum.Storage}',
                            Productivity  = '${datum.Productivity}'
                            where Number  = ${datum.Number}`,(err,result)=>{
                              if(result){
                                console.log(`rows Affected : ${result.rowsAffected}`)
                                req.flash('success','Database Updated!')
                                res.redirect('/')
                              } else {
                                console.log(err)
                              }
                            })
                            .query(`
                              if exists(select top 1 * from EgswProductPrice where ProductCode = ${datum.code} and ClientCode = 1)
                              begin
                                Update EgswProductPrice set
                                ProductCode=${datum.code},
                                ClientCode=1,
                                Price1='${datum.Price1}',
                                Price2='${datum.Price2}',
                                Price3='${datum.Price3}',
                                Unit1='${datum.Unit1}',
                                Unit2='${datum.Unit2}',
                                Unit3='${datum.Unit3}',
                                Unit4='${datum.Unit4}',
                                Ratio1='${datum.Ratio1}',
                                Ratio2='${datum.Ratio2}',
                                LastUpdated=GETDATE() where ProductCode = ${datum.code} and ClientCode = 1
                              end
                              else
                                begin
                                  select * from EgswProduct where number = 6
                                end
                            `,(err,result)=>{
                              if (err){
                                console.log(err)
                                //console.log('wow')
                              } else {
                                //console.log('wow2')
                                console.log(result)
                              }
                            })
                      })
                  })
                      // .query(`Update EgswProductPrice set `)
                  })
              },
              err => {
                  if (err) reject(err);
                  else resolve(context);
              });
          }));
      });
  })
  .then(context => { context.db.end(); })
  .catch(err => { console.error(err.stack); });

}

module.exports = helperFunction;
