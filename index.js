var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var moment = require('moment');
var cors = require('cors');
var app = express();
var RSS = require('rss');
var Convert = require('ansi-to-html');
var convert = new Convert();
var portNumber = 8090;
var devRantAPI = 'https://devrant.com/api/devrant/rants?app=3&sort=top&range=day&limit=20&skip=0';
var feedOptions = {
    title:'DevRant Unofficial RSS',
    feed_url: 'https://example.com',
    site_url: 'https://devrant.com',
}
var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(bodyParser.json());
app.use(cors(corsOptions));


app.get('/getrss',(req,res) => {
          buildFeed(res);
});

app.listen(portNumber,() => {
    console.log('Listening on ' + portNumber);
});

/**
 * This function gets the rants, creates a feed and writes the xml to the response
 * @param {response} res - Response for /getrss 
 */
function buildFeed(res){
    //Get rants
    getRants().then((rants)=>{
        //Build feed by adding rants as item to feed
        buildAndAddToFeed(rants).then((xml)=>{
            //Send response as rss xml
            res.type('rss');
            res.send(xml);
        },(error) => {
            res.send(error);
        })
    }, (error) => {
        res.send(error);
    });
}
/**
 * This function gets the rants from devrant and returns a promise 
 * API call - https://devrant-docs.github.io/
 */
function getRants(){
    var options = {
        url: devRantAPI,
        method: 'GET',        
    }
    return new Promise((resolve, reject)=>{   
        request(options,(error,response,body)=>{
            if(error){
                reject(error);
            }
            else{
                var result = JSON.parse(body);
                //If 'success' type is undefined, then we didn't get the right response
                if(result.success === undefined){
                    reject("Error getting rants. 'success' parameter in response is undefined");
                }
                //If 'success' type is false, then we are not calling the api right
                if(!result.success){
                    reject("Error getting rants. 'success' parameter in response is undefined");
                }
                //No 'rants' object. Nothing to do
                if(result.rants === undefined){
                    reject("rants object in response is undefined");
                }
                else{
                    //Return rants
                    resolve(result.rants);
                }
            }
        });
    })
}

/**
 * This function takes the rants, loops over each rant, adds most of the information as HTML and returns the XML
 * @param {Object} rants 
 */
function buildAndAddToFeed(rants){
    return new Promise((resolve,reject) => {  
        //No rants    
        if(rants.length <=0 ){
            reject("No rants");
        }
        else{
            //Create new RSS feed
            var feed = new RSS(feedOptions);
            //For each rant
            for(var index in rants){
                var itemOptions = {};
                //Rant title which will be username
                itemOptions.title = 'Rant from ' + rants[index].user_username;
                //Start building description as HTML
                var rantText = convert.toHtml(rants[index].text);
                itemOptions.description = '<p>' + rantText + '</p>'; 
                //Add image to the HTML only if it exists
                if(rants[index].attached_image != ""){
                    itemOptions.description += '<a href="' + rants[index].attached_image.url + '" target="_blank"><img src="'+ rants[index].attached_image.url +'" height="'+ rants[index].attached_image.height +'" width="' + rants[index].attached_image.width + '" /></a>';
                }
                itemOptions.description += '<h5>' + rants[index].score + ' ++s | '+ rants[index].num_comments + ' comments </h5> ';
                if(rants[index].tags != ""){
                    var tags = rants[index].tags;
                    if(tags.length > 0){
                        tags = tags.join(', ');
                        itemOptions.description += '<p> Tags: <i>' + tags + '</i></p>';
                    }                
                }
                //Link to user profile
                itemOptions.description += '<p> User profile: <a href="https://devrant.com/users/'+ rants[index].user_username +'" target="_blank">'+ rants[index].user_username +'</a></p>';
                //Link to the rant
                itemOptions.description += '<p> Rant link: <a href="https://devrant.com/rants/'+ rants[index].id +'" target="_blank">https://devrant.com/rants/'+ rants[index].id +'</a></p>';
                //Link to the rant as a separate variable
                itemOptions.url = 'https://devrant.com/rants/' + rants[index].id;
                //Unique id which will be the created time which will be unique
                itemOptions.guid = rants[index].created_time;
                //Conver unix time to date object
                itemOptions.date = moment.unix(rants[index].created_time).toDate();
                //Add item to feed
                feed.item(itemOptions);
            }
            //Send xml
            resolve(feed.xml({indent: true}));
        }
    });
}

