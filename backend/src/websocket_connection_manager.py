import asyncio
import logging
from typing import Dict, List, Tuple, Union
from venv import logger

from fastapi import WebSocket, WebSocketDisconnect
import websockets
import websockets.protocol


class WebsocketManager:
    def __init__(
        self,
        active_connections: List[Tuple[WebSocket, str]] = [],
        active_connection_lock: asyncio.Lock = None,
    ) -> None:
        self.active_connections = active_connections
        self.active_connection_lock = active_connection_lock

    async def connect(self, websocket: WebSocket, client_id: str) -> None:
        await websocket.accept()
        async with self.active_connection_lock:
            self.active_connections.append((websocket, client_id))
            logging.info(
                f"New Connection: {client_id}, Total: {len(self.active_connections)}"
            )

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self.active_connection_lock:
            try:
                self.active_connections = [
                    conn for conn in self.active_connections if conn[0] != websocket
                ]
            except ValueError:
                logging.error("Error: WebSocket connection not found")

    async def disconnect_all(self):
        for connection, _ in self.active_connections[:]:
            await self.disconnect(connection)

    async def send_message(
        self, message: Union[Dict, str], websocket: WebSocket
    ) -> None:
        try:
            async with self.active_connection_lock:
                await websocket.send_json(message)
        except WebSocketDisconnect:
            logging.error("Error: Tried to send a message to a closed WebSocket")
            await self.disconnect(websocket)
        except websockets.exceptions.ConnectionClosedOK:
            logging.error("Error: WebSocket connection closed normally")
            await self.disconnect(websocket)
        except Exception as e:
            logger.error(f"Error in sending message: {str(e)}", message)
            await self.disconnect(websocket)

    async def get_input(
        self, prompt: Union[Dict, str], websocket: WebSocket, timeout: int = 60
    ) -> None:
        response = "Error: Unexpected response. \n TERMINATE"
        try:
            async with self.active_connection_lock:
                await websocket.send_json(prompt)
                result = await asyncio.wait_for(
                    websocket.receive_json(), timeout=timeout
                )
                data = result.get("data")
                if data:
                    response = data.get(
                        "content", "Error: Unexpected response format\nTERMINATE"
                    )
                else:
                    response = "Error: Unexpected response format\nTERMINATE"

        except asyncio.TimeoutError:
            response = f"The user was timed out after {timeout} seconds of inactivity.TERMINATE"  # noqa
        except WebSocketDisconnect:
            print("Error: Tried to send a message to a closed WebSocket")
            await self.disconnect(websocket)
            response = "The user was disconnected\nTERMINATE"
        except websockets.exceptions.ConnectionClosedOK:
            print("Error: WebSocket connection closed normally")
            await self.disconnect(websocket)
            response = "The user was disconnected\nTERMINATE"
        except Exception as e:
            print(f"Error in sending message: {str(e)}", prompt)
            await self.disconnect(websocket)
            response = f"Error: {e}\nTERMINATE"

        return response

    async def broadcast(self, message: Dict) -> None:
        message_dict = {"message": message}
        for connection, _ in self.active_connections[:]:
            try:
                if connection.client_state == websockets.protocol.State.OPEN:
                    await self.send_message(message_dict, connection)
                else:
                    logging.info("Error: WebSocket connection is closed")
                    await self.disconnect(connection)
            except (WebSocketDisconnect, websockets.exceptions.ConnectionClosedOK) as e:
                logging.error(f"Error: WebSocket disconnected or closed({str(e)})")
                await self.disconnect(connection)
