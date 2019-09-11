angular.module("bank.service", [])

    .factory("BankService", BankService)


    ;



    function BankService($q)
    {

        var instance=false;
        var datas=[{idBank:1,kode:"0001",nama:"Bank Mandiri"}];
        get();

        function get(){
            var def = $q.defer();

            if(instance)
            {
                def.resolve(datas)
            }else{
                def.resolve(datas);
            }

            return def.promise;
        }


        function post(data)
        {
            var def = $q.defer();

            if(true)
            {
                  datas.push(data);  
                  def.resolve(data);
            }else{
                def.resolve(datas);
            }
            return def.promise;
        }


        function put(data)
        {
            var def = $q.defer();
            var dataInCollection=datas.find(x=>x.idBank==data.idBank);
            if(dataInCollection)
            {
                dataInCollection.nama=data.nama;
                dataInCollection.kode=data.kode;
                  def.resolve(data);
            }else{
                def.resolve(datas);
            }
            return def.promise;
        }


        function remove(data){
            var def = $q.defer();
            try {
                var index = datas.indexOf(data);
                datas.splice(index,1);
                def.resolve(true);
            } catch (error) {
                def.reject(error);
            }
            return def.promise;
        }



        return {
            get:get, post:post, put:put, remove:remove
        }

    }

