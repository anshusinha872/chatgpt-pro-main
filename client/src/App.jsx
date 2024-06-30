import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import Setting from "./components/Setting";
import { Provider } from "react-redux";
import store from "./store/store";
const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const apiKey = window.localStorage.getItem("api-key");
    if (!apiKey) {
      setModalOpen(true);
    }
  }, []);
  return (
    <Provider store={store}>
      <ChatContextProvider>
        <Modal
          title="Setting"
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        >
          <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </Modal>
        <div className="flex transition duration-500 ease-in-out">
          <SideBar />
          <ChatView />
        </div>
      </ChatContextProvider>
    </Provider>
  );
};

export default App;
