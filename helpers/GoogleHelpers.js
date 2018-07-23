var axios = require('axios').create({baseURL:'https://www.googleapis.com/gmail/v1/'});

function GoogleInfo(profile, accessToken){
    this.firstName= profile.name.givenName;
    this.lastName = profile.name.familyName;
    this.id = profile.id;
    this.accessToken = accessToken;
}

GoogleInfo.prototype.getEmail = async function(){
    let {data} =  await axios.get(`users/${this.id}/profile`,{
        params:{
            oauth_token: this.accessToken
        }
    });
    this.email = data.emailAddress;
    return this;
}



module.exports.GoogleInfo = GoogleInfo;

module.exports.GetClasses = async function( userInfo ){
    let params = {
        oauth_token: userInfo.accessToken,
        courseStates:'ACTIVE'
    }
    if(userInfo.isTeacher){
        params.teacherId = 'me'
    } else {
        params.studentId = 'me'
    }
    var {data} = await axios.get('courses',{
        params
    })
    return data;
}

module.exports.GetStudentsForClass = async function(classId){
    let {data} = await axios.get(`courses/${classId}/students`);
    return data;
}
