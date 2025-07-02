from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Column, ARRAY, String, JSON
from datetime import datetime
from typing import List

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
    created_at: datetime | None
    contributors: List[str] | None = Field(default=None, sa_column=Column(JSON))
    readme: str | None
    homepage: str | None
    default_branch: str | None


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
    created_at: datetime | None
    contributors: int | None = None
    readme: str | None
    homepage: str | None
    default_branch: str | None