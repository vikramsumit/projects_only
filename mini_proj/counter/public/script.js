fetch("/api/visitor-count")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("visitorCount").textContent = data.count;
  })
  .catch((err) => {
    document.getElementById("visitorCount").textContent = "Error";
    console.error(err);
  });
