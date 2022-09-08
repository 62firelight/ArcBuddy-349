# Arc Buddy
[![Jasmine Tests](https://github.com/62firelight/ArcBuddy-349/actions/workflows/main.yml/badge.svg)](https://github.com/62firelight/ArcBuddy-349/actions/workflows/main.yml)

Arc Buddy is a web application that uses the [Bungie.Net API](https://bungie-net.github.io/) to look up stats for [Destiny 2](https://store.steampowered.com/app/1085660/Destiny_2/) players. There is also another page dedicated to viewing the items for in-game vendors, though this is currently a work-in-progress feature.

There was formerly a feature where player stats could be saved to MongoDB, but I ended up scrapping it after not knowing how to expand it into something useful. 

Contributions are welcome, but keep in mind that this project was mainly for me to practice calling an external API and then transforming the responses into something displayable on a web page. I also used this as a way to practice developing with Angular and Node.js. 

## Setup

There are two different options to interact with the application.

The first option is mainly for users who want to use the deployed version of Arc Buddy without needing to install Node.js and the Angular CLI. However, this is only possible if the Heroku app is active.

The second option is mainly for other developers familiar with Angular and Node.js, so that they can develop for the repository and test any contributions at will.

### For users
The application should currently be live on Heroku, but may be down for maintenance.

You can access the application through this link if it is live:

https://arc-buddy-349.herokuapp.com/

### For developers
These instructions assume some familiarity with command line interfaces (CLIs). You should also have created a [Bungie.net account](https://www.bungie.net/).

1. Register for an API key and client secret by [creating an application on Bungie.net](https://www.bungie.net/en/application)
2. You will need to obtain an OAuth refresh token for your created application by following the OAuth process [detailed here](https://github.com/Bungie-net/api/wiki/OAuth-Documentation)
2. Set up environment variables for the API key (name should be ARC_KEY), refresh token (name should be REFRESH_TOKEN) and client secret (name should be CLIENT_SECRET)
3. Install [Node.js.](https://nodejs.org/en/)
4. Install the Angular CLI globally by typing `npm install -g @angular/cli`
5. Clone the repository into a directory of your choice using `git clone https://github.com/62firelight/ArcBuddy-349.git`
6. On a terminal, navigate into the "back-end" folder and then type `npm install` to install required dependencies for the back-end
7. Navigate back into the ArcBuddy-349 root folder and then into the "front-end" folder, then type `npm install` to install required dependencies for the front-end
8. Navigate back into the ArcBuddy-349 root folder and type `npm run dev` to run the development server
9. Navigate to localhost:4200 to use the application

## Looking Up Stats

You can search for a Bungie Name using the provided search bar. A Bungie Name takes after the format `Guardian#1234`. You can use my Bungie name (62firelight#8173) to test the application. Once finished typing a Bungie Name, you can push "Enter" or click the magnifying glass icon on the right to begin a search. 

An unsuccessful search should return an error message. Otherwise, if the search was successful, you should see a grid-based layout showing the stats of the Bungie Name you've searched for. Below, you can see the various stats for the Bungie Name across all of their characters.

## Screenshots

### Homepage

![image](https://user-images.githubusercontent.com/54054879/189047757-36e7ae32-7ce2-4254-b781-02696c6ba30c.png)

### Search Players

![image](https://user-images.githubusercontent.com/54054879/189047912-bfc64b9f-fffe-49c6-9df5-289b4033ea76.png)

### Search Players (player found)

![image](https://user-images.githubusercontent.com/54054879/189048005-ad9927bf-ab69-4633-bed8-7eda05f56925.png)

### Search Players (no player found)

![image](https://user-images.githubusercontent.com/54054879/189048080-f986e690-1371-4117-a0b6-a0a2d179c7b5.png)

### Vendors (work-in-progress)

![image](https://user-images.githubusercontent.com/54054879/189048214-ffbea16c-fb3a-443c-beb8-5b40471e4d92.png)

## Special Thanks

* Bungie for providing such an extensive API ([GitHub](https://github.com/Bungie-net/api))
* brandonmanke for providing an easy-to-use API wrapper that made calling the API much easier ([GitHub](https://github.com/brandonmanke/node-destiny-2))
* FraWolf and Kasui92 for creating Quria, an up-to-date API wrapper ([GitHub](https://github.com/FraWolf/quria))
