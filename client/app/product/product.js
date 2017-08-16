var app = angular.module('product',[])

app.controller('productController', function($scope,$http) {

  $scope.sortType = 'name';
  $scope.sortReverse = false;
  $scope.searchProduct = '';

  $scope.search = ()=>{
    $http.get('/products/5000/1/filter/'+$scope.searchName).then((response)=>{
      $scope.data = response.data.Datatable;
    })
  }

  //get all
  $http.get('/products/1000/1/filter/all').then((response)=>{
    $scope.data = response.data.Datatable;
  })

});

app.Controller('productEdit',($scope)=>{
  $scope.zero
})
