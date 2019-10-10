const { zip,of, from} =require('../../node_modules/rxjs');
const {groupBy, mergeMap, toArray} = require('../../node_modules/rxjs/operators');
var pool = require('./dbconnection');
var db = {};

db.get = () => {
	return new Promise((resolve, reject) => {
		pool.query(
			`SELECT
        jenisasuransi.idjenisAsuransi, jenisasuransi.namaAsuransi,jenisasuransi.pilihan,
        jenisasuransi.kodeAsuransi, jenismanfaat.idjenisManfaat,
        jenismanfaat.namaManfaat, jenismanfaat.kodeManfaat
      FROM
        jenisasuransi LEFT JOIN
        jenismanfaat ON jenisasuransi.idjenisAsuransi =
          jenismanfaat.idjenisAsuransi;`,
			(err, result) => {
				if (err) {
					return reject(err);
        }
        

        const mainResult=[];

        const source = from(result);
        const example = source.pipe(
          groupBy(as => as.kodeAsuransi,p=> p),
          mergeMap(group => zip(of(group.key), group.pipe(toArray())))
        );
        example.subscribe(x=>{
          const xHead=x[1][0];
		  const head={idjenisAsuransi:xHead.idjenisAsuransi,namaAsuransi:xHead.namaAsuransi,kodeAsuransi:xHead.kodeAsuransi,
			pilihan:xHead.pilihan,manfaat:[]};
          x[1].forEach(x=>{
              if(x.kodeManfaat)
			  head.manfaat.push({idjenisManfaat:x.idjenisManfaat, idjenisAsuransi:x.idjenisAsuransi, 
				namaManfaat:x.namaManfaat,kodeManfaat:x.kodeManfaat, nilai:0});
			});

          mainResult.push(head);
        })
        return resolve(mainResult);
			}
		);
	});
};

db.getById = (id) => {
	return new Promise((resolve, reject) => {
		pool.query(
			`SELECT
        jenisasuransi.idjenisAsuransi, jenisasuransi.namaAsuransi,jenisasuransi.pilihan,
        jenisasuransi.kodeAsuransi, jenismanfaat.idjenisManfaat,
        jenismanfaat.namaManfaat, jenismanfaat.kodeManfaat
      FROM
        jenisasuransi LEFT JOIN
        jenismanfaat ON jenisasuransi.idjenisAsuransi =
          jenismanfaat.idjenisAsuransi where idjenisasuransi=?;`,[id],
			(err, result) => {
				if (err) {
					return reject(err);
        }
        const mainResult=[];
        const source = from(result);
        const example = source.pipe(
          groupBy(as => as.kodeAsuransi,p=> p),
          mergeMap(group => zip(of(group.key), group.pipe(toArray())))
        );
        example.subscribe(x=>{
          const xHead=x[1][0];
		  const head={idjenisAsuransi:xHead.idjenisAsuransi,namaAsuransi:xHead.namaAsuransi,kodeAsuransi:xHead.kodeAsuransi,
			pilihan:xHead.pilihan,manfaat:[]};
          x[1].forEach(x=>{
              if(x.kodeManfaat)
                head.manfaat.push({idjenisManfaat:x.idjenisManfaat, idjenisAsuransi:x.idjenisAsuransi, namaManfaat:x.namaManfaat,kodeManfaat:x.kodeManfaat, nilai:0});
          });

          mainResult.push(head);
        })
        return resolve(mainResult[0]);
			}
		);
	});
};

db.insertAsuransi = (param) => {
	return new Promise((resolve, reject) => {
		pool.query('insert into jenisAsuransi (namaAsuransi,kodeAsuransi,pilihan) values(?,?,?)', 
		[ param.namaAsuransi, param.kodeAsuransi,param.pilihan ], (err, result) => {
			if (err) {
				return reject(err);
			}

			if (result.insertId > 0) {
				param.idjenisAsuransi = result.insertId;
				return resolve(param);
			}
			return reject('Data Tidak Tersimpan');
		});
	});
};


db.insertManfaat = (param) => {
	return new Promise((resolve, reject) => {
    pool.query('insert into jenisManfaat (idjenisAsuransi,namaManfaat,kodeManfaat) values(?,?,?)', 
    [ param.idjenisAsuransi, param.namaManfaat, param.kodeManfaat ], (err, result) => {
			if (err) {
				return reject(err);
			}

			if (result.insertId > 0) {
				param.idjenisManfaat = result.insertId;
				return resolve(param);
			}
			return reject('Data Tidak Tersimpan');
		});
	});
};

db.updateAsuransi = (param) => {
	return new Promise((resolve, reject) => {
		pool.query(
			'update jenisAsuransi set namaAsuransi=?,kodeAsuransi=?, pilihan=? where idjenisAsuransi=?',
			[ param.namaAsuransi, param.kodeAsuransi,param.pilihan, param.idjenisAsuransi ],
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



db.updateManfaat = (param) => {
	return new Promise((resolve, reject) => {
		pool.query(
			'update jenisManfaat set idjenisAsuransi=?, namaManfaat=?,kodeManfaat=? where idjenisManfaat=?',
			[ param.idjenisAsuransi,param.namaManfaat, param.kodeManfaat, param.idjenisManfaat ],
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

db.deleteAsurnasi = (id) => {
	return new Promise((resolve, reject) => {
		pool.query('delete from jenisAsuransi where idjenisAsuransi= ?', [ id ], (err, result) => {
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



db.deleteManfaat = (id) => {
	return new Promise((resolve, reject) => {
		pool.query('delete from jenisManfaat where idjenisManfaat= ?', [ id ], (err, result) => {
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

module.exports = db;
