let puppeteer=require("puppeteer");
let fs=require("fs");
//const { timeout } = require("async");

let credentialsFile=process.argv[2];

let url,pwd,email,curl;

let toBeSearched="nachde ne saare song";
(async function()
{
    try{

        let data=await fs.promises.readFile(credentialsFile,"utf-8");
        let cred=JSON.parse(data);
        curl=cred.curl;
        url=cred.url;
        email=cred.email;
        pwd=cred.pwd;
        //start browser
        let browser=await puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized","--disable-notifications"],
            slowMo:300
        });

        let numberofPages=await browser.pages();
        let tab=numberofPages[0];
        
        await tab.goto(url,{ waitUntil:"networkidle2"});
        await tab.click("yt-formatted-string#text.style-scope.ytd-button-renderer.style-suggestive.size-small");
        await tab.waitForSelector("input#identifierId.whsOnd.zHQkBf");
        await tab.type("input#identifierId.whsOnd.zHQkBf", email,{ delay: 200 });
         console.log("Email entered");
        await tab.click("span.CwaK9");
        await tab.waitForSelector("input.whsOnd.zHQkBf");
        await tab.type("input.whsOnd.zHQkBf", pwd, { delay: 200 });
        await tab.click("span.RveJvd.snByac");
        console.log("User logged in");
        //#container input#search  mine:#search-container
        await tab.waitForSelector("#container input#search");
        await tab.type("#container input#search",toBeSearched,{ delay: 200 });
        //await tab.click("span.yt-uix-button-content");
        await Promise.all([tab.keyboard.press("Enter"), tab.waitForNavigation({ waitUntil: "networkidle2" })]);
        await tab.waitForSelector("div#title-wrapper")
       //await tab.waitForSelector("#contents a#video-title")

       //get the 1st result
       let firstRes = await tab.$("div#title-wrapper")
       await Promise.all([firstRes.click(), tab.waitForNavigation({ waitUntil: "networkidle2" })])

       //fullscreen mode  button.icon-button.fullscreen-icon 
       await tab.waitForSelector("button.ytp-fullscreen-button.ytp-button");
       await tab.click("button.ytp-fullscreen-button.ytp-button");
       
       //let time=await tab.waitForSelector("span.time-second")
      
       await tab.waitFor(210*1000);

    vlink=tab.url();

//open converter url
    await tab.goto(curl,{ waitUntil:"networkidle2"});
    
    await tab.waitForSelector("input#input");
    await tab.type("input#input",vlink,{ delay: 200 });

    await Promise.all([await tab.click("input#submit"), ({timeout:"40000"})]);
       console.log('submit button clicked');

       //convert button will be selected

      console.log('button1 clicked');
      await Promise.all([await tab.click("div#buttons a[rel]"), tab.waitForNavigation({timeout:"4800"})]);
      console.log('button-main clicked');

      await tab.waitFor(150*1000);
      //after work finishes close the browser 

        
      browser.close();
      
    }
    catch(err){
        console.log(err);
    }
})()