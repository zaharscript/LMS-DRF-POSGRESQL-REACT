import re

def parse_raw_syllabus(text):
    """
    Parses raw text into a structure of Sections and Topics.
    Heuristics:
    - Lines starting with "Section", "Chapter", "Module", or "Part" are sections.
    - Lines that look like "1. Title" or "1: Title" might be sections or topics.
    - We look for common duration patterns (e.g., "5 min", "10:22") and strip them.
    - Empty lines are ignored.
    """
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    syllabus = []
    current_section = None

    # Headers that definitely indicate a section
    # NOTE: (?i) (ignore case flag) MUST BE AT THE VERY START of the regex string
    section_patterns = [
        r'(?i)^Section\s+\d+[:.]?\s*',
        r'(?i)^Chapter\s+\d+[:.]?\s*',
        r'(?i)^Module\s+\d+[:.]?\s*',
        r'(?i)^Part\s+\d+[:.]?\s*',
    ]

    # Patterns to strip from titles (durations, "Start" buttons, etc.)
    strip_patterns = [
        r'\d+\s+min\b',
        r'\d+:\d+',
        r'\(?\d+:\d+\)?',
        r'^Start$',
        r'^\d+\s*/\s*\d+\s*\|\s*.*$', # e.g. "1 / 4 | 12min"
    ]

    for line in lines:
        # Check if it's a section header
        is_section = False
        for pattern in section_patterns:
            if re.match(pattern, line):
                is_section = True
                # Clean the section title (remove "Section X: " prefix)
                clean_title = re.sub(pattern, '', line).strip()
                if not clean_title:
                    clean_title = line # Keep original if nothing left
                
                current_section = {"title": clean_title, "topics": []}
                syllabus.append(current_section)
                break
        
        if is_section:
            continue

        # If it's not a section, it's potentially a topic or metadata to strip
        is_metadata = False
        for pattern in strip_patterns:
            if re.search(pattern, line):
                # If the line IS just the metadata (like "05:12"), skip it
                if re.fullmatch(pattern, line):
                    is_metadata = True
                    break
        
        if is_metadata:
            continue

        # If we have a line that isn't a section and isn't bare metadata
        if current_section is None:
            current_section = {"title": "General", "topics": []}
            syllabus.append(current_section)
        
        # Clean topic title (remove prefixes like "1. ")
        clean_topic = re.sub(r'^\d+[\.:]\s*', '', line).strip()
        if clean_topic:
            current_section["topics"].append(clean_topic)

    # Final cleanup: remove duplicates and empty sections
    unique_syllabus = []
    seen_sections = {}

    for sec in syllabus:
        if not sec["topics"]:
            continue
        
        if sec["title"] in seen_sections:
            # Merge topics if section title is repeated
            idx = seen_sections[sec["title"]]
            # Add only unique topics
            existing_topics = set(unique_syllabus[idx]["topics"])
            for t in sec["topics"]:
                if t not in existing_topics:
                    unique_syllabus[idx]["topics"].append(t)
                    existing_topics.add(t)
        else:
            seen_sections[sec["title"]] = len(unique_syllabus)
            unique_syllabus.append(sec)

    return unique_syllabus
