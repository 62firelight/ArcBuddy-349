# Arc Buddy

Arc Buddy is a web application that uses the [Bungie.Net API](https://bungie-net.github.io/) to give quality-of-life features for [Destiny 2](https://store.steampowered.com/app/1085660/Destiny_2/) players. Examples of these features include being able to look up player stats and save "snapshots" of player stats.

Currently, Arc Buddy is more of a "proof-of-concept" than anything else. I mainly created it for personal use so that I could test the functions (of which there are many) of the Bungie.Net API using somewhat familiar frameworks. I was inspired by other third-party apps that make use of the Bungie.Net API, such as [Destiny Item Manager (DIM)](https://destinyitemmanager.com/en/), which make it much more convenient to perform actions within the game without needing to sit through loading screens.

## Setup

There are two different options to interact with the application.

The first option is mainly for users who want to use the deployed version of Arc Buddy without needing to install Node.js and the Angular CLI. However, this is only possible if the EC2 instance running Arc Buddy is active.

The second option is mainly for other developers familiar with Angular and Node.js, so that they can develop for the repository and test any contributions at will.

### For users
The EC2 instance running Arc Buddy is still active at the time of writing.

Users can simply navigate to http://ec2-34-239-110-136.compute-1.amazonaws.com/ on a web browser and use the application there.

### For developers
These instructions assume some familiarity with command line interfaces (CLIs). You should also have created a [Bungie.net account](https://www.bungie.net/) and an [AWS account.](https://aws.amazon.com/) 

1. Register an API key by [creating an application on Bungie.net](https://www.bungie.net/en/application)
2. Install [Node.js.](https://nodejs.org/en/)
3. Install the Angular CLI globally by typing `npm install -g @angular/cli`
4. On an AWS account, go to S3 and create a bucket called `arc-buddy`
5. On the same AWS account, go to Secrets Manager, create a secret called `arc-buddy-349-api-key` and store a row with the key `apiKey` and value consisting of the API key you registered earlier. Note that the profile name should be `personal` instead of `default` as the page suggests
6. Set up your AWS credentials using the instructions from [this AWS documentation page](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)
7. Clone the repository into a directory of your choice using `git clone https://github.com/62firelight/ArcBuddy-349.git`
8. On a terminal, start the back-end server by navigating into the "back-end" folder, typing `npm install` to install dependencies and then typing `node app.js` once all dependencies are downloaded
9. On another terminal, start the front-end server by navigating into the "front-end" folder, typing `npm install` to install dependencies and then typing `ng serve` (or `ng s` for short) once all dependencies are downloaded
10. Navigate to localhost:4200 to use the application

## Usage

When using the application, a sidenav menu containing all saved profiles from S3 will be visible on the left, along with a button to hide the sidenav and a search bar in the center. 

You can search for a Bungie Name using the provided search bar. A Bungie Name takes after the format `name#code`. My Bungie Name (`62firelight#8173`) is provided as an example once you click on the search bar, but you can use any Bungie Names (which belong to various Destiny content creators) from the list below as well. Once finished typing a Bungie Name, you can push "Enter" or click the magnifying glass icon on the right to begin a search. 

### Bungie Name Examples
* Datto#6446
* Gladd#2640
* Riot#1468
* Teawrex#4125
* Ascendant Nomad#8218

An unsuccessful search should return an error message. Otherwise, if the search was successful, you should see a grid-based layout showing the stats of the Bungie Name you've searched for. Below, you can see the various PvE stats for the Bungie Name across all of their characters.

You can save the profile you've searched for by clicking the "Save" button. Once finished, a green message should appear to show that the PUT to S3 was successful and the profile you've saved should appear on the left (if not there already). If the profile you've saved was already present, then the saved profile simply gets overridden with the latest version. There is no error handling for this operation, so you may have to open the developer console (F12 for Google Chrome) to see what went wrong. 

To see the stats for each saved profile, you can click the names of each profile on the left. Be careful not to click the red "X" button unintentionally, as that will immediately delete the profile without any confirmation dialog. 

If you find that the saved profiles are not updating correctly (e.g., you've saved a profile but it doesn't show up on the sidenav), then you can click the "Refresh" button at the top of the sidenav to refresh the list of saved profiles. 

You may click the "Hide Saved Profiles" button to hide the sidenav, and click it again (where it will be "Show Saved Profiles) to show the sidenav.

### Future Features?

The majority of Arc Buddy was developed in the span of a week, which is probably obvious given the lack of error handling when interacting with S3. This means that the list of features is rather short as a result. Below, I have included some ideas for features that could be added by me or other developers. 

* Better layout to display the data (e.g., categories for playtime stats, weapon-related stats, completion stats, etc or having graphs)
* Show what Destiny 2 vendors are selling at any given point (e.g., see what mods are being sold by Ada-1)

## Architecture

When not deployed, Arc Buddy only makes use of two non-EC2 services on Amazon Web Services (AWS) for its functionality. These include:

* [**Amazon S3**](https://aws.amazon.com/s3/)
* [**AWS Secrets Manager**](https://aws.amazon.com/secrets-manager/)

When deployed, Arc Buddy also uses two virtual machines (VMs) in the form of EC2 instances to host servers. These servers include:

* **Web server**
  * A [NGINX web server](https://www.nginx.com/)
  * Hosts a dynamic website using a group of files built using the [Angular](https://angular.io/) web framework (`ng build`) 
  * The web server will make calls to the API server for its dynamic functionality (e.g., fetching player stats and saving them into S3).
* **API server**
  * Another [NGINX web server](https://www.nginx.com/) which runs a [Node.js server](https://nodejs.org/en/) internally using the [PM2 process manager](https://pm2.keymetrics.io/)
  * Hosts the REST API that the web server will regularly call
  * Uses the [node-destiny-2](https://github.com/brandonmanke/node-destiny-2) as an API wrapper to call the [Bungie.Net API](https://bungie-net.github.io/)
  * Uses the [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) to call AWS Secrets Manager and Amazon S3
  * Other notable modules that the API uses include [Express.js](https://expressjs.com/) and [CORS](http://expressjs.com/en/resources/middleware/cors.html)

Both VMs use the [Ubuntu Server 18.04 LTS (HVM)](https://aws.amazon.com/marketplace/pp/prodview-pkjqrkcfgcaog) for its Amazon Machine Image (AMI).

The NGINX web server for both servers simply acts as a reverse proxy. For example, requests made to the API server's address (e.g., some EC2 DNS) will fetch data from the actual Node.js server running on `localhost:3000`, but this data will appear to be coming from the API server address.

## Special Thanks

* Bungie for providing such an extensive API ([GitHub](https://github.com/Bungie-net/api))
* brandonmanke for providing an easy-to-use API wrapper that made calling the API much easier ([GitHub](https://github.com/brandonmanke/node-destiny-2))
