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

def find_broken_links(url):
    """
    Finds and reports broken links on a given URL using Selenium and requests.
    """

    options = webdriver.FirefoxOptions()
    options.add_argument('--ignore-ssl-errors=yes')
    options.add_argument('--ignore-certificate-errors')
    driver = webdriver.Firefox(
        options=options
    )
    driver.get(url)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "h1")))

    links = driver.find_elements(By.TAG_NAME, 'a')
    broken_links = []
    print (f"For URL {url}")
    for link in links:
        href = link.get_attribute('href')
        if "mailto:" == href[:7] or ("localhost" not in href and "github" not in href):
            continue
        print(href)
        if href:  # Ensure href attribute exists
            try:
                response = requests.get(href, timeout=5)
                if response.status_code >= 400:
                    broken_links.append((href, response.status_code))
            except requests.exceptions.RequestException as e:
                broken_links.append((href, f"Error: {e}"))

    driver.quit()

    
    if broken_links:
        print(f"Broken links found on {url}:")
        for link, status in broken_links:
            print(f"- {link} (Status: {status})")
    else:
        print(f"No broken links found on {url}.")

def test_all_repo_links():
    query = """
        SELECT id
        FROM  combined_repositories_showcase
    """
    result = db_conn(lambda conn: conn.execute(query).fetchall())
    for tuple in result:
        find_broken_links(f"http://localhost:3000/repositories/{tuple[0]}")

# Example usage:
# find_broken_links("http://localhost:3000/repositories/13")
test_all_repo_links()