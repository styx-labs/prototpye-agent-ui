from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, engine
import models
import json
from agents.run_search_chain import RunSearchChain

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobDescription(BaseModel):
    description: str
    num_candidates: int


def analyze_job_description(description: str, num: int) -> str:
    result = RunSearchChain.run_search(description, str(num))
    
    while result and not result.startswith('{'):
        result = result[1:]
        
    while result and not result.endswith('}'):
        result = result[:-1]
        
    return result

@app.post("/analyze")
def create_analysis(job: JobDescription, db: Session = Depends(get_db)):
    result = analyze_job_description(job.description, job.num_candidates)
    db_analysis = models.JobAnalysis(description=job.description, result=result)
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

@app.get("/analyses")
def get_analyses(db: Session = Depends(get_db)):
    analyses = db.query(models.JobAnalysis).all()
    return [{"id": analysis.id, "description": analysis.description, "result": json.loads(analysis.result)} for analysis in analyses]