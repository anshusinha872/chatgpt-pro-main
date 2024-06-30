import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";

import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import { MdSend } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { IoIosAttach } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

import { replaceProfanities } from "no-profanity";
import { davinci } from "../utils/davinci";
import { dalle } from "../utils/dalle";
import Modal from "./Modal";
import Setting from "./Setting";

const options = ["ChatGPT", "DALL·E"];
const gptModel = ["gpt-3.5-turbo", "gpt-4"];
const template = [
  {
    title: "Plan a trip",
    prompt: "I want to plan a trip to New York City.",
  },
  {
    title: "how to make a cake",
    prompt: "How to make a cake with chocolate and strawberries?",
  },
  {
    title: "Business ideas",
    prompt: "Generate 5 business ideas for a new startup company.",
  },
  {
    title: "What is recursion?",
    prompt: "What is recursion? show me an example in python.",
  },
];

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const dispatch = useDispatch();
  const aiModel = useSelector((state) => state.user.aiModel);
  const isAiModelAvailable = useSelector(
    (state) => state.user.isAiModelAvailable
  );
  const activeAiModel = useSelector((state) => state.user.activeAiModel);
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const fileInputRef = useRef(); // Create a ref for the file input element
  const [formValue, setFormValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [gpt, setGpt] = useState(gptModel[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageAvailable, setImageAvailable] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
    };

    addMessage(newMsg);
  };
  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();
    const key = window.localStorage.getItem("api-key");
    if (!key) {
      setModalOpen(true);
      return;
    }
    if (!activeAiModel) {
      window.alert("Please select an AI model");
      setModalOpen(true);
      return;
    }
    const cleanPrompt = replaceProfanities(formValue);
    console.log(cleanPrompt);
    return;
    const newMsg = cleanPrompt;
    const aiModel = selected;
    const gptVersion = activeAiModel.id;
    setThinking(true);
    setFormValue("");
    updateMessage(newMsg, false, aiModel);
    try {
      if (aiModel === options[0]) {
        const LLMresponse = await davinci(cleanPrompt, key, activeAiModel.id);
        //const data = response.data.choices[0].message.content;
        LLMresponse && updateMessage(LLMresponse, true, aiModel);
      } else {
        const response = await dalle(cleanPrompt, key);
        const data = response.data.data[0].url;
        data && updateMessage(data, true, aiModel);
      }
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
    }

    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // 👇 Get input value
      sendMessage(e);
    }
  };

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <main className="relative flex flex-col h-screen p-1 overflow-hidden dark:bg-light-grey">
      <div className="mx-auto my-4 tabs tabs-boxed w-fit">
        {/* <a
          onClick={() => setGpt(gptModel[0])}
          className={`${gpt == gptModel[0] && 'tab-active'} tab`}>
          GPT-3.5
        </a>
        <a
          onClick={() => setGpt(gptModel[1])}
          className={`${gpt == gptModel[1] && 'tab-active'} tab`}>
          GPT-4
        </a> */}
        {isAiModelAvailable ? (
          aiModel.map((model, index) => (
            <a
              key={index}
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_AI_MODEL", response: model })
              }
              className={`${activeAiModel.id == model.id && "tab-active"} tab`}
            >
              {model.id}
            </a>
          ))
        ) : (
          <div>
            <a
              onClick={() => setGpt(gptModel[0])}
              className={`${gpt == gptModel[0] && "tab-active"} tab`}
            >
              GPT-3.5
            </a>
            <a
              onClick={() => setGpt(gptModel[1])}
              className={`${gpt == gptModel[1] && "tab-active"} tab`}
            >
              GPT-4
            </a>
          </div>
        )}
      </div>

      <section className="flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32">
        {messages.length ? (
          messages.map((message, index) => (
            <Message key={index} message={{ ...message }} />
          ))
        ) : (
          <div className="flex my-2">
            <div className="w-screen overflow-hidden">
              <ul className="grid grid-cols-2 gap-2 mx-10">
                {template.map((item, index) => (
                  <li
                    onClick={() => setFormValue(item.prompt)}
                    key={index}
                    className="p-6 border rounded-lg border-slate-300 hover:border-slate-500"
                  >
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="text-sm">{item.prompt}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </section>
      {imageAvailable && (
        <div className="px-4 sm:px-10 md:px-32">
          <div className="image-card-container flex flex-row	">
            {imageArray.length > 0 &&
              Array.from(imageArray).map((image, index) => (
                <div
                  key={index}
                  className="image-card m-2"
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    transition: "all 0.3s ease-in-out",
                    background: "#2e3740",
                    padding: "5px 0px 0px 0px",
                  }}
                >
                  <span className="w-full flex justify-end">
                    <RxCross2
                      size={20}
                      onClick={() => {
                        setImageArray(
                          Array.from(imageArray).filter((img) => img !== image)
                        );
                        if (imageArray.length === 1) {
                          setImageAvailable(false);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </span>
                  <img
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="image p-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      <form
        className="flex flex-col px-10 mb-2 md:px-32 join sm:flex-row"
        onSubmit={sendMessage}
      >
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full sm:w-40 select select-bordered join-item"
        >
          <option>{options[0]}</option>
          <option>{options[1]}</option>
        </select>
        <div className="flex items-stretch justify-between w-full">
          <textarea
            ref={inputRef}
            className="w-full grow input input-bordered join-item max-h-[20rem] min-h-[3rem]"
            value={formValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <input
            ref={fileInputRef} // Assign the ref to the input element
            type="file"
            name=""
            className="image-upload-btn"
            id=""
            onChange={(e) => {
              if (e.target.files.length > 5) {
                alert("You can only upload 5 images at a time");
                return;
              }
              e.preventDefault();

              setImageAvailable(true);
              setImageArray(e.target.files);
            }}
            multiple={true}
            accept="image/*"
            maxLength={5}
            style={{ display: "none" }} // Hide the input element
          />
          <button
            type="button"
            className="join-item btn"
            onClick={() => fileInputRef.current.click()}
          >
            <IoIosAttach size={30} />
          </button>
          <button type="submit" className="join-item btn" disabled={!formValue}>
            <MdSend size={30} />
          </button>
        </div>
      </form>
      <Modal title="Setting" modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </main>
  );
};

export default ChatView;
