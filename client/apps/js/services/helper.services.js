angular.module("helper.service",[])
.factory("helperServices",helperServices)
;



function helperServices (message){
    var service={};
   //service.url="http://localhost:3000";
   service.url="https://asabrimonitoring.herokuapp.com";

   service.asuransi=["JP","UKP","THT"];
   service.statusPenerima=["Peserta","Wali"];

  
    service.spinner=false;

    return {arrayBufferToBase64:arrayBufferToBase64,statusPenerima:service.statusPenerima,url:service.url,spinner:service.spinner,errorHandler:errorHandler, asuransi:service.asuransi};



    function errorHandler(err){
       message.error(err.data.message,err.status);
    }

    function arrayBufferToBase64(buffer) {
      let binary = '';
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return binary;
    }

}



