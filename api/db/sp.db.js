const pool = require('./dbconnection');
const helper = require('../helper');

const db = {};

db.get = () => {
	return new Promise((resolve, reject) => {
		pool.query(
			`
      SELECT
  suratpembayaran.idSuratPembayaran, suratpembayaran.berlakuDariTanggal,
  suratpembayaran.berlakuSampaiTanggal, suratpembayaran.nomorSurat,
  suratpembayaran.kodeBayar, suratpembayaran.jumlah,
  suratpembayaran.idBank,
  suratpembayaran.ktpWali, suratpembayaran.statusPenerima,
  suratpembayaran.namaPenerima, suratpembayaran.noRekening,
  If(IsNull(pembayaran.tanggalBayar), If(Date(Now()) <
  Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
  "terbayar") AS status, jenisasuransi.namaAsuransi,
  jenisasuransi.kodeAsuransi, jenisasuransi.pilihan, suratpembayaran.idjenisAsuransi
FROM
  suratpembayaran LEFT JOIN
  pembayaran ON suratpembayaran.idSuratPembayaran =
    pembayaran.idSuratPembayaran LEFT JOIN
  jenisasuransi ON suratpembayaran.idjenisAsuransi =
    jenisasuransi.idjenisAsuransi;`,
			(err, result) => {
				if (err) reject(err);
				if (result) return resolve(result);
			}
		);
	});
};

db.getById = (id) => {
	return new Promise(async (resolve, reject) => {
		pool.query(
			`SELECT
      suratpembayaran.idSuratPembayaran, suratpembayaran.berlakuDariTanggal,
      suratpembayaran.berlakuSampaiTanggal, suratpembayaran.nomorSurat,
      suratpembayaran.kodeBayar, suratpembayaran.jumlah,
      suratpembayaran.idBank,
      suratpembayaran.ktpWali, suratpembayaran.statusPenerima,
      suratpembayaran.namaPenerima, suratpembayaran.noRekening,
      If(IsNull(pembayaran.tanggalBayar), If(Date(Now()) <
      Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
      "terbayar") AS status, jenisasuransi.namaAsuransi,
      jenisasuransi.kodeAsuransi, jenisasuransi.pilihan,suratpembayaran.idjenisAsuransi
    FROM
      suratpembayaran LEFT JOIN
      pembayaran ON suratpembayaran.idSuratPembayaran =
        pembayaran.idSuratPembayaran LEFT JOIN
      jenisasuransi ON suratpembayaran.idjenisAsuransi =
        jenisasuransi.idjenisAsuransi
      Where suratpembayaran.idSuratPembayaran= ?;`,
			[ id ],
			(err, result) => {
				if (err) return reject(err);
				else return resolve(result[0]);
			}
		);
	});
};

db.getByKodeBayar = (id) => {
	return new Promise(async (resolve, reject) => {
		pool.query(
			`SELECT
      suratpembayaran.idSuratPembayaran, suratpembayaran.berlakuDariTanggal,
      suratpembayaran.berlakuSampaiTanggal, suratpembayaran.nomorSurat,
      suratpembayaran.kodeBayar, suratpembayaran.jumlah,
      suratpembayaran.idBank,
      suratpembayaran.ktpWali, suratpembayaran.statusPenerima,
      suratpembayaran.namaPenerima, suratpembayaran.noRekening,
      If(IsNull(pembayaran.tanggalBayar), If(Date(Now()) <
      Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
      "terbayar") AS status, jenisasuransi.namaAsuransi,
      jenisasuransi.kodeAsuransi,  jenisasuransi.pilihan, suratpembayaran.idjenisAsuransi
    FROM
      suratpembayaran LEFT JOIN
      pembayaran ON suratpembayaran.idSuratPembayaran =
        pembayaran.idSuratPembayaran LEFT JOIN
      jenisasuransi ON suratpembayaran.idjenisAsuransi =
        jenisasuransi.idjenisAsuransi
      Where suratpembayaran.kodeBayar= ?;`,
			[ id ],
			(err, result) => {
				if (err) return reject(err);
				else return resolve(result[0]);
			}
		);
	});
};

db.getByNomorSP = (id) => {
	return new Promise(async (resolve, reject) => {
		pool.query(
			`SELECT
      suratpembayaran.idSuratPembayaran, suratpembayaran.berlakuDariTanggal,
      suratpembayaran.berlakuSampaiTanggal, suratpembayaran.nomorSurat,
      suratpembayaran.kodeBayar, suratpembayaran.jumlah,
      suratpembayaran.idBank,
      suratpembayaran.ktpWali, suratpembayaran.statusPenerima,
      suratpembayaran.namaPenerima, suratpembayaran.noRekening,
      If(IsNull(pembayaran.tanggalBayar), If(Date(Now()) <
      Date(suratpembayaran.berlakuSampaiTanggal), "aktif", "kadaluwarsa"),
      "terbayar") AS status, jenisasuransi.namaAsuransi,
      jenisasuransi.kodeAsuransi, jenisasuransi.pilihan, suratpembayaran.idjenisAsuransi
    FROM
      suratpembayaran LEFT JOIN
      pembayaran ON suratpembayaran.idSuratPembayaran =
        pembayaran.idSuratPembayaran LEFT JOIN
      jenisasuransi ON suratpembayaran.idjenisAsuransi =
        jenisasuransi.idjenisAsuransi
      Where suratpembayaran.nomorSurat= ?;`,
			[ id ],
			(err, result) => {
				if (err) return reject(err);
				else return resolve(result[0]);
			}
		);
	});
};

db.getNasabagByidsp = (id) => {
	return new Promise((resolve, reject) => {
		pool.query('select * from peserta where idSuratPembayaran=?', [ id ], (err, result) => {
			if (err) reject(err);
			if (result) return resolve(result[0]);
		});
	});
};

db.getManfaat = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			`SELECT
      jenismanfaat.idjenisManfaat, jenismanfaat.idjenisAsuransi,
      jenismanfaat.namaManfaat, jenismanfaat.kodeManfaat,
      transaksimanfaat.nilai
    FROM
      transaksimanfaat LEFT JOIN
      jenismanfaat ON transaksimanfaat.idjenisManfaat =
        jenismanfaat.idjenisManfaat where idSuratPembayaran=?;`,
			[ id ],
			(err, result) => {
				if (err) reject(err);
				if (result) return resolve(result);
			}
		);
	});
};

db.insert = (param) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) reject(err);
			connection.beginTransaction((error) => {
				if (error) reject(error);
				connection.query(
					`insert into suratpembayaran (berlakuDariTanggal,berlakuSampaiTanggal,idBank,
              nomorSurat, kodeBayar,jumlah,idjenisAsuransi,namaPenerima,noRekening,statusPenerima) values(?,?,?,?,?,?,?,?,?,?)`,
					[
						param.berlakuDariTanggal,
						param.berlakuSampaiTanggal,
						param.idBank,
						param.nomorSurat,
						param.kodeBayar,
						param.jumlah,
						param.asuransi.idjenisAsuransi,
						param.namaPenerima,
						param.noRekening,
						param.statusPenerima
					],
					(err, result) => {
						if (err) {
							connection.rollback(function() {
								connection.release();
								reject(err);
							});
						}

						if (result && result.insertId > 0) {
							param.idSuratPembayaran = result.insertId;
							param.nasabah.idSuratPembayaran = result.insertId;
							const nas = param.nasabah;
							connection.query(
								`insert into peserta (idSuratPembayaran,nama, pangkat,nomorPeserta, 
                  kodeJiwa,alamat) values(?,?,?,?,?,?)`,
								[
									nas.idSuratPembayaran,
									nas.nama,
									nas.pangkat,
									nas.nomorPeserta,
									nas.kodeJiwa,
									nas.alamat
								],
								(err1, result1) => {
									if (err1) {
										connection.rollback(function() {
											connection.release();
											reject(err1);
										});
									}
									if (result1 && result1.insertId > 0) {
										param.nasabah.idNasabah = result1.insertId;
										param.asuransi.manfaat.forEach((element) => {
											connection.query(
												'insert into transaksimanfaat (idsuratpembayaran, idjenisManfaat, nilai) values(?,?,?) ',
												[ param.idSuratPembayaran, element.idjenisManfaat, element.nilai ],
												(err3, result3) => {
													if (err3) {
														connection.rollback(function() {
															connection.release();
															reject(err3);
														});
													}

													if (result3) {
													}
												}
											);
										});
										connection.commit(function(err) {
											connection.release();
											if (err) {
												reject(err);
											} else {
												return resolve(param);
											}
										});
									}
								}
							);
						}
					}
				);
			});
		});
	});
};

db.update = (param) => {
	return new Promise((resolve, reject) => {
		param.idjenisAsuransi = param.asuransi.idjenisAsuransi;

		pool.getConnection((err, connection, next) => {
			if (err) reject(err);
			connection.beginTransaction((error) => {
				if (error) reject(err);
				connection.query(
					`update suratPembayaran set berlakuDariTanggal=?,berlakuSampaiTanggal=?,idBank=?,
          nomorSurat=?, kodeBayar=?,jumlah=?, namaPenerima=?, noRekening=?, statusPenerima=?, 
          idjenisAsuransi=?, ktpWali=? where idSuratPembayaran=?`,
					[
						param.berlakuDariTanggal,
						param.berlakuSampaiTanggal,
						param.idBank,
						param.nomorSurat,
						param.kodeBayar,
						param.jumlah,
						param.namaPenerima,
						param.noRekening,
						param.statusPenerima,
						param.idjenisAsuransi,
						param.ktpWali,
						param.idSuratPembayaran
					],
					(err, result) => {
						if (err) {
							connection.rollback(function() {
								connection.release();
								reject(err);
							});
						}

						if (result) {
							const nas = param.nasabah;
							connection.query(
								`update peserta set nama=?, pangkat=?,nomorPeserta=?, 
                 kodeJiwa=?, alamat=? where idPeserta=?`,
								[ nas.nama, nas.pangkat, nas.nomorPeserta, nas.kodeJiwa, nas.alamat, nas.idPeserta ],
								(err1, result1) => {
									if (err1) {
										connection.rollback(function() {
											connection.release();
											reject(err1);
										});
									}

									if (result1) {
										connection.query(
											'delete from transaksimanfaat where idsuratpembayaran=?',
											[ param.idSuratPembayaran ],
											(err2, result2) => {
												if (err2) {
													connection.rollback(function() {
														connection.release();
														reject(err2);
													});
												}

												if (result2) {
													param.asuransi.manfaat.forEach((element) => {
														connection.query(
															'insert into transaksimanfaat (idsuratpembayaran, idjenisManfaat, nilai) values(?,?,?) ',
															[
																param.idSuratPembayaran,
																element.idjenisManfaat,
																element.nilai
															],
															(err3, result3) => {
																if (err3) {
																	connection.rollback(function() {
																		connection.release();
																		reject(err3);
																	});
																}

																if (result3) {
																}
															}
														);
													});
													connection.commit(function(err) {
														connection.release();
														if (err) {
															reject(err);
														} else {
															return resolve(param);
														}
													});
												}
											}
										);
									}
								}
							);
						}
					}
				);
			});
		});
	});
};
db.delete = (id) => {
	return new Promise((resolve, reject) => {
		pool.query('delete from suratPembayaran where idSuratPembayaran= ?', [ id ], (err, result) => {
			if (err) {
				return reject(err);
			}

			if (result) {
				return resolve(true);
			}
			return reject('Data Tidak Tersimpan');
		});
	});
};

db.createPembayaran = (param) => {
	return new Promise((resolve, reject) => {
		pool.query(
			`insert into pembayaran (idSuratPembayaran,idMitraBayar,tanggalBayar, nomorBuktiBayar,buktiBayar,idUserMitraBayar)
        values(?,?,?,?,?,?)`,
			[
				param.idSuratPembayaran,
				param.idMitraBayar,
				param.tanggalBayar,
				param.nomorBuktiBayar,
				param.buktiBayar,
				param.idUserMitraBayar
			],
			(err, result) => {
				if (err) {
					return reject(err);
				}
				if (result) {
					return resolve(true);
				}
				return reject('Data Tidak Tersimpan');
			}
		);
	});
};

db.getPembayaran = (id) => {
	return new Promise((resolve, reject) => {
		pool.query('select * from pembayaran where idSuratPembayaran=?', [ id ], (err, result) => {
			if (err) reject(err);
			if (result) return resolve(result[0]);
		});
	});
};

db.laporanTerbayar = () => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err,connection)=>{
			if(err)
			{
				connection.rollback(function() {
					connection.release();
					reject(err);
				});
			}
			connection.query(
				`SELECT
				suratpembayaran.idSuratPembayaran, suratpembayaran.berlakuDariTanggal,
				suratpembayaran.kodeBayar, suratpembayaran.namaPenerima,
				suratpembayaran.idjenisAsuransi, suratpembayaran.jumlah,
				suratpembayaran.nomorSurat, suratpembayaran.ktpWali,
				pembayaran.nomorBuktiBayar, mitrabayar.kode AS kodeMitraBayar,
				mitrabayar.nama AS namaMitraBayar, peserta.nama,
				pembayaran.tanggalBayar, bank.nama AS namaBank, bank.kodeBank,
				jenisasuransi.pilihan
			  FROM
				suratpembayaran LEFT JOIN
				pembayaran ON suratpembayaran.idSuratPembayaran =
				  pembayaran.idSuratPembayaran LEFT JOIN
				mitrabayar ON pembayaran.idMitraBayar = mitrabayar.idMitraBayar
				LEFT JOIN
				peserta ON suratpembayaran.idSuratPembayaran =
				  peserta.idSuratPembayaran LEFT JOIN
				bank ON mitrabayar.idBank = bank.idBank LEFT JOIN
				jenisasuransi ON suratpembayaran.idjenisAsuransi =
				  jenisasuransi.idjenisAsuransi where pembayaran.tanggalBayar is not null;`,
				(err, result) => {
					if (err) 
						{
							connection.rollback(function() {
								connection.release();
								reject(err);
							});
						}
					if (result) {
						result.forEach((x) => {
							connection.query(`SELECT
							jenismanfaat.idjenisManfaat, jenismanfaat.idjenisAsuransi,
							jenismanfaat.namaManfaat, jenismanfaat.kodeManfaat,
							transaksimanfaat.nilai
						  FROM
							transaksimanfaat LEFT JOIN
							jenismanfaat ON transaksimanfaat.idjenisManfaat =
							  jenismanfaat.idjenisManfaat where idSuratPembayaran=?;`, [x.idSuratPembayaran], (err1, result1) => {
								if (err) 
								{
									connection.rollback(function() {
										connection.release();
										reject(err);
									});
								}else{
									x.manfaat=result1;
									x.jumlah=x.manfaat.reduce((a,b)=>{
										return a+ b['nilai'];
									},0);
								}
								  
							  });
						});
						connection.commit(function(err) {
							connection.release();
							if (err) {
								reject(err);
							} else {
								return resolve(result);
							}
						});
					}
				}
			);
		})
	});
};

module.exports = db;
