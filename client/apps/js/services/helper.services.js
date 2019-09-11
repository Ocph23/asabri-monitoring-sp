angular.module("helper.service",[])
.factory("helperServices",helperServices)
;



function helperServices (){
    var service={};
    service.url="http://localhost:5501";

    return {url:service.url};
}