from typing import List
from fastapi import FastAPI, Depends, Query
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
def list_repositories(
    q: str = Query(None, description="Search term for name/description"),
    limit: int = Query(20, ge=1, le=100, description="Number of results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    session: Session = Depends(get_session)
):
    statement = select(Repository)
    if q:
        search = f"%{q.lower()}%"
        statement = statement.where(
            (Repository.name.ilike(search)) | (Repository.description.ilike(search))
        )
    statement = statement.offset(offset).limit(limit)
    res = session.exec(statement)
    repos = res.all()
    return repos

