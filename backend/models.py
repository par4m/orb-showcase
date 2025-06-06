from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class Repository(SQLModel, table=True):
    __tablename__ = "combined_repositories_showcase"
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str | None
    university: str | None
    license: str | None
    owner: str | None
    language: str | None
    stargazers_count: int | None
    html_url: str | None
    forks: int | None
    forks_count: int | None
    open_issues_count: int | None
    archived: int | None
    has_issues: int | None
    has_projects: int | None
    has_downloads: int | None
    has_wiki: int | None
    has_pages: int | None
    has_discussions: int | None
    subscribers_count: float | None
    created_at: str | None
    watchers_count: int | None = None
    contributors: str | None 
    updated_at: str | None 
    homepage: str | None


class RepositoryResponse(BaseModel):
    id: int | None
    name: str
    description: str | None
    university: str | None
    license: str | None
    owner: str | None
    language: str | None
    stargazers_count: int | None
    html_url: str | None
    forks: int | None
    forks_count: int | None
    open_issues_count: int | None
    archived: int | None
    has_issues: int | None
    has_projects: int | None
    has_downloads: int | None
    has_wiki: int | None
    has_pages: int | None
    has_discussions: int | None
    subscribers_count: float | None
    created_at: str | None
    watchers_count: int | None = None
    contributors: list[str] | None = None
    updated_at: str | None
    homepage: str | None