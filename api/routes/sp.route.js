const express = require("express");
const router = express.Router();
const db = require("../db");

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
    if(!id)
        throw new Error("Data Tidak Ditemukan");
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
        if(!id)
        throw new Error("Data Tidak Ditemukan")
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
    const bank = req.body;
    db.SP.insert(bank).then(
      data => {
        res.status(200).json(data);
      },
      err => {
        res.status(500).json(err);
      }
    );
  } catch (error) {
    res.status(200).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const body = req.body;
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

module.exports = router;
