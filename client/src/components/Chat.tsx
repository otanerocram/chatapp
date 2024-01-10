import { useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useRequest } from "ahooks";
import { EmailUser, MessagePayload } from "../types/user";
import { getMessages, getUserList, sendNewChatMessage } from "../controllers/Messaging";
import { AxiosResponse } from "axios";
// import useWebSocket from "react-use-websocket";

const Chat = () => {
  const [userList, setUserList] = useState<Array<EmailUser>>([]);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [chat, setChat] = useState({
    to: "",
    from: "",
    message: "",
    toNickname: "",
  });
  const location = useLocation();
  const divRef = useRef<HTMLDivElement | null>(null);

  const socket = new WebSocket("wss://localhost:5050");

  socket.addEventListener("open", (event) => {
    console.log("opened");
  });

  socket.addEventListener("message", (message: any) => {
    console.log(message);
  });

  // useWebSocket("wss://localhost:5050", {
  //   onOpen: () => {
  //     console.log("WebSocket connection established.");
  //   },
  //   shouldReconnect: (closeEvent) => true, // Reconnect if the connection is closed
  //   onClose: () => {
  //     console.info("closed");
  //   },
  //   onError(event) {
  //     console.error(`An error occurred: ${event}`);
  //   },
  // });

  const { loading } = useRequest(() => getUserList(), {
    onSuccess: (data) => {
      const userList =
        Object.entries(data)?.map(([key, value]) => {
          return {
            ...value,
          };
        }) ?? [];

      const filteredData = userList?.filter((item) => item.email !== location.state?.loggedEmail);
      setUserList(filteredData);
    },
  });

  const handleChange = (event: any) => {
    const { value } = event.target;
    setChat((prev) => ({
      ...prev,
      message: value,
    }));
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      postMsg();
    }
  };

  const loadMessages = async (from: string, to: string) => {
    const response: AxiosResponse = await getMessages({
      from,
      to,
    });

    setMessages(response.data);

    divRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setDestination = async (email: string, nickname: string) => {
    const from = location.state?.loggedEmail;
    setChat((prev) => ({ ...prev, to: email, from, toNickname: nickname }));

    loadMessages(from, email);
  };

  const postMsg = async () => {
    try {
      const timestamp = Math.floor(new Date().getTime() / 1000.0);
      const { to, from, message } = chat;
      const msgPayload: MessagePayload = {
        to,
        from,
        timestamp,
        message,
      };

      await sendNewChatMessage(msgPayload);
      setChat((prev) => ({ ...prev, message: "" }));

      loadMessages(from, to);
    } catch (error) {
      console.error(error);
    }
  };

  const itsMe = (from: string) => {
    return from === chat.from;
  };

  const convertTime = (epoch: number) => {
    const date = new Date(epoch * 1000);
    return `${date.toLocaleTimeString()}`;
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100">
      {loading && <div>Loading...</div>}
      <h2>
        Welcome {location.state?.loggedNickname} <span className="text-gray-500">({location.state?.loggedEmail})</span>
      </h2>
      <p className="text-left text-sm text-gray-500">
        <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Logout
        </Link>
      </p>
      <div className="mt-10 bg-white">
        <div className="grid grid-cols-2 gap-8 m-10">
          <div className="col-span-1 w-full border-r-2">
            <h3 className="font-sans text-left text-gray-600 font-bold border-b border-teal-500 p-2">Connected users</h3>
            <ul className="divide-y divide-gray-100">
              {userList.length > 0 &&
                userList?.map((person) => (
                  <li
                    key={person.email}
                    className="flex justify-between gap-x-6 py-5 cursor-pointer! hover:bg-gray-100"
                    onClick={() => setDestination(person.email, person.nickname)}
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{person.nickname}</p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div className="col-span-1 w-full">
            <h3 className="font-sans text-left text-gray-600 font-bold border-b border-teal-500 py-2">Chat with {chat.toNickname}</h3>
            <div id={"divRef"} ref={divRef} className="h-96 min-h-60 overflow-y-scroll">
              <ul>
                {messages?.length > 0 &&
                  messages?.map((message) => (
                    <li>
                      <div className={`flex items-start gap-2.5 ${itsMe(message.from) ? "justify-end" : "justify-start"} my-2`}>
                        <div
                          className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl  ${
                            itsMe(message.from) ? "dark:bg-green-700" : "dark:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{itsMe(message.from) ? "You" : message.from}</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{convertTime(message.timestamp)}</span>
                          </div>
                          <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.message}</p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            {chat.to && (
              <div className="mt-2">
                <div className="flex items-center border-b border-teal-500 py-2">
                  <input
                    placeholder="message"
                    id="message"
                    name="message"
                    type="text"
                    onChange={handleChange}
                    required
                    onKeyDown={handleKeyDown}
                    value={chat.message}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                    type="button"
                    onClick={() => postMsg()}
                  >
                    send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
