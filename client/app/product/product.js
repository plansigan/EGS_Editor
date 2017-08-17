var app = angular.module('product',[]);

app.controller('productController',($scope,$http)=>{

  //modal initialization
  $('.inputSearch').popup({
    on: 'focus'
  });
  $('.viewPage').modal({
    closeable:true
  });

  $scope.sortType = 'name';
  $scope.sortReverse = false;
  $scope.searchProduct = '';
  $scope.closeModal = ()=>{
    $('#viewPage').modal('hide')
  }

  //open modal on click list
  $scope.openViewModal = (newCode)=>{
    $http.get('/products/' + newCode + '/json/view').then((response)=>{
      $scope.dataView = response.data.Datatable;
      $('#viewPage').modal('show')
    })
  };

  //search product
  $scope.search = ()=>{
    $http.get('/products/5000/1/filter/'+$scope.searchName).then((response)=>{
      $scope.data = response.data.Datatable[0];
    })
  }
  //get all
  $http.get('/products/500/1/filter/all').then((response)=>{
    $scope.data = response.data.Datatable[0];
  })
});
