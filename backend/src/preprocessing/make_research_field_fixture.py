#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Make a fixture file for research fields"""

import json
import copy


file = "/data/research_fields.json"
outfile = "./backend/src/emissions/fixtures/research_fields.json"

with open(file) as src:
    data = json.load(src)

items = []
item_template = {
    "model": "emissions.researchfield",
    "pk": None,
    "fields": {"field": None, "subfield": None},
}
pk = 1

for field in data.keys():
    print(field)
    for subfield in data[field]:
        print(subfield)
        new_item = copy.deepcopy(item_template)
        new_item["pk"] = pk
        new_item["fields"]["field"] = field
        new_item["fields"]["subfield"] = subfield
        items.append(new_item)
        pk += 1

with open(outfile, "w") as dst:
    json.dump(items, dst, indent=2)
