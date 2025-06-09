
from sqlmodel import create_engine, Session, SQLModel

from keys import Keys



keys = Keys()



engine = create_engine(keys.POSTGRES_DB_URL, echo=True)


def get_session():
    with Session(autocommit=False, autoflush=False,bind=engine) as session:
        yield session

