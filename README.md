# Arc Buddy
<!-- [![Jasmine Tests](https://github.com/62firelight/ArcBuddy-349/actions/workflows/main.yml/badge.svg)](https://github.com/62firelight/ArcBuddy-349/actions/workflows/main.yml) -->

Arc Buddy is a web application that uses the [Bungie.Net API](https://bungie-net.github.io/) to look up stats for [Destiny 2](https://store.steampowered.com/app/1085660/Destiny_2/) players. There is also another page dedicated to viewing the items for in-game vendors, though this is currently a work-in-progress feature. There was formerly a feature where player stats could be saved to [MongoDB](https://www.mongodb.com/) or [an S3 bucket](https://aws.amazon.com/s3/) in [Amazon Web Services](https://aws.amazon.com/) (see the [submission release](https://github.com/62firelight/ArcBuddy-349/releases/tag/v1.0.0-submission)), but this has been scrapped as of the current release. 

Contributions are welcome, but keep in mind that this project was initially built as part of the Cloud Computing Architecture (COSC349) course at Otago Uni. It was mainly intended for me to practice calling an external API and then transform the responses into something displayable on a web page. I also used this application to practice developing with Angular and Node.js. 
Contributions are welcome, but keep in mind that this project was initially built as part of the Cloud Computing Architecture (COSC349) course at Otago Uni. It was mainly intended for me to practice calling an external API and then transform the responses into something displayable on a web page. I also used this application to practice developing with Angular and Node.js. 

## Using the Application

**Link:** https://arcbuddy-349.onrender.com/#/

**Note:** Since Arc Buddy was deployed using the Hobby plan on Render (i.e., I didn't need to spend money to deploy Arc Buddy), the app may take some time to initialise. 

### Search Players

You can search for a Bungie Name using the provided search bar. A Bungie Name takes after the format `Guardian#1234`. You can use my Bungie name (`62firelight#8173`) to test the application. Once finished typing a Bungie Name, you can push "Enter" or click the magnifying glass icon on the right to begin a search. 

An unsuccessful search should return an error message. Otherwise, if the search was successful, you should see the stats for the Destiny 2 player that you've searched for, along with a few filters on the left-hand side.

### Vendors

Since API calls to find vendor information in Destiny 2 require OAuth2 authentication, the **Vendors** page requires considerably more setup compared to the **Search Players** page. Therefore, this page may not function correctly on the deployed version of Arc Buddy, as the access token that is being injected into the deployed build may have expired. 

## Screenshots

### Landing Page

![image](https://user-images.githubusercontent.com/54054879/192176627-b0533889-3c63-41a9-b28d-39d6b9b048ac.png)

### Search Players

![image](https://user-images.githubusercontent.com/54054879/192176564-841d8b9d-a855-47b5-8b29-490ff59cee0b.png)

### Search Players (player found)

![image](https://user-images.githubusercontent.com/54054879/192176774-30b7d3ac-a93e-4981-b434-b98398f61b13.png)

### Search Players (no player found)

![image](https://user-images.githubusercontent.com/54054879/192176657-f131d77e-0502-481b-86d2-1d055cdc792a.png)

### Vendors (work-in-progress)

![image](https://user-images.githubusercontent.com/54054879/192176829-d5c1d3a4-5fac-4a9f-9253-0f9ad1c30445.png)

## Special Thanks

* Bungie for providing such an extensive API ([GitHub](https://github.com/Bungie-net/api))
* brandonmanke for providing an easy-to-use API wrapper that made calling the API much easier ([GitHub](https://github.com/brandonmanke/node-destiny-2))
* FraWolf and Kasui92 for creating Quria, an up-to-date API wrapper ([GitHub](https://github.com/FraWolf/quria))
