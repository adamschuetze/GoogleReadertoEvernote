/*

Do you use Google Reader?  Do you use Evernote?  I do, and I also use the Evernote Webclipper to
save web pages into notes for later reading, and I occasionally manually email links to my Evernote
for later perusal.  So I wanted to set things up so that when I starred an article in Google Reader,
it would send that article to Evernote, and I could review all my saved articles in one easy place, 
no matter what source I had used to save them.

--Credits--

I want to thank Shawn McCollum for writing his excellent article on a PHP implementation of a Google
Reader client, which gave me the idea that it could be possible to access the Google Reader API:

http://mobile.tutsplus.com/tutorials/mobile-web-apps/building-a-mobile-web-application-with-the-google-reader-api/

I also relied heavily on the excellent documention of the Google Reader API in Martin Doms' series 
of articles:

http://blog.martindoms.com/2009/08/15/using-the-google-reader-api-part-1/
http://blog.martindoms.com/2009/08/15/using-the-google-reader-api-part-2/
http://blog.martindoms.com/2009/08/15/using-the-google-reader-api-part-3/

--Functionality--

1.  Star an article in Google Reader (web or mobile application)
2.  Script checks your Google Reader, searches for starred articles, and saves them to Evernote.
3.  Script automatically un-stars the articles when it is completed.  

--Installation--

It runs as a script in your Google Drive.  To install:

1.  Go to your Google Drive
2.  Click Create>More>Script and create a new blank project.
3.  Delete the boilerplate code that Google pasted into the editing area.
4.  Paste all of this code into the editing area
5.  Give the script a name: change "Untitled project" to something else more memorable.
6.  Click File>Project properties and click on 'User properties' tab.
7.  Define some Properties:

Property: evernoteMail                  Value: <your Evernote email address>
Property: defaultNotebook_reader        Value: <the Evernote notebook you want to save article into>
Property: GoogleUsername                Value: <your Google email address>
Property: GooglePassword                Value: <your Google password>

8.  Configure how often it runs.  Click Resources>All your triggers, then 'Add a new trigger', and 
    configure to run as often as you want.  

--Notes--

a) The Evernote email address referenced in (7) is the secret one you use to send content to Evernote 
   via email,  not the email address associated with your account.  You can get your Evernote email 
   address from Tools>Account Info in the PC application, or from the 'Settings' pulldown menu on the 
   web site.
b) If you are using Google two-step authentication, you will need to generate an 
   application-specific password.  In Gmail, click on 'Gear icon'>Settings and select 'Accounts' 
   tab, then click 'Google Account settings', then 'Security', then 'Manage access' under 
   'Connected applications and sites'.  Give the password a label, and click 'Generate password'.  
   Use this password.
       
--For more information on the Google Reader API--

http://mobile.tutsplus.com/tutorials/mobile-web-apps/building-a-mobile-web-application-with-the-google-reader-api/
http://blog.martindoms.com/2009/08/15/using-the-google-reader-api-part-1/
http://undoc.in/googlereader.html
http://eamann.com/tech/google-reader-api-a-brief-tutorial/

*/

function ReadertoEvernote () {
 
  //Number of starred articles to handle, per execution
  var n = 50;
  var userAgent='GoogleReaderToEvernote';
  var urlApi = 'http://www.google.com/reader/api/0';
  var urlAuth = 'https://www.google.com/accounts/ClientLogin';
  var urlToken = 'https://www.google.com/reader/api/0/token';
  var urlStream = 'https://www.google.com/reader/api/0/stream';
  
  var authentication=login(UserProperties.getProperty('GoogleUsername'),UserProperties.getProperty('GooglePassword'),urlAuth,urlToken,userAgent);
    
  if (authentication[0]){
    var items=getStarredItems(n,urlStream,userAgent, authentication[1]);
    var item_stream='';
    var item_id='';
    var item_url='';
    var item_title=''
    var item_summary='';
    var item_feedname='';
    var item_date= new Date();
    var message_body='';
  
    for (i=0;i<items.length;i++) {  
      item_stream=getItemStreamId(items[i]);
      item_id=getItemId(items[i]);
      item_url=getItemUrl(items[i]);
      item_title=getItemTitle(items[i]);
      item_summary=getItemContent(items[i]);
      item_feedname=getItemFeedname(items[i]);
      item_date=Date(Number(getItemDate(items[i]))*1000);
      message_body=item_date.toString()+"<br>"+item_feedname+"<br><a href=\""+item_url+"\">"+item_url+"</a><br><br>"+item_summary;
      GmailApp.sendEmail(UserProperties.getProperty('evernoteMail'), item_title+' @'
        +UserProperties.getProperty('defaultNotebook_reader'), '', {noReply:true, htmlBody: message_body});
      unstarArticle(item_id,item_stream,urlApi,userAgent,authentication[1],authentication[2]); 
      markreadArticle(item_id,item_stream,urlApi,userAgent,authentication[1],authentication[2]); 
    }
  }
}

// Returns an array of values
// [0] Authentication state (true/false)
// [1] Auth value
// [2] Token value
function login (GoogleUsername,GooglePassword,urlAuth,urlToken,userAgent){
  var authentication=new Array(3);
  var result=postAnonUrl(urlAuth, '&Email='+GoogleUsername+'&Passwd='+GooglePassword+'&service=reader&source='+userAgent);
  var auth_regexp = new RegExp('Auth=(\\S*)');
  if (auth_regexp.test(result)) {
    authentication[0]=true;
    var match=auth_regexp.exec(result);
    authentication[1]=match[1];
    authentication[2]=getUrl(urlToken,authentication[1]);
  } else {
    authentication[0]=false; 
  }
  return authentication;
}

function getStarredItems (n,urlStream,userAgent,auth) {
  var url = urlStream + '/contents/user/-/state/com.google/starred'+
    '?n='+n+'&ck='+Date.now()+'&client='+userAgent;
  return (JSON.parse(getUrl(url, auth))).items;
}

function unstarArticle(id,stream,urlApi,userAgent,auth,token) {
  var url = urlApi+'/edit-tag?client='+userAgent;
  var data = 'r=user/-/state/com.google/starred&async=true&s='+stream+'&i='+id+'&T='+token;
  return postUrl(url,data,auth);
}

function markreadArticle(id,stream,urlApi,userAgent,auth,token) {
  var url = urlApi+'/edit-tag?client='+userAgent;
  var data = 'a=user/-/state/com.google/read&async=true&s='+stream+'&i='+id+'&T='+token;
  return postUrl(url,data,auth);
}

function getUrl(url,auth) {
  var result = UrlFetchApp.fetch(url, {headers:{Authorization: 'GoogleLogin auth='+auth}});
  return result.getContentText();
  
}

function postAnonUrl(url,data) {
  var result = UrlFetchApp.fetch(url, {method:"post", payload:data});
  return result.getContentText();
}

function postUrl(url,data,auth) {
  var result = UrlFetchApp.fetch(url, {method:"post", payload:data, headers:{Authorization: 'GoogleLogin auth='+auth}});
  return result.getContentText();
}

function getItemStreamId (item) {
  return item.origin.streamId;
}

function getItemId (item) {
  return item.id;
}

function getItemUrl (item) {
  return (item.alternate)[0].href;
}

function getItemTitle (item) {
  return item.title; 
}

function getItemContent (item) {
  var summary = '';
  if (typeof item.summary === "undefined" ) {
    summary = item.content.content;
  } else {
    summary = item.summary.content;
  }
  return summary;
}

function getItemFeedname (item) {
  return item.origin.title;
}

function getItemDate (item) {
  return item.updated;
}
