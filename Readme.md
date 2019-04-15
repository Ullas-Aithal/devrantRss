# Unofficial RSS feed for devRant

A server side app that gets the latest rants from devRant using unofficial [devRant API](https://devrant-docs.github.io/) and builds RSS feed. Each feed will have the rant, image (if present), ++s, comments, user profile link and link to the rant.

![Screenshot](screenshot.png?raw=true)

## Build Instructions
From the root folder run:

```bash
node index.js
```

Open your browser and go to localhost:8090/getRss and you'll see the xml. 

You can host this in your own server and provide the url for your favorite rss reader.

Alternatively, you can deploy directly to heroku. Checkout herokuBuild branch. After deploying you can go to https://<<your_heroku_app>>/getRss.

## Configuration
* You can change the port number to anything you would like. It's defined in the variables
* You can change the api call for devRant to any other api call. You can find more information about the api here: https://devrant-docs.github.io/
* The script creates new rss feed every time the script is called.
* You can add more information to the feed by appending html tag to itemOptions.description object

## Credits
[Skayo](https://github.com/Skayo) for the unofficial devRant api 
