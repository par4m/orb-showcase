import psycopg
import requests
import os

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv

def db_conn(query_exec):
    load_dotenv()
    with psycopg.connect(os.environ['POSTGRES_DB_URL']) as conn:
        return query_exec(conn)

def getWebDriver():
    options = webdriver.FirefoxOptions()
    options.add_argument('--ignore-ssl-errors=yes')
    options.add_argument('--ignore-certificate-errors')
    return webdriver.Firefox(
        options=options
    )

def find_broken_links(url):
    load_dotenv()
    """
    Finds and reports broken links on a given URL using Selenium and requests.
    """
    driver = getWebDriver()
    driver.get(url)
    print (f"For URL {url}")

    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

    links = driver.find_elements(By.TAG_NAME, 'a')
    broken_links = get_broken_links(links)
    
    driver.quit()
    
    if broken_links == []:
        print(f"No malformed frontend or broken github links found\n")
        return
    print(f"Broken links found on {url}:")
    for link, status in broken_links:
        print(f"- {link} (Status: {status})")
    print()

def get_broken_links(links):
    base_url = os.environ["FRONTEND_URL"]
    valid_frontend_urls = list(map(
        lambda path: f"{base_url}/{path}",
        ["repositories", "about", "connect", ""]
    ))
    broken_links = []
    for link in links:
        href = link.get_attribute('href')
        if not href or "mailto:" == href[:7] or (base_url not in href and "github.com" not in href):
            continue
        if base_url in href and href not in valid_frontend_urls:
            broken_links.append((href, f"Error: It is a malformed URL"))
            continue
        try:
            response = requests.get(href, timeout=5)
            if response.status_code >= 400:
                broken_links.append((href, response.status_code))
        except requests.exceptions.RequestException as e:
            broken_links.append((href, f"Error: {e}"))
    return broken_links

def test_all_repo_links():
    load_dotenv()
    query = """
        SELECT id
        FROM  combined_repositories_showcase
    """
    result = db_conn(lambda conn: conn.execute(query).fetchall())
    for tuple in result:
        find_broken_links(f"{os.environ['FRONTEND_URL']}/repositories/{tuple[0]}")

# Example usage:
# find_broken_links("http://localhost:3000/repositories/13")
test_all_repo_links()