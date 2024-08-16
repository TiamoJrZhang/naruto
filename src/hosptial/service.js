serviceApp.factory('AppointmentService', [
  '$http',
  '$q',
  '$log',
  'commonFunctions',
  function($http, $q, $log, commonFunctions) {
    var factory = {}

    //预约
    factory.DoAppointment = function(appId, obj) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        withCredentials: true, //必须为true，否则有越权漏洞
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'Appointment',
          params: obj,
        },
      })
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(ex) {
          deferred.reject({
            code: 1,
            message: ex.message,
          })
        })

      return deferred.promise
    }

    //获取预约记录
    factory.MyAppointmentRecord = function(appId, obj) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        withCredentials: true,
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'GetHisAppointmentRecord',
          params: obj,
        },
      })
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(ex) {
          deferred.reject({
            code: 1,
            message: ex.message,
          })
        })

      return deferred.promise
    }

    //松中心、仁济获取预约记录
    factory.GetHisMyAppointmentRecord = function(appId, obj) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        withCredentials: true,
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'GetHisAppointmentRecordByIdCardOfSelectCardNum',
          params: obj,
        },
      })
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(ex) {
          deferred.reject({
            code: 1,
            message: ex.message,
          })
        })

      return deferred.promise
    }

    factory.MyAppointmentRecordByAppUId = function(appId, obj) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        withCredentials: true,
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'GetAppointmentRecordByAppUId',
          params: obj,
        },
      })
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(ex) {
          deferred.reject({
            code: 1,
            message: ex.message,
          })
        })

      return deferred.promise
    }

    factory.MyLocalAppointmentRecordByAppUId = function(appId, obj) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        withCredentials: true,
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'GetLocalAppointmentRecordByAppUId',
          params: obj,
        },
      })
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(ex) {
          deferred.reject({
            code: 1,
            message: ex.message,
          })
        })

      return deferred.promise
    }

    //取消预约
    factory.CancelAppointment = function(appId, obj) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        withCredentials: true,
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'CancelAppointment',
          params: obj,
        },
      })
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(ex) {
          deferred.reject({
            code: 1,
            message: ex.message,
          })
        })

      return deferred.promise
    }

    //根据预约单号与商户号获取一条预约记录
    factory.GetByAppIdAndSerialNumber = function(appId, SerialNumber) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        withCredentials: true,
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'GetByAppIdAndSerialNumber',
          params: [appId, SerialNumber],
        },
      })
        .success(function(data) {
          deferred.resolve(data)
        })
        .error(function(ex) {
          deferred.reject({
            code: 1,
            message: ex.message,
          })
        })

      return deferred.promise
    }
    return factory
  },
])
