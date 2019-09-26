const express = require("express");
const router = express.Router();
const db = require("../db");
const helper = require("../helper");

router.get("/", async (req, res) => {
  try {
    const data = await db.SP.get();
    data.forEach(async element => {
      element.nasabah = await db.SP.getNasabagByidsp(element.idSuratPembayaran);
      element.pembayaran = {};
    });
    setTimeout(x => {
      res.status(200).json(data);
    }, 3000);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    var id = req.params["id"];
    if (!id) throw new Error("Data Tidak Ditemukan");
    const data = await db.SP.getById(id);
    data.nasabah = await db.SP.getNasabagByidsp(data.idSuratPembayaran);
    setTimeout(x => {
      res.status(200).json(data);
    }, 2000);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/kodebayar/:kodebayar", async (req, res) => {
  try {
    var id = req.params["kodebayar"];
    const data = await db.SP.getByKodeBayar(id);
    if (data) {
      data.nasabah = await db.SP.getNasabagByidsp(data.idSuratPembayaran);
      setTimeout(x => {
        res.status(200).json(data);
      }, 2000);
    } else {
      throw new Error("Data Tidak Ditemukan");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/nomorsp", async (req, res) => {
  try {
    var id = req.body.nomor;
    if (!id) throw new Error("Data Tidak Ditemukan");
    const data = await db.SP.getByNomorSP(id);
    if (data) {
      data.nasabah = await db.SP.getNasabagByidsp(data.idSuratPembayaran);
      setTimeout(x => {
        res.status(200).json(data);
      }, 2000);
    } else {
      throw new Error("Data Tidak Ditemukan");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = ValidateSP(req.body);
    db.SP.insert(body).then(
      respon => {
        res.status(200).json(respon);
      },
      err => {
        res.status(400).json({ message: err.message });
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = ValidateSP(req.body);
    const id = req.params["id"];
    if (body.status != "terbayar") {
      db.SP.update(body).then(
        data => {
          res.status(200).json({
            data: data
          });
        },
        err => {
          res.status(500).json(err);
        }
      );
    } else {
      throw new Error("Data Telah Terbayarkan, Tidak Dapat Diubah");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    db.SP.delete(id).then(
      result => {
        if (result) {
          res.status(200).json({
            data: result
          });
        }
      },
      err => {
        res.status(400).json({
          message: "Data Tidak Terhapus"
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.post("/pembayaran", async (req, res) => {
  try {
    const body = ValidatePembayaran(req.body);
    db.SP.createPembayaran(body).then(
      respon => {
        res.status(200).json(respon);
      },
      err => {
        res.status(400).json({ message: err.message });
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/pembayaran/:id", async (req, res) => {
  try {
    var id = req.params["id"];
    if (!id) throw new Error("Data Tidak Ditemukan");
    const data = await db.SP.getPembayaran(id);
    setTimeout(x => {
      res.status(200).json(data);
    }, 2000);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/laporanterbayar/:id", async (req, res) => {
  try {
    const data = await db.SP.laporanTerbayar();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function ValidatePembayaran(param) {
  try {
    param.tanggalBayar = helper.convertJsonDateToMySqlDate(param.tanggalBayar);
    return param;
  } catch (err) {
    throw new Error(err.message);
  }
}

function ValidateSP(param) {
  try {
    if (
      !param.berlakuSampaiTanggal ||
      !param.berlakuDariTanggal ||
      !param.idBank ||
      !param.nomorSurat ||
      !param.kodeBayar ||
      !param.jumlah ||
      !param.status ||
      !param.nasabah
    )
      throw new Error("Lengkapi Data Surat Pembayaran");

    if (
      !param.nasabah.nama ||
      !param.nasabah.pangkat ||
      !param.nasabah.nomorPeserta ||
      !param.nasabah.tanggalLahir ||
      !param.nasabah.tanggalSKEP ||
      !param.nasabah.tanggalPensiun ||
      !param.nasabah.kodeJiwa ||
      !param.nasabah.alamat
    )
      throw new Error("Lengkapi Data Nasabah");

    if (param.berlakuDariTanggal >= param.berlakuSampaiTanggal)
      throw new Error("Tanggal Berlaku Dari Harus Lebih Kecil");

    if (param.jumlah <= 0)
      throw new Error("Jumlah Bayar Harus Lebih Besar Dari Nol ");

    param.berlakuDariTanggal = helper.convertJsonDateToMySqlDate(
      param.berlakuDariTanggal
    );
    param.berlakuSampaiTanggal = helper.convertJsonDateToMySqlDate(
      param.berlakuSampaiTanggal
    );
    param.nasabah.tanggalLahir = helper.convertJsonDateToMySqlDate(
      param.nasabah.tanggalLahir
    );
    param.nasabah.tanggalSKEP = helper.convertJsonDateToMySqlDate(
      param.nasabah.tanggalSKEP
    );
    param.nasabah.tanggalPensiun = helper.convertJsonDateToMySqlDate(
      param.nasabah.tanggalPensiun
    );
    return param;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = router;
