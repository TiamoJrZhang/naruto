const chalk = require('chalk')
const querystring = require('querystring');

const doctorMap = {
  // 张羽
  '600100': {
    curSch: '2024-08-13',
    name: '张羽',
  },
}

const step = 2 * 60 * 1000
const doctors = ['600100']
let curTimer = null
let prevFlag = null

async function getResults(appId) {
  const myHeaders = new Headers()
  myHeaders.append('Host', 'api.cmsfg.com')
  myHeaders.append('Connection', 'keep-alive')
  myHeaders.append('Accept', 'application/json, text/plain, */*')
  myHeaders.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 NetType/WIFI MicroMessenger/6.8.0(0x16080000) MacWechat/3.8.7(0x13080712) XWEB/1191 Flue',
  )
  myHeaders.append('Origin', 'https://api.cmsfg.com')
  myHeaders.append('Sec-Fetch-Site', 'same-origin')
  myHeaders.append('Sec-Fetch-Mode', 'cors')
  myHeaders.append('Sec-Fetch-Dest', 'empty')
  myHeaders.append(
    'Referer',
    'https://api.cmsfg.com/app/hospital/600100/index.html?code=031FQEkl288ROd4RqQnl2vlZmI0FQEkf&state=600100',
  )
  myHeaders.append('Accept-Language', 'zh-CN,zh;q=0.9')
  myHeaders.append('Content-Type', 'application/json;charset=UTF-8')
  myHeaders.append('Cookie', 'wzws_sessionid=gDYxLjE1Mi4xNjguNjCCMWE4OThkoGaYfWeBNzYwYzE1')

  const raw = `{
    "method":"GetScheduling",
    "params": [{
      "AppId": ${appId},
      "DoctorWorkNum":"1378",
      "DeptCode":"3301",
      "RegisterType":"off",
      "Date":"2024-07-18",
      "EndDate":"2024-09-17",
      "AppointmentType":"9"
    }]
  }`

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  }

  const response = await fetch('https://api.cmsfg.com/api/appointment/Scheduling?AppId=600100', requestOptions)
  return response.json()
}

async function pushMsg({text, desp, key}) {
  postData = querystring.stringify({ text, desp });
  const response = await fetch(`https://sctapi.ftqq.com/${key}.send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    },
    body: postData
  });

  return response.json()
}

async function check(appId) {
  try {
    const fetchReuslts = await getResults(appId)

    if (curTimer) clearTimeout(curTimer)

    // 通讯失败，再次请求
    if (!fetchReuslts || !fetchReuslts.result) {
      throw new Error('请求失败') 
    }

    if (fetchReuslts.code == 0 && fetchReuslts.result) {
      const schedules = fetchReuslts.result.AppointmentScheduling

      const southHos = schedules.filter(sch => ~sch.Schedulings[0].ShowDeptName.indexOf('南'))
      const eastHos = schedules.filter(sch => ~sch.Schedulings[0].ShowDeptName.indexOf('东'))
      
      console.log(`当前时间: ${chalk.yellow(new Date())}`)
      console.log(`
        南产科最后一次排班信息 => ${JSON.stringify(southHos[southHos.length - 1])}
      `)
      console.log(`
        东产科最后一次排班信息 => ${JSON.stringify(eastHos[eastHos.length - 1])}
      `)
      const newComming = schedules.find(sch => {
        return new Date(sch.Groups) > new Date(doctorMap[appId].curSch) || sch.Schedulings[0].CanAppointment != 0
      })

      if (newComming && prevFlag != newComming.Groups) {
        prevFlag = newComming.Groups
        const msg = `捡漏啦 ${newComming.Groups}`
        console.log(chalk.red(msg))

        curTimer = setTimeout(() => {
          init()
        }, step)

        const commonrMsg = {
          text: msg,
          desp: `
南产科最后一次排班信息 => 时间： ${southHos[southHos.length - 1].Groups}
东产科最后一次排班信息 => 时间： ${eastHos[eastHos.length - 1].Groups}
${doctorMap[appId].name}有新的排班`
        }

        pushMsg({
          ...commonrMsg,
          key: 'SCT253156T2XXDxnkT3JTYzXtfaJIh6UxO'
        })
        pushMsg({
          ...commonrMsg,
          key: 'SCT253150TpCaj1peRDfzF8ssAWr9eMx6x'
        })
      } else {
        console.log(chalk.green(`${doctorMap[appId].name}没有新的排班`))
        curTimer = setTimeout(() => {
          init()
        }, step)
      }
    }
  } catch (error) {
    console.log(`重新请求 ${error}`)
    curTimer = setTimeout(() => {
      init()
    }, step)
  }
}

function init() {
  doctors.forEach(appId => {
    check(appId)
  })
}

init()
