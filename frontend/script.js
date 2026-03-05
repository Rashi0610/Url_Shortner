async function shorten() {

    const url = document.getElementById("urlInput").value;

    const response = await fetch("http://localhost:3000/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
    });

    const data = await response.json();

    document.getElementById("shortUrl").value = data.shortUrl;

    const shortId = data.shortUrl.split("/").pop();

    document.getElementById("statsLink").href =
        `http://localhost:3000/stats/${shortId}`;

    // SHOW RESULT BOX
    document.getElementById("resultBox").classList.remove("hidden");
}


async function getStats(shortId){

  const res = await fetch(`http://localhost:3000/stats/${shortId}`);

  const data = await res.json();

  document.getElementById("stats").innerHTML =
    `Clicks: ${data.clicks}`;
}



function copyUrl(){

  const shortUrl = document.getElementById("shortUrl");

  navigator.clipboard.writeText(shortUrl.value);

  const toast = document.getElementById("toast");

  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },2000);
}