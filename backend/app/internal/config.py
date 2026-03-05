"""Configuration module for FastAPI application. Copied from the bm-file-broker.

Loads environment variables
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
  """Application settings loaded from environment variables.

  This class provides configuration for server, service, JWT authentication,
  default system/room, pagination, performance, and development options.
  Values are loaded from environment variables with sensible defaults.
  """

  def __init__(self) -> None:
    """Initialize settings and load configuration from environment."""
    # Server Configuration
    self.HOST: str = os.getenv("HOST", "127.0.0.1")  # Default to localhost for development
    self.PORT: int = int(os.getenv("PORT", "8000"))
    self.FRONTEND_PORT: int = int(os.getenv("FRONTEND_PORT", "5173"))

    # LLM Config
    self.LLM_SERVICE_API_URL: str = os.getenv("LLM_SERVICE_API_URL", "http://my-dev.hub24.ai")
    self.AUTH_SERVICE_URL: str = os.getenv("AUTH_SERVICE_URL", "http://my-dev.hub24.ai")
    self.SERVICE_MASTER_KEY: str = os.getenv("SERVICE_MASTER_KEY")

    # Model 
    self.MODEL: str = os.getenv("MODEL", "openai/gpt-oss-20b")

    # Github PAT
    self.TOKEN: str = os.getenv("TOKEN")



settings = Settings()