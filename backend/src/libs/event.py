from fastapi import Request


class EventLogger:
    def __init__(self, request: Request) -> None:
        self.request = request

    def get_client_ip(request: Request):
        x_forwarded_for = request.headers.get("X-Forwarded-For")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0]
        return request.client.host
