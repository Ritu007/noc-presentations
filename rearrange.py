# -*- coding: utf-8 -*-
import os

file_path = "index.html"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

progress_start = -1
content_start = -1
script_start = -1

for i, line in enumerate(lines):
    if '<div id="hub-progress"' in line:
        progress_start = i
    if '<div id="hub-content"' in line:
        content_start = i
    if '<script>' in line:
        script_start = i

print(f"progress_start: {progress_start}, content_start: {content_start}, script_start: {script_start}")

if progress_start != -1 and content_start != -1 and progress_start < content_start:
    part1 = lines[:progress_start]
    part_progress = lines[progress_start:content_start]
    part_content = lines[content_start:script_start]
    part_script = lines[script_start:]
    
    deck_insert = '''      <!-- DECK 0 - PROGRESS REPORT -->
      <div class="deck-block" style="grid-column: 1 / -1; --c: var(--col-cyan)">
        <a class="deck-hdr" href="javascript:void(0)" onclick="Hub.show(3)">
          <div class="deck-icon">&#128202;</div>
          <div class="deck-hdr-text">
            <div class="deck-name">QUARTERLY PROGRESS REPORT (APRIL 2026 - JULY 2026)</div>
          </div>
          <div class="deck-arrow">&rarr;</div>
        </a>
      </div>\n'''
    
    new_part_content = []
    for line in part_content:
        new_part_content.append(line)
        if '<div class="deck-grid">' in line:
            new_part_content.append(deck_insert)
            
    new_lines = part1 + new_part_content + part_progress + part_script
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Done swapping and inserting.")
else:
    print("Could not find sections in expected order.")
