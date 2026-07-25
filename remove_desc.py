import os
import re

files_to_process = [
    "verification-presentation/index.html",
    "sdlc-presentation/index.html",
    "presentation/index.html",
    "pcie-presentation/index.html",
    "hardware-presentation/index.html"
]

for filepath in files_to_process:
    full_path = os.path.join(r"e:\CDAC\NOC\ACR Meeting\noc-presentations", filepath)
    if not os.path.exists(full_path):
        print(f"Skipping {filepath}, not found")
        continue

    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the position of "Other Presentations"
    split_marker = '<div class="landing-divider">Other Presentations</div>'
    if split_marker not in content:
        print(f"Marker not found in {filepath}")
        continue

    parts = content.split(split_marker)
    first_part = parts[0]
    second_part = parts[1]

    # In the second part, remove all <div class="landing-card-desc">...</div>
    # Using regex, non-greedy match till </div>
    new_second_part = re.sub(r'<div class="landing-card-desc">.*?</div>', '', second_part, flags=re.DOTALL)

    # Some lines might have left empty spaces. Let's do a simple cleanup of lines with only spaces.
    new_second_part_cleaned = "\n".join([line for line in new_second_part.split("\n") if line.strip() != ""])

    new_content = first_part + split_marker + "\n" + new_second_part_cleaned

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Processed {filepath}")
