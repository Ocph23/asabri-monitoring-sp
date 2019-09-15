angular.module("message.service", []).factory("message", MessageServices);

function MessageServices(swangular, $q) {
  return {
    info: info,
    error: error,
    warning: warning,
    dialog: dialog
  };

  function info(params, titleParam) {
    const title = !titleParam ?
      "Sukses" :
      Number.isInteger(titleParam) ?
      '"' + titleParam + '"' :
      titleParam;

    swangular.swal({
      title: title,
      text: params,
      type: "info"
    });
  }

  function error(params, titleParam) {
    const title = !titleParam ?
      "Error" :
      Number.isInteger(titleParam) ?
      '"' + titleParam + '"' :
      titleParam;

    swangular.swal({
      title: title,
      text: params,
      type: "error"
    });
  }

  function warning(params, titleParam) {
    const title = !titleParam ?
      "Sukses" :
      Number.isInteger(titleParam) ?
      '"' + titleParam + '"' :
      titleParam;
    swangular.swal({
      title: "Sukses",
      text: params,
      type: "warning"
    });
  }

  function dialog(messageText, yesBtn, cancelBtn) {
    var def = $q.defer();
    var yesText = "Ya";
    var cancelText = "Batal";

    if (yesBtn) yesText = yesBtn;

    if (cancelBtn) cancelText = cancelBtn;

    swangular
      .swal({
        title: "Yakin ?",
        text: messageText,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: yesText,
        cancelButtonText: cancelText,
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          def.resolve(result.value);
        } else {
          def.reject(result.value);
        }
      });

    return def.promise;
  }
}