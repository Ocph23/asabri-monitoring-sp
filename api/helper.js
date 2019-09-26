function convertJsonDateToMySqlDate(tanggal) {
  try {
    if (tanggal) {
      var date = new Date(tanggal);
      if (date) {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        var res = year + "-" + (month + 1) + "-" + day;
        return res;
      } else {
        throw new Error("Format Tanggal Salah");
      }
    } else {
      throw new Error("Tidak Boleh Kosong");
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

const model = {
  convertJsonDateToMySqlDate: convertJsonDateToMySqlDate
};

module.exports = model;
