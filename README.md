# UC ORB Showcase

## Overview

The University of California Open Source Repository Browser Showcase (UC ORB Showcase) enhances the discovery and visibility of open source projects across the UC system, making it easier for researchers, students, and external collaborators to engage with relevant projects. By mapping and classifying open source efforts, it highlights the impact of contributions from UC campuses, increasing recognition and potential funding opportunities.

### Running the Database Locally

Start PostgreSQL Container

````

```bash
docker run -d \
  --name orb-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=orb \
  -e POSTGRES_DB=sample \
  -p 5432:5432 \
  postgres:15
````

Load Schema and Dummy Data

```bash
cat db/sample.sql | docker exec -i orb-db psql -U postgres -d sample
```

Make sure backend/.env has the connection string

```bash
POSTGRES_DB_URL=postgresql://postgres:orb@localhost:5432/sample
```

```

```

```

```
