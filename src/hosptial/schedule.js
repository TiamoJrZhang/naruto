app.controller('DoctorSchedulingsCtrl', function(
  $scope,
  $http,
  $state,
  $stateParams,
  $filter,
  commonFunctions,
  ConfigService,
  RegisterTypeService,
  SchedulingService,
  PubFn,
) {
  $scope.AppId = $stateParams.AppId
  $scope.RegisterType = $stateParams.RegisterType
  $scope.AppointmentType = $stateParams.AppointmentType
  $scope.SpecialType = $stateParams.SpecialType
  $scope.IsIntroduce = $stateParams.IsIntroduce
  $scope.showLoading = false

  $scope.DocGoSchedule = sessionStorage.getItem($scope.AppId + 'DocGoSchedule')
    ? JSON.parse(sessionStorage.getItem($scope.AppId + 'DocGoSchedule'))
    : ''
  // console.log($scope.DocGoSchedule);
  if ($scope.DocGoSchedule) {
    $scope.ParentCode = $scope.DocGoSchedule.ParentCode
    $scope.DeptCode = $scope.DocGoSchedule.DeptCode
    $scope.DeptName = $scope.DocGoSchedule.DeptName //从上个页面传过来的'科室名称'.
    $scope.DoctorWorkNum = $scope.DocGoSchedule.DoctorWorkNum
  }
  // 健康云新版仁济登录
  if (PubFn.getParamsByName('JKYCode')) {
    $scope.ParentCode = $stateParams.ParentCode
    $scope.DeptCode = $stateParams.DeptCode
    $scope.DeptName = $stateParams.DeptName //从上个页面传过来的'科室名称'.
    $scope.DoctorWorkNum = $stateParams.DoctorWorkNum
    PubFn.JKYLogin($scope.AppId)
  }
  let currentAccount = localStorage.getItem('currentAccount' + $scope.AppId)
    ? JSON.parse(localStorage.getItem('currentAccount' + $scope.AppId))
    : ''
  // console.log(currentAccount);
  $scope.SeletedCard = sessionStorage.getItem($scope.AppId + 'SeletedCardInfo')
    ? JSON.parse(sessionStorage.getItem($scope.AppId + 'SeletedCardInfo'))
    : ''
  // console.log($scope.SeletedCard);
  let RelatedId = ''
  if ($scope.SeletedCard && $scope.SeletedCard.RelatedId) {
    RelatedId = $scope.SeletedCard.RelatedId
  }

  $scope.Enter = $stateParams.Enter //20201225:互联网直接专家预约。是否为互联网医院进入标识.
  if ($scope.Enter && $scope.Enter == 'internet') {
    $scope.ParentCode = $stateParams.ParentCode
    $scope.DeptCode = $stateParams.DeptCode
    $scope.DeptName = $stateParams.DeptName //从上个页面传过来的'科室名称'.
    $scope.DoctorWorkNum = $stateParams.DoctorWorkNum
    if (!currentAccount) {
      initLogin()
    }
  }

  $scope.currentDate = moment().format('YYYY-MM-DD') + '  ' + commonFunctions.getWeekDay(new Date())
  $scope.PbDate = moment().format('YYYY-MM-DD')
  $scope.PbEndDate = moment()
    .add('d', 30)
    .format('YYYY-MM-DD')

  if ($scope.AppointmentType == 'off') {
    //挂号.
    $scope.PbEndDate = moment().format('YYYY-MM-DD') //查询排班接口 结束日期为当天.
    GetRegisterConfig() //获取挂号配置、预约挂号类型、专家排班.
  } else {
    //预约.
    LoadRegTypes() //获取预约挂号类型、专家排班(预约不需要获取挂号配置).
  }
  $scope.isTest = sessionStorage.getItem('isTest' + $scope.AppId)
    ? JSON.parse(sessionStorage.getItem('isTest' + $scope.AppId))
    : false

  function initLogin() {
    $scope.showLoading = true
    commonFunctions.login($scope.AppId).then(
      function(res) {
        $scope.showLoading = false
        if (!res || !res.data || res.data.code != 0) {
          var errmsg =
            res && res.data && res.data.error && res.data.error.message
              ? res.data.error.message
              : '请重新打开页面并等待加载完毕'
          layer.alert(errmsg, function(index) {
            layer.close(index)
          })
        } else {
          //登录成功,建立会话成功.
          currentAccount = {
            AppUId: res.data.result.AppUId,
            Origin: res.data.result.Origin,
          }
          localStorage.setItem('currentAccount' + $scope.AppId, JSON.stringify(currentAccount))
        }
      },
      function(err) {
        $scope.showLoading = false
      },
    )
  }

  // 跳转到肿瘤中心
  $scope.pushTumorCenter = function() {
    $state.go('TumorCenterList', {
      AppId: $scope.AppId,
      AppointmentType: $scope.AppointmentType,
      RegisterType: $scope.RegisterType,
    })
  }

  function GetRegisterConfig() {
    $scope.showLoading = true
    ConfigService.GetRegisterConfigNew($scope.AppId, [$scope.AppId, $scope.DeptCode]).then(
      function(rsp) {
        $scope.showLoading = false
        if (rsp && rsp.code == '0') {
          $scope.IsRegister = rsp.result.IsRegister
          $scope.RegisterConfig = rsp.result
          LoadRegTypes()
        } else {
          var errorMsg = rsp.error.message
          layer.msg('获取挂号时间失败，' + errorMsg)
        }
      },
      function(err) {
        console.log(err)
        $scope.showLoading = false
      },
    )
  }

  function LoadRegTypes() {
    $scope.IsStaff = false //默认不是职工 false.
    RegisterTypeService.GetAll($scope.AppId).then(
      function(rsp) {
        //console.log("挂号类型-GetAll："+JSON.stringify(rsp));
        if (rsp && rsp.code == '0') {
          $scope.RegTypeList = rsp.result
        }
        if ($scope.RegisterType == 'off' && RelatedId && (currentAccount.Origin == 1 || currentAccount.Origin == 2)) {
          //预约.
          CheckStaff() //职工目前只有预约.
        } else {
          //没有获取到卡 RelatedId 的(如：第三方接入链接,按非职工处理).
          loadScheduling()
        }
      },
      function(err) {
        console.log(err)
      },
    )
  }

  //是否职工.
  function CheckStaff() {
    $scope.showLoading = true
    let RSARelatedId = RSAEncrypt($scope.AppId, RelatedId)
    let params = [RSARelatedId, $scope.AppointmentType]
    SchedulingService.SchedulingSameUrl($scope.AppId, 'CheckSpecialSource', params).then(
      function(data) {
        $scope.showLoading = false
        if (data && data.code == 0 && data.result) {
          //true 职工，false 不是职工.
          $scope.IsStaff = data.result
        }
        loadScheduling()
      },
      function(err) {
        $scope.showLoading = false
        console.log(err)
      },
    )
  }

  // 获取普通排班
  function loadScheduling() {
    var params = {
      AppId: $scope.AppId,
      DoctorWorkNum: $scope.DoctorWorkNum,
      DeptCode: $scope.DeptCode,
      RegisterType: $scope.RegisterType,
      Date: $scope.PbDate,
      EndDate: $scope.PbEndDate,
      AppointmentType: $scope.AppointmentType,
    }
    if ($scope.IsStaff) {
      params.Origin = $scope.GetStaffOrigin() //职工查询排班接口新增入参 Origin.
    }
    if ($scope.SpecialType) {
      params.SpecialType = $scope.SpecialType
    }
    $scope.showLoading = true
    SchedulingService.GetSchedulings($scope.AppId, params).then(
      function(data) {
        $scope.showLoading = false
        if (data && data.code == 0) {
          $scope.doctor = data.result.Doctor
          $scope.appointmentSchedulingList = data.result.AppointmentScheduling ? data.result.AppointmentScheduling : []
          $scope.outSchedulingList = data.result.OutScheduling ? data.result.OutScheduling : []
          $scope.appointmentSchedulings = []
          // CheckDoctorTeam();
          // 预约逻辑
          if ($scope.RegisterType == 'off' && $scope.appointmentSchedulingList.length > 0) {
            $scope.appointmentSchedulings = groupBy($scope.appointmentSchedulingList, ['HosCode', 'RegTypeCode'])
            // 获取精准预约排班, 仅开放微信渠道
            if (currentAccount && currentAccount.Origin == 1) {
              getAccurateScheduling()
            } else {
              // 非微信渠道，展示出普通预约已满
              $scope.appointmentSchedulings.map(item => {
                item.AppointArr.map(o => (o.isShow = true))
              })
            }
            // console.log($scope.appointmentSchedulings);
          }

          // 挂号逻辑
          if ($scope.AppointmentType == 'off') {
            console.log($scope.outSchedulingList)
            let registerDate = $filter('filter')($scope.outSchedulingList, {Groups: moment().format('YYYY-MM-DD')})
            // console.log(registerDate);
            if (registerDate && registerDate.length > 0) {
              let regDataDetail = registerDate[0].Schedulings
              // console.log(regDataDetail);
              $scope.outScheduling = deArray(
                regDataDetail.map(function(p) {
                  return {
                    HosCode: p.HosCode,
                    RegTypeCode: p.RegTypeCode,
                    WorkDate: p.WorkDate,
                    RegisterArr: regDataDetail.filter(function(m) {
                      // IsRegister 的值为1--允许挂号，值为0-不允许数据展示，即不可挂号.
                      return p.HosCode == m.HosCode && p.RegTypeCode == m.RegTypeCode && p.IsRegister == '1'
                    }),
                  }
                }),
                'HosCode',
                'RegTypeCode',
              )
            }
            console.log($scope.outScheduling)
          }
        } else {
          layer.msg(data.error.message)
        }
      },
      function(err) {
        $scope.showLoading = false
        console.log(err)
      },
    )
  }
  // 根据医生工号判断医生是否具有团队属性
  function CheckDoctorTeam() {
    $scope.showLoading = true
    $http({
      url: commonFunctions.getAPIUrl($scope.AppId) + '/api/appointment/Appointment?AppId=' + $scope.AppId,
      method: 'POST',
      withCredentials: true,
      data: {
        method: 'CheckDoctorTeam',
        params: [
          {
            AppId: $scope.AppId,
            DoctorWorkNumber: $scope.doctor.DoctorWorkNum,
          },
        ],
      },
    }).success(res => {
      $scope.showLoading = false
      if (res.code == 0) {
        console.log(res.result)
        if (res.result && res.result.length > 0) {
          $scope.showDoctorTeamBtn = true
          $scope.doctorTeamList = res.result
        }
      } else {
        layer.msg(res.error.message)
      }
    })
  }
  // 把对象数据按照某几个属性keys进行分类
  // keys可以传一个数组
  function groupBy(objectArray, keys = []) {
    var c = []
    var d = {}
    let newObjectArray = []
    for (let i = 0, len = objectArray.length; i < len; i++) {
      const Schedulings = objectArray[i].Schedulings
      newObjectArray = [...newObjectArray, ...Schedulings]
    }
    for (var element of newObjectArray) {
      let element_keyStr = ''
      let element_key = []
      let element_keyObj = {}
      element.weekday = commonFunctions.getWeekDay(element.Date)
      // 判断预约已满逻辑
      element.isAppointFull = element.CanAppointment <= 0 ? true : false
      element.isShow = element.isAppointFull ? false : true
      for (var key of keys) {
        element_key.push(element[key])
        element_keyObj[key] = element[key]
      }
      element_keyStr = element_key.join('_')
      if (!d[element_keyStr]) {
        c.push({
          ...element_keyObj,
          AppointArr: [element],
        })
        d[element_keyStr] = element
      } else {
        for (var ele of c) {
          let isTrue = keys.some(key => {
            return ele[key] != element[key]
          })
          if (!isTrue) {
            ele.AppointArr.push(element)
          }
        }
      }
    }
    return c
  }
  function deArray(array, key, key2) {
    var newArr = []
    //遍历当前数组
    for (let i = 0, len = array.length; i < len; i++) {
      const item = array[i]
      let arr = newArr.filter(p => {
        return p[key] == item[key] && p[key2] == item[key2]
      })
      if (arr.length == 0) {
        newArr.push(item)
      }
    }
    return newArr
  }

  //获取精准预约排班
  function getAccurateScheduling() {
    $scope.showLoading = true
    var params = {
      AppId: $scope.AppId,
      DoctorWorkNum: $scope.DoctorWorkNum,
      DeptCode: $scope.DeptCode,
      RegisterType: $scope.RegisterType,
      Date: $scope.PbDate,
      EndDate: $scope.PbEndDate,
      AppointmentType: $scope.AppointmentType,
      Origin: '114',
    }
    SchedulingService.GetSchedulings($scope.AppId, params).then(({code, result}) => {
      if (code == 0 && result && result.AppointmentScheduling.length > 0) {
        // console.log(result);
        // 当查询到精准预约排班数据
        let accurateSchedulingList = result.AppointmentScheduling
        let accurateSchedulingArr = accurateSchedulingList.length > 0 ? accurateSchedulingList : null
        if (accurateSchedulingArr) {
          // console.log(accurateSchedulingArr);
          // console.log($scope.appointmentSchedulings);
          accurateSchedulingArr.forEach(accurateObj => {
            $scope.appointmentSchedulings.map(eleAppoint => {
              let accurateDetail = []
              // console.log(eleAppoint.AppointArr);
              for (let index = 0; index < eleAppoint.AppointArr.length; index++) {
                const item = eleAppoint.AppointArr[index]
                // 当预约已满，筛选出精准预约
                if (item.isAppointFull && item.Date == accurateObj.Groups) {
                  let accurateFilterDetail = accurateObj.Schedulings.filter(obj => {
                    if (
                      obj.StartTime == item.StartTime &&
                      obj.EndTime == item.EndTime &&
                      item.HosCode == obj.HosCode &&
                      item.RegTypeCode == obj.RegTypeCode
                    ) {
                      obj.isAccurate = true
                      obj.isShow = true
                      item.isShow = false
                      obj.weekday = commonFunctions.getWeekDay(obj.Date)

                      if (obj.CanAppointment <= 0) {
                        obj.isAppointFull = true
                      } else {
                        obj.isAppointFull = false
                      }
                      return true
                    }
                    return false
                  })
                  // console.log(accurateFilterDetail);
                  accurateDetail = [...accurateDetail, ...accurateFilterDetail]
                }
              }
              // console.log(accurateDetail);
              eleAppoint.AppointArr = [...eleAppoint.AppointArr, ...accurateDetail]
            })
          })
          console.log($scope.appointmentSchedulings)
        }
        $scope.showLoading = false
      } else {
        // 如果没有精准预约排班，则需要展示普通预约已满
        $scope.appointmentSchedulings.map(item => {
          item.AppointArr.map(o => (o.isShow = true))
        })
        $scope.showLoading = false
      }
    })
  }

  //根据预约挂号code获取预约挂号类型(中文).
  $scope.GetRegTypeName = function(code) {
    if (!$scope.RegTypeList) return ''
    if (!code) return ''
    let regtype = $scope.RegTypeList.filter(p => {
      return p.Code == code
    })[0]
    return regtype.Name
  }

  //根据院区code获取院区中文.
  $scope.GetHosName = function(hosCode) {
    if (!hosCode) return ''
    let hosVal = ''
    switch (hosCode) {
      case '10001':
        hosVal = '仁济西院'
        break
      case '10002':
        hosVal = '仁济东院'
        break
      case '10003':
        hosVal = '仁济南院'
        break
      case '10004':
        hosVal = '仁济北院'
        break
      default:
        hosVal = ''
        break
    }
    return hosVal
  }

  //职工来源.
  $scope.GetStaffOrigin = function() {
    if (!currentAccount || !currentAccount.Origin) return ''
    switch (currentAccount.Origin) {
      case 1:
        return '1184' //1184  微信渠道.
      case 2:
        return '11141' //11141 支付宝渠道.
      //11121 app渠道.
    }
    return ''
  }

  $scope.getPlanData = function(p) {
    // console.log(p)
    if (p.showDetail) {
      //合并(showDetail=true)不需要请求数据接口.
      p.showDetail = !p.showDetail
      return
    }
    if ($scope.IsStaff) {
      //职工查询序号用 GetPlanDataByOrigin.
      $scope.getAccuratePlanData(p, 'staff')
      return
    }

    $scope.showLoading = true
    // let params = [$scope.AppId, p.PlanId, p.HosCode];
    let params = [
      {
        AppId: $scope.AppId,
        PlanId: p.PlanId,
        HosCode: p.HosCode,
        TimeRang: '',
      },
    ]
    SchedulingService.SchedulingSameUrl($scope.AppId, 'GetPlanDataForRenJi', params).then(
      function(res) {
        $scope.showLoading = false
        if (res && res.code == 0) {
          if (res.result.length > 0) {
            p.PlanData = res.result
            p.showDetail = !p.showDetail
          } else {
            layer.msg('未查询到预约号序！')
          }
        } else {
          let errorMsg = res.error.message
          layer.msg(errorMsg)
        }
      },
      function(err) {
        $scope.showLoading = false
        console.log(err)
      },
    )
  }
  // 获取精准预约排班详情
  $scope.getAccuratePlanData = function(item, enter) {
    console.log(item)
    if (item.showAccurate) {
      item.showAccurate = !item.showAccurate
      return
    }
    let Origin = '114'
    if (enter && enter == 'staff') {
      //职工查询号序.
      Origin = $scope.GetStaffOrigin() //职工 Origin.
    }
    $scope.showLoading = true
    let params = {
      AppId: $scope.AppId,
      PlanId: item.PlanId,
      HosCode: item.HosCode,
      PlanOrigin: Origin,
    }
    SchedulingService.SchedulingSameUrl($scope.AppId, 'GetPlanDataByOrigin', [params]).then(
      function(res) {
        $scope.showLoading = false
        console.log(res)
        if (res && res.code == 0) {
          if (res.result.length > 0) {
            if (enter && enter == 'staff') {
              //职工查询结果同'普通排班序号查询结果'.
              item.PlanData = res.result
              item.showDetail = !item.showDetail
            } else {
              item.accuratePlanData = res.result
              item.showAccurate = !item.showAccurate
            }
          } else {
            layer.msg('未查询到预约号序')
          }
        } else {
          layer.msg(res.error.message)
        }
      },
      function(err) {
        $scope.showLoading = false
        console.log(err)
      },
    )
  }

  // 去进行精准预约
  $scope.doAccurateAppointment = function(item) {
    let params = {
      Date: item.Date,
      StartTime: item.StartTime,
      EndTime: item.EndTime,
      DeptCode: item.DeptCode,
      DoctorWorkNum: item.DoctorWorkNum ? item.DoctorWorkNum : $scope.doctor.DoctorWorkNum,
      RegTypeName: $scope.GetRegTypeName(item.RegTypeCode),
      HosCode: item.HosCode,
      DeptName: $scope.DeptName,
      DoctorName: $scope.doctor.DoctorName,
      Price: item.Price,
      TimeFlag: item.TimeFlag,
      accurateAppoint: true,
    }
    sessionStorage.setItem($scope.AppId + 'AppointmentInfo', JSON.stringify(params))
    $state.go('AppointmentConfirm', {
      AppId: $scope.AppId,
    })
  }

  $scope.doTeamAccurateAppoint = function() {
    let RelatedId = sessionStorage.getItem($scope.AppId + 'selectCardRelatedId')
    if (!RelatedId) {
      layer.alert('未获取到卡信息，请先去绑卡')
    } else {
      $state.go('teamList', {
        AppId: $scope.AppId,
        RelatedId,
        teamId: $scope.doctorTeamList[0].TeamId,
      })
    }
  }
  //显示预约按钮.
  $scope.ShowAppointBtn = function(info) {
    // console.log(info);
    let falg = false
    if (info.CanAppointment == -1 || info.CanAppointment > 0) {
      if ($scope.IsNowDay(info.Date)) {
        //当天.
        let nowTime = moment().format('HHmm')
        let EndTime = info.EndTime.replace(':', '')
        if (nowTime <= EndTime) {
          falg = true
        }
      } else {
        falg = true
      }
    }
    return falg
  }

  // 预约过号
  $scope.ShowNoAppointBtn = function(item, info) {
    let flag = false
    if ($scope.IsNowDay(item.Date)) {
      //当天.
      let nowTime = moment().format('HHmm')
      let EndTime = info.EndTime.replace(':', '')
      if (nowTime > EndTime) {
        flag = true
      }
    }
    return flag
  }

  $scope.CheckNow = function(time) {
    if (time) {
      var now = moment().format('HHmm')
      var startTime = time.split('-')[0].replace(':', '')
      var endTime = time.split('-')[1].replace(':', '')
      if (now >= startTime && now <= endTime) {
        return true
      }
    }
    return false
  }

  $scope.IsNowDay = function(d) {
    if (d) {
      var now = moment().format('YYYYMMDD')
      var date = d.replace(new RegExp('-', 'g'), '')
      if (now == date) {
        return true
      }
    }
    return false
  }

  $scope.CheckRegisterOpenTime = function(f) {
    var time = null
    if ($scope.RegisterConfig) {
      if (f == '0') {
        time = $scope.RegisterConfig.MorningOpenTime
        ctime = $scope.RegisterConfig.MorningCloseTime
      } else if (f == '1') {
        time = $scope.RegisterConfig.AfternoonOpenTime
          ? $scope.RegisterConfig.AfternoonOpenTime
          : $scope.RegisterConfig.MorningOpenTime
        ctime = $scope.RegisterConfig.AfternoonCloseTime
          ? $scope.RegisterConfig.AfternoonCloseTime
          : $scope.RegisterConfig.MorningCloseTime
      }
      if (time) {
        if (!$scope.CheckNow(time)) {
          return false
        }
      }

      if (ctime) {
        var now = $scope.RegisterConfig.SystemTime ? $scope.RegisterConfig.SystemTime : moment().format('HH:mm')
        var nowNum = Number(now.replace(':', ''))
        var ctimeNum = Number(ctime.replace(':', ''))

        if (ctimeNum < nowNum) {
          return false
        }
      }
    }
    return true
  }

  //时间转成上/下午、全天.
  $scope.GetTimeChineseName = function(SchedulingFlag, str) {
    let val = ''
    if (SchedulingFlag == '1') {
      //'1'-全天,'0'-正常上下午班.
      val = '全天'
    } else {
      val = str
    }
    return val
  }

  $scope.GoRegister = function(flag, data) {
    console.log(data)
    if (!data) return

    var regTypeName = $scope.GetRegTypeName(data.RegTypeCode)
    var obj = new Object()
    obj.AppId = $scope.AppId
    obj.PlanId = data.PlanId
    obj.SchedulingId = data.SchedulingId
    obj.RegDate = data.WorkDate
    obj.RegTypeCode = data.RegTypeCode
    obj.RegDeptCode = data.RegDeptCode //20200819:新版挂号增加字段.
    obj.HosCode = data.HosCode
    obj.DeptCode = data.DeptCode
    obj.DeptType = data.DeptType
    obj.DoctorWorkNum = data.DoctorWorkNum ? data.DoctorWorkNum : $scope.doctor.DoctorWorkNum
    obj.Price = data.Price
    obj.RegTypeName = regTypeName
    obj.VisitPosition = data.VisitPosition
    obj.VisitPosition1 = data.VisitPosition1
    obj.TimeFlag = flag
    obj.DeptName = $scope.SpecialType ? data.DeptName : $scope.DeptName
    obj.ParentCode = $scope.ParentCode //20190617:(一级科室code)从上一页传过来(值取的DepartmentList里面的ParentCode).
    //20191004: 挂号接口入参增加'获取排班接口入参'.
    obj.AppointmentType = $scope.AppointmentType
    obj.PbDate = $scope.PbDate
    obj.PbEndDate = $scope.PbEndDate
    obj.PbDocWorkNum = $scope.DoctorWorkNum
    obj.PbDeptCode = $scope.DeptCode
    obj.PbRegisterType = $scope.RegisterType

    if ($scope.doctor) {
      obj.DoctorName = $scope.doctor.DoctorName
      obj.DoctorLevel = $scope.doctor.DoctorLevel
    }
    let diseaseCache = sessionStorage.getItem('currentDisease' + $scope.AppId)
    if (diseaseCache) {
      let diseaseCacheObj = JSON.parse(diseaseCache)
      obj.WhetherDisease = diseaseCacheObj.WhetherDisease
      obj.DiseaseCode = diseaseCacheObj.DiseaseCode
      obj.DiseaseName = diseaseCacheObj.DiseaseName
    }
    sessionStorage.setItem($scope.AppId + 'RegisterInfo', JSON.stringify(obj))
    $state.go('RegisterConfirm', {
      AppId: $scope.AppId,
    })
  }

  $scope.GoAppointment = function(p, detail) {
    $scope.chosenSchedule = p
    if (!$scope.chosenSchedule) return

    $scope.chosenSchedule.DataId = detail.DataId
    $scope.chosenSchedule.OrderXh = detail.OrderXh
    $scope.chosenSchedule.AppointmentTime = detail.BeginTime

    var data = $scope.chosenSchedule
    var regTypeName = $scope.GetRegTypeName(data.RegTypeCode)
    var obj = new Object()

    obj.AppId = $scope.AppId
    obj.HosCode = data.HosCode
    obj.PlanId = data.PlanId
    obj.SchedulingId = data.SchedulingId
    obj.Date = data.Date
    obj.StartTime = data.StartTime
    obj.EndTime = data.EndTime
    obj.RegTypeCode = data.RegTypeCode
    obj.DeptCode = data.DeptCode
    obj.DoctorWorkNum = data.DoctorWorkNum ? data.DoctorWorkNum : $scope.doctor.DoctorWorkNum
    obj.Price = data.Price
    obj.Location = data.Location
    obj.NeedPay = data.NeedPay
    obj.TimeFlag = data.TimeFlag
    obj.DoctorLevel = $scope.doctor.DoctorLevel
    obj.DoctorName = $scope.doctor.DoctorName
    obj.DoctorLevel = $scope.doctor.DoctorLevel
    obj.DeptName = $scope.SpecialType ? data.DeptName : $scope.DeptName //科室名从上个页面获取
    obj.RegTypeName = regTypeName
    obj.DataId = data.DataId
    obj.OrderXh = data.OrderXh
    obj.AppointmentTime = data.AppointmentTime
    obj.ShowDeptName = data.ShowDeptName //20201010:预约成功消息推送用到.
    obj.ParentCode = $scope.ParentCode //20190617:(一级科室code)从上一页传过来(值取的DepartmentList里面的ParentCode).
    //20191004: 预约接口入参增加'获取排班接口入参'.
    obj.AppointmentType = $scope.AppointmentType
    obj.PbDate = $scope.PbDate
    obj.PbEndDate = $scope.PbEndDate
    obj.PbDocWorkNum = $scope.DoctorWorkNum
    obj.PbDeptCode = $scope.DeptCode
    obj.PbRegisterType = $scope.RegisterType

    sessionStorage.setItem($scope.AppId + 'IsStaff', JSON.stringify($scope.IsStaff)) //缓存是否为职工字段.
    sessionStorage.setItem($scope.AppId + 'AppointmentInfo', JSON.stringify(obj))
    $state.go('AppointmentConfirm', {
      AppId: $scope.AppId,
      // obj: JSON.stringify(obj)
    })
  }
})
