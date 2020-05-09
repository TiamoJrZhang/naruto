/** @format */

function fakeCall(context: any) {
  context.fn = this
  console.log(111)
}

fakeCall({})
