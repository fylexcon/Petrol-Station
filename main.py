from fastapi import FastAPI
from pydantic import BaseModel
import json
import os
from datetime import datetime
from typing import List
from collections import defaultdict
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATA_FILE = "data.json"


class Fuel(BaseModel):
    name: str
    amount: float

class RefillRequest(BaseModel):
    name: str
    amount: float

default_data = {
    "gasoline": {"amount": 50, "price": 48},
    "diesel": {"amount": 50, "price": 44},
    "lpg": {"amount": 50, "price": 25},
    "income": 0
}


if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump(default_data, f)


with open(DATA_FILE, "r") as f:
    fuels = json.load(f)


if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)




from fastapi import HTTPException

@app.post("/sales")
def make_sale(fuel: Fuel):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    fuels_data = data.get("fuels", {})
    sales_history = data.setdefault("sales_history", [])

    if fuel.name not in fuels_data:
        raise HTTPException(status_code=404, detail="Fuel not found")
    
    if "meta" not in data:
        data["meta"] = {"sales_requests": 0, "refill_requests": 0}

    if fuels_data[fuel.name]["amount"] < fuel.amount:
        raise HTTPException(status_code=400, detail="Not enough fuel available")

    sale_income = fuel.amount * fuels_data[fuel.name]["price"]
    fuels_data[fuel.name]["amount"] -= fuel.amount
    data["income"] += sale_income

    existing_ids = [entry.get("request_id", 0) for entry in data["sales_history"] if "request_id" in entry]
    request_id = max(existing_ids, default=0) + 1
    timestamp = datetime.now().isoformat()

    sale_entry = {
        "request_id": request_id,
        "name": fuel.name,
        "amount": fuel.amount,
        "income": sale_income,
        "timestamp": timestamp
    }

    sales_history.append(sale_entry)
    data["meta"]["sales_requests"] += 1

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    return {"status": "success", "income": sale_income, "request_id": request_id}


@app.post("/refill")
def refill_fuels(refills: List[RefillRequest]):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "refill_history" not in data:
        data["refill_history"] = []

    if "meta" not in data:
        data["meta"] = {"sales_requests": 0, "refill_requests": 0}
    
    existing_ids = [entry.get("request_id", 0) for entry in data["refill_history"] if "request_id" in entry]
    request_id = max(existing_ids, default=0) + 1
    updated = []
    timestamp = datetime.now().isoformat()

    for refill in refills:
        if refill.name not in data["fuels"]:
            continue

        data["fuels"][refill.name]["amount"] += refill.amount

        refill_entry = {
            "fuel": refill.name,
            "amount": refill.amount,
            "timestamp": timestamp,
            "request_id": request_id
        }

        data["refill_history"].append(refill_entry)
        updated.append(refill_entry)


    data["meta"]["refill_requests"] += 1


    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    return {"message": "Refill complete", "updated": updated}




@app.post("/sale")
def record_sale(sale: dict):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "sales_history" not in data:
        data["sales_history"] = []

    if "meta" not in data:
        data["meta"] = {"sales_requests": 0, "refill_requests": 0}  

    existing_ids = [entry.get("request_id", 0) for entry in data["sales_history"] if "request_id" in entry]
    request_id = max(existing_ids, default=0) + 1
    timestamp = datetime.now().isoformat()

    sale_entry = {
        "request_id": request_id,
        "name": sale.get("name", ""),
        "amount": sale.get("amount", 0),
        "income": sale.get("income", 0),
        "timestamp": timestamp
    }

    data["sales_history"].append(sale_entry)
    data["meta"]["sales_requests"] += 1

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    return {"status": "success", "request_id": request_id}


@app.get("/fuels")
def get_fuels():
    return fuels



@app.get("/sales/request/{request_id}")
def get_sales_request(request_id: int):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    sales = data.get("sales_history", [])
    filtered = [entry for entry in sales if entry.get("request_id") == request_id]

    if not filtered:
        return {"message": f"No sales found for request {request_id}"}

    return {"sales": filtered}

@app.get("/refills/request/{request_id}")
def get_refill_request(request_id: int):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    refills = data.get("refill_history", [])
    filtered = [entry for entry in refills if entry.get("request_id") == request_id]

    if not filtered:
        return {"message": f"No refills found for request {request_id}"}

    return {"refills": filtered}

@app.get("/history_counts")
def get_history_count():
    with open(DATA_FILE,"r",encoding="utf8")as f:
        data=json.load(f)
    
    sales_count=len(data.get("sales_history", []))
    refill_count=len(data.get("refill_history", []))

    return {
    "total_sales": sales_count,
    "total_refills": refill_count
    }

@app.get("/income")
def get_income():
    with open(DATA_FILE,"r", encoding="utf8") as f:
        data=json.load(f)
    return{"income": data["income"]}



@app.get("/refills")
def get_refills():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["refill_history"]


@app.get("/sales")
def get_sales():
    with open(DATA_FILE, "r",encoding="utf8") as f:
        data= json.load(f)
    return {"sales_history": data.get("sales_history",[])}



@app.get("/full_history")
def full_history():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    sales = data.get("sales_history", [])
    refills = data.get("refill_history", [])

    
    sales_grouped = defaultdict(list)
    for entry in sales:
        request_id = entry.get("request_id")
        if request_id is not None:
            sales_grouped[request_id].append(entry)

    
    refill_grouped = defaultdict(list)
    for entry in refills:
        request_id = entry.get("request_id")
        if request_id is not None:
            refill_grouped[request_id].append(entry)

    
    timeline = []

    for entry in sales:
        if "timestamp" in entry:
            timeline.append({
                "type": "sale",
                **entry
            })

    for entry in refills:
        if "timestamp" in entry:
            timeline.append({
                "type": "refill",
                **entry
            })

    
    timeline.sort(key=lambda x: x.get("timestamp"))

    return {
        "grouped_sales": dict(sales_grouped),
        "grouped_refills": dict(refill_grouped),
        "timeline": timeline
    }

@app.get("/sales/total")
def get_total_sales():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {"total": data.get("meta", {}).get("sales_requests", 0)}


@app.get("/refills/total")
def get_total_refills():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {"total_refills": data.get("meta", {}).get("refill_requests", 0)}

@app.get("/requests/total")
def get_total_requests():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    total = (
        data.get("meta", {}).get("sales_requests", 0) +
        data.get("meta", {}).get("refill_requests", 0),
        (f'{data.get("meta", {}).get("sales_requests", 0)} sale requests and '
          +  f'{data.get("meta", {}).get("refill_requests", 0)} refill requests')
    )
    return {"total": total}

@app.get("/income/total")
def get_total_income():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {"total": data.get("income", 0)}



