from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from datetime import datetime

app = FastAPI()

class FuelSale(BaseModel):
    fuel_type: str 
    amount: float

@app.post("/sell")
def sell_fuel(sale: FuelSale):
    try:
        with open("warehouse.json", "r", encoding="utf8") as file:
            fuels = json.load(file)
            
        if sale.fuel_type not in fuels:
            raise HTTPException(status_code=400, detail="Invalid fuel type")
            
        if sale.amount > fuels[sale.fuel_type]["amount"]:
            raise HTTPException(status_code=400, 
                detail=f"Not enough fuel. Remaining: {fuels[sale.fuel_type]['amount']} liters")
            
        fuels[sale.fuel_type]["amount"] -= sale.amount
        unit_price = fuels[sale.fuel_type]["price"]
        income = unit_price * sale.amount
        
        sale_record = {
            "fuel": sale.fuel_type,
            "amount": sale.amount,
            "unit_price": unit_price,
            "income": income,
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Update warehouse stock
        with open("warehouse.json", "w", encoding="utf8") as file:
            json.dump(fuels, file, ensure_ascii=False, indent=4)
            
        # Log the sale
        try:
            with open("sales_log.json", "r", encoding="utf8") as log_file:
                sales_log = json.load(log_file)
        except FileNotFoundError:
            sales_log = []
            
        sales_log.append(sale_record)
        
        with open("sales_log.json", "w", encoding="utf8") as log_file:
            json.dump(sales_log, log_file, ensure_ascii=False, indent=4)
            
        return {
            "message": f"{sale.amount} liters of {sale.fuel_type} sold",
            "income": income,
            "remaining_amount": fuels[sale.fuel_type]["amount"]
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sales/summary")
def get_sales_summary():
    try:
        with open("sales_log.json", "r", encoding="utf8") as log_file:
            sales_log = json.load(log_file)
            
        if not sales_log:
            return {"message": "No sales recorded yet"}
            
        summary = {}
        for sale in sales_log:
            fuel = sale["fuel"]
            if fuel not in summary:
                summary[fuel] = {
                    "total_amount": 0,
                    "total_income": 0,
                    "transactions": 0
                }
            summary[fuel]["total_amount"] += sale["amount"]
            summary[fuel]["total_income"] += sale["income"]
            summary[fuel]["transactions"] += 1
            
        return summary
        
    except FileNotFoundError:
        return {"message": "No sales log found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
