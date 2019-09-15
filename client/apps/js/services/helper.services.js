angular.module("helper.service",[])
.factory("helperServices",helperServices)
;



function helperServices (message){
    var service={};
    service.url="http://localhost:3000";
    service.spinner=false;

    return {url:service.url,spinner:service.spinner,errorHandler:errorHandler};



    function errorHandler(err){
       message.error(err.data.message,err.status);
    }



}



