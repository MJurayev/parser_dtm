const puppeteer = require('puppeteer')

const fs = require('fs')
// parsing returns
// {

//     content:""
//     maxCount:22323
// }

const options = {
    args: [
        '--no-sandbox',
        // '--window-size=1440,810',
        // '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36',
    ],
    headless: true,
    slowMo: 55,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
    stealth: true,
    ignoreDefaultArgs: ['--enable-automation'],
}

const unversities = [
    "https://mandat.dtm.uz/Home/AfterFilter?name=333233&region=0",
    "https://mandat.dtm.uz/Home/AfterFilter?name=333233&region=0"
]
let sath = 11677
const getUrl = (currentCount) => {
    return `https://mandat.dtm.uz/Home/AfterFilter?name=${currentCount+sath}&region=0`
}
let currentUrl =0
const parsing = async () => {
    const names = [
        'ABDURAHMONOVA',
        'ABDIRAHMONOVA',
        'ABDURAXMONOVA',
        'ABDIRAXMONOVA',
        'SABIROVA'
    ];
  try {
    startSetup(unversities, names)
  } catch (error) {
    console.log(error)
  }
}
const startSetup =  (names) => {
    
    
    puppeteer.launch(options).then(browser => {
        console.log('Id:'+(sath+currentUrl))
        browser.newPage().then((page)=>{
                page.setRequestInterception(true).then(async ()=>{
                    page.on('request', (req) => {
                        if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
                            req.abort();
                        }
                        else {
                            req.continue();
                        }
                    })
                     page.goto(getUrl(currentUrl)).then(()=>{
                        try {
                            paginationRunner(page, names).then(async()=>{
                                await page.close()
                                console.log('Ended')
                            }).catch(err =>{
                                console.log(err)
                            })
                            
                        } catch (error) {
                            console.log(error)
                        }
                        currentUrl++
                         startSetup(names)
                     })
                    
                });

            })

        if(currentUrl >= 3803593){
             browser.close().then(() => {
                console.log("Browser closed");
            })
            return
        }


     }).catch((err)=>{
        console.log(err)
     })
    

         
                
    
}
//pagination 
const paginationRunner = async (page, names) => {
    const logStream =  fs.createWriteStream(`parserLog.txt`, {flags:'a'});
    const allFounds = await page.evaluate(() =>(document.querySelector('#Asosiy > div.alert > text > b:nth-child(3)').innerHTML))
    console.log("Found ALl " + allFounds)
    let current = await page.evaluate(() =>(document.querySelector("#Asosiy > div.alert > text > b:nth-child(1)").innerHTML))
    while(current*10<allFounds){
        console.log(current+" page")
        // let rows = await page.evaluate(()=>{document.querySelectorAll("#Asosiy > div.table-responsive > table > tbody tr")  })
        let rowsArray = await page.evaluate(()=>{
            const rows = document.querySelectorAll("#Asosiy > div.table-responsive > table > tbody tr"); 
           let array = []
            rows.forEach(async row => {
               if(!row.childNodes[1].innerText.includes('ID')){
                   let node = { 
                       id:row.childNodes[1].innerHTML,
                       fish:row.childNodes[3].innerHTML,
                       faculty:row.childNodes[5].innerHTML,
                       univer:row.childNodes[7].innerHTML,
                       ball:row.childNodes[9].innerHTML
                   }
                   array.push(node)
               }
               
              
           })
           return array
       })
       logStream.write(JSON.stringify(rowsArray)+"\n")
        if(current<2)await page.click('#Asosiy > a:nth-child(4)')
        else
        await page.click('#Asosiy > a:nth-child(5)')

        current = await page.evaluate(() =>(document.querySelector("#Asosiy > div.alert > text > b:nth-child(1)").innerHTML))
    }  
    logStream.end()
}

module.exports ={ parsing}