angular.module("helper.service",[])
.factory("helperServices",helperServices)
;



function helperServices (message){
    var service={};
   service.url="http://localhost:3000";
   //service.url="https://asabrimonitoring.herokuapp.com";

   service.statusPenerima=["Peserta","Wali"];
    service.bulans=[{Id:0, Name:"Januari"},
      {Id:1, Name:"Februari"},
      {Id:2, Name:"Maret"},
      {Id:3, Name:"April"},
      {Id:4, Name:"Mei"},
      {Id:5, Name:"Juni"},
      {Id:6, Name:"Juli"},
      {Id:7, Name:"Agustus"},
      {Id:8, Name:"September"},
      {Id:9, Name:"Oktober"},
      {Id:10, Name:"November"},
      {Id:11, Name:"Desember"}
    ];
  
    service.spinner=false;

    return {bulans:service.bulans,
      arrayBufferToBase64:arrayBufferToBase64,statusPenerima:service.statusPenerima,url:service.url,
      spinner:service.spinner,errorHandler:errorHandler, asuransi:service.asuransi};



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



