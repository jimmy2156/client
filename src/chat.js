import { useEffect, useState } from "react"
import ScrollToBottom from 'react-scroll-to-bottom'




function Chat(props) {

    const [currentMessage, setcurrentMessage] = useState('')
    const [showChat, setshowChat] = useState([])
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: props.room,
                author: props.userName,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await props.socket.emit("send_message", messageData)
            setshowChat((chat) => [...chat, messageData])
            setcurrentMessage("");
        }
        
    }
    useEffect(() => {
        let test = false;
    props.socket.on("receive_message", (data) => {
      if (!test) setshowChat((list) => [...list, data]);
    });
    return () => {
      test = true;
    };
  }, [props.socket]);


    return (<div className="chat-window">
        <div className="chat-header">
            <p>Live Chat</p>
        </div>
        <div className="chat-body">
            <ScrollToBottom className="message-container">
            {showChat.map((messageContent) => {
                return (<div className="message" id={props.userName === messageContent.author ? "you" : "other"}> 
                    <div>
                        <div className="message-content">
                            <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                            <p id="time">{messageContent.time}</p>
                            <p id="author">{messageContent.author}</p>
                        </div>
                    </div>
                </div>)
            })}</ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input type="text" value={currentMessage} placeholder="Hey..." onChange={(event) => {setcurrentMessage(event.target.value)}} onKeyPress={(event) => {event.key === "Enter" && sendMessage()}}/>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>)
}


export default Chat