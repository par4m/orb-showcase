from typing import List
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select


from database import get_session
from models import Repository


app = FastAPI()


origins = ["http://localhost", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)



@app.get("/repositories", response_model=List[Repository])
def root( session: Session = Depends(get_session)):
    statement = select(Repository)
    res = session.exec(statement)
    repos = res.all()
    return repos

