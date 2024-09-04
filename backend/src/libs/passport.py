import base64
import binascii
import hashlib
import logging


def hash_password(password: str, salt: bytes):
    return binascii.hexlify(
        hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 10000)
    )


def verify_password(password: str, password_hashed_base64: bytes, salt: bytes):
    logging.info(
        base64.b64encode(hash_password(password, salt)).decode()
        + ":"
        + password_hashed_base64
    )

    logging.info(
        hash_password(password, salt) == base64.b64decode(password_hashed_base64)
    )

    return hash_password(password, salt) == base64.b64decode(password_hashed_base64)
