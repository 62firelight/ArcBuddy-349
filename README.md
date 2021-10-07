# Arc Buddy

Arc Buddy is a web application that uses the [Bungie.Net API](https://bungie-net.github.io/) to give quality-of-life features for [Destiny 2](https://store.steampowered.com/app/1085660/Destiny_2/) players. Examples of these features include being able to look up player stats and save "snapshots" of player stats.

Currently, Arc Buddy is more of a "proof-of-concept" than anything else. I mainly created it for personal use so that I could test the functions (of which there are many) of the Bungie.Net API using somewhat familiar frameworks.

## Setup

There are two different options to interact with the application.

The first option is mainly for other developers familiar with Angular and Node.js, so that they can develop for the repository and test any contributions at will.

The second option is mainly for users who want to use the deployed version of Arc Buddy without needing to install Node.js and the Angular CLI. However, this is only possible if the EC2 instance running Arc Buddy is active (**still active** at the time of writing).

### For developers
These instructions assume some familiarity with command line interfaces (CLIs). You should also have created a [Bungie.net account](https://www.bungie.net/) and an [AWS account.](https://aws.amazon.com/) 

1. Register an API key by [creating an application on Bungie.net](https://www.bungie.net/en/application)
2. Install [Node.js.](https://nodejs.org/en/)
3. Install the Angular CLI globally by typing `npm install -g @angular/cli`
4. On an AWS account, go to S3 and create a bucket called `arc-buddy`
5. On the same AWS account, go to Secrets Manager, create a secret called `arc-buddy-349-api-key` and store a row with the key `apiKey` and value consisting of the API key you registered earlier. Note that the profile name should be `personal` instead of `default` as the page suggests
6. Set up your AWS credentials using the instructions from [this AWS documentation page](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)
7. Clone the repository into a directory of your choice using `git clone https://github.com/62firelight/ArcBuddy-349.git`
8. On a terminal, start the back-end server by navigating into the "back-end" folder and typing `node app.js`
9. On another terminal, start the front-end server by navigating into the "front-end" folder and typing `ng serve` or `ng s`
10. Navigate to localhost:4200 to use the application

### For users
The EC2 instance running Arc Buddy is still active at the time of writing.

Users can simply navigate to http://ec2-34-239-110-136.compute-1.amazonaws.com/ on a web browser and use the application there.

## Usage

### Bungie Name Examples
* Datto#6446
* Gladd#2640
* Riot#1468
* Teawrex#4125
* Ascendant Nomad#8218

## Architecture


## Special Thanks

* Bungie for providing such an extensive API ([GitHub](https://github.com/Bungie-net/api))
* brandonmanke for providing an easy-to-use API wrapper that made calling the API much easier ([GitHub](https://github.com/brandonmanke/node-destiny-2))
