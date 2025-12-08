import csv
from collections import defaultdict
from pathlib import Path

csv_path = Path(r"c:/Users/j/Desktop/git tutor/student_attendace_system/diagnosis.csv")
label_names = {}
# We'll build simple metrics: overall accuracy, per-class precision/recall, confusion counts

confusion = defaultdict(lambda: defaultdict(int))
counts_true = defaultdict(int)
counts_pred = defaultdict(int)

total = 0
correct = 0

with csv_path.open(encoding='utf-8', newline='') as f:
    reader = csv.DictReader(f)
    for r in reader:
        true_id = (r.get('true_id') or '').strip()
        pred_id = (r.get('pred_id') or '').strip()
        # skip NO_FACE rows
        if true_id == 'NO_FACE' or true_id == '':
            continue
        total += 1
        if pred_id == '':
            # treat missing prediction as wrong
            pred_id = 'NONE'
        confusion[true_id][pred_id] += 1
        counts_true[true_id] += 1
        counts_pred[pred_id] += 1
        if pred_id == true_id:
            correct += 1

# Compute overall accuracy
accuracy = correct / total if total else 0.0

# Per-class precision / recall
per_class = {}
all_labels = sorted(set(list(counts_true.keys()) + list(counts_pred.keys())))
for lbl in all_labels:
    tp = confusion[lbl].get(lbl, 0)
    fn = sum(confusion[lbl].values()) - tp
    fp = sum(confusion[t][lbl] for t in confusion if t != lbl)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    per_class[lbl] = {'tp': tp, 'fn': fn, 'fp': fp, 'precision': precision, 'recall': recall, 'support': counts_true.get(lbl, 0)}

# Print summary
print('Total evaluated images (excluding NO_FACE):', total)
print('Correct predictions:', correct)
print('Overall accuracy: {:.2%}'.format(accuracy))
print('\nPer-class metrics:')
for lbl in all_labels:
    m = per_class[lbl]
    print(f"Label {lbl}: support={m['support']}, TP={m['tp']}, FP={m['fp']}, FN={m['fn']}, precision={m['precision']:.2%}, recall={m['recall']:.2%}")

# Print confusion table rows with non-zero counts
print('\nConfusion (true -> pred) non-zero entries:')
for t in sorted(confusion.keys()):
    for p, c in sorted(confusion[t].items(), key=lambda x: -x[1]):
        if c:
            print(f"{t} -> {p}: {c}")

# Save results
out = Path(r"c:/Users/j/Desktop/git tutor/student_attendace_system/accuracy_report.txt")
with out.open('w', encoding='utf-8') as fo:
    fo.write(f'Total evaluated images (excluding NO_FACE): {total}\n')
    fo.write(f'Correct predictions: {correct}\n')
    fo.write(f'Overall accuracy: {accuracy:.4f}\n\n')
    fo.write('Per-class metrics:\n')
    for lbl in all_labels:
        m = per_class[lbl]
        fo.write(f"{lbl}: support={m['support']}, TP={m['tp']}, FP={m['fp']}, FN={m['fn']}, precision={m['precision']:.4f}, recall={m['recall']:.4f}\n")
    fo.write('\nConfusion non-zero entries:\n')
    for t in sorted(confusion.keys()):
        for p, c in sorted(confusion[t].items(), key=lambda x: -x[1]):
            if c:
                fo.write(f"{t} -> {p}: {c}\n")

print('\nReport written to', out)
