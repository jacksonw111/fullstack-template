# websockets


from fastapi import WebSocket, WebSocketDisconnect
from src.main import app
from src.websocket_connection_manager import WebsocketManager


async def process_socket_message(data: dict, websocket: WebSocket, client_id: str):
    pass


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await WebsocketManager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_json()
            await process_socket_message(data, websocket, client_id)
    except WebSocketDisconnect:
        print(f"Client #{client_id} is disconnected")
        await WebsocketManager.disconnect(websocket)
