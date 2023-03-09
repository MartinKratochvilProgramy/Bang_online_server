import { rooms } from "../server";

export const getEmporioCard = (io: any, data: any) => {
    const roomName = data.currentRoom;
    const username = data.username;

    if (rooms[roomName].game === null) return;
    try {
        rooms[roomName].game!.getEmporioCard(data.username, data.card);
        // send emporio state to clients
        io.to(roomName).emit("emporio_state", { cards: rooms[roomName].game!.emporio, nextEmporioTurn: rooms[roomName].game!.nextEmporioTurn });

        const socketID = rooms[roomName].players.find(player => player.username === username)!.id;
        io.to(socketID).emit("my_hand", rooms[roomName].game!.getPlayerHand(username));
        io.to(roomName).emit("update_number_of_cards", {
            username: username,
            handSize: rooms[roomName].game!.getPlayerHand(username).length
        })

        if (rooms[roomName].game!.emporio.length === 0) {
            // activate current turn player's hand if emporio empty
            const currentPlayer = rooms[roomName].game!.getNameOfCurrentTurnPlayer();

            const currentPlayerID = rooms[roomName].players.find(player => player.username === currentPlayer)!.id;
            io.to(currentPlayerID).emit("my_hand", rooms[roomName].game!.getPlayerHand(currentPlayer));
        }
    } catch (error) {
        console.log(`Error in room ${roomName}:`);
        console.log(error);
    }

}