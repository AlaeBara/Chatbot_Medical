class Chatbox {
    constructor() {
      this.args = {
        chatBox: document.querySelector(".chatbox__support"),
        sendButton: document.querySelector(".send__button"),
        cleanButton: document.querySelector("#clean-btn"),
      };
  
      this.state = false;
      this.messages = [];
    }
  
    display() {
      const { chatBox, sendButton, cleanButton } = this.args;
      sendButton.addEventListener("click", () => this.onSendButton(chatBox));
      cleanButton.addEventListener("click", () => this.onCleanButton(chatBox));
      const node = chatBox.querySelector("input");
      node.addEventListener("keyup", ({ key }) => {
        if (key === "Enter") {
          this.onSendButton(chatBox);
        }
      });
    }
  
    onSendButton(chatbox) {
      var textField = chatbox.querySelector("input");
      let text1 = textField.value;
      if (text1 === "") {
        return;
      }
      let msg1 = { name: "User", message: text1 };
      this.messages.push(msg1);
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: JSON.stringify({ message: text1 }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((r) => r.json())
        .then((r) => {
          let msg2 = { name: "Sam", message: r.answer };
          this.messages.push(msg2);
          this.updateChatText(chatbox);
          textField.value = "";
        })
        .catch((error) => {
          console.error("Error:", error);
          this.updateChatText(chatbox);
          textField.value = "";
        });
    }
  
    onCleanButton(chatbox) {
      this.messages = [];
      this.updateChatText(chatbox);
    }
  
    updateChatText(chatbox) {
      var html = "";
      this.messages.slice().reverse().forEach(function (item, index) {
        if (item.name === "Sam") {
          html += '<div class="messages__item messages__item--visitor">' + item.message + "</div>";
        } else {
          html += '<div class="messages__item messages__item--operator">' + item.message + "</div>";
        }
      });
  
      const chatmessage = chatbox.querySelector(".chatbox__messages");
      chatmessage.innerHTML = html;
    }
  }
  
  const chatbox = new Chatbox();
  chatbox.display();
  