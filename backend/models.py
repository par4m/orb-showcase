from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class Repository(SQLModel, table=True):
    __tablename__ = "combined_repositories_showcase"
    id: int | None = Field(default=None, primary_key=True)
    full_name: str
    description: str | None
    university: str | None
    license: str | None
    owner: str | None
    organization: int | None
    language: str | None
    stargazers_count: int | None
    html_url: str | None
    forks_count: int | None
    subscribers_count: float | None
    created_at: str | None
    contributors: str | None 
    homepage: str | None


class RepositoryResponse(BaseModel):
    id: int | None
    full_name: str
    description: str | None
    university: str | None
    license: str | None
    owner: str | None
    organization: int | None 
    language: str | None
    stargazers_count: int | None
    html_url: str | None
    forks_count: int | None
    subscribers_count: float | None
    created_at: str | None
    watchers_count: int | None = None
    contributors: int | None = None
    homepage: str | None