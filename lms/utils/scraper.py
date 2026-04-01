import requests
from bs4 import BeautifulSoup
import re

def scrape_w3schools_syllabus(url):
    """
    Scrapes the syllabus (Sections and Topics) from a W3Schools tutorial page.
    Expects a URL like https://www.w3schools.com/dsa/dsa_intro.php
    """
    if not url.startswith("https://www.w3schools.com/"):
        raise ValueError("Only W3Schools URLs are supported.")

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch URL: {str(e)}")

    soup = BeautifulSoup(response.text, "html.parser")
    
    # Target the sidebar element
    left_menu = soup.find("div", id="leftmenuinnerinner")
    if not left_menu:
        raise Exception("Could not find the sidebar structure on the page. W3Schools might have changed their layout.")

    syllabus = []
    current_section = None

    # Logic: <h2> tags are Sections, subsequent <a> tags are Topics
    # We iterate through the children of the left_menu
    for child in left_menu.find_all(['h2', 'a']):
        if child.name == 'h2':
            section_title = child.get_text(strip=True)
            if section_title:
                current_section = {
                    "title": section_title,
                    "topics": []
                }
                syllabus.append(current_section)
        elif child.name == 'a' and current_section is not None:
            # Filter out ads or empty links if necessary
            topic_title = child.get_text(strip=True)
            if topic_title and not child.get('id') == 'leftmenu_ad':
                current_section["topics"].append(topic_title)

    # Filtering empty sections or duplicate structure artifacts
    syllabus = [s for s in syllabus if s["topics"]]

    return syllabus
