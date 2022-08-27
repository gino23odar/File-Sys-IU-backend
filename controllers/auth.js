const {connect} = require('getStream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
  try {
    //get from the front-end
    const {fullName, username, password, phoneNumber} = req.body;
    //create a random user Id: 16 digits in hexadecimal
    const userId = crypto.randomBytes(16).toString('hex');
    //connection to stream
    const serverClient = connect(api_key, api_secret, app_id);
    //create a password for the user token 
    const hashedPassword = await bcrypt.hash(password, 10);
    //create token for the user
    const token = serverClient.createUserToken(userId);
    
    //get the values straight from the front-end to ensure secure authentication
    res.status(200).json({token, fullName, username, userId, hashedPassword, phoneNumber})

  } catch (error) {
    console.log(error);
    res.status(500).json({message: error});
  }
};

const login = async(req, res) => {
  try {
    const {username, password} = req.body;
    const serverClient = connect(api_key, api_secret, app_id);
    //new instance of streamChat
    const client = StreamChat.getInstance(api_key, api_secret);
    //query all users that match this username
    const {users} = await client.queryUsers({name: username});

    if(!users.length) return res.status(400).json({message: 'Benutzername nicht gefunden.'});

    //decrypt the password to see if it matches
    const success = await bcrypt.compare(password, users[0].hashedPassword);
    //create new token for this specific user's id.
    const token = serverClient.createUserToken(users[0].id);
    if(success){
      res.status(200).json({token, fullName: users[0].fullName, username, userId: users[0].id});
    } else {
      res.status(500).json({message: 'falsches Kennwort'});
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({message: error});
  }
};

module.exports = {signup, login}