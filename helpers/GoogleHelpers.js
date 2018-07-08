

var axios = require('axios').create({baseURL:'https://www.googleapis.com/gmail/v1/'});

function GoogleInfo(profile, accessToken){
    this.firstName= profile.name.givenName;
    this.lastName = profile.name.familyName;
    this.id = profile.id;
    this.accessToken = accessToken;
}

GoogleInfo.prototype.getEmail = async function(){
    var {data} =  await axios.get(`users/${this.id}/profile`,{
        params:{
            oauth_token: this.accessToken
        }
    });
    this.email = data.emailAddress;
    return this;
}

module.exports = GoogleInfo;