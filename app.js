var express = require("express")
const app = express()
const path = require("path")
var pdfFiller = require("pdffiller-stream")
let fs = require("fs")
var bodyParser = require("body-parser")
const helmet = require("helmet")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// const pdfs = require('./routes/pdfBuild')
// const config = require('./routes/config')

// app.use('/api/pdfBuild', pdfs)
// app.use('/api/config', config)

app.use(function(req, res, next) {
  // res.set('X-Frame-Options', 'DENY')
  // res.set('Content-Security-Policy', "frame-ancestors 'none';")
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Frame-Options, Content-Security-Policy"
  )
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  )
  next()
})
app.post("/pdf", function(req, res) {
  console.log(req.body)
  console.log(req.headers)
  this.runThrough(req, res)
  //
})
buildW4 = data => {
  let firstName = data.firstName ? data.firstName : ""
  let middleName = data.middleName ? data.middleName : ""
  let city = data.city ? data.city : ""
  let st = data.st ? data.st : ""
  let zipcode = data.zipcode ? data.zipcode : ""

  const w4Data = {
    "topmostSubform[0].Page1[0].Line1[0].f1_1[0]": firstName + "" + middleName,
    "topmostSubform[0].Page1[0].Line1[0].f1_2[0]": data.lastName
      ? data.lastName
      : "",
    "topmostSubform[0].Page1[0].Line1[0].f1_3[0]": data.street
      ? data.street
      : "",
    "topmostSubform[0].Page1[0].Line1[0].f1_4[0]":
      city + ", " + st + " " + zipcode,
    "topmostSubform[0].Page1[0].f1_13[0]": data.social ? data.social : "",
    "topmostSubform[0].Page1[0].c1_1[0]":
      data.relationStatus == "single" ? 1 : "", // single
    "topmostSubform[0].Page1[0].c1_1[1]":
      data.relationStatus == "married" ? 2 : "", //married
    "topmostSubform[0].Page1[0].c1_1[2]": "", //married but withhold
    "topmostSubform[0].Page1[0].c1_2[0]": "",
    "topmostSubform[0].Page1[0].f1_5[0]": data.allowances
      ? data.allowances
      : "", //allowances
    "topmostSubform[0].Page1[0].f1_6[0]": data.addtWitholding
      ? data.addtWitholding
      : "", //addition withhold
    "topmostSubform[0].Page1[0].f1_7[0]": "",
    "topmostSubform[0].Page1[0].f1_8[0]": data.companyName
      ? data.companyName
      : "", //employers name
    "topmostSubform[0].Page1[0].f1_9[0]": data.startDate ? data.startDate : "", //start date
    "topmostSubform[0].Page1[0].f1_10[0]": "", //ein
    "topmostSubform[0].Page3[0].f3_1[0]": "",
    "topmostSubform[0].Page3[0].f3_2[0]": "",
    "topmostSubform[0].Page3[0].f3_3[0]": "",
    "topmostSubform[0].Page3[0].f3_4[0]": "",
    "topmostSubform[0].Page3[0].f3_5[0]": "",
    "topmostSubform[0].Page3[0].f3_6[0]": "",
    "topmostSubform[0].Page3[0].f3_7[0]": "",
    "topmostSubform[0].Page3[0].f3_8[0]": "",
    "topmostSubform[0].Page3[0].f3_9[0]": "",
    "topmostSubform[0].Page3[0].f3_10[0]": "",
    "topmostSubform[0].Page3[0].f3_11[0]": "",
    "topmostSubform[0].Page3[0].f3_12[0]": "",
    "topmostSubform[0].Page3[0].f3_13[0]": "",
    "topmostSubform[0].Page3[0].f3_14[0]": "",
    "topmostSubform[0].Page3[0].f3_15[0]": "",
    "topmostSubform[0].Page3[0].f3_16[0]": "",
    "topmostSubform[0].Page3[0].f3_17[0]": "",
    "topmostSubform[0].Page3[0].f3_18[0]": "",
    "topmostSubform[0].Page4[0].f4_1[0]": "",
    "topmostSubform[0].Page4[0].f4_2[0]": "",
    "topmostSubform[0].Page4[0].f4_3[0]": "",
    "topmostSubform[0].Page4[0].f4_4[0]": "",
    "topmostSubform[0].Page4[0].f4_5[0]": "",
    "topmostSubform[0].Page4[0].f4_6[0]": "",
    "topmostSubform[0].Page4[0].f4_7[0]": "",
    "topmostSubform[0].Page4[0].f4_8[0]": "",
    "topmostSubform[0].Page4[0].f4_9[0]": "",
    "topmostSubform[0]": "",
    signature: data.signature ? data.signature : "",
    signedDate: data.createdAt ? data.createdAt : ""
  }

  return w4Data
}

buildI9 = data => {
  const i9Data = {
    Lname: data.i9lastName ? data.i9lastName : "",
    Fname: data.i9firstName ? data.i9firstName : "",
    Mname: data.i9middleName ? data.i9middleName : "",
    Lother: data.i9preferredName ? data.i9preferredName : "",
    address: data.i9street ? data.i9street : "",
    Unit: data.i9apartment ? data.i9apartment : "",
    city: data.i9city ? data.i9city : "",
    state: data.i9st ? data.i9st : "",
    zipcode: data.i9zipcode ? data.i9zipcode : "",
    dob: data.i9birthmask ? data.i9birthmask : "",
    social: data.i9socialmask ? data.i9socialmask : "",
    email: data.i9employeeEmail ? data.i9employeeEmail : "",
    telephone: data.i9textmask ? data.i9textmask : "",
    citizen: data.residency == "option1" ? "Yes" : "",
    nonCitizen: data.residency == "option2" ? "Yes" : "",
    lawfulResident: data.residency == "option3" ? "Yes" : "",
    alien: data.residency == "option4" ? "Yes" : "",
    alienId: data.extraForm == "ARN" ? data.extraFormId : "",
    admissionId: data.extraForm == "i94 #" ? data.extraFormId : "",
    foreignPassportId: data.extraForm == "Passport #" ? data.extraFormId : "",
    countryName: data.extraForm == "Passport #" ? "USA" : "",
    preparerCheck: data.preparer ? "Yes" : "",
    signature: data.signature ? data.signature : "",
    signatureDate: data.createdAt ? data.createdAt : "",
    preparerSignature: "",
    preparerDate: "",
    s2Last: data.i9lastName ? data.i9lastName : "",
    s2First: data.i9firstName ? data.i9firstName : "",
    s2Middle: data.i9middleName ? data.i9middleName : "",
    s2Citizen: data.residency ? data.residency : "",
    s2Lista1: data.documentTitle1 ? data.documentTitle1 : "",
    s2Lista2: data.authority1 ? data.authority1 : "",
    s2Lista3: data.documentNumber1 ? data.documentNumber1 : "",
    s2Lista4: data.expirationDate1 ? data.expirationDate1 : "",
    s2Lista5: data.documentTitle2 ? data.documentTitle2 : "",
    s2Lista6: data.authority2 ? data.authority2 : "",
    s2Lista7: data.documentNumber2 ? data.documentNumber2 : "",
    s2Lista8: data.expirationDate2 ? data.expirationDate2 : "",
    s2Lista9: data.documentTitle3 ? data.documentTitle3 : "",
    s2Lista10: data.authority3 ? data.authority3 : "",
    s2Lista11: data.documentNumber3 ? data.documentNumber3 : "",
    s2Lista12: data.expirationDate3 ? data.expirationDate3 : "",
    s2Listb1: data.documentTitleB ? data.documentTitleB : "",
    s2Listb2: data.authorityB ? data.authorityB : "",
    s2Listb3: data.documentNumberB ? data.documentNumberB : "",
    s2Listb4: data.expirationDateB ? data.expirationDateB : "",
    s2Listc1: data.documentTitleC ? data.documentTitleC : "",
    s2Listc2: data.authorityC ? data.authorityC : "",
    s2Listc3: data.documentNumberC ? data.documentNumberC : "",
    s2Listc4: data.expirationDateC ? data.expirationDateC : "",
    s2Additional: data.addInfo ? data.addInfo : "",
    s2Cert1: data.employeeStart ? data.employeeStart : "",
    s2Cert2: data.employerSignature ? data.employerSignature : "",
    s2Cert3: data.todaysDate ? data.todaysDate : "",
    s2Cert4: data.employerTitle ? data.employerTitle : "",
    s2Cert5: data.employerLast ? data.employerLast : "",
    s2Cert6: data.employerFirst ? data.employerFirst : "",
    s2Cert7: data.employerBusiness ? data.employerBusiness : "",
    s2Cert8: data.employerBusAddress ? data.employerBusAddress : "",
    s2Cert9: data.city ? data.city : "",
    s2Cert10: data.employerState ? data.employerState : "",
    s2Cert11: data.zipcode ? data.zipcode : "",
    s3Review1: data.rehireLast ? data.rehireLast : "",
    s3Review2: data.rehireFirst ? data.rehireFirst : "",
    s3Review3: data.rehireMiddle ? data.rehireMiddle : "",
    s3Review4: data.rehireStart ? data.rehireStart : "",
    s3Review5: data.documentTitleRehire ? data.documentTitleRehire : "",
    s3Review6: data.rehireTodaysDate ? data.rehireTodaysDate : "",
    s3Review7: data.documentNumberRehire ? data.documentNumberRehire : "",
    s3Review8: data.employerSignatureRehire ? data.employerSignatureRehire : "",
    s3Review9: data.rehireTodaysDateEmployer
      ? data.rehireTodaysDateEmployer
      : "",
    s3Review10: data.rehireEmployerName ? data.rehireEmployerName : ""
  }
  return i9Data
}

const sourceFDF = "./test/i9.pdf"

// Override the default field name regex. Default: /FieldName: ([^\n]*)/
const nameRegex = null
const shouldFlatten = false
//
//const FDF_data = pdfFiller
//  .generateFDFTemplate(sourceFDF, nameRegex)
//  .then(fdfData => {
//    console.log(fdfData)
//  })
//  .catch(err => {
//    console.log(err)
//  })

app.get("/hello", function(res, res) {
  res.send(200)
})

runThrough = (req, res) => {
  let { doc, detail } = req.body
  console.log(doc, detail)
  var sourcePDF
  var data

  if (doc == "I9") (sourcePDF = "./test/i-9.pdf"), (data = buildI9(detail))
  else if (doc == "W-4")
    (sourcePDF = "./test/fw4.pdf"), (data = buildW4(detail))
  pdfFiller
    .fillFormWithFlatten(sourcePDF, data, shouldFlatten)
    .toFile("wook.pdf")
    .then(() => {
      if (fs.existsSync("wook.pdf")) {
        var file = fs.createReadStream("wook.pdf")
        var stat = fs.statSync("wook.pdf")
        console.log("file", file)
        res.header("Access-Control-Allow-Origin", "*")

        res.setHeader("Content-Length", stat.size)
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", "attachment; filename=quote.pdf")
        // fs.unlinkSync('wook.pdf')
        file.pipe(res)
      } else {
        console.log("cant find file")
      }
    })
    .catch(err => {
      console.log(err)
    })
}

app.listen(process.env.PORT || 3000, function() {
  console.log("The app is running on port 3000")
})
