import uvicorn

from app.internal.config import settings

def main(): 
  HOST = settings.HOST
  PORT = settings.PORT
  
  uvicorn.run("app.main:application", host=HOST, port=PORT, reload=True)


if __name__ == "__main__":
  main()