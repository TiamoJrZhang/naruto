serviceApp.factory('DoctorService', [
  '$http',
  '$q',
  '$log',
  'commonFunctions',
  function($http, $q, $log, commonFunctions) {
    var factory = {}

    //专家列表
    factory.GetPageList = function(appId, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/HisDoctor?AppId=' + appId,
        data: {
          method: 'GetPageList',
          params: [query],
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

    //获取专家列表
    factory.GetLocalDoctorList = function(appId, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/HisDoctor?AppId=' + appId,
        data: {
          method: 'GetList',
          params: [query],
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

    //分页获取专家列表(有排班的专家)
    factory.GetPageDoctorList = function(appId, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Scheduling?AppId=' + appId,
        data: {
          method: 'GetPageSchedulingDoctorList',
          params: [query],
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

    //获取专家列表(有排班的专家)
    factory.GetDoctorList = function(appId, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Scheduling?AppId=' + appId,
        data: {
          method: 'GetSchedulingDoctorList',
          params: [query],
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

    factory.GetHisDoctorList = function(appId, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Scheduling?AppId=' + appId,
        data: {
          method: 'GetHisSchedulingDoctorList',
          params: [query],
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

    factory.GetDoctorInfo = function(appId, DeptCode, WorkNum) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/HisDoctor?AppId=' + appId,
        data: {
          method: 'GetDoctorInfo',
          params: [appId, DeptCode, WorkNum],
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

    //AppId,DoctorWorkNum, Date, EndDate,CurrentPage,PageSize
    factory.GetDoctorAppointmentList = function(appId, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Appointment?AppId=' + appId,
        data: {
          method: 'GetDoctorAppointmentInfo',
          params: query,
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

    //更新点赞状态
    factory.GetLikesChange = function(query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(query.AppId) + '/api/portal/communication?AppId=' + query.AppId,
        data: {
          method: 'GetLikesChange',
          params: [query],
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

    //20190117:医生列表新增接口(郑州儿童页面根据数量显示'有号'、'无号').
    factory.GetDoctorSourceList = function(appId, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Scheduling',
        data: {
          method: 'GetDoctorSourceList',
          params: [query],
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

    //url相同的接口封装起来-api/appointment/Scheduling.
    factory.GetAppointmentSchedule = function(appId, method, query) {
      var deferred = $q.defer()
      $http({
        method: 'post',
        url: commonFunctions.getAPIUrl(appId) + '/api/appointment/Scheduling?AppId=' + appId,
        data: {
          method: method,
          params: [query],
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
