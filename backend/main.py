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
    university: str = Query(None, description="University filter"),
    language: str = Query(None, description="Language filter"),
    license: str = Query(None, description="License filter"),
    archived: int = Query(None, description="Archived filter (1 or 0)"),
    has_issues: int = Query(None, description="Has issues filter (1 or 0)"),
    has_projects: int = Query(None, description="Has projects filter (1 or 0)"),
    has_downloads: int = Query(None, description="Has downloads filter (1 or 0)"),
    has_wiki: int = Query(None, description="Has wiki filter (1 or 0)"),
    has_pages: int = Query(None, description="Has pages filter (1 or 0)"),
    has_discussions: int = Query(None, description="Has discussions filter (1 or 0)"),
    limit: int = Query(None, ge=1, le=100, description="Number of results to return"),
    offset: int = Query(None, ge=0, description="Number of results to skip"),
    session: Session = Depends(get_session)
):
    statement = select(Repository)
    if q:
        search = f"%{q.lower()}%"
        statement = statement.where(
            (Repository.name.ilike(search)) | (Repository.description.ilike(search))
        )
    if university:
        statement = statement.where(Repository.university.ilike(university))
    if language:
        statement = statement.where(Repository.language.ilike(language))
    if license:
        statement = statement.where(Repository.license.ilike(license))
    if archived is not None:
        statement = statement.where(Repository.archived == archived)
    if has_issues is not None:
        statement = statement.where(Repository.has_issues == has_issues)
    if has_projects is not None:
        statement = statement.where(Repository.has_projects == has_projects)
    if has_downloads is not None:
        statement = statement.where(Repository.has_downloads == has_downloads)
    if has_wiki is not None:
        statement = statement.where(Repository.has_wiki == has_wiki)
    if has_pages is not None:
        statement = statement.where(Repository.has_pages == has_pages)
    if has_discussions is not None:
        statement = statement.where(Repository.has_discussions == has_discussions)
    if limit:
        statement = statement.limit(limit)
    if offset:
        statement = statement.offset(offset)
    res = session.exec(statement)
    repos = res.all()
    return repos

