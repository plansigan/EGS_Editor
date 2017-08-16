var localEnvironment = {};

//DECLARATIONS
localEnvironment.tempFolder = './server/temp/'
localEnvironment.csvfn = './server/temp/'+ fs.readdirSync(localEnvironment.tempFolder)[0]

//Connection String
localEnvironment.dbConfig = {
  user:'sa',
  password:'EgsCm2014!',
  server:'Workstation-66',
  database:'CalcmenuSupplierNetwork'
}

module.exports = localEnvironment;
