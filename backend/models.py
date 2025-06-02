from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class Repository(SQLModel, table=True):
    __tablename__ = "combined_repositories_showcase"
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None
    university:  str | None
    license: str | None
    owner: str | None
    language: str | None
    stargazers_count: int | None
    html_url: str | None
    forks: int | None
    created_at: str | None
    homepage: str | None
