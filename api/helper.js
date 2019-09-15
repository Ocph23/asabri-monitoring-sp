
function convertJsonDateToMySqlDate (tanggal){
    if (tanggal) {
      var date = new Date(tanggal);
      var day = date.getDay();
      var month = date.getMonth();
      var year = date.getFullYear();
      var res= year + "-" + (month+1) + "-" + day;
      return res;
    }
    return null;
  }


const model={
    convertJsonDateToMySqlDate:convertJsonDateToMySqlDate
}


module.exports=model;