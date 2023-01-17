window.addEventListener("load", () => {
  fetchData(loadData);
  async function fetchData(load) {
    try {
      const response = await fetch("/api/get");
      const data = await response.json();
      load(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  function loadData(message) {
    for (let i of message) {
      const newDiv = document.createElement("div");
      const newH5 = document.createElement("h5");
      const newImg = document.createElement("img");
      newH5.textContent = i.message;
      newImg.src = i.URL;
      newImg.width = 300;
      newImg.classList.add("img-thumbnail", "mx-auto");
      newDiv.classList.add(
        "mt-3",
        "py-3",
        "container",
        "border",
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center"
      );
      newDiv.append(newH5, newImg);
      document.body.append(newDiv);
    }
  }
});

const button = document.querySelector(".btn");
button.addEventListener("click", () => {
  const textInput = document.querySelector("#inputText");
  const fileInput = document.querySelector("#uploadFile");
  const file = fileInput.files[0];

  render();
  function render() {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const photo = reader.result;
      const upload = async () => {
        try {
          const response = await fetch("/api/upload", {
            method: "post",
            body: JSON.stringify({
              text: textInput.value,
              image: photo,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
          if (response.status === 200) {
            const newDiv = document.createElement("div");
            const newH5 = document.createElement("h5");
            const newImg = document.createElement("img");
            newH5.textContent = textInput.value;
            newImg.src = photo;
            newImg.width = 500;
            newDiv.classList.add("mt-3", "py-3", "container", "border");
            newDiv.append(newH5, newImg);
            document.body.append(newDiv);
          } else {
            alert("上傳失敗");
          }
        } catch (error) {
          console.warn(error);
        }
      };
      upload();
    });

    reader.readAsDataURL(file);
  }
});
