GoogleReadertoEvernote
======================

Google Scripts application that saves starred articles to Evernote

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

Property: evernoteMail                  Value: -your Evernote email address-

Property: defaultNotebook_reader        Value: -the Evernote notebook you want to save article into-

Property: GoogleUsername                Value: -your Google email address-

Property: GooglePassword                Value: -your Google password-

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
