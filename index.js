var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var moment = require('moment');
var cors = require('cors');
var app = express();
var RSS = require('rss');
var tempResponse = {
    "success": true,
    "rants": [
      {
        "id": 2046279,
        "text": "Where's my caviar",
        "score": 62,
        "created_time": 1553920784,
        "attached_image": {
          "url": "https://img.devrant.com/devrant/rant/r_2046279_6FTxJ.jpg",
          "width": 640,
          "height": 465
        },
        "num_comments": 8,
        "tags": [
          "joke/meme",
          "legend",
          "if statements",
          "conditions"
        ],
        "vote_state": 0,
        "edited": false,
        "rt": 1,
        "rc": 3,
        "user_id": 2030717,
        "user_username": "iampoppyxx",
        "user_score": 365,
        "user_avatar": {
          "b": "7bc8a4",
          "i": "v-21_c-3_b-1_g-m_9-1_1-4_16-12_3-1_8-1_7-1_5-1_12-4_6-102_2-1_22-1_11-1_18-1_19-1_4-1.jpg"
        },
        "user_avatar_lg": {
          "b": "7bc8a4",
          "i": "v-21_c-1_b-1_g-m_9-1_1-4_16-12_3-1_8-1_7-1_5-1_12-4_6-102_2-1_22-1_11-1_18-1_19-1_4-1.png"
        }
      }]
  }
  
app.use(bodyParser.json());
app.use(cors());
var feedOptions = {
    title:'DevRant unofficial RSS',
    feed_url: 'https://example.com',
    site_url: 'https://devrant.com',
}
var tags = tempResponse.rants[0].tags;
if(tags.length > 0){
    tags = tags.join(', ');
}
var itemOptions = {
    title: 'Rant from ' + tempResponse.rants[0].user_username,
    description: '<h4>' + tempResponse.rants[0].text + '</h4>' + 
                '<a href="' + tempResponse.rants[0].attached_image.url + '" target="_blank"><img src="'+ tempResponse.rants[0].attached_image.url +'" height="'+ tempResponse.rants[0].attached_image.height +'" width="' + tempResponse.rants[0].attached_image.width + '" /></a>' + 
                '<h5>' + tempResponse.rants[0].score + ' ++s | '+ tempResponse.rants[0].num_comments + ' comments </h5> ' +
                '<p> Tags: <i>' + tags + '</i></p>' +
                '<p> User profile: <a href="https://devrant.com/users/'+ tempResponse.rants[0].user_username +'" target="_blank">'+ tempResponse.rants[0].user_username +'</a></p>' +
                '<p> Rant link: <a href="https://devrant.com/rants/'+ tempResponse.rants[0].id +'" target="_blank">https://devrant.com/rants/'+ tempResponse.rants[0].id +'</a></p>',
    url: 'https://devrant.com/rants/' + tempResponse.rants[0].id, // link to the item
    guid: tempResponse.rants[0].created_time,
    date: moment.unix(tempResponse.rants[0].created_time).toDate(),
}
var feed = new RSS(feedOptions);
feed.item(itemOptions);
var xml = feed.xml({indent: true});



app.get('/',(req,response) => {
    console.log(xml);
    response.send(xml);
});

app.get('/rss',(req,res) => {
    var options = {
        url:'https://devrant.com/api/devrant/rants?app=3&sort=top&range=day&limit=20&skip=0',
        method: 'GET',
        
      }    
    request(options,(error,response,body)=>{
        console.log(options.url);
        if(error){
            console.log("Error connecting " + error);
            res.send(error);
        }
        else{
            console.log(response.statusCode + ' ' + response.statusMessage + ' for: ' + options.url);
            res.send(body);
        }
    })   
});

app.listen(800,() => {
    console.log('Listening on 800');
});