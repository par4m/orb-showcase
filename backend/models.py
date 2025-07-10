from pydantic import BaseModel
from sqlmodel import SQLModel, Field, Column, ARRAY, String, JSON
from typing import List

class Repository(SQLModel, table=True):
    __tablename__ = "showcase_view"
    id: str | None = Field(default=None, primary_key=True)
    full_name: str
    description: str | None
    short_description: str | None
    university: str | None
    license: str | None
    owner: str | None
    organization: str | None
    language: str | None
    stargazers_count: str | None
    html_url: str | None
    forks_count: str | None
    subscribers_count: str | None
    created_at: str | None
    readme: str | None
    homepage: str | None
    default_branch: str | None
    approved: bool | None
    topic_area_ai: str | None


class RepositoryResponse(BaseModel):
    id: str | None
    full_name: str
    description: str | None
    university: str | None
    license: str | None
    owner: str | None
    organization: str | None 
    language: str | None
    stargazers_count: str | None
    html_url: str | None
    forks_count: str | None
    subscribers_count: str | None
    created_at: str | None
    readme: str | None
    homepage: str | None
    default_branch: str | None
    topic_area_ai: str | None