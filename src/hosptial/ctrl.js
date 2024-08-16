app.controller('appointmentConfirmCtrl', function(
  $scope,
  $state,
  $stateParams,
  $http,
  PubFn,
  AppointmentService,
  commonFunctions,
) {
  $scope.showLoading = false
  $scope.AppId = $stateParams.AppId
  $scope.Schedule = JSON.parse(sessionStorage.getItem($scope.AppId + 'AppointmentInfo')) //JSON.parse($stateParams.obj)
  // console.log($scope.Schedule);
  $scope.isTest = sessionStorage.getItem('isTest' + $scope.AppId)
    ? JSON.parse(sessionStorage.getItem('isTest' + $scope.AppId))
    : false

  $scope.IsStaff = sessionStorage.getItem($scope.AppId + 'IsStaff')
    ? JSON.parse(sessionStorage.getItem($scope.AppId + 'IsStaff'))
    : false //是否为职工.
  // console.log($scope.IsStaff);
  $scope.SeletedCard = sessionStorage.getItem($scope.AppId + 'SeletedCardInfo')
    ? JSON.parse(sessionStorage.getItem($scope.AppId + 'SeletedCardInfo'))
    : ''
  // console.log($scope.SeletedCard);
  $scope.Id = ''
  if ($scope.IsStaff && $scope.SeletedCard) {
    $scope.Id = $scope.SeletedCard.PersonId
  }

  if ($scope.Schedule.DoctorLevel) {
    $scope.Schedule.DoctorLevelName = GetDoctorLevel($scope.Schedule.DoctorLevel)
  }
  $scope.Schedule.HosName = '上海仁济医院'
  let HosAreaName = GetHosName($scope.Schedule.HosCode)

  $scope.selectCardInfo = function() {
    // console.log($scope.selectedPatient);
    $scope.showCardType = $scope.selectedPatient.CardTypeNameDirecShow
    $scope.showCardNo = $scope.selectedPatient.CardNumDirecShow
    $scope.selectCardType = $scope.selectedPatient.CardType
    $scope.selectCardNum = $scope.selectedPatient.CardNum
  }

  $scope.showCardNum = function(CardNum) {
    return commonFunctions.plusXing(CardNum, 0, 4)
  }
  //口腔科290 耳鼻咽喉科 215，呼吸科 116   需要弹出提示框

  $scope.CheckAppointmentData = function() {
    var CardType = $scope.selectedPatient.CardType
    let ParentCode = $scope.Schedule.ParentCode
    // if ($scope.Schedule.HosCode == '10004' && CardType == '1' && !$scope.isTest) { //20210205:仁济北院不能医保预约.
    //     layer.alert(`仁济北院不能医保卡预约!`);
    //     return;
    // }
    // 当此条预约为精准预约时
    if ($scope.Schedule.accurateAppoint) {
      getPreciseAppointmentDataEncry()
    } else if ($scope.Schedule.teamAccurateAppoint) {
      doTeamAccurateAppoint()
    } else {
      //20190617:西生殖医学科-X236,东生殖医学科-D2782,北生殖医学科-B2785 医保卡不能预约.('北院 医保卡不能预约'逻辑去掉)
      //20200909:科室code:235.
      if ($scope.Schedule.DoctorWorkNum) {
        //专家.
        ParentCode = $scope.Schedule.DeptCode
      }

      if (CardType == '0') {
        CheckReproductiveMedicine($scope.Schedule.DeptCode, () => {
          layer.open({
            title: '友情提示',
            className: 'content-left',
            content:
              '我院生殖医学科自2024年6月1日起可纳入医保结算，请已预约挂号的患者先绑定医保卡后使用医保进行挂号结算，或至医院窗口、自助机进行挂号。',
            btn: ['确认'],
            yes: function(index) {
              layer.close(index)
              layer.open({
                title: `确认预约`,
                className: 'tip-box',
                content: `您即将使用【${$scope.showCardType}】${$scope.showCardNo},预约<b style='color:#FF767E;'>【${HosAreaName}  ${$scope.Schedule.DeptName}】</b>。我已知晓预约信息，确认此预约！`,
                btn: ['确认', '取消'],
                yes: function(index) {
                  layer.close(index)
                  CheckAppointmentFun(function() {
                    $scope.FreeDoAppointment()
                  })
                },
              })
            },
          })
        })
      } else {
        layer.open({
          title: `确认预约`,
          className: 'tip-box',
          content: `您即将使用【${$scope.showCardType}】${$scope.showCardNo},预约<b style='color:#FF767E;'>【${HosAreaName}  ${$scope.Schedule.DeptName}】</b>。我已知晓预约信息，确认此预约！`,
          btn: ['确认', '取消'],
          yes: function(index) {
            layer.close(index)
            CheckAppointmentFun(function() {
              $scope.FreeDoAppointment()
            })
          },
        })
      }
    }
  }
  // 校验是否黄牛，是否可约
  function CheckAppointmentFun(callback) {
    let params = {
      AppId: $scope.AppId,
      RelatedId: $scope.selectedPatient.RelatedId,
      DoctorWorkNum: $scope.Schedule.DoctorWorkNum,
    }
    $scope.showLoading = true
    PubFn.httpPost($scope.AppId, '/api/appointment/appointment', 'DoAppointmentBlackList', [params])
      .then(res => {
        if (res && res.code == 0) {
          callback && callback()
        } else if (res.code == 1) {
          layer.msg(res.msg)
        }
      })
      .finally(() => {
        $scope.showLoading = false
        $scope.$digest()
      })
  }

  // 校验是否属于生殖医学科，是否需要弹出提示
  function CheckReproductiveMedicine(DeptCode, callback) {
    let params = {
      AppId: $scope.AppId,
      DeptCode,
    }
    PubFn.httpPost($scope.AppId, '/api/appointment/appointment', 'GetDeptScheduling', [params])
      .then(res => {
        if (res) {
          callback && callback()
        } else {
          layer.open({
            title: `确认预约`,
            className: 'tip-box',
            content: `您即将使用【${$scope.showCardType}】${$scope.showCardNo},预约<b style='color:#FF767E;'>【${HosAreaName}  ${$scope.Schedule.DeptName}】</b>。我已知晓预约信息，确认此预约！`,
            btn: ['确认', '取消'],
            yes: function(index) {
              layer.close(index)
              CheckAppointmentFun(function() {
                $scope.FreeDoAppointment()
              })
            },
          })
        }
      })
      .finally(() => {
        $scope.showLoading = false
        $scope.$digest()
      })
  }

  //免费预约
  $scope.FreeDoAppointment = function() {
    //20190214:需求-预约时加上性别校验。预约传的'用户信息'对象加上性别字段'Gender'(具体判断后台处理). (20190610:加上PatientName字段).
    var selectedPatientDto1 = {
      AppId: $scope.selectedPatient.AppId,
      RelatedId: $scope.selectedPatient.RelatedId,
      PatientId: $scope.selectedPatient.PatientId,
      PatientName: $scope.selectedPatient.PatientName,
      Gender: $scope.selectedPatient.Gender,
      Origin: commonFunctions.getCurrentUser($scope.AppId).Origin,
    }
    //20191004: 预约接口入参增加'获取排班接口入参'.
    var query = {
      AppId: $scope.Schedule.AppId,
      DoctorWorkNum: $scope.Schedule.PbDocWorkNum,
      DeptCode: $scope.Schedule.PbDeptCode,
      RegisterType: $scope.Schedule.PbRegisterType,
      Date: $scope.Schedule.PbDate,
      EndDate: $scope.Schedule.PbEndDate,
      AppointmentType: $scope.Schedule.AppointmentType,
    }

    var obj = [$scope.Schedule, commonFunctions.getCurrentUser($scope.AppId).Origin, selectedPatientDto1, query]
    $scope.showLoading = true
    AppointmentService.DoAppointment($scope.AppId, obj).then(
      function(rsp) {
        $scope.showLoading = false
        if (rsp && rsp.code == '0') {
          let appointmentInfo = JSON.parse(rsp.result)
          //预约成功
          //由于前置机hisstatus返回值的问题，
          //将判断条件临时改为SerialNumber不为空认定预约成功
          if (appointmentInfo && appointmentInfo.SerialNumber) {
            appointmentInfo.Date = $scope.Schedule.Date
            appointmentInfo.StartTime = $scope.Schedule.StartTime
            appointmentInfo.EndTime = $scope.Schedule.EndTime
            appointmentInfo.DoctorName = $scope.Schedule.DoctorName
            appointmentInfo.DoctorWorkNum = $scope.Schedule.DoctorWorkNum
            appointmentInfo.RegTypeName = $scope.Schedule.RegTypeName
            appointmentInfo.PatientName = $scope.selectedPatient.PatientName
            appointmentInfo.CardNum = $scope.selectedPatient.CardNum
            appointmentInfo.CardType = $scope.selectedPatient.CardType
            //console.log(appointmentInfo);

            let hisMsg = `您已成功预约【${appointmentInfo.Date} ${appointmentInfo.StartTime}-${appointmentInfo.EndTime} ${$scope.Schedule.DeptName}】`
            layer.open({
              title: '预约成功',
              content: hisMsg,
              btn: ['我的预约', '取消'],
              yes: function(index) {
                layer.close(index)
                $state.go('MyAppointment', {AppId: $scope.AppId}, {location: 'replace'})
              },
            })
          } else {
            layer.alert(appointmentInfo.HisStatusMsg, {title: '预约失败'})
          }
        } else {
          layer.msg(rsp.error.message)
        }
      },
      function(err) {
        console.log(err)
      },
    )
  }

  //根据院区code获取院区中文.
  function GetHosName(hosCode) {
    if (!hosCode) return ''
    switch (hosCode) {
      case '10001':
        return '仁济西院'
      case '10002':
        return '仁济东院'
      case '10003':
        return '仁济南院'
      case '10004':
        return '仁济北院'
    }
    return ''
  }
  // 获取精准预约数据加密
  function getPreciseAppointmentDataEncry() {
    let params = {
      Type: '1',
      RelatedId: $scope.selectedPatient.RelatedId,
      HosID: $scope.Schedule.HosCode,
      DoctorWorkNum: $scope.Schedule.DoctorWorkNum,
      RegDate: $scope.Schedule.Date,
      RegTime: $scope.Schedule.TimeFlag,
    }

    $scope.showLoading = true
    $http({
      method: 'post',
      withCredentials: true,
      url: commonFunctions.getAPIUrl($scope.AppId) + '/api/appointment/Appointment?AppId=' + $scope.AppId,
      data: {
        method: 'PreciseAppointmentDataEncry',
        params: [params],
      },
    })
      .success(function(res) {
        $scope.showLoading = false
        if (res && res.code == '0') {
          let result = JSON.parse(res.result)
          location.href = `http://m.114-91.com/doctor/accurate?data=${result.data}&md5=${result.MD5}`
        } else {
          layer.msg(res.error.message)
        }
      })
      .error(function(err) {
        console.log(err)
        $scope.showLoading = false
      })
  }
  // 团队初诊病人-精准预约
  function doTeamAccurateAppoint() {
    let params = {
      AppId: $scope.AppId,
      AppointmentType: $scope.Schedule.AppointmentType,
      RelatedId: $scope.selectedPatient.RelatedId,
      HosCode: $scope.Schedule.HosCode,
      PlanId: $scope.Schedule.PlanId,
      Date: $scope.Schedule.Date,
      RegTypeCode: $scope.Schedule.RegTypeCode,
      Price: $scope.Schedule.Price,
      StartTime: $scope.Schedule.StartTime,
      EndTime: $scope.Schedule.EndTime,
      TimeFlag: $scope.Schedule.TimeFlag,
      TeamName: $scope.Schedule.TeamName,
      DeptCode: $scope.Schedule.DeptCode,
      DeptName: $scope.Schedule.DeptName,
      DoctorName: $scope.Schedule.DoctorName,
      DoctorWorkNum: $scope.Schedule.DoctorWorkNum,
      DataId: $scope.Schedule.DataId,
      OrderXh: $scope.Schedule.OrderXh,
    }
    $scope.showLoading = true
    $http({
      method: 'post',
      withCredentials: true,
      url: commonFunctions.getAPIUrl($scope.AppId) + '/api/appointment/Appointment?AppId=' + $scope.AppId,
      data: {
        method: 'AppointmentTeam',
        params: [params],
      },
    })
      .success(function(res) {
        $scope.showLoading = false
        if (res && res.code == 0) {
          layer.open({
            content: '您已预约成功！',
            btn: ['我的预约', '取消'],
            yes: function(index) {
              layer.close(index)
              $state.go('MyAppointment', {AppId: $scope.AppId}, {location: 'replace'})
            },
          })
        } else {
          layer.msg(res.error.message)
        }
      })
      .error(function(err) {
        console.log(err)
        $scope.showLoading = false
      })
  }
  //获取level name
  function GetDoctorLevel(level) {
    switch (level) {
      case '0':
        level = '医师'
        break
      case '1':
        level = '住院医师'
        break
      case '2':
        level = '主治医师'
        break
      case '3':
        level = '副主任医师'
        break
      case '4':
        level = '主任医师'
        break
      case '5':
        level = '专家'
        break
      default:
        level = undefined
        break
    }
    return level
  }
})
