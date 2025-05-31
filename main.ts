import { discord } from "@discord/embedded-app-sdk";
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

let socket;

window.addEventListener("DOMContentLoaded", async () => {
  await discord.ready();
  const user = await discord.commands.getCurrentUser({});
  const username = user.username;

  socket = io("https://the-hustle-server.onrender.com");

  socket.on("connect", () => {
    socket.emit("join", username);
  });

  socket.on("players_update", (players) => {
    console.log("Players in game:", players);
    document.getElementById("status")!.textContent =
      "Players: " + players.map(p => p.username).join(", ");
  });

  socket.on("card_played", (data) => {
    console.log(`${data.playerId} played card ${data.card}`);
  });

  document.getElementById("play")!.addEventListener("click", () => {
    socket.emit("play_card", "Ace of Spades");
  });
});