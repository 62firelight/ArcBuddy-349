# Arc Buddy
[![Jasmine Tests](https://github.com/62firelight/ArcBuddy-349/actions/workflows/main.yml/badge.svg)](https://github.com/62firelight/ArcBuddy-349/actions/workflows/main.yml)

Arc Buddy is a web application that uses the [Bungie.Net API](https://bungie-net.github.io/) to look up stats for [Destiny 2](https://store.steampowered.com/app/1085660/Destiny_2/) players. There is also another page dedicated to viewing the items for in-game vendors, though this is currently a work-in-progress feature.

There was formerly a feature where player stats could be saved to MongoDB, but I ended up scrapping it after not knowing how to expand it into something useful. 

Contributions are welcome, but keep in mind that this project was initially built as part of a University course. It was mainly for me to practice calling an external API and then transforming the responses into something displayable on a web page. I also used this application to practice developing with Angular and Node.js. 

## Using the Application

You can search for a Bungie Name using the provided search bar. A Bungie Name takes after the format `Guardian#1234`. You can use my Bungie name (62firelight#8173) to test the application. Once finished typing a Bungie Name, you can push "Enter" or click the magnifying glass icon on the right to begin a search. 

An unsuccessful search should return an error message. Otherwise, if the search was successful, you should see the stats for the Destiny 2 player that you've searched for, along with a few filters on the left-hand side.

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
