async function generateImage() {
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) {
    alert("Please enter a description.");
    return;
  }

  document.getElementById("status").innerText = "⏳ Generating image...";

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Token r8_ROXJUB1Tc9RtRm9ItmkEUhWhCdwlHpd2DETcb"
    },
    body: JSON.stringify({
      version: "db21e45a13b8c2df3f09c4d4fd6c09ed9322d44b979e6a532f347c2e1f1f4c6d",
      input: { prompt: prompt }
    })
  });

  const prediction = await response.json();
  let status = prediction.status;

  while (status !== "succeeded" && status !== "failed") {
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        "Authorization": "Token r8_ROXJUB1Tc9RtRm9ItmkEUhWhCdwlHpd2DETcb"
      }
    });
    const result = await poll.json();
    status = result.status;

    if (status === "succeeded") {
      const finalImage = result.output[0];
      document.getElementById("output").src = finalImage;
      document.getElementById("status").innerText = "✅ Image generated!";
    } else {
      document.getElementById("status").innerText = "⏳ Still generating...";
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  if (status === "failed") {
    document.getElementById("status").innerText = "❌ Failed to generate image.";
  }
}
