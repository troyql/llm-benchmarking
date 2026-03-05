"""Factory functions for creating service instances."""
 
from aat_service.services.llm import LLMService
from aat_service.auth.token_managers import AuthServiceTokenManager

from app.internal.config import settings
 
def get_token_manager() -> AuthServiceTokenManager:
  """Return AuthServiceTokenManager for outbound calls."""
  return AuthServiceTokenManager(
    auth_service_url=settings.AUTH_SERVICE_URL,
    master_key=settings.SERVICE_MASTER_KEY,
    use_master_key_directly=True,
  )
 
def create_llm_service() -> LLMService:
  """Create a configured LLMService instance.

  Returns:
    Configured LLMService client.

  """
  return LLMService(
    base_url=settings.LLM_SERVICE_API_URL,
    token_manager=get_token_manager(),
  )