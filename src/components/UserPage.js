import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { UserSession } from "../context/UserSession";
import Settings from "./Settings";
import UserPost from "./UserPost";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import SideNarBar from "./SideNavBar";
import { userBaseUrl, notificationBaseUrl } from "./urls/urls";
import Chat from "./Chat";
import {MessageContextProvider} from "../context/MessageContext";
import {ChatHelperContext} from "../context/ChatHelper";

const UseData = styled.div`
 
  .imageContainer {
    margin: auto;
    margin-top: 20px;
    border-radius: 50%;
    background: #d2d5da;
    width: 30%;
    max-width: 200px;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
  h1 {
    color: white;
  }
  h3 {
    color: white;
  }
  .infoContainer {
    text-align: center;
  }

  .nameContainer {
    margin: auto;
    text-align: center;
  }
  hr {
    width: 90%;
    text-align: center;
  }
  .setFriend {
    width: 150px;
    font-size: 20px;
    text-align: center;
    margin-left: 20px;
  }
 
`;

const UserPageDiv = styled.div`
.chatSide{
      flex:0.3;
    }
    .feed {
    flex: 0.3;
  }
@media (max-width:960px ){
     
     .chatSide{
     flex:0;
     } 
     .feed{
     flex:1;
     }
    }
    
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
 
`;

const UserPage = (props) => {
  const id = props.match.params.id;
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useContext(ChatHelperContext);
  const [friendIdList, setFriendIdList] = useState([]);
  const session = useContext(UserSession)[0][0];
  let content = "";

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${userBaseUrl}/${id}`).then((res) => {
      setUserName(res.data.userName);
      setProfilePicture(res.data.profilePicture);
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setFriendIdList(
        res.data.friends.map((friend) => {
          return friend;
        })
      );
      setIsLoading(false);
    });
  }, [id]);

  const handleFriend = (e) => {
    e.preventDefault();
    axios.get(`${notificationBaseUrl}/add-friend-request-notification/${id}/${session}`).then((res) => {
      setFriendIdList(res.data);
      alert("Friend request sent!");
    });
  };

  const handleRemoveFriend = (e) => {
    e.preventDefault();
    axios.get(`${userBaseUrl}/${id}/remove-friend/${session}`).then((res) => {
      setFriendIdList(res.data);
    });
  };

  if (!isLoading) {
    content = (
      <UserPageDiv>
        <SideNarBar className="data" />
        <UseData className="feed">
          <div className="imageContainer">
            <img src={profilePicture} alt="profilePicture" />
          </div>
          <div className="nameContainer">
            <h1>{userName}</h1>
          </div>
          <div className="infoContainer">
            <h1>Personal Details:</h1>
            <h3>
              Name: {firstName} {lastName}
            </h3>
          </div>
          <div className="profileButtons">
            {parseInt(id) !== session ? (
              !friendIdList.includes(session) ? (
                <PersonAddIcon color="secondary" fontSize="large" onClick={handleFriend} />
              ) : (
                <PersonAddDisabledIcon color="secondary" fontSize="large" onClick={handleRemoveFriend} />
              )
            ) : (
              <Settings history={props.history} />
            )}
          </div>
          <hr />
          <UserPost id={id} history={props.history} />
        </UseData>
        <div className="chatSide">
          <MessageContextProvider>
            <Chat show={showChat} setShowChat={setShowChat.bind(this)} />
          </MessageContextProvider>
        </div>
      </UserPageDiv>
    );
  } else content = "Loading...";

  return content;
};

export default UserPage;
