import json, os
labels=r'c:/Users/j/Desktop/git tutor/student_attendace_system/models/labels.json'
with open(labels,'r',encoding='utf-8') as f:
    lm=json.load(f)
print('labels.json raw:')
print(lm)
# normalize
id_to_name={}
for k,v in lm.items():
    if isinstance(v, dict): id_to_name[str(k)]=v.get('name') or v.get('id') or str(k)
    else: id_to_name[str(k)]=str(v)
print('\nnormalized id_to_name:')
print(id_to_name)
name_to_id={}
for k,v in id_to_name.items():
    name_to_id[v]=k
    name_to_id[v.replace(' ','_')]=k
    name_to_id[v.replace('_',' ')]=k
    name_to_id[v.lower()]=k
    name_to_id[v.lower().replace(' ','_')]=k
print('\nname_to_id keys:')
for k in name_to_id:
    print('-',k)
print('\ndataset folders:')
for d in os.listdir(r'c:/Users/j/Desktop/git tutor/student_attendace_system/dataset'):
    print('-',d)
