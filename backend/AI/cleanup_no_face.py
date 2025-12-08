import csv
from pathlib import Path
import shutil

base = Path(r"c:/Users/j/Desktop/git tutor/student_attendace_system")
csv_path = base / "diagnosis.csv"
dataset_dir = base / "dataset"
removed_dir = dataset_dir / "_removed_no_face"
removed_dir.mkdir(parents=True, exist_ok=True)

moved = []

with csv_path.open(newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row.get('true_id', '').strip() == 'NO_FACE':
            src = dataset_dir / row['folder'] / row['image']
            if src.exists():
                dest = removed_dir / (row['folder'] + '_' + row['image'])
                shutil.move(str(src), str(dest))
                moved.append(str(dest))

log_path = removed_dir / 'moved_log.txt'
with log_path.open('w', encoding='utf-8') as lf:
    for p in moved:
        lf.write(p + '\n')

print('Moved count:', len(moved))
print('Log written to:', str(log_path))
