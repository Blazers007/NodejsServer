/**
 * Created by liang on 2015/6/12.
 */

/* 传建一个controller 为相应的数据填充内容 */

var __status = '申请中';

appModule.controller('appointment-controller', [
    '$scope', function($scope){
        $scope.status = __status
    }
]);